import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { AyatLogo, TatreezDivider, CSS, AnimatedItem } from "./AyatMenu.jsx";

const PHONE = "718-766-0635";
const PHONE_HREF = "tel:+17187660635";
// Catering lives on ayatnyc.com for now, so every catering link points off-site.
const CATERING_URL = "https://www.ayatnyc.com/menu/catering-menu/";
const ORDER_URL = CATERING_URL;

// FAQ content. `todo: true` marks an answer Sammi still needs to supply — it renders
// a visible "needs your answer" flag so a placeholder can never ship as if it were real.
const FAQ = [
  {
    slug: "dining", label: "Dining In",
    blurb: "Visiting us in Bushwick",
    items: [
      { q: "Do you take reservations?",
        a: `We take reservations for parties of 6 to 20 people. To book, give us a call at ${PHONE} between 11am and 5pm.\nPlease note that if you're more than 15 minutes late, we can't hold your table.`,
        cta: { label: `Call ${PHONE}`, href: PHONE_HREF } },
      { q: "Is your meat halal?",
        a: "Yes. All meats we serve are halal, across both the dining-in menu and catering." },
      { q: "Do you have vegan, vegetarian and gluten-free dishes?",
        a: "We do. Every dish on our menu is tagged: VG for vegan, V for vegetarian and GF for gluten-free. You can filter the menu down to just those dishes.",
        cta: { label: "View the menu", href: "/" } },
      { q: "How do I know if a dish contains nuts?",
        a: "Dishes made with nuts are labeled with the specific nut they contain, whether walnuts, pine nuts or almonds, so you can see it before you order. There's also a filter to hide every dish containing nuts." },
      { q: "Where are you located?",
        a: "We're at 242 Knickerbocker Ave, Brooklyn, NY 11237, right across the street from Maria Hernandez Park. The closest train is the Jefferson St station on the L." },
      { q: "What are your hours?",
        a: "Sunday through Thursday, 11am to 10pm.\nFriday and Saturday, 11am to 11pm." },
      { q: "Is there parking nearby?",
        a: "We don't have private parking, but there's street parking in the area." },
      { q: "Do you serve alcohol, or can I bring my own?",
        a: "We don't serve alcohol, but we're BYOB. There's no corkage fee, and we'll provide a bottle opener and glasses." },
      { q: "Can you seat a large group?",
        a: `Yes, we take reservations for parties of 6 to 20 people. Anything over 20 is handled case by case, up to a maximum of 35 people, depending on our availability and the day of the week. Give us a call at ${PHONE} and you can talk it through with a manager.`,
        cta: { label: `Call ${PHONE}`, href: PHONE_HREF } },
      { q: "Is there a minimum amount per person for large groups?",
        a: "Family platters are priced per person and need a minimum of 4 people. A table of 4 can order one, a table of 3 cannot.\n\nAny group over 15 people is required to order from the family platters and pay per person.\n\nEvery family platter is served with hummus, baba ghanoush, muhammarah, fattoush and cucumber salad.\n\nFattat Jaj: $34 per person (min 4, order $136)\nFattat Lahma: $34 per person (min 4, order $136)\nVegetarian: $36 per person (min 4, order $144)\nMaklouba: $38 per person (min 4, order $152)\nFamily Mashawy: $44 per person (min 4, order $176)\nMansaf: $46 per person (min 4, order $184)" },
      { q: "Can we host a private event at your space?",
        a: "No, we don't host private events." },
      { q: "Do you offer takeout or delivery?",
        a: "Both. You can order takeout directly, and we deliver through all the major apps including Uber Eats and DoorDash." },
    ],
  },
  {
    slug: "catering", label: "Catering",
    blurb: "Trays and platters for gatherings",
    items: [
      { q: "How many people does catering serve?",
        a: "Catering is built for groups of 8 or more. Trays come in three sizes: a 9\" tray feeds about 3–5 people, a medium feeds about 8–12, and a large feeds about 12–16.",
        cta: { label: "See the catering menu", href: CATERING_URL, external: true } },
      { q: "Is there a minimum for catering orders?",
        a: "Yes. Catering orders have a $300 minimum. Beyond that, the total depends on how many trays you order and which dishes you choose." },
      { q: "How do I place a catering order?",
        a: "Our full catering menu and ordering are on ayatnyc.com.",
        cta: { label: "Place a catering order", href: ORDER_URL, external: true } },
      { q: "How far in advance should I order?",
        a: "Catering orders need at least 4 hours notice." },
      { q: "Do you deliver catering orders?",
        a: "Yes, we deliver. Please note our driver does not bring the order to your door, so you'll need to come out and meet them at their car." },
      { q: "When do I pay for a catering order?",
        a: "Catering orders are paid for upfront, before we start preparing them." },
      { q: "Do trays come with serving utensils or setup?",
        a: "We include plastic cutlery for eating, but not large serving spoons." },
      { q: "Can you work around allergies for a group?",
        a: "We don't modify dishes to order. Our menu marks vegan, vegetarian and gluten-free dishes and labels which ones contain nuts, so you can choose around most needs." },
    ],
  },
];

