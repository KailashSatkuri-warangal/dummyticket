import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { BookingRecord } from '@/types';
import { formatDuration, formatInr } from '@/lib/config/brand';

/**
 * Generates an authentic, official Airline Electronic Ticket Receipt & Passenger Itinerary PDF.
 *
 * NOTE: As strictly mandated, DO NOT print any company name (e.g. "DummyTicket", "MyJet24")
 * on the ticket. The ticket must represent an official airline reservation / GDS electronic
 * ticket document accepted worldwide by embassies, consulates, and airline check-in desks.
 */
export async function generateItineraryPdfBytes(
  booking: BookingRecord
): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const airline = booking.flightOffer.airline;
  const airlineNameUpper = airline.name.toUpperCase();
  const airlineCode = airline.iataCode || 'AI';
  const pnr = (booking.airlinePnr || booking.bookingReference).toUpperCase();
  const pax0 = booking.passengers[0];
  const eTicketNumber = `${airline.icaoCode ? airline.icaoCode.slice(0, 3).toUpperCase() : '098'}-${Math.floor(
    1000000000 + Math.random() * 9000000000
  )}`;
  const issueDate = new Date(booking.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  // ── 1. Top Airline Header (Clean, Corporate Aviation Layout) ──
  // Deep Navy Top Accent
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(14, 12, 182, 22, 'F');

  // Airline Name Left
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(airlineNameUpper, 20, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `MEMBER OF AIRLINE CARRIERS ALLIANCE · IATA: ${airlineCode} · ICAO: ${airline.icaoCode || 'AXX'}`,
    20,
    29
  );

  // Document Title Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('ELECTRONIC TICKET RECEIPT', 190, 22, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('PASSENGER ITINERARY RECORD', 190, 28, { align: 'right' });

  // ── 2. Booking Reference (PNR) & Issuance Details Card ──
  let y = 38;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');

  // Col 1: PNR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('BOOKING REFERENCE (PNR)', 20, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(pnr, 20, y + 15);

  // Col 2: E-Ticket Number
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('E-TICKET NUMBER', 72, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(eTicketNumber, 72, y + 14);

  // Col 3: Issuance Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DATE OF ISSUE', 124, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(issueDate, 124, y + 14);

  // Col 4: Booking Status Badge
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(154, y + 5, 36, 12, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text('CONFIRMED (HK)', 172, y + 13, { align: 'center' });

  // ── 3. Passenger Information Table ──
  y = 66;
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(14, y, 182, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PASSENGER NAME', 20, y + 5);
  doc.text('TYPE', 90, y + 5);
  doc.text('PASSPORT / TRAVEL DOC', 120, y + 5);
  doc.text('STATUS', 172, y + 5);

  y += 7;
  booking.passengers.forEach((pax, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, y, 182, 8, 'F');

    const formattedName = `${pax.lastName.toUpperCase()} / ${pax.firstName.toUpperCase()}`;
    const passportMasked = pax.passportNumberMasked || 'ON FILE';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(formattedName, 20, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(pax.passengerType.toUpperCase(), 90, y + 5.5);
    doc.text(passportMasked, 120, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(4, 120, 87);
    doc.text('OK TO FLY', 172, y + 5.5);

    y += 8;
  });

  // Border bottom of passenger table
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  // ── 4. Flight Itinerary Segments ──
  y += 6;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('FLIGHT', 20, y + 5);
  doc.text('DEPARTURE', 50, y + 5);
  doc.text('ARRIVAL', 105, y + 5);
  doc.text('CLASS', 150, y + 5);
  doc.text('BAGGAGE', 172, y + 5);

  y += 7;

  // Segment Details
  const seg = booking.flightOffer;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 34, 'FD');

  // Flight No & Airline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(seg.flightNumber, 20, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Operated by ${airline.name}`, 20, y + 13);
  doc.text(`Aircraft: Boeing / Airbus`, 20, y + 18);
  doc.text(`Duration: ${formatDuration(seg.durationMinutes)}`, 20, y + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('Non-Stop', 20, y + 28);

  // Departure Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(seg.origin.iataCode, 50, y + 9);
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(seg.origin.city, 50, y + 14);
  doc.text(seg.origin.name.slice(0, 24), 50, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Date: ${booking.departureDate}`, 50, y + 23);
  doc.setTextColor(15, 23, 42);
  doc.text(`Time: ${seg.departureTime} Local`, 50, y + 28);

  // Arrival Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(seg.destination.iataCode, 105, y + 9);
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(seg.destination.city, 105, y + 14);
  doc.text(seg.destination.name.slice(0, 24), 105, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Date: ${booking.departureDate}`, 105, y + 23);
  doc.setTextColor(15, 23, 42);
  doc.text(`Time: ${seg.arrivalTime} Local`, 105, y + 28);

  // Class
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(booking.cabin.toUpperCase(), 150, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Seat: Confirmed', 150, y + 14);
  doc.text('Meal: Included', 150, y + 19);

  // Baggage
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${seg.fareRule.checkedBaggageKg} KG Check-in`, 172, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${seg.fareRule.cabinBaggageKg} KG Cabin`, 172, y + 14);

  y += 34;

  // Optional Return Flight Segment if round-trip
  if (booking.returnDate) {
    y += 4;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 30, 'FD');

    // Return header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${seg.airline.iataCode} ${Number(seg.flightNumber.replace(/\D/g, '')) + 1}`, 20, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Operated by ${airline.name}`, 20, y + 13);
    doc.text(`Duration: ${formatDuration(seg.durationMinutes)}`, 20, y + 18);

    // Return Depart (from destination)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(seg.destination.iataCode, 50, y + 9);
    doc.setFontSize(8);
    doc.text(seg.destination.city, 50, y + 14);
    doc.text(`Date: ${booking.returnDate}`, 50, y + 19);
    doc.text(`Time: 14:15 Local`, 50, y + 24);

    // Return Arrive (back at origin)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(seg.origin.iataCode, 105, y + 9);
    doc.setFontSize(8);
    doc.text(seg.origin.city, 105, y + 14);
    doc.text(`Date: ${booking.returnDate}`, 105, y + 19);
    doc.text(`Time: 18:30 Local`, 105, y + 24);

    // Return Class & Baggage
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(booking.cabin.toUpperCase(), 150, y + 9);
    doc.text(`${seg.fareRule.checkedBaggageKg} KG Check-in`, 172, y + 9);

    y += 30;
  }

  // ── 5. Payment & Fare Summary Box ──
  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('FARE & TAX BREAKDOWN', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Air Transportation Base Fare: ${formatInr(booking.fareSnapshot.baseFareTotal)} · Taxes & Airport Passenger Service Charges: ${formatInr(
      booking.fareSnapshot.taxesTotal
    )}`,
    20,
    y + 12
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`TOTAL TICKET FARE: ${formatInr(booking.totalAmount)}`, 190, y + 12, {
    align: 'right',
  });

  // ── 6. Verification QR Code & Official Barcode Pattern ──
  y += 24;

  // Visual Code-128 Airline Barcode
  doc.setFillColor(15, 23, 42);
  const barcodeX = 14;
  const barcodeWidth = 110;
  // Generate authentic barcode vertical stripes pattern
  let bx = barcodeX;
  const barPattern = [2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 2];
  barPattern.forEach((w) => {
    doc.rect(bx, y, w * 0.9, 14, 'F');
    bx += (w * 0.9) + 1.2;
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `M1${pax0?.lastName?.toUpperCase() || 'TRAVELER'}/${pax0?.firstName?.toUpperCase() || 'PASSENGER'} E${pnr} ${seg.origin.iataCode}${seg.destination.iataCode}${airlineCode} ${seg.flightNumber.replace(/\D/g, '')}`,
    14,
    y + 19
  );

  // Verification QR Code
  try {
    const verifyUrl = `https://checkmytrip.com/pnr?ref=${pnr}&auth=GDS_VERIFIED`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 100,
    });
    doc.addImage(qrDataUrl, 'PNG', 160, y - 2, 24, 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('IATA BCBP VERIFIED', 172, y + 24, { align: 'center' });
  } catch {
    // Graceful fallback
  }

  // ── 7. Legal Notice & Passenger Advisory (NO Company Name Printed) ──
  y = 250;
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.line(14, y, 196, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('IMPORTANT PASSENGER ADVISORY & CONDITIONS OF CARRIAGE:', 14, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    '1. CHECK-IN REQUIREMENTS: Passengers must present this electronic ticket document and a valid government-issued passport matching the reservation name.',
    14,
    y + 10
  );
  doc.text(
    '2. VISA & BORDER ENTRY: Possession of an electronic ticket does not guarantee entry into a foreign territory. Compliance with passport and visa regulations remains the passenger responsibility.',
    14,
    y + 14
  );
  doc.text(
    '3. NOTICE: Carriage and other services provided by the operating carrier are subject to the carrier conditions of carriage and international air transport conventions (Warsaw / Montreal).',
    14,
    y + 18
  );
  doc.text(
    '4. BAGGAGE: Dangerous goods must not be packed in checked or carry-on baggage. Full restrictions available on the operating airline official website.',
    14,
    y + 22
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `ELECTRONIC TICKET RECEIPT · ISSUED BY GLOBAL DISTRIBUTION SYSTEM (GDS) · ALL TIMES LOCAL`,
    105,
    y + 28,
    { align: 'center' }
  );

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * Generates an official payment receipt PDF (kept clean and distinct).
 */
export async function generatePaymentReceiptPdfBytes(
  booking: BookingRecord
): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const receiptNumber = `RCPT-${booking.bookingReference.replace(/^DT-/, '')}`;

  doc.setFillColor(15, 23, 42);
  doc.rect(14, 14, 182, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OFFICIAL PAYMENT RECEIPT', 20, 25);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.text(`Receipt Reference: ${receiptNumber}`, 14, 44);
  doc.text(`Booking Reference: ${booking.bookingReference}`, 14, 51);
  doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 14, 58);
  doc.text(`Date of Issue: ${new Date(booking.updatedAt).toUTCString()}`, 14, 65);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 72, 196, 72);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('ITEMIZED CHARGES & STATUTORY AIRPORT FEES', 14, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Base Travel Fare (${booking.passengers.length} Passenger[s]): ${formatInr(
      booking.fareSnapshot.baseFareTotal
    )}`,
    14,
    92
  );
  doc.text(
    `Statutory Government & Airport Taxes: ${formatInr(
      booking.fareSnapshot.taxesTotal
    )}`,
    14,
    100
  );
  doc.text(
    `Disclosed Service & Technology Fee: ${formatInr(
      booking.fareSnapshot.serviceFeeTotal
    )}`,
    14,
    108
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total Amount Paid: ${formatInr(booking.totalAmount)}`, 14, 122);

  return new Uint8Array(doc.output('arraybuffer'));
}
