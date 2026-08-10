import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { AyatLogo, TatreezDivider } from "./AyatMenu.jsx";

const MENU_URL = "https://ayatbushwick.menu";

const CARD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Work+Sans:wght@400;500;600&display=swap');
.qr-screen{min-height:100vh;background:#EDE7DA;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:24px;padding:40px 20px;font-family:'Work Sans',sans-serif}
.qr-actions{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.qr-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.qr-btn{font-family:'Work Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;padding:13px 26px;border-radius:100px;cursor:pointer;transition:opacity .2s ease;border:none}
.qr-btn:hover{opacity:.85}
.qr-btn--primary{color:#F5F0E6;background:#3D5A3D}
.qr-btn--ghost{color:#3D5A3D;background:transparent;border:1px solid rgba(43,61,43,.3)}
.qr-hint{font-size:12px;color:#6B7D6B;max-width:360px;line-height:1.6}
.sheet{width:5in;background:#F5F0E6;box-shadow:0 20px 50px rgba(43,61,43,.18);overflow:hidden}
.panel{height:3.5in;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:0.3in 0.4in;box-sizing:border-box}
.panel--top{transform:rotate(180deg)}
.fold{border:none;border-top:1px dashed rgba(43,61,43,.3);margin:0}
.qr-soul{font-family:'Work Sans',sans-serif;font-size:8px;font-weight:600;letter-spacing:.28em;
  text-transform:uppercase;color:#B8860B;margin:8px 0 12px}
.qr-box{padding:9px;background:#fff;border-radius:9px;box-shadow:0 3px 10px rgba(43,61,43,.1)}
.qr-scan{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:#3D5A3D;margin-top:12px}
.qr-site{font-family:'Work Sans',sans-serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;
  color:#9BA89B;margin-top:5px}
@media print{
  @page{size:5in 7in;margin:0}
  .qr-screen{background:#fff;min-height:0;padding:0;gap:0;display:block}
  .qr-actions{display:none}
  .sheet{width:5in;box-shadow:none;margin:0}
}
`;

function Panel({ mod }) {
  return (
    <div className={"panel" + (mod ? " panel--top" : "")}>
      <AyatLogo width={104} />
      <div style={{ margin: "8px 0 0" }}>
        <TatreezDivider color="#3D5A3D" opacity={0.25} />
      </div>
      <p className="qr-soul">Palestinian Soul Food</p>
      <div className="qr-box">
        <QRCodeSVG value={MENU_URL} size={120} level="M" fgColor="#2B3D2B" bgColor="#ffffff" />
      </div>
      <p className="qr-scan">Scan for our menu</p>
      <p className="qr-site">ayatbushwick.menu</p>
    </div>
  );
}

export default function QRCard() {
  const sheetRef = useRef(null);

  const download = async () => {
    const canvas = await html2canvas(sheetRef.current, {
      scale: 300 / 96,
      backgroundColor: "#F5F0E6",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = "ayat-table-tent-5x7.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="qr-screen">
      <style>{CARD_CSS}</style>
      <div className="sheet" ref={sheetRef}>
        <Panel mod />
        <hr className="fold" />
        <Panel />
      </div>
      <div className="qr-actions">
        <div className="qr-btns">
          <button className="qr-btn qr-btn--primary" onClick={download}>Download image (5×7)</button>
          <button className="qr-btn qr-btn--ghost" onClick={() => window.print()}>Print</button>
        </div>
        <p className="qr-hint">
          Download the 5×7 image, upload it as a photo print at Walgreens (or any photo counter),
          then fold along the dashed line so it stands as a small table tent — both sides show the menu QR.
        </p>
      </div>
    </div>
  );
}
