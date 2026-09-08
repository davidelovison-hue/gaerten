import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAddonPromptRoute } from '../lib/cartAddonPrompt';
import { scrollPageToTop } from '../lib/scrollPageToTop';

/** Recenter at the top on every route change in the funnel. */
export function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  useLayoutEffect(() => {
    trackAddonPromptRoute(pathname);
  }, [pathname]);

  useLayoutEffect(() => {
    return scrollPageToTop();
  }, [pathname, search, hash, key]);

  return null;
}
