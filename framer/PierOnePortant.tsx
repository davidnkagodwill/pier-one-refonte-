// @ts-nocheck
// Version composant de code Framer (fichier Hero/PierOnePortant.tsx du projet Framer)
// Pier One — Portant interactif
// Conçu et développé par David Nka (DN) · https://github.com/davidnkagodwill
// © 2026 David Nka. Concept de refonte non officiel du site Pier One France.
//
// Un portant de vêtements suspendu à une corde. Clic sur un cintre :
// le cintre part vers le mannequin, le mannequin porte le look, et tout le portant glisse.
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

export const AUTHOR = "David Nka (DN)"

export const LOOKS = [
  { name: "Foulard & chocolat", pieces: [["T-shirt épais blanc", 24.99], ["Foulard en soie", 19.99], ["Pantalon large chocolat", 49.99]] },
  { name: "Rouille & lin", pieces: [["Surchemise rouille", 49.99], ["Pantalon en lin", 44.99]] },
  { name: "Maille chocolat", pieces: [["Polo maille côtelée", 34.99], ["Pantalon à pinces", 44.99]] },
  { name: "Vert club", pieces: [["Polo maille col contrasté", 34.99], ["Pantalon crème", 44.99]] },
  { name: "Bordeaux preppy", pieces: [["Pull camionneur torsadé", 49.99], ["Pantalon large", 49.99]] },
  { name: "Forêt", pieces: [["Veste zippée en laine", 69.99], ["Chino à pinces", 39.99]] },
  { name: "Noir d’hiver", pieces: [["Surchemise en laine", 69.99], ["Col roulé côtelé", 29.99], ["Pantalon anthracite", 44.99]] },
]
const N = LOOKS.length
function euro(v) { return v.toFixed(2).replace(".", ",") + " €" }
function total(l) { let s = 0; l.pieces.forEach(function (p) { s += p[1] }); return s }
function srcOf(v) { if (!v) return ""; if (typeof v === "string") return v; return v.src || "" }

// Place d'un cintre par rapport au look porté : de -3 (gauche) à +3 (droite), 0 = sur le mannequin
function offset(i, c) { return ((i - c + N * 10 + 3) % N) - 3 }

// Détourage du fond blanc dans le navigateur : remplissage depuis les bords + contour adouci
const CACHE = {}
function keyWhite(src) {
  if (CACHE[src]) return CACHE[src]
  CACHE[src] = new Promise(function (res) {
    if (typeof window === "undefined") return res(null)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = function () {
      try {
        const sc = Math.min(1, 1300 / img.naturalHeight)
        const w = Math.round(img.naturalWidth * sc), h = Math.round(img.naturalHeight * sc)
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h
        const ctx = cv.getContext("2d", { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, w, h)
        const id = ctx.getImageData(0, 0, w, h), d = id.data, n = w * h
        const bg = new Uint8Array(n), st = new Int32Array(n)
        let sp = 0
        const isBg = function (p) { const o = p * 4, r = d[o], g = d[o + 1], b = d[o + 2]; const mn = Math.min(r, g, b), mx = Math.max(r, g, b); return mn >= 246 && mx - mn <= 12 }
        const push = function (p) { if (!bg[p] && isBg(p)) { bg[p] = 1; st[sp++] = p } }
        for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x) }
        for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1) }
        while (sp > 0) { const p = st[--sp], x = p % w; if (x > 0) push(p - 1); if (x < w - 1) push(p + 1); if (p >= w) push(p - w); if (p < n - w) push(p + w) }
        for (let p = 0; p < n; p++) if (bg[p]) d[p * 4 + 3] = 0
        for (let p = 0; p < n; p++) {
          if (bg[p]) continue
          const x = p % w
          const nb = (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (p >= w && bg[p - w]) || (p < n - w && bg[p + w])
          if (!nb) continue
          const o = p * 4, mn = Math.min(d[o], d[o + 1], d[o + 2])
          let a = (255 - mn) / 70; if (a > 1) a = 1; if (a < 0.15) a = 0.15
          for (let k = 0; k < 3; k++) d[o + k] = Math.max(0, Math.min(255, (d[o + k] - 255 * (1 - a)) / a))
          d[o + 3] = Math.round(a * 255)
        }
        ctx.putImageData(id, 0, 0)
        cv.toBlob(function (b) { res(b ? URL.createObjectURL(b) : null) }, "image/png")
      } catch (e) { res(null) }
    }
    img.onerror = function () { res(null) }
    img.src = src
  })
  return CACHE[src]
}

