import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  AyatLogo, TatreezDivider, CSS, tagCfg,
  dietFilters, matchesDiet, allergyFilters, matchesAllergy,
  itemAllergens, AllergenNote, AnimatedItem, SectionHeader,
} from "./AyatMenu.jsx";

// Catering menu data (from ayatnyc.com/menu/catering-menu). Trays feed groups; prices per size.
const CATERING = [
  { slug: "cold", label: "Cold Appetizers", note: '9" · Medium (feeds 8–12) · Large (feeds 12–16)', items: [
    { name: "Hummus", desc: "Silky chickpea & tahini purée finished with olive oil.", tags: ["VG", "GF"], prices: [{ label: '9"', price: "$25" }, { label: "Med", price: "$60" }, { label: "Lg", price: "$110" }] },
    { name: "Baba Ghanoush", desc: "Oven-roasted eggplant mashed with tahini, yogurt, olive oil, lemon & garlic.", tags: ["V", "GF"], prices: [{ label: '9"', price: "$25" }, { label: "Med", price: "$60" }, { label: "Lg", price: "$110" }] },
    { name: "Labneh", desc: "Strained & whipped yogurt paste topped with olive oil.", tags: ["V", "GF"], prices: [{ label: '9"', price: "$25" }, { label: "Med", price: "$75" }, { label: "Lg", price: "$140" }] },
    { name: "Muhammarah", desc: "Roasted sweet red peppers blended with walnuts & pomegranate molasses.", tags: ["VG"], allergens: ["walnuts"], prices: [{ label: '9"', price: "$30" }, { label: "Med", price: "$60" }, { label: "Lg", price: "$110" }] },
    { name: "Khyar Ma Laban", desc: "Finely chopped Mediterranean cucumbers mixed with yogurt & fresh mint.", tags: ["V", "GF"], prices: [{ label: '9"', price: "$25" }, { label: "Med", price: "$60" }, { label: "Lg", price: "$110" }] },
    { name: "Fattoush", desc: "Finely chopped romaine, tomato, cucumber & mint, topped with baked pita chips.", tags: ["VG"], prices: [{ label: "Med", price: "$40" }, { label: "Lg", price: "$80" }] },
    { name: "Salata Filistini", desc: "Finely chopped cucumbers, tomatoes & parsley dressed with lemon & olive oil.", tags: ["VG", "GF"], prices: [{ label: "Med", price: "$60" }, { label: "Lg", price: "$110" }] },
    { name: "Salata Tahina", desc: "A refreshing blend of scallions & vegetables in a creamy tahini dressing.", tags: ["VG", "GF"], prices: [{ label: "Med", price: "$70" }, { label: "Lg", price: "$130" }] },
    { name: "Tabbouleh", desc: "Finely chopped parsley with fine bulgur, tomatoes, onions, olive oil & lemon.", tags: ["VG"], prices: [{ label: "Med", price: "$65" }, { label: "Lg", price: "$125" }] },
  ] },
  { slug: "hot", label: "Hot Appetizers", note: "Medium (feeds 8–12) · Large (feeds 12–16)", items: [
    { name: "Falafel", desc: "Served with pickles & tahini.", tags: ["VG"], prices: [{ label: "Med", price: "$60" }, { label: "Lg", price: "$120" }] },
    { name: "Kousa Mahshi", desc: "Persian squash stuffed with rice, tomatoes, onions & an array of spices.", tags: ["VG", "GF"], prices: [{ label: "Med", price: "$65" }, { label: "Lg", price: "$130" }] },
    { name: "Wara Dawali", desc: "Grape leaves stuffed with rice, parsley, tomatoes, onions & spices.", tags: ["VG", "GF"], prices: [{ label: "Med", price: "$130" }, { label: "Lg", price: "$260" }] },
    { name: "Fried Halloumi Cheese", desc: "Golden pan-fried halloumi.", tags: ["V", "GF"], prices: [{ label: "Med", price: "$65" }, { label: "Lg", price: "$130" }] },
    { name: "Kibbeh", desc: "Finely ground bulgur & meat filled with ground beef, onion & Mediterranean spices.", prices: [{ label: "Med", price: "$110" }, { label: "Lg", price: "$220" }] },
    { name: "Mujadara", desc: "Lentils & rice with caramelized onions.", tags: ["VG", "GF"], prices: [{ label: "Med", price: "$40" }, { label: "Lg", price: "$80" }] },
    { name: "Beitenjan", desc: "Fried eggplant drizzled with tahini & pomegranate molasses.", tags: ["VG"], prices: [{ label: "Med", price: "$80" }, { label: "Lg", price: "$150" }] },
    { name: "Zahir", desc: "Fried cauliflower on a tahini bed, topped with olive oil & pomegranate molasses.", tags: ["VG"], prices: [{ label: "Med", price: "$80" }, { label: "Lg", price: "$150" }] },
    { name: "Ikras Bi Lahma", desc: "Beef-filled pie. Sold by piece.", prices: [{ label: "each", price: "$6" }] },
    { name: "Ikras Bi Sabanikh", desc: "Spinach-filled pie. Sold by piece.", tags: ["V"], prices: [{ label: "each", price: "$5" }] },
  ] },
  { slug: "quick", label: "Quick Bites", items: [
    { name: "Food Mix", desc: "3 araby chicken, 3 araby beef, 2 kefta, 2 beef kebab & 2 chicken kebab, with french fries & pita.", prices: [{ label: "feeds 10–12", price: "$150" }] },
  ] },
  { slug: "pizza", label: "Wood-Fired Pizza", note: "Sold by order", items: [
    { name: "Zaatar Margarita", desc: "San Marzano tomatoes, fresh mozzarella & basil on a za'atar-infused crust.", tags: ["V"], prices: [{ label: "per pizza", price: "$19" }] },
    { name: "Lahma Bi Ajeen", desc: "Ground beef, tomatoes & onions on a classic crust.", prices: [{ label: "per pizza", price: "$18" }] },
    { name: "Falafel Frenzy", desc: "Crisp falafel, onions, tomatoes & a drizzle of tahini.", tags: ["VG"], prices: [{ label: "per pizza", price: "$17" }] },
    { name: "Zaatar Pizza", desc: "Wood-fired crust with za'atar & olive oil.", tags: ["VG"], prices: [{ label: "per pizza", price: "$12" }] },
    { name: "Cheese Pizza", desc: "Wood-fired crust with fresh mozzarella.", tags: ["V"], prices: [{ label: "per pizza", price: "$14" }] },
  ] },
  { slug: "shawarma", label: "Shawarma", note: "Medium (feeds 6–8) · Large (feeds 10–12)", items: [
    { name: "Chicken Shawarma Araby Style", desc: "Served with fries & pickles.", prices: [{ label: "Med", price: "$60" }, { label: "Lg", price: "$120" }] },
    { name: "Beef Shawarma Araby Style", desc: "Served with fries & pickles.", prices: [{ label: "Med", price: "$75" }, { label: "Lg", price: "$145" }] },
  ] },
  { slug: "mashawy", label: "Mashawy", note: "Medium (feeds 8–10) · Large (feeds 12–15)", items: [
    { name: "Lamb Kebab", desc: "Tender chunks of marinated lamb, grilled to perfection.", prices: [{ label: "Med", price: "$150" }, { label: "Lg", price: "$290" }] },
    { name: "BBQ Chicken", desc: "Half of a BBQ chicken with a side of rice or hand-cut fries.", prices: [{ label: "Med", price: "$40" }, { label: "Lg", price: "$80" }] },
    { name: "Chicken Kebab", desc: "Skewered & grilled chicken marinated in a blend of spices & herbs.", prices: [{ label: "Med", price: "$120" }, { label: "Lg", price: "$230" }] },
    { name: "Kefta", desc: "Ground meat blended with parsley & onions.", prices: [{ label: "Med", price: "$100" }, { label: "Lg", price: "$195" }] },
    { name: "Beef Kebab", desc: "Tender cuts of filet mignon, marinated & grilled to perfection.", prices: [{ label: "Med", price: "$160" }, { label: "Lg", price: "$300" }] },
    { name: "Lamb Chops", desc: "4 tender grilled lamb chops.", prices: [{ label: "Med", price: "$250" }, { label: "Lg", price: "$490" }] },
    { name: "Mixed Grill", desc: "Chicken kebab, beef kebab, kefta & lamb chop.", prices: [{ label: "Med", price: "$140" }, { label: "Lg", price: "$275" }] },
  ] },
  { slug: "traditional", label: "Traditional", items: [
    { name: "M'sakhan", desc: "Fresh taboon bread with sautéed onions, sumac & pine nuts (with half chicken).", allergens: ["pine nuts"], prices: [{ price: "$85" }] },
    { name: "Maklouba", desc: "Upside-down 6-layer dish of chicken, carrots, potatoes, cauliflower, eggplant & rice.", prices: [{ label: "Med", price: "$95" }, { label: "Lg", price: "$180" }] },
    { name: "Fattat Jaj", desc: "6-layer dish of roasted chicken, rice, chickpeas, mint yogurt, crispy pita, garlic sauce & almonds.", allergens: ["almonds"], prices: [{ label: "Med", price: "$80" }, { label: "Lg", price: "$155" }] },
    { name: "Mansaf", desc: "Bone-in lamb & fermented yogurt sauce over sajj bread & rice, topped with slivered almonds.", allergens: ["almonds"], prices: [{ label: "Med", price: "$150" }, { label: "Lg", price: "$300" }] },
    { name: "Chicken Ouzi", desc: "Aromatic rice with tender roasted chicken & Middle Eastern spices.", prices: [{ label: "Med", price: "$80" }, { label: "Lg", price: "$160" }] },
    { name: "Lamb Ouzi Royale", desc: "Royal rice dish with chunks of slow-roasted lamb & aromatic spices.", allergens: ["nuts"], prices: [{ label: "Med", price: "$120" }, { label: "Lg", price: "$240" }] },
  ] },
  { slug: "sea", label: "From the Sea", note: "Sold by order", items: [
    { name: "Seafood Mix Platter", desc: "Whole branzino, whole red snapper, shrimp kebabs & salmon kebabs over rice, with half a tray of house salad & pita.", prices: [{ label: "serves 8–10", price: "$275" }] },
  ] },
];

