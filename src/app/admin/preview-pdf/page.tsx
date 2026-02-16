'use client';

import { useState } from 'react';
import { generateSignedAgreementPDF } from '@/lib/portal/generate-signed-pdf';
import type { QuoteJSON } from '@/lib/types/admin';

// Dummy signature — simple SVG drawn as a data URL
const DUMMY_SIGNATURE =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
      <path d="M30 110 Q80 30 150 80 T280 60 T370 90" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`
  );

const sampleQuote: QuoteJSON = {
  qrNumber: 'QR-2025-0042',
  customerId: 'cust_sample',
  submittedAt: new Date().toISOString(),
  source: 'preview',
  customer: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    company: 'Acme Corp',
    phone: '(555) 123-4567',
    notes: 'Client prefers modern, minimalist aesthetic. Rush delivery requested for website launch.',
  },
  services: [
    {
      serviceType: 'websites' as never,
      serviceLabel: 'Website Development',
      oneTimeTotal: 4500,
      monthlyTotal: 150,
      hasCustomQuote: false,
      steps: [
        { stepName: 'Tier', selectedLabel: 'Pro', selectedId: 'pro', priceImpact: 3000, isRecurring: false },
        { stepName: 'Pages', selectedLabel: '8-12 Pages', selectedId: 'pages-8', priceImpact: 800, isRecurring: false },
        { stepName: 'CMS Integration', selectedLabel: 'WordPress', selectedId: 'wp', priceImpact: 500, isRecurring: false },
        { stepName: 'Hosting', selectedLabel: 'Managed Hosting', selectedId: 'hosting', priceImpact: 150, isRecurring: true },
        { stepName: 'SEO Package', selectedLabel: 'Basic SEO', selectedId: 'seo-basic', priceImpact: 200, isRecurring: false },
      ],
    },
    {
      serviceType: 'branding' as never,
      serviceLabel: 'Visual Identity Design',
      oneTimeTotal: 2200,
      monthlyTotal: 0,
      hasCustomQuote: false,
      steps: [
        { stepName: 'Tier', selectedLabel: 'Pro', selectedId: 'pro', priceImpact: 1500, isRecurring: false },
        {
          stepName: 'Deliverables',
          selectedLabel: '',
          selectedId: null,
          priceImpact: null,
          children: [
            { stepName: 'Logo Design', selectedLabel: 'Custom', selectedId: 'custom', priceImpact: 400, isRecurring: false },
            { stepName: 'Color Palette', selectedLabel: 'Extended', selectedId: 'ext', priceImpact: 150, isRecurring: false },
            { stepName: 'Typography', selectedLabel: 'Custom Font Pairing', selectedId: 'custom-font', priceImpact: 150, isRecurring: false },
          ],
        },
      ],
    },
    {
      serviceType: 'social-media' as never,
      serviceLabel: 'Social Media Management',
      oneTimeTotal: 500,
      monthlyTotal: 800,
      hasCustomQuote: false,
      steps: [
        { stepName: 'Tier', selectedLabel: 'Essential', selectedId: 'essential', priceImpact: 500, isRecurring: false },
        { stepName: 'Platforms', selectedLabel: 'Instagram + TikTok', selectedId: 'ig-tt', priceImpact: 800, isRecurring: true },
        { stepName: 'Content Calendar', selectedLabel: 'Included', selectedId: 'yes', priceImpact: 0, isRecurring: false },
      ],
    },
  ],
  totals: {
    oneTimeTotal: 7200,
    monthlyTotal: 950,
    hasCustomQuote: false,
    discountPercentage: 10,
    grandTotal: 6480,
  },
  discounts: {
    serviceDiscounts: [],
    quoteDiscount: { type: 'percentage', value: 10, appliesTo: 'one-time' },
    totalSaved: 720,
  },
  rawPayload: {},
};

export default function PreviewPDFPage() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateSignedAgreementPDF({
        portal: {
          qr_number: 'QR-2025-0042',
          client_name: 'Jane Doe',
          client_email: 'jane@example.com',
          quote_data: sampleQuote,
        },
        signature: {
          signature_data_url: DUMMY_SIGNATURE,
          signed_at: new Date().toISOString(),
        },
        payment: {
          amount: 648000,
          paid_at: new Date().toISOString(),
          confirmation_id: 'pi_3SAMPLE123456',
        },
      });
    } catch (err) {
      console.error('Preview PDF error:', err);
    }
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold text-white">PDF Preview</h1>
        <p className="text-[#A1A1AA] text-sm max-w-md">
          Generates a sample Signed Agreement PDF with dummy data (3 services, discount, payment confirmation, and quote summary).
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
        >
          {generating ? 'Generating...' : 'Generate Sample PDF'}
        </button>
      </div>
    </div>
  );
}
