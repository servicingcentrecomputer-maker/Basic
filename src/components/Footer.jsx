import { Link } from "react-router-dom";
import { useSiteContent } from "../content/SiteContentContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const { content } = useSiteContent();
  const { profile, availability } = content;
  const phoneHref = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;
  const dotClass = availability.available
    ? "status-dot"
    : "status-dot status-dot--closed";

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-mark">
                {profile.initials}
              </span>
              <span>{profile.name}</span>
            </Link>
            <p>{profile.description}</p>
            <p className="availability">
              <span className={dotClass} aria-hidden="true" />
              {availability.footer}
            </p>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Get in touch</h3>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <a href={phoneHref}>{profile.phoneDisplay}</a>
              </li>
              <li>
                <p>
                  {profile.location}
                  <br />
                  {profile.working}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Designed &amp; built by hand.</p>
        </div>
      </div>
    </footer>
  );
}
