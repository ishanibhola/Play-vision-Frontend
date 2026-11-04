import { useEffect, useState } from "react"
import LookDiscover from "./LookDiscover"
import FaceMatch, { AnimalFace } from "./FaceMatch"

type Game = "hub" | "look-discover" | "face-match"

const asset = (name: string) => `/assets/${name}`

const readGame = (): Game => {
  const hash = window.location.hash.slice(1)
  return hash === "look-discover" || hash === "face-match" ? hash : "hub"
}

export default function App() {
  const [game, setGame] = useState<Game>(readGame)

  useEffect(() => {
    const onHashChange = () => setGame(readGame())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const open = (next: Game) => {
    window.location.hash = next === "hub" ? "" : next
    setGame(next)
    window.scrollTo({ top: 0 })
  }

  if (game === "look-discover") return <LookDiscover onExit={() => open("hub")} />
  if (game === "face-match") return <FaceMatch onExit={() => open("hub")} />

  return (
    <main className="flow-app">
      <section className="hub-screen">
        <header className="welcome-header">
          <div className="little-adventures">
            <img src={asset("b7e07.svg")} alt="" />
            <span>LITTLE ADVENTURES</span>
          </div>
        </header>
        <div className="map-heading">
          <p className="flow-eyebrow">Playful screening activities</p>
          <h1>Pick an adventure</h1>
          <p>Short games to play together. A grown-up should stay nearby.</p>
        </div>
        <div className="hub-grid">
          <button
            type="button"
            className="chapter-card ready hub-card"
            onClick={() => open("look-discover")}
          >
            <span className="chapter-state">ABOUT 5 MIN</span>
            <span className="hub-art">
              <img src={asset("5cee1.svg")} alt="" />
            </span>
            <strong>Look &amp; Discover</strong>
            <small>Follow where a friend is looking and try an opposite-side game.</small>
            <em>Play →</em>
          </button>
          <button
            type="button"
            className="chapter-card ready hub-card"
            onClick={() => open("face-match")}
          >
            <span className="chapter-state">ABOUT 3 MIN</span>
            <span className="hub-art hub-faces">
              <AnimalFace animal="bear" expression="happy" colorLevel={1} size={78} />
              <AnimalFace animal="cat" expression="sad" colorLevel={1} size={78} />
            </span>
            <strong>Face Match</strong>
            <small>Find the animal friend with the same feeling, as quickly as you can.</small>
            <em>Play →</em>
          </button>
        </div>
        <div className="screening-note hub-note">
          <strong>For families:</strong> These activities can notice patterns
          worth discussing. They do not diagnose autism, ADHD, depression, or any
          health condition.
        </div>
      </section>
    </main>
  )
}