function PriceTiers({ prices }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
      {prices.map((p, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "52px",
          padding: "7px 14px", borderRadius: "12px", border: "1px solid var(--bs)", background: "var(--gp)" }}>
          {p.label && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9px", fontWeight: 500,
            letterSpacing: ".1em", textTransform: "uppercase", color: "var(--tm)", marginBottom: "3px" }}>{p.label}</span>}
          <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "18px", fontStyle: "italic", color: "var(--gold)" }}>{p.price}</span>
        </div>
      ))}
    </div>
  );
}

function CateringItem({ item, index }) {
  const [h, setH] = useState(false);
  return (
    <AnimatedItem delay={Math.min(index, 6) * 0.05}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
        padding: "22px 26px", background: h ? "var(--card-h)" : "var(--card)", borderRadius: "14px",
        border: `1px solid ${h ? "rgba(184,134,11,.18)" : "var(--bs)"}`, transition: "all .4s cubic-bezier(.16,1,.3,1)",
        transform: h ? "translateY(-3px)" : "translateY(0)", boxShadow: h ? "var(--sh)" : "var(--ss)", cursor: "default", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 2,
          background: h ? "linear-gradient(90deg,transparent,var(--gold),transparent)" : "transparent", transition: "all .4s ease", borderRadius: "14px 14px 0 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "21px", fontWeight: 600,
            color: h ? "var(--gd)" : "var(--tp)", transition: "color .3s ease" }}>{item.name}</h3>
          {item.tags?.map(t => tagCfg[t] ? <span key={t} style={{ fontSize: "9px", fontWeight: 600, letterSpacing: ".08em", padding: "2px 7px",
            borderRadius: "20px", border: `1px solid ${tagCfg[t].color}33`, color: tagCfg[t].color, textTransform: "uppercase" }}>{tagCfg[t].label}</span> : null)}
        </div>
        {item.desc && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "13.5px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.6 }}>{item.desc}</p>}
        {itemAllergens(item).length > 0 && <div style={{ marginTop: "10px" }}><AllergenNote item={item} /></div>}
        <PriceTiers prices={item.prices} />
      </div>
    </AnimatedItem>
  );
}

