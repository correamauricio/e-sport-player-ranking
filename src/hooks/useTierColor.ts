import { useState, useEffect } from 'react';
import { getTierColor } from '@/lib/overall';
import type { Tier } from '@/types';

export function useTierColor(tier: Tier, forceLight: boolean = false) {
  const [color, setColor] = useState(() => getTierColor(tier, forceLight));

  useEffect(() => {
    setColor(getTierColor(tier, forceLight));

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          setColor(getTierColor(tier, forceLight));
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [tier, forceLight]);

  return color;
}
