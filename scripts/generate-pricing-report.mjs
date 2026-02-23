/**
 * Pricing Analysis Report — PDF Generator
 * Matches Skyfynd brand styling from QuotePDFExport.tsx
 *
 * Usage: node scripts/generate-pricing-report.mjs
 */

import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Brand colors ──
const BRAND = {
  purple: { r: 189, g: 168, b: 252 },
  blue:   { r: 120, g: 187, b: 251 },
  green:  { r: 130, g: 215, b: 185 },
};

const HEADER_HEIGHT = 18;
const CONTENT_START = HEADER_HEIGHT + 8;

function lerpColor(t) {
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

function drawGradientH(doc, x, y, width, height) {
  const steps = Math.max(Math.round(width * 2), 20);
  const sliceW = width / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x + i * sliceW, y, sliceW + 0.15, height, 'F');
  }
}

function drawGradientV(doc, x, y, width, height) {
  const steps = Math.max(Math.round(height * 2), 10);
  const sliceH = height / steps;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = lerpColor(i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * sliceH, width, sliceH + 0.15, 'F');
  }
}

function drawPageHeader(doc, pageWidth, margin) {
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Skyfynd', margin + 2, 10.8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Internal Pricing Analysis', pageWidth - margin, 10.8, { align: 'right' });
  drawGradientH(doc, 0, HEADER_HEIGHT, pageWidth, 0.8);
}

function drawPageFooter(doc, pageWidth, margin, pageNum, totalPages) {
  const footerY = doc.internal.pageSize.getHeight() - 8;
  drawGradientH(doc, margin, footerY - 4, pageWidth - margin * 2, 0.4);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 160);
  doc.text(
    'Confidential \u2014 Internal Use Only | Skyfynd Pricing Analysis',
    pageWidth / 2, footerY, { align: 'center' },
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
}

function drawSectionTitle(doc, title, x, y, pageWidth, margin) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(title, x, y);
  y += 2;
  drawGradientH(doc, x, y, pageWidth - margin - x, 0.5);
  y += 6;
  return y;
}

function checkPage(doc, y, needed, margin, pageWidth) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 15) {
    doc.addPage();
    drawPageHeader(doc, pageWidth, margin);
    return CONTENT_START;
  }
  return y;
}

function drawText(doc, text, x, y, maxWidth) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 4;
}

// ── Data ──

const services = [
  { name: 'Websites', essential: '$1,225', pro: '$2,100', enterprise: '$3,375', type: 'one-time' },
  { name: 'Rent Me a Site', essential: '$99/mo', pro: '$199/mo', enterprise: '$399/mo', type: 'monthly' },
  { name: 'App Creation', essential: '$1,775', pro: '$3,450', enterprise: '$5,300', type: 'one-time' },
  { name: 'Animations', essential: '$350', pro: '$1,000', enterprise: '$2,200', type: 'one-time' },
  { name: 'Images', essential: '$250', pro: '$650', enterprise: '$1,400', type: 'one-time' },
  { name: 'Brand Signature Sound', essential: '$250', pro: '$750', enterprise: '$1,800', type: 'one-time' },
  { name: 'Paid Media & Lead Gen', essential: '$450/mo', pro: '$1,200/mo', enterprise: '$2,500/mo', type: 'monthly' },
  { name: 'Social Media Mgmt', essential: '$500/mo', pro: '$1,400/mo', enterprise: '$3,000/mo', type: 'monthly' },
  { name: 'Email Marketing', essential: '$400/mo', pro: '$1,100/mo', enterprise: '$2,500/mo', type: 'monthly' },
  { name: 'AI Receptionist', essential: '$149/mo', pro: '$349/mo', enterprise: '$749/mo', type: 'monthly' },
  { name: 'Brand Strategy', essential: '$2,500', pro: '$6,000', enterprise: '$15,000', type: 'one-time' },
  { name: 'Visual Identity', essential: '$2,000', pro: '$5,500', enterprise: '$14,000', type: 'one-time' },
  { name: 'Brand Applications', essential: '$1,500', pro: '$4,500', enterprise: '$12,000', type: 'one-time' },
  { name: 'Content Strategy', essential: '$2,000', pro: '$5,500', enterprise: '$12,000', type: 'one-time' },
  { name: 'Copywriting', essential: '$1,500', pro: '$5,000', enterprise: '$12,000', type: 'one-time' },
];

