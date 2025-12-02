import { useEffect, useRef, useState } from "react";
import "./App.css";

const GUJARATI_DAYS = [
  "રવિવાર",
  "સોમવાર",
  "મંગળવાર",
  "બુધવાર",
  "ગુરુવાર",
  "શુક્રવાર",
  "શનિવાર",
];

function formatDateDDMMYYYY(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function App() {
  const canvasRef = useRef(null);

  const [theme, setTheme] = useState("pink");
  const [flowerStyle, setFlowerStyle] = useState("style1");
  const [mode, setMode] = useState("flowers");
  const [frameStyle, setFrameStyle] = useState("gold");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() + 1);
  const prevDateStr = formatDateDDMMYYYY(prevDate);
  const prevDayName = GUJARATI_DAYS[prevDate.getDay()];

  const gujaratiLines = [
    `આવતીકાલે તારીખ ${prevDateStr} ને`,
    `વાર ${prevDayName} એ અગિયારસ`,
    "નિમિત્તે રજા રહેશે.",
    "જેની દરેક ગ્રાહકે નોંધ લેવી.",
    "લી. સોહમ કિરાણા સ્ટોર",
  ];

  const themeBackgrounds = {
    pink: ["#ff9a9e", "#fecf63"],
    blue: ["#3a1c71", "#ffaf7b"],
    green: ["#C9FFBF", "#FFAFBD"],
    gold: ["#499FA4", "#E9BC8B"],
    white: ["#ffffff", "#ffffff"],
  };

  const drawBackground = (ctx, w, h) => {
    const colors = themeBackgrounds[theme] || themeBackgrounds.white;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };

  const drawFlowerAt = (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);

    if (flowerStyle === "style1") {
      ctx.fillStyle = "#ff66aa";
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size, size / 2, 0, size);
        ctx.quadraticCurveTo(-size, size / 2, 0, 0);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = "#ffcc00";
      ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (flowerStyle === "style2") {
      ctx.fillStyle = "#8a2be2";
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, size / 2, size / 2, size, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = "#ffd700";
      ctx.arc(0, 0, size / 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (flowerStyle === "style3") {
      ctx.fillStyle = "#ff8c00";
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, size / 1.6, size / 1.5, size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = "#6b3e00";
      ctx.arc(0, 0, size / 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawGoldFrame = (ctx, w, h) => {
    const thickness = Math.min(w, h) * 0.03;
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#fefcea");
    g.addColorStop(0.5, "#f1c40f");
    g.addColorStop(1, "#b8860b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, thickness);
    ctx.fillRect(0, h - thickness, w, thickness);
    ctx.fillRect(0, 0, thickness, h);
    ctx.fillRect(w - thickness, 0, thickness, h);
  };

  const drawWoodFrame = (ctx, w, h) => {
    const thickness = Math.min(w, h) * 0.04;
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(0, 0, w, thickness);
    ctx.fillRect(0, h - thickness, w, thickness);
    ctx.fillRect(0, 0, thickness, h);
    ctx.fillRect(w - thickness, 0, thickness, h);
  };

  const drawCenteredText = (ctx, w, h) => {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "28px 'Noto Sans Gujarati', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lineHeight = 40;
    const totalHeight = gujaratiLines.length * lineHeight;
    let startY = h / 2 - totalHeight / 2 + lineHeight / 2;

    for (const line of gujaratiLines) {
      ctx.fillText(line, w / 2, startY);
      startY += lineHeight;
    }
    ctx.restore();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W = 900;
    const H = 550;
    canvas.width = W;
    canvas.height = H;

    drawBackground(ctx, W, H);

    if (mode === "flowers") {
      drawFlowerAt(ctx, 80, 80, 60);
      drawFlowerAt(ctx, W - 80, 80, 60);
      drawFlowerAt(ctx, 80, H - 80, 60);
      drawFlowerAt(ctx, W - 80, H - 80, 60);
    } else if (mode === "frame") {
      if (frameStyle === "gold") drawGoldFrame(ctx, W, H);
      else drawWoodFrame(ctx, W, H);
    }

    drawCenteredText(ctx, W, H);
  };

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, flowerStyle, mode, frameStyle]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "notice.png";
    link.click();
  };

  return (
    <div className="app-root">

      {/* Hamburger Button - visible on mobile */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Close button */}
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ✖
        </button>

        <h3>Background Themes</h3>
        <button className="theme-btn" onClick={() => setTheme("pink")}>Pink – Yellow</button>
        <button className="theme-btn" onClick={() => setTheme("blue")}>Blue – Purple</button>
        <button className="theme-btn" onClick={() => setTheme("green")}>Soft Green</button>
        <button className="theme-btn" onClick={() => setTheme("gold")}>Premium Gold</button>
        <button className="theme-btn" onClick={() => setTheme("white")}>Plain White</button>

        <h3>Mode</h3>
        <div className="mode-row">
          <button className={`mode-btn ${mode === "flowers" ? "active" : ""}`} onClick={() => setMode("flowers")}>Flowers</button>
          <button className={`mode-btn ${mode === "frame" ? "active" : ""}`} onClick={() => setMode("frame")}>Frame</button>
        </div>

        {mode === "flowers" ? (
          <>
            <h3>Flower Style</h3>
            <button className="theme-btn" onClick={() => setFlowerStyle("style1")}>Simple Flower</button>
            <button className="theme-btn" onClick={() => setFlowerStyle("style2")}>Round Petals</button>
            <button className="theme-btn" onClick={() => setFlowerStyle("style3")}>Sunflower</button>
          </>
        ) : (
          <>
            <h3>Frame Style</h3>
            <button className="theme-btn" onClick={() => setFrameStyle("gold")}>Golden Frame</button>
            <button className="theme-btn" onClick={() => setFrameStyle("wood")}>Wooden Frame</button>
          </>
        )}
      </div>

      {/* Canvas Area */}
      <div className="canvas-area">
        <h2 className="title">Soham Kirana Store – Attractive Notice Image Generator</h2>

        <canvas ref={canvasRef} className="preview-box" />

        <div className="controls-row">
          <button className="download-btn" onClick={downloadImage}>
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}
