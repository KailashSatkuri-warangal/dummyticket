import type { Metadata } from 'next';
import { EmbassyFinderInteractive } from '@/components/tools/EmbassyFinderInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Building2,
  Globe2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Landmark,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find Embassies & Consulates Worldwide | DummyTickets',
  description:
    'Find embassies, consulates, and high commissions across 195+ countries. Diplomatic mission contact information, official addresses, and consular guidelines.',
};

const EMBASSY_FAQS = [
  {
    question: 'What is the difference between an Embassy and a Consulate?',
    answer:
      'An Embassy is the primary diplomatic representation of one country inside another, headed by an Ambassador and always located in the host nation’s capital city (e.g. Washington D.C., London, New Delhi, Berlin). A Consulate General is a branch office located in major regional or commercial hubs (such as New York, Mumbai, Shanghai, or Munich). While embassies handle high-level foreign policy, consulates handle day-to-day citizen services, visa interviews, and passport processing.',
  },
  {
    question: 'What is a High Commission?',
    answer:
      'A High Commission is the diplomatic equivalent of an Embassy between member countries of the Commonwealth of Nations (such as the UK, Canada, Australia, India, South Africa, and New Zealand). Instead of an Ambassador, the mission is headed by a High Commissioner. Functions, visa processing, and diplomatic status are identical to an Embassy.',
  },
  {
    question: 'Why do many embassies outsource visa processing to VFS Global, BLS, or TLScontact?',
    answer:
      'To manage the massive volume of visa applicants securely and efficiently, many governments partner with specialized visa application service centers (such as VFS Global, BLS International, or TLScontact). These centers collect biometrics, verify physical documents, and collect statutory visa fees before dispatching your passport to the official consular visa officers who make the final decision.',
  },
  {
    question: 'How do I know which consular jurisdiction applies to my residence?',
    answer:
      'Embassies divide host nations into consular jurisdictions based on your state or province of residence. For instance, an applicant living in California applies to the Consulate General in San Francisco or Los Angeles, rather than the Embassy in Washington D.C. Submitting to the wrong jurisdiction can result in rejected appointments.',
  },
];

export default function EmbassyFinderPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Landmark className="w-3.5 h-3.5 text-blue-400" />
            <span>Worldwide Diplomatic Mission Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Embassy & Consulate Finder
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Search embassies, consulates general, and high commissions worldwide. Official addresses, consular jurisdiction rules, and contact information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>195+ Countries Covered</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Building2 className="w-4 h-4 text-blue-300" />
              <span>Consulates & High Commissions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Verified Consular Details</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Embassy Finder Directory */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <EmbassyFinderInteractive />
      </section>

      {/* Educational Guide: Diplomatic Mission Structure */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Diplomatic Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Embassy vs. Consulate vs. High Commission: Key Differences
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Under the Vienna Convention on Diplomatic Relations (1961) and Vienna Convention on Consular Relations (1963), international missions serve distinct legal roles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Embassy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The supreme diplomatic representation in the nation&apos;s capital city. Headed by an Ambassador Extraordinary and Plenipotentiary, handling country-to-country relations, bilateral treaties, and defense cooperation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Consulate General</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regional offices in economic centers. Headed by a Consul-General. Operates visa interview windows, issues emergency travel documents, and provides assistance to expatriate citizens.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">High Commission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The diplomatic mission exchanged between 56 Commonwealth member states. Exercises the exact same functions and rank as an Embassy, headed by a High Commissioner.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={EMBASSY_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Prepare Your Embassy Appointment Documents"
          subtitle="Generate an embassy-compliant flight reservation and hotel voucher for your upcoming visa interview."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
