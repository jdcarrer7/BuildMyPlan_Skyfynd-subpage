'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { QuoteJSON } from '@/lib/types/admin';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

interface Props {
  quote: QuoteJSON;
}

async function fetchLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_URL);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function QuotePDFExport({ quote }: Props) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const [{ jsPDF }, logoBase64] = await Promise.all([
        import('jspdf'),
        fetchLogoBase64(),
      ]);

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // ── Header ──
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 40, 'F');

      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, 8, 35, 24);
      } else {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('SkyFynd', margin, 20);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Quote Estimate', margin, 36);

      doc.setFontSize(10);
      doc.text(quote.qrNumber, pageWidth - margin, 20, { align: 'right' });
      doc.text(new Date(quote.submittedAt).toLocaleDateString(), pageWidth - margin, 28, { align: 'right' });

      y = 50;

      // ── Customer Info ──
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Information', margin, y);
      y += 7;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);

      const info = [
        ['Name', quote.customer.name],
        ['Email', quote.customer.email],
        ['Company', quote.customer.company],
        ['Phone', quote.customer.phone],
      ].filter(([, val]) => val);

      for (const [label, val] of info) {
        doc.text(`${label}: ${val}`, margin, y);
        y += 5;
      }

      y += 5;

      // ── Services Breakdown ──
      for (const service of quote.services) {
        if (y > 260) {
          doc.addPage();
          y = margin;
        }

        // Service header
        doc.setFillColor(245, 245, 250);
        doc.rect(margin, y - 4, contentWidth, 8, 'F');
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(service.serviceLabel, margin + 2, y);

        const priceText = [];
        if (service.oneTimeTotal > 0) priceText.push(`$${service.oneTimeTotal.toLocaleString()}`);
        if (service.monthlyTotal > 0) priceText.push(`$${service.monthlyTotal.toLocaleString()}/mo`);
        if (priceText.length > 0) {
          doc.text(priceText.join(' + '), pageWidth - margin - 2, y, { align: 'right' });
        }

        y += 8;

        // Steps
        doc.setFontSize(8);
        for (const step of service.steps) {
          if (y > 275) {
            doc.addPage();
            y = margin;
          }

          if (step.selectedId === null && step.children) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 100, 100);
            doc.text(step.stepName, margin + 2, y);
            y += 4;

            doc.setFont('helvetica', 'normal');
            for (const child of step.children) {
              if (y > 275) {
                doc.addPage();
                y = margin;
              }
              doc.setTextColor(80, 80, 80);
              doc.text(`  ${child.stepName}`, margin + 4, y);
              doc.text(child.selectedLabel, margin + 50, y);
              if (child.priceImpact !== null && child.priceImpact > 0) {
                const pLabel = child.isRecurring
                  ? `$${child.priceImpact.toLocaleString()}/mo`
                  : `$${child.priceImpact.toLocaleString()}`;
                doc.text(pLabel, pageWidth - margin - 2, y, { align: 'right' });
              }
              y += 4;
            }
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(step.stepName, margin + 2, y);
            doc.text(step.selectedLabel, margin + 50, y);
            if (step.priceImpact !== null && step.priceImpact > 0) {
              const pLabel = step.isRecurring
                ? `$${step.priceImpact.toLocaleString()}/mo`
                : `$${step.priceImpact.toLocaleString()}`;
              doc.text(pLabel, pageWidth - margin - 2, y, { align: 'right' });
            }
            y += 4;
          }
        }

        y += 4;
      }

      // ── Price Summary Table ──
      if (y > 210) {
        doc.addPage();
        y = margin;
      }

      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text('PRICE SUMMARY', margin, y);
      y += 8;

      // Table header
      const col1X = margin;
      const col2X = margin + 90;
      const col3X = pageWidth - margin;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text('Service', col1X, y);
      doc.text('One-Time', col2X, y);
      doc.text('Monthly', col3X, y, { align: 'right' });
      y += 2;
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      // Per-service rows
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      for (const service of quote.services) {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }
        doc.text(service.serviceLabel, col1X, y);
        doc.text(
          service.oneTimeTotal > 0 ? `$${service.oneTimeTotal.toLocaleString()}` : '\u2014',
          col2X, y
        );
        doc.text(
          service.monthlyTotal > 0 ? `$${service.monthlyTotal.toLocaleString()}/mo` : '\u2014',
          col3X, y, { align: 'right' }
        );
        y += 6;
      }

      // Subtotal line
      y += 1;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);

      if (quote.totals.oneTimeTotal > 0) {
        doc.text('Total One-Time', col1X, y);
        doc.text(`$${quote.totals.oneTimeTotal.toLocaleString()}`, col2X, y);
        y += 6;
      }

      if (quote.totals.monthlyTotal > 0) {
        doc.text('Total Monthly', col1X, y);
        doc.text(`$${quote.totals.monthlyTotal.toLocaleString()}/mo`, col3X, y, { align: 'right' });
        y += 6;
      }

      // Discount row
      if (quote.discounts?.totalSaved) {
        doc.setTextColor(0, 150, 0);
        doc.text(`Discount (${quote.totals.discountPercentage}%)`, col1X, y);
        doc.text(`-$${quote.discounts.totalSaved.toLocaleString()}`, col3X, y, { align: 'right' });
        y += 6;
      }

      // Due Today
      y += 1;
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(14);
      doc.text('DUE TODAY', col1X, y);
      doc.text(`$${quote.totals.grandTotal.toLocaleString()}`, col3X, y, { align: 'right' });

      // ── Footer ──
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(
          'This is an estimate. Final pricing may vary. | Skyfynd \u2014 Software for Businesses',
          pageWidth / 2,
          290,
          { align: 'center' }
        );
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
      }

      doc.save(`${quote.qrNumber}_Quote.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={generatePDF}
        disabled={generating}
        className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 border border-[#A78BFA]/30 hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
      >
        <Download className="w-4 h-4" />
        {generating ? 'Generating PDF...' : 'Export PDF'}
      </button>
    </div>
  );
}
