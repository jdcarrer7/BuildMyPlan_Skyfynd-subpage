"use client";

import React, { useState, useEffect } from 'react';

// Base URL for the main Skyfynd site
const SKYFYND_BASE_URL = "http://localhost:5176";

// Hook to detect viewport type
const useViewport = () => {
  const [viewport, setViewport] = useState({ isMobile: false, isTablet: false });

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setViewport({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1280,
      });
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return viewport;
};

// Footer link component
const FooterLink = ({ href, children, isMobile, isTablet }: {
  href: string;
  children: React.ReactNode;
  isMobile: boolean;
  isTablet: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        fontSize: isMobile ? '16px' : isTablet ? '17px' : '14px',
        color: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.6)',
        textDecoration: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        position: 'relative',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isMobile, isTablet } = useViewport();

  const footerLinks = {
    services: [
      { name: 'Websites', path: `${SKYFYND_BASE_URL}/websites` },
      { name: 'Marketing', path: `${SKYFYND_BASE_URL}/marketing` },
      { name: 'Branding', path: `${SKYFYND_BASE_URL}/branding` },
      { name: 'Content', path: `${SKYFYND_BASE_URL}/content` },
    ],
    company: [
      { name: 'About', path: `${SKYFYND_BASE_URL}/about` },
      { name: 'Projects', path: `${SKYFYND_BASE_URL}/projects` },
      { name: 'Contact', path: `${SKYFYND_BASE_URL}/contact` },
    ],
    legal: [
      { name: 'Privacy', path: `${SKYFYND_BASE_URL}/privacy` },
      { name: 'Terms', path: `${SKYFYND_BASE_URL}/terms` },
    ],
  };

  return (
    <footer style={{
      ...styles.footer,
      paddingTop: isMobile ? '40px' : '80px',
      paddingBottom: isMobile ? '24px' : '40px',
    }}>
      {/* Decorative gradient orbs */}
      <div style={styles.gradientOrb1} />
      <div style={styles.gradientOrb2} />

      {/* Top accent line with gradient */}
      <div style={styles.accentLine} />

      <div style={{
        ...styles.container,
        padding: isMobile ? '0 16px' : '0 24px',
      }}>
        {/* Main content grid */}
        <div style={{
          ...styles.mainGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '32px' : '80px',
          marginBottom: isMobile ? '32px' : '60px',
        }}>
          {/* Brand section with glassmorphic card */}
          <div style={{
            ...styles.brandCard,
            maxWidth: isMobile ? '100%' : '380px',
            order: isMobile ? 1 : 1,
          }}>
            <div style={{
              ...styles.brandCardInner,
              padding: isMobile ? '20px' : '32px',
            }}>
              <div style={styles.logoWrapper}>
                <div style={styles.logoGlow} />
                <div style={styles.logoIcon}>
                  <img
                    alt="Skyfynd logo"
                    src="https://media-skyfynd.jdcarrero7.workers.dev/Skyfynd+Landing+Page/Skyfynd+Logo/Skyfynd+logo.png"
                    style={{
                      width: isMobile ? '29px' : '35px',
                      height: isMobile ? '29px' : '35px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <span style={{
                  ...styles.logoText,
                  fontSize: isMobile ? '18px' : isTablet ? '26px' : '22px',
                }}>Skyfynd</span>
              </div>
              <p style={{
                ...styles.tagline,
                fontSize: isMobile ? '16px' : isTablet ? '17px' : '14px',
                marginBottom: isMobile ? '16px' : '24px',
              }}>
                We help businesses clarify their direction, design their presence, and build the systems that keep the work running.
              </p>

              {/* Social icons */}
              <div style={styles.socialRow}>
                <a href="#" style={{
                  ...styles.socialIcon,
                  width: isMobile ? '32px' : '36px',
                  height: isMobile ? '32px' : '36px',
                }} aria-label="LinkedIn">
                  <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" style={{
                  ...styles.socialIcon,
                  width: isMobile ? '32px' : '36px',
                  height: isMobile ? '32px' : '36px',
                }} aria-label="Twitter">
                  <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" style={{
                  ...styles.socialIcon,
                  width: isMobile ? '32px' : '36px',
                  height: isMobile ? '32px' : '36px',
                }} aria-label="Instagram">
                  <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div style={{
            ...styles.linksContainer,
            gap: isMobile ? '32px' : '60px',
            justifyContent: isMobile ? 'center' : 'flex-end',
            flexWrap: isMobile ? 'nowrap' : 'nowrap',
            order: isMobile ? 2 : 2,
            width: isMobile ? '100%' : 'auto',
          }}>
            <div style={{
              ...styles.linkColumn,
              alignItems: 'flex-start',
            }}>
              <h4 style={{
                ...styles.columnTitle,
                fontSize: isMobile ? '14px' : isTablet ? '16px' : '13px',
              }}>
                <span style={styles.columnTitleAccent} />
                Services
              </h4>
              <div style={{
                ...styles.linksList,
                gap: isMobile ? '8px' : '12px',
                alignItems: 'flex-start',
              }}>
                {footerLinks.services.map((link) => (
                  <FooterLink key={link.path} href={link.path} isMobile={isMobile} isTablet={isTablet}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div style={{
              ...styles.linkColumn,
              alignItems: 'flex-start',
            }}>
              <h4 style={{
                ...styles.columnTitle,
                fontSize: isMobile ? '14px' : isTablet ? '16px' : '13px',
              }}>
                <span style={{...styles.columnTitleAccent, background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)'}} />
                Company
              </h4>
              <div style={{
                ...styles.linksList,
                gap: isMobile ? '8px' : '12px',
                alignItems: 'flex-start',
              }}>
                {footerLinks.company.map((link) => (
                  <FooterLink key={link.path} href={link.path} isMobile={isMobile} isTablet={isTablet}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div style={{
              ...styles.linkColumn,
              alignItems: 'flex-start',
            }}>
              <h4 style={{
                ...styles.columnTitle,
                fontSize: isMobile ? '14px' : isTablet ? '16px' : '13px',
              }}>
                <span style={{...styles.columnTitleAccent, background: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)'}} />
                Legal
              </h4>
              <div style={{
                ...styles.linksList,
                gap: isMobile ? '8px' : '12px',
                alignItems: 'flex-start',
              }}>
                {footerLinks.legal.map((link) => (
                  <FooterLink key={link.path} href={link.path} isMobile={isMobile} isTablet={isTablet}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={styles.bottomSection}>
          <div style={styles.bottomDivider} />
          <div style={{
            ...styles.bottomContent,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '4px' : '0',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <p style={{
              ...styles.copyright,
              fontSize: isMobile ? '11px' : isTablet ? '16px' : '13px',
            }}>
              © {currentYear} Skyfynd. All rights reserved.
            </p>
            <p style={{
              ...styles.madeWith,
              fontSize: isMobile ? '11px' : isTablet ? '16px' : '13px',
            }}>
              Crafted with precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    position: 'relative',
    background: 'linear-gradient(180deg, #0A0A0B 0%, #0a0a0f 100%)',
    paddingTop: '80px',
    paddingBottom: '40px',
    overflow: 'hidden',
  },
  gradientOrb1: {
    position: 'absolute',
    top: '20%',
    left: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: '10%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(60px)',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    maxWidth: '600px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.5) 20%, rgba(59, 130, 246, 0.5) 50%, rgba(16, 185, 129, 0.5) 80%, transparent 100%)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    marginBottom: '60px',
  },
  brandCard: {
    position: 'relative',
    padding: '2px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(16, 185, 129, 0.2) 100%)',
    maxWidth: '380px',
  },
  brandCardInner: {
    background: 'rgba(15, 15, 20, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '18px',
    padding: '32px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    left: '-10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '60px',
    height: '60px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
    filter: 'blur(15px)',
    pointerEvents: 'none',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#FAFAFA',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    letterSpacing: '-0.02em',
  },
  tagline: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: '0 0 24px 0',
  },
  socialRow: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  linksContainer: {
    display: 'flex',
    gap: '60px',
    justifyContent: 'flex-end',
    paddingTop: '8px',
  },
  linkColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  columnTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#FAFAFA',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  columnTitleAccent: {
    width: '3px',
    height: '14px',
    borderRadius: '2px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #10B981 100%)',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bottomSection: {
    position: 'relative',
  },
  bottomDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 20%, rgba(255, 255, 255, 0.08) 80%, transparent 100%)',
    marginBottom: '24px',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
  },
  madeWith: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    fontStyle: 'italic',
  },
};
