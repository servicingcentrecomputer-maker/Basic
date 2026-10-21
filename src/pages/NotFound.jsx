import Button from "../components/Button.jsx";
import PageHero from "../components/PageHero.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export default function NotFound() {
  usePageMeta({
    title: "Page not found — Jordan Ellis",
    description: "The page you were looking for doesn't exist. Head back to the portfolio home page.",
  });

  return (
    <>
      <PageHero
        eyebrow="404 — page not found"
        title={
          <>
            This page took a <em className="accent">wrong turn.</em>
          </>
        }
        lead="The link may be old, or the page may have moved. Let's get you back to something useful."
      />
      <section className="section section--tight">
        <div className="container">
          <Button to="/">Back to the home page</Button>
        </div>
      </section>
    </>
  );
}
