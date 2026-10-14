import React from 'react';
import { listCatalog } from '@/lib/booking/store';
import { CrudColumn, CrudManager } from '@/components/admin/CrudManager';

const COLUMNS: CrudColumn[] = [
  {
    key: 'iata_code',
    label: 'IATA Code',
    type: 'text',
    required: true,
    placeholder: 'e.g. 6E, AI, IX',
  },
  {
    key: 'icao_code',
    label: 'ICAO Code',
    type: 'text',
    placeholder: 'e.g. IGO, AIC, AXB',
  },
  {
    key: 'name',
    label: 'Airline Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. IndiGo, Air India',
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    placeholder: 'e.g. India',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'indian', label: 'Indian Carrier' },
      { value: 'international', label: 'International Partner' },
    ],
  },
  {
    key: 'brand_color',
    label: 'Brand Hex Color',
    type: 'text',
    placeholder: 'e.g. #001B94, #B81D13',
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Disabled' },
    ],
  },
  {
    key: 'is_verified',
    label: 'Verified',
    type: 'boolean',
    options: [
      { value: 'true', label: 'Verified' },
      { value: 'false', label: 'Unverified' },
    ],
  },
];

export default async function AdminAirlinesPage() {
  const airlines = await listCatalog('airline');

  return (
    <div className="space-y-6">
      <CrudManager
        entity="airline"
        title={`Airlines Directory (${airlines.length})`}
        description="Configure operating airlines, IATA/ICAO identifiers, branding colors, and active carrier status."
        columns={COLUMNS}
        rows={airlines}
        emptyHint="No airline records found. Click 'Add New' to configure an airline."
      />
    </div>
  );
}

