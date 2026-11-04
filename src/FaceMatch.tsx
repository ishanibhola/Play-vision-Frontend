import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const asset = (name: string) => `/assets/${name}`

type Screen = "welcome" | "grownups" | "map" | "level-intro" | "playing" | "level-complete" | "results"

type Sentiment = "positive" | "negative" | "neutral"

type AnimalType = "bear" | "cat" | "dog" | "rabbit"

type ExpressionType = "happy" | "sad" | "scared" | "angry" | "confused" | "surprised"

type ColorLevel = 1 | 2 | 3

type Face = {
  id: string
  animal: AnimalType
  expression: ExpressionType
  sentiment: Sentiment
}

type RoundResult = {
  faceId: string
  sentiment: Sentiment
  reactionTime: number
  correct: boolean
  level: number
}

type LevelScore = {
  correct: number
  total: number
}

type AnimalColors = {
  body: string
  ear: string
  innerEar: string
  snout: string
  outline: string
  nose: string
  eye: string
  highlight: string
}

// Each animal gets lighter → darker across the three levels.
const palette: Record<AnimalType, Record<ColorLevel, AnimalColors>> = {
  bear: {
    1: { body: "#ecd6b8", ear: "#dcbf98", innerEar: "#f0c4a8", snout: "#f5e4cc", outline: "#a77a52", nose: "#6e4a34", eye: "#2f2418", highlight: "#ffffff" },
    2: { body: "#b98257", ear: "#9c6741", innerEar: "#c98b6c", snout: "#d4a57a", outline: "#6a4428", nose: "#3b2416", eye: "#22160c", highlight: "#ffe7c4" },
    3: { body: "#5a3a26", ear: "#452b1b", innerEar: "#6a3f2e", snout: "#6e4b33", outline: "#22150c", nose: "#120a06", eye: "#0a0604", highlight: "#a77a52" },
  },
  cat: {
    1: { body: "#f6d3bf", ear: "#eebba0", innerEar: "#fbe3d6", snout: "#fbe8dd", outline: "#c06a46", nose: "#d27a4f", eye: "#2a1a14", highlight: "#ffffff" },
    2: { body: "#d27a4f", ear: "#b55f38", innerEar: "#eba07d", snout: "#e9a988", outline: "#7c3a1f", nose: "#5a2410", eye: "#1e0f08", highlight: "#ffd2b8" },
    3: { body: "#6b3220", ear: "#4f2315", innerEar: "#82402a", snout: "#7a3d27", outline: "#2a120a", nose: "#140804", eye: "#080302", highlight: "#b05a38" },
  },
  dog: {
    1: { body: "#f8e7b4", ear: "#edcf7c", innerEar: "#f7e19e", snout: "#fdf2d2", outline: "#b58a2a", nose: "#5a3d1c", eye: "#2a1c0c", highlight: "#ffffff" },
    2: { body: "#edb541", ear: "#c78f22", innerEar: "#f0c766", snout: "#f4d488", outline: "#6e5014", nose: "#352208", eye: "#1c1206", highlight: "#fff0c0" },
    3: { body: "#6a4d12", ear: "#4c370b", innerEar: "#7a5d22", snout: "#806634", outline: "#241a06", nose: "#120c04", eye: "#080602", highlight: "#b08a30" },
  },
  rabbit: {
    1: { body: "#dde8ec", ear: "#c3d6de", innerEar: "#f2d0d4", snout: "#eef4f6", outline: "#648ca0", nose: "#d98a96", eye: "#1c2a32", highlight: "#ffffff" },
    2: { body: "#82a6b8", ear: "#648ca0", innerEar: "#c9939c", snout: "#a9c3cf", outline: "#34525f", nose: "#9a4e5c", eye: "#121e24", highlight: "#d6e8f0" },
    3: { body: "#2f4652", ear: "#22343d", innerEar: "#5a3640", snout: "#3c5562", outline: "#0e171c", nose: "#3a1a22", eye: "#060a0c", highlight: "#648ca0" },
  },
}

