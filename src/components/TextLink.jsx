import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "./Icons.jsx";

export default function TextLink({ to, href, children, className = "" }) {
  const classes = ["text-link", className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      <ArrowUpRightIcon />
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <a className={classes} href={href}>
      {content}
    </a>
  );
}
