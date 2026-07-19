"use client";
import React, { useState, useEffect } from "react";

/*
  Adrenal Vein Sampling Interpretation Tool
  ------------------------------------------
  Self-contained React component. No external dependencies.
  Styles are scoped under `.avs-root`; fonts are injected on mount.
  Default export — drop into any React app (Vite / CRA / Next.js).
  For Next.js app router keep the "use client" directive above.
*/

/* ============================ Styles ============================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
body{margin:0}
.avs-root{
  --ink:#0b262f; --ink-2:#123540; --paper:#eaf0f1; --card:#ffffff;
  --line:#d6e0e2; --line-strong:#b9c8cb; --muted:#5c7077; --muted-2:#7f9298;
  --teal:#0f8a78; --teal-deep:#0a6a5c; --teal-soft:#e4f3f0; --teal-line:#bfe2db;
  --met:#5f54b8; --met-soft:#ecebf8; --met-line:#cfcbee;
  --pass:#0f7a54; --pass-soft:#e3f4ec; --fail:#c0392b; --fail-soft:#fbe9e6;
  --warn:#a86a12; --warn-soft:#fcf1dd; --warn-line:#eed7ac;
  --shadow:0 1px 2px rgba(11,38,47,.05), 0 5px 18px rgba(11,38,47,.06); --radius:12px;
  background:var(--paper); min-height:100vh; color:var(--ink);
  font-family:"IBM Plex Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:14.5px; line-height:1.45; -webkit-font-smoothing:antialiased;
}
.avs-root *{box-sizing:border-box}
.avs-root .wrap{max-width:940px;margin:0 auto;padding:0 18px 56px}
.avs-root .mono{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}

.avs-root header.top{background:
    radial-gradient(120% 150% at 90% -30%, rgba(15,138,120,.26), transparent 55%),
    linear-gradient(180deg,var(--ink) 0%, var(--ink-2) 100%);
  color:#eef6f5;padding:22px 0 20px;position:relative;overflow:hidden}
.avs-root header.top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--teal) 20%,var(--teal) 80%,transparent);opacity:.8}
.avs-root .top .wrap{padding-bottom:0}
.avs-root .eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;
  color:#7fd8c9;display:flex;align-items:center;gap:9px;margin-bottom:9px}
.avs-root .eyebrow .tick{width:22px;height:1px;background:#3f7d76}
.avs-root h1.title{font-family:"IBM Plex Serif",Georgia,serif;font-weight:600;
  font-size:clamp(23px,4vw,32px);line-height:1.08;margin:0 0 7px;letter-spacing:-.01em}
.avs-root .subtitle{color:#a9c6c4;max-width:64ch;font-size:14px;margin:0}
.avs-root .subtitle b{color:#d7ebe8;font-weight:600}

.avs-root .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);
  box-shadow:var(--shadow);margin-top:14px;overflow:hidden}
.avs-root .card-hd{padding:14px 18px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.avs-root .card-hd h2{font-size:17px;margin:0 0 1px;letter-spacing:-.01em}
.avs-root .card-hd p.hint{color:var(--muted);font-size:13px;margin:1px 0 0;max-width:70ch}
.avs-root .card-bd{padding:12px 18px 16px}

.avs-root .cfg-row{display:flex;flex-wrap:wrap;gap:10px 26px;align-items:flex-start}
.avs-root .cfg-group{display:flex;flex-direction:column;gap:6px}
.avs-root .cfg-label{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;font-weight:600;color:var(--muted-2)}
.avs-root .chk-row{display:flex;flex-wrap:wrap;gap:7px}
.avs-root .chk{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none;
  border:1px solid var(--line-strong);background:#fbfdfd;padding:7px 11px;border-radius:9px;
  font-size:13.5px;font-weight:500;transition:.14s ease;line-height:1}
.avs-root .chk:hover{border-color:var(--teal);background:var(--teal-soft)}
.avs-root .chk input{position:absolute;opacity:0;width:0;height:0}
.avs-root .chk .box{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--line-strong);
  background:#fff;display:grid;place-items:center;flex:none;transition:.14s ease}
.avs-root .chk .box svg{width:11px;height:11px;stroke:#fff;stroke-width:3;fill:none;opacity:0;transform:scale(.6);transition:.14s ease}
.avs-root .chk.on{border-color:var(--teal);background:var(--teal-soft);color:var(--teal-deep)}
.avs-root .chk.on .box{background:var(--teal);border-color:var(--teal)}
.avs-root .chk.on .box svg{opacity:1;transform:scale(1)}
.avs-root .chk.met.on{border-color:var(--met);background:var(--met-soft);color:#3b3486}
.avs-root .chk.met.on .box{background:var(--met);border-color:var(--met)}
.avs-root .cfg-foot{font-size:12px;color:var(--muted-2);margin:9px 0 0;line-height:1.5}
.avs-root .unit-inline{display:flex;flex-wrap:wrap;gap:9px;margin-top:11px;padding-top:11px;border-top:1px dashed var(--line)}
.avs-root .fld{display:flex;align-items:center;gap:7px}
.avs-root .fld label{font-size:12px;color:var(--muted);font-weight:500;white-space:nowrap}
.avs-root select{font-family:"IBM Plex Mono",monospace;font-size:12.5px;font-weight:500;
  padding:6px 26px 6px 9px;border:1px solid var(--line-strong);border-radius:8px;background:#fbfdfd;
  color:var(--ink);appearance:none;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235c7077' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 9px center;transition:.14s}
.avs-root select:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft)}
.avs-root .units-note{font-size:11.5px;color:var(--muted-2);margin:8px 0 0}

.avs-root .timing-block{margin-top:12px}
.avs-root .timing-block:first-child{margin-top:2px}
.avs-root .timing-tag{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;
  letter-spacing:.03em;text-transform:uppercase;color:var(--ink);
  background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:4px 11px;margin-bottom:7px}
.avs-root .timing-tag .dot{width:6px;height:6px;border-radius:50%}
.avs-root .dot.pre{background:var(--teal)} .avs-root .dot.post{background:#d98a2b}
.avs-root .entry-wrap{overflow-x:auto;margin-top:4px;padding-bottom:2px}
.avs-root table.entry{border-collapse:collapse;font-size:13.5px}
.avs-root table.entry th,.avs-root table.entry td{padding:6px 12px}
.avs-root table.entry thead th.site-h{text-align:left;vertical-align:bottom;border-bottom:1px solid var(--line);
  font-size:11px;letter-spacing:.02em;text-transform:uppercase;color:var(--muted);font-weight:600}
.avs-root table.entry thead th.grp{text-align:center;font-size:11px;letter-spacing:.04em;text-transform:uppercase;
  font-weight:600;color:var(--ink);padding-bottom:5px}
.avs-root table.entry thead th.grp .gdot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:6px;vertical-align:middle}
.avs-root table.entry thead th.grp .gdot.pre{background:var(--teal)}
.avs-root table.entry thead th.grp .gdot.post{background:#d98a2b}
.avs-root table.entry thead th.sub{text-align:center;vertical-align:bottom;border-bottom:1px solid var(--line);
  font-size:10.5px;letter-spacing:.02em;text-transform:uppercase;color:var(--muted);font-weight:600;white-space:nowrap}
.avs-root table.entry thead th.sub .u{display:block;font-weight:500;text-transform:none;letter-spacing:0;color:var(--muted-2);font-size:10px;margin-top:1px}
.avs-root table.entry td.n{text-align:center;border-bottom:1px solid var(--line)}
.avs-root table.entry td.site-cell{text-align:left;white-space:nowrap;border-bottom:1px solid var(--line)}
.avs-root table.entry tbody tr:last-child td{border-bottom:none}
.avs-root table.entry .divide{border-left:1px solid var(--line-strong)}
.avs-root .site-cell{font-weight:600;color:var(--ink);white-space:nowrap;font-size:13px}
.avs-root .site-cell.periph{color:var(--muted)}
.avs-root input.val{width:70px;font-family:"IBM Plex Mono",monospace;font-size:13px;font-weight:500;
  padding:5px 7px;border:1px solid var(--line-strong);border-radius:6px;background:#fbfdfd;color:var(--ink);transition:.14s}
.avs-root input.val::placeholder{color:#b7c4c7;font-weight:400}
.avs-root input.val:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px var(--teal-soft);background:#fff}
.avs-root input.val.met:focus{border-color:var(--met);box-shadow:0 0 0 3px var(--met-soft)}

.avs-root .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.avs-root .btn{font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border-radius:8px;padding:8px 13px;
  border:1px solid var(--line-strong);background:#fbfdfd;color:var(--ink-2);transition:.14s;display:inline-flex;align-items:center;gap:6px}
.avs-root .btn:hover{border-color:var(--teal);color:var(--teal-deep);background:var(--teal-soft)}
.avs-root .btn.primary{background:var(--teal);border-color:var(--teal);color:#fff}
.avs-root .btn.primary:hover{background:var(--teal-deep);border-color:var(--teal-deep);color:#fff}
.avs-root .btn svg{width:14px;height:14px}
.avs-root .btn-mini{font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;border-radius:7px;padding:6px 10px;
  border:1px solid var(--line-strong);background:#fbfdfd;color:var(--muted);transition:.14s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.avs-root .btn-mini:hover{border-color:var(--teal);color:var(--teal-deep);background:var(--teal-soft)}
.avs-root .btn-mini.ok{border-color:var(--pass);color:var(--pass);background:var(--pass-soft)}
.avs-root .btn-mini svg{width:13px;height:13px}

.avs-root .res-timing{margin-top:13px}
.avs-root .res-timing:first-child{margin-top:2px}
.avs-root .ref-label{font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;font-weight:600;color:var(--muted);margin:11px 0 2px}
.avs-root .ref-label.met{color:var(--met)}
.avs-root table.res{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.avs-root table.res th,.avs-root table.res td{padding:5px 8px;border-bottom:1px solid var(--line)}
.avs-root table.res thead th{font-size:10.5px;text-transform:uppercase;letter-spacing:.02em;color:var(--muted);font-weight:600;text-align:right}
.avs-root table.res thead th:first-child{text-align:left}
.avs-root table.res td{text-align:right}
.avs-root table.res td:first-child{text-align:left;font-weight:600}
.avs-root table.res td.periph{color:var(--muted);font-weight:600}
.avs-root table.res tbody tr:last-child td{border-bottom:none}
.avs-root .num{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums}
.avs-root td.dom{background:var(--teal-soft)}
.avs-root td.dom.met{background:var(--met-soft)}
.avs-root .si-pass{color:var(--pass);font-weight:600}
.avs-root .si-fail{color:var(--fail);font-weight:600}
.avs-root .summary-row{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:7px;padding:8px 11px;border-radius:9px;
  background:var(--paper);border:1px solid var(--line);font-size:12.5px;align-items:center}
.avs-root .summary-row.met{background:var(--met-soft);border-color:var(--met-line)}
.avs-root .metric{display:flex;align-items:baseline;gap:6px}
.avs-root .metric .k{font-size:10.5px;letter-spacing:.02em;text-transform:uppercase;color:var(--muted);font-weight:600}
.avs-root .metric .v{font-family:"IBM Plex Mono",monospace;font-size:14px;font-weight:600;color:var(--ink)}
.avs-root .metric .v small{font-size:11px;font-weight:500;color:var(--muted);margin-left:3px}
.avs-root .pill{font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;letter-spacing:.02em}
.avs-root .pill.lat{background:var(--pass-soft);color:var(--pass)}
.avs-root .pill.nonlat{background:#fff;color:var(--muted);border:1px solid var(--line-strong)}

.avs-root .seg{display:inline-flex;background:var(--paper);border:1px solid var(--line-strong);border-radius:9px;padding:3px;gap:2px}
.avs-root .seg button{font-family:inherit;font-size:12.5px;font-weight:600;border:none;background:transparent;color:var(--muted);
  padding:6px 13px;border-radius:7px;cursor:pointer;transition:.14s}
.avs-root .seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.08)}
.avs-root .seg-wrap{display:flex;align-items:center;gap:9px;margin-bottom:4px;font-size:12.5px;color:var(--muted)}
.avs-root .pathway{margin-top:10px}
.avs-root .pstep{position:relative;padding:0 0 2px 38px;margin-bottom:9px}
.avs-root .pstep::before{content:"";position:absolute;left:13px;top:26px;bottom:-9px;width:2px;background:var(--line)}
.avs-root .pstep:last-child::before{display:none}
.avs-root .pstep .node{position:absolute;left:0;top:1px;width:26px;height:26px;border-radius:50%;
  display:grid;place-items:center;font-family:"IBM Plex Mono",monospace;font-weight:600;font-size:12px;
  background:#fff;border:2px solid var(--line-strong);color:var(--muted);z-index:1}
.avs-root .pstep.pass .node{border-color:var(--pass);background:var(--pass);color:#fff}
.avs-root .pstep.fail .node{border-color:var(--fail);background:var(--fail);color:#fff}
.avs-root .pstep.warn .node{border-color:var(--warn);background:var(--warn);color:#fff}
.avs-root .pstep h3{font-size:14px;margin:3px 0 1px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.avs-root .pstep h3 .cut{font-size:11px;font-weight:500;color:var(--muted);background:var(--paper);border:1px solid var(--line);padding:1px 7px;border-radius:5px}
.avs-root .pstep .lines{margin:4px 0 0;display:flex;flex-direction:column;gap:3px}
.avs-root .pline{display:flex;align-items:baseline;gap:7px;font-size:12.5px;flex-wrap:wrap}
.avs-root .pline .lab{color:var(--muted);min-width:88px}
.avs-root .pline .figs{font-family:"IBM Plex Mono",monospace;font-weight:600}
.avs-root .tag{font-size:10.5px;font-weight:600;padding:1px 6px;border-radius:5px}
.avs-root .tag.pass{background:var(--pass-soft);color:var(--pass)}
.avs-root .tag.fail{background:var(--fail-soft);color:var(--fail)}
.avs-root .tag.warn{background:var(--warn-soft);color:var(--warn)}
.avs-root .tag.met{background:var(--met-soft);color:var(--met)}
.avs-root .pnote{font-size:12.5px;color:var(--muted);margin:4px 0 0;line-height:1.5}
.avs-root .verdict{margin-top:12px;border-radius:11px;padding:14px 16px;border:1px solid var(--line)}
.avs-root .verdict.uni{background:linear-gradient(180deg,var(--teal-soft),#fff);border-color:var(--teal-line)}
.avs-root .verdict.bi{background:linear-gradient(180deg,var(--paper),#fff);border-color:var(--line-strong)}
.avs-root .verdict.nd{background:linear-gradient(180deg,var(--warn-soft),#fff);border-color:var(--warn-line)}
.avs-root .verdict .vk{font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.avs-root .verdict h3{font-family:"IBM Plex Serif",serif;font-weight:600;font-size:20px;margin:3px 0 5px;letter-spacing:-.01em}
.avs-root .verdict.uni h3{color:var(--teal-deep)}
.avs-root .verdict.nd h3{color:var(--warn)}
.avs-root .verdict p{margin:0;font-size:13px;color:var(--ink-2);max-width:82ch;line-height:1.5}
.avs-root .side-tag{display:inline-block;font-family:"IBM Plex Mono",monospace;font-weight:600;background:var(--teal);color:#fff;padding:1px 9px;border-radius:6px;letter-spacing:.03em}
.avs-root .caveat{margin-top:10px;border-radius:10px;padding:11px 13px;border:1px solid var(--warn-line);
  background:var(--warn-soft);display:flex;gap:10px;align-items:flex-start}
.avs-root .caveat svg{width:18px;height:18px;flex:none;stroke:var(--warn);fill:none;stroke-width:2;margin-top:1px}
.avs-root .caveat .ct{font-size:12.5px;line-height:1.5}
.avs-root .caveat .ct b{color:var(--warn)}
.avs-root .note-box{margin-top:12px;border:1px solid var(--line);border-radius:10px;background:#fbfdfd;overflow:hidden}
.avs-root .note-box .nb-hd{display:flex;justify-content:space-between;align-items:center;gap:10px;
  padding:8px 12px;background:var(--paper);border-bottom:1px solid var(--line)}
.avs-root .note-box .nb-hd .t{font-size:11px;letter-spacing:.05em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.avs-root .note-box .nb-bd{padding:11px 13px;font-size:13px;line-height:1.55;color:var(--ink-2)}
.avs-root .empty{padding:26px 18px;text-align:center;color:var(--muted-2)}
.avs-root .empty svg{width:30px;height:30px;stroke:var(--line-strong);fill:none;stroke-width:1.5;margin-bottom:6px}
.avs-root .empty .t{font-weight:600;color:var(--muted)}
.avs-root .empty .s{font-size:12.5px;margin-top:2px}
.avs-root footer{margin-top:20px;color:var(--muted-2);font-size:12px;line-height:1.55}
.avs-root .disc{background:#fff;border:1px solid var(--warn-line);border-left:3px solid var(--warn);border-radius:8px;padding:9px 12px;font-size:12px;color:var(--ink-2)}
.avs-root footer .thr{margin:0 0 9px}
.avs-root footer .thr b{color:var(--muted)}
@media print{
  .avs-root header.top{background:#0b262f !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .avs-root .actions,.avs-root .seg-wrap,.avs-root #config,.avs-root .btn-mini{display:none}
  .avs-root .card{box-shadow:none;break-inside:avoid}
}
@media(max-width:640px){
  .avs-root input.val{width:80px}
  .avs-root .card-hd{flex-direction:column}
}
`;

/* ============================ Constants ============================ */
const UNIT_OPTS = {
  aldo: ["ng/dL", "pmol/L", "ng/L", "pg/mL"],
  cortisol: ["µg/dL", "nmol/L", "µg/L"],
  met: ["nmol/L", "pmol/L", "pg/mL"],
};
const SITES = [
  { key: "rav", name: "Right adrenal vein", cls: "" },
  { key: "lav", name: "Left adrenal vein", cls: "" },
  { key: "periph", name: "Peripheral / IVC", cls: "periph" },
];

