"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Base URL for the main Skyfynd site
const SKYFYND_BASE_URL = "https://www.skyfynd.io";

// Custom hook to detect window width
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1400);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

// Custom hook for scroll direction detection
function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      if (currentScrollY < 100) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
}

// Company logo component
function Company({ size = 48, textSize = 20 }: { size?: number; textSize?: number }) {
  return (
    <a href={SKYFYND_BASE_URL} style={companyStyles.link}>
      <div style={{ ...companyStyles.logoWrapper, width: size, height: size }}>
        <img
          alt="Skyfynd logo"
          style={companyStyles.logo}
          src="https://i.imgur.com/JDBBgAT.png"
        />
      </div>
      <div style={companyStyles.textWrapper}>
        <p style={{ ...companyStyles.text, fontSize: textSize }}>
          Skyfynd
        </p>
      </div>
    </a>
  );
}

const companyStyles: Record<string, React.CSSProperties> = {
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    flexShrink: 0,
    textDecoration: 'none',
  },
  logoWrapper: {
    position: 'relative',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 9999,
  },
  logo: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    maxWidth: 'none',
    objectFit: 'cover',
    pointerEvents: 'none',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    lineHeight: 0,
    fontStyle: 'normal',
    position: 'relative',
    flexShrink: 0,
    color: '#FAFAFA',
    letterSpacing: '-0.5px',
  },
  text: {
    lineHeight: 1.4,
    fontWeight: 600,
    margin: 0,
  },
};

