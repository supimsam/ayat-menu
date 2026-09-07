import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { AyatLogo, CSS, tagCfg, AllergenNote, AnimatedItem } from "./AyatMenu.jsx";
import { CATERING } from "./CateringMenu.jsx";

// DEMO ONLY — concept version of the catering page at /catering-demo.
// Explores: headcount-first planning, always-on adding (no opt-in toggle),
// inline quantity steppers, a drag-style bottom sheet, and a copyable plan.
// The live catering page at /catering is untouched.

const ORDER_MINIMUM = 300;
const parsePrice = s => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
const feedsLabel = (min, max) => min === max ? `${min}` : `${min}–${max}`;

export default function CateringDemo() {
  const [guests, setGuests] = useState(20);
  const [order, setOrder] = useState([]);
  const [sheet, setSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const scR = useRef(null);

  const key = (item, p) => item.name + "|" + (p.label || "");

  const add = useCallback((item, p) => setOrder(o => {
    const id = key(item, p);
    const ex = o.find(x => x.id === id);
    if (ex) return o.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x);
    return [...o, { id, name: item.name, label: p.label || "", price: parsePrice(p.price),
      display: p.price, feeds: p.feeds || [0, 0], qty: 1 }];
  }), []);

  const changeQty = useCallback((id, d) => setOrder(o => o
    .map(x => x.id === id ? { ...x, qty: x.qty + d } : x).filter(x => x.qty > 0)), []);

  const qtyOf = useCallback((item, p) => {
    const line = order.find(x => x.id === key(item, p));
    return line ? line.qty : 0;
  }, [order]);

  const subtotal = useMemo(() => order.reduce((n, o) => n + o.price * o.qty, 0), [order]);
  const covers = useMemo(() => order.reduce((n, o) => n + ((o.feeds[0] + o.feeds[1]) / 2) * o.qty, 0), [order]);
  const pct = Math.min(100, guests > 0 ? (covers / guests) * 100 : 0);
  const belowMin = subtotal > 0 && subtotal < ORDER_MINIMUM;

  // The size whose middle-of-range headcount best fits the party, used to mark a suggestion.
  const bestSize = useCallback(item => {
    const withFeeds = (item.prices || []).filter(p => p.feeds && p.feeds[1]);
    if (!withFeeds.length) return null;
    const fits = withFeeds.filter(p => p.feeds[1] >= guests);
    return (fits.length ? fits[0] : withFeeds[withFeeds.length - 1]).label;
  }, [guests]);

  const planText = useMemo(() => {
    if (!order.length) return "";
    const lines = order.map(o => `${o.qty}x ${o.name}${o.label ? " (" + o.label + ")" : ""} — $${o.price * o.qty}`);
    return `Ayat Bushwick catering plan\nFor ${guests} people\n\n${lines.join("\n")}\n\nEstimated total: $${subtotal}`;
  }, [order, guests, subtotal]);

  const copyPlan = useCallback(() => {
    navigator.clipboard?.writeText(planText).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [planText]);

  useEffect(() => { if (order.length === 0) setSheet(false); }, [order.length]);

  return (
    <div ref={scR} className="menu-scroll" style={{ overflowY: "auto", overflowX: "hidden",
      background: "var(--bg)", position: "relative" }}>
      <style>{CSS}</style>
      <style>{`.menu-scroll{height:100vh;height:100dvh}
        input[type=range].g{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:100px;
          background:linear-gradient(to right,var(--gd) 0%,var(--gd) var(--p),rgba(43,61,43,.12) var(--p),rgba(43,61,43,.12) 100%);outline:none}
        input[type=range].g::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:26px;height:26px;
          border-radius:50%;background:var(--gd);cursor:pointer;border:3px solid var(--bg);box-shadow:0 2px 8px rgba(43,61,43,.3)}
        input[type=range].g::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:var(--gd);
          cursor:pointer;border:3px solid var(--bg);box-shadow:0 2px 8px rgba(43,61,43,.3)}`}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 0%,rgba(43,61,43,.03) 0%,transparent 60%)" }} />

      <div style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--terra)", color: "#fff",
        textAlign: "center", padding: "7px 12px", fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px",
        letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
        Concept demo · the real menu is at /catering</div>

      <header style={{ textAlign: "center", padding: "26px 24px 6px", position: "relative", zIndex: 1 }}>
        <AyatLogo width={110} />
        <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px", fontWeight: 600,
          letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gd)", marginTop: "14px" }}>Catering</p>
      </header>

      {/* A — headcount first. Everything below reacts to this number. */}
      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "18px 24px 8px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--bs)", borderRadius: "18px", padding: "20px 20px 16px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 600,
            color: "var(--tp)", textAlign: "center" }}>How many people are you feeding?</p>
          <p style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "46px", fontStyle: "italic",
            color: "var(--gd)", textAlign: "center", lineHeight: 1.1, margin: "6px 0 2px" }}>{guests}</p>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", color: "var(--tm)",
            textAlign: "center", marginBottom: "16px" }}>{guests >= 60 ? "60+ people" : "people"}</p>
          <input className="g" type="range" min="4" max="60" step="1" value={guests}
            style={{ "--p": ((guests - 4) / 56 * 100) + "%" }}
            onChange={e => setGuests(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            {[4, 20, 40, 60].map(n => <button key={n} onClick={() => setGuests(n)}
              style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px", color: guests === n ? "var(--gd)" : "var(--tm)",
                fontWeight: guests === n ? 600 : 400, background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}>{n}</button>)}
          </div>
        </div>
        <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "11px", color: "var(--tm)",
          textAlign: "center", marginTop: "14px", lineHeight: 1.6 }}>
          Tray sizes below are marked for your group. $300 minimum · 4 hours notice.</p>
      </div>

      <main style={{ maxWidth: "620px", margin: "0 auto", padding: "20px 24px 200px", position: "relative", zIndex: 1 }}>
        {CATERING.map(section => (
          <section key={section.slug} style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "27px", fontWeight: 500, color: "var(--gd)" }}>{section.label}</h2>
              <div style={{ flex: 1, height: "1px", background: "var(--bs)" }} />
            </div>
            {section.items.map((item, i) => {
              const best = bestSize(item);
              return (
                <AnimatedItem key={item.name} delay={Math.min(i, 6) * 0.04}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--bs)", borderRadius: "14px",
                    padding: "16px 16px 14px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 600, color: "var(--tp)" }}>{item.name}</span>
                      {(item.tags || []).map(t => tagCfg[t] && <span key={t} style={{ fontFamily: "'Work Sans',sans-serif",
                        fontSize: "9px", fontWeight: 700, letterSpacing: ".1em", color: tagCfg[t].color }}>{tagCfg[t].label}</span>)}
                    </div>
                    {item.desc && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "12.5px",
                      color: "var(--ts)", lineHeight: 1.55, marginTop: "4px" }}>{item.desc}</p>}
                    <AllergenNote item={item} />

                    {/* B + C — always tappable, and the chip becomes a stepper once added. */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                      {(item.prices || []).map(p => {
                        const q = qtyOf(item, p);
                        const isBest = p.label === best && q === 0;
                        return (
                          <div key={p.label || "one"} style={{ position: "relative" }}>
                            {isBest && <span style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)",
                              background: "var(--gold)", color: "#fff", fontFamily: "'Work Sans',sans-serif", fontSize: "8px",
                              fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px",
                              borderRadius: "100px", whiteSpace: "nowrap", zIndex: 1 }}>For {guests}</span>}
                            {q === 0 ? (
                              <button onClick={() => add(item, p)} style={{ display: "flex", flexDirection: "column",
                                alignItems: "center", gap: "1px", background: isBest ? "rgba(184,134,11,.07)" : "var(--gp)",
                                border: `1px solid ${isBest ? "rgba(184,134,11,.45)" : "var(--bs)"}`, borderRadius: "11px",
                                padding: "9px 15px", cursor: "pointer", minWidth: "78px", transition: "all .2s ease" }}>
                                {p.label && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9px", fontWeight: 600,
                                  letterSpacing: ".1em", textTransform: "uppercase", color: "var(--tm)" }}>{p.label}</span>}
                                <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "18px", fontStyle: "italic", color: "var(--gd)" }}>{p.display || p.price}</span>
                                {p.feeds && p.feeds[1] > 0 && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9px",
                                  color: "var(--tm)" }}>feeds {feedsLabel(p.feeds[0], p.feeds[1])}</span>}
                                <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9.5px", fontWeight: 600,
                                  letterSpacing: ".08em", color: "var(--gold)", marginTop: "3px" }}>+ ADD</span>
                              </button>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                                background: "var(--gd)", border: "1px solid var(--gd)", borderRadius: "11px",
                                padding: "9px 11px", minWidth: "78px" }}>
                                {p.label && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "9px", fontWeight: 600,
                                  letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.65)" }}>{p.label}</span>}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <button onClick={() => changeQty(key(item, p), -1)} aria-label="Remove one"
                                    style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.35)",
                                      background: "transparent", color: "#fff", cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: 0 }}>−</button>
                                  <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "15px", fontWeight: 700,
                                    color: "#fff", minWidth: "14px", textAlign: "center" }}>{q}</span>
                                  <button onClick={() => add(item, p)} aria-label="Add one"
                                    style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.35)",
                                      background: "transparent", color: "#fff", cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: 0 }}>+</button>
                                </div>
                                <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "14px", fontStyle: "italic",
                                  color: "rgba(255,255,255,.85)" }}>${parsePrice(p.price) * q}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </section>
        ))}
      </main>

      {/* D — bottom sheet with a drag handle, plus live coverage against the headcount. */}
      {order.length > 0 && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 100, display: "flex",
          flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
          {sheet && (
            <div onClick={() => setSheet(false)} style={{ position: "fixed", inset: 0,
              background: "rgba(43,61,43,.35)", pointerEvents: "auto" }} />
          )}
          <div style={{ pointerEvents: "auto", width: "100%", maxWidth: "620px", background: "var(--card)",
            borderRadius: "22px 22px 0 0", boxShadow: "0 -10px 40px rgba(43,61,43,.18)",
            border: "1px solid var(--bs)", borderBottom: "none", position: "relative",
            maxHeight: sheet ? "82vh" : "auto", display: "flex", flexDirection: "column",
            transition: "max-height .35s cubic-bezier(.4,0,.2,1)" }}>

            <button onClick={() => setSheet(s => !s)} style={{ background: "none", border: "none", cursor: "pointer",
              padding: "9px 0 3px", width: "100%" }} aria-label={sheet ? "Collapse" : "Expand"}>
              <div style={{ width: "38px", height: "4px", borderRadius: "100px", background: "var(--bs)", margin: "0 auto" }} />
            </button>

            <div onClick={() => setSheet(s => !s)} style={{ cursor: "pointer", padding: "4px 20px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>
                  Feeds about {Math.round(covers)} of your {guests}</span>
                <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "22px", fontStyle: "italic", color: "var(--gd)" }}>${subtotal}</span>
              </div>
              <div style={{ height: "7px", borderRadius: "100px", background: "var(--gp)", overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", borderRadius: "100px",
                  background: pct >= 100 ? "var(--gl)" : "var(--gold)", transition: "width .45s cubic-bezier(.4,0,.2,1)" }} />
              </div>
              <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px", color: belowMin ? "var(--terra)" : "var(--tm)", marginTop: "7px" }}>
                {belowMin ? `$${ORDER_MINIMUM - subtotal} below the $300 minimum`
                  : pct >= 100 ? "Enough for your group · tap to review" : "Tap to review your plan"}</p>
            </div>

            {sheet && (
              <div style={{ overflowY: "auto", borderTop: "1px solid var(--bs)", padding: "6px 20px 20px" }}>
                {order.map(o => (
                  <div key={o.id} style={{ display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 0", borderBottom: "1px solid var(--bs)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 600, color: "var(--tp)" }}>{o.name}</p>
                      <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px", color: "var(--tm)" }}>
                        {o.label ? o.label + " · " : ""}{o.display}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button onClick={() => changeQty(o.id, -1)} style={qBtn}>−</button>
                      <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "14px", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>{o.qty}</span>
                      <button onClick={() => changeQty(o.id, 1)} style={qBtn}>+</button>
                    </div>
                    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: "16px", fontStyle: "italic",
                      color: "var(--gd)", minWidth: "46px", textAlign: "right" }}>${o.price * o.qty}</span>
                  </div>
                ))}

                <button onClick={copyPlan} style={{ width: "100%", marginTop: "16px", fontFamily: "'Work Sans',sans-serif",
                  fontSize: "11px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase",
                  color: copied ? "#fff" : "var(--gd)", background: copied ? "var(--gl)" : "transparent",
                  border: `1px solid ${copied ? "var(--gl)" : "var(--bs)"}`, padding: "14px", borderRadius: "100px",
                  cursor: "pointer", transition: "all .25s ease" }}>
                  {copied ? "✓ Copied to your clipboard" : "Copy my plan"}</button>
                <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: "10.5px", color: "var(--tm)",
                  textAlign: "center", marginTop: "8px", lineHeight: 1.5 }}>
                  Paste it into the order form or read it to us over the phone.</p>

                <a href="tel:+17187660635" style={{ display: "block", textAlign: "center", marginTop: "12px",
                  fontFamily: "'Work Sans',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: ".1em",
                  textTransform: "uppercase", color: "#F5F0E6", background: "var(--gd)", padding: "15px",
                  borderRadius: "100px", textDecoration: "none" }}>Call to place this order</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const qBtn = { width: "25px", height: "25px", borderRadius: "50%", border: "1px solid var(--bs)",
  background: "transparent", color: "var(--gd)", cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: 0 };
