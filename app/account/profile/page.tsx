import React from 'react';
import { getProfileById } from '@/lib/booking/store';
import { getSessionUser } from '@/lib/auth/session';
import { ProfileSettingsForm } from '@/components/account/ProfileSettingsForm';

export default async function AccountProfilePage() {
  const user = await getSessionUser();
  const profile = user ? await getProfileById(user.id) : undefined;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Profile & Traveler Preferences
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage your contact details, preferred currency, and explicit traveler storage consent.
        </p>
      </div>

      <ProfileSettingsForm
        email={user?.email ?? ''}
        initialFullName={profile?.fullName ?? user?.fullName ?? ''}
        initialPhone={profile?.phone ?? user?.phone ?? ''}
        initialCurrency={profile?.preferredCurrency ?? 'INR'}
        initialSaveTravelerConsent={profile?.saveTravelerConsent ?? false}
        initialMarketingConsent={profile?.marketingConsent ?? false}
      />
    </div>
  );
}