/* ============================ Pure helpers ============================ */
function parseNum(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (s === "") return null;
  const less = /^[<≤]/.test(s);
  s = s.replace(/^[<≤]\s*/, "").replace(/,/g, "");
  const v = parseFloat(s);
  if (!isFinite(v)) return null;
  return { v, less };
}
function getV(values, tm, site, an) { return parseNum(values[tm + "_" + site + "_" + an]); }
function fmt(x, dp) { if (x == null || !isFinite(x)) return "—"; dp = dp == null ? 1 : dp; return x.toFixed(dp); }
function f1(x) { return x == null || !isFinite(x) ? "-" : x.toFixed(1); }
function f2(x) { return x == null || !isFinite(x) ? "-" : x.toFixed(2); }
function sideName(d) { return d === "right" ? "Right" : d === "left" ? "Left" : "—"; }
function sideLow(d) { return d === "right" ? "right" : d === "left" ? "left" : "the dominant side"; }
function refLabel(rk) { return rk === "c" ? "cortisol" : "metanephrine"; }
function timingLabel(tm) { return tm === "pre" ? "pre-ACTH" : "post-ACTH"; }
function opp(d) { return d === "right" ? "left" : d === "left" ? "right" : "the contralateral"; }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function joinAnd(a) { a = a.filter(Boolean); if (a.length <= 1) return a[0] || ""; if (a.length === 2) return a[0] + " and " + a[1]; return a.slice(0, -1).join(", ") + ", and " + a[a.length - 1]; }
function activeTimings(config) { const a = []; if (config.pre) a.push("pre"); if (config.post) a.push("post"); return a; }

