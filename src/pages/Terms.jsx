import { Suspense, lazy } from "react";
import Navbar from "@/components/site/Navbar";
import LegalDoc from "@/components/site/LegalDoc";
import { LEGAL_PAGES } from "@/data";

const Footer = lazy(() => import("@/components/site/Footer"));

export default function Terms() {
  const doc = LEGAL_PAGES?.terms || {};
  return (
    <div className="App font-body">
      <Navbar />
      <LegalDoc
        testId="terms-page"
        title={doc.title || "Terms of Service"}
        metaDescription={doc.metaDescription}
        lastUpdated={doc.lastUpdated}
        contentMd={doc.contentMd}
      />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