export default function CateringMenu() {
  const [heroVis, setHeroVis] = useState(false);
  const [diet, setDiet] = useState([]);
  const [allergy, setAllergy] = useState([]);
  const [active, setActive] = useState(CATERING[0].slug);
  const sR = useRef({}); const nR = useRef({}); const scR = useRef(null);

  const toggleDiet = useCallback(k => setDiet(d => d.includes(k) ? d.filter(x => x !== k) : [...d, k]), []);
  const toggleAllergy = useCallback(k => setAllergy(a => a.includes(k) ? a.filter(x => x !== k) : [...a, k]), []);
  const anyFilter = diet.length > 0 || allergy.length > 0;
  const clearAll = useCallback(() => { setDiet([]); setAllergy([]); }, []);

  const visibleCats = useMemo(() => CATERING
    .map(c => ({ ...c, items: c.items.filter(it => matchesDiet(it, diet) && matchesAllergy(it, allergy)) }))
    .filter(c => c.items.length > 0), [diet, allergy]);
  const totalShown = useMemo(() => visibleCats.reduce((n, c) => n + c.items.length, 0), [visibleCats]);

  useEffect(() => { setTimeout(() => setHeroVis(true), 100); }, []);

  useEffect(() => {
    const f = () => { const c = scR.current; if (!c) return; let cur = visibleCats[0]?.slug;
      for (const cat of visibleCats) { const el = sR.current[cat.slug]; if (el && el.offsetTop - c.offsetTop <= c.scrollTop + 180) cur = cat.slug; }
      if (cur) setActive(cur); };
    const c = scR.current; if (c) { c.addEventListener("scroll", f, { passive: true }); return () => c.removeEventListener("scroll", f); }
  }, [visibleCats]);

  useEffect(() => { const b = nR.current[active]; if (b) b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); }, [active]);
  useEffect(() => { if (visibleCats.length > 0 && !visibleCats.some(c => c.slug === active)) setActive(visibleCats[0].slug); }, [visibleCats, active]);

  const goTo = useCallback(id => { const el = sR.current[id]; const c = scR.current;
    if (el && c) c.scrollTo({ top: el.offsetTop - c.offsetTop - 120, behavior: "smooth" }); }, []);

  return (
    <div ref={scR} style={{ height: "100vh", overflowY: "auto", overflowX: "hidden", background: "var(--bg)", position: "relative" }}>
      <style>{CSS}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 0%,rgba(43,61,43,.03) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(184,134,11,.03) 0%,transparent 60%)" }} />

      <header style={{ minHeight: "46vh", display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center", padding: "32px 24px 28px", position: "relative", zIndex: 1 }}>
        <div style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0) scale(1)" : "translateY(20px) scale(.9)",
          transition: "all 1.2s cubic-bezier(.16,1,.3,1) .3s", marginBottom: "14px" }}><AyatLogo width={150} /></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1s ease .8s", marginBottom: "16px" }}>
          <TatreezDivider color="var(--gd)" opacity={.25} /></div>
        <div style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1) 1s" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,3vw,22px)", fontWeight: 300,
            fontStyle: "italic", color: "var(--ts)", maxWidth: "400px", lineHeight: 1.5 }}>
            Feasts made to share — trays & platters for every gathering</p></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.2s ease 1.2s", marginTop: "20px" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 500,
            letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold)" }}>Catering Menu</p></div>
        <div style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.5s ease 1.4s", marginTop: "28px",
          display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {["Bushwick"].map(l =>
            <span key={l} style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9px", fontWeight: 400,
              letterSpacing: ".15em", textTransform: "uppercase", color: "var(--tm)",
              padding: "5px 12px", borderRadius: "100px", border: "1px solid var(--bs)" }}>{l}</span>)}</div>
        <div style={{ marginTop: "32px", opacity: heroVis ? 1 : 0, transition: "opacity 1.5s ease 1.6s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", letterSpacing: ".2em",
            textTransform: "uppercase", color: "var(--tm)" }}>The Spread</p>
          <div style={{ width: "1px", height: "28px", background: "linear-gradient(180deg,var(--gm),transparent)",
            opacity: .3, animation: "pulse 2s ease-in-out infinite" }} /></div>
      </header>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "0 24px",
        backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        background: "rgba(245,240,230,.88)", borderBottom: "1px solid var(--bs)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", overflowX: "auto", display: "flex", gap: "2px",
          padding: "10px 0", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {visibleCats.map(c => <button key={c.slug} ref={el => nR.current[c.slug] = el} onClick={() => goTo(c.slug)}
            style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: active === c.slug ? 500 : 400,
              letterSpacing: ".1em", textTransform: "uppercase", color: active === c.slug ? "var(--gd)" : "var(--tm)",
              background: active === c.slug ? "var(--gp)" : "transparent",
              border: active === c.slug ? "1px solid rgba(43,61,43,.1)" : "1px solid transparent",
              padding: "8px 16px", borderRadius: "100px", cursor: "pointer",
              transition: "all .3s ease", whiteSpace: "nowrap", flexShrink: 0 }}>{c.label}</button>)}</div></nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 120px", position: "relative", zIndex: 1 }}>
        <AnimatedItem><p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "12px", color: "var(--tm)",
          textAlign: "center", marginBottom: "28px", letterSpacing: ".03em" }}>All meats are halal</p></AnimatedItem>
        <AnimatedItem><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          flexWrap: "wrap", marginBottom: "48px" }}>
          <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: ".12em",
            textTransform: "uppercase", color: "var(--tm)", flexShrink: 0 }}>Dietary</span>
          {dietFilters.map(f => { const on = diet.includes(f.key); return <button key={f.key} onClick={() => toggleDiet(f.key)}
            style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: on ? 600 : 400, letterSpacing: ".04em",
              color: on ? "var(--gd)" : "var(--tm)", background: on ? "var(--gp)" : "transparent",
              border: `1px solid ${on ? "rgba(43,61,43,.18)" : "var(--bs)"}`, padding: "6px 14px", borderRadius: "100px",
              cursor: "pointer", transition: "all .3s ease", whiteSpace: "nowrap" }}>{on ? "✓ " : ""}{f.label}</button>; })}
          <span style={{ width: "1px", height: "18px", background: "var(--bs)", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: ".12em",
            textTransform: "uppercase", color: "var(--tm)", flexShrink: 0 }}>Allergies</span>
          {allergyFilters.map(f => { const on = allergy.includes(f.key); return <button key={f.key} onClick={() => toggleAllergy(f.key)}
            style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: on ? 600 : 400, letterSpacing: ".04em",
              color: on ? "var(--terra)" : "var(--tm)", background: on ? "rgba(184,92,56,.08)" : "transparent",
              border: `1px solid ${on ? "rgba(184,92,56,.28)" : "var(--bs)"}`, padding: "6px 14px", borderRadius: "100px",
              cursor: "pointer", transition: "all .3s ease", whiteSpace: "nowrap" }}>{on ? "✕ " : ""}{f.label}</button>; })}
          {anyFilter && <button onClick={clearAll} style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px",
            fontWeight: 400, color: "var(--terra)", background: "transparent", border: "none", padding: "6px 8px",
            cursor: "pointer", letterSpacing: ".04em" }}>Clear</button>}
          {anyFilter && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", color: "var(--tm)",
            flexShrink: 0 }}>· {totalShown} {totalShown === 1 ? "item" : "items"}</span>}
        </div></AnimatedItem>

        {totalShown === 0 && <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontStyle: "italic", color: "var(--tm)", marginBottom: "16px" }}>
            No items match those filters.</p>
          <button onClick={clearAll} style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px",
            letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gd)", background: "var(--gp)",
            border: "1px solid rgba(43,61,43,.1)", padding: "10px 20px", borderRadius: "100px", cursor: "pointer" }}>Clear filters</button></div>}

        {visibleCats.map((cat, ci) => <section key={cat.slug} ref={el => sR.current[cat.slug] = el} style={{ marginBottom: "64px" }}>
          <SectionHeader category={cat} />
          {cat.note && <AnimatedItem><p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", fontWeight: 400,
            letterSpacing: ".08em", textTransform: "uppercase", color: "var(--tm)", marginTop: "-16px", marginBottom: "24px" }}>{cat.note}</p></AnimatedItem>}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {cat.items.map((item, i) => <CateringItem key={item.name} item={item} index={i} />)}</div>
          {ci < visibleCats.length - 1 && <AnimatedItem delay={.2}><div style={{ paddingTop: "40px" }}><TatreezDivider /></div></AnimatedItem>}
        </section>)}

        <AnimatedItem><footer style={{ textAlign: "center", paddingTop: "40px", borderTop: "1px solid var(--bs)" }}>
          <div style={{ marginBottom: "16px", opacity: .5 }}><AyatLogo width={130} /></div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "15px", fontWeight: 300, fontStyle: "italic",
            color: "var(--tm)", lineHeight: 1.8, maxWidth: "360px", margin: "0 auto 12px" }}>
            From our kitchen to your celebration — let us cater your next gathering.</p>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10px", letterSpacing: ".15em",
            textTransform: "uppercase", color: "var(--tm)", opacity: .5, marginTop: "16px" }}>ayatbushwick.menu</p>
        </footer></AnimatedItem>
      </main>
    </div>
  );
}
