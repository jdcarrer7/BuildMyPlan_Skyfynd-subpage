'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { jsPDF } from 'jspdf';
import type { QuoteJSON } from '@/lib/types/admin';

const LOGO_URL = '/skyfynd-logo.png';

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

// ── Brand colors (opacity-adjusted to match CSS gradient) ──
const BRAND = {
  purple: { r: 189, g: 168, b: 252 },
  blue:   { r: 120, g: 187, b: 251 },
  green:  { r: 130, g: 215, b: 185 },
} as const;

const HEADER_HEIGHT = 18;
const CONTENT_START = HEADER_HEIGHT + 8;

function lerpColor(t: number): [number, number, number] {
  const p = BRAND.purple, b = BRAND.blue, g = BRAND.green;
  if (t <= 0.4) {
    const s = t / 0.4;
    return [
      Math.round(p.r + (b.r - p.r) * s),
      Math.round(p.g + (b.g - p.g) * s),
      Math.round(p.b + (b.b - p.b) * s),
    ];
  }
  const s = (t - 0.4) / 0.6;
  return [
    Math.round(b.r + (g.r - b.r) * s),
    Math.round(b.g + (g.g - b.g) * s),
    Math.round(b.b + (g.b - b.b) * s),
  ];
}

function drawGradientH(doc: jsPDF, x: number, y: number, width: number, height: number) {
  const steps = Math.max(Math.round(width * 2), 20);
  const sliceW = width / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x + i * sliceW, y, sliceW + 0.15, height, 'F');
  }
}

function drawGradientV(doc: jsPDF, x: number, y: number, width: number, height: number) {
  const steps = Math.max(Math.round(height * 2), 10);
  const sliceH = height / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * sliceH, width, sliceH + 0.15, 'F');
  }
}

function drawPageHeader(doc: jsPDF, logoBase64: string | null, pageWidth: number, margin: number, qrNumber?: string) {
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, 'F');

  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', margin, 5, 8, 8); } catch { /* ignore */ }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Skyfynd', margin + 10, 10.8);

  if (qrNumber) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(qrNumber, pageWidth - margin, 12, { align: 'right' });
  }

  drawGradientH(doc, 0, HEADER_HEIGHT, pageWidth, 0.8);
}

function drawPageFooter(doc: jsPDF, pageWidth: number, margin: number, pageNum: number, totalPages: number) {
  const footerY = doc.internal.pageSize.getHeight() - 8;
  drawGradientH(doc, margin, footerY - 4, pageWidth - margin * 2, 0.4);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 160);
  doc.text(
    'This is an estimate. Final pricing may vary. | Skyfynd \u2014 Software for Businesses',
    pageWidth / 2, footerY, { align: 'center' },
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
}

function drawSectionTitle(doc: jsPDF, title: string, x: number, y: number, pageWidth: number, margin: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(title, x, y);
  y += 2;
  drawGradientH(doc, x, y, pageWidth - margin - x, 0.5);
  y += 6;
  return y;
}

