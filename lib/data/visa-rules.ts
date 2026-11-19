export interface CountryVisaInfo {
  iso2: string;
  name: string;
  flag: string;
  slug: string;
  continent: string;
  passportRank?: number;
}

export interface VisaRequirement {
  status: 'visa_free' | 'visa_on_arrival' | 'evisa' | 'visa_required';
  statusLabel: string;
  duration: string;
  costEstimate: string;
  processingTime: string;
  notes: string;
  requiresReturnTicket: boolean;
  requiresHotel: boolean;
}

export const COUNTRIES: CountryVisaInfo[] = [
  { iso2: 'IN', name: 'India', flag: '🇮🇳', slug: 'india', continent: 'Asia', passportRank: 80 },
  { iso2: 'US', name: 'United States', flag: '🇺🇸', slug: 'united-states', continent: 'North America', passportRank: 7 },
  { iso2: 'GB', name: 'United Kingdom', flag: '🇬🇧', slug: 'united-kingdom', continent: 'Europe', passportRank: 4 },
  { iso2: 'CA', name: 'Canada', flag: '🇨🇦', slug: 'canada', continent: 'North America', passportRank: 8 },
  { iso2: 'AU', name: 'Australia', flag: '🇦🇺', slug: 'australia', continent: 'Oceania', passportRank: 5 },
  { iso2: 'DE', name: 'Germany', flag: '🇩🇪', slug: 'germany', continent: 'Europe', passportRank: 2 },
  { iso2: 'FR', name: 'France', flag: '🇫🇷', slug: 'france', continent: 'Europe', passportRank: 2 },
  { iso2: 'IT', name: 'Italy', flag: '🇮🇹', slug: 'italy', continent: 'Europe', passportRank: 2 },
  { iso2: 'ES', name: 'Spain', flag: '🇪🇸', slug: 'spain', continent: 'Europe', passportRank: 2 },
  { iso2: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', slug: 'united-arab-emirates', continent: 'Asia', passportRank: 12 },
  { iso2: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', slug: 'saudi-arabia', continent: 'Asia', passportRank: 60 },
  { iso2: 'SG', name: 'Singapore', flag: '🇸🇬', slug: 'singapore', continent: 'Asia', passportRank: 1 },
  { iso2: 'MY', name: 'Malaysia', flag: '🇲🇾', slug: 'malaysia', continent: 'Asia', passportRank: 11 },
  { iso2: 'TH', name: 'Thailand', flag: '🇹🇭', slug: 'thailand', continent: 'Asia', passportRank: 64 },
  { iso2: 'ID', name: 'Indonesia', flag: '🇮🇩', slug: 'indonesia', continent: 'Asia', passportRank: 66 },
  { iso2: 'PH', name: 'Philippines', flag: '🇵🇭', slug: 'philippines', continent: 'Asia', passportRank: 73 },
  { iso2: 'VN', name: 'Vietnam', flag: '🇻🇳', slug: 'vietnam', continent: 'Asia', passportRank: 82 },
  { iso2: 'JP', name: 'Japan', flag: '🇯🇵', slug: 'japan', continent: 'Asia', passportRank: 2 },
  { iso2: 'KR', name: 'South Korea', flag: '🇰🇷', slug: 'south-korea', continent: 'Asia', passportRank: 3 },
  { iso2: 'TR', name: 'Turkey', flag: '🇹🇷', slug: 'turkey', continent: 'Europe', passportRank: 52 },
  { iso2: 'EG', name: 'Egypt', flag: '🇪🇬', slug: 'egypt', continent: 'Africa', passportRank: 88 },
  { iso2: 'ZA', name: 'South Africa', flag: '🇿🇦', slug: 'south-africa', continent: 'Africa', passportRank: 51 },
  { iso2: 'NG', name: 'Nigeria', flag: '🇳🇬', slug: 'nigeria', continent: 'Africa', passportRank: 92 },
  { iso2: 'KE', name: 'Kenya', flag: '🇰🇪', slug: 'kenya', continent: 'Africa', passportRank: 68 },
  { iso2: 'GH', name: 'Ghana', flag: '🇬🇭', slug: 'ghana', continent: 'Africa', passportRank: 76 },
  { iso2: 'PK', name: 'Pakistan', flag: '🇵🇰', slug: 'pakistan', continent: 'Asia', passportRank: 100 },
  { iso2: 'BD', name: 'Bangladesh', flag: '🇧🇩', slug: 'bangladesh', continent: 'Asia', passportRank: 97 },
  { iso2: 'LK', name: 'Sri Lanka', flag: '🇱🇰', slug: 'sri-lanka', continent: 'Asia', passportRank: 95 },
  { iso2: 'NP', name: 'Nepal', flag: '🇳🇵', slug: 'nepal', continent: 'Asia', passportRank: 98 },
  { iso2: 'MV', name: 'Maldives', flag: '🇲🇻', slug: 'maldives', continent: 'Asia', passportRank: 58 },
  { iso2: 'BR', name: 'Brazil', flag: '🇧🇷', slug: 'brazil', continent: 'South America', passportRank: 18 },
  { iso2: 'AR', name: 'Argentina', flag: '🇦🇷', slug: 'argentina', continent: 'South America', passportRank: 17 },
  { iso2: 'MX', name: 'Mexico', flag: '🇲🇽', slug: 'mexico', continent: 'North America', passportRank: 23 },
  { iso2: 'RU', name: 'Russia', flag: '🇷🇺', slug: 'russia', continent: 'Europe', passportRank: 49 },
  { iso2: 'CN', name: 'China', flag: '🇨🇳', slug: 'china', continent: 'Asia', passportRank: 62 },
  { iso2: 'CH', name: 'Switzerland', flag: '🇨🇭', slug: 'switzerland', continent: 'Europe', passportRank: 3 },
  { iso2: 'NL', name: 'Netherlands', flag: '🇳🇱', slug: 'netherlands', continent: 'Europe', passportRank: 3 },
  { iso2: 'SE', name: 'Sweden', flag: '🇸🇪', slug: 'sweden', continent: 'Europe', passportRank: 3 },
  { iso2: 'NO', name: 'Norway', flag: '🇳🇴', slug: 'norway', continent: 'Europe', passportRank: 4 },
  { iso2: 'NZ', name: 'New Zealand', flag: '🇳🇿', slug: 'new-zealand', continent: 'Oceania', passportRank: 6 },
  { iso2: 'QA', name: 'Qatar', flag: '🇶🇦', slug: 'qatar', continent: 'Asia', passportRank: 53 },
  { iso2: 'KW', name: 'Kuwait', flag: '🇰🇼', slug: 'kuwait', continent: 'Asia', passportRank: 54 },
  { iso2: 'OM', name: 'Oman', flag: '🇴🇲', slug: 'oman', continent: 'Asia', passportRank: 59 },
  { iso2: 'BH', name: 'Bahrain', flag: '🇧🇭', slug: 'bahrain', continent: 'Asia', passportRank: 61 },
  { iso2: 'IE', name: 'Ireland', flag: '🇮🇪', slug: 'ireland', continent: 'Europe', passportRank: 3 },
  { iso2: 'PT', name: 'Portugal', flag: '🇵🇹', slug: 'portugal', continent: 'Europe', passportRank: 4 },
  { iso2: 'GR', name: 'Greece', flag: '🇬🇷', slug: 'greece', continent: 'Europe', passportRank: 5 },
  { iso2: 'AT', name: 'Austria', flag: '🇦🇹', slug: 'austria', continent: 'Europe', passportRank: 3 },
  { iso2: 'BE', name: 'Belgium', flag: '🇧🇪', slug: 'belgium', continent: 'Europe', passportRank: 4 },
  { iso2: 'PL', name: 'Poland', flag: '🇵🇱', slug: 'poland', continent: 'Europe', passportRank: 6 },
];

export function getVisaRule(passportIso: string, destIso: string): VisaRequirement {
  if (passportIso === destIso) {
    return {
      status: 'visa_free',
      statusLabel: 'Domestic / Citizen Right',
      duration: 'Unlimited Freedom of Movement',
      costEstimate: 'Free (₹0)',
      processingTime: 'Instant',
      notes: 'You hold a passport of this country and have unconditional right of entry.',
      requiresReturnTicket: false,
      requiresHotel: false,
    };
  }

  // Strong Western passports
  const powerful = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'SG', 'JP', 'KR', 'CH', 'NL', 'SE', 'NO', 'NZ'];
  // Schengen list
  const schengen = ['DE', 'FR', 'IT', 'ES', 'CH', 'NL', 'SE', 'NO', 'AT', 'BE', 'PT', 'GR', 'PL'];

  if (powerful.includes(passportIso) && (schengen.includes(destIso) || destIso === 'GB' || destIso === 'US' || destIso === 'CA' || destIso === 'JP' || destIso === 'SG')) {
    return {
      status: 'visa_free',
      statusLabel: 'Visa Free (eTA / ESTA / 90 Days)',
      duration: 'Up to 90 days stay',
      costEstimate: 'Free or minimal eTA (₹1,500)',
      processingTime: 'Instant to 72 hours',
      notes: 'Entry granted without traditional visa. Valid passport (min 6 months) and proof of return/onward travel ticket required at airline boarding.',
      requiresReturnTicket: true,
      requiresHotel: true,
    };
  }

  // Indian passport specific common routes
  if (passportIso === 'IN') {
    if (['TH', 'MY', 'MV', 'NP', 'LK', 'KE'].includes(destIso)) {
      return {
        status: destIso === 'TH' || destIso === 'MY' ? 'visa_free' : 'visa_on_arrival',
        statusLabel: destIso === 'TH' || destIso === 'MY' ? 'Visa Free (Tourist Waiver)' : 'Visa on Arrival (VoA)',
        duration: '15 to 30 days',
        costEstimate: destIso === 'TH' || destIso === 'MY' ? 'Free (₹0)' : '₹2,500 – ₹4,000',
        processingTime: 'Instant on Arrival',
        notes: 'Indian travelers enjoy visa exemption or instant VoA. Mandatory: Confirmed round-trip flight ticket / dummy ticket, hotel voucher, and minimum funds proof.',
        requiresReturnTicket: true,
        requiresHotel: true,
      };
    }
    if (['AE', 'VN', 'TR', 'EG', 'OM', 'BH'].includes(destIso)) {
      return {
        status: 'evisa',
        statusLabel: 'e-Visa Online',
        duration: '30 to 60 days',
        costEstimate: '₹3,500 – ₹7,000',
        processingTime: '24 to 72 hours online',
        notes: 'Apply online prior to boarding. Requires scanned passport bio-page, photograph, and confirmed return flight reservation (Dummy Ticket).',
        requiresReturnTicket: true,
        requiresHotel: true,
      };
    }
    if (schengen.includes(destIso) || ['US', 'GB', 'CA', 'AU'].includes(destIso)) {
      return {
        status: 'visa_required',
        statusLabel: 'Embassy / Consulate Visa Required',
        duration: 'Strictly as per approved travel itinerary',
        costEstimate: '₹7,500 – ₹16,000 (Embassy / VFS fee)',
        processingTime: '15 to 30 working days',
        notes: 'Mandatory embassy submission. You MUST provide a verifiable flight reservation itinerary (Dummy Ticket with airline PNR), hotel accommodation proof, cover letter, and 6 months bank statement.',
        requiresReturnTicket: true,
        requiresHotel: true,
      };
    }
  }

  // Southeast Asian / GCC reciprocity
  if (['SG', 'MY', 'TH', 'ID', 'PH', 'VN'].includes(passportIso) && ['SG', 'MY', 'TH', 'ID', 'PH', 'VN'].includes(destIso)) {
    return {
      status: 'visa_free',
      statusLabel: 'ASEAN Visa Exemption',
      duration: '30 days stay',
      costEstimate: 'Free (₹0)',
      processingTime: 'Instant Entry',
      notes: 'Visa exemption under ASEAN treaty. Valid passport and confirmed onward ticket required at airline check-in.',
      requiresReturnTicket: true,
      requiresHotel: false,
    };
  }

  // General fallback logic
  if (schengen.includes(destIso) || ['US', 'GB', 'CA', 'AU'].includes(destIso)) {
    return {
      status: 'visa_required',
      statusLabel: 'Embassy Visa Required',
      duration: 'Subject to consular approval',
      costEstimate: '₹8,000 – ₹15,000',
      processingTime: '10 to 25 working days',
      notes: 'In-person biometric appointment required. Submit a valid flight itinerary / dummy ticket, proof of lodging, and travel insurance.',
      requiresReturnTicket: true,
      requiresHotel: true,
    };
  }

  return {
    status: 'evisa',
    statusLabel: 'e-Visa / Travel Authorization',
    duration: '30 days single / multiple entry',
    costEstimate: '₹3,000 – ₹6,000',
    processingTime: '2 to 4 working days',
    notes: 'Apply online with digital passport scan, return flight booking confirmation, and accommodation proof.',
    requiresReturnTicket: true,
    requiresHotel: true,
  };
}
