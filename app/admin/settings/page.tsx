import React from 'react';
import { getBrandConfig } from '@/lib/config/brand';
import { SettingsManagerClient } from './SettingsManagerClient';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  const brand = getBrandConfig();
  return <SettingsManagerClient brand={brand} />;
}