const industryComparisons = [
  {
    name: 'Websites',
    verdict: 'LOW',
    yourRange: '$1,225 \u2013 $3,375',
    industryRange: '$3,000 \u2013 $15,000+',
    notes: 'A 6\u201310 page CMS business site for $2,100 is a bargain. Enterprise at $3,375 for 11\u201320 pages with advanced CMS is very aggressive. This could undervalue your work and attract clients who undervalue the deliverable.',
  },
  {
    name: 'Rent Me a Site',
    verdict: 'GOOD',
    yourRange: '$99 \u2013 $399/mo',
    industryRange: '$99 \u2013 $500/mo',
    notes: 'Well-aligned with the website-as-a-service market. Good recurring revenue model with clear tier differentiation.',
  },
  {
    name: 'App Creation',
    verdict: 'VERY LOW',
    yourRange: '$1,775 \u2013 $5,300',
    industryRange: '$10,000 \u2013 $150,000+',
    notes: 'Significantly underpriced. Cross-platform app with auth, payments, push notifications, admin dashboard, and app store submission for $3,450 (Pro) is far below market. Enterprise at $5,300 for all platforms + 13\u201325 screens typically costs $30K\u2013$80K at agencies.',
  },
  {
    name: 'Animations',
    verdict: 'SLIGHTLY LOW',
    yourRange: '$350 \u2013 $2,200',
    industryRange: '$500 \u2013 $10,000+',
    notes: 'Essential is fair for 15-second 2D animation. Enterprise at $2,200 for 1\u20132 min mixed media/3D with unlimited revisions, character design, and source files is below market.',
  },
  {
    name: 'Images',
    verdict: 'GOOD',
    yourRange: '$250 \u2013 $1,400',
    industryRange: '$50\u2013$150/img (AI), $200\u2013$500/img (pro)',
    notes: 'Essential ($250 for 1\u20135 AI images) is fair. Enterprise ($1,400 for 21\u201330 professionally shot images) is competitive but reasonable.',
  },
  {
    name: 'Brand Signature Sound',
    verdict: 'MIXED',
    yourRange: '$250 \u2013 $1,800',
    industryRange: '$100\u2013$500 (simple), $2K\u2013$10K (suite)',
    notes: 'Essential ($250 for a single 3-sec sound) is on the higher side. Enterprise ($1,800 for 7\u201310 sound package) is reasonable/slightly low vs. audio branding agencies.',
  },
  {
    name: 'Paid Media & Lead Gen',
    verdict: 'GOOD',
    yourRange: '$450 \u2013 $2,500/mo',
    industryRange: '$500 \u2013 $5,000/mo (or 10\u201320% of spend)',
    notes: 'Well-aligned with small-to-mid agency rates. Pricing does not include ad spend, which should be clarified to clients.',
  },
  {
    name: 'Social Media Mgmt',
    verdict: 'GOOD',
    yourRange: '$500 \u2013 $3,000/mo',
    industryRange: '$500 \u2013 $5,000/mo',
    notes: 'Right in the competitive zone with good tiering and clear value escalation.',
  },
  {
    name: 'Email Marketing',
    verdict: 'GOOD',
    yourRange: '$400 \u2013 $2,500/mo',
    industryRange: '$300 \u2013 $3,000/mo',
    notes: 'Well-calibrated across all tiers.',
  },
  {
    name: 'AI Receptionist',
    verdict: 'GOOD',
    yourRange: '$149 \u2013 $749/mo',
    industryRange: '$100 \u2013 $1,000/mo',
    notes: 'Competitive and well-positioned for the AI phone answering market.',
  },
  {
    name: 'Brand Strategy',
    verdict: 'GOOD',
    yourRange: '$2,500 \u2013 $15,000',
    industryRange: '$5,000 \u2013 $50,000+',
    notes: 'Essential at $2,500 for light discovery is fair. Pro at $6,000 is competitive. Enterprise at $15,000 is on the lower end for comprehensive enterprise rebrand but reasonable for a boutique agency.',
  },
  {
    name: 'Visual Identity',
    verdict: 'GOOD',
    yourRange: '$2,000 \u2013 $14,000',
    industryRange: '$2,500 \u2013 $25,000+',
    notes: 'Good range. Pro at $5,500 for a full logo system + icon set + brand guidelines is competitive.',
  },
  {
    name: 'Brand Applications',
    verdict: 'GOOD',
    yourRange: '$1,500 \u2013 $12,000',
    industryRange: '$2,000 \u2013 $15,000+',
    notes: 'Appropriate pricing throughout.',
  },
  {
    name: 'Content Strategy',
    verdict: 'GOOD',
    yourRange: '$2,000 \u2013 $12,000',
    industryRange: '$3,000 \u2013 $20,000+',
    notes: 'Essential is competitive. Enterprise on the lower end but fair for a boutique agency.',
  },
  {
    name: 'Copywriting',
    verdict: 'SLIGHTLY LOW',
    yourRange: '$1,500 \u2013 $12,000',
    industryRange: '$2,000 \u2013 $15,000+',
    notes: 'Pro at $5,000 for 3\u20135 pages of website copy + marketing copy + sales copy + 10 product descriptions is strong value but may leave money on the table.',
  },
];

