"""Apexoria Learning backend API test suite.

Covers:
- /api/leads POST (valid, invalid phone, invalid email, honeypot)
- /api/leads GET (persistence verification)
- /api/brochure (PDF download)
- /api/config (google_form_enabled flag)
"""
import os
import io
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fallback: read from frontend/.env
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().strip('"').rstrip('/')
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------------- /api/config ----------------------
class TestConfig:
    def test_config_returns_google_form_flag(self, api_client):
        r = api_client.get(f"{API}/config", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "google_form_enabled" in data
        assert data["google_form_enabled"] is False


# ---------------------- /api/leads ----------------------
class TestLeadsCRUD:
    def _unique_name(self):
        return f"TEST_User_{uuid.uuid4().hex[:8]}"

    def test_create_lead_valid_and_persist(self, api_client):
        name = self._unique_name()
        payload = {
            "full_name": name,
            "phone": "9876543210",
            "email": f"{name.lower()}@example.com",
            "course_interest": "Salesforce Complete Course",
            "preferred_batch": "Weekend",
            "message": "Testing lead creation",
        }
        r = api_client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["full_name"] == name
        assert data["phone"] == "9876543210"
        assert data["email"] == payload["email"].lower()
        assert data["course_interest"] == payload["course_interest"]
        assert data["preferred_batch"] == "Weekend"
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        assert data.get("forwarded_to_google_form") is False

        # Verify persistence via GET
        r2 = api_client.get(f"{API}/leads", timeout=15)
        assert r2.status_code == 200
        leads = r2.json()
        assert isinstance(leads, list)
        matching = [l for l in leads if l.get("full_name") == name]
        assert len(matching) == 1
        assert matching[0]["email"] == payload["email"].lower()

    def test_create_lead_with_plus91_prefix(self, api_client):
        name = self._unique_name()
        payload = {
            "full_name": name,
            "phone": "+919876543210",
            "email": f"{name.lower()}@example.com",
            "course_interest": "Salesforce Foundation",
        }
        r = api_client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        # phone gets cleaned but +91 prefix retained
        assert "9876543210" in data["phone"]

    def test_create_lead_invalid_phone(self, api_client):
        name = self._unique_name()
        payload = {
            "full_name": name,
            "phone": "12345",
            "email": f"{name.lower()}@example.com",
            "course_interest": "Foundation",
        }
        r = api_client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_create_lead_invalid_email(self, api_client):
        name = self._unique_name()
        payload = {
            "full_name": name,
            "phone": "9876543210",
            "email": "not-an-email",
            "course_interest": "Foundation",
        }
        r = api_client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_honeypot_silently_drops_spam(self, api_client):
        # Count leads before
        r_before = api_client.get(f"{API}/leads", timeout=15)
        assert r_before.status_code == 200
        count_before = len(r_before.json())

        spam_name = f"TEST_SpamBot_{uuid.uuid4().hex[:8]}"
        payload = {
            "full_name": spam_name,
            "phone": "9876543210",
            "email": f"{spam_name.lower()}@example.com",
            "course_interest": "Foundation",
            "company_website": "http://spam-bot.example.com",
        }
        r = api_client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        # Should return dummy spam lead, not the real one
        assert data.get("full_name") == "spam"

        # Verify GET /api/leads did NOT get a new real lead
        r_after = api_client.get(f"{API}/leads", timeout=15)
        assert r_after.status_code == 200
        leads_after = r_after.json()
        assert len(leads_after) == count_before, \
            f"Honeypot should not increase lead count. before={count_before} after={len(leads_after)}"
        assert not any(l.get("full_name") == spam_name for l in leads_after)


# ---------------------- /api/brochure ----------------------
class TestBrochure:
    def test_brochure_pdf_download(self, api_client):
        r = api_client.get(f"{API}/brochure", timeout=30)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").lower().startswith("application/pdf")
        cd = r.headers.get("content-disposition", "")
        assert "attachment" in cd.lower()
        assert "Apexoria-Learning-Brochure.pdf" in cd
        # Validate PDF header magic bytes
        assert r.content[:4] == b"%PDF"
        assert len(r.content) > 1000  # non-trivial PDF
