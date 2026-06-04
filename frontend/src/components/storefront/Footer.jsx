import { useState } from 'react';
import { Link } from 'react-router-dom';

// ── Brutalist Link ─────────────────────────────────────────────────
const FooterLink = ({ to, children, external = false }) => {
  const cls =
    'group relative inline-block overflow-hidden isolate text-xs uppercase tracking-widest text-black leading-loose w-fit cursor-pointer';

  const inner = (
    <>
      <span className="relative z-10 group-hover:text-white transition-colors duration-200 ease-in-out px-[2px]">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
};

// ── Column Header ──────────────────────────────────────────────────
const ColHeader = ({ children }) => (
  <h3 className="text-[10px] uppercase tracking-[0.35em] font-semibold text-black/40 mb-6">
    {children}
  </h3>
);

// ── Footer Component ───────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-black bg-white" aria-label="Site footer">

      {/* ── Newsletter Strip ───────────────────────────────── */}
      <div className="border-b border-black px-8 md:px-16 py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
        <p
          className="text-sm md:text-base uppercase tracking-[0.25em] font-medium shrink-0"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Join the inner circle.
        </p>

        {subscribed ? (
          <p className="text-xs uppercase tracking-widest text-black/50 border border-black/20 px-6 py-4">
            You're in. Welcome to Yeshii's.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex w-full max-w-xl border border-black">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 px-5 py-4 text-[10px] uppercase tracking-widest bg-white placeholder:text-black/30 focus:outline-none rounded-none"
            />
            <button
              type="submit"
              className="cursor-pointer shrink-0 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium px-8 py-4 border-l border-black hover:bg-white hover:text-black transition-colors duration-300 rounded-none"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black">

        {/* Brand / About Column */}
        <div className="p-8 md:p-12 flex flex-col justify-between gap-10">
          <div>
            <ColHeader>Yeshii's Collection</ColHeader>
            <p className="text-xs text-black/50 tracking-wide leading-loose max-w-[200px]">
              Minimalist fashion for the modern Nepali woman. Clean cuts. Honest fabrics.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/30 mb-1">Find Us At</p>
            <address className="not-italic text-xs tracking-widest leading-relaxed text-black/70 uppercase">
              Nagarjun<br />
              Bagmati Province<br />
              Nepal
            </address>
          </div>
        </div>

        {/* Shop Links — query-param driven for ShopAll filtering */}
        <div className="p-8 md:p-12">
          <ColHeader>Shop</ColHeader>
          <nav className="flex flex-col gap-1" aria-label="Shop navigation">
            <FooterLink to="/shop/all">Shop All</FooterLink>
            <FooterLink to="/shop/all?sort=Newest">New Arrivals</FooterLink>
            <FooterLink to="/shop/all?subCategory=Dresses">Dresses</FooterLink>
            <FooterLink to="/shop/all?subCategory=Tops">Tops</FooterLink>
            <FooterLink to="/shop/all?subCategory=Bottoms">Bottoms</FooterLink>
            <FooterLink to="/shop/all?subCategory=Sneakers">Sneakers</FooterLink>
          </nav>
        </div>

        {/* Customer Care — anchor-hash links to CustomerCare page sections */}
        <div className="p-8 md:p-12">
          <ColHeader>Customer Care</ColHeader>
          <nav className="flex flex-col gap-1" aria-label="Support navigation">
            <FooterLink to="/customer-care#contact">Contact Us</FooterLink>
            <FooterLink to="/customer-care#faq">FAQ</FooterLink>
            <FooterLink to="/customer-care#shipping">Shipping &amp; Returns</FooterLink>
            <FooterLink to="/customer-care#privacy">Privacy Policy</FooterLink>
            <FooterLink to="/customer-care#terms">Terms of Service</FooterLink>
          </nav>
        </div>

        {/* Social / Follow */}
        <div className="p-8 md:p-12 flex flex-col justify-between gap-10">
          <div>
            <ColHeader>Follow</ColHeader>
            <nav className="flex flex-col gap-1" aria-label="Social navigation">
              <FooterLink to="https://instagram.com" external>Instagram</FooterLink>
              <FooterLink to="https://facebook.com" external>Facebook</FooterLink>
              <FooterLink to="https://tiktok.com" external>TikTok</FooterLink>
            </nav>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/30 mb-2">Contact</p>
            <a
              href="mailto:hello@yeshiis.com"
              className="text-[10px] uppercase tracking-widest text-black hover:underline cursor-pointer"
            >
              hello@yeshiis.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Massive Brand Wordmark ───────────────────────────────── */}
      <div className="border-t border-black overflow-hidden select-none px-4 md:px-8 pt-6 pb-2">
        <p
          className="text-[18vw] md:text-[14vw] font-black uppercase leading-none text-black"
          style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.04em' }}
          aria-hidden="true"
        >
          YESHII'S
        </p>
      </div>

      {/* ── Copyright Bar ──────────────────────────────────────────── */}
      <div className="border-t border-black px-8 md:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[9px] uppercase tracking-[0.35em] text-black/30">
          &copy; {new Date().getFullYear()} Yeshii's Collection. All rights reserved.
        </p>
        <p className="text-[9px] uppercase tracking-[0.35em] text-black/30">
          Kathmandu, Nepal · Est. 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
