import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/storefront/Navbar';

// ── Currency Formatter ─────────────────────────────────────────────
const formatCurrencyNP = (amount) => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ── Marquee Component ──────────────────────────────────────────────
const Marquee = ({ text, reverse = false, className = '' }) => {
  const unit = `${text} — `;
  const repeated = unit.repeat(10);
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={reverse ? 'marquee-track-reverse' : 'marquee-track'}>
        <span>{repeated}</span>
        <span aria-hidden>{repeated}</span>
      </div>
    </div>
  );
};

// ── Scroll-Reveal Hook ─────────────────────────────────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
};

// ── Parallax Hook ──────────────────────────────────────────────────
const useParallax = (ref, strength = 0.15) => {
  useEffect(() => {
    if (!ref.current) return;
    const onScroll = () => {
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      ref.current.style.transform = `translateY(${center * strength}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, strength]);
};

// ── Product Card ───────────────────────────────────────────────────
const ProductCard = ({ product, className = '', imageClass = '' }) => {
  const price = product.basePrice ? product.basePrice / 100 : 0;
  const img1 = product.images?.[0]?.secure_url || 'https://placehold.co/600x800/1a1a1a/ffffff?text=NO+IMG';
  const img2 = product.images?.[1]?.secure_url || img1;
  const target = `/product/${product._id || product.slug}`;

  return (
    <Link to={target} className={`group block relative overflow-hidden cursor-pointer ${className}`}>
      <div className={`relative overflow-hidden bg-[#0d0d0d] ${imageClass}`}>
        {/* Primary image */}
        <img
          src={img1}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 group-hover:opacity-0"
        />
        {/* Secondary image crossfade */}
        <img
          src={img2}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100 group-hover:scale-100"
        />
        {/* Slide-up label */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-black/0 group-hover:bg-black/40 transition-colors duration-500">
          <div className="card-label px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white font-medium">{product.subCategory}</p>
          </div>
        </div>
      </div>
      {/* Below-image meta */}
      <div className="flex justify-between items-end pt-4 border-b border-black pb-4">
        <h3 className="text-sm uppercase tracking-widest text-black font-medium leading-snug max-w-[70%]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.name}
        </h3>
        <p className="text-[11px] tracking-widest text-black shrink-0 ml-2">{formatCurrencyNP(price)}</p>
      </div>
    </Link>
  );
};

// ── Main Home Component ───────────────────────────────────────────
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroImgRef = useRef(null);
  const editorialImgRef = useRef(null);

  useScrollReveal();
  useParallax(heroImgRef, 0.12);
  useParallax(editorialImgRef, 0.1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://yeshi-bg5i.onrender.com/api/products');
        const fetched = res.data.products || res.data;
        setProducts(fetched.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [p0, p1, p2, p3, p4, p5] = products;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative w-full h-screen border-b border-black overflow-hidden">
        {/* Full-bleed parallax image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={heroImgRef}
            src={p0?.images?.[0]?.secure_url || 'https://placehold.co/1600x1000/0d0d0d/ffffff?text=YESHII'}
            alt="Hero"
            className="parallax-img w-full h-[115%] object-cover object-center -mt-[7%]"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Hero text — editorial stagger */}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16 pb-20 md:pb-24">
          <div className="overflow-hidden mb-4">
            <p
              className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 opacity-0"
              style={{ animation: 'fade-in-up 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}
            >
              New Collection — 2025
            </p>
          </div>

          <div className="overflow-hidden mb-6">
            <h1
              className="text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] text-white opacity-0 tracking-tight"
              style={{
                fontFamily: 'Playfair Display, serif',
                animation: 'fade-in-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s forwards',
              }}
            >
              Yeshii's
            </h1>
          </div>

          <div className="overflow-hidden mb-10">
            <h2
              className="text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] text-white/30 opacity-0 tracking-tight italic"
              style={{
                fontFamily: 'Playfair Display, serif',
                animation: 'fade-in-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s forwards',
              }}
            >
              Collection
            </h2>
          </div>

          <div
            className="opacity-0"
            style={{ animation: 'fade-in-up 1s cubic-bezier(0.16,1,0.3,1) 0.9s forwards' }}
          >
            <Link
              to="/shop/all"
              className="cursor-pointer inline-block border border-white text-white text-[10px] uppercase tracking-[0.3em] px-10 py-4 hover:bg-white hover:text-black transition-all duration-500 ease-out"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 right-8 md:right-16 z-10 opacity-0 flex items-center gap-3"
          style={{ animation: 'fade-in-up 1s ease 1.2s forwards' }}
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/50">Scroll</span>
          <div className="w-12 h-[1px] bg-white/30" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────────── */}
      <div className="border-b border-black py-5 bg-black overflow-hidden">
        <Marquee
          text="NEW ARRIVALS · YESHII'S COLLECTION · KATHMANDU · SS25"
          className="text-[11px] uppercase tracking-[0.3em] text-white/60 font-medium"
        />
      </div>

      {/* ── EDITORIAL INTRO ────────────────────────────────────── */}
      <section className="border-b border-black grid grid-cols-1 md:grid-cols-2">
        {/* Left: oversized serif statement */}
        <div className="flex flex-col justify-between p-10 md:p-16 border-b md:border-b-0 md:border-r border-black">
          <div>
            <p className="reveal text-[10px] uppercase tracking-[0.35em] text-black/40 mb-10">
              The Philosophy
            </p>
            <h2
              className="reveal reveal-delay-1 text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] uppercase mb-10"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Less<br /><em className="italic">is</em><br />Always<br />More.
            </h2>
          </div>
          <p className="reveal reveal-delay-2 text-xs uppercase tracking-[0.2em] text-black/50 max-w-sm leading-loose">
            Crafted for the modern Nepali woman. Clean cuts, honest fabrics, and silhouettes that speak without noise.
          </p>
        </div>

        {/* Right: tall editorial image */}
        <div className="overflow-hidden h-[70vh] md:h-auto relative">
          <img
            ref={editorialImgRef}
            src={p1?.images?.[0]?.secure_url || 'https://placehold.co/800x1000/1a1a1a/ffffff?text=EDITORIAL'}
            alt="Editorial"
            className="parallax-img w-full h-[115%] object-cover object-center -mt-[7%] transition-transform duration-700"
          />
        </div>
      </section>

      {/* ── MARQUEE STRIP 2 ────────────────────────────────────── */}
      <div className="border-b border-black py-4 overflow-hidden">
        <Marquee
          text="APPAREL · SHOES · DRESSES · TOPS · BOTTOMS · INNERWEAR"
          reverse
          className="text-[11px] uppercase tracking-[0.3em] text-black/20 font-medium"
        />
      </div>

      {/* ── ASYMMETRIC PRODUCT GRID ─────────────────────────────── */}
      <section className="border-b border-black">
        {/* Header bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-black">
          <h2
            className="text-2xl md:text-3xl font-black uppercase tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            New Arrivals
          </h2>
          <Link
            to="/shop/all"
            className="cursor-pointer text-[10px] uppercase tracking-[0.3em] text-black/50 hover:text-black border-b border-black/20 hover:border-black pb-1 transition-all duration-300"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 animate-pulse">
              Curating — — —
            </p>
          </div>
        ) : (
          <>
            {/* Row 1: Large left + two stacked right */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
              {/* Large hero card */}
              {p0 && (
                <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-black reveal">
                  <ProductCard
                    product={p0}
                    imageClass="h-[65vh] md:h-[80vh]"
                    className="p-6 md:p-8"
                  />
                </div>
              )}

              {/* Two stacked smaller cards */}
              <div className="flex flex-col">
                {p1 && (
                  <div className="flex-1 border-b border-black reveal reveal-delay-1">
                    <ProductCard
                      product={p1}
                      imageClass="h-[35vh] md:h-[38vh]"
                      className="p-5 md:p-6"
                    />
                  </div>
                )}
                {p2 && (
                  <div className="flex-1 reveal reveal-delay-2">
                    <ProductCard
                      product={p2}
                      imageClass="h-[35vh] md:h-[38vh]"
                      className="p-5 md:p-6"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Three equal columns */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[p3, p4, p5].filter(Boolean).map((prod, i) => (
                <div
                  key={prod._id}
                  className={`border-b md:border-b-0 ${i < 2 ? 'md:border-r border-black' : ''} reveal reveal-delay-${i + 1}`}
                >
                  <ProductCard
                    product={prod}
                    imageClass="h-[55vh]"
                    className="p-6 md:p-8"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── FULL-BLEED STATEMENT ────────────────────────────────── */}
      <section className="relative h-[60vh] overflow-hidden border-b border-black flex items-center justify-center">
        <img
          src={p4?.images?.[0]?.secure_url || 'https://placehold.co/1600x900/0d0d0d/ffffff?text=YESHII'}
          alt="Statement"
          className="absolute inset-0 w-full h-[115%] object-cover -mt-[7%]"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <p className="reveal text-[9px] uppercase tracking-[0.5em] text-white/50 mb-6">
            Free shipping above Rs. 5,000
          </p>
          <h2
            className="reveal reveal-delay-1 text-4xl md:text-6xl font-black uppercase italic text-white leading-tight mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Dress with<br />intention.
          </h2>
          <div className="reveal reveal-delay-2">
            <Link
              to="/shop/all"
              className="cursor-pointer inline-block border border-white/60 text-white text-[10px] uppercase tracking-[0.3em] px-10 py-4 hover:bg-white hover:text-black transition-all duration-500"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER MARQUEE ──────────────────────────────────────── */}
      <div className="py-8 border-t border-black overflow-hidden">
        <Marquee
          text="YESHII'S COLLECTION · KATHMANDU, NEPAL · EST. 2025 · "
          className="text-[10px] uppercase tracking-[0.4em] text-black/25 font-medium"
        />
      </div>
    </div>
  );
};

export default Home;
