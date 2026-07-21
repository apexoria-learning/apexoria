from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import re
import time
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
from io import BytesIO
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="Apexoria Learning API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# ---------------------------------------------------------------------------
# Google Form integration — the sole lead store (no MongoDB fallback).
# Set GOOGLE_FORM_ACTION_URL and the entry.* field IDs in backend/.env
# If GF POST fails, the endpoint returns HTTP 502 and the frontend's WhatsApp
# CTA (in LeadForm.jsx) becomes the recovery path.
# ---------------------------------------------------------------------------
GOOGLE_FORM_ACTION_URL = os.environ.get('GOOGLE_FORM_ACTION_URL', '').strip()
GF_ENTRY_NAME = os.environ.get('GF_ENTRY_NAME', '').strip()
GF_ENTRY_PHONE = os.environ.get('GF_ENTRY_PHONE', '').strip()
GF_ENTRY_EMAIL = os.environ.get('GF_ENTRY_EMAIL', '').strip()
GF_ENTRY_COURSE = os.environ.get('GF_ENTRY_COURSE', '').strip()
GF_ENTRY_BATCH = os.environ.get('GF_ENTRY_BATCH', '').strip()
GF_ENTRY_MESSAGE = os.environ.get('GF_ENTRY_MESSAGE', '').strip()

# Map free-text course/batch values to the exact Google Form choice options.
GF_COURSE_OPTIONS = [
    "Salesforce Foundation", "Salesforce Crashcourse", "Salesforce Complete Course",
    "Special Offer", "Salesforce QA Testing Course", "Not Sure Yet",
]


def map_course_to_gf(value: str) -> str:
    v = (value or "").lower()
    if "foundation" in v:
        return "Salesforce Foundation"
    if "crash" in v:
        return "Salesforce Crashcourse"
    if "complete" in v:
        return "Salesforce Complete Course"
    if "special" in v:
        return "Special Offer"
    if "qa" in v:
        return "Salesforce QA Testing Course"
    return "Not Sure Yet"


def map_batch_to_gf(value: str) -> str:
    v = (value or "").lower()
    if "weekend" in v:
        return "Weekend"
    if "weekday" in v:
        return "Weekday"
    return ""

PHONE_RE = re.compile(r'^(?:\+?91[\-\s]?)?[6-9]\d{9}$')
EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

# --- Bot / abuse protection (best-effort, in-memory) ---
MIN_FILL_MS = 2000          # submissions faster than 2s are treated as bots
IP_THROTTLE_SECONDS = 12    # min seconds between submissions from the same IP
_last_submit_by_ip: dict = {}


def _client_ip(request: Request) -> str:
    fwd = request.headers.get('x-forwarded-for')
    if fwd:
        return fwd.split(',')[0].strip()
    return request.client.host if request.client else 'unknown'


# ------------------------------- Models ------------------------------------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    phone: str
    email: str
    course_interest: Optional[str] = ""
    preferred_batch: Optional[str] = ""
    message: Optional[str] = ""
    forwarded_to_google_form: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    full_name: str
    phone: str
    email: str
    course_interest: Optional[str] = ""
    preferred_batch: Optional[str] = ""
    message: Optional[str] = ""
    # Honeypot field — must remain empty (spam bots fill it)
    company_website: Optional[str] = ""
    # Time (ms) the user spent on the form before submitting (bot time-trap)
    elapsed_ms: Optional[int] = None

    @field_validator('full_name')
    @classmethod
    def name_required(cls, v):
        if not v or not v.strip():
            raise ValueError('Full name is required')
        return v.strip()

    @field_validator('phone')
    @classmethod
    def phone_valid(cls, v):
        cleaned = (v or '').replace(' ', '').replace('-', '')
        if not PHONE_RE.match(cleaned):
            raise ValueError('Enter a valid Indian phone number')
        return cleaned

    @field_validator('email')
    @classmethod
    def email_valid(cls, v):
        if not EMAIL_RE.match((v or '').strip()):
            raise ValueError('Enter a valid email address')
        return v.strip().lower()


async def forward_to_google_form(lead: Lead) -> bool:
    """Forward the lead to a Google Form if configured. Returns success flag."""
    if not GOOGLE_FORM_ACTION_URL:
        return False
    payload = {}
    if GF_ENTRY_NAME:
        payload[GF_ENTRY_NAME] = lead.full_name
    if GF_ENTRY_PHONE:
        payload[GF_ENTRY_PHONE] = lead.phone
    if GF_ENTRY_EMAIL:
        payload[GF_ENTRY_EMAIL] = lead.email
    if GF_ENTRY_COURSE:
        payload[GF_ENTRY_COURSE] = map_course_to_gf(lead.course_interest)
    if GF_ENTRY_BATCH:
        batch = map_batch_to_gf(lead.preferred_batch)
        if batch:
            payload[GF_ENTRY_BATCH] = batch
    if GF_ENTRY_MESSAGE:
        payload[GF_ENTRY_MESSAGE] = lead.message
    try:
        async with httpx.AsyncClient(timeout=10) as hc:
            resp = await hc.post(GOOGLE_FORM_ACTION_URL, data=payload)
            return resp.status_code in (200, 302)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Google Form forward failed: {e}")
        return False


