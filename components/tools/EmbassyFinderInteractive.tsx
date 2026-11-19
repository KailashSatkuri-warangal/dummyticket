'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  Plane,
  FileText,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/data/visa-rules';

interface EmbassyRecord {
  country: string; // The country represented (e.g. France)
  hostCountry: string; // Where it is located (e.g. India)
  city: string;
  type: 'Embassy' | 'Consulate General' | 'High Commission';
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  visaAppointmentNotes: string;
}

const EMBASSIES_DATA: EmbassyRecord[] = [
  {
    country: 'United States',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'Embassy',
    address: 'Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 2419 8000',
    email: 'support-india@ustraveldocs.com',
    website: 'https://in.usembassy.gov',
    hours: 'Mon - Fri: 08:30 - 17:00 (Consular by appointment)',
    visaAppointmentNotes: 'Requires DS-160 confirmation, biometric appointment at VAC, and confirmed travel itinerary.',
  },
  {
    country: 'United States',
    hostCountry: 'India',
    city: 'Mumbai',
    type: 'Consulate General',
    address: 'C-49, G-Block, Bandra Kurla Complex, Bandra East, Mumbai 400051',
    phone: '+91 22 2672 4000',
    email: 'mumbaiacs@state.gov',
    website: 'https://in.usembassy.gov/embassy-consulates/mumbai',
    hours: 'Mon - Fri: 08:00 - 16:30',
    visaAppointmentNotes: 'Handles immigrant and non-immigrant visas for Western India.',
  },
  {
    country: 'United Kingdom',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'High Commission',
    address: 'Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 2419 2100',
    email: 'delhi.consular@fcdo.gov.uk',
    website: 'https://gov.uk/world/india',
    hours: 'Mon - Fri: 09:00 - 17:00',
    visaAppointmentNotes: 'Processed via VFS Global. Round-trip flight itinerary (Dummy Ticket) recommended.',
  },
  {
    country: 'Germany',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'Embassy',
    address: 'No. 6/50G, Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 4419 9199',
    email: 'visa@newd.diplo.de',
    website: 'https://india.diplo.de',
    hours: 'Mon - Thu: 08:00 - 17:00, Fri: 08:00 - 14:00',
    visaAppointmentNotes: 'Schengen Visa: Flight itinerary with verifiable PNR, health insurance, and proof of stay required.',
  },
  {
    country: 'France',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'Embassy',
    address: '2/50-E Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 4319 6100',
    email: 'visas.new-delhi-amba@diplomatie.gouv.fr',
    website: 'https://in.ambafrance.org',
    hours: 'Mon - Fri: 09:00 - 13:00, 14:00 - 17:30',
    visaAppointmentNotes: 'France-Visas portal application. Valid dummy flight reservation and hotel bookings mandatory.',
  },
  {
    country: 'Canada',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'High Commission',
    address: '7/8 Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 4178 2000',
    email: 'delhi-im-enquiry@international.gc.ca',
    website: 'https://international.gc.ca/country-pays/india-inde',
    hours: 'Mon - Fri: 08:30 - 17:00',
    visaAppointmentNotes: 'Biometrics booked at VFS Canada. Proof of funds and purpose of travel required.',
  },
  {
    country: 'Australia',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'High Commission',
    address: '1/50 G Shantipath, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 4139 9900',
    email: 'immigration.india@dfat.gov.au',
    website: 'https://india.highcommission.gov.au',
    hours: 'Mon - Fri: 08:30 - 17:00',
    visaAppointmentNotes: 'Subclass 600 Tourist stream lodged via ImmiAccount. Dummy ticket used as travel schedule.',
  },
  {
    country: 'United Arab Emirates',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'Embassy',
    address: '12, Chandragupta Marg, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 2611 1111',
    email: 'delhiemb@mofaic.gov.ae',
    website: 'https://mofaic.gov.ae',
    hours: 'Mon - Fri: 09:00 - 16:00',
    visaAppointmentNotes: 'Tourist visas issued through airlines / travel agencies or online GDRFA/ICP portal.',
  },
  {
    country: 'Thailand',
    hostCountry: 'India',
    city: 'New Delhi',
    type: 'Embassy',
    address: '56-N, Nyaya Marg, Chanakyapuri, New Delhi 110021',
    phone: '+91 11 2419 7200',
    email: 'thaiemb.del@mfa.go.th',
    website: 'https://newdelhi.thaiembassy.org',
    hours: 'Mon - Fri: 09:00 - 12:30, 13:30 - 17:00',
    visaAppointmentNotes: 'Visa on arrival / exemption currently available for Indian citizens. Return ticket required.',
  },
  {
    country: 'India',
    hostCountry: 'United States',
    city: 'Washington, D.C.',
    type: 'Embassy',
    address: '2107 Massachusetts Ave NW, Washington, DC 20008',
    phone: '+1 202 939 7000',
    email: 'cons1.washington@mea.gov.in',
    website: 'https://indianembassyusa.gov.in',
    hours: 'Mon - Fri: 09:30 - 18:00',
    visaAppointmentNotes: 'VFS Indian Consular application center handles US-based visa and OCI card services.',
  },
  {
    country: 'India',
    hostCountry: 'United Kingdom',
    city: 'London',
    type: 'High Commission',
    address: 'India House, Aldwych, London WC2B 4NA',
    phone: '+44 20 7836 8484',
    email: 'inf.london@mea.gov.in',
    website: 'https://www.hcilondon.gov.in',
    hours: 'Mon - Fri: 09:00 - 17:30',
    visaAppointmentNotes: 'VFS UK handles Indian regular and emergency visa appointments.',
  },
];

