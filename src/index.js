import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import "@/index.css";
import App from "@/App";
import ScrollToHashHandler from "@/components/ScrollToHashHandler";

// Lazy-load the admin bundle so the marketing site stays small.
const AdminApp = lazy(() => import("@/admin/AdminApp"));
const CoursesPage = lazy(() => import("@/pages/CoursesPage"));

// Lazy-load legal pages — small, not on the critical path.
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center text-sm text-slate-500 bg-slate-50">
      Loading CMS…
    </div>
  );
}

function PageLoader() {
  return <div className="min-h-screen w-full bg-white" />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter>
          {/* Global cross-route hash scroll — must live above <Routes> so it
              survives route changes (e.g. Pricing 'Learn More' navigating
              from / to /courses#course-crash-course). If nested inside a
              single route's component tree it unmounts on route change and
              the hash-scroll never fires on the destination route. */}
          <ScrollToHashHandler />
          <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route
            path="/courses"
            element={
              <Suspense fallback={<PageLoader />}>
                <CoursesPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={null}>
                <Privacy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={null}>
                <Terms />
              </Suspense>
            }
          />
          <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </QueryClientProvider>
  </React.StrictMode>,
);
