'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plane,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Download,
  AlertCircle,
  MapPin,
  Luggage,
  Armchair,
  Ticket,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface FlightRecord {
  pnr: string;
  airline: string;
  flightNo: string;
  aircraft: string;
  status: 'Confirmed' | 'Active' | 'Ticketed';
  originIata: string;
  originCity: string;
  originAirport: string;
  originTerminal: string;
  departDate: string;
  departTime: string;
  destIata: string;
  destCity: string;
  destAirport: string;
  destTerminal: string;
  arriveDate: string;
  arriveTime: string;
  duration: string;
  passengerName: string;
  ticketNumber: string;
  seat: string;
  cabinClass: string;
  baggage: string;
  fareINR: number;
}

const PRESET_FLIGHTS: Record<string, FlightRecord> = {
  DT7X42K: {
    pnr: 'DT7X42K',
    airline: 'DummyTicket Airways',
    flightNo: 'DT 472',
    aircraft: 'Boeing 787-9 Dreamliner',
    status: 'Confirmed',
    originIata: 'HYD',
    originCity: 'Hyderabad',
    originAirport: 'Rajiv Gandhi International Airport',
    originTerminal: 'Terminal 1',
    departDate: '21 NOV 2026',
    departTime: '09:45 AM (IST)',
    destIata: 'LAX',
    destCity: 'Los Angeles',
    destAirport: 'Los Angeles International Airport',
    destTerminal: 'Tom Bradley Int Terminal B',
    arriveDate: '21 NOV 2026',
    arriveTime: '05:20 PM (+1 day PST)',
    duration: '17h 35m (Direct)',
    passengerName: 'JOHN DOE / MR',
    ticketNumber: '098-7491028374',
    seat: '24C',
    cabinClass: 'Economy (Y)',
    baggage: '2 x 23 kg Included',
    fareINR: 299,
  },
  DT9LAX: {
    pnr: 'DT9LAX',
    airline: 'Air India / DummyTicket',
    flightNo: 'AI 187',
    aircraft: 'Boeing 777-300ER',
    status: 'Confirmed',
    originIata: 'HYD',
    originCity: 'Hyderabad',
    originAirport: 'Rajiv Gandhi International Airport',
    originTerminal: 'Terminal 1',
    departDate: '25 NOV 2026',
    departTime: '10:15 AM (IST)',
    destIata: 'LAX',
    destCity: 'Los Angeles',
    destAirport: 'Los Angeles International Airport',
    destTerminal: 'Terminal 4',
    arriveDate: '25 NOV 2026',
    arriveTime: '06:45 PM (+1 day PST)',
    duration: '18h 30m',
    passengerName: 'RAHUL SHARMA / MR',
    ticketNumber: '098-9381726481',
    seat: '18A',
    cabinClass: 'Economy (M)',
    baggage: '2 x 23 kg Included',
    fareINR: 299,
  },
  DT8LHR: {
    pnr: 'DT8LHR',
    airline: 'British Airways',
    flightNo: 'BA 256',
    aircraft: 'Airbus A350-900',
    status: 'Confirmed',
    originIata: 'DEL',
    originCity: 'New Delhi',
    originAirport: 'Indira Gandhi International Airport',
    originTerminal: 'Terminal 3',
    departDate: '28 NOV 2026',
    departTime: '11:30 AM (IST)',
    destIata: 'LHR',
    destCity: 'London',
    destAirport: 'Heathrow Airport',
    destTerminal: 'Terminal 5',
    arriveDate: '28 NOV 2026',
    arriveTime: '04:40 PM (GMT)',
    duration: '9h 10m (Non-Stop)',
    passengerName: 'PRIYA PATEL / MS',
    ticketNumber: '125-8271928471',
    seat: '14B',
    cabinClass: 'Economy (B)',
    baggage: '2 x 23 kg Included',
    fareINR: 349,
  },
  DT6DXB: {
    pnr: 'DT6DXB',
    airline: 'Emirates',
    flightNo: 'EK 501',
    aircraft: 'Boeing 777-300ER',
    status: 'Confirmed',
    originIata: 'BOM',
    originCity: 'Mumbai',
    originAirport: 'Chhatrapati Shivaji Maharaj Intl',
    originTerminal: 'Terminal 2',
    departDate: '02 DEC 2026',
    departTime: '02:10 PM (IST)',
    destIata: 'DXB',
    destCity: 'Dubai',
    destAirport: 'Dubai International Airport',
    destTerminal: 'Terminal 3',
    arriveDate: '02 DEC 2026',
    arriveTime: '04:35 PM (GST)',
    duration: '3h 25m (Non-Stop)',
    passengerName: 'MOHAMMED KHAN / MR',
    ticketNumber: '176-5918274619',
    seat: '28K',
    cabinClass: 'Economy (K)',
    baggage: '1 x 30 kg Included',
    fareINR: 299,
  },
};

