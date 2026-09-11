import { useState, useEffect } from "react";
import { AyatLogo, TatreezDivider, CSS, tagCfg, AllergenNote, AnimatedItem } from "./AyatMenu.jsx";

// Lunch menu, served Monday to Friday 11am to 3pm. Held here rather than in the
// database because the dishes overlap the main menu at different prices, and mixing
// them into one list would show the same dish twice at two prices.
const LUNCH = [
  {
    label: "Platters", note: "Each comes with two sides and a drink",
    items: [
      { name: "Kefta", price: 19 },
      { name: "Chicken Kebab", price: 19 },
      { name: "Chicken Shawarma Platter", price: 17 },
      { name: "Beef Shawarma Platter", price: 17 },
      { name: "Mix Shawarma Platter", price: 17 },
      { name: "Falafel Platter", price: 15, tags: ["VG"] },
    ],
  },
  {
    label: "Araby Sandwiches", note: "Served with fries",
    items: [
      { name: "Araby Chicken Shawarma", price: 19 },
      { name: "Araby Beef Shawarma", price: 19 },
      { name: "Araby Mixed Shawarma", price: 19 },
    ],
  },
  {
    label: "Traditional",
    items: [
      { name: "Fattat Jaj", price: 18,
        desc: "Six-layer dish of chicken, rice, chickpeas, mint yogurt, crispy pita, garlic sauce and slivered almonds" },
      { name: "Fattat Lahma", price: 18,
        desc: "Six-layer dish of roasted meat, rice, chickpeas, mint yogurt, crispy pita, garlic sauce and slivered almonds" },
    ],
  },
  {
    label: "Mixed Grill",
    items: [
      { name: "Mixed Grill", price: 27, desc: "Beef kebab, chicken kebab and kefta" },
    ],
  },
];

const SIDES = ["Hummus", "Baba ganoush", "Muhammara", "Labneh", "Mixed greens salad"];
const DRINKS = ["Lemonade", "Hibiscus", "Ginger ale"];

// Reads like the dietary segmented control on the main menu. Nothing is selectable
// here, so every option renders in the unselected state.
function ChoiceRow({ label, items }) {
  return (
    <div>
      <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--tm)", textAlign: "center", marginBottom: "8px" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px",
        background: "var(--gp)", border: "1px solid var(--bs)", borderRadius: "11px", padding: "3px" }}>
        {items.map(i => (
          <span key={i} style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "12px", fontWeight: 500,
            color: "var(--ts)", padding: "7px 12px", borderRadius: "8px", whiteSpace: "nowrap" }}>{i}</span>
        ))}
      </div>
    </div>
  );
}

export default function LunchMenu() {
  const [heroVis, setHeroVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVis(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="menu-scroll" style={{ overflowY: "auto", overflowX: "hidden",
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

      <header style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        padding: "68px 24px 8px", position: "relative", zIndex: 1 }}>
        <div style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0) scale(1)" : "translateY(20px) scale(.9)",
          transition: "all 1.2s cubic-bezier(.16,1,.3,1) .3s" }}><AyatLogo width={82} /></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.2s ease .8s", marginTop: "16px" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 600,
            letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gd)" }}>Lunch Menu</p>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11.5px", letterSpacing: ".06em",
            color: "var(--tm)", marginTop: "9px" }}>Monday to Friday · 11am to 3pm</p>
        </div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.4s ease 1.1s", marginTop: "22px" }}>
          <TatreezDivider /></div>
      </header>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "14px 24px 0", position: "relative", zIndex: 1 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--bs)", borderRadius: "16px",
          padding: "18px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", fontStyle: "italic",
            color: "var(--ts)", lineHeight: 1.6, textAlign: "center" }}>
            Every platter comes with your choice of two sides, plus a drink.</p>
          <ChoiceRow label="Pick two sides" items={SIDES} />
          <ChoiceRow label="Pick a drink" items={DRINKS} />
        </div>
      </div>

      <main style={{ maxWidth: "620px", margin: "0 auto", padding: "34px 24px 0", position: "relative", zIndex: 1 }}>
        {LUNCH.map(section => (
          <section key={section.label} style={{ marginBottom: "42px" }}>
            <AnimatedItem>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,5vw,32px)",
                    fontWeight: 400, color: "var(--gd)", letterSpacing: ".03em", whiteSpace: "nowrap" }}>{section.label}</h2>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,var(--gm),transparent)", opacity: .2 }} />
                </div>
                {section.note && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px",
                  letterSpacing: ".1em", textTransform: "uppercase", color: "var(--tm)", marginTop: "7px" }}>{section.note}</p>}
              </div>
            </AnimatedItem>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {section.items.map((item, i) => (
                <AnimatedItem key={item.name} delay={Math.min(i, 6) * 0.05}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--bs)", borderRadius: "14px",
                    padding: "15px 17px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "14px" }}>
                      <span style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", minWidth: 0 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px",
                          fontWeight: 600, color: "var(--tp)" }}>{item.name}</span>
                        {(item.tags || []).map(t => tagCfg[t] && <span key={t} style={{ fontFamily: "'Work Sans',sans-serif",
                          fontSize: "9px", fontWeight: 700, letterSpacing: ".1em", color: tagCfg[t].color }}>{tagCfg[t].label}</span>)}
                      </span>
                      <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "19px", fontStyle: "italic",
                        color: "var(--gd)", flexShrink: 0 }}>{item.price}</span>
                    </div>
                    {item.desc && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "12.5px",
                      color: "var(--ts)", lineHeight: 1.55, marginTop: "5px" }}>{item.desc}</p>}
                    <AllergenNote item={item} />
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </section>
        ))}

      </main>

      <footer style={{ textAlign: "center", padding: "24px 24px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "620px", margin: "0 auto", borderTop: "1px solid var(--bs)", paddingTop: "28px" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", letterSpacing: ".2em",
            textTransform: "uppercase", color: "var(--tm)" }}>ayatbushwick.menu</p>
        </div>
      </footer>
    </div>
  );
}
