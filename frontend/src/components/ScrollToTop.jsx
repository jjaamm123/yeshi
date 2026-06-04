import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Placed inside <Router> in App.jsx.
 * Listens for pathname changes and instantly snaps the window to (0, 0).
 * Returns null — renders nothing to the DOM.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
