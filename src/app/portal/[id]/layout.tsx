import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal — Skyfynd',
  description: 'Review your quote, sign the agreement, and complete your deposit.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Portal Header */}
      <header className="border-b border-white/[0.06] bg-[#111113]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <img
            src="https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png"
            alt="Skyfynd"
            className="h-7 sm:h-8 w-auto"
          />
          <span className="text-[#FAFAFA] text-lg font-semibold" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}>Client Portal</span>
        </div>
      </header>

      {/* Portal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-white/[0.06] mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
          <p className="text-[#52525B] text-xs">
            Skyfynd LLC &mdash; Software for Businesses
          </p>
        </div>
      </footer>
    </div>
  );
}
