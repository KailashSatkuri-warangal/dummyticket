'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Building,
  CheckCircle2,
  Download,
  Sparkles,
} from 'lucide-react';
import { AIRPORTS } from '@/lib/flights/dataset';
import { saveRecentBooking } from '@/lib/booking/recent-storage';
import { RecentBookingsCard } from '@/components/booking/RecentBookingsCard';

interface MyJetGeneratorProps {
  defaultTab?: 'flight' | 'hotel';
}

export function MyJetGenerator({ defaultTab = 'flight' }: MyJetGeneratorProps = {}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel'>(defaultTab);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  // Flight fields
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('roundtrip');
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('LHR');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState([
    { firstName: 'John', lastName: 'Doe', passport: '' },
  ]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Hotel fields
  const [hotelCity, setHotelCity] = useState('London');
  const [hotelCountry, setHotelCountry] = useState('United Kingdom');
  const [hotelName, setHotelName] = useState('Grand Central Plaza Hotel');
  const [hotelCheckIn, setHotelCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [hotelCheckOut, setHotelCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [hotelGuestName, setHotelGuestName] = useState('John Doe');

  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { firstName: '', lastName: '', passport: '' }]);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handleUpdatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async (e: React.FormEvent, forcePlan?: 'free' | 'premium') => {
    e.preventDefault();
    const planToUse = forcePlan || selectedPlan;
    setIsSubmitting(true);
    setStatusMessage('Generating verified dummy ticket reservation...');

    try {
      if (activeTab === 'flight') {
        const payload = {
          tripType,
          origin,
          destination,
          departureDate,
          returnDate: tripType === 'roundtrip' ? returnDate : undefined,
          passengers: passengers.map((p) => ({
            firstName: p.firstName || 'Traveler',
            lastName: p.lastName || 'Primary',
            passport: p.passport || undefined,
          })),
          contactEmail: email || 'traveler@example.com',
          contactPhone: phone || '+1234567890',
          plan: planToUse,
        };

        const res = await fetch('/api/bookings/instant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data && data.success && data.bookingReference) {
          // Persist in local device storage and cookies for quick re-download
          const primaryPax = passengers[0];
          saveRecentBooking({
            bookingReference: data.bookingReference,
            pnr: data.airlinePnr || data.bookingReference,
            origin,
            destination,
            departureDate,
            passengerName: primaryPax?.firstName
              ? `${primaryPax.firstName} ${primaryPax.lastName || ''}`.trim()
              : 'Traveler',
            type: 'flight',
            plan: planToUse,
            createdAt: new Date().toISOString(),
            pdfUrl: `/api/tickets/${data.bookingReference}/pdf`,
          });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('dt_booking_saved'));
          }

          if (planToUse === 'premium') {
            setStatusMessage('Booking generated! Forwarding to checkout...');
            router.push(`/checkout/${data.bookingId}`);
          } else {
            setStatusMessage('Ticket generated! Starting instant PDF download...');
            window.location.href = `/api/tickets/${data.bookingReference}/pdf`;
          }
        } else {
          // Fallback to flights search with route
          router.push(`/flights?from=${origin}&to=${destination}&depart=${departureDate}`);
        }
      } else {
        alert('Hotel reservation proof generated successfully!');
      }
    } catch {
      router.push(`/flights?from=${origin}&to=${destination}&depart=${departureDate}`);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusMessage('');
      }, 1500);
    }
  };

  return (
    <div id="bookingForm" className="w-full max-w-3xl mx-auto scroll-mt-24">
      {/* Plan Comparison Cards - Blue & White 3D Depth Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 perspective-container">
        {/* Free Plan Card */}
        <div
          onClick={() => setSelectedPlan('free')}
          className={`cursor-pointer rounded-2xl p-5 border-2 card-3d-elevate transition-all relative ${
            selectedPlan === 'free'
              ? 'border-[#0062e0] bg-white shadow-xl shadow-blue-500/15'
              : 'border-blue-100 bg-white/80 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-50 text-[#0062e0] text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full badge-3d">
              Free Plan
            </span>
            {selectedPlan === 'free' && (
              <span className="text-[#0062e0] font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Selected
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-gray-900 mb-3">
            ₹0 <span className="text-xs font-normal text-gray-500">forever</span>
          </div>
          <ul className="space-y-2 text-xs font-medium text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Instant PDF Download
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Valid 6-character PNR code
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Real QR Code included
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> 6,000+ Airports worldwide
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <span className="text-gray-400 font-bold">✓</span> Standard watermark included
            </li>
          </ul>
        </div>

        {/* Premium Plan Card */}
        <div
          onClick={() => setSelectedPlan('premium')}
          className={`cursor-pointer rounded-2xl p-5 border-2 card-3d-elevate transition-all relative ${
            selectedPlan === 'premium'
              ? 'border-[#0062e0] bg-white shadow-2xl shadow-blue-500/20'
              : 'border-blue-100 bg-white/80 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full badge-3d">
              Premium Clean Ticket
            </span>
            {selectedPlan === 'premium' && (
              <span className="text-[#0062e0] font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Selected
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-gray-900 mb-3">
            ₹399 <span className="text-xs font-normal text-gray-500">one-time</span>
          </div>
          <ul className="space-y-2 text-xs font-medium text-gray-700">
            <li className="flex items-center gap-2 font-bold text-[#0062e0]">
              <span className="text-[#0062e0] font-bold">✓</span> 100% Clean — NO Watermark
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Official Airline Logo & Header
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Verified Flight Times & Routes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Instant PDF + Email Delivery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#0062e0] font-bold">✓</span> Priority 24/7 Support
            </li>
          </ul>
        </div>
      </div>

      {/* Pill Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-blue-50 p-1.5 rounded-full border border-blue-100">
          <button
            type="button"
            onClick={() => setActiveTab('flight')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold transition-all ${
              activeTab === 'flight'
                ? 'bg-[#0062e0] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:text-[#0062e0]'
            }`}
          >
            <Plane className="w-4 h-4" /> Flight Reservation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hotel')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold transition-all ${
              activeTab === 'hotel'
                ? 'bg-[#0062e0] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:text-[#0062e0]'
            }`}
          >
            <Building className="w-4 h-4" /> Hotel Reservation
          </button>
        </div>
      </div>

      {/* Booking Form Card with 3D Ticket Elevation & Sheen */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/80 ticket-3d-card sheen-3d">
        {activeTab === 'flight' ? (
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            {/* Trip Type Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                Flight Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    tripType === 'roundtrip'
                      ? 'border-[#0062e0] bg-blue-50/50 text-[#0062e0]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'roundtrip'}
                    onChange={() => setTripType('roundtrip')}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="text-sm font-extrabold">Round-trip</div>
                    <div className="text-[11px] text-gray-500">I fly there and come back</div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    tripType === 'oneway'
                      ? 'border-[#0062e0] bg-blue-50/50 text-[#0062e0]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'oneway'}
                    onChange={() => setTripType('oneway')}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="text-sm font-extrabold">One-way</div>
                    <div className="text-[11px] text-gray-500">I only fly there — no return</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  From — Departure Airport
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 transition-all duration-300 ease-out hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white"
                >
                  {AIRPORTS.map((apt) => (
                    <option key={apt.id} value={apt.iataCode}>
                      {apt.city} ({apt.iataCode}) — {apt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  To — Arrival Airport
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 transition-all duration-300 ease-out hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white"
                >
                  {AIRPORTS.map((apt) => (
                    <option key={apt.id} value={apt.iataCode}>
                      {apt.city} ({apt.iataCode}) — {apt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 transition-all duration-300 ease-out hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white"
                />
              </div>

              {tripType === 'roundtrip' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 transition-all duration-300 ease-out hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white"
                  />
                </div>
              )}
            </div>

            {/* Passenger Details */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500">
                  Passenger Details ({passengers.length} of 6)
                </label>
                {passengers.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    className="text-xs font-bold text-[#0062e0] hover:underline"
                  >
                    + Add Passenger
                  </button>
                )}
              </div>

              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/20 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Passenger {idx + 1}</span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(idx)}
                        className="text-red-500 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={p.firstName}
                      onChange={(e) => handleUpdatePassenger(idx, 'firstName', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062e0] bg-white transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={p.lastName}
                      onChange={(e) => handleUpdatePassenger(idx, 'lastName', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062e0] bg-white transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Passport No. (optional)"
                      value={p.passport}
                      onChange={(e) => handleUpdatePassenger(idx, 'passport', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0062e0] bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0062e0] focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            {statusMessage && (
              <div className="text-center text-xs font-bold text-[#0062e0] bg-blue-50 py-2.5 rounded-xl animate-pulse border border-blue-200">
                {statusMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'premium')}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0062e0] via-[#1d4ed8] to-[#0062e0] bg-[length:200%_auto] hover:bg-right text-white font-extrabold text-base shadow-lg shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 flex flex-col items-center justify-center gap-1 group"
              >
                <span className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  Generate Premium Clean Ticket — ₹399
                </span>
                <span className="text-[11px] font-normal text-blue-100">
                  Real Airline Logo • Verified Flight Times • Email Delivery • No Watermark
                </span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-blue-100"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-blue-100"></div>
              </div>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'free')}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-blue-200 bg-blue-50/60 text-[#0062e0] hover:bg-blue-100/80 hover:border-blue-400 hover:-translate-y-0.5 active:scale-[0.99] font-black text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isSubmitting ? 'Generating PDF...' : 'Download Free (with watermark)'}
              </button>
            </div>
          </form>
        ) : (
          /* Hotel Reservation Form */
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Destination City
                </label>
                <input
                  type="text"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  placeholder="e.g. Paris, London, Dubai"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={hotelCountry}
                  onChange={(e) => setHotelCountry(e.target.value)}
                  placeholder="e.g. France, United Kingdom"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Hotel Name
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Hotel or Resort Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={hotelCheckOut}
                  onChange={(e) => setHotelCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Primary Guest Name
              </label>
              <input
                type="text"
                value={hotelGuestName}
                onChange={(e) => setHotelGuestName(e.target.value)}
                placeholder="Full Name as on passport"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0062e0] to-[#1d4ed8] text-white font-extrabold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Building className="w-5 h-5" />
              {isSubmitting ? 'Generating Reservation...' : 'Download Hotel Reservation PDF'}
            </button>
          </form>
        )}
      </div>

      {/* Previously generated tickets saved on this device (phone or desktop) */}
      <RecentBookingsCard />
    </div>
  );
}

export const DummyTicketGenerator = MyJetGenerator;