function checkPage(doc: jsPDF, y: number, needed: number, margin: number, logoBase64: string | null, qrNumber?: string): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    doc.addPage();
    drawPageHeader(doc, logoBase64, doc.internal.pageSize.getWidth(), margin, qrNumber);
    return CONTENT_START;
  }
  return y;
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
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      const qr = quote.qrNumber;

      // ── Page 1 header ──
      drawPageHeader(doc, logoBase64, pageWidth, margin, qr);

      // ── Title ──
      let y = CONTENT_START;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Quote Estimate', pageWidth / 2, y, { align: 'center' });
      y += 3;
      drawGradientH(doc, pageWidth / 2 - 30, y, 60, 0.6);
      y += 6;

      // Date
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`Quote Date: ${new Date(quote.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
      y += 7;

      // ── Client Info box ──
      const clientFields: [string, string][] = [
        ['Name', quote.customer.name],
        ['Email', quote.customer.email],
        ['Company', quote.customer.company],
        ['Phone', quote.customer.phone],
      ].filter(([, val]) => val) as [string, string][];

      const clientInfoHeight = 8 + clientFields.length * 5;
      doc.setFillColor(248, 248, 250);
      doc.roundedRect(margin, y - 4, contentWidth, clientInfoHeight, 2, 2, 'F');
      drawGradientV(doc, margin, y - 4, 1.5, clientInfoHeight);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Client Information', margin + 6, y + 1);
      y += 7;

      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      for (const [label, val] of clientFields) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin + 6, y);
        doc.setFont('helvetica', 'normal');
        doc.text(val, margin + 28, y);
        y += 5;
      }
      y += 6;

      // ── Service Breakdown ──
      y = drawSectionTitle(doc, 'SERVICE BREAKDOWN', margin, y, pageWidth, margin);

      for (const service of quote.services) {
        y = checkPage(doc, y, 16, margin, logoBase64, qr);

        // Service header row
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(margin, y - 4.5, contentWidth, 9, 1, 1, 'F');
        drawGradientV(doc, margin, y - 4.5, 1.2, 9);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text(service.serviceLabel, margin + 5, y);

        const priceText: string[] = [];
        if (service.oneTimeTotal > 0) priceText.push(`$${service.oneTimeTotal.toLocaleString()}`);
        if (service.monthlyTotal > 0) priceText.push(`$${service.monthlyTotal.toLocaleString()}/mo`);
        if (priceText.length > 0) {
          doc.setTextColor(50, 50, 50);
          doc.text(priceText.join(' + '), pageWidth - margin - 3, y, { align: 'right' });
        }
        y += 8;

        // Steps
        doc.setFontSize(8);
        for (const step of service.steps) {
          if (step.selectedId === null && step.children) {
            y = checkPage(doc, y, 6, margin, logoBase64, qr);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text(step.stepName, margin + 5, y);
            y += 4;

            doc.setFont('helvetica', 'normal');
            for (const child of step.children) {
              y = checkPage(doc, y, 4, margin, logoBase64, qr);
              doc.setTextColor(90, 90, 90);
              doc.text(child.stepName, margin + 9, y);
              doc.setTextColor(50, 50, 50);
              doc.text(child.selectedLabel, margin + 55, y);
              if (child.priceImpact !== null && child.priceImpact > 0) {
                doc.setTextColor(50, 50, 50);
                const pLabel = child.isRecurring
                  ? `$${child.priceImpact.toLocaleString()}/mo`
                  : `$${child.priceImpact.toLocaleString()}`;
                doc.text(pLabel, pageWidth - margin - 3, y, { align: 'right' });
              }
              y += 4;
            }
          } else {
            y = checkPage(doc, y, 4, margin, logoBase64, qr);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(90, 90, 90);
            doc.text(step.stepName, margin + 5, y);
            doc.setTextColor(50, 50, 50);
            doc.text(step.selectedLabel, margin + 55, y);
            if (step.priceImpact !== null && step.priceImpact > 0) {
              doc.setTextColor(50, 50, 50);
              const pLabel = step.isRecurring
                ? `$${step.priceImpact.toLocaleString()}/mo`
                : `$${step.priceImpact.toLocaleString()}`;
              doc.text(pLabel, pageWidth - margin - 3, y, { align: 'right' });
            }
            y += 4;
          }
        }
        y += 4;
      }

      // ── Price Summary Table ──
      y += 2;
      y = checkPage(doc, y, 55, margin, logoBase64, qr);
      y = drawSectionTitle(doc, 'PRICE SUMMARY', margin, y, pageWidth, margin);

      const col1X = margin;
      const col2X = margin + 90;
      const col3X = pageWidth - margin;

      // Table header row
      doc.setFillColor(30, 30, 40);
      doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Service', col1X + 3, y);
      doc.text('One-Time', col2X, y);
      doc.text('Monthly', col3X - 3, y, { align: 'right' });
      y += 7;

      // Service rows
      doc.setFontSize(9);
      for (let i = 0; i < quote.services.length; i++) {
        const service = quote.services[i];
        y = checkPage(doc, y, 7, margin, logoBase64, qr);

        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, y - 4, contentWidth, 7, 'F');
        }

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(service.serviceLabel, col1X + 3, y);
        doc.text(
          service.oneTimeTotal > 0 ? `$${service.oneTimeTotal.toLocaleString()}` : '\u2014',
          col2X, y,
        );
        doc.text(
          service.monthlyTotal > 0 ? `$${service.monthlyTotal.toLocaleString()}/mo` : '\u2014',
          col3X - 3, y, { align: 'right' },
        );
        y += 7;
      }

      // Subtotal line
      y += 1;
      drawGradientH(doc, margin, y, contentWidth, 0.3);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);

      if (quote.totals.oneTimeTotal > 0) {
        doc.text('Project Total', col1X + 3, y);
        doc.text(`$${quote.totals.oneTimeTotal.toLocaleString()}`, col2X, y);
        y += 6;
      }

      if (quote.totals.monthlyTotal > 0) {
        doc.text('Total Monthly', col1X + 3, y);
        doc.text(`$${quote.totals.monthlyTotal.toLocaleString()}/mo`, col3X - 3, y, { align: 'right' });
        y += 6;
      }

      // Discount row
      if (quote.discounts?.totalSaved) {
        doc.setTextColor(BRAND.green.r, BRAND.green.g, BRAND.green.b);
        doc.text(`Discount (${quote.totals.discountPercentage}%)`, col1X + 3, y);
        doc.text(`-$${quote.discounts.totalSaved.toLocaleString()}`, col3X - 3, y, { align: 'right' });
        y += 6;
      }

      // Payment Structure
      y += 2;
      const grandTotal = quote.totals.grandTotal;
      const deposit = Math.ceil(grandTotal / 2);
      const completion = Math.floor(grandTotal / 2);

      // Deposit box
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(margin, y - 5, contentWidth, 12, 1.5, 1.5, 'F');
      drawGradientV(doc, margin, y - 5, 1.5, 12);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.text('DEPOSIT (50%)', col1X + 5, y + 2);
      doc.text(`$${deposit.toLocaleString()}`, col3X - 3, y + 2, { align: 'right' });
      y += 16;

      // Due on completion
      doc.setFillColor(250, 250, 252);
      doc.roundedRect(margin, y - 5, contentWidth, 10, 1.5, 1.5, 'F');

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text('DUE ON COMPLETION (50%)', col1X + 5, y + 1);
      doc.text(`$${completion.toLocaleString()}`, col3X - 3, y + 1, { align: 'right' });

      // ── Footer on every page ──
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawPageFooter(doc, pageWidth, margin, i, pageCount);
      }

      doc.save(`${quote.qrNumber}_Quote.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-semibold text-white text-xs transition-all disabled:opacity-50 border border-[#A78BFA]/30 hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] hover:-translate-y-0.5"
      style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)' }}
    >
      <Download className="w-3.5 h-3.5" />
      {generating ? 'Generating PDF...' : 'Export PDF'}
    </button>
  );
}
