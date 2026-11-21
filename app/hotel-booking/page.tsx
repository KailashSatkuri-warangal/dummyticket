import type { Metadata } from 'next';
import { MyJetGenerator } from '@/components/generator/MyJetGenerator';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { CtaBanner } from '@/components/content/CtaBanner';
import {
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hotel Booking for Visa Application: Proof of Accommodation | DummyTickets',
  description:
    'Generate verified hotel reservation proof for your visa application. Accepted by embassies worldwide with guest names, hotel address, and confirmation voucher.',
};

const HOTEL_FAQS = [
  {
    question: 'Why do embassies require proof of accommodation for a visa application?',
    answer:
      'Embassies and consulates require proof of accommodation to verify that you have a confirmed, legitimate place to stay for every single night of your intended trip. Under Schengen Visa Code Article 14 and comparable global visa guidelines, accommodation proof confirms your travel itinerary, shows you will not be stranded or a public charge, and validates that your daily funds align with your stay duration.',
  },
  {
    question: 'Can I use this hotel reservation for Schengen visa appointments (VFS / BLS / TLScontact)?',
    answer:
      'Yes. Our hotel booking vouchers format all standard details mandated by Schengen consular rules: official hotel name, complete street address with postal code, telephone number, check-in and check-out dates matching your flight itinerary, and full passenger guest names matching your passports.',
  },
  {
    question: 'Is it risky to pay for expensive non-refundable hotels before visa approval?',
    answer:
      'Yes, it is highly risky. Embassies frequently process applications longer than expected or may request additional documentation. If your visa is delayed or denied, prepaid non-refundable hotel stays result in total financial loss. Consular instructions explicitly recommend providing reserved itineraries or vouchers instead of paying non-refundable fees upfront.',
  },
  {
    question: 'Does the hotel booking voucher include all traveling guests?',
    answer:
      'Yes. When you generate a hotel reservation, all traveling guests (adults, children, and infants) can be listed on the booking voucher. This ensures that every applicant submitting their passport has their name explicitly tied to the accommodation.',
  },
  {
    question: 'How fast will I receive my hotel reservation PDF?',
    answer:
      'Instantly. In approximately 30 seconds after entering your destination city, hotel preference, and travel dates, your embassy-formatted hotel confirmation voucher is ready for direct PDF download.',
  },
  {
    question: 'Do I need to sign up or create an account?',
    answer:
      'No account is required. DummyTickets provides 100% guest access with no password creation or personal profile tracking.',
  },
];

export default function HotelBookingPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-black uppercase tracking-wider border border-white/15">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Proof of Accommodation for Visa Appointments</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Hotel Booking for Visa Application
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Generate an embassy-compliant hotel reservation voucher in 30 seconds. Includes guest names, hotel contact details, check-in dates, and confirmed booking code.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-blue-200 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>195+ Embassies Accepted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Instant PDF in 30 Seconds</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>No Account or Sign-Up Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="bookingForm" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <MyJetGenerator defaultTab="hotel" />
      </section>

      {/* Educational Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Consular Standards & Legal Requirements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Is Proof of Accommodation and What Must It Contain?
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Consulates across the Schengen zone, United Kingdom, Canada, Japan, and other international jurisdictions require formal documentation proving where you will reside during your trip. A valid proof of accommodation document must include:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Hotel Identity & Address</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full legal name of the property, street address, postal code, city, and verified telephone/email contact for consular validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Coordinated Dates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check-in and check-out dates that perfectly match your flight reservation and visa application arrival/departure schedule.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0062e0] flex items-center justify-center font-black mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Guest Identification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full names of all applicants exactly as written on their passports, confirming room occupancy for the entire traveling party.
              </p>
            </div>
          </div>

          {/* Comparison Card */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-6 py-4 font-black text-slate-900 text-sm">
              Proof of Accommodation Comparison
            </div>
            <div className="divide-y divide-slate-200 text-xs sm:text-sm">
              <div className="grid grid-cols-3 p-4 font-bold bg-slate-50 text-slate-700">
                <div>Feature</div>
                <div>Prepaid Hotel Booking</div>
                <div className="text-[#0062e0]">DummyTickets Voucher</div>
              </div>
              <div className="grid grid-cols-3 p-4 items-center">
                <div className="font-medium text-slate-900">Financial Risk</div>
                <div className="text-rose-600 font-bold">100% Non-refundable loss if visa denied</div>
                <div className="text-emerald-600 font-bold">₹0 Risk / Zero cancellation penalty</div>
              </div>
              <div className="grid grid-cols-3 p-4 items-center bg-slate-50">
                <div className="font-medium text-slate-900">Embassy Acceptance</div>
                <div>Accepted</div>
                <div className="text-emerald-600 font-bold">100% Embassy compliant</div>
              </div>
              <div className="grid grid-cols-3 p-4 items-center">
                <div className="font-medium text-slate-900">Processing Time</div>
                <div>Requires credit card authorization & upfront charge</div>
                <div className="text-emerald-600 font-bold">Instant 30-second PDF download</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion items={HOTEL_FAQS} />

        {/* CTA Banner */}
        <CtaBanner
          title="Generate Your Hotel Booking Voucher Now"
          subtitle="Instant PDF voucher with hotel address, confirmed booking code, and passenger names. Ready for VFS, BLS, and embassy appointments."
          primaryButtonText="Create Hotel Reservation"
          showHotelLink={false}
        />
      </section>
    </div>
  );
}
