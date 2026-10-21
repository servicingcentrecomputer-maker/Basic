import Reveal from "./Reveal.jsx";

export default function WorkCard({ project, index }) {
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <Reveal
      as="figure"
      className={`work-card work-card--${project.layout ?? "wide"}`}
      delay={(index % 3) * 60}
    >
      <div className="work-media">
        <img
          src={project.image}
          alt={project.alt}
          width="800"
          height="520"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="work-meta">
        <div>
          <h3 className="work-title">
            {project.url ? (
              <a href={project.url} rel="noopener noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="work-tags">{project.tags.join(" · ")}</p>
        </div>
        <span className="work-index" aria-hidden="true">
          {indexLabel}
        </span>
      </figcaption>
    </Reveal>
  );
}