# ------------------------------- Routes ------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Apexoria Learning API is running"}


@api_router.get("/config")
async def get_config():
    """Expose whether Google Form forwarding is active (for admin/debug)."""
    return {"google_form_enabled": bool(GOOGLE_FORM_ACTION_URL)}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate, request: Request):
    dummy = Lead(full_name="spam", phone="0000000000", email="spam@spam.com")

    # 1) Honeypot: silently accept but drop bot submissions
    if payload.company_website:
        logger.info("Honeypot triggered — dropping spam lead")
        return dummy

    # 2) Time-trap: forms filled unrealistically fast are almost always bots
    if payload.elapsed_ms is not None and payload.elapsed_ms < MIN_FILL_MS:
        logger.info(f"Time-trap triggered ({payload.elapsed_ms}ms) — dropping spam lead")
        return dummy

    # 3) Per-IP throttle to block automated rapid inserts
    ip = _client_ip(request)
    now = time.monotonic()
    last = _last_submit_by_ip.get(ip)
    if last is not None and (now - last) < IP_THROTTLE_SECONDS:
        raise HTTPException(status_code=429, detail="Please wait a few seconds before submitting again.")
    _last_submit_by_ip[ip] = now

    lead = Lead(
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        course_interest=payload.course_interest or "",
        preferred_batch=payload.preferred_batch or "",
        message=payload.message or "",
    )

    forwarded = await forward_to_google_form(lead)
    lead.forwarded_to_google_form = forwarded

    if not forwarded:
        raise HTTPException(
            status_code=502,
            detail="Lead delivery failed. Please reach us on WhatsApp."
        )

    logger.info(f"New lead: {lead.full_name} ({lead.email}) forwarded={forwarded}")
    return lead


NAVY = colors.HexColor("#0A1F44")
BLUE = colors.HexColor("#1E90FF")
GOLD = colors.HexColor("#F5B400")
ORANGE = colors.HexColor("#F4622A")
GREEN = colors.HexColor("#2E7D32")


def _build_brochure() -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    def cover():
        c.setFillColor(NAVY)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, H - 8 * mm, W, 8 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 40)
        c.drawString(20 * mm, H - 70 * mm, "APEXORIA")
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(20 * mm, H - 82 * mm, "LEARNING")
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(20 * mm, H - 110 * mm, "Master Salesforce Development")
        c.setFont("Helvetica", 13)
        c.setFillColor(colors.HexColor("#B9C4D6"))
        c.drawString(20 * mm, H - 122 * mm, "Live online cohorts \u00b7 Apex \u00b7 LWC \u00b7 Integrations \u00b7 Admin \u00b7 QA")
        c.drawString(20 * mm, H - 130 * mm, "Job-ready in 3 months with guaranteed placement support.")
        c.setFillColor(ORANGE)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(20 * mm, 30 * mm, "Call / WhatsApp: +91 7498490687")
        c.setFillColor(colors.HexColor("#B9C4D6"))
        c.setFont("Helvetica", 11)
        c.drawString(20 * mm, 22 * mm, "Instagram: @apexoria_learning")
        c.showPage()

    def paths_page():
        c.setFillColor(colors.white)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(20 * mm, H - 30 * mm, "Learning Paths")
        y = H - 45 * mm
        paths = [
            ("Salesforce Foundation", "Beginner \u00b7 Rs 1,999 \u00b7 5 hrs/week", BLUE,
             "Salesforce basics, objects & relationships, reports, intro to automation & security."),
            ("Salesforce Crash Course", "Intermediate \u00b7 Rs 9,999 \u00b7 22 hrs/month", GOLD,
             "Foundation + Apex fundamentals, triggers, SOQL, intro to LWC, guided assignment."),
            ("Salesforce Complete Course", "Advanced \u00b7 Rs 21,999 \u00b7 70 hrs / 3 months", GREEN,
             "Full Admin + Development, advanced Apex, LWC in depth, REST/SOAP integrations, capstone + placement."),
            ("Special Offer", "Any level \u00b7 Rs 4,999", ORANGE,
             "Start now, pay the rest once you're confident. Flexible access to course content."),
        ]
        for title, meta, col, desc in paths:
            c.setFillColor(col)
            c.rect(20 * mm, y - 2 * mm, 6 * mm, 6 * mm, fill=1, stroke=0)
            c.setFillColor(NAVY)
            c.setFont("Helvetica-Bold", 15)
            c.drawString(30 * mm, y, title)
            c.setFillColor(colors.HexColor("#556080"))
            c.setFont("Helvetica-Bold", 10)
            c.drawString(30 * mm, y - 6 * mm, meta)
            c.setFillColor(colors.HexColor("#333333"))
            c.setFont("Helvetica", 10)
            c.drawString(30 * mm, y - 13 * mm, desc[:95])
            y -= 32 * mm
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(20 * mm, 25 * mm, "Enroll today \u2014 +91 7498490687")
        c.showPage()

    cover()
    paths_page()
    c.save()
    buf.seek(0)
    return buf.read()


@api_router.get("/brochure")
async def download_brochure():
    pdf = _build_brochure()
    return StreamingResponse(
        BytesIO(pdf),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Apexoria-Learning-Brochure.pdf"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
