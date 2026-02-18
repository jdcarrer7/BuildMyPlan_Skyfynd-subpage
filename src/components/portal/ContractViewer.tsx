'use client';

const LOGO_URL = 'https://media.skyfynd.io/Skyfynd%20Landing%20Page/Skyfynd%20Logo/skyfynd_logo.webp';

interface ContractViewerProps {
  clientName: string;
  effectiveDate: string;
}

export default function ContractViewer({ clientName, effectiveDate }: ContractViewerProps) {
  return (
    <div className="bg-white text-[#1a1a2e] rounded-lg overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10pt', lineHeight: 1.5 }}>
      <div className="p-5 sm:p-8 md:p-10 lg:p-12 max-w-none">
        {/* Header */}
        <header className="text-center pb-4 mb-4 border-b-2 border-[#1a1a2e]">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={LOGO_URL} alt="Skyfynd" className="w-10 h-10 object-contain" />
            <span className="text-[28px] font-normal text-[#1a1a2e] tracking-tight" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              Skyfynd
            </span>
          </div>
          <h1 className="text-[17pt] font-normal text-[#1a1a2e] tracking-tight" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Master Services Agreement
          </h1>
        </header>

        {/* Intro */}
        <p className="mb-3 text-justify">
          This Master Services Agreement (<strong>&quot;Agreement&quot;</strong>) is entered into as of{' '}
          <strong>{effectiveDate}</strong> (&quot;Effective Date&quot;), by and between{' '}
          <strong>Skyfynd LLC</strong> (&quot;Service Provider&quot;) and the undersigned client,{' '}
          <strong>{clientName}</strong> (&quot;Client&quot;).
        </p>
        <p className="mb-3 text-justify italic text-[#555]">
          By engaging Skyfynd for any services, Client agrees to be bound by this Agreement.
        </p>

        {/* Articles */}
        <Article num={1} title="Services">
          <p>Skyfynd provides digital services including, but not limited to, website development, application development, branding, design, marketing, animation, content creation, and related professional services (&quot;Services&quot;). All Services are project-based unless expressly stated otherwise in writing.</p>
        </Article>

        <Article num={2} title="Statement of Work (SOW)">
          <p>Each engagement shall be governed by a written Statement of Work (or formal Quote/Proposal) that specifies:</p>
          <BulletList items={['Selected services', 'Tier (Essential, Pro, or Enterprise)', 'Deliverables', 'Timeline', 'Fees and payment terms']} />
          <p>No services are provided without an agreed SOW. In the event of a conflict between this Agreement and an SOW, the SOW shall control regarding scope and fees, but this Agreement shall control regarding legal terms (liability, IP, etc.).</p>
        </Article>

        <Article num={3} title="Service Tiers">
          <div className="overflow-x-auto my-1.5 -mx-1 px-1">
            <table className="w-full border-collapse text-[8.5pt] sm:text-[9.5pt]" style={{ minWidth: '400px' }}>
              <thead>
                <tr className="bg-[#1a1a2e] text-white">
                  <th className="px-2 sm:px-2.5 py-1.5 text-left font-semibold text-[7.5pt] sm:text-[8.5pt] uppercase tracking-wider">Tier</th>
                  <th className="px-2 sm:px-2.5 py-1.5 text-left font-semibold text-[7.5pt] sm:text-[8.5pt] uppercase tracking-wider">Scope</th>
                  <th className="px-2 sm:px-2.5 py-1.5 text-left font-semibold text-[7.5pt] sm:text-[8.5pt] uppercase tracking-wider">Revisions</th>
                  <th className="px-2 sm:px-2.5 py-1.5 text-left font-semibold text-[7.5pt] sm:text-[8.5pt] uppercase tracking-wider">License</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5] font-semibold">Essential</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Limited; template-based or standard designs</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Two (2) rounds</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Personal or basic commercial</td>
                </tr>
                <tr className="bg-[#f9f9fb]">
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5] font-semibold">Pro</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Expanded; custom designs</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Four (4) rounds</td>
                  <td className="px-2.5 py-1 border-b border-[#e5e5e5]">Full commercial license</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-1 font-semibold">Enterprise</td>
                  <td className="px-2.5 py-1">Comprehensive or unlimited</td>
                  <td className="px-2.5 py-1">Unlimited reasonable</td>
                  <td className="px-2.5 py-1">Exclusive ownership upon full payment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Article>

        <Article num={4} title="Pricing & Payment">
          <p>All prices are starting prices. Final pricing may vary based on scope. Unless otherwise stated in the SOW, payment terms are:</p>
          <BulletList items={[
            <><strong>50% non-refundable deposit</strong> is required before work begins.</>,
            <><strong>50% balance</strong> is due upon completion or prior to the release of final files/launch.</>,
          ]} />
          <p><span className="font-semibold">Late Payments:</span> Invoices not paid within 14 days of the due date are subject to a late fee of 1.5% per month or the maximum permitted by law. Skyfynd reserves the right to suspend all work and withhold deliverables until payment is brought current.</p>
        </Article>

        <Article num={5} title="Add-Ons & Recurring Services">
          <p>Add-ons and recurring services must be authorized in writing. Recurring services (e.g., maintenance, hosting) may be canceled with 30 days&apos; written notice.</p>
        </Article>

        <Article num={6} title="Change Orders">
          <p>Any modification to scope, deliverables, or timeline requires a written Change Order approved by both parties. Skyfynd reserves the right to adjust fees and timelines for any requested changes.</p>
        </Article>

        <Article num={7} title="Client Responsibilities">
          <p>Client agrees to:</p>
          <BulletList items={[
            'Provide accurate and timely information, access, and assets.',
            'Secure rights to all materials (images, copy, fonts) provided to Skyfynd.',
            'Respond to approvals promptly. Delays caused by Client (e.g., failure to provide feedback within 3 business days) will extend timelines day-for-day and may result in a "restart fee" if the project goes dormant for more than 14 days.',
          ]} />
        </Article>

        <Article num={8} title="Review & Acceptance">
          <p>Upon delivery of the final Deliverables, Client shall have a period of five (5) business days (&quot;Acceptance Period&quot;) to review the work.</p>
          <BulletList items={[
            'If Client requests corrections within this period, Skyfynd will make the necessary adjustments consistent with the SOW.',
            'If Client does not provide specific written corrections within the Acceptance Period, the Deliverables shall be deemed accepted, and the final balance shall become immediately due and payable.',
          ]} />
        </Article>

        <Article num={9} title="Intellectual Property">
          <p><span className="font-semibold">Deliverables:</span> Upon full payment, Skyfynd grants Client the rights associated with the selected Tier (Essential, Pro, or Enterprise).</p>
          <p><span className="font-semibold">Background IP:</span> Skyfynd retains all right, title, and interest in and to its pre-existing materials, scripts, code libraries, proprietary tools, and design frameworks (&quot;Background IP&quot;). Skyfynd grants Client a perpetual, non-exclusive, royalty-free license to use Background IP solely as incorporated into the final Deliverables. Client may not extract, resell, or reverse-engineer Background IP for use in other projects.</p>
          <p><span className="font-semibold">Third-Party Assets:</span> Stock photos, fonts, or plugins purchased on Client&apos;s behalf remain subject to their respective third-party licenses.</p>
        </Article>

        <Article num={10} title="Portfolio Rights">
          <p>Skyfynd retains the right to display the completed work, Client&apos;s name, and logo in its portfolio, website, and marketing materials for the purpose of demonstrating its capabilities, unless a specific Non-Disclosure Agreement (NDA) is signed.</p>
        </Article>

        <Article num={11} title="No Guarantees & Third-Party Disclaimer">
          <p>Skyfynd does not guarantee results including sales, traffic, engagement, search ranking, or revenue. <span className="font-semibold">Third-Party Services:</span> Skyfynd is not responsible for downtime, data loss, security breaches, or feature changes caused by third-party providers (e.g., AWS, GoDaddy, WordPress plugins, APIs). Client acknowledges that third-party services are subject to their own terms and availability.</p>
        </Article>

        <Article num={12} title="Confidentiality">
          <p>Both parties shall keep confidential all proprietary information exchanged during the project, including trade secrets, business strategies, and customer data.</p>
        </Article>

        <Article num={13} title="Termination">
          <p>Either party may terminate this Agreement with written notice.</p>
          <p><span className="font-semibold">Fees Owed:</span> In the event of termination by Client, Client shall pay Skyfynd for all work performed and expenses incurred up to the date of termination on a pro-rated basis. If the value of work performed exceeds the deposit, Client shall pay the difference within 10 days.</p>
          <p><span className="font-semibold">Non-Refundable:</span> Fees already paid are non-refundable.</p>
        </Article>

        <Article num={14} title="Limitation of Liability">
          <p>To the maximum extent permitted by law, Skyfynd&apos;s liability is limited to the total fees paid by Client for the specific service giving rise to the claim. In no event shall Skyfynd be liable for indirect, incidental, special, or consequential damages (including lost profits or data).</p>
        </Article>

        <Article num={15} title="Indemnification">
          <p>Client agrees to indemnify and hold Skyfynd harmless from any claims, damages, or legal fees arising from Client&apos;s materials, breach of this Agreement, or misuse of the Deliverables.</p>
        </Article>

        <Article num={16} title="Force Majeure">
          <p>Neither party is liable for failure or delay in performance due to events beyond reasonable control (e.g., natural disasters, war, strikes, internet service provider failures).</p>
        </Article>

        <Article num={17} title="Dispute Resolution">
          <p>Disputes shall be resolved through good faith negotiation. If unresolved, disputes shall be settled by binding arbitration in the county of Skyfynd&apos;s principal office.</p>
        </Article>

        <Article num={18} title="Governing Law">
          <p>This Agreement is governed by the laws of the State of California.</p>
        </Article>

        <Article num={19} title="Non-Solicitation">
          <p>During the term of this Agreement and for twelve (12) months thereafter, Client agrees not to directly or indirectly solicit, recruit, or hire any employee, contractor, or agent of Skyfynd. Client agrees that the remedy for a breach of this provision shall be a payment to Skyfynd equal to 100% of the solicited individual&apos;s annual compensation.</p>
        </Article>

        <Article num={20} title="Entire Agreement">
          <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.</p>
        </Article>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#e5e5e5] flex items-center justify-center gap-2">
          <img src={LOGO_URL} alt="Skyfynd" className="w-[18px] h-[18px] object-contain" />
          <span className="text-[8pt] text-[#aaa] tracking-wide">Skyfynd LLC &mdash; Confidential</span>
        </div>
      </div>
    </div>
  );
}

function Article({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2
        className="text-[11pt] font-bold text-[#1a1a2e] mb-1 pb-0.5 border-b border-[#ddd] uppercase tracking-wide"
        style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
      >
        {num}. {title}
      </h2>
      <div className="space-y-1.5 text-justify [&>p]:mb-1.5">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="my-1 ml-5 list-none">
      {items.map((item, i) => (
        <li key={i} className="mb-0.5 text-justify relative pl-3 before:content-['•'] before:absolute before:left-0 before:font-semibold before:text-[#1a1a2e]">
          {item}
        </li>
      ))}
    </ul>
  );
}