/* ============================ Compute ============================ */
function computeRef(values, tm, ref) {
  const g = (site) => ({ a: getV(values, tm, site, "a"), r: getV(values, tm, site, ref) });
  const R = g("rav"), L = g("lav"), P = g("periph");
  const num = (x) => (x ? x.v : null);
  const o = {
    ref,
    rav: { a: num(R.a), r: num(R.r) },
    lav: { a: num(L.a), r: num(L.r) },
    periph: { a: num(P.a), r: num(P.r) },
    less: { rp: !!(P.r && P.r.less), rr: !!(R.r && R.r.less), lr: !!(L.r && L.r.less) },
  };
  o.siR = o.rav.r != null && o.periph.r ? o.rav.r / o.periph.r : null;
  o.siL = o.lav.r != null && o.periph.r ? o.lav.r / o.periph.r : null;
  o.acR = o.rav.a != null && o.rav.r ? o.rav.a / o.rav.r : null;
  o.acL = o.lav.a != null && o.lav.r ? o.lav.a / o.lav.r : null;
  o.acP = o.periph.a != null && o.periph.r ? o.periph.a / o.periph.r : null;
  if (o.acR != null && o.acL != null) {
    const hi = Math.max(o.acR, o.acL), lo = Math.min(o.acR, o.acL);
    o.dominant = o.acR >= o.acL ? "right" : "left";
    o.LI = lo > 0 ? hi / lo : null;
  } else { o.dominant = null; o.LI = null; }
  if (o.dominant && o.acP) {
    const nd = o.dominant === "right" ? o.acL : o.acR;
    o.CSI = nd != null ? nd / o.acP : null;
  } else o.CSI = null;
  o.siCut = ref === "c" ? (tm === "pre" ? 3 : 5) : 3;
  o.liCut = ref === "c" ? 4 : 4.3;
  o.selR = o.siR != null ? o.siR > o.siCut : null;
  o.selL = o.siL != null ? o.siL > o.siCut : null;
  o.lateralizing = o.LI != null ? o.LI > o.liCut : null;
  o.csiPos = o.CSI != null ? o.CSI < 1.0 : null;
  o.hasAny = o.rav.a != null || o.lav.a != null || o.periph.a != null || o.rav.r != null;
  return o;
}
function computeTiming(values, config, tm) {
  const res = { tm };
  if (config.cortisol) res.c = computeRef(values, tm, "c");
  if (config.met) res.m = computeRef(values, tm, "m");
  res.hasData = (res.c && res.c.hasAny) || (res.m && res.m.hasAny);
  return res;
}
function sideStatus(T) {
  const st = { right: { has: false, sel: false }, left: { has: false, sel: false } };
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o) return;
    if (o.siR != null) { st.right.has = true; if (o.selR) st.right.sel = true; }
    if (o.siL != null) { st.left.has = true; if (o.selL) st.left.sel = true; }
  });
  return st;
}
function interpretResult(T) {
  const decision = T.c ? T.c : T.m;
  const discord =
    T.c && T.m && T.c.LI != null && T.m.LI != null &&
    (T.c.lateralizing !== T.m.lateralizing || (T.c.lateralizing && T.m.lateralizing && T.c.dominant !== T.m.dominant));
  const useMet = discord && T.m;
  const d = useMet ? T.m : decision;
  const st = sideStatus(T);
  const blocked = (st.right.has && !st.right.sel) || (st.left.has && !st.left.sel);
  let cls;
  if (!d || d.LI == null) cls = "incomplete";
  else if (blocked) cls = "nd";
  else if (d.lateralizing) cls = "uni";
  else cls = "bi";
  return { decision, d, useMet, discord, st, blocked, cls };
}

