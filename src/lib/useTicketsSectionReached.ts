import { useEffect, useState } from 'react';

function getTicketsSection() {
  return (
    document.getElementById('tickets') ??
    document.querySelector<HTMLElement>('.planTicketsMain, .planTicketsSection, .planSnap--tickets')
  );
}

export function useTicketsSectionReached() {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    const sync = () => {
      const el = getTicketsSection();
      if (!el) {
        setReached(false);
        return;
      }
      setReached(el.getBoundingClientRect().top < window.innerHeight - 140);
    };

    sync();
    const el = getTicketsSection();
    const observer = el
      ? new IntersectionObserver(sync, { threshold: [0, 0.05, 0.2, 0.5, 1] })
      : null;
    if (el) observer?.observe(el);
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return reached;
}
