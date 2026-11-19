'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number; // duration in ms, default 1500ms
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1600,
  prefix = '',
  suffix = '',
  className = '',
  decimals,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('0');

  // Parse string if needed (e.g. "6,000+", "100%", "30s", "4.8")
  const rawString = String(value).trim();
  const matched = rawString.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);

  const extractedPrefix = prefix || (matched ? matched[1] : '');
  const extractedSuffix = suffix || (matched ? matched[3] : '');
  const numString = matched ? matched[2].replace(/,/g, '') : rawString.replace(/,/g, '');
  const targetNumber = parseFloat(numString) || 0;
  const isFloat = numString.includes('.');
  const detectedDecimals = decimals !== undefined ? decimals : isFloat ? (numString.split('.')[1]?.length || 1) : 0;
  const useCommas = rawString.includes(',');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      setDisplayValue(formatNumber(targetNumber, detectedDecimals, useCommas));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, targetNumber]);

  function formatNumber(num: number, dec: number, commas: boolean): string {
    const formatted = dec > 0 ? num.toFixed(dec) : Math.round(num).toString();
    if (commas) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return formatted;
  }

  function animateCount() {
    const startTime = performance.now();
    const startVal = 0;

    function frame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetNumber - startVal) * easeProgress;

      setDisplayValue(formatNumber(current, detectedDecimals, useCommas));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayValue(formatNumber(targetNumber, detectedDecimals, useCommas));
      }
    }

    requestAnimationFrame(frame);
  }

  return (
    <span ref={ref} className={`inline-block tabular-nums font-inherit ${className}`}>
      {extractedPrefix}
      {hasAnimated ? displayValue : '0'}
      {extractedSuffix}
    </span>
  );
}
