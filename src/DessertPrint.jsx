import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { supabase } from "./supabase.js";
import { AyatLogo, TatreezDivider, itemAllergens } from "./AyatMenu.jsx";

// Printable dessert menu at /dessert-menu. Two identical 5.5x8.5in cards sit side by
// side on a landscape letter sheet, so one print and one straight cut yields two.
// Prices come from Supabase, so a price change in the database reaches the print.

const SWEETS = "Sweets", CAKES = "Cakes";
// The first five desserts are sweets and the rest are cakes, matching the printed menu.
const SWEET_COUNT = 5;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Work+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.dp-screen{min-height:100vh;background:#EDE8DD;display:flex;flex-direction:column;align-items:center;
  gap:22px;padding:28px 16px 48px}
.dp-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.dp-btn{font-family:'Work Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;padding:13px 26px;border-radius:100px;cursor:pointer;border:none;transition:opacity .2s ease}
.dp-btn:hover{opacity:.85}
.dp-btn--primary{color:#F5F0E6;background:#3D5A3D}
.dp-btn--ghost{color:#3D5A3D;background:transparent;border:1px solid rgba(43,61,43,.3)}
.dp-hint{font-family:'Work Sans',sans-serif;font-size:12px;color:#6B7D6B;max-width:460px;
  line-height:1.65;text-align:center}

.dp-sheet{width:11in;height:8.5in;display:flex;background:#F5F0E6;
  box-shadow:0 20px 50px rgba(43,61,43,.18);overflow:hidden}
.dp-card{width:5.5in;height:8.5in;padding:0.34in 0.38in;box-sizing:border-box;
  display:flex;flex-direction:column;background:#F5F0E6;position:relative}
.dp-card + .dp-card{border-left:1px dashed rgba(43,61,43,.28)}

.dp-head{text-align:center;margin-bottom:0.1in}
.dp-title{font-family:'Cormorant Garamond',serif;font-size:21pt;font-weight:400;color:#2B3D2B;
  letter-spacing:.04em;line-height:1;margin-top:9px}
.dp-sub{font-family:'Work Sans',sans-serif;font-size:7pt;font-weight:600;letter-spacing:.3em;
  text-transform:uppercase;color:#B8860B;margin-top:7px}

.dp-section{font-family:'Work Sans',sans-serif;font-size:7.5pt;font-weight:600;letter-spacing:.22em;
  text-transform:uppercase;color:#7E8C7E;margin:0.11in 0 0.06in;display:flex;align-items:center;gap:9px}
.dp-section::after{content:"";flex:1;height:1px;background:rgba(43,61,43,.16)}
.dp-section:first-of-type{margin-top:0}

.dp-item{margin-bottom:0.055in}
.dp-row{display:flex;align-items:baseline;gap:7px}
.dp-name{font-family:'Cormorant Garamond',serif;font-size:13.5pt;font-weight:600;color:#2B3D2B;white-space:nowrap}
.dp-dots{flex:1;border-bottom:1px dotted rgba(43,61,43,.3);transform:translateY(-3px)}
.dp-price{font-family:'Work Sans',sans-serif;font-size:11.5pt;font-weight:500;color:#2B3D2B}
.dp-desc{font-family:'Work Sans',sans-serif;font-size:8.5pt;font-weight:300;color:#5A6B5A;
  line-height:1.32;margin-top:1px;padding-right:0.25in}
.dp-allerg{font-family:'Work Sans',sans-serif;font-size:7pt;font-weight:500;letter-spacing:.04em;
  color:#B85C38;margin-top:2px}

.dp-foot{margin-top:auto;text-align:center;padding-top:0.08in}
.dp-foot-line{font-family:'Work Sans',sans-serif;font-size:6.5pt;letter-spacing:.2em;
  text-transform:uppercase;color:#9BA89B;margin-top:8px}

@media print{
  @page{size:11in 8.5in;margin:0}
  .dp-screen{background:#fff;min-height:0;padding:0;gap:0;display:block}
  .dp-actions,.dp-hint{display:none}
  .dp-sheet{box-shadow:none;margin:0}
  /* Keep the cream background when printing rather than dropping to white paper. */
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
`;

function Card({ sweets, cakes }) {
  const row = item => {
    const allerg = itemAllergens(item);
    return (
      <div className="dp-item" key={item.id}>
        <div className="dp-row">
          <span className="dp-name">{item.name}</span>
          <span className="dp-dots" />
          <span className="dp-price">{item.price}</span>
        </div>
        {item.description && <p className="dp-desc">{item.description}</p>}
        {allerg.length > 0 && (
          <p className="dp-allerg">
            Contains {allerg.join(" · ")}</p>
        )}
      </div>
    );
  };
  return (
    <div className="dp-card">
      <div className="dp-head">
        <AyatLogo width={74} />
        <h1 className="dp-title">Desserts</h1>
        <p className="dp-sub">Ayat Bushwick</p>
      </div>
      <div className="dp-section">{SWEETS}</div>
      {sweets.map(row)}
      <div className="dp-section">{CAKES}</div>
      {cakes.map(row)}
      <div className="dp-foot">
        <TatreezDivider />
      </div>
    </div>
  );
}

export default function DessertPrint() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const sheetRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("menu_items")
        .select("*").eq("category_slug", "desserts").eq("is_active", true).order("sort_order");
      if (error) { setStatus("error"); return; }
      setItems(data || []);
      setStatus("ready");
    })();
  }, []);

  const download = async () => {
    if (!sheetRef.current) return;
    const canvas = await html2canvas(sheetRef.current, { scale: 300 / 96, backgroundColor: "#F5F0E6" });
    const a = document.createElement("a");
    a.download = "ayat-dessert-menu-2up-letter.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const sweets = items.slice(0, SWEET_COUNT);
  const cakes = items.slice(SWEET_COUNT);

  return (
    <div className="dp-screen">
      <style>{CSS}</style>
      {status === "loading" && <p className="dp-hint">Loading the dessert menu…</p>}
      {status === "error" && <p className="dp-hint">Could not load the desserts from the menu database.</p>}
      {status === "ready" && (
        <>
          <div className="dp-actions">
            <button className="dp-btn dp-btn--primary" onClick={() => window.print()}>Print</button>
            <button className="dp-btn dp-btn--ghost" onClick={download}>Download image (300dpi)</button>
          </div>
          <p className="dp-hint">
            One landscape letter sheet holds two identical menus. Print it, cut down the dashed
            centre line, and laminate each half. Prices come straight from the menu database, so
            reprinting after a price change always gives the current prices.
          </p>
          <div className="dp-sheet" ref={sheetRef}>
            <Card sweets={sweets} cakes={cakes} />
            <Card sweets={sweets} cakes={cakes} />
          </div>
        </>
      )}
    </div>
  );
}
