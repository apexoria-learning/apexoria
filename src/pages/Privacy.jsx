import { Suspense, lazy } from "react";
import Navbar from "@/components/site/Navbar";
import LegalDoc from "@/components/site/LegalDoc";
import { LEGAL_PAGES } from "@/data";

const Footer = lazy(() => import("@/components/site/Footer"));

export default function Privacy() {
  const doc = LEGAL_PAGES?.privacy || {};
  return (
    <div className="App font-body">
      <Navbar />
      <LegalDoc
        testId="privacy-page"
        title={doc.title || "Privacy Policy"}
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
