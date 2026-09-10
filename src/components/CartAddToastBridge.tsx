import { useEffect, useRef } from 'react';
import { useCart } from '../lib/cartContext';
import { useToast } from '../lib/toastContext';
import { useIsMobile } from '../lib/useIsMobile';

export function CartAddToastBridge() {
  const { totalItems } = useCart();
  const { showToast } = useToast();
  const isMobile = useIsMobile();
  const prevTotalRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevTotalRef.current === null) {
      prevTotalRef.current = totalItems;
      return;
    }

    if (!isMobile && totalItems > prevTotalRef.current) {
      showToast('Ticket added to cart');
    }

    prevTotalRef.current = totalItems;
  }, [totalItems, showToast, isMobile]);

  return null;
}
