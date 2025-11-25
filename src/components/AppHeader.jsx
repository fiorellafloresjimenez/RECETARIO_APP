import { useEffect, useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../store/authContext";

const Icon = {
  Home: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path d="M3 10.5 12 3l9 7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Heart: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 20c2-4 6-6 8-6s6 2 8 6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Info: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 8h.01M11 12h2v6h-2z" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Admin: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path
        d="M12 2 6.5 5v6c0 4 2.5 7.5 5.5 9 3-1.5 5.5-5 5.5-9V5L12 2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Tool: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path d="M3 7l5 5-2 2-5-5zM14 4l6 6-8 8H6v-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { role } = useContext(AuthContext) || {};

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) => `nav-btn${isActive ? " active" : ""}`;

  const navItems = [
    { path: "/", label: "Inicio", icon: Icon.Home, end: true },
    { path: "/favoritos", label: "Favoritos", icon: Icon.Heart },
    { path: "/cuenta", label: "Cuenta", icon: Icon.User },
    { path: "/acerca", label: "Acerca", icon: Icon.Info },
  ];

  if (String(role).toLowerCase() === "admin") {
    navItems.push({
      path: "/admin/recetas",
      label: "Administración",
      icon: Icon.Admin,
    });
  }

  return (
    <header className="appbar" role="banner">
      <div className="appbar-inner">
        <Link to="/" className="brand" aria-label="Super Recetario - Inicio">
          <span className="brand-title">SUPER · RECETARIO</span>
        </Link>


        <nav className="nav nav-desktop" aria-label="Principal">
          {navItems.map(({ path, label, icon: IconCmp, end }) => (
            <NavLink key={path} to={path} end={end} className={linkClass}>
              {IconCmp && <IconCmp />} {label}
            </NavLink>
          ))}
        </nav>


        <button
          className="hamburger"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>


      {open && (
        <div
          id="mobile-nav"
          className="nav-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div className="nav-mobile-inner">
            {navItems.map(({ path, label }) => (
              <NavLink key={path} to={path} className={linkClass} end={path === "/"}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