/* ============================ Clinical note ============================ */
function refHasAnyData(ctx, rk) {
  let found = false;
  activeTimings(ctx.config).forEach((tm) =>
    ["rav", "lav", "periph"].forEach((s) => { if (getV(ctx.values, tm, s, rk) != null) found = true; })
  );
  return found;
}
function clinicalNote(ctx, T, tm, R) {
  const { values, config } = ctx;
  const parts = [];

  const postHas = config.post && computeTiming(values, config, "post").hasData;
  const preHas = config.pre && computeTiming(values, config, "pre").hasData;
  const timingPhrase = preHas && postHas ? "both before and after ACTH (cosyntropin) stimulation"
    : postHas ? "with ACTH (cosyntropin) stimulation"
    : preHas ? "without ACTH stimulation" : "";
  const mRefs = [];
  if (config.cortisol && refHasAnyData(ctx, "c")) mRefs.push("cortisol");
  if (config.met && refHasAnyData(ctx, "m")) mRefs.push("metanephrine");
  if (!mRefs.length) { if (config.cortisol) mRefs.push("cortisol"); if (config.met) mRefs.push("metanephrine"); }
  const refPhrase = mRefs.length > 1 ? joinAnd(mRefs) + " as reference hormones" : (mRefs[0] || "cortisol") + " as the reference hormone";
  parts.push("Adrenal vein sampling was performed " + timingPhrase + " using " + refPhrase + ".");

  const rightSel = [], rightFail = [], leftSel = [], leftFail = [], fullRefs = [], partialRefs = [];
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o) return; const lbl = refLabel(rk);
    const hasR = o.siR != null, hasL = o.siL != null;
    if (hasR) (o.selR ? rightSel : rightFail).push(lbl);
    if (hasL) (o.selL ? leftSel : leftFail).push(lbl);
    if (hasR && hasL) { if (o.selR && o.selL) fullRefs.push(lbl); else if (o.selR === false || o.selL === false) partialRefs.push(lbl); }
  });
  const rightHasSI = rightSel.length || rightFail.length, leftHasSI = leftSel.length || leftFail.length;
  const rightConfirmed = rightSel.length > 0, leftConfirmed = leftSel.length > 0;
  const rightFailed = rightHasSI && !rightConfirmed, leftFailed = leftHasSI && !leftConfirmed;
  let proceed = true;

  const siBits = [];
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o || o.siR == null || o.siL == null) return;
    siBits.push(refLabel(rk) + " selectivity index right " + f1(o.siR) + ", left " + f1(o.siL));
  });
  const siParen = siBits.length ? " (" + siBits.join("; ") + ")" : "";

  if (!rightHasSI && !leftHasSI) {
    parts.push("Selectivity indices could not be calculated because a peripheral reference value was not provided, so cannulation should be confirmed before the lateralization result is relied upon.");
  } else if (rightFailed || leftFailed) {
    proceed = false;
    const fs = []; if (rightFailed) fs.push("right"); if (leftFailed) fs.push("left");
    parts.push("Selectivity criteria were not met for the " + joinAnd(fs) + " adrenal vein" + (fs.length > 1 ? "s" : "") + siParen + ", so that gland was likely not cannulated and lateralization cannot be reliably assessed.");
  } else if (!partialRefs.length) {
    parts.push("Selectivity criteria were met for both the right and left adrenal veins" + siParen + ".");
  } else if (fullRefs.length) {
    parts.push("Selectivity criteria were met based on " + joinAnd(fullRefs) + ", though not using " + joinAnd(partialRefs) + siParen + ", so the interpretation proceeds with caution.");
  } else {
    parts.push("Selectivity criteria were met for each adrenal vein using different reference hormones, the right based on " + joinAnd(rightSel) + " and the left based on " + joinAnd(leftSel) + siParen + ", so the interpretation proceeds with caution.");
  }

  if (!proceed) {
    parts.push("Overall, the study is non-diagnostic owing to inadequate selectivity; either repeat adrenal vein sampling or empirical medical therapy with a mineralocorticoid receptor antagonist should be considered.");
    return parts.join(" ");
  }

  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o || o.LI == null) return;
    const dom = sideLow(o.dominant);
    const ratio = " (aldosterone:" + refLabel(rk) + " " + f1(o.acR) + " on the right versus " + f1(o.acL) + " on the left)";
    if (o.lateralizing) {
      parts.push("The " + timingLabel(tm) + " " + refLabel(rk) + "-referenced lateralization index was " + f1(o.LI) + ratio + ", which lateralizes to the " + dom + " adrenal vein, the " + dom + " gland being dominant.");
    } else {
      parts.push("The " + timingLabel(tm) + " " + refLabel(rk) + "-referenced lateralization index was " + f1(o.LI) + ratio + ", which is non-lateralizing; the " + dom + " adrenal vein was numerically dominant but did not reach the threshold of " + o.liCut + ", favouring bilateral disease.");
    }
  });

  const decisionRk = R.useMet ? "m" : (T.c ? "c" : "m");
  const d = R.d;
  if (d && d.CSI != null) {
    const nonDom = sideLow(opp(d.dominant));
    const nonDomAC = d.dominant === "right" ? d.acL : d.acR;
    const csiRatio = nonDomAC != null && d.acP != null ? " (aldosterone:" + refLabel(decisionRk) + " " + f1(nonDomAC) + " in the " + nonDom + " adrenal vein versus " + f1(d.acP) + " peripherally)" : "";
    parts.push("The " + timingLabel(tm) + " " + refLabel(decisionRk) + "-referenced contralateral suppression index was " + f2(d.CSI) + csiRatio + ", indicating " + (d.csiPos ? "suppression" : "a lack of suppression") + " of the non-dominant (" + nonDom + ") adrenal vein.");
  }

  if (R.cls === "uni") {
    const dom2 = sideLow(d.dominant);
    const disc = R.discord ? " The cortisol and metanephrine indices are discordant, in keeping with autonomous cortisol co-secretion inflating adrenal vein cortisol, so the metanephrine reference was used to reach this conclusion." : "";
    parts.push("Overall, the findings are consistent with unilateral aldosterone excess arising from the " + dom2 + " (dominant) adrenal gland, based on the " + refLabel(decisionRk) + "-referenced indices." + disc + " " + cap(dom2) + " adrenalectomy may be considered, with clinical and imaging correlation.");
  } else if (R.cls === "bi") {
    parts.push("Overall, the findings are consistent with bilateral aldosterone secretion, and medical therapy with a mineralocorticoid receptor antagonist is generally preferred over adrenalectomy.");
  } else {
    parts.push("Overall, the study is non-diagnostic owing to inadequate selectivity; either repeat adrenal vein sampling or empirical medical therapy with a mineralocorticoid receptor antagonist should be considered.");
  }
  return parts.join(" ");
}