const Arrow = function (dir) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir < 0 ? "scaleX(-1)" : "none" }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PierOnePortant(props) {
  const p = Object.assign({}, PierOnePortant.defaultProps, props)
  const { style, bg, bigColor, ink, accent, rope, bigTitle, kickerTop, kickerBottom, dateTop, dateBottom, ctaLabel, ctaLink } = p
  const models = [p.m1, p.m2, p.m3, p.m4, p.m5, p.m6, p.m7].map(srcOf)
  const hangers = [p.h1, p.h2, p.h3, p.h4, p.h5, p.h6, p.h7].map(srcOf)
  const box = useRef(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const [state, setState] = useState({ cur: 0, laps: [0, 0, 0, 0, 0, 0, 0], dir: 1 })
  const [keyed, setKeyed] = useState({})
  const [hover, setHover] = useState(null)

  useEffect(function () {
    const el = box.current; if (!el) return
    const set = function () { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) setSize({ w: r.width, h: r.height }) }
    set()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(set); ro.observe(el)
    return function () { ro.disconnect() }
  }, [])

  const all = []; for (let i = 0; i < N; i++) { all.push(models[i]); all.push(hangers[i]) }
  const allF = all.filter(Boolean)
  const sig = allF.join("|")
  useEffect(function () {
    let alive = true
    ;(async function () {
      for (const s of allF) {
        const u = await keyWhite(s)
        if (!alive) return
        if (u) setKeyed(function (k) { const o = Object.assign({}, k); o[s] = u; return o })
      }
    })()
    return function () { alive = false }
  }, [sig])

  // Un clic change le look porté : toutes les places changent d'un coup.
  // "laps" fait réapparaître proprement un cintre qui passe d'un bout à l'autre du portant.
  const go = function (next) {
    next = ((next % N) + N) % N
    setState(function (s) {
      if (next === s.cur) return s
      const laps = s.laps.slice()
      for (let i = 0; i < N; i++) { if (Math.abs(offset(i, next) - offset(i, s.cur)) > 3) laps[i]++ }
      return { cur: next, laps: laps, dir: offset(next, s.cur) < 0 ? -1 : 1 }
    })
    setHover(null)
  }
  useEffect(function () {
    const k = function (e) { if (e.key === "ArrowLeft") go(state.cur - 1); if (e.key === "ArrowRight") go(state.cur + 1) }
    window.addEventListener("keydown", k)
    return function () { window.removeEventListener("keydown", k) }
  })

  const W = size.w, H = size.h
  const narrow = W < 760
  const ropeY = H * (narrow ? 0.1 : 0.14)
  const sag = H * 0.025
  const gh = H * (narrow ? 0.25 : 0.43)
  const gw = gh * 2 / 3
  const first = narrow ? W * 0.3 : Math.max(210, gh * 0.66)
  const step = narrow ? W * 0.27 : gh * 0.5
  const xAt = function (d) { if (d === 0) return 0; return Math.sign(d) * (first + (Math.abs(d) - 1) * step) }
  const ropeAt = function (x) { const t = Math.min(1, Math.max(0, (W / 2 + x) / W)); return ropeY + 4 * t * (1 - t) * sag }
  const mh = H * (narrow ? 0.39 : 0.8)
  const mw = mh * 2 / 3
  const look = LOOKS[state.cur]
  const disp = "\"Clash Display\", \"General Sans\", sans-serif"
  const body = "\"General Sans\", \"Inter\", sans-serif"
  const pic = function (s) { return keyed[s] || s }
  const blend = function (s) { return keyed[s] ? "normal" : "multiply" }

  const corner = { position: "absolute", zIndex: 8, color: ink, fontFamily: body, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.5 }
  const round = { width: 48, height: 48, borderRadius: 999, border: "1px solid " + ink, background: "transparent", color: ink, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }

  return (
    <div ref={box} data-author="David Nka" style={Object.assign({ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: bg, userSelect: "none" }, style)}>
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: H * 0.3, textAlign: "center", fontFamily: disp, fontWeight: 600, fontSize: W * 0.19, lineHeight: 1, letterSpacing: "-0.04em", color: bigColor, whiteSpace: "nowrap", zIndex: 1, pointerEvents: "none" }}>{bigTitle}</div>

      <svg aria-hidden="true" width={W} height={ropeY + sag + 10} style={{ position: "absolute", left: 0, top: 0, zIndex: 2, pointerEvents: "none" }}>
        <path d={"M -10 " + ropeY + " Q " + W / 2 + " " + (ropeY + 2 * sag) + " " + (W + 10) + " " + ropeY} stroke={rope} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      <div aria-hidden="true" style={{ position: "absolute", left: W / 2 - mw * 0.32, width: mw * 0.64, top: H * (narrow ? 0.73 : 0.905), height: 22, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.28), rgba(0,0,0,0))", zIndex: 4, pointerEvents: "none" }} />

      {/* Le mannequin : une photo par look, en fondu, avec 0,2 s de décalage */}
      {models.map(function (s, i) {
        if (!s) return null
        const on = i === state.cur
        return (
          <motion.img key={"m" + i} src={pic(s)} alt={on ? "Mannequin portant le look " + LOOKS[i].name : ""} draggable={false}
            initial={false}
            animate={{ opacity: on ? 1 : 0, x: on ? 0 : -state.dir * 40, scale: on ? 1 : 0.97 }}
            transition={{ duration: on ? 0.6 : 0.35, delay: on ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", left: W / 2 - mw / 2, top: H * (narrow ? 0.745 : 0.96) - mh, width: mw, height: mh, objectFit: "contain", zIndex: on ? 5 : 4, mixBlendMode: blend(s), pointerEvents: "none" }} />
        )
      })}

      {/* Les cintres : un ressort (stiffness 120, damping 20) plutôt qu'une durée fixe */}
      {hangers.map(function (s, i) {
        if (!s) return null
        const d = offset(i, state.cur)
        const x = xAt(d)
        const flying = d === 0
        const hidden = Math.abs(d) > 3
        const startX = xAt(d) + Math.sign(d) * step * 1.2
        return (
          <motion.button key={"h" + i + "-" + state.laps[i]} type="button" aria-label={"Essayer le look " + LOOKS[i].name}
            onClick={function () { go(i) }}
            onMouseMove={function (e) { const r = box.current.getBoundingClientRect(); setHover({ i: i, x: e.clientX - r.left, y: e.clientY - r.top }) }}
            onMouseLeave={function () { setHover(null) }}
            initial={{ x: startX, y: ropeAt(startX) - 6, opacity: 0, scale: 1 }}
            animate={flying ? { x: 0, y: H * 0.22, opacity: 0, scale: 1.45 } : { x: x, y: ropeAt(x) - 6, opacity: hidden ? 0 : 1, scale: 1 }}
            whileHover={flying ? undefined : { rotate: 2.5, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.9, opacity: { duration: flying ? 0.45 : 0.5 } }}
            style={{ position: "absolute", left: W / 2 - gw / 2, top: 0, width: gw, height: gh, padding: 0, margin: 0, border: 0, background: "transparent", cursor: flying ? "default" : "pointer", zIndex: flying ? 6 : 3, transformOrigin: "50% 2%", pointerEvents: flying ? "none" : "auto", mixBlendMode: blend(s) }}>
            <img src={pic(s)} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }} />
          </motion.button>
        )
      })}

      <div style={Object.assign({}, corner, { left: 32, top: 28 })}>{kickerTop}<br />{kickerBottom}</div>
      <div style={Object.assign({}, corner, { right: 32, top: 28, textAlign: "right" })}>{dateTop}<br />{dateBottom}</div>

      <div style={{ position: "absolute", left: narrow ? 20 : 32, bottom: narrow ? 20 : 32, zIndex: 8, color: ink, fontFamily: body, maxWidth: narrow ? W - 40 : 360 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.75 }}>Look {String(state.cur + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</div>
        <motion.div key={"t" + state.cur} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: narrow ? 24 : 32, lineHeight: 1.1, marginTop: 6 }}>{look.name}</div>
          <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6, opacity: 0.85 }}>
            {look.pieces.map(function (q, k) { return <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>{q[0]}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{euro(q[1])}</span></div> })}
          </div>
        </motion.div>
      </div>

      <div style={{ position: "absolute", right: narrow ? 20 : 32, bottom: narrow ? (look.pieces.length * 21 + 90) : 32, zIndex: 8, display: "flex", alignItems: "center", gap: 10, fontFamily: body }}>
        <button type="button" aria-label="Look précédent" style={round} onClick={function () { go(state.cur - 1) }}>{Arrow(-1)}</button>
        <button type="button" aria-label="Look suivant" style={round} onClick={function () { go(state.cur + 1) }}>{Arrow(1)}</button>
        <a href={ctaLink || "#"} style={{ height: 48, padding: "0 22px", borderRadius: 999, background: accent, color: "#fff", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
          {ctaLabel}<span style={{ opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>{euro(total(look))}</span>
        </a>
      </div>

      {!narrow && <div style={{ position: "absolute", left: "50%", bottom: 14, transform: "translateX(-50%)", zIndex: 7, color: ink, opacity: 0.6, fontFamily: body, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>Clique sur un cintre pour l’essayer</div>}

      {hover && LOOKS[hover.i] && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 18, W - 240), top: hover.y + 18, zIndex: 9, background: "#fff", color: "#111", padding: "12px 14px", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.18)", pointerEvents: "none", width: 220, fontFamily: body }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{LOOKS[hover.i].name}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}><span style={{ opacity: 0.6 }}>{LOOKS[hover.i].pieces.length} pièces · essayer</span><span style={{ color: accent, fontWeight: 600 }}>{euro(total(LOOKS[hover.i]))}</span></div>
        </div>
      )}
    </div>
  )
}

PierOnePortant.defaultProps = {
  bg: "#F5F3EE", bigColor: "#ECE8E0", ink: "#111111", accent: "#C1121F", rope: "#1A1A1A",
  bigTitle: "PIER ONE", kickerTop: "Nouvelle", kickerBottom: "Collection", dateTop: "Automne", dateBottom: "Hiver 2026",
  ctaLabel: "Acheter le look", ctaLink: "/panier",
}

const img = function (t) { return { type: ControlType.ResponsiveImage, title: t } }
addPropertyControls(PierOnePortant, {
  m1: img("Look 1 porté"), h1: img("Look 1 cintre"),
  m2: img("Look 2 porté"), h2: img("Look 2 cintre"),
  m3: img("Look 3 porté"), h3: img("Look 3 cintre"),
  m4: img("Look 4 porté"), h4: img("Look 4 cintre"),
  m5: img("Look 5 porté"), h5: img("Look 5 cintre"),
  m6: img("Look 6 porté"), h6: img("Look 6 cintre"),
  m7: img("Look 7 porté"), h7: img("Look 7 cintre"),
  bg: { type: ControlType.Color, title: "Fond" },
  bigColor: { type: ControlType.Color, title: "Grand titre" },
  ink: { type: ControlType.Color, title: "Texte" },
  accent: { type: ControlType.Color, title: "Accent" },
  rope: { type: ControlType.Color, title: "Corde" },
  bigTitle: { type: ControlType.String, title: "Titre" },
  kickerTop: { type: ControlType.String, title: "Haut gauche 1" },
  kickerBottom: { type: ControlType.String, title: "Haut gauche 2" },
  dateTop: { type: ControlType.String, title: "Haut droite 1" },
  dateBottom: { type: ControlType.String, title: "Haut droite 2" },
  ctaLabel: { type: ControlType.String, title: "Bouton" },
  ctaLink: { type: ControlType.Link, title: "Lien" },
})
