// Pier One — démo du portant · David Nka (DN)
import * as React from "react"
import { createRoot } from "react-dom/client"
import PierOnePortant from "./PierOnePortant.jsx"

const looks = {}
for (let i = 1; i <= 7; i++) {
  looks["m" + i] = "./looks/m" + i + ".png"
  looks["h" + i] = "./looks/h" + i + ".png"
}

createRoot(document.getElementById("root")).render(
  <div style={{ width: "100vw", height: "100vh", minHeight: 640 }}>
    <PierOnePortant {...looks} />
  </div>
)