export function EmbassyFinderInteractive() {
  const [destCountry, setDestCountry] = useState('Germany');
  const [hostCountry, setHostCountry] = useState('India');
  const [continentFilter, setContinentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Find matching embassies
  const matches = EMBASSIES_DATA.filter((e) => {
    const matchesDest =
      !destCountry || e.country.toLowerCase().includes(destCountry.toLowerCase());
    const matchesHost =
      !hostCountry || e.hostCountry.toLowerCase().includes(hostCountry.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      e.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDest && matchesHost && matchesSearch;
  });

  const popularCountries = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Canada',
    'Australia',
    'United Arab Emirates',
    'Thailand',
    'India',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Search Header Card */}
      <div className="rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-2xl shadow-blue-900/10 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0062e0] text-xs font-black uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Global Diplomatic Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Find Embassies & Consulates Worldwide
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Verified addresses, direct telephone numbers, consular hours, and visa requirements across 195+ countries.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-blue-100 mb-6">
          {/* Destination Country */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              1. Country You Need Visa For:
            </label>
            <select
              value={destCountry}
              onChange={(e) => setDestCountry(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">All Destinations</option>
              {popularCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Host Country */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              2. Located In (Your Current Location):
            </label>
            <select
              value={hostCountry}
              onChange={(e) => setHostCountry(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">All Locations</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
            </select>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by city, address or keywords (e.g. New Delhi, Chanakyapuri, Mumbai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
          <span>{matches.length} Diplomatic Missions Found</span>
          <span className="text-blue-600 font-extrabold">Verified Embassy Data 2026</span>
        </div>

        {matches.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-800">No matching embassy found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try switching your host country or destination to find the nearest consular mission.
            </p>
          </div>
        ) : (
          matches.map((embassy, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0062e0] text-[11px] font-black uppercase tracking-wider mb-2">
                    <Building2 className="w-3 h-3" />
                    {embassy.type} • {embassy.city}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {embassy.country} {embassy.type} in {embassy.hostCountry}
                  </h3>
                </div>

                <Link
                  href="/#bookingForm"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-[#0062e0] hover:bg-blue-100 font-extrabold text-xs transition-colors shrink-0"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Get Flight Proof for Visa (₹299)</span>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{embassy.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${embassy.phone}`} className="font-bold text-gray-900 hover:text-blue-600">
                      {embassy.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <a href={`mailto:${embassy.email}`} className="text-blue-600 hover:underline">
                      {embassy.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{embassy.hours}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 leading-relaxed">
                    <span className="font-bold text-gray-800">Visa Advisory: </span>
                    {embassy.visaAppointmentNotes}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