// Nav link component
function NavLink({ text, to, fontSize = 16, isExternal = false, isActive = false }: {
  text: string;
  to: string;
  fontSize?: number;
  isExternal?: boolean;
  isActive?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '12px',
    background: isActive
      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.15))'
      : isHovered
        ? 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))'
        : 'transparent',
    border: isActive
      ? '1px solid rgba(139, 92, 246, 0.4)'
      : isHovered
        ? '1px solid rgba(255,255,255,0.15)'
        : '1px solid transparent',
    WebkitFontSmoothing: 'antialiased',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    fontSize,
    color: isActive ? '#A78BFA' : (isHovered ? '#FAFAFA' : 'rgba(250,250,250,0.8)'),
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)'
      : 'none',
    overflow: 'hidden',
  };

  const innerContent = (
    <>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.5s ease',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={to}
        style={linkStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <Link
      href={to}
      style={linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {innerContent}
    </Link>
  );
}

// Contact button component
function ContactButton({ size = 'default' }: { size?: 'default' | 'tablet' | 'mobile' }) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    default: { padding: '12px 24px', fontSize: 16, iconSize: 20, gap: 10 },
    tablet: { padding: '11px 20px', fontSize: 17, iconSize: 18, gap: 9 },
    mobile: { padding: '10px 16px', fontSize: 14, iconSize: 16, gap: 8 },
  };

  const s = sizes[size] || sizes.default;

  return (
    <>
      <style>{`
        @keyframes contactPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(236, 72, 153, 0.3);
          }
        }
        @keyframes navShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <a
        href={`${SKYFYND_BASE_URL}/contact`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s.gap,
          padding: s.padding,
          borderRadius: '14px',
          background: isHovered
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(236, 72, 153, 0.25))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))',
          border: isHovered
            ? '1px solid rgba(167, 139, 250, 0.6)'
            : '1px solid rgba(139, 92, 246, 0.3)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontWeight: 600,
          fontSize: s.fontSize,
          color: isHovered ? '#FAFAFA' : 'rgba(250, 250, 250, 0.9)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)'
            : '0 4px 16px rgba(139, 92, 246, 0.2)',
          animation: 'contactPulse 3s ease-in-out infinite',
          overflow: 'hidden',
          textDecoration: 'none',
        }}
      >
        {/* Shimmer effect */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.6s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Gradient border glow */}
        <span
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 15,
            background: 'linear-gradient(135deg, #A78BFA, #EC4899, #F59E0B, #A78BFA)',
            backgroundSize: '300% 300%',
            animation: isHovered ? 'navShimmer 2s ease infinite' : 'none',
            opacity: isHovered ? 0.6 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
            filter: 'blur(2px)',
          }}
        />

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: s.iconSize,
            height: s.iconSize,
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'rotate(12deg)' : 'rotate(0deg)',
          }}
        >
          <svg width={s.iconSize} height={s.iconSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <span style={{ position: 'relative', zIndex: 1 }}>Contact</span>
      </a>
    </>
  );
}

// Desktop navigation
function DesktopNav() {
  return (
    <>
      <nav style={navStyles.desktop}>
        <NavLink text="Projects" to={`${SKYFYND_BASE_URL}/projects`} fontSize={16} isExternal />
        <NavLink text="Services" to={`${SKYFYND_BASE_URL}/websites`} fontSize={16} isExternal />
        <NavLink text="Plans" to="/" fontSize={16} isActive />
        <NavLink text="About" to={`${SKYFYND_BASE_URL}/about`} fontSize={16} isExternal />
      </nav>
      <div style={navStyles.contactWrapper}>
        <ContactButton size="default" />
      </div>
    </>
  );
}

// Tablet navigation
function TabletNav() {
  return (
    <>
      <nav style={navStyles.tablet}>
        <NavLink text="Projects" to={`${SKYFYND_BASE_URL}/projects`} fontSize={20} isExternal />
        <NavLink text="Services" to={`${SKYFYND_BASE_URL}/websites`} fontSize={20} isExternal />
        <NavLink text="Plans" to="/" fontSize={20} isActive />
        <NavLink text="About" to={`${SKYFYND_BASE_URL}/about`} fontSize={20} isExternal />
      </nav>
      <div style={navStyles.contactWrapperTablet}>
        <ContactButton size="tablet" />
      </div>
    </>
  );
}

const navStyles: Record<string, React.CSSProperties> = {
  desktop: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    flexShrink: 0,
    zIndex: 100,
  },
  tablet: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
  },
  contactWrapper: {
    position: 'absolute',
    right: 32,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
  },
  contactWrapperTablet: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
  },
};

// Mobile menu component
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { t: "Projects", to: `${SKYFYND_BASE_URL}/projects`, isExternal: true },
    { t: "Services", to: `${SKYFYND_BASE_URL}/websites`, isExternal: true },
    { t: "Plans", to: "/", isActive: true },
    { t: "About", to: `${SKYFYND_BASE_URL}/about`, isExternal: true },
    { t: "Contact", to: `${SKYFYND_BASE_URL}/contact`, isExternal: true, isContact: true },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          background: isOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
          border: isOpen ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
          borderRadius: 10,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          {isOpen ? (
            <path d="M6 6L18 18M6 18L18 6" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div style={mobileMenuStyles.dropdown}>
          <div style={mobileMenuStyles.overlay1} />
          <div style={mobileMenuStyles.overlay2} />
          <div style={{ position: 'relative', padding: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
            {menuItems.map((item) => {
              const isActive = item.isActive;

              if (item.isContact) {
                return (
                  <div key={item.t} style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <a
                      href={item.to}
                      onClick={() => setIsOpen(false)}
                      style={{
                        ...mobileMenuStyles.link,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 10,
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1))',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.t}
                    </a>
                  </div>
                );
              }

              return (
                <a
                  key={item.t}
                  href={item.to}
                  onClick={() => setIsOpen(false)}
                  style={{
                    ...mobileMenuStyles.link,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    color: isActive ? '#A78BFA' : 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                  }}
                >
                  {item.t}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

const mobileMenuStyles: Record<string, React.CSSProperties> = {
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: '280px',
    borderRadius: '16px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  overlay1: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 10, 11, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
  },
  overlay2: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
    borderRadius: '16px',
  },
  link: {
    display: 'block',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    marginBottom: '4px',
    background: 'transparent',
    border: '1px solid transparent',
    width: '100%',
    textAlign: 'left',
  },
};

// NavBarShell - Glass effect container matching main site
function NavBarShell({ children, width }: { children: React.ReactNode; width: string }) {
  return (
    <div style={{ ...navBarShellStyles.container, width }}>
      {/* Main nav bar glass */}
      <div style={navBarShellStyles.glass}>
        {/* Iridescent wash background */}
        <div style={navBarShellStyles.wash} />
        {/* Glass highlight */}
        <div style={navBarShellStyles.highlight} />
        {/* Noise texture */}
        <div style={navBarShellStyles.noise} />
      </div>

      {/* Inner content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

const navBarShellStyles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    margin: '0 auto',
  },
  glass: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: '20px',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(10, 10, 11, 0.85)',
  },
  wash: {
    position: 'absolute',
    inset: '-30%',
    background: `
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1), transparent 55%),
      radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.08), transparent 55%),
      radial-gradient(circle at 70% 85%, rgba(250, 204, 21, 0.05), transparent 60%)
    `,
    filter: 'blur(22px)',
    pointerEvents: 'none',
  },
  highlight: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent 50%)',
    pointerEvents: 'none',
  },
  noise: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
    backgroundSize: '3px 3px',
    opacity: 0.06,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
  },
};

// Header styles
const headerStyles: Record<string, React.CSSProperties> = {
  desktop: {
    width: '100%',
    padding: '20px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },
  desktopInner: {
    display: 'flex',
    height: 70,
    alignItems: 'center',
    padding: '0 32px',
    width: '100%',
    position: 'relative',
  },
  tablet: {
    width: '100%',
    padding: '16px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },
  tabletInner: {
    display: 'flex',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },
  mobile: {
    width: '100%',
    padding: '12px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },
  mobileInner: {
    display: 'flex',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
};

// Main Header component
export default function Header() {
  const width = useWindowWidth();
  const isVisible = useScrollDirection();

  const isDesktop = width >= 1280;
  const isTablet = width >= 768 && width < 1280;
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <header style={{
        ...headerStyles.mobile,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
      }}>
        <NavBarShell width="min(calc(100% - 32px), 430px)">
          <div style={headerStyles.mobileInner}>
            <Company size={36} textSize={20} />
            <nav style={{ display: 'flex', alignItems: 'center', zIndex: 10 }}>
              <MobileMenu />
            </nav>
          </div>
        </NavBarShell>
      </header>
    );
  }

  if (isTablet) {
    return (
      <header style={{
        ...headerStyles.tablet,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
      }}>
        <NavBarShell width="min(95%, 900px)">
          <div style={headerStyles.tabletInner}>
            <Company size={44} textSize={20} />
            <TabletNav />
          </div>
        </NavBarShell>
      </header>
    );
  }

  return (
    <header style={{
      ...headerStyles.desktop,
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      opacity: isVisible ? 1 : 0,
    }}>
      <NavBarShell width="1200px">
        <div style={headerStyles.desktopInner}>
          <Company size={48} textSize={20} />
          <DesktopNav />
        </div>
      </NavBarShell>
    </header>
  );
}