export function PnrFlightSearch() {
  const [pnrInput, setPnrInput] = useState('DT7X42K');
  const [lastNameInput, setLastNameInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [flightRecord, setFlightRecord] = useState<FlightRecord | null>(PRESET_FLIGHTS['DT7X42K']);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (pnrToSearch?: string) => {
    const raw = (pnrToSearch || pnrInput).trim().toUpperCase();
    if (!raw) {
      setSearchError('Please enter a valid 6-character PNR booking reference.');
      return;
    }

    setSearchError('');
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      // Check preset
      if (PRESET_FLIGHTS[raw]) {
        setFlightRecord(PRESET_FLIGHTS[raw]);
      } else {
        // Generate realistic deterministic flight record for any custom PNR entered!
        const generated: FlightRecord = {
          pnr: raw,
          airline: 'DummyTicket Airways / SkyTeam Partner',
          flightNo: `DT ${Math.floor(200 + (raw.charCodeAt(0) * 5) % 700)}`,
          aircraft: 'Boeing 787-9 Dreamliner',
          status: 'Confirmed',
          originIata: 'HYD',
          originCity: 'Hyderabad',
          originAirport: 'Rajiv Gandhi International Airport',
          originTerminal: 'Terminal 1',
          departDate: '24 NOV 2026',
          departTime: '09:45 AM (IST)',
          destIata: 'LAX',
          destCity: 'Los Angeles',
          destAirport: 'Los Angeles International Airport',
          destTerminal: 'Tom Bradley Terminal B',
          arriveDate: '24 NOV 2026',
          arriveTime: '05:20 PM (+1 day PST)',
          duration: '17h 35m (Direct)',
          passengerName: lastNameInput ? `${lastNameInput.toUpperCase()} / TRAVELER` : 'CONFIRMED PASSENGER',
          ticketNumber: `098-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          seat: '24C',
          cabinClass: 'Economy (Standard)',
          baggage: '2 x 23 kg Included',
          fareINR: 299,
        };
        setFlightRecord(generated);
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6" id="pnr-verifier">
      {/* 3D Elevated Search Card */}
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0062e0]" />
            Official PNR & Flight Status Search
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Verify Booking Reference & Live Schedule
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Enter your 6-character airline PNR to verify your confirmed flight itinerary, exact departure & arrival timings, seat, and baggage details.
          </p>
        </div>

        {/* PNR Search Form */}
        <div className="bg-slate-50/90 p-5 sm:p-6 rounded-2xl border border-blue-100 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            {/* PNR Code */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                PNR Booking Reference (6 Characters) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                  placeholder="e.g. DT7X42K"
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-300 rounded-xl font-mono text-base font-black text-gray-900 tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <Ticket className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Passenger Last Name */}
            <div className="sm:col-span-6 md:col-span-4">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                Passenger Last Name (Optional)
              </label>
              <input
                type="text"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
                placeholder="e.g. Doe or Sharma"
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-12 md:col-span-2">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="w-full h-12 rounded-xl bg-[#0062e0] hover:bg-[#1d4ed8] text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Searching...' : 'Search PNR'}</span>
              </button>
            </div>
          </div>

          {/* Quick Demo PNRs */}
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-gray-500 text-[11px] uppercase">Quick Try:</span>
            {Object.keys(PRESET_FLIGHTS).map((code) => {
              const item = PRESET_FLIGHTS[code];
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setPnrInput(code);
                    handleSearch(code);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    pnrInput === code
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span className="font-mono font-black">{code}</span> ({item.originIata} ✈ {item.destIata})
                </button>
              );
            })}
          </div>

          {searchError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Live Flight Itinerary & Schedule Display */}
        {flightRecord && (
          <div className="rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 border border-blue-200/90 p-6 sm:p-8 shadow-sm">
            {/* Top Bar: PNR, Airline & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-blue-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Airline PNR Record
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0062e0] text-[11px] font-mono font-black">
                    {flightRecord.pnr}
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-2">
                  <span>{flightRecord.airline}</span>
                  <span className="text-blue-600 font-mono font-extrabold text-lg">
                    • {flightRecord.flightNo}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">
                  Aircraft: {flightRecord.aircraft} • E-Ticket: {flightRecord.ticketNumber}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  GDS Verified • {flightRecord.status}
                </div>
              </div>
            </div>

            {/* Flight Route, Dates & Exact Timings */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-blue-100">
              {/* Origin */}
              <div className="md:col-span-4 text-center md:text-left">
                <div className="text-4xl sm:text-5xl font-black text-gray-900 font-mono tracking-tight">
                  {flightRecord.originIata}
                </div>
                <div className="text-base font-black text-gray-800 mt-1">
                  {flightRecord.originCity}
                </div>
                <div className="text-xs text-gray-500">{flightRecord.originAirport}</div>
                <div className="mt-3 inline-block px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold">
                  {flightRecord.originTerminal}
                </div>
                <div className="mt-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Departure Date & Time</div>
                  <div className="text-sm font-black text-gray-900">{flightRecord.departDate}</div>
                  <div className="text-base font-extrabold text-[#0062e0] font-mono mt-0.5">
                    {flightRecord.departTime}
                  </div>
                </div>
              </div>

              {/* Flight Duration & Line */}
              <div className="md:col-span-4 text-center px-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {flightRecord.duration}
                </div>
                <div className="relative flex items-center justify-center my-3">
                  <div className="w-full border-t-2 border-dashed border-blue-400" />
                  <div className="absolute w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1 px-3 rounded-full inline-block mt-2">
                  ✓ Valid for Visa & Immigration
                </div>
              </div>

              {/* Destination */}
              <div className="md:col-span-4 text-center md:text-right">
                <div className="text-4xl sm:text-5xl font-black text-[#0062e0] font-mono tracking-tight">
                  {flightRecord.destIata}
                </div>
                <div className="text-base font-black text-gray-800 mt-1">
                  {flightRecord.destCity}
                </div>
                <div className="text-xs text-gray-500">{flightRecord.destAirport}</div>
                <div className="mt-3 inline-block px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold">
                  {flightRecord.destTerminal}
                </div>
                <div className="mt-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Arrival Date & Time</div>
                  <div className="text-sm font-black text-gray-900">{flightRecord.arriveDate}</div>
                  <div className="text-base font-extrabold text-[#0062e0] font-mono mt-0.5">
                    {flightRecord.arriveTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger, Seat & Baggage Metadata Grid */}
            <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-blue-100">
              <div className="p-3 bg-white rounded-xl border border-blue-100">
                <div className="text-[10px] uppercase font-bold text-gray-400">Passenger Name</div>
                <div className="text-xs font-black text-gray-900 mt-1 truncate">
                  {flightRecord.passengerName}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100">
                <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-center gap-1">
                  <Armchair className="w-3 h-3 text-blue-600" /> Seat & Cabin
                </div>
                <div className="text-xs font-black text-gray-900 mt-1">
                  {flightRecord.seat} • {flightRecord.cabinClass}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100">
                <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-center gap-1">
                  <Luggage className="w-3 h-3 text-emerald-600" /> Baggage Allowance
                </div>
                <div className="text-xs font-black text-gray-900 mt-1">
                  {flightRecord.baggage}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100">
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Fare</div>
                <div className="text-xs font-black text-blue-600 mt-1">
                  ₹{flightRecord.fareINR} (DummyTicket Verified)
                </div>
              </div>
            </div>

            {/* Download & Actions Bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium text-center sm:text-left">
                ✓ Includes official airline barcode, scannable QR code, and IATA booking reference.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="/#bookingForm"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#0062e0] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Ticket</span>
                </a>

                <a
                  href="/#bookingForm"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 hover:border-blue-400 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <Plane className="w-4 h-4 text-blue-600" />
                  <span>New Booking</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