const tierRatios = [
  { name: 'Websites', e2p: '1.7x', p2e: '1.6x' },
  { name: 'App Creation', e2p: '1.9x', p2e: '1.5x' },
  { name: 'Animations', e2p: '2.9x', p2e: '2.2x' },
  { name: 'Images', e2p: '2.6x', p2e: '2.2x' },
  { name: 'Brand Signature Sound', e2p: '3.0x', p2e: '2.4x' },
  { name: 'Brand Strategy', e2p: '2.4x', p2e: '2.5x' },
  { name: 'Visual Identity', e2p: '2.75x', p2e: '2.5x' },
  { name: 'Brand Applications', e2p: '3.0x', p2e: '2.7x' },
  { name: 'Content Strategy', e2p: '2.75x', p2e: '2.2x' },
  { name: 'Copywriting', e2p: '3.3x', p2e: '2.4x' },
];

const issues = [
  { priority: 'HIGH', issue: 'App Creation severely underpriced', suggestion: 'Consider 2\u20133x increase across all tiers. Pro should be $8K\u2013$12K minimum for cross-platform apps.' },
  { priority: 'HIGH', issue: 'Extra Screen add-on at $50', suggestion: 'Increase to $200\u2013$500 per screen. Industry standard is $500\u2013$2,000+ depending on complexity.' },
  { priority: 'MEDIUM', issue: 'Website pricing below market', suggestion: 'Consider 15\u201325% increase. A CMS-based 6\u201310 page site should be $3,000\u2013$5,000.' },
  { priority: 'MEDIUM', issue: '"Unlimited revisions" at Enterprise tier', suggestion: 'Cap at 8\u201310 rounds or add a time-bound qualifier (e.g., "within project timeline").' },
  { priority: 'LOW', issue: 'CLAUDE.md pricing documentation outdated', suggestion: 'Update CLAUDE.md to match actual service prices in services.ts.' },
  { priority: 'LOW', issue: 'Tier ratio inconsistency across categories', suggestion: 'Consider standardizing Essential\u2192Pro at ~2x and Pro\u2192Enterprise at ~2\u20132.5x.' },
];

// ── Generate ──

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
const pageWidth = doc.internal.pageSize.getWidth();
const margin = 18;
const contentWidth = pageWidth - margin * 2;

drawPageHeader(doc, pageWidth, margin);

let y = CONTENT_START;

// ── Title ──
doc.setTextColor(30, 30, 30);
doc.setFontSize(18);
doc.setFont('helvetica', 'bold');
doc.text('Pricing Analysis Report', pageWidth / 2, y, { align: 'center' });
y += 3;
drawGradientH(doc, pageWidth / 2 - 35, y, 70, 0.6);
y += 7;

doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.setTextColor(120, 120, 120);
doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
doc.text('15 Services \u00b7 3 Tiers Each \u00b7 4 Categories', pageWidth - margin, y, { align: 'right' });
y += 8;

// ── Executive Summary box ──
const summaryLines = [
  'This report analyzes the pricing of all 15 Skyfynd services across their Essential, Pro, and Enterprise tiers.',
  'Each service is compared against typical industry pricing to identify underpriced services, inconsistencies,',
  'and opportunities for optimization. Key finding: App Creation and Websites are significantly underpriced',
  'relative to industry norms, while marketing (recurring) services are well-calibrated.',
];
const summaryHeight = 8 + summaryLines.length * 4.5;
doc.setFillColor(248, 248, 250);
doc.roundedRect(margin, y - 4, contentWidth, summaryHeight, 2, 2, 'F');
drawGradientV(doc, margin, y - 4, 1.5, summaryHeight);