/* ============================ Copy table ============================ */
function fmtTable(headers, rows, aligns) {
  const w = headers.map((h, c) => {
    let m = String(h).length;
    rows.forEach((r) => { if (String(r[c]).length > m) m = String(r[c]).length; });
    return m;
  });
  const line = (arr) =>
    arr.map((cell, c) => { cell = String(cell); const p = w[c] - cell.length; const sp = " ".repeat(p < 0 ? 0 : p); return aligns[c] === "r" ? sp + cell : cell + sp; })
      .join("    ").replace(/\s+$/, "");
  return [line(headers), ...rows.map(line)];
}
function tableCopyText(ctx) {
  const { values, config, units } = ctx;
  const out = [], aU = units.aldo, cU = units.cortisol, mU = units.met;
  const vv = (x) => (x != null ? "" + x : "-");
  const vr = (x, less) => (x != null ? (less ? "<" : "") + x : "-");
  activeTimings(config).forEach((tm) => {
    const T = computeTiming(values, config, tm); if (!T.hasData) return;
    out.push(tm === "pre" ? "PRE-ACTH" : "POST-ACTH", "");
    ["c", "m"].forEach((rk) => {
      const o = T[rk]; if (!o || !o.hasAny) return; const isMet = rk === "m";
      const headers = ["Site", "Aldosterone (" + aU + ")", isMet ? "Metanephrine (" + mU + ")" : "Cortisol (" + cU + ")", isMet ? "A:M" : "A:C", "SI"];
      const aligns = ["l", "r", "r", "r", "r"];
      const rows = [
        ["Right AV", vv(o.rav.a), vr(o.rav.r, o.less.rr), f1(o.acR), f1(o.siR)],
        ["Left AV", vv(o.lav.a), vr(o.lav.r, o.less.lr), f1(o.acL), f1(o.siL)],
        ["Peripheral", vv(o.periph.a), vr(o.periph.r, o.less.rp), f1(o.acP), ""],
      ];
      out.push(isMet ? "Metanephrine reference" : "Cortisol reference");
      fmtTable(headers, rows, aligns).forEach((l) => out.push(l));
      out.push("Dominant: " + (o.dominant ? sideName(o.dominant) : "-") + "     LI: " + f1(o.LI) + "     CSI: " + f2(o.CSI), "");
    });
  });
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
function fbCopy(text, done) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
  } catch (e) { /* noop */ }
  done();
}

