'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  Plane,
  Building,
  ShieldCheck,
  Sparkles,
  Calendar,
  User,
  MapPin,
  Plus,
  Trash2,
  Mail,
  Briefcase,
  Share2,
} from 'lucide-react';

export type DocType = 'visa-letter' | 'invitation-letter' | 'travel-itinerary' | 'embassy-letter';

interface DocumentGeneratorProps {
  type: DocType;
  title: string;
  subtitle: string;
}

const DOC_TABS = [
  { id: 'visa-letter' as DocType, name: 'Visa Support Letter', href: '/visa-letter' },
  { id: 'invitation-letter' as DocType, name: 'Invitation Letter', href: '/invitation-letter' },
  { id: 'travel-itinerary' as DocType, name: 'Travel Itinerary', href: '/travel-itinerary' },
  { id: 'embassy-letter' as DocType, name: 'Embassy Cover Letter', href: '/embassy-letter' },
];

export function DocumentGeneratorInteractive({ type: initialType, title: initialTitle, subtitle: initialSubtitle }: DocumentGeneratorProps) {
  const [currentType, setCurrentType] = useState<DocType>(initialType);

  // Common Form Fields
  const [applicantName, setApplicantName] = useState('Rahul Sharma');
  const [passportNumber, setPassportNumber] = useState('Z9482015');
  const [nationality, setNationality] = useState('Indian');
  const [destinationCountry, setDestinationCountry] = useState('Germany');
  const [embassyCity, setEmbassyCity] = useState('New Delhi');
  const [departureDate, setDepartureDate] = useState('2026-11-20');
  const [returnDate, setReturnDate] = useState('2026-12-05');
  const [travelPurpose, setTravelPurpose] = useState('Tourism, Cultural Sightseeing & Holiday');
  const [employer, setEmployer] = useState('Tata Consultancy Services Ltd, Bangalore');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [monthlyIncome, setMonthlyIncome] = useState('₹1,45,000 / month');
  const [sponsorship, setSponsorship] = useState<'self' | 'host' | 'company'>('self');

  // Invitation Letter Fields
  const [hostName, setHostName] = useState('Markus Weber');
  const [hostAddress, setHostAddress] = useState('Friedrichstraße 42, 10117 Berlin, Germany');
  const [relationship, setRelationship] = useState('Close Friend & Travel Host');
  const [hostCitizenship, setHostCitizenship] = useState('German Citizen');

  // Travel Itinerary Day-by-Day Items
  const [itineraryDays, setItineraryDays] = useState([
    { day: 'Day 1 (20 Nov)', activity: 'Arrival at Berlin Brandenburg Airport (BER) via DT-472, airport transit, and check-in at Hotel Berlin Central' },
    { day: 'Day 2 (21 Nov)', activity: 'Historic walking tour: Brandenburg Gate, Reichstag Building, and Museum Island' },
    { day: 'Day 3 (22 Nov)', activity: 'Day excursion to Potsdam and the UNESCO Sanssouci Palace gardens' },
    { day: 'Day 4-8', activity: 'High-speed ICE train to Munich; Bavarian cultural tour and BMW Museum' },
    { day: 'Day 9-13', activity: 'Day trip to Neuschwanstein Castle; visit Munich Residenz and English Garden' },
    { day: 'Day 14 (04 Dec)', activity: 'Return train to Berlin, souvenir shopping, and preparation for departure' },
    { day: 'Day 15 (05 Dec)', activity: 'Hotel checkout, transfer to BER airport, and return flight DT-473 to New Delhi' },
  ]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = document.getElementById('printable-document')?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const addItineraryDay = () => {
    const nextNum = itineraryDays.length + 1;
    setItineraryDays([
      ...itineraryDays,
      { day: `Day ${nextNum}`, activity: 'Sightseeing, local market visit, and city exploration' },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    if (itineraryDays.length <= 1) return;
    setItineraryDays(itineraryDays.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* 3D Elevated Generator Card */}
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            Official Consular Format 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {currentType === 'visa-letter'
              ? 'Visa Support Letter Generator'
              : currentType === 'invitation-letter'
              ? 'Official Invitation Letter for Visa'
              : currentType === 'travel-itinerary'
              ? 'Day-by-Day Travel Itinerary Generator'
              : 'Embassy Cover Letter Generator'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Generate an embassy-ready PDF in minutes. Fully customizable, verifiable, and accepted across 195+ countries.
          </p>
        </div>

        {/* Document Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-blue-50/70 p-2 rounded-2xl border border-blue-100 max-w-3xl mx-auto">
          {DOC_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                currentType === tab.id
                  ? 'bg-[#0062e0] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:text-blue-600 border border-gray-200/60'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Input Form Grid */}
        <div className="bg-slate-50/90 p-6 rounded-2xl border border-blue-100 mb-8">
          <div className="text-xs font-black uppercase tracking-wider text-blue-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Enter Your Travel & Application Details:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
            <div>
              <label className="block mb-1 text-gray-500 uppercase">Applicant Full Name (Passport)</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Passport Number</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Destination Country</label>
              <input
                type="text"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Embassy / Consulate City</label>
              <input
                type="text"
                value={embassyCity}
                onChange={(e) => setEmbassyCity(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500 uppercase">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-1 text-gray-500 uppercase">Purpose of Travel</label>
              <input
                type="text"
                value={travelPurpose}
                onChange={(e) => setTravelPurpose(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fields for Visa Letter & Embassy Letter */}
            {(currentType === 'visa-letter' || currentType === 'embassy-letter') && (
              <>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Current Employer</label>
                  <input
                    type="text"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Job Title / Designation</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Monthly Income / Salary</label>
                  <input
                    type="text"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Fields for Invitation Letter */}
            {currentType === 'invitation-letter' && (
              <>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Host Full Name</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Host Citizenship / Residency</label>
                  <input
                    type="text"
                    value={hostCitizenship}
                    onChange={(e) => setHostCitizenship(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 uppercase">Relationship to Guest</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block mb-1 text-gray-500 uppercase">Host Residential Address in Destination</label>
                  <input
                    type="text"
                    value={hostAddress}
                    onChange={(e) => setHostAddress(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Editable Itinerary Rows if Travel Itinerary is active */}
          {currentType === 'travel-itinerary' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-gray-700">
                  Custom Daily Schedule (Click to edit activities):
                </span>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-[#0062e0] rounded-lg text-xs font-extrabold hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Day
                </button>
              </div>

              <div className="space-y-2">
                {itineraryDays.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => {
                        const next = [...itineraryDays];
                        next[idx].day = e.target.value;
                        setItineraryDays(next);
                      }}
                      className="w-32 h-9 px-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => {
                        const next = [...itineraryDays];
                        next[idx].activity = e.target.value;
                        setItineraryDays(next);
                      }}
                      className="flex-1 h-9 px-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-800"
                    />
                    {itineraryDays.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"
                        title="Remove day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Document Preview Container */}
        <div
          className="border border-blue-200/90 rounded-2xl bg-white p-6 sm:p-10 shadow-lg relative print:m-0 print:border-none print:shadow-none"
          id="printable-document"
        >
          {/* Consular Letterhead */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <div className="text-xl font-black text-gray-900 tracking-tight">
                {currentType === 'invitation-letter' ? hostName : applicantName}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentType === 'invitation-letter'
                  ? hostAddress
                  : `${employer} • ${embassyCity}, ${nationality}`}
              </div>
              <div className="text-xs text-gray-500">
                Passport: <span className="font-mono font-bold text-gray-800">{passportNumber}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-black text-[#0062e0] bg-blue-50 px-2.5 py-1 rounded-md">
                REF: DT-{Math.floor(100000 + (applicantName.length * 12345) % 900000)}
              </div>
              <div className="text-xs text-gray-400 mt-1.5 font-medium">
                Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Consular Address */}
          <div className="mb-6 text-xs text-gray-700 leading-relaxed font-semibold">
            To:<br />
            <strong>The Visa Consular Officer</strong><br />
            Visa Section, Embassy / Consulate General of {destinationCountry}<br />
            {embassyCity}
          </div>

          {/* Subject Line */}
          <div className="text-sm font-black text-gray-900 mb-6 bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            SUBJECT:{' '}
            {currentType === 'visa-letter'
              ? `STATEMENT OF FINANCIAL SUPPORT & TRIP SPONSORSHIP FOR VISA APPLICATION — ${applicantName.toUpperCase()}`
              : currentType === 'invitation-letter'
              ? `FORMAL LETTER OF INVITATION & ACCOMMODATION GUARANTEE FOR ${applicantName.toUpperCase()}`
              : currentType === 'travel-itinerary'
              ? `DAY-BY-DAY TRAVEL ITINERARY & FLIGHT SCHEDULE FOR ${destinationCountry.toUpperCase()} TOURIST VISA`
              : `COVER LETTER IN SUPPORT OF TOURIST VISA APPLICATION — ${applicantName.toUpperCase()}`}
          </div>

          {/* Dynamic Body Content */}
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>Dear Honorable Consular Officer,</p>

            {currentType === 'visa-letter' && (
              <>
                <p>
                  I am writing this formal letter in support of my application for a Schengen / Tourist Visa to visit <strong>{destinationCountry}</strong> from <strong>{departureDate}</strong> to <strong>{returnDate}</strong>.
                </p>
                <p>
                  The purpose of my travel is <strong>{travelPurpose}</strong>. I am currently employed full-time as a <strong>{jobTitle}</strong> with <strong>{employer}</strong> (earning {monthlyIncome}). My official leave from work has been approved by management, and a certified No Objection Certificate (NOC) is attached.
                </p>
                <p>
                  I confirm that I will personally cover all expenses incurred during this journey, including confirmed round-trip airfare reservations, hotel accommodations, meals, internal transport, and international travel health insurance. My attached certified bank statements demonstrate sufficient funds to support my travel comfortably.
                </p>
              </>
            )}

            {currentType === 'invitation-letter' && (
              <>
                <p>
                  I, <strong>{hostName}</strong>, a {hostCitizenship} residing at <strong>{hostAddress}</strong>, am writing this official Letter of Invitation for my guest, <strong>{applicantName}</strong> (holder of {nationality} Passport No. <strong>{passportNumber}</strong>), who plans to visit me in {destinationCountry} from <strong>{departureDate}</strong> to <strong>{returnDate}</strong>.
                </p>
                <p>
                  I have known {applicantName} for several years as my {relationship}. During their entire stay in {destinationCountry}, they will be accommodated at my home address indicated above. I guarantee that {applicantName} will strictly adhere to all consular conditions and will depart {destinationCountry} prior to the expiration of their authorized stay.
                </p>
              </>
            )}

            {currentType === 'travel-itinerary' && (
              <div>
                <p className="mb-3">
                  Please find below my comprehensive day-by-day travel plan and sightseeing schedule for my visit to <strong>{destinationCountry}</strong> from <strong>{departureDate}</strong> to <strong>{returnDate}</strong>:
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden my-4">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-blue-50 text-[#0062e0] font-black border-b border-gray-200">
                      <tr>
                        <th className="p-3">Timeline</th>
                        <th className="p-3">Scheduled Itinerary & Sightseeing Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {itineraryDays.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-gray-900 whitespace-nowrap align-top">{item.day}</td>
                          <td className="p-3 text-gray-700">{item.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentType === 'embassy-letter' && (
              <>
                <p>
                  I respectfully submit this cover letter in support of my Tourist Visa application to travel to <strong>{destinationCountry}</strong> for a duration of {Math.round((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / (1000 * 3600 * 24)) || 15} days, commencing from <strong>{departureDate}</strong> and concluding on <strong>{returnDate}</strong>.
                </p>
                <p>
                  The purpose of my trip is <strong>{travelPurpose}</strong>. I hold strong and permanent professional, familial, and economic ties to my home country ({nationality}). I work as <strong>{jobTitle}</strong> at <strong>{employer}</strong> with an established monthly compensation of {monthlyIncome}. My approved leave requires my mandatory return to office on the first business day following {returnDate}.
                </p>
                <p>
                  Please find enclosed the following verified supporting documentation:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-medium text-gray-600">
                  <li>Original Passport with minimum 6 months validity</li>
                  <li>Confirmed Round-Trip Flight Itinerary (Dummy Ticket with GDS-active PNR: DT7X42K)</li>
                  <li>Confirmed Hotel Reservation Vouchers</li>
                  <li>Approved Employer Leave Sanction Letter & No Objection Certificate (NOC)</li>
                  <li>6 Months Certified Bank Statements with adequate funds proof</li>
                  <li>Schengen-compliant Travel Health Insurance policy (€30,000 / $50,000 coverage)</li>
                </ul>
              </>
            )}

            <p className="pt-2">
              Thank you for your valuable time and consideration of my visa application. I remain available at your convenience should any additional information be required.
            </p>

            <div className="pt-6">
              <div>Sincerely and respectfully,</div>
              <div className="text-base font-black text-gray-900 mt-2">
                {currentType === 'invitation-letter' ? hostName : applicantName}
              </div>
              <div className="text-xs text-gray-500 font-medium">Applicant / Host Signature</div>
            </div>
          </div>

          {/* Footer Verification Seal */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[#0062e0]">
              <ShieldCheck className="w-4 h-4 text-[#0062e0]" /> Verified Consular Document Layout
            </div>
            <div>DummyTicket Platform • Document ID: DT-DOC-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0062e0] hover:bg-[#1d4ed8] text-white font-black text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-300 hover:border-blue-400 text-gray-700 font-bold text-sm transition-all"
            >
              <Copy className="w-4 h-4 text-blue-600" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>
          </div>

          {/* 1-click Dummy Ticket Flight Proof CTA */}
          <Link
            href="/#bookingForm"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-extrabold text-sm shadow-md transition-all"
          >
            <Plane className="w-4 h-4" />
            <span>Attach Confirmed Flight Ticket (₹299)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
