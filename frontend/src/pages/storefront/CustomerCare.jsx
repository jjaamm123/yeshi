import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/storefront/Navbar';

// ── Section IDs & sidebar menu definition ─────────────────────────
const SECTIONS = [
  { id: 'contact',  label: 'Contact Us' },
  { id: 'faq',      label: 'FAQ' },
  { id: 'shipping', label: 'Shipping & Returns' },
  { id: 'privacy',  label: 'Privacy Policy' },
  { id: 'terms',    label: 'Terms of Service' },
];

// ── Brutalist form input ───────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-black/40">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full border border-black bg-white px-4 py-3 text-xs uppercase tracking-widest placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-black rounded-none transition-shadow duration-200';

// ── Contact Form ───────────────────────────────────────────────────
const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await axios.post('https://yeshi-bg5i.onrender.com/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h2
        className="text-4xl md:text-5xl font-black uppercase leading-none mb-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Contact Us
      </h2>
      <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">
        We typically respond within 24 hours.
      </p>

      {status === 'success' ? (
        <div className="border border-black p-10 text-center">
          <p
            className="text-2xl font-black uppercase mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Message Received.
          </p>
          <p className="text-xs uppercase tracking-widest text-black/50">
            Thank you for reaching out. Our team will respond shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="cursor-pointer mt-8 text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <Field label="Full Name">
              <input
                type="text"
                required
                value={form.name}
                onChange={set('name')}
                placeholder="Your name"
                className={inputCls}
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Subject">
            <input
              type="text"
              value={form.subject}
              onChange={set('subject')}
              placeholder="Order issue, general inquiry, etc."
              className={inputCls}
            />
          </Field>

          <Field label="Message">
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={set('message')}
              placeholder="Describe your concern in detail..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {status === 'error' && (
            <p className="text-[10px] uppercase tracking-widest text-red-700 border border-red-700 px-4 py-3">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="cursor-pointer self-start bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium px-12 py-5 hover:bg-white hover:text-black border border-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-none"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

// ── FAQ Section ────────────────────────────────────────────────────
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/20">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="text-xs uppercase tracking-widest font-semibold">{q}</span>
        <span className="text-xl font-light shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <p className="text-xs leading-loose tracking-wide text-black/60 pb-6 pr-8">{a}</p>
      )}
    </div>
  );
};

const FaqSection = () => (
  <div>
    <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-10"
      style={{ fontFamily: 'Playfair Display, serif' }}>
      FAQ
    </h2>
    <div>
      {[
        { q: 'What sizes do you carry?', a: 'We carry sizes XS through XL across our Apparel range, and EU 35–42 for Shoes. Each product page includes a full size guide and a body measurement chart.' },
        { q: 'How do I track my order?', a: 'Once your order is dispatched, you will receive a confirmation email with a tracking code for Aramex or Nepal Post depending on your delivery zone.' },
        { q: 'Can I change or cancel my order?', a: 'Orders can be cancelled or modified within 2 hours of placement. After that, please contact us immediately as your item may already be in processing.' },
        { q: 'Do you ship outside Nepal?', a: 'We currently deliver within Bagmati Province with plans to expand across Nepal in 2025. International shipping is on our roadmap.' },
        { q: 'Are your fabrics ethically sourced?', a: 'Yes. All of our fabrics are sourced from certified suppliers in Nepal and India with fair-trade compliance standards. We are committed to transparent, responsible production.' },
        { q: 'How do I care for my garment?', a: 'Each item comes with a care label. Most of our linen and cotton pieces are machine-washable on a gentle cool cycle. We recommend air-drying to preserve shape.' },
      ].map((item) => <FaqItem key={item.q} {...item} />)}
    </div>
  </div>
);