doc.setFontSize(9);
doc.setFont('helvetica', 'bold');
doc.setTextColor(30, 30, 30);
doc.text('Executive Summary', margin + 6, y + 1);
y += 7;

doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.setTextColor(60, 60, 60);
for (const line of summaryLines) {
  doc.text(line, margin + 6, y);
  y += 4.5;
}
y += 4;

// ═══════════════════════════════
// SECTION 1: PRICING OVERVIEW TABLE
// ═══════════════════════════════

y = drawSectionTitle(doc, '1. CURRENT PRICING OVERVIEW', margin, y, pageWidth, margin);

// Table header
doc.setFillColor(30, 30, 40);
doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
doc.setFontSize(7.5);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 255, 255);
doc.text('Service', margin + 3, y);
doc.text('Essential', margin + 70, y);
doc.text('Pro', margin + 100, y);
doc.text('Enterprise', margin + 125, y);
doc.text('Type', pageWidth - margin - 2, y, { align: 'right' });
y += 7;

// Rows
doc.setFontSize(7.5);
for (let i = 0; i < services.length; i++) {
  y = checkPage(doc, y, 6, margin, pageWidth);
  const s = services[i];
  if (i % 2 === 0) {
    doc.setFillColor(250, 250, 252);
    doc.rect(margin, y - 3.5, contentWidth, 6, 'F');
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(s.name, margin + 3, y);
  doc.text(s.essential, margin + 70, y);
  doc.text(s.pro, margin + 100, y);
  doc.text(s.enterprise, margin + 125, y);

  // Type badge
  if (s.type === 'monthly') {
    doc.setFillColor(BRAND.green.r, BRAND.green.g, BRAND.green.b);
    doc.roundedRect(pageWidth - margin - 16, y - 3, 15, 4.5, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 60, 40);
    doc.text('recurring', pageWidth - margin - 8.5, y - 0.2, { align: 'center' });
  } else {
    doc.setFillColor(BRAND.purple.r, BRAND.purple.g, BRAND.purple.b);
    doc.roundedRect(pageWidth - margin - 16, y - 3, 15, 4.5, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 30, 80);
    doc.text('one-time', pageWidth - margin - 8.5, y - 0.2, { align: 'center' });
  }
  doc.setFontSize(7.5);
  y += 6;
}

y += 6;

// ═══════════════════════════════
// SECTION 2: INDUSTRY COMPARISON
// ═══════════════════════════════

y = checkPage(doc, y, 20, margin, pageWidth);
y = drawSectionTitle(doc, '2. INDUSTRY COMPARISON (per service)', margin, y, pageWidth, margin);

for (const comp of industryComparisons) {
  y = checkPage(doc, y, 28, margin, pageWidth);

  // Service name + verdict badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(comp.name, margin + 3, y);

  // Verdict badge
  let badgeColor, textColor;
  if (comp.verdict === 'VERY LOW') {
    badgeColor = [220, 50, 50]; textColor = [255, 255, 255];
  } else if (comp.verdict === 'LOW' || comp.verdict === 'SLIGHTLY LOW') {
    badgeColor = [245, 158, 11]; textColor = [60, 30, 0];
  } else if (comp.verdict === 'MIXED') {
    badgeColor = [200, 180, 50]; textColor = [60, 50, 0];
  } else {
    badgeColor = [BRAND.green.r, BRAND.green.g, BRAND.green.b]; textColor = [30, 60, 40];
  }

  const badgeWidth = comp.verdict.length * 2 + 6;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(margin + 65, y - 3.2, badgeWidth, 4.5, 1, 1, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(comp.verdict, margin + 65 + badgeWidth / 2, y - 0.4, { align: 'center' });
  y += 5;

  // Ranges
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Your pricing:', margin + 5, y);
  doc.setFont('helvetica', 'normal');
  doc.text(comp.yourRange, margin + 30, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Industry:', margin + 75, y);
  doc.setFont('helvetica', 'normal');
  doc.text(comp.industryRange, margin + 95, y);
  y += 4.5;

  // Notes
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  const noteLines = doc.splitTextToSize(comp.notes, contentWidth - 8);
  for (const line of noteLines) {
    y = checkPage(doc, y, 4, margin, pageWidth);
    doc.text(line, margin + 5, y);
    y += 3.5;
  }
  y += 3;

  // Separator
  doc.setDrawColor(230, 230, 235);
  doc.setLineWidth(0.2);
  doc.line(margin + 3, y - 1, pageWidth - margin - 3, y - 1);
  y += 3;
}

// ═══════════════════════════════
// SECTION 3: TIER RATIO ANALYSIS
// ═══════════════════════════════

y = checkPage(doc, y, 30, margin, pageWidth);
y = drawSectionTitle(doc, '3. TIER PRICING RATIO ANALYSIS', margin, y, pageWidth, margin);

doc.setFontSize(7.5);
doc.setFont('helvetica', 'normal');
doc.setTextColor(80, 80, 80);
doc.text('This table shows the price multiplier between consecutive tiers. Ideally, multipliers should be consistent', margin + 3, y);
y += 4;
doc.text('across services to create a predictable pricing perception for clients.', margin + 3, y);
y += 7;

// Table header
doc.setFillColor(30, 30, 40);
doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
doc.setFontSize(7.5);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 255, 255);
doc.text('Service (one-time only)', margin + 3, y);
doc.text('Essential \u2192 Pro', margin + 85, y);
doc.text('Pro \u2192 Enterprise', margin + 130, y);
y += 7;

for (let i = 0; i < tierRatios.length; i++) {
  y = checkPage(doc, y, 6, margin, pageWidth);
  const r = tierRatios[i];
  if (i % 2 === 0) {
    doc.setFillColor(250, 250, 252);
    doc.rect(margin, y - 3.5, contentWidth, 6, 'F');
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(r.name, margin + 3, y);

  // Color code the ratios
  const e2pNum = parseFloat(r.e2p);
  const p2eNum = parseFloat(r.p2e);

  if (e2pNum < 2.0) {
    doc.setTextColor(245, 158, 11); // orange = compressed
  } else if (e2pNum > 3.0) {
    doc.setTextColor(220, 50, 50); // red = steep
  } else {
    doc.setTextColor(BRAND.green.r - 40, BRAND.green.g - 40, BRAND.green.b - 40); // green = good
  }
  doc.text(r.e2p, margin + 85, y);

  if (p2eNum < 2.0) {
    doc.setTextColor(245, 158, 11);
  } else if (p2eNum > 2.7) {
    doc.setTextColor(220, 50, 50);
  } else {
    doc.setTextColor(BRAND.green.r - 40, BRAND.green.g - 40, BRAND.green.b - 40);
  }
  doc.text(r.p2e, margin + 130, y);
  y += 6;
}

// Legend
y += 3;
doc.setFontSize(6.5);
doc.setFont('helvetica', 'normal');
doc.setTextColor(BRAND.green.r - 40, BRAND.green.g - 40, BRAND.green.b - 40);
doc.text('\u25CF Good range (2.0\u20132.5x)', margin + 3, y);
doc.setTextColor(245, 158, 11);
doc.text('\u25CF Compressed (<2.0x)', margin + 55, y);
doc.setTextColor(220, 50, 50);
doc.text('\u25CF Steep jump (>2.7\u20133.0x)', margin + 100, y);
y += 8;

// ═══════════════════════════════
// SECTION 4: ISSUES & RECOMMENDATIONS
// ═══════════════════════════════

y = checkPage(doc, y, 30, margin, pageWidth);
y = drawSectionTitle(doc, '4. ISSUES & RECOMMENDATIONS', margin, y, pageWidth, margin);

for (let i = 0; i < issues.length; i++) {
  const issue = issues[i];
  y = checkPage(doc, y, 20, margin, pageWidth);

  // Priority badge
  let pColor, pText;
  if (issue.priority === 'HIGH') {
    pColor = [220, 50, 50]; pText = [255, 255, 255];
  } else if (issue.priority === 'MEDIUM') {
    pColor = [245, 158, 11]; pText = [60, 30, 0];
  } else {
    pColor = [180, 180, 180]; pText = [60, 60, 60];
  }
  doc.setFillColor(...pColor);
  doc.roundedRect(margin + 2, y - 3, 14, 4.5, 1, 1, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...pText);
  doc.text(issue.priority, margin + 9, y - 0.3, { align: 'center' });

  // Issue title
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(issue.issue, margin + 20, y);
  y += 5;

  // Suggestion
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const suggLines = doc.splitTextToSize(`Recommendation: ${issue.suggestion}`, contentWidth - 22);
  for (const line of suggLines) {
    y = checkPage(doc, y, 4, margin, pageWidth);
    doc.text(line, margin + 20, y);
    y += 3.8;
  }
  y += 4;
}

// ═══════════════════════════════
// SECTION 5: OVERALL ASSESSMENT
// ═══════════════════════════════

y = checkPage(doc, y, 50, margin, pageWidth);
y = drawSectionTitle(doc, '5. OVERALL ASSESSMENT', margin, y, pageWidth, margin);

const assessments = [
  { label: 'Marketing (recurring) services', rating: 'Well-calibrated', color: [BRAND.green.r, BRAND.green.g, BRAND.green.b], detail: 'Paid Media, Social Media, Email Marketing, and AI Receptionist are all priced competitively with clear value escalation between tiers. These represent the strongest part of the pricing structure and create sustainable recurring revenue.' },
  { label: 'Branding services', rating: 'Competitive', color: [BRAND.green.r, BRAND.green.g, BRAND.green.b], detail: 'Brand Strategy, Visual Identity, Brand Applications are within market range. Essential tiers are accessible; Enterprise tiers are on the lower end of market but appropriate for a boutique agency positioning.' },
  { label: 'Content services', rating: 'Slightly low', color: [245, 158, 11], detail: 'Content Strategy and Copywriting are priced slightly below market averages. Pro tiers represent strong value for clients, which is good for competitiveness but may leave margin on the table.' },
  { label: 'Design & Development', rating: 'Underpriced', color: [220, 50, 50], detail: 'Websites and especially App Creation are significantly below industry norms. App Creation Pro at $3,450 for a cross-platform app with backend is roughly 3\u20135x below what agencies charge. This is the area with the most room for price increases.' },
];

for (const a of assessments) {
  y = checkPage(doc, y, 18, margin, pageWidth);

  const boxHeight = 6;
  doc.setFillColor(248, 248, 250);
  doc.roundedRect(margin, y - 4, contentWidth, boxHeight + 14, 1.5, 1.5, 'F');
  drawGradientV(doc, margin, y - 4, 1.2, boxHeight + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(a.label, margin + 5, y);

  // Rating badge
  const rBadgeW = a.rating.length * 2 + 4;
  doc.setFillColor(...a.color);
  doc.roundedRect(pageWidth - margin - rBadgeW - 3, y - 3.2, rBadgeW, 4.5, 1, 1, 'F');
  doc.setFontSize(6);
  const isRed = a.color[0] > 200 && a.color[1] < 100;
  const isOrange = a.color[0] > 200 && a.color[1] > 100 && a.color[1] < 180;
  doc.setTextColor(isRed ? 255 : 30, isRed ? 255 : 60, isRed ? 255 : 40);
  if (isOrange) doc.setTextColor(60, 30, 0);
  if (isRed) doc.setTextColor(255, 255, 255);
  doc.text(a.rating, pageWidth - margin - rBadgeW / 2 - 3, y - 0.3, { align: 'center' });

  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const detailLines = doc.splitTextToSize(a.detail, contentWidth - 12);
  for (const line of detailLines) {
    doc.text(line, margin + 5, y);
    y += 3.5;
  }
  y += 6;
}

// ── Final note ──
y = checkPage(doc, y, 20, margin, pageWidth);
y += 2;
doc.setFillColor(30, 30, 40);
doc.roundedRect(margin, y - 4, contentWidth, 14, 2, 2, 'F');
drawGradientH(doc, margin, y - 4, contentWidth, 0.6);

doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(255, 255, 255);
doc.text('Bottom Line', margin + 5, y + 1);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7);
doc.setTextColor(200, 200, 210);
doc.text('The biggest opportunity is increasing App Creation and Website pricing to better reflect the value delivered.', margin + 5, y + 6);

// ── Footers on all pages ──
const pageCount = doc.getNumberOfPages();
for (let i = 1; i <= pageCount; i++) {
  doc.setPage(i);
  drawPageFooter(doc, pageWidth, margin, i, pageCount);
}

// ── Save ──
const outputPath = path.resolve(__dirname, '..', 'Skyfynd_Pricing_Analysis.pdf');
const buffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, buffer);
console.log(`PDF saved to: ${outputPath}`);
console.log(`Pages: ${pageCount}`);
