import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { supabase } from "./supabase.js";
import { AyatLogo, TatreezDivider, itemAllergens, tagCfg,
  PORTIONS, mergeSizes, PER_PERSON, fmtPrice } from "./AyatMenu.jsx";

// Printable full menu at /print-menu. Same card style and size as the dessert menu:
// 5.5x8.5in cards, two to a landscape letter sheet. The menu is far longer than one
// card, so blocks are measured once at the real card width and packed into as many
// cards as they need. Content comes from Supabase, so a reprint is always current.

const CARD_H = 8.5 * 96, PAD = 0.34 * 96;          // card height and padding in px
const HEADER_H = 1.05 * 96;                        // the logo block, first card only
const BODY_H = CARD_H - PAD * 2;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Work+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.fp-screen{min-height:100vh;background:#EDE8DD;display:flex;flex-direction:column;align-items:center;
  gap:22px;padding:28px 16px 48px}
.fp-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.fp-btn{font-family:'Work Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;padding:13px 26px;border-radius:100px;cursor:pointer;border:none;transition:opacity .2s ease}
.fp-btn:hover{opacity:.85}
.fp-btn--primary{color:#F5F0E6;background:#3D5A3D}
.fp-hint{font-family:'Work Sans',sans-serif;font-size:12px;color:#6B7D6B;max-width:480px;
  line-height:1.65;text-align:center}

.fp-sheet{width:11in;height:8.5in;display:flex;background:#F5F0E6;
  box-shadow:0 20px 50px rgba(43,61,43,.18);overflow:hidden}
.fp-card{width:5.5in;height:8.5in;padding:0.34in 0.38in;box-sizing:border-box;
  display:flex;flex-direction:column;background:#F5F0E6;overflow:hidden}
.fp-card + .fp-card{border-left:1px dashed rgba(43,61,43,.28)}

.fp-head{text-align:center;margin-bottom:0.1in}
.fp-title{font-family:'Cormorant Garamond',serif;font-size:21pt;font-weight:400;color:#2B3D2B;
  letter-spacing:.04em;line-height:1;margin-top:8px}
.fp-sub{font-family:'Work Sans',sans-serif;font-size:7pt;font-weight:600;letter-spacing:.3em;
  text-transform:uppercase;color:#B8860B;margin-top:6px}

.fp-section{font-family:'Work Sans',sans-serif;font-size:7.5pt;font-weight:600;letter-spacing:.22em;
  text-transform:uppercase;color:#7E8C7E;margin:0.11in 0 0.06in;display:flex;align-items:center;gap:9px}
.fp-section::after{content:"";flex:1;height:1px;background:rgba(43,61,43,.16)}

.fp-item{margin-bottom:0.055in}
.fp-row{display:flex;align-items:baseline;gap:7px}
.fp-name{font-family:'Cormorant Garamond',serif;font-size:12.5pt;font-weight:600;color:#2B3D2B;white-space:nowrap}
.fp-tag{font-family:'Work Sans',sans-serif;font-size:5.5pt;font-weight:600;letter-spacing:.08em;white-space:nowrap}
.fp-dots{flex:1;border-bottom:1px dotted rgba(43,61,43,.3);transform:translateY(-3px)}
.fp-price{font-family:'Work Sans',sans-serif;font-size:10.5pt;font-weight:500;color:#2B3D2B;white-space:nowrap}
.fp-size{font-size:6pt;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7E8C7E}
.fp-portion{font-family:'Work Sans',sans-serif;font-size:6.5pt;font-weight:500;color:#7E8C7E;margin-top:1px}
.fp-desc{font-family:'Work Sans',sans-serif;font-size:8pt;font-weight:300;color:#5A6B5A;
  line-height:1.32;margin-top:1px;padding-right:0.2in}
.fp-allerg{font-family:'Work Sans',sans-serif;font-size:6.5pt;font-weight:500;color:#B85C38;margin-top:1px}

.fp-measure{position:absolute;left:-9999px;top:0;width:calc(5.5in - 0.76in);visibility:hidden}

@media print{
  @page{size:11in 8.5in;margin:0}
  .fp-screen{background:#fff;min-height:0;padding:0;gap:0;display:block}
  .fp-actions,.fp-hint{display:none}
  .fp-sheet{box-shadow:none;margin:0;break-after:page;page-break-after:always}
  .fp-sheet:last-child{break-after:auto;page-break-after:auto}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
`;

function Item({ item, perPerson }) {
  const portion = perPerson ? `Min order: 4/$${fmtPrice(item.price * 4)}` : PORTIONS[item.name];
  const allerg = itemAllergens(item);
  const tags = (item.tags || []).filter(t => tagCfg[t]);
  return (
    <div className="fp-item">
      <div className="fp-row">
        <span className="fp-name">{item.name}</span>
        {tags.map(t => (
          <span key={t} className="fp-tag" style={{ color: tagCfg[t].color }}>{tagCfg[t].label.toUpperCase()}</span>
        ))}
        <span className="fp-dots" />
        <span className="fp-price">
          {item.variants
            ? item.variants.map(v => (
                <span key={v.size}>
                  <span className="fp-size">{v.size === "Small" ? "Sm " : " Lg "}</span>{fmtPrice(v.price)}
                </span>
              ))
            : <>{fmtPrice(item.price)}{perPerson && <span className="fp-size"> /person</span>}</>}
        </span>
      </div>
      {portion && <p className="fp-portion">{portion}</p>}
      {item.description && <p className="fp-desc">{item.description}</p>}
      {allerg.length > 0 && <p className="fp-allerg">Contains {allerg.join(" · ")}</p>}
    </div>
  );
}

const Section = ({ label }) => <div className="fp-section">{label}</div>;

export default function FullMenuPrint() {
  const [blocks, setBlocks] = useState(null);
  const [cards, setCards] = useState(null);
  const [status, setStatus] = useState("loading");
  const measureRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (catRes.error || itemRes.error) { setStatus("error"); return; }
      const out = [];
      for (const cat of catRes.data) {
        const items = mergeSizes(itemRes.data.filter(i => i.category_slug === cat.slug));
        if (!items.length) continue;
        out.push({ key: "s-" + cat.slug, kind: "section", label: cat.label });
        for (const it of items)
          out.push({ key: "i-" + cat.slug + "-" + it.id, kind: "item", item: it, perPerson: PER_PERSON.has(cat.slug) });
      }
      setBlocks(out);
      setStatus("measuring");
    })();
  }, []);

  // Measure every block once at the real card width, then pack them into cards. A section
  // heading is never left alone at the foot of a card with no item under it.
  useLayoutEffect(() => {
    if (!blocks || !measureRef.current) return;
    const nodes = [...measureRef.current.children];
    if (nodes.length !== blocks.length) return;
    const heights = nodes.map(n => {
      const cs = getComputedStyle(n);
      return n.offsetHeight + parseFloat(cs.marginTop || 0) + parseFloat(cs.marginBottom || 0);
    });
    const out = []; let cur = []; let used = HEADER_H;
    for (let i = 0; i < blocks.length; i++) {
      const h = heights[i];
      const orphanSection = blocks[i].kind === "section" &&
        (i + 1 >= blocks.length || used + h + heights[i + 1] > BODY_H);
      if (cur.length && (used + h > BODY_H || orphanSection)) {
        out.push(cur); cur = []; used = 0;
      }
      cur.push(blocks[i]); used += h;
    }
    if (cur.length) out.push(cur);
    setCards(out);
    setStatus("ready");
  }, [blocks]);

  const sheets = [];
  if (cards) for (let i = 0; i < cards.length; i += 2) sheets.push(cards.slice(i, i + 2));

  const render = b => b.kind === "section"
    ? <Section key={b.key} label={b.label} />
    : <Item key={b.key} item={b.item} perPerson={b.perPerson} />;

  return (
    <div className="fp-screen">
      <style>{CSS}</style>

      {blocks && status !== "ready" && (
        <div className="fp-measure" ref={measureRef}>{blocks.map(render)}</div>
      )}

      {status === "loading" && <p className="fp-hint">Loading the menu…</p>}
      {status === "measuring" && <p className="fp-hint">Laying out the pages…</p>}
      {status === "error" && <p className="fp-hint">Could not load the menu from the database.</p>}

      {status === "ready" && (
        <>
          <div className="fp-actions">
            <button className="fp-btn fp-btn--primary" onClick={() => window.print()}>Print</button>
          </div>
          <p className="fp-hint">
            {cards.length} cards across {sheets.length} landscape letter {sheets.length === 1 ? "sheet" : "sheets"}.
            Print, cut each sheet down the dashed centre line, and laminate. The cards read in order.
          </p>
          {sheets.map((pair, si) => (
            <div className="fp-sheet" key={si}>
              {pair.map((card, ci) => {
                const n = si * 2 + ci;
                return (
                  <div className="fp-card" key={ci}>
                    {n === 0 && (
                      <div className="fp-head">
                        <AyatLogo width={74} />
                        <h1 className="fp-title">Menu</h1>
                        <p className="fp-sub">Ayat Bushwick</p>
                      </div>
                    )}
                    {card.map(render)}
                  </div>
                );
              })}
              {pair.length === 1 && <div className="fp-card" />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
