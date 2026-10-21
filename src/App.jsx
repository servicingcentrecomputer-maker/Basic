import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { SiteContentProvider } from "./content/SiteContentContext.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Services from "./pages/Services.jsx";

function ScrollManager() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const changedRoute = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;

    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      }, 320);
      return () => window.clearTimeout(timer);
    }

    if (changedRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [location.hash, location.pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isInitialRoute = location.key === "default";

  return (
    <SiteContentProvider>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" className="site-main" tabIndex={-1}>
        <div
          key={location.pathname}
          className={`route-view${isInitialRoute ? " route-view--initial" : ""}`}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </SiteContentProvider>
  );
}