/* ============================ Icons ============================ */
const IconCheck = () => (<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>);
const IconCopy = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
const IconFile = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>);
const IconWarn = () => (<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
const IconLink = () => (<svg viewBox="0 0 24 24"><path d="M9 17H7A5 5 0 0 1 7 7h1" /><path d="M15 7h2a5 5 0 0 1 0 10h-1" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);

/* ============================ Small render helpers ============================ */
function Metric({ k, v, sub }) {
  return (<div className="metric"><span className="k">{k}</span><span className="v">{v}{sub ? <small>{sub}</small> : null}</span></div>);
}
function EmptyState({ title, sub }) {
  return (<div className="empty"><IconLink /><div className="t">{title}</div><div className="s">{sub}</div></div>);
}
function RefResult(o, rk) {
  const isMet = rk === "m";
  const rows = [
    { label: "Right AV", a: o.rav.a, r: o.rav.r, ac: o.acR, si: o.siR, dom: o.dominant === "right", periph: false, less: o.less.rr },
    { label: "Left AV", a: o.lav.a, r: o.lav.r, ac: o.acL, si: o.siL, dom: o.dominant === "left", periph: false, less: o.less.lr },
    { label: "Peripheral", a: o.periph.a, r: o.periph.r, ac: o.acP, si: null, dom: false, periph: true, less: o.less.rp },
  ];
  return (
    <React.Fragment>
      <div className={"ref-label" + (isMet ? " met" : "")}>{isMet ? "Metanephrine" : "Cortisol"} reference</div>
      <div style={{ overflowX: "auto" }}>
        <table className="res">
          <thead><tr><th>Site</th><th>Aldo</th><th>{isMet ? "Met" : "Cortisol"}</th><th>{isMet ? "A:M" : "A:C"}</th><th>SI</th></tr></thead>
          <tbody>
            {rows.map((row, i) => {
              const rDisp = row.r != null ? (row.less ? "<" : "") + fmt(row.r, row.r < 1 ? 2 : 1) : "—";
              let siCell = "—";
              if (!row.periph && row.si != null) {
                const pass = row.si > o.siCut;
                siCell = <span className={pass ? "si-pass" : "si-fail"}>{(row.less ? ">" : "") + fmt(row.si, row.si >= 100 ? 0 : 1)}</span>;
              }
              const domCls = row.dom ? (isMet ? " dom met" : " dom") : "";
              return (
                <tr key={i}>
                  <td className={row.periph ? "periph" : ""}>{row.label}</td>
                  <td className="num">{row.a != null ? fmt(row.a, row.a < 10 ? 1 : 0) : "—"}</td>
                  <td className="num">{rDisp}</td>
                  <td className={"num" + domCls}>{row.ac != null ? fmt(row.ac, row.ac >= 100 ? 1 : 2) : "—"}</td>
                  <td className="num">{siCell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={"summary-row" + (isMet ? " met" : "")}>
        <Metric k="Dominant" v={o.dominant ? sideName(o.dominant) : "—"} />
        <Metric k="LI" v={o.LI != null ? fmt(o.LI, o.LI >= 100 ? 0 : 1) : "—"} sub={">" + o.liCut} />
        <Metric k="CSI" v={o.CSI != null ? fmt(o.CSI, 2) : "—"} sub={"<1.0"} />
        {o.lateralizing != null &&
          (o.lateralizing
            ? <span className="pill lat">{"Lateralizes " + sideName(o.dominant)}</span>
            : <span className="pill nonlat">Non-lateralizing</span>)}
      </div>
    </React.Fragment>
  );
}

/* ============================ Interpretation steps ============================ */
function StepSelectivity(T, tm, R) {
  const lines = [];
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o) return;
    [["right", "selR", "siR"], ["left", "selL", "siL"]].forEach(([side, selK, siK]) => {
      const sel = o[selK], si = o[siK]; if (si == null) return;
      const less = (side === "right" ? o.less.rr : o.less.lr) || o.less.rp;
      lines.push(
        <div className="pline" key={rk + side}>
          <span className="lab">{side === "right" ? "Right AV" : "Left AV"}</span>
          <span className="figs">SI {(less ? ">" : "") + fmt(si, si >= 100 ? 0 : 1)}</span>
          {rk === "m" && <span className="tag met">metanephrine</span>}
          {sel ? <span className="tag pass">selective</span> : <span className="tag fail">below {o.siCut}</span>}
        </div>
      );
    });
  });
  const bothSel = R.st.right.sel && R.st.left.sel;
  const haveAny = R.st.right.has || R.st.left.has;
  let cls, note;
  if (!haveAny) { cls = "warn"; note = "Enter adrenal and peripheral reference values to confirm cannulation."; }
  else if (bothSel) {
    cls = "pass"; note = "Both catheters confirmed within the adrenal veins; proceed to lateralization.";
    if (T.c && T.m) {
      const rescued = [];
      if (T.c.selR === false && T.m.selR === true) rescued.push("right");
      if (T.c.selL === false && T.m.selL === true) rescued.push("left");
      if (rescued.length) note = "Cannulation confirmed. The " + rescued.join(" and ") + " cortisol SI sits below threshold (a recognised effect of cortisol co-secretion), but metanephrine confirms correct placement.";
    }
  } else {
    cls = "fail"; const f = [];
    if (R.st.right.has && !R.st.right.sel) f.push("right");
    if (R.st.left.has && !R.st.left.sel) f.push("left");
    note = "The " + f.join(" and ") + " sample is non-selective by every reference collected, so that gland is likely not cannulated and lateralization from it is unreliable.";
  }
  const cut = T.c ? (tm === "pre" ? "cortisol >3" : "cortisol >5") : "";
  const cut2 = T.m ? (cut ? " · " : "") + "metanephrine >3" : "";
  return (
    <div className={"pstep " + cls} key="s1">
      <div className="node">{cls === "pass" ? "✓" : cls === "fail" ? "!" : "1"}</div>
      <h3>Selectivity <span className="cut">{cut + cut2}</span></h3>
      <div className="lines">{lines.length ? lines : <div className="pnote">No selectivity values yet.</div>}</div>
      <p className="pnote">{note}</p>
    </div>
  );
}
function StepLateralization(T, R) {
  const lines = [];
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o || o.LI == null) return; const isMet = rk === "m";
    lines.push(
      <div className="pline" key={rk}>
        <span className="lab">{isMet ? "aldosterone:metanephrine" : "aldosterone:cortisol"} LI</span>
        <span className="figs">{fmt(o.LI, o.LI >= 100 ? 0 : 1)}</span>
        {isMet && <span className="tag met">metanephrine</span>}
        {o.lateralizing ? <span className="tag pass">{"lateralizes " + sideName(o.dominant)}</span> : <span className="tag">non-lateralizing</span>}
      </div>
    );
  });
  const d = R.d; let cls, note;
  if (!d || d.LI == null) { cls = "warn"; note = "Both adrenal aldosterone to reference ratios are needed to compute the lateralization index."; }
  else if (R.discord) { cls = "warn"; note = "The cortisol and metanephrine indices disagree. Autonomous cortisol co-secretion distorts the aldosterone:cortisol ratio, so the metanephrine referenced index is the more reliable basis here."; }
  else if (d.lateralizing) { cls = "pass"; note = "Lateralizes to the " + sideLow(d.dominant) + ", consistent with unilateral disease amenable to adrenalectomy on that side."; }
  else { cls = "fail"; note = "Below the lateralization threshold, favouring bilateral disease and medical management."; }
  const cut = T.c ? "cortisol >4" : "";
  const cut2 = T.m ? (cut ? " · " : "") + "metanephrine >4.3" : "";
  return (
    <div className={"pstep " + cls} key="s2">
      <div className="node">{cls === "pass" ? "✓" : cls === "fail" ? "×" : cls === "warn" ? "!" : "2"}</div>
      <h3>Lateralization <span className="cut">{cut + cut2}</span></h3>
      <div className="lines">{lines.length ? lines : <div className="pnote">No LI yet.</div>}</div>
      <p className="pnote">{note}</p>
    </div>
  );
}
function StepCSI(T, R) {
  const lines = [];
  ["c", "m"].forEach((rk) => {
    const o = T[rk]; if (!o || o.CSI == null) return; const isMet = rk === "m";
    lines.push(
      <div className="pline" key={rk}>
        <span className="lab">{isMet ? "metanephrine" : "cortisol"} CSI</span>
        <span className="figs">{fmt(o.CSI, 2)}</span>
        {isMet && <span className="tag met">metanephrine</span>}
        {o.csiPos ? <span className="tag pass">suppressed</span> : <span className="tag warn">not suppressed</span>}
      </div>
    );
  });
  const d = R.d; let cls, note;
  if (!d || d.CSI == null) { cls = "warn"; note = "The peripheral aldosterone to reference ratio and a dominant side are needed to compute contralateral suppression."; }
  else if (d.csiPos) { cls = "pass"; note = "The non-dominant gland is suppressed (CSI below 1.0), reinforcing true unilateral excess."; }
  else { cls = "warn"; note = "The non-dominant gland is not suppressed (CSI at or above 1.0). Interpret lateralization with caution, as this can reflect bilateral secretion or cortisol confounding."; }
  return (
    <div className={"pstep " + cls} key="s3">
      <div className="node">{cls === "pass" ? "✓" : cls === "warn" ? "!" : "3"}</div>
      <h3>Contralateral suppression <span className="cut">{"CSI <1.0"}</span></h3>
      <div className="lines">{lines.length ? lines : <div className="pnote">No CSI yet.</div>}</div>
      <p className="pnote">{note}</p>
    </div>
  );
}
function Verdict(T, tm, R) {
  const d = R.d; const tlabel = tm === "pre" ? "Pre-ACTH" : "Post-ACTH";
  let cls, vk, h3, p;
  if (R.cls === "incomplete") { cls = "nd"; vk = "Incomplete"; h3 = "More data needed"; p = "Enter aldosterone and reference values for both adrenal veins and the peripheral sample to reach a conclusion."; }
  else if (R.cls === "nd") { cls = "nd"; vk = "Non-diagnostic"; h3 = "Cannulation not confirmed"; p = "At least one adrenal vein is non-selective by every reference collected, so lateralization cannot be relied upon. Consider either repeat adrenal vein sampling or empirical medical therapy with a mineralocorticoid receptor antagonist."; }
  else if (R.cls === "uni") {
    cls = "uni"; vk = "Result · " + tlabel;
    h3 = (<>Unilateral disease <span className="side-tag">{sideName(d.dominant).toUpperCase()}</span></>);
    const basis = R.useMet ? "metanephrine referenced" : "cortisol referenced";
    const csiTxt = d.csiPos ? " with contralateral suppression (CSI " + fmt(d.CSI, 2) + ")" : " (contralateral suppression not met, interpret with care)";
    p = "The " + basis + " lateralization index of " + fmt(d.LI, d.LI >= 100 ? 0 : 1) + " exceeds threshold" + csiTxt + ", consistent with surgically correctable unilateral aldosterone excess on the " + sideLow(d.dominant) + ". Correlate with imaging and clinical context before adrenalectomy.";
  } else {
    cls = "bi"; vk = "Result · " + tlabel; h3 = "Bilateral disease";
    p = "The lateralization index (" + fmt(d.LI, d.LI >= 100 ? 0 : 1) + ") is below threshold, favouring bilateral adrenal hyperplasia. Medical management with a mineralocorticoid receptor antagonist is generally preferred.";
  }
  const showCaveat = R.useMet && R.discord;
  return (
    <React.Fragment>
      <div className={"verdict " + cls}>
        <div className="vk">{vk}</div>
        <h3>{h3}</h3>
        <p>{p}</p>
      </div>
      {showCaveat && (
        <div className="caveat">
          <IconWarn />
          <div className="ct"><b>Cortisol co-secretion caveat.</b> The aldosterone:cortisol indices disagree with the metanephrine indices. Autonomous cortisol production, present in roughly 15 to 30% of primary aldosteronism, inflates adrenal vein cortisol and can both mask true lateralization and lower the cortisol selectivity index. The conclusion above uses the <b>metanephrine</b> reference, which is unaffected by cortisol secretion.</div>
        </div>
      )}
    </React.Fragment>
  );
}

