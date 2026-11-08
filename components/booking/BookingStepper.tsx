'use client';

import React from 'react';
import { Check } from 'lucide-react';

export type BookingStepId =
  | 'search'
  | 'select'
  | 'passengers'
  | 'payment'
  | 'confirmation';

const STEPS: Array<{ id: BookingStepId; label: string }> = [
  { id: 'search', label: 'Search' },
  { id: 'select', label: 'Select' },
  { id: 'passengers', label: 'Passenger details' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Confirmation' },
];

export function BookingStepper({
  activeStep,
  currentStep,
}: {
  activeStep?: BookingStepId;
  currentStep?: BookingStepId;
}) {
  const stepToUse = activeStep ?? currentStep ?? 'search';
  const activeIdx = STEPS.findIndex((s) => s.id === stepToUse);

  return (
    <nav
      aria-label="Booking Progress"
      className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm"
    >
      {/* Top micro progress bar */}
      <div className="flex items-center gap-1.5 mb-3">
        {STEPS.map((step, idx) => (
          <div
            key={`bar-${step.id}`}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx < activeIdx
                ? 'bg-verified-500'
                : idx === activeIdx
                ? 'bg-brand-600 shadow-sm shadow-brand-500/50'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      <ol className="flex items-center justify-between gap-1 overflow-x-auto scroll-slim">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIdx;
          const isCurrent = index === activeIdx;

          return (
            <li
              key={step.id}
              className={`flex items-center gap-2 shrink-0 ${
                isCurrent ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-60'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black transition-all ${
                  isCompleted
                    ? 'bg-verified-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : index + 1}
              </span>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  isCurrent
                    ? 'text-brand-700'
                    : isCompleted
                    ? 'text-navy-900'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden md:block h-0.5 w-6 sm:w-10 rounded ${
                    isCompleted ? 'bg-verified-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