// ── Shipping Section ───────────────────────────────────────────────
const ShippingSection = () => (
  <div>
    <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-10"
      style={{ fontFamily: 'Playfair Display, serif' }}>
      Shipping &amp; Returns
    </h2>
    <div className="space-y-10">
      {[
        {
          title: 'Delivery Timelines',
          body: 'Standard delivery within Kathmandu Valley takes 1–3 business days. Orders to other districts in Bagmati Province are fulfilled within 3–7 business days. You will receive real-time tracking once your parcel is dispatched.',
        },
        {
          title: 'Shipping Costs',
          body: 'Shipping is free on all orders above NPR 5,000. A flat rate of NPR 150 applies to orders below this threshold. Express same-day delivery within Kathmandu is available for NPR 350.',
        },
        {
          title: 'Returns Policy',
          body: 'We accept returns within 7 days of delivery, provided the item is unworn, unwashed, and in original packaging with tags attached. Sale items and intimate apparel are non-returnable.',
        },
        {
          title: 'How to Initiate a Return',
          body: 'Email hello@yeshiis.com with your order number, the item you wish to return, and the reason. Our team will arrange a pickup from your address within 48 hours. Refunds are processed within 5–7 business days.',
        },
        {
          title: 'Damaged or Incorrect Items',
          body: 'In the rare event that you receive a damaged or incorrect item, please photograph the item and contact us within 24 hours of delivery. We will arrange an immediate replacement at no cost.',
        },
      ].map(({ title, body }) => (
        <div key={title} className="border-l-2 border-black pl-6">
          <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-3">{title}</h3>
          <p className="text-xs leading-loose text-black/60">{body}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Privacy Section ────────────────────────────────────────────────
const PrivacySection = () => (
  <div>
    <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-10"
      style={{ fontFamily: 'Playfair Display, serif' }}>
      Privacy Policy
    </h2>
    <div className="space-y-8 text-xs leading-loose text-black/60">
      <p><span className="text-black font-semibold uppercase tracking-widest">Effective Date:</span> January 1, 2025</p>
      {[
        { h: 'Information We Collect', b: 'We collect personal information you provide directly, including your name, email address, shipping address, and payment details when you place an order or create an account. We also collect non-identifying browsing data to improve site performance.' },
        { h: 'How We Use Your Information', b: 'Your data is used exclusively to process orders, communicate order status, and improve your shopping experience. We do not sell or share your personal information with third parties for marketing purposes.' },
        { h: 'Data Security', b: 'All transactions on Yeshii\'s Collection are encrypted using industry-standard TLS protocols. Payment information is processed by licensed third-party gateways (eSewa, Khalti) and is never stored on our servers.' },
        { h: 'Cookies', b: 'We use essential cookies to maintain your session, cart, and preferences. You may disable cookies in your browser settings, though some features may not function correctly as a result.' },
        { h: 'Your Rights', b: 'You have the right to access, correct, or delete any personal information we hold. To submit a data request, please contact us at hello@yeshiis.com.' },
        { h: 'Changes to this Policy', b: 'We reserve the right to update this policy at any time. Significant changes will be communicated via email or a prominent notice on this page.' },
      ].map(({ h, b }) => (
        <div key={h}>
          <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black mb-2">{h}</h3>
          <p>{b}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Terms Section ──────────────────────────────────────────────────
const TermsSection = () => (
  <div>
    <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-10"
      style={{ fontFamily: 'Playfair Display, serif' }}>
      Terms of Service
    </h2>
    <div className="space-y-8 text-xs leading-loose text-black/60">
      <p><span className="text-black font-semibold uppercase tracking-widest">Last Updated:</span> January 1, 2025</p>
      {[
        { h: '1. Acceptance of Terms', b: 'By accessing or using the Yeshii\'s Collection website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the site immediately.' },
        { h: '2. Product Information', b: 'We endeavour to ensure all product descriptions, images, and prices are accurate. However, we reserve the right to correct errors, update pricing, or discontinue products without prior notice.' },
        { h: '3. Order Acceptance', b: 'Submitting an order does not constitute a binding contract until we confirm and dispatch your item. We reserve the right to cancel any order due to stock issues, pricing errors, or fraudulent activity.' },
        { h: '4. Intellectual Property', b: 'All content on this site including imagery, typography, and branding is the exclusive property of Yeshii\'s Collection. Reproduction or redistribution without written consent is strictly prohibited.' },
        { h: '5. Limitation of Liability', b: 'Yeshii\'s Collection is not liable for indirect, incidental, or consequential damages arising from your use of our products or services beyond the value of the original purchase.' },
        { h: '6. Governing Law', b: 'These terms shall be governed by the laws of Nepal. Any disputes shall be resolved under the jurisdiction of courts located in Kathmandu, Bagmati Province.' },
      ].map(({ h, b }) => (
        <div key={h}>
          <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-black mb-2">{h}</h3>
          <p>{b}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Section map ────────────────────────────────────────────────────
const CONTENT = {
  contact:  <ContactSection />,
  faq:      <FaqSection />,
  shipping: <ShippingSection />,
  privacy:  <PrivacySection />,
  terms:    <TermsSection />,
};

// ── Main Page ──────────────────────────────────────────────────────
const CustomerCare = () => {
  const { hash } = useLocation();
  const initial = hash ? hash.slice(1) : 'contact';
  const [active, setActive] = useState(SECTIONS.find(s => s.id === initial) ? initial : 'contact');
  const contentRef = useRef(null);

  // Sync active section when navigating from footer hash links
  useEffect(() => {
    const id = hash?.slice(1);
    if (id && SECTIONS.find(s => s.id === id)) {
      setActive(id);
    }
  }, [hash]);

  const handleNav = (id) => {
    setActive(id);
    // Smooth-scroll to content on mobile
    if (window.innerWidth < 768) {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page title strip */}
      <div className="border-b border-black px-8 md:px-16 py-10">
        <h1
          className="text-5xl md:text-7xl font-black uppercase leading-none"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Customer<br />Care
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row min-h-[80vh]">

        {/* Sticky Sidebar */}
        <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-black">
          <nav className="md:sticky md:top-20" aria-label="Customer care sections">
            {SECTIONS.map((section, i) => (
              <button
                key={section.id}
                onClick={() => handleNav(section.id)}
                className={`cursor-pointer w-full text-left px-8 py-5 text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors duration-200 border-b border-black/10 flex justify-between items-center group
                  ${active === section.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black/5'
                  }`}
              >
                <span>{section.label}</span>
                <span className={`text-base font-light transition-transform duration-300 ${active === section.id ? 'text-white' : 'text-black/30 group-hover:text-black'}`}>
                  →
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main
          ref={contentRef}
          className="flex-1 px-8 md:px-16 py-14"
          key={active} // Remount to reset scroll on section change
        >
          {CONTENT[active]}
        </main>
      </div>
    </div>
  );
};

export default CustomerCare;