/* ============================ Main component ============================ */
export default function App() {
  const [config, setConfig] = useState({ pre: true, post: true, cortisol: true, met: false });
  const [units, setUnits] = useState({ aldo: "ng/dL", cortisol: "µg/dL", met: "nmol/L" });
  const [values, setValues] = useState({});
  const [pathwayTiming, setPathwayTiming] = useState("post");
  const [pathwayManual, setPathwayManual] = useState(false);
  const [copied, setCopied] = useState({ table: false, note: false });

  // Inject fonts once (works even if @import is stripped by a build step).
  useEffect(() => {
    const id = "avs-fonts";
    if (typeof document !== "undefined" && !document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const toggleTiming = (key) => {
    setPathwayManual(false);
    setConfig((c) => { const next = { ...c, [key]: !c[key] }; if (!next.pre && !next.post) return c; return next; });
  };
  const toggleRef = (key) => {
    setPathwayManual(false);
    setConfig((c) => { const next = { ...c, [key]: !c[key] }; if (!next.cortisol && !next.met) return c; return next; });
  };
  const setUnit = (key, val) => setUnits((u) => ({ ...u, [key]: val }));
  const setVal = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const loadExample = () => {
    const target = config.post ? "post" : config.pre ? "pre" : null;
    if (!target) return;
    const data = { rav: { a: "271", c: "78", m: "0.69" }, lav: { a: "1270", c: "345", m: "24" }, periph: { a: "24", c: "27", m: "<0.2" } };
    setPathwayManual(false);
    setValues((prev) => {
      const nv = { ...prev };
      ["rav", "lav", "periph"].forEach((s) => {
        nv[target + "_" + s + "_a"] = data[s].a;
        if (config.cortisol) nv[target + "_" + s + "_c"] = data[s].c;
        if (config.met) nv[target + "_" + s + "_m"] = data[s].m;
      });
      return nv;
    });
  };
  const clearAll = () => setValues({});

  const copy = (text, which) => {
    const done = () => { setCopied((c) => ({ ...c, [which]: true })); setTimeout(() => setCopied((c) => ({ ...c, [which]: false })), 1400); };
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fbCopy(text, done));
    } else fbCopy(text, done);
  };

  const ctx = { values, config, units };
  const tms = activeTimings(config);
  const anyData = tms.some((tm) => computeTiming(values, config, tm).hasData);

  let effTiming = pathwayTiming;
  if (!pathwayManual) {
    const postHas = config.post && computeTiming(values, config, "post").hasData;
    const preHas = config.pre && computeTiming(values, config, "pre").hasData;
    effTiming = postHas ? "post" : preHas ? "pre" : tms[0];
  }
  if (!config[effTiming]) effTiming = tms[0];

  return (
    <div className="avs-root">
      <style>{CSS}</style>

      <header className="top">
        <div className="wrap">
          <div className="eyebrow"><span className="tick" />Primary Aldosteronism</div>
          <h1 className="title">Adrenal Vein Sampling Interpretation Tool</h1>
          <p className="subtitle">Enter adrenal vein and peripheral values to compute the <b>selectivity</b>, <b>lateralization</b> and <b>contralateral suppression</b> indices, then read a step by step interpretation.</p>
        </div>
      </header>

      <div className="wrap">
        {/* CONFIG */}
        <section className="card" id="config">
          <div className="card-hd"><div><h2>Centre configuration</h2><p className="hint">Tick everything your protocol collects.</p></div></div>
          <div className="card-bd">
            <div className="cfg-row">
              <div className="cfg-group">
                <span className="cfg-label">Sampling</span>
                <div className="chk-row">
                  <label className={"chk" + (config.pre ? " on" : "")}><input type="checkbox" checked={config.pre} onChange={() => toggleTiming("pre")} /><span className="box"><IconCheck /></span>Pre-ACTH</label>
                  <label className={"chk" + (config.post ? " on" : "")}><input type="checkbox" checked={config.post} onChange={() => toggleTiming("post")} /><span className="box"><IconCheck /></span>Post-ACTH</label>
                </div>
              </div>
              <div className="cfg-group">
                <span className="cfg-label">Reference</span>
                <div className="chk-row">
                  <label className={"chk" + (config.cortisol ? " on" : "")}><input type="checkbox" checked={config.cortisol} onChange={() => toggleRef("cortisol")} /><span className="box"><IconCheck /></span>Cortisol</label>
                  <label className={"chk met" + (config.met ? " on" : "")}><input type="checkbox" checked={config.met} onChange={() => toggleRef("met")} /><span className="box"><IconCheck /></span>Metanephrine</label>
                </div>
              </div>
            </div>
            <p className="cfg-foot">Metanephrine reference is recommended when autonomous cortisol secretion is identified by a positive 1&nbsp;mg dexamethasone suppression test.</p>
            <div className="unit-inline">
              {[["aldo", "Aldosterone"], ["cortisol", "Cortisol"], ["met", "Metanephrine"]].map(([key, label]) => (
                <div className="fld" key={key}>
                  <label>{label}</label>
                  <select value={units[key]} onChange={(e) => setUnit(key, e.target.value)}>
                    {UNIT_OPTS[key].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <p className="units-note">Every index is a ratio, so results are unit independent; the dropdowns only label your inputs. Keep each analyte consistent.</p>
          </div>
        </section>

        {/* INPUTS */}
        <section className="card">
          <div className="card-hd"><div><h2>Data entry</h2></div></div>
          <div className="card-bd">
            {(() => {
              const analytes = [
                { k: "a", label: "Aldosterone", unit: units.aldo, cls: "" },
                config.cortisol && { k: "c", label: "Cortisol", unit: units.cortisol, cls: "" },
                config.met && { k: "m", label: "Metanephrine", unit: units.met, cls: "met" },
              ].filter(Boolean);
              const nCol = analytes.length;
              return (
                <div className="entry-wrap">
                  <table className="entry">
                    <thead>
                      <tr>
                        <th className="site-h" rowSpan={2}>Site</th>
                        {tms.map((tm, gi) => (
                          <th key={tm} className={"grp " + (tm === "pre" ? "pre" : "post") + (gi > 0 ? " divide" : "")} colSpan={nCol}>
                            <span className={"gdot " + (tm === "pre" ? "pre" : "post")} />{tm === "pre" ? "Pre-ACTH" : "Post-ACTH"}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        {tms.map((tm, gi) =>
                          analytes.map((an, ai) => (
                            <th key={tm + an.k} className={"sub" + (gi > 0 && ai === 0 ? " divide" : "")}>
                              {an.label}<span className="u">{an.unit}</span>
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {SITES.map((s) => (
                        <tr key={s.key}>
                          <td className={"site-cell " + s.cls}>{s.name}</td>
                          {tms.map((tm, gi) =>
                            analytes.map((an, ai) => {
                              const key = tm + "_" + s.key + "_" + an.k;
                              return (
                                <td key={key} className={"n" + (gi > 0 && ai === 0 ? " divide" : "")}>
                                  <input className={"val" + (an.cls ? " " + an.cls : "")} inputMode="decimal" placeholder="—" value={values[key] || ""} onChange={(e) => setVal(key, e.target.value)} />
                                </td>
                              );
                            })
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            <div className="actions">
              <button className="btn primary" onClick={loadExample}><IconFile />Load example values</button>
              <button className="btn" onClick={clearAll}><IconTrash />Clear</button>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="card">
          <div className="card-hd">
            <div><h2>Computed AVS table</h2></div>
            {anyData && <button className={"btn-mini" + (copied.table ? " ok" : "")} onClick={() => copy(tableCopyText(ctx), "table")}><IconCopy />{copied.table ? "Copied" : "Copy table"}</button>}
          </div>
          <div className="card-bd">
            {!anyData ? (
              <EmptyState title="Enter values above" sub="Indices appear here as you type." />
            ) : (
              tms.map((tm) => {
                const T = computeTiming(values, config, tm);
                if (!T.hasData) return null;
                return (
                  <div className="res-timing" key={tm}>
                    <div><span className="timing-tag"><span className={"dot " + (tm === "pre" ? "pre" : "post")} />{tm === "pre" ? "Pre-ACTH" : "Post-ACTH"}</span></div>
                    {T.c && <React.Fragment key="c">{RefResult(T.c, "c")}</React.Fragment>}
                    {T.m && <React.Fragment key="m">{RefResult(T.m, "m")}</React.Fragment>}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* INTERPRETATION */}
        <section className="card">
          <div className="card-hd"><div><h2>Step-wise interpretation</h2></div></div>
          <div className="card-bd">
            {!anyData ? (
              <EmptyState title="Awaiting values" sub="The interpretation builds automatically once aldosterone and reference values are entered." />
            ) : (
              (() => {
                const T = computeTiming(values, config, effTiming);
                const R = interpretResult(T);
                const noteText = clinicalNote(ctx, T, effTiming, R);
                return (
                  <React.Fragment>
                    {tms.length > 1 && (
                      <div className="seg-wrap">
                        <span>Interpret using</span>
                        <div className="seg">
                          {tms.map((tm) => (
                            <button key={tm} className={effTiming === tm ? "on" : ""} onClick={() => { setPathwayTiming(tm); setPathwayManual(true); }}>{tm === "pre" ? "Pre-ACTH" : "Post-ACTH"}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!T.hasData ? (
                      <EmptyState title="No values for this sampling" sub="Switch timing or enter values above." />
                    ) : (
                      <React.Fragment>
                        <div className="pathway">
                          {StepSelectivity(T, effTiming, R)}
                          {StepLateralization(T, R)}
                          {StepCSI(T, R)}
                        </div>
                        {Verdict(T, effTiming, R)}
                        {R.cls !== "incomplete" && (
                          <div className="note-box">
                            <div className="nb-hd">
                              <span className="t">Clinical note</span>
                              <button className={"btn-mini" + (copied.note ? " ok" : "")} onClick={() => copy(noteText, "note")}><IconCopy />{copied.note ? "Copied" : "Copy note"}</button>
                            </div>
                            <div className="nb-bd">{noteText}</div>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              })()
            )}
          </div>
        </section>

        <footer>
          <p className="thr"><b>Thresholds.</b> Selectivity index: cortisol {">"}3 pre-ACTH or {">"}5 post-ACTH, metanephrine {">"}3. Lateralization index: cortisol {">"}4, metanephrine {">"}4.3. Contralateral suppression index {"<"}1.0.</p>
          <div className="disc">For education and clinical decision support only. It does not replace clinical judgement or local AVS protocols, and thresholds vary between centres. Confirm every calculation against your own laboratory values before acting.</div>
        </footer>
      </div>
    </div>
  );
}
