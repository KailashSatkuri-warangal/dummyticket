import type { Metadata } from 'next';
import { DocumentGeneratorInteractive } from '@/components/tools/DocumentGeneratorInteractive';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Building2,
  Home,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Invitation Letter Generator for Host Sponsorship | DummyTickets',
  description:
    'Generate an official invitation letter from a host or sponsor for your visa application. Accepted by embassies worldwide. Instant PDF download.',
};

const INVITATION_LETTER_FAQS = [
  {
    question: 'What is a visa invitation letter and who should write it?',
    answer:
      'A visa invitation letter is a formal written statement from an individual (friend, family member, spouse) or organization (employer, conference organizer, university) residing legally in the destination country. It invites the foreign applicant to visit, confirms their relationship, states the exact dates and purpose of the visit, and clarifies whether the host will provide accommodation or financial support.',
  },
  {
    question: 'Does the host need to be a citizen of the destination country?',
    answer:
      'Not necessarily. The host can be a citizen or a legal permanent/temporary resident (e.g. holder of a valid residence permit, work visa, or student visa) in the destination country. The host must supply their official identification or residence permit copy alongside the letter.',
  },
  {
    question: 'What information must the host invitation letter contain?',
    answer:
      'Consulates require: 1) Host full name, birth date, residential address, telephone, and email; 2) Host legal immigration status (citizen, PR, or permit number); 3) Applicant full name, date of birth, passport number, and relationship to host; 4) Exact dates of arrival and departure matching the flight reservation; 5) Detailed accommodation declaration (whether staying at host home or hotel); 6) Statement of financial sponsorship if applicable; 7) Host physical or digital signature.',
  },
  {
    question: 'Does an invitation letter guarantee visa approval?',
    answer:
      'No single document guarantees a visa. However, a well-drafted invitation letter alongside confirmed flight reservations, accommodation proof, and financial statements significantly strengthens the credibility of your visit and fulfills consular requirements.',
  },
];

export default function InvitationLetterPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Host & Sponsor Declaration Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Visa Invitation Letter Generator
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate an embassy-formatted invitation letter from your host, relative, or sponsor. Includes host identification, accommodation declaration, and visit dates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Consular-Compliant Structure</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>No Account Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Generator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-12">
        <DocumentGeneratorInteractive
          type="invitation-letter"
          title="Visa Invitation Letter Generator"
          subtitle="Generate an official host invitation letter for family, friends, or business associates applying for a tourist or visitor visa."
        />
      </section>

      {/* Guide & Rules */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Host Requirements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Consulates Expect in a Host Invitation Letter
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              When visiting friends or family, embassies look for evidence that the host is a bona fide resident who will assist the visitor and ensure adherence to visa terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Accommodation Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear statement that the host has adequate residential space to host the applicant for the entire duration of the trip.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Host Legal Identity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                National ID, passport, or resident permit number included directly on the header and body of the document.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Coordinated Dates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explicit arrival and departure dates that match the applicant&apos;s flight itinerary and application form.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={INVITATION_LETTER_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Pair with an Onward Flight Reservation"
          subtitle="Complete your visa application package with a verifiable flight itinerary matching the dates stated in your invitation letter."
          primaryButtonText="Create Flight Reservation"
          primaryHref="/dummy-ticket"
          showHotelLink={true}
        />
      </section>
    </div>
  );
}
