import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal — SkyFynd',
  description: 'Review your quote, sign the agreement, and complete your deposit.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Portal Header */}
      <header className="border-b border-white/[0.06] bg-[#111113]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <img
            src="https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png"
            alt="SkyFynd"
            className="h-8 w-auto"
          />
          <span className="text-[#71717A] text-sm font-medium">Client Portal</span>
        </div>
      </header>

      {/* Portal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-white/[0.06] mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-[#52525B] text-xs">
            Skyfynd LLC &mdash; Software for Businesses
          </p>
        </div>
      </footer>
    </div>
  );
}
