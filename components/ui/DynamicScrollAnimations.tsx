'use client';

import React, { useEffect, useState } from 'react';

/**
 * Universal dynamic scroll animations & counter animator
 * Mounts in RootLayout to animate content fade-ins, reveals, and number count-ups across every page.
 */
export function DynamicScrollAnimations() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. TOP SCROLL PROGRESS BAR
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. AUTOMATIC CONTENT FADE-IN & SCROLL REVEAL OBSERVER
    if (typeof IntersectionObserver === 'undefined') return;

    // Select candidates for scroll reveal
    const revealSelectors = [
      'main section',
      'article',
      '.card-3d-elevate',
      '.ticket-3d-card',
      '.myjet-page-wrapper section',
      '.hbv-sec',
      '.eg-sec',
      '.oc-steps-grid > div',
      '.grid > div.bg-white',
      '.grid > div.rounded-2xl',
      '.grid > div.rounded-xl',
      '[data-reveal]',
    ];

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dt-revealed');
            entry.target.classList.remove('dt-reveal-pending');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    // Initial query & setup
    const setupRevealElements = () => {
      const elements = document.querySelectorAll(revealSelectors.join(', '));
      elements.forEach((el, index) => {
        // Skip elements already processed or inside hero viewport
        if (el.classList.contains('dt-revealed') || el.classList.contains('dt-reveal-pending')) {
          return;
        }

        const rect = el.getBoundingClientRect();
        // If already well in view on initial load, show immediately with a gentle fade
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          el.classList.add('dt-revealed', 'dt-reveal-instant');
          return;
        }

        // Add pending animation class
        el.classList.add('dt-reveal-pending');

        // Stagger children inside grids slightly
        if (el.parentElement?.classList.contains('grid')) {
          const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
          const staggerDelay = (siblingIndex % 6) * 80;
          (el as HTMLElement).style.transitionDelay = `${staggerDelay}ms`;
        }

        revealObserver.observe(el);
      });
    };

    // 3. AUTOMATIC NUMBER COUNTER COUNT-UP OBSERVER
    // Finds numbers like "100%", "30s", "195+", "6,000+", "10,000+", "4.8" in stats blocks
    const numberObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (el.dataset.hasCounted) return;
            el.dataset.hasCounted = 'true';
            animateNumericElement(el);
            numberObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const setupNumericCounters = () => {
      // Find candidate stat number containers
      const candidates = document.querySelectorAll<HTMLElement>(
        '[data-counter], .stat-number, .stat-value, .hbv-stat-val, [class*="text-3xl"][class*="font-black"], [class*="text-4xl"][class*="font-black"]'
      );

      candidates.forEach((el) => {
        if (el.dataset.hasCounted || el.dataset.counterProcessed) return;

        const text = el.innerText.trim();
        // Check if matches numeric formats e.g. "100%", "30s", "195+", "6,000+", "10,000+", "4.8", "₹299"
        const match = text.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
        if (match && match[2]) {
          const numValue = parseFloat(match[2].replace(/,/g, ''));
          // Only animate legitimate stats/numbers > 0
          if (!isNaN(numValue) && numValue > 0) {
            el.dataset.counterProcessed = 'true';
            el.dataset.originalText = text;
            el.dataset.prefix = match[1] || '';
            el.dataset.targetNum = match[2];
            el.dataset.suffix = match[3] || '';

            // Store original width/height so container doesn't jump
            el.style.display = 'inline-block';
            el.style.minWidth = `${el.offsetWidth}px`;
            el.style.fontVariantNumeric = 'tabular-nums';

            numberObserver.observe(el);
          }
        }
      });
    };

    function animateNumericElement(el: HTMLElement) {
      const prefix = el.dataset.prefix || '';
      const rawTarget = el.dataset.targetNum || '0';
      const suffix = el.dataset.suffix || '';
      const numWithoutCommas = rawTarget.replace(/,/g, '');
      const target = parseFloat(numWithoutCommas) || 0;
      const isFloat = numWithoutCommas.includes('.');
      const decimals = isFloat ? numWithoutCommas.split('.')[1]?.length || 1 : 0;
      const useCommas = rawTarget.includes(',');

      const duration = 1500;
      const startTime = performance.now();

      function formatVal(n: number) {
        const formatted = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
        if (useCommas) {
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return parts.join('.');
        }
        return formatted;
      }

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;

        el.innerText = `${prefix}${formatVal(current)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerText = `${prefix}${formatVal(target)}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    }

    // Run setup initially
    setupRevealElements();
    setupNumericCounters();

    // Re-check after dynamic content loads or navigation
    const timer = setTimeout(() => {
      setupRevealElements();
      setupNumericCounters();
    }, 400);

    const observer = new MutationObserver(() => {
      setupRevealElements();
      setupNumericCounters();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      observer.disconnect();
      revealObserver.disconnect();
      numberObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dynamic Top Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none transition-all duration-75 ease-out"
        style={{
          background: 'linear-gradient(90deg, #0062e0 0%, #38bdf8 50%, #6366f1 100%)',
          width: `${scrollProgress}%`,
          opacity: scrollProgress > 1 ? 1 : 0,
          boxShadow: '0 0 10px rgba(0, 98, 224, 0.6)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
export default DynamicScrollAnimations;