function Question({ item, open, onToggle }) {
  const bodyRef = useRef(null);
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--bs)", borderRadius: "14px",
      marginBottom: "10px", overflow: "hidden", transition: "box-shadow .3s ease",
      boxShadow: open ? "0 4px 20px rgba(43,61,43,.07)" : "none" }}>
      <button onClick={onToggle} aria-expanded={open} style={{ width: "100%", display: "flex",
        alignItems: "flex-start", justifyContent: "space-between", gap: "14px", textAlign: "left",
        background: "none", border: "none", cursor: "pointer", padding: "17px 18px" }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 600,
          color: "var(--tp)", lineHeight: 1.35 }}>{item.q}</span>
        <span style={{ flexShrink: 0, marginTop: "3px", width: "20px", height: "20px", borderRadius: "50%",
          border: "1px solid var(--bs)", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--gd)", fontSize: "12px", lineHeight: 1,
          transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .3s cubic-bezier(.5,1.2,.4,1)" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? (bodyRef.current ? bodyRef.current.scrollHeight + 40 : 600) : 0,
        opacity: open ? 1 : 0, overflow: "hidden",
        transition: "max-height .38s cubic-bezier(.4,0,.2,1), opacity .3s ease" }}>
        <div ref={bodyRef} style={{ padding: "0 18px 18px" }}>
          {item.a && (
            <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "13.5px", lineHeight: 1.65,
              color: "var(--ts)", whiteSpace: "pre-line" }}>{item.a}</p>
          )}
          {item.todo && import.meta.env.DEV && (
            <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11.5px", lineHeight: 1.5,
              color: "var(--terra)", background: "rgba(184,92,56,.07)", border: "1px dashed rgba(184,92,56,.4)",
              borderRadius: "9px", padding: "9px 11px", marginTop: item.a ? "10px" : 0 }}>
              <strong style={{ letterSpacing: ".04em" }}>NEEDS YOUR ANSWER: </strong>{item.todo}</p>
          )}
          {item.cta && (
            <a href={item.cta.href}
              {...(item.cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ display: "inline-block", marginTop: "13px", fontFamily: "'Work Sans',sans-serif",
                fontSize: "11px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase",
                color: "var(--gd)", textDecoration: "none", border: "1px solid var(--bs)",
                background: "var(--gp)", padding: "10px 16px", borderRadius: "100px" }}>{item.cta.label}</a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [heroVis, setHeroVis] = useState(false);
  const [active, setActive] = useState(FAQ[0].slug);
  const [open, setOpen] = useState({});
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  const [, bumpResize] = useState(0);// re-render on resize so open cards remeasure their height
  const scR = useRef(null); const sR = useRef({}); const nR = useRef({});

  const toggle = useCallback(key => setOpen(o => ({ ...o, [key]: !o[key] })), []);

  useEffect(() => { const t = setTimeout(() => setHeroVis(true), 100); return () => clearTimeout(t); }, []);

  // An answer's height changes when the viewport does (rotating a phone), so re-render
  // to let each open card recompute its max-height instead of clipping the old value.
  useEffect(() => { const f = () => bumpResize(n => n + 1);
    window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);

  useEffect(() => {
    const f = () => { const c = scR.current; if (!c) return; let cur = FAQ[0].slug;
      const cTop = c.getBoundingClientRect().top;
      for (const g of FAQ) { const el = sR.current[g.slug];
        if (el && el.getBoundingClientRect().top - cTop <= 140) cur = g.slug; }
      setActive(cur); };
    const c = scR.current;
    if (c) { c.addEventListener("scroll", f, { passive: true }); return () => c.removeEventListener("scroll", f); }
  }, []);

  useEffect(() => { const b = nR.current[active];
    if (b) setThumb({ left: b.offsetLeft, width: b.offsetWidth }); }, [active]);

  const goTo = useCallback(slug => { const el = sR.current[slug]; const c = scR.current;
    if (el && c) c.scrollTo({ top: el.offsetTop - c.offsetTop - 110, behavior: "smooth" }); }, []);

  const openCount = useMemo(() => Object.values(open).filter(Boolean).length, [open]);

  return (
    <div ref={scR} className="menu-scroll" style={{ overflowY: "auto", overflowX: "hidden",
      background: "var(--bg)", position: "relative" }}>
      <style>{CSS}</style>
      <style>{`.menu-scroll{height:100vh;height:100dvh}`}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 0%,rgba(43,61,43,.03) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(184,134,11,.03) 0%,transparent 60%)" }} />

      <a href="/" style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10, display: "flex",
        alignItems: "center", gap: "6px", fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 500,
        letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gd)", textDecoration: "none",
        padding: "9px 16px", borderRadius: "100px", border: "1px solid var(--bs)",
        background: "rgba(245,240,230,.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
        <span style={{ fontSize: "13px", lineHeight: 1 }}>←</span> Menu</a>

      <header style={{ minHeight: "38vh", display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center", padding: "32px 24px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0) scale(1)" : "translateY(20px) scale(.9)",
          transition: "all 1.2s cubic-bezier(.16,1,.3,1) .3s", marginBottom: "20px" }}><AyatLogo width={150} /></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.2s ease .8s" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 600,
            letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gd)" }}>Frequently Asked Questions</p></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.5s ease 1.3s", marginTop: "26px" }}>
          <TatreezDivider /></div>
      </header>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "0 24px",
        backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        background: "rgba(245,240,230,.88)", borderBottom: "1px solid var(--bs)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", overflowX: "auto",
          scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div style={{ position: "relative", display: "flex", gap: "4px", padding: "10px 0 0",
            width: "max-content", minWidth: "100%" }}>
            <div style={{ position: "absolute", bottom: 0, left: thumb.left, width: thumb.width, height: "2px",
              background: "var(--gold)", borderRadius: "2px",
              transition: "left .38s cubic-bezier(.5,1.2,.4,1),width .38s cubic-bezier(.5,1.2,.4,1)" }} />
            {FAQ.map(g => (
              <button key={g.slug} ref={el => nR.current[g.slug] = el} onClick={() => goTo(g.slug)}
                style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px",
                  fontWeight: active === g.slug ? 600 : 400, letterSpacing: ".1em", textTransform: "uppercase",
                  color: active === g.slug ? "var(--gd)" : "var(--tm)", background: "transparent", border: "none",
                  padding: "6px 14px 12px", cursor: "pointer", transition: "color .3s ease",
                  whiteSpace: "nowrap", flexShrink: 0 }}>{g.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "38px 24px 0", position: "relative", zIndex: 1 }}>
        {FAQ.map(group => (
          <section key={group.slug} ref={el => sR.current[group.slug] = el} style={{ marginBottom: "48px" }}>
            <AnimatedItem>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(27px,5vw,34px)",
                    fontWeight: 500, color: "var(--gd)", lineHeight: 1.1 }}>{group.label}</h2>
                  <div style={{ flex: 1, height: "1px", background: "var(--bs)" }} />
                </div>
                <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", letterSpacing: ".1em",
                  textTransform: "uppercase", color: "var(--tm)", marginTop: "7px" }}>{group.blurb}</p>
              </div>
            </AnimatedItem>
            {/* A question with no answer yet is shown only in dev, so unfinished
                copy never reaches the live site. It appears as soon as it has an answer. */}
            {group.items.filter(it => it.a || import.meta.env.DEV).map((item, i) => {
              const key = group.slug + "|" + item.q;
              return (
                <AnimatedItem key={key} delay={Math.min(i, 6) * 0.05}>
                  <Question item={item} open={!!open[key]} onToggle={() => toggle(key)} />
                </AnimatedItem>
              );
            })}
          </section>
        ))}

        <AnimatedItem>
          <div style={{ textAlign: "center", padding: "8px 0 44px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontStyle: "italic",
              fontWeight: 300, color: "var(--ts)", marginBottom: "18px" }}>Still have a question?</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
              <a href={PHONE_HREF}
                style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 600,
                  letterSpacing: ".1em", textTransform: "uppercase", color: "#F5F0E6", background: "var(--gd)",
                  padding: "14px 24px", borderRadius: "100px", textDecoration: "none" }}>Call {PHONE}</a>
              <a href={CATERING_URL} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 600,
                  letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gd)", background: "transparent",
                  border: "1px solid var(--bs)", padding: "14px 24px", borderRadius: "100px",
                  textDecoration: "none" }}>Catering menu</a>
            </div>
          </div>
        </AnimatedItem>
      </main>

      <footer style={{ textAlign: "center", padding: "8px 24px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", borderTop: "1px solid var(--bs)", paddingTop: "34px" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", letterSpacing: ".2em",
            textTransform: "uppercase", color: "var(--tm)" }}>ayatbushwick.menu</p>
        </div>
      </footer>
    </div>
  );
}
