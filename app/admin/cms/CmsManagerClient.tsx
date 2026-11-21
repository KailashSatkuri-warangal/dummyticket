'use client';

import React, { useState } from 'react';
import {
  LayoutTemplate,
  Save,
  CheckCircle2,
  Globe,
  Building,
  Shield,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';

export function CmsManagerClient({
  initialSettings,
}: {
  initialSettings: Record<string, any>;
}) {
  const [activeTab, setActiveTab] = useState<'hero' | 'company' | 'legal' | 'seo'>('hero');
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  // Form Fields
  const [heroTitle, setHeroTitle] = useState(
    initialSettings.cms_hero_title || 'Free Dummy Ticket Generator for Visa Applications'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSettings.cms_hero_subtitle ||
      'Generate confirmed-format flight reservations with valid booking reference & scannable QR verification in 30 seconds.'
  );
  const [heroBadge, setHeroBadge] = useState(
    initialSettings.cms_hero_badge || '100% Free · No Registration · Instant PDF'
  );
  const [promoBanner, setPromoBanner] = useState(
    initialSettings.cms_promo_banner ||
      'Schengen & US Visa Season 2026: Fast verifiable reservations with real airline PNR available.'
  );

  const [brandName, setBrandName] = useState(
    initialSettings.cms_brand_name || 'DummyTicket'
  );
  const [brandTagline, setBrandTagline] = useState(
    initialSettings.cms_brand_tagline ||
      'Flight Itinerary & Temporary Reservation Management Platform'
  );
  const [supportEmail, setSupportEmail] = useState(
    initialSettings.cms_support_email || 'support@dummyticket.com'
  );
  const [supportPhone, setSupportPhone] = useState(
    initialSettings.cms_support_phone || '+91 98112 34567'
  );
  const [businessAddress, setBusinessAddress] = useState(
    initialSettings.cms_business_address ||
      'DummyTicket Aviation Technologies Ltd, Worldwide Service'
  );

  const [disclaimerNotice, setDisclaimerNotice] = useState(
    initialSettings.cms_disclaimer_notice ||
      'DummyTicket provides flight reservations as supporting documents for visa applications and border control. Each document is an itinerary reservation — not a paid ticket for actual travel.'
  );

  const [seoTitle, setSeoTitle] = useState(
    initialSettings.cms_seo_title ||
      'DummyTicket — Flight Itinerary & Temporary Reservation Management Platform'
  );
  const [seoDescription, setSeoDescription] = useState(
    initialSettings.cms_seo_description ||
      'Free dummy ticket generator for visa applications and proof of onward travel. Instant downloadable PDF with booking reference and QR code.'
  );
  const [socialTwitter, setSocialTwitter] = useState(
    initialSettings.cms_social_twitter || 'https://twitter.com/dummyticket'
  );
  const [socialLinkedin, setSocialLinkedin] = useState(
    initialSettings.cms_social_linkedin || 'https://linkedin.com/company/dummyticket'
  );

  async function handleSaveSection(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setBanner(null);

    const payload: Record<string, string> = {
      cms_hero_title: heroTitle,
      cms_hero_subtitle: heroSubtitle,
      cms_hero_badge: heroBadge,
      cms_promo_banner: promoBanner,
      cms_brand_name: brandName,
      cms_brand_tagline: brandTagline,
      cms_support_email: supportEmail,
      cms_support_phone: supportPhone,
      cms_business_address: businessAddress,
      cms_disclaimer_notice: disclaimerNotice,
      cms_seo_title: seoTitle,
      cms_seo_description: seoDescription,
      cms_social_twitter: socialTwitter,
      cms_social_linkedin: socialLinkedin,
    };

    try {
      for (const [key, value] of Object.entries(payload)) {
        await fetch('/api/admin/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UPDATE_CMS_SETTING',
            settingKey: key,
            settingValue: value,
          }),
        });
      }

      setBanner('CMS content settings saved successfully and live on customer website.');
    } catch (err: any) {
      alert(err.message || 'Error saving CMS settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {banner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{banner}</span>
          <button onClick={() => setBanner(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-black text-slate-600">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'hero' ? 'bg-white text-navy-900 shadow-sm' : 'hover:text-navy-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>1. Hero & Banners</span>
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'company' ? 'bg-white text-navy-900 shadow-sm' : 'hover:text-navy-900'
          }`}
        >
          <Building className="w-4 h-4 text-indigo-600" />
          <span>2. Brand & Contact</span>
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'legal' ? 'bg-white text-navy-900 shadow-sm' : 'hover:text-navy-900'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>3. Legal & Disclaimer</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'seo' ? 'bg-white text-navy-900 shadow-sm' : 'hover:text-navy-900'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-600" />
          <span>4. SEO & Social</span>
        </button>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSaveSection} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        {activeTab === 'hero' && (
          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Homepage Main Heading (H1)</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-navy-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Hero Subtitle / Value Proposition</label>
              <textarea
                rows={2}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Hero Trust Eyebrow Badge</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={promoBanner}
                  onChange={(e) => setPromoBanner(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-navy-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Customer Support Email</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Support Phone Hotline</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Corporate / Registered Operating Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Global Visa Compliance & Itinerary Disclaimer Notice</label>
              <textarea
                rows={4}
                required
                value={disclaimerNotice}
                onChange={(e) => setDisclaimerNotice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-normal">
                This notice is rendered in footer and checkout summaries to guarantee legal transparency that itineraries are temporary reservations and not sold as confirmed boarding passes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Global Meta Title (SEO & OpenGraph)</label>
              <input
                type="text"
                required
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                required
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Changes persist to live database configuration instantly.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Live CMS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