export function AnimalFace({
  animal,
  expression,
  colorLevel,
  size = 120,
}: {
  animal: AnimalType
  expression: ExpressionType
  colorLevel: ColorLevel
  size?: number
}) {
  const c = palette[animal][colorLevel]

  const geo = {
    bear: { eyeY: 45, mouthY: 72, headCx: 50, headCy: 55, headR: 38 },
    cat: { eyeY: 46, mouthY: 70, headCx: 50, headCy: 55, headR: 38 },
    dog: { eyeY: 42, mouthY: 70, headCx: 50, headCy: 52, headR: 38 },
    rabbit: { eyeY: 53, mouthY: 74, headCx: 50, headCy: 60, headR: 36 },
  }[animal]

  const EY = geo.eyeY
  const MY = geo.mouthY
  const LX = 36
  const RX = 64

  const eyes = (() => {
    switch (expression) {
      case "happy":
        return (
          <>
            <path d={`M ${LX - 7} ${EY} Q ${LX} ${EY - 9} ${LX + 7} ${EY}`} stroke={c.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d={`M ${RX - 7} ${EY} Q ${RX} ${EY - 9} ${RX + 7} ${EY}`} stroke={c.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx={LX - 4} cy={EY + 8} rx="6" ry="3" fill={c.innerEar} opacity="0.55" />
            <ellipse cx={RX + 4} cy={EY + 8} rx="6" ry="3" fill={c.innerEar} opacity="0.55" />
          </>
        )
      case "sad":
        return (
          <>
            <ellipse cx={LX} cy={EY} rx="6" ry="7" fill={c.highlight} />
            <ellipse cx={RX} cy={EY} rx="6" ry="7" fill={c.highlight} />
            <circle cx={LX + 1} cy={EY + 2} r="3.8" fill={c.eye} />
            <circle cx={RX - 1} cy={EY + 2} r="3.8" fill={c.eye} />
            <circle cx={LX - 1} cy={EY - 1} r="1.2" fill={c.highlight} opacity="0.7" />
            <circle cx={RX - 1} cy={EY - 1} r="1.2" fill={c.highlight} opacity="0.7" />
            <path d={`M ${LX - 6} ${EY - 10} L ${LX + 5} ${EY - 7}`} stroke={c.eye} strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M ${RX - 5} ${EY - 7} L ${RX + 6} ${EY - 10}`} stroke={c.eye} strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={LX + 4} cy={EY + 9} rx="2.2" ry="3.5" fill="#a8d8f8" opacity="0.8" />
          </>
        )
      case "scared":
        return (
          <>
            <ellipse cx={LX} cy={EY} rx="8.5" ry="9" fill={c.highlight} />
            <ellipse cx={RX} cy={EY} rx="8.5" ry="9" fill={c.highlight} />
            <circle cx={LX} cy={EY} r="6" fill={c.eye} />
            <circle cx={RX} cy={EY} r="6" fill={c.eye} />
            <circle cx={LX - 2.5} cy={EY - 2.5} r="2" fill={c.highlight} opacity="0.8" />
            <circle cx={RX - 2.5} cy={EY - 2.5} r="2" fill={c.highlight} opacity="0.8" />
            <path d={`M ${LX - 7} ${EY - 14} Q ${LX} ${EY - 18} ${LX + 7} ${EY - 14}`} stroke={c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={`M ${RX - 7} ${EY - 14} Q ${RX} ${EY - 18} ${RX + 7} ${EY - 14}`} stroke={c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )
      case "angry":
        return (
          <>
            <ellipse cx={LX} cy={EY + 1} rx="6" ry="5.5" fill={c.highlight} />
            <ellipse cx={RX} cy={EY + 1} rx="6" ry="5.5" fill={c.highlight} />
            <circle cx={LX} cy={EY + 2} r="3.5" fill={c.eye} />
            <circle cx={RX} cy={EY + 2} r="3.5" fill={c.eye} />
            <path d={`M ${LX - 7} ${EY - 8} L ${LX + 7} ${EY - 13}`} stroke={c.eye} strokeWidth="3.2" strokeLinecap="round" />
            <path d={`M ${RX - 7} ${EY - 13} L ${RX + 7} ${EY - 8}`} stroke={c.eye} strokeWidth="3.2" strokeLinecap="round" />
          </>
        )
      case "confused":
        return (
          <>
            <ellipse cx={LX} cy={EY} rx="6" ry="6.5" fill={c.highlight} />
            <circle cx={LX} cy={EY} r="3.5" fill={c.eye} />
            <circle cx={LX - 1} cy={EY - 1} r="1.2" fill={c.highlight} opacity="0.7" />
            <path d={`M ${RX - 6} ${EY + 2} Q ${RX} ${EY - 6} ${RX + 6} ${EY + 2}`} stroke={c.eye} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d={`M ${RX - 6} ${EY - 10} Q ${RX + 2} ${EY - 14} ${RX + 7} ${EY - 9}`} stroke={c.eye} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        )
      case "surprised":
        return (
          <>
            <ellipse cx={LX} cy={EY} rx="7.5" ry="8.5" fill={c.highlight} />
            <ellipse cx={RX} cy={EY} rx="7.5" ry="8.5" fill={c.highlight} />
            <circle cx={LX} cy={EY + 0.5} r="5" fill={c.eye} />
            <circle cx={RX} cy={EY + 0.5} r="5" fill={c.eye} />
            <circle cx={LX - 2} cy={EY - 2} r="1.8" fill={c.highlight} opacity="0.85" />
            <circle cx={RX - 2} cy={EY - 2} r="1.8" fill={c.highlight} opacity="0.85" />
            <path d={`M ${LX - 7} ${EY - 13} Q ${LX} ${EY - 18} ${LX + 7} ${EY - 13}`} stroke={c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={`M ${RX - 7} ${EY - 13} Q ${RX} ${EY - 18} ${RX + 7} ${EY - 13}`} stroke={c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )
    }
  })()

  const mouth = (() => {
    switch (expression) {
      case "happy":
        return (
          <>
            <path d={`M 39 ${MY} Q 50 ${MY + 13} 61 ${MY}`} stroke={c.outline} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {animal === "dog" && <ellipse cx="50" cy={MY + 10} rx="7" ry="9" fill="#e8848f" />}
          </>
        )
      case "sad":
        return <path d={`M 39 ${MY + 6} Q 50 ${MY - 4} 61 ${MY + 6}`} stroke={c.outline} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      case "scared":
        return (
          <>
            <ellipse cx="50" cy={MY + 3} rx="9" ry="8" fill={c.outline} />
            <ellipse cx="50" cy={MY + 3} rx="6" ry="5.5" fill="#2a1218" />
          </>
        )
      case "angry":
        return (
          <>
            <path d={`M 40 ${MY + 4} Q 50 ${MY - 3} 60 ${MY + 4}`} stroke={c.outline} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <line x1="44" y1={MY + 2} x2="44" y2={MY + 5} stroke={c.outline} strokeWidth="1.5" />
            <line x1="50" y1={MY + 1} x2="50" y2={MY + 4} stroke={c.outline} strokeWidth="1.5" />
            <line x1="56" y1={MY + 2} x2="56" y2={MY + 5} stroke={c.outline} strokeWidth="1.5" />
          </>
        )
      case "confused":
        return (
          <path
            d={`M 40 ${MY + 1} Q 47 ${MY - 3} 54 ${MY + 5} Q 60 ${MY + 9} 62 ${MY + 3}`}
            stroke={c.outline}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )
      case "surprised":
        return <ellipse cx="50" cy={MY + 3} rx="7" ry="8.5" fill={c.outline} />
    }
  })()

  const base = (() => {
    switch (animal) {
      case "bear":
        return (
          <>
            <circle cx="20" cy="22" r="16" fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <circle cx="80" cy="22" r="16" fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <circle cx="20" cy="22" r="10" fill={c.innerEar} />
            <circle cx="80" cy="22" r="10" fill={c.innerEar} />
            <circle cx={geo.headCx} cy={geo.headCy} r={geo.headR} fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <ellipse cx="50" cy="67" rx="16" ry="11" fill={c.snout} />
            <ellipse cx="50" cy="61" rx="5.5" ry="4" fill={c.nose} />
          </>
        )
      case "cat":
        return (
          <>
            <polygon points="13,32 21,7 37,30" fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <polygon points="63,30 79,7 87,32" fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <polygon points="17,29 22,13 34,28" fill={c.innerEar} />
            <polygon points="66,28 78,13 83,29" fill={c.innerEar} />
            <circle cx={geo.headCx} cy={geo.headCy} r={geo.headR} fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <polygon points="47,61 53,61 50,66" fill={c.nose} />
            <line x1="16" y1="58" x2="40" y2="62" stroke={c.outline} strokeWidth="1.2" opacity="0.55" />
            <line x1="16" y1="64" x2="40" y2="64" stroke={c.outline} strokeWidth="1.2" opacity="0.55" />
            <line x1="60" y1="62" x2="84" y2="58" stroke={c.outline} strokeWidth="1.2" opacity="0.55" />
            <line x1="60" y1="64" x2="84" y2="64" stroke={c.outline} strokeWidth="1.2" opacity="0.55" />
          </>
        )
      case "dog":
        return (
          <>
            <ellipse cx="14" cy="62" rx="14" ry="22" fill={c.ear} stroke={c.outline} strokeWidth="1.5" />
            <ellipse cx="86" cy="62" rx="14" ry="22" fill={c.ear} stroke={c.outline} strokeWidth="1.5" />
            <circle cx={geo.headCx} cy={geo.headCy} r={geo.headR} fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <ellipse cx="50" cy="64" rx="17" ry="12" fill={c.snout} />
            <ellipse cx="50" cy="57" rx="9" ry="7" fill={c.nose} />
            <circle cx="46" cy="59" r="2" fill="rgba(0,0,0,0.22)" />
            <circle cx="54" cy="59" r="2" fill="rgba(0,0,0,0.22)" />
          </>
        )
      case "rabbit":
        return (
          <>
            <ellipse cx="33" cy="16" rx="11" ry="26" fill={c.ear} stroke={c.outline} strokeWidth="1.5" />
            <ellipse cx="67" cy="16" rx="11" ry="26" fill={c.ear} stroke={c.outline} strokeWidth="1.5" />
            <ellipse cx="33" cy="16" rx="6.5" ry="20" fill={c.innerEar} />
            <ellipse cx="67" cy="16" rx="6.5" ry="20" fill={c.innerEar} />
            <circle cx={geo.headCx} cy={geo.headCy} r={geo.headR} fill={c.body} stroke={c.outline} strokeWidth="1.5" />
            <circle cx="50" cy="67" r="3.5" fill={c.nose} />
          </>
        )
    }
  })()

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="animal-face" aria-hidden="true">
      {base}
      {eyes}
      {mouth}
    </svg>
  )
}

const face = (animal: AnimalType, expression: ExpressionType, sentiment: Sentiment): Face => ({
  id: `${animal}-${expression}`,
  animal,
  expression,
  sentiment,
})

const levels = [
  {
    number: 1,
    title: "Light meadow",
    subtitle: "Four friends to match",
    tagline: "Match the animal with the same feeling.",
    context: "Light colours — baseline",
    timeLimit: 30,
    choiceCount: 4,
    colorLevel: 1 as ColorLevel,
    faces: [
      face("bear", "happy", "positive"),
      face("bear", "sad", "negative"),
      face("cat", "happy", "positive"),
      face("cat", "scared", "negative"),
    ],
  },
  {
    number: 2,
    title: "Golden field",
    subtitle: "More friends, deeper colours",
    tagline: "More animals join in — find the match.",
    context: "Medium colours — moderate load",
    timeLimit: 45,
    choiceCount: 6,
    colorLevel: 2 as ColorLevel,
    faces: [
      face("bear", "happy", "positive"),
      face("bear", "angry", "negative"),
      face("cat", "sad", "negative"),
      face("dog", "confused", "neutral"),
      face("dog", "surprised", "neutral"),
      face("rabbit", "scared", "negative"),
    ],
  },
  {
    number: 3,
    title: "Evening forest",
    subtitle: "The busiest, darkest level",
    tagline: "It’s getting dark — can you still match?",
    context: "Dark colours — high load",
    timeLimit: 60,
    choiceCount: 8,
    colorLevel: 3 as ColorLevel,
    faces: [
      face("bear", "happy", "positive"),
      face("bear", "sad", "negative"),
      face("cat", "angry", "negative"),
      face("cat", "scared", "negative"),
      face("dog", "happy", "positive"),
      face("dog", "confused", "neutral"),
      face("rabbit", "sad", "negative"),
      face("rabbit", "surprised", "neutral"),
    ],
  },
] as const

type Level = (typeof levels)[number]

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function generateRound(level: Level) {
  const [target, ...rest] = shuffle(level.faces)
  return {
    target,
    choices: shuffle([target, ...rest.slice(0, level.choiceCount - 1)]),
  }
}

function computeAnalysis(results: RoundResult[]) {
  const bySentiment = (["positive", "negative", "neutral"] as Sentiment[]).map(
    (sentiment) => {
      const items = results.filter((result) => result.sentiment === sentiment)
      const correct = items.filter((result) => result.correct).length
      return {
        sentiment,
        correct,
        total: items.length,
        avgTime: items.length
          ? Math.round(
              items.reduce((sum, result) => sum + result.reactionTime, 0) /
                items.length,
            )
          : 0,
        accuracy: items.length ? correct / items.length : 1,
      }
    },
  )
  const [pos, neg, neu] = bySentiment
  const negativeBias =
    pos.total >= 2 &&
    neg.total >= 2 &&
    (neg.accuracy < pos.accuracy - 0.15 || neg.avgTime > pos.avgTime * 1.35)

  return {
    pos,
    neg,
    neu,
    negativeBias,
    total: results.length,
    correct: results.filter((result) => result.correct).length,
  }
}

const describe = (f: Face) => `${f.animal}, ${f.expression}`

function Brand({ onHome }: { onHome: () => void }) {
  return (
    <button className="flow-brand" type="button" onClick={onHome}>
      <img src={asset("b7e07.svg")} alt="" />
      <span>Face Match</span>
    </button>
  )
}

function StepProgress({ active }: { active: number }) {
  return (
    <div className="step-progress" aria-label={`Level ${active} of 3`}>
      {[1, 2, 3].map((step) => (
        <span key={step} className={step === active ? "active" : ""} />
      ))}
    </div>
  )
}

function Countdown({ seconds, total }: { seconds: number; total: number }) {
  const urgent = seconds > 0 && seconds / total < 0.3
  return (
    <div
      className={`round-timer fm-countdown ${urgent ? "urgent" : ""}`}
      aria-label={`${seconds} seconds left`}
    >
      <span className="timer-dot" />
      <span aria-hidden="true">0:{seconds.toString().padStart(2, "0")}</span>
    </div>
  )
}

function Stars({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0
  const stars = pct >= 0.75 ? 3 : pct >= 0.45 ? 2 : 1
  return (
    <div className="fm-stars" aria-label={`${stars} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= stars ? "on" : ""}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function FaceMatch({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<Screen>("welcome")
  const [levelIdx, setLevelIdx] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [levelScores, setLevelScores] = useState<LevelScore[]>([])

  const level = levels[levelIdx]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [screen])

  const goHome = () => {
    setScreen("welcome")
    setLevelIdx(0)
    setResults([])
    setLevelScores([])
  }

  const startGame = () => {
    setLevelIdx(0)
    setResults([])
    setLevelScores([])
    setScreen("level-intro")
  }

  const addResult = useCallback((result: RoundResult) => {
    setResults((current) => [...current, result])
  }, [])

  const completeLevel = useCallback(
    (score: LevelScore) => {
      setLevelScores((current) => {
        const next = [...current]
        next[levelIdx] = score
        return next
      })
      setScreen("level-complete")
    },
    [levelIdx],
  )

  const nextLevel = () => {
    if (levelIdx >= levels.length - 1) {
      setScreen("results")
      return
    }
    setLevelIdx((current) => current + 1)
    setScreen("level-intro")
  }

  return (
    <main className={`flow-app fm-app screen-${screen}`}>
      {screen === "welcome" && (
        <section className="welcome-screen">
          <header className="welcome-header">
            <div className="little-adventures">
              <img src={asset("b7e07.svg")} alt="" />
              <span>LITTLE ADVENTURES</span>
            </div>
            <div className="welcome-links">
              <button type="button" className="text-link" onClick={onExit}>
                ← All games
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => setScreen("grownups")}
              >
                Grown-ups
              </button>
            </div>
          </header>
          <div className="welcome-content">
            <div className="welcome-copy">
              <p className="flow-eyebrow">A playful feelings-matching activity</p>
              <h1>
                Face
                <br />
                Match
              </h1>
              <p>
                Look at an animal friend’s face, then find the one with the same
                feeling as quickly as you can.
              </p>
              <div className="screening-note">
                <strong>For families:</strong> This activity can notice patterns
                worth discussing. It does not diagnose depression, anxiety, or
                any health condition.
              </div>
              <button
                className="flow-button"
                type="button"
                onClick={() => setScreen("map")}
              >
                Start the matching game <span>→</span>
              </button>
              <small>About 3 minutes · A grown-up should stay nearby</small>
            </div>
            <div className="welcome-art fm-welcome-art" aria-label="Animal friends showing different feelings">
              <div className="welcome-sun" />
              <div className="welcome-hill" />
              <span className="fm-float fm-float-1">
                <AnimalFace animal="bear" expression="happy" colorLevel={1} size={150} />
              </span>
              <span className="fm-float fm-float-2">
                <AnimalFace animal="cat" expression="sad" colorLevel={1} size={120} />
              </span>
              <span className="fm-float fm-float-3">
                <AnimalFace animal="dog" expression="surprised" colorLevel={1} size={130} />
              </span>
              <span className="fm-float fm-float-4">
                <AnimalFace animal="rabbit" expression="happy" colorLevel={1} size={110} />
              </span>
            </div>
          </div>
          <footer className="welcome-values">
            <span>Notice a feeling</span>
            <span>Find the match</span>
            <span>Share results with a professional</span>
          </footer>
        </section>
      )}

      {screen === "grownups" && (
        <section className="guide-screen">
          <header className="guide-header">
            <button className="back-link" type="button" onClick={goHome}>
              ← Back to the game
            </button>
            <span className="camera-note">Camera off · interactive concept</span>
          </header>
          <div className="guide-intro">
            <div>
              <h1>Before you match faces</h1>
              <p>Screening concept—not a diagnostic or medical test.</p>
            </div>
            <p>
              Your child sees an animal face and taps the card with the same
              face. The game compares speed and accuracy on happy, neutral, and
              negative-feeling faces.
            </p>
          </div>
          <div className="guide-grid">
            <article className="guide-card">
              <h2>Together, and always optional</h2>
              <p>
                This prototype does not use a webcam or collect camera data. It
                records only in-session choices and reaction times, which reset
                when the page is refreshed.
              </p>
              <p>
                Ask your child, “Would you like to play?” Stay neutral about
                answers and continue only while they are comfortable.
              </p>
            </article>
            <article className="guide-card calibration">
              <h2>Three timed levels</h2>
              <div className="calibration-path fm-calibration">
                {levels.map((lv) => (
                  <span key={lv.number} className={`level-${lv.colorLevel}`} title={lv.title}>
                    {lv.number}
                  </span>
                ))}
              </div>
              <p>
                Each level adds more cards and shifts from light to dark
                colours: 30, 45, then 60 seconds.
              </p>
            </article>
          </div>
          <article className="research-note">
            <strong>IMPORTANT · FOR GROWN-UPS</strong>
            <div>
              <p>
                A single game cannot identify depression. Results can reflect
                age, tiredness, motor speed, vision, attention, or simple
                interest.
              </p>
              <p>
                The game looks for a gap between happy and negative-feeling faces
                in accuracy or reaction time. It is a research-style concept, not
                a validated screening tool.
              </p>
              <p>
                If you are worried about your child’s mood, share specific
                everyday observations with your pediatrician, school team, or a
                qualified mental health professional.
              </p>
            </div>
          </article>
          <div className="guide-footer">
            <span>Stay nearby. Follow your child’s lead.</span>
            <button
              className="flow-button"
              type="button"
              onClick={() => setScreen("map")}
            >
              Ready for the levels →
            </button>
          </div>
        </section>
      )}

      {screen === "map" && (
        <section className="map-screen">
          <header className="flow-header">
            <button className="back-link" type="button" onClick={goHome}>
              ← Home
            </button>
            <Brand onHome={goHome} />
            <span className="map-duration">About 3 min</span>
          </header>
          <div className="map-heading">
            <h1>Three levels, each a little darker</h1>
            <p>More cards appear each time. We’ll start in the light meadow.</p>
          </div>
          <div className="chapter-grid">
            {levels.map((lv) => (
              <div
                key={lv.number}
                className={`chapter-card fm-level-card ${lv.number === 1 ? "ready" : ""}`}
              >
                <span className="chapter-number">{lv.number}</span>
                <span className="chapter-state">
                  {lv.number === 1 ? "START HERE" : `LEVEL ${lv.number}`}
                </span>
                <span className={`chapter-object fm-swatch level-${lv.colorLevel}`}>
                  <AnimalFace animal="bear" expression="happy" colorLevel={lv.colorLevel} size={96} />
                </span>
                <strong>{lv.title}</strong>
                <small>
                  {lv.choiceCount} cards · {lv.timeLimit} seconds
                </small>
              </div>
            ))}
          </div>
          <button className="flow-button map-start" type="button" onClick={startGame}>
            Start level 1 →
          </button>
          <p className="map-footnote">Each level has its own countdown timer.</p>
        </section>
      )}

      {screen === "level-intro" && (
        <LevelIntro key={levelIdx} level={level} onHome={goHome} onStart={() => setScreen("playing")} />
      )}

      {screen === "playing" && (
        <GameRound
          key={levelIdx}
          level={level}
          onAddResult={addResult}
          onComplete={completeLevel}
        />
      )}

      {screen === "level-complete" && (
        <LevelComplete
          level={level}
          score={levelScores[levelIdx] ?? { correct: 0, total: 0 }}
          isLast={levelIdx >= levels.length - 1}
          onHome={goHome}
          onNext={nextLevel}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          results={results}
          levelScores={levelScores}
          onHome={goHome}
          onReplay={startGame}
        />
      )}
    </main>
  )
}

function LevelHeader({ level, children }: { level: Level; children?: ReactNode }) {
  return (
    <header className="activity-header">
      <div className="activity-title">
        <span>{level.number}</span>
        <div>
          <strong>{level.title}</strong>
          <small>Level {level.number} of 3</small>
        </div>
      </div>
      <StepProgress active={level.number} />
      {children ?? <span />}
    </header>
  )
}

function LevelIntro({
  level,
  onHome,
  onStart,
}: {
  level: Level
  onHome: () => void
  onStart: () => void
}) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (count === null) return
    if (count === 0) {
      const id = window.setTimeout(onStart, 500)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setCount(count - 1), 800)
    return () => window.clearTimeout(id)
  }, [count, onStart])

  const previewAnimals: AnimalType[] = ["bear", "cat", "dog", "rabbit"]

  return (
    <section className="activity-screen">
      <LevelHeader level={level}>
        <button className="back-link fm-header-link" type="button" onClick={onHome}>
          Exit
        </button>
      </LevelHeader>
      <div className={`fm-stage fm-intro-stage level-${level.colorLevel}`}>
        {count === null ? (
          <>
            <p className="picture-mind">LEVEL {level.number}</p>
            <h1>{level.title}</h1>
            <p className="fm-tagline">{level.tagline}</p>
            <div className="fm-preview">
              {previewAnimals.slice(0, level.number + 1).map((animal) => (
                <span key={animal} className="fm-card">
                  <AnimalFace animal={animal} expression="happy" colorLevel={level.colorLevel} size={72} />
                </span>
              ))}
            </div>
            <div className="fm-pills">
              <span>{level.timeLimit} seconds</span>
              <span>{level.choiceCount} cards</span>
            </div>
            <button className="flow-button" type="button" onClick={() => setCount(3)}>
              I’m ready →
            </button>
          </>
        ) : (
          <div key={count} className="fm-count" aria-live="assertive">
            {count > 0 ? count : "Go!"}
          </div>
        )}
      </div>
    </section>
  )
}

function GameRound({
  level,
  onAddResult,
  onComplete,
}: {
  level: Level
  onAddResult: (result: RoundResult) => void
  onComplete: (score: LevelScore) => void
}) {
  const [round, setRound] = useState(() => generateRound(level))
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimit)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [score, setScore] = useState<LevelScore>({ correct: 0, total: 0 })

  const scoreRef = useRef<LevelScore>({ correct: 0, total: 0 })
  const roundStartedAt = useRef(performance.now())
  const feedbackTimer = useRef<number | null>(null)
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const id = window.setInterval(
      () => setTimeLeft((current) => Math.max(0, current - 1)),
      1000,
    )
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (timeLeft > 0 || completed.current) return
    completed.current = true
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current)
    const id = window.setTimeout(() => onCompleteRef.current(scoreRef.current), 350)
    return () => window.clearTimeout(id)
  }, [timeLeft])

  useEffect(
    () => () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current)
    },
    [],
  )

  const choose = (choice: Face) => {
    if (feedback !== null || completed.current) return
    const correct = choice.id === round.target.id
    onAddResult({
      faceId: round.target.id,
      sentiment: round.target.sentiment,
      reactionTime: Math.round(performance.now() - roundStartedAt.current),
      correct,
      level: level.number,
    })
    const next = {
      correct: scoreRef.current.correct + (correct ? 1 : 0),
      total: scoreRef.current.total + 1,
    }
    scoreRef.current = next
    setScore(next)
    setFeedback(correct ? "correct" : "wrong")
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback(null)
      setRound(generateRound(level))
      roundStartedAt.current = performance.now()
    }, 620)
  }

  return (
    <section className="activity-screen fm-play">
      <LevelHeader level={level}>
        <Countdown seconds={timeLeft} total={level.timeLimit} />
      </LevelHeader>
      <div className={`fm-stage level-${level.colorLevel}`}>
        <div className="fm-target-row">
          <div>
            <p className="picture-mind">MATCH THIS FEELING</p>
            <div
              className={`fm-target ${feedback ?? ""}`}
              role="img"
              aria-label={describe(round.target)}
            >
              <AnimalFace
                animal={round.target.animal}
                expression={round.target.expression}
                colorLevel={level.colorLevel}
                size={128}
              />
            </div>
          </div>
          <div className="fm-score">
            <small>MATCHED</small>
            <strong>
              {score.correct}
              <span> / {score.total}</span>
            </strong>
            <p className={`fm-feedback ${feedback ?? ""}`} aria-live="polite">
              {feedback === "correct"
                ? "✓ Great match!"
                : feedback === "wrong"
                  ? "Not quite — next one!"
                  : "Tap the same face"}
            </p>
          </div>
        </div>
        <div className={`fm-choice-grid choices-${level.choiceCount}`}>
          {round.choices.map((choice, index) => (
            <button
              key={`${choice.id}-${score.total}-${index}`}
              type="button"
              disabled={feedback !== null}
              aria-label={describe(choice)}
              className={`fm-card fm-choice ${
                feedback === "correct" && choice.id === round.target.id ? "matched" : ""
              }`}
              onClick={() => choose(choice)}
            >
              <AnimalFace
                animal={choice.animal}
                expression={choice.expression}
                colorLevel={level.colorLevel}
                size={level.choiceCount <= 4 ? 104 : level.choiceCount <= 6 ? 92 : 80}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function LevelComplete({
  level,
  score,
  isLast,
  onHome,
  onNext,
}: {
  level: Level
  score: LevelScore
  isLast: boolean
  onHome: () => void
  onNext: () => void
}) {
  const pct = score.total > 0 ? score.correct / score.total : 0
  const headline = pct >= 0.75 ? "Amazing matching!" : pct >= 0.45 ? "Nice job!" : "Keep going!"

  return (
    <section className="activity-screen">
      <LevelHeader level={level}>
        <button className="back-link fm-header-link" type="button" onClick={onHome}>
          Exit
        </button>
      </LevelHeader>
      <div className={`fm-stage fm-intro-stage level-${level.colorLevel}`}>
        <p className="picture-mind">LEVEL {level.number} COMPLETE</p>
        <h1>{headline}</h1>
        <Stars score={score.correct} total={score.total} />
        <div className="fm-level-score">
          <strong>
            {score.correct} / {score.total}
          </strong>
          <span>faces matched</span>
        </div>
        <button className="flow-button" type="button" onClick={onNext}>
          {isLast ? "See results →" : `Go to level ${level.number + 1} →`}
        </button>
      </div>
    </section>
  )
}

function ResultsScreen({
  results,
  levelScores,
  onHome,
  onReplay,
}: {
  results: RoundResult[]
  levelScores: LevelScore[]
  onHome: () => void
  onReplay: () => void
}) {
  const [showDetail, setShowDetail] = useState(false)
  const analysis = computeAnalysis(results)
  const { pos, neg, neu } = analysis
  const seconds = (ms: number) => (ms / 1000).toFixed(2)
  const percent = (value: number) => `${Math.round(value * 100)}%`

  return (
    <section className="results-screen">
      <header className="results-header">
        <Brand onHome={onHome} />
        <span>Caregiver summary</span>
      </header>
      <div className="results-hero">
        <p className="picture-mind">ADVENTURE COMPLETE</p>
        <h1>A snapshot of today’s play</h1>
        <p>
          These results describe this one short session. They are not a
          diagnosis and should never be used alone to label a child.
        </p>
      </div>
      <div className="results-metrics">
        <article>
          <small>FACES MATCHED</small>
          <strong>
            {analysis.correct} / {analysis.total}
          </strong>
          <span>across all three levels</span>
        </article>
        <article>
          <small>HAPPY FACES</small>
          <strong>{pos.total ? percent(pos.accuracy) : "—"}</strong>
          <span>{pos.total ? `${seconds(pos.avgTime)} s average response` : "not shown this time"}</span>
        </article>
        <article>
          <small>NEGATIVE-FEELING FACES</small>
          <strong>{neg.total ? percent(neg.accuracy) : "—"}</strong>
          <span>{neg.total ? `${seconds(neg.avgTime)} s average response` : "not shown this time"}</span>
        </article>
      </div>
      <div className="round-breakdown">
        {levels.map((lv, index) => {
          const ls = levelScores[index] ?? { correct: 0, total: 0 }
          return (
            <div key={lv.number}>
              <span>
                Level {lv.number} · {lv.title}
              </span>
              <strong>
                {ls.correct} / {ls.total} matched
              </strong>
              <small>{ls.total ? `${percent(ls.correct / ls.total)} accuracy` : "No answers"}</small>
            </div>
          )
        })}
      </div>
      <div className="parent-synopsis">
        <article>
          <p className="result-label">WHAT THIS MAY REFLECT</p>
          <h2>Speed and accuracy across feelings</h2>
          <p>
            Matching faces draws on visual attention, emotion recognition, and
            quick decisions. The game compares how your child did on happy faces
            with sad, scared, and angry faces.
          </p>
          <p>
            Research on mood and attention suggests some people with low mood
            respond differently to negative faces than to happy ones. But a gap
            in one short game can also come from tiredness, distraction, or how
            often each face happened to appear.
          </p>
        </article>
        <article className="next-steps-card">
          <p className="result-label">SENSIBLE NEXT STEPS</p>
          <h2>Look for patterns in everyday life</h2>
          <ol>
            <li>
              Notice changes in mood, sleep, appetite, play, or interest in
              friends over several weeks.
            </li>
            <li>
              Ask teachers or caregivers what they observe, without using this
              score as proof.
            </li>
            <li>
              If concerns persist, speak with your pediatrician or a qualified
              child mental health professional.
            </li>
            <li>
              If your child talks about hurting themselves, seek help right away
              from a doctor or local emergency service.
            </li>
          </ol>
        </article>
      </div>
      <button
        className="quiet-link fm-detail-toggle"
        type="button"
        aria-expanded={showDetail}
        onClick={() => setShowDetail((open) => !open)}
      >
        {showDetail ? "Hide researcher view ▲" : "Show researcher view ▼"}
      </button>
      {showDetail && (
        <div className="fm-research">
          <div className={`fm-flag ${analysis.negativeBias ? "flagged" : ""}`}>
            <p className="result-label">
              {analysis.negativeBias ? "A DIFFERENCE WORTH NOTING" : "NO CLEAR DIFFERENCE"}
            </p>
            <p>
              {analysis.negativeBias
                ? "In this session, negative-feeling faces were matched at least 15 points less accurately, or more than 1.35× slower, than happy faces."
                : "In this session, accuracy and reaction time on negative-feeling faces were within the game’s thresholds (15 points / 1.35×) of happy faces."}
            </p>
          </div>
          <div className="fm-tables">
            <article>
              <p className="result-label">BY FACE TYPE</p>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Accuracy</th>
                    <th>Avg time</th>
                    <th>n</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { d: pos, label: "Happy" },
                    { d: neg, label: "Negative" },
                    { d: neu, label: "Neutral" },
                  ].map(({ d, label }) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{d.total ? percent(d.accuracy) : "—"}</td>
                      <td>{d.total ? `${seconds(d.avgTime)} s` : "—"}</td>
                      <td>{d.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="fm-table-note">
                Time ratio (negative ÷ happy):{" "}
                <strong>{pos.avgTime > 0 && neg.total ? (neg.avgTime / pos.avgTime).toFixed(2) : "—"}</strong>
                {" · "}
                Accuracy gap (happy − negative):{" "}
                <strong>{pos.total && neg.total ? percent(pos.accuracy - neg.accuracy) : "—"}</strong>
              </p>
            </article>
            <article>
              <p className="result-label">BY LEVEL</p>
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Colour context</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lv, index) => {
                    const ls = levelScores[index] ?? { correct: 0, total: 0 }
                    return (
                      <tr key={lv.number}>
                        <td>L{lv.number}</td>
                        <td>
                          {ls.correct}/{ls.total}
                        </td>
                        <td>{ls.total ? percent(ls.correct / ls.total) : "—"}</td>
                        <td>{lv.context}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </article>
          </div>
          <div className="fm-method">
            <p>
              <strong>Why colours darken.</strong> Levels move from light to
              dark colours, which are commonly associated with lower mood. This
              tests whether performance on negative faces holds up differently
              from happy faces as the scene darkens.
            </p>
            <p>
              <strong>Camera.</strong> No camera or eye tracking is used. A
              future version could explore gaze measures such as dwell time or
              first fixation, with consent. Reaction time is used here as a
              simple stand-in.
            </p>
            <p className="fm-references">
              References: Beck (1979) Cognitive Therapy of Depression; Mathews
              &amp; MacLeod (2005) Cognitive vulnerability to emotional disorders;
              Valdez &amp; Mehrabian (1994) Effects of color on emotions;
              Jonauskaite et al. (2020) Universal patterns in color-emotion
              associations.
            </p>
          </div>
        </div>
      )}
      <div className="results-disclaimer">
        <strong>Seek support based on real-world concerns—not a game score.</strong>
        <span>
          Early conversations can be helpful, and support does not require
          waiting for a diagnosis.
        </span>
      </div>
      <div className="results-actions">
        <button className="flow-button" type="button" onClick={onReplay}>
          Play again
        </button>
        <button className="quiet-link" type="button" onClick={onHome}>
          Return home
        </button>
      </div>
    </section>
  )
}
