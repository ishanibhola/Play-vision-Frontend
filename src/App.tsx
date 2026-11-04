import { useEffect, useRef, useState } from "react"

const asset = (name: string) => `/assets/${name}`

type Screen = "welcome" | "grownups" | "map" | "sam-look" | "sam-quiz" | "maya-look" | "maya-quiz" | "leo-look" | "leo-quiz" | "antisaccade" | "results"

type ObjectName = "ball" | "kite" | "teddy" | "watering" | "truck" | "bird" | "left" | "up" | "right"

type ChapterKey = "sam" | "maya" | "leo"

type RoundResult = {
  key: ChapterKey
  correct: boolean
  seconds: number
}

type AntisaccadeResult = {
  correct: number
  total: number
  averageMs: number
}

const chapters = [
  {
    key: "sam",
    step: 1,
    title: "Park detective",
    subtitle: "Start with a busy scene",
    character: "Sam",
    characterAsset: "0374d.svg",
    look: "Follow Sam’s look through the busy park.",
    question: "Which way was Sam looking?",
    answers: [
      ["left", "Left"],
      ["up", "Up"],
      ["right", "Right"],
    ] as [ObjectName, string][],
    correct: "left" as ObjectName,
  },
  {
    key: "maya",
    step: 2,
    title: "Garden clues",
    subtitle: "More details to notice",
    character: "Maya",
    characterAsset: "732d2.svg",
    look: "What has Maya noticed among all the garden clues?",
    question: "What did Maya want to use?",
    answers: [
      ["watering", "Watering can"],
      ["truck", "Toy truck"],
      ["bird", "Bird"],
    ] as [ObjectName, string][],
    correct: "watering" as ObjectName,
  },
  {
    key: "leo",
    step: 3,
    title: "Cartoon chase",
    subtitle: "Moving clues and distractions",
    character: "Leo",
    characterAsset: "5cee1.svg",
    look: "Two things are moving. Where is Leo looking?",
    question: "What was Leo looking at?",
    answers: [
      ["ball", "Ball"],
      ["kite", "Kite"],
      ["teddy", "Teddy"],
    ] as [ObjectName, string][],
    correct: "kite" as ObjectName,
  },
] as const

const nextScreen: Record<ChapterKey, Screen> = {
  sam: "maya-look",
  maya: "leo-look",
  leo: "antisaccade",
}

function ObjectIcon({ name }: { name: ObjectName }) {
  if (name === "left" || name === "up" || name === "right") {
    return (
      <span
        className={`object-icon arrow-icon arrow-${name}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <span className={`object-icon object-${name}`} aria-hidden="true">
      <span />
      <i />
    </span>
  )
}

function Brand({ onHome }: { onHome: () => void }) {
  return (
    <button className="flow-brand" type="button" onClick={onHome}>
      <img src={asset("b7e07.svg")} alt="" />
      <span>Look &amp; Discover</span>
    </button>
  )
}

function StepProgress({ active }: { active: number }) {
  return (
    <div className="step-progress" aria-label={`Round ${active} of 3`}>
      {[1, 2, 3].map((step) => (
        <span key={step} className={step === active ? "active" : ""} />
      ))}
    </div>
  )
}

function Timer({ seconds }: { seconds: number }) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60

  return (
    <div
      className="round-timer"
      aria-label={`Time elapsed: ${minutes} minutes ${remainder} seconds`}
    >
      <span className="timer-dot" />
      <span aria-hidden="true">
        {minutes}:{remainder.toString().padStart(2, "0")}
      </span>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome")
  const [answer, setAnswer] = useState<ObjectName | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [roundStartedAt, setRoundStartedAt] = useState<number | null>(null)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [antisaccadeResult, setAntisaccadeResult] =
    useState<AntisaccadeResult | null>(null)
  const transitionTimer = useRef<number | null>(null)

  const activeChapter = chapters.find((chapter) =>
    screen.startsWith(chapter.key),
  )

  useEffect(() => {
    setAnswer(null)
    window.scrollTo({ top: 0, behavior: "smooth" })

    if (screen.endsWith("-look")) {
      setElapsed(0)
      setRoundStartedAt(Date.now())
    }
  }, [screen])

  useEffect(() => {
    if (!activeChapter || roundStartedAt === null) return

    const updateTimer = () =>
      setElapsed(Math.floor((Date.now() - roundStartedAt) / 1000))
    updateTimer()
    const interval = window.setInterval(updateTimer, 250)
    return () => window.clearInterval(interval)
  }, [activeChapter, roundStartedAt])

  useEffect(
    () => () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    },
    [],
  )

  const goHome = () => {
    setScreen("welcome")
    setRoundResults([])
    setAntisaccadeResult(null)
    setRoundStartedAt(null)
  }

  const finishRound = (correct: boolean) => {
    if (!activeChapter) return

    setRoundResults((current) => [
      ...current.filter((result) => result.key !== activeChapter.key),
      { key: activeChapter.key, correct, seconds: elapsed },
    ])
    setScreen(nextScreen[activeChapter.key])
  }

  const chooseAnswer = (choice: ObjectName) => {
    if (!activeChapter || answer) return
    setAnswer(choice)
    transitionTimer.current = window.setTimeout(
      () => finishRound(choice === activeChapter.correct),
      700,
    )
  }

  return (
    <main className={`flow-app screen-${screen}`}>
      {screen === "welcome" && (
        <section className="welcome-screen">
          <header className="welcome-header">
            <div className="little-adventures">
              <img src={asset("b7e07.svg")} alt="" />
              <span>LITTLE ADVENTURES</span>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => setScreen("grownups")}
            >
              Grown-ups
            </button>
          </header>
          <div className="welcome-content">
            <div className="welcome-copy">
              <p className="flow-eyebrow">
                A playful attention screening activity
              </p>
              <h1>
                Look &amp;
                <br />
                Discover
              </h1>
              <p>
                Follow where a friend is looking, remember the clue, and try an
                opposite-side attention game.
              </p>
              <div className="screening-note">
                <strong>For families:</strong> This activity can notice patterns
                worth discussing. It does not diagnose autism, ADHD, or any
                health condition.
              </div>
              <button
                className="flow-button"
                type="button"
                onClick={() => setScreen("map")}
              >
                Start the screening game <span>→</span>
              </button>
              <small>About 5 minutes · A grown-up should stay nearby</small>
            </div>
            <div className="welcome-art" aria-label="Leo playing outside">
              <div className="welcome-sun" />
              <div className="welcome-hill" />
              <ObjectIcon name="kite" />
              <img
                className="welcome-character"
                src={asset("5cee1.svg")}
                alt="Leo"
              />
              <ObjectIcon name="ball" />
            </div>
          </div>
          <footer className="welcome-values">
            <span>Follow a look</span>
            <span>Notice distractions</span>
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
            <span className="camera-note">
              Camera off · interactive concept
            </span>
          </header>
          <div className="guide-intro">
            <div>
              <h1>Before your little adventure</h1>
              <p>Screening concept—not a diagnostic or medical test.</p>
            </div>
            <p>
              For ages 4–10: follow another person’s gaze, hold a clue in mind,
              filter distractions, and respond in the opposite direction.
            </p>
          </div>
          <div className="guide-grid">
            <article className="guide-card">
              <h2>Together, and always optional</h2>
              <p>
                This prototype does not use a webcam or collect camera data. It
                records only in-session choices and timing, which reset when the
                page is refreshed.
              </p>
              <p>
                Ask your child, “Would you like to play?” Stay neutral about
                answers and continue only while they are comfortable.
              </p>
            </article>
            <article className="guide-card calibration">
              <h2>Four short activities</h2>
              <div className="calibration-path">
                {["Look", "Filter", "Track", "Opposite"].map((label, index) => (
                  <span key={label} title={label}>
                    {index + 1}
                  </span>
                ))}
              </div>
              <p>
                The rounds gradually add visual detail and movement. A final
                tap-based task explores inhibitory control; it does not measure
                eye movements.
              </p>
            </article>
          </div>
          <article className="research-note">
            <strong>IMPORTANT · FOR GROWN-UPS</strong>
            <div>
              <p>
                A single game cannot identify autism or ADHD. Similar results
                can reflect age, tiredness, motor speed, language, anxiety,
                vision, or simple interest.
              </p>
              <p>
                Antisaccades are eye movements away from a sudden cue. This
                prototype uses taps as an early interaction concept, not
                clinical eye tracking.
              </p>
              <p>
                If you have developmental concerns, share specific everyday
                observations with your child’s pediatrician, school team, or a
                qualified specialist.
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
              Ready for the map →
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
            <span className="map-duration">About 5 min</span>
          </header>
          <div className="map-heading">
            <h1>Three rounds, one final challenge</h1>
            <p>Each round gets a little busier. We’ll start with Sam.</p>
          </div>
          <div className="chapter-grid">
            {chapters.map((chapter) => (
              <button
                key={chapter.key}
                type="button"
                className={`chapter-card ${chapter.step === 1 ? "ready" : ""}`}
                onClick={() => setScreen(`${chapter.key}-look` as Screen)}
              >
                <span className="chapter-number">{chapter.step}</span>
                <span className="chapter-state">
                  {chapter.step === 1 ? "START HERE" : `LEVEL ${chapter.step}`}
                </span>
                <span className="chapter-object">
                  <ObjectIcon
                    name={
                      chapter.key === "sam"
                        ? "left"
                        : chapter.key === "maya"
                          ? "watering"
                          : "kite"
                    }
                  />
                </span>
                <strong>{chapter.title}</strong>
                <small>{chapter.subtitle}</small>
                {chapter.step === 1 && <em>Meet Sam →</em>}
              </button>
            ))}
          </div>
          <button
            className="flow-button map-start"
            type="button"
            onClick={() => setScreen("sam-look")}
          >
            Start round 1 →
          </button>
          <p className="map-footnote">
            A timer will begin when the first scene opens.
          </p>
        </section>
      )}

      {activeChapter && screen.endsWith("-look") && (
        <section className="activity-screen">
          <ActivityHeader chapter={activeChapter} seconds={elapsed} />
          <h1 className="scene-question">{activeChapter.look}</h1>
          <div
            className={`story-scene scene-${activeChapter.key} ${
              activeChapter.key === "leo" ? "cartoon-scene" : ""
            }`}
          >
            <div className="scene-speed-lines" />
            <div className="scene-sun" />
            <div className="scene-tree" />
            <div className="scene-hills" />
            <img
              src={asset(activeChapter.characterAsset)}
              alt={activeChapter.character}
              className="scene-character"
            />
            {activeChapter.key === "sam" && (
              <>
                <ObjectIcon name="kite" />
                <img
                  src={asset("90bfe.svg")}
                  className="scene-dog"
                  alt="A dog"
                />
                <ObjectIcon name="ball" />
                <span className="small-distractor distractor-one">
                  <ObjectIcon name="bird" />
                </span>
              </>
            )}
            {activeChapter.key === "maya" && (
              <>
                <ObjectIcon name="bird" />
                <ObjectIcon name="truck" />
                <ObjectIcon name="watering" />
                <span className="small-distractor distractor-two">
                  <ObjectIcon name="teddy" />
                </span>
                <span className="small-distractor distractor-three">
                  <ObjectIcon name="ball" />
                </span>
              </>
            )}
            {activeChapter.key === "leo" && (
              <>
                <span className="moving-object moving-kite">
                  <ObjectIcon name="kite" />
                </span>
                <span className="moving-object moving-ball">
                  <ObjectIcon name="ball" />
                </span>
                <ObjectIcon name="teddy" />
                <span className="cartoon-cloud cloud-one" />
                <span className="cartoon-cloud cloud-two" />
              </>
            )}
          </div>
          <div className="activity-actions">
            <p className="observation-hint">
              Watch the face, then notice the whole scene.
            </p>
            <button
              className="flow-button"
              type="button"
              onClick={() => setScreen(`${activeChapter.key}-quiz` as Screen)}
            >
              I remember →
            </button>
          </div>
        </section>
      )}

      {activeChapter && screen.endsWith("-quiz") && (
        <section className="activity-screen quiz-screen">
          <ActivityHeader chapter={activeChapter} seconds={elapsed} />
          <p className="picture-mind">PICTURE IT IN YOUR MIND</p>
          <h1>{activeChapter.question}</h1>
          <p className="choose-note">
            Choose one answer. The timer is still running.
          </p>
          <div className="answer-grid">
            {activeChapter.answers.map(([value, label]) => (
              <button
                key={value}
                type="button"
                disabled={answer !== null}
                className={`answer-card ${answer === value ? "selected" : ""} ${
                  answer && value === activeChapter.correct ? "correct" : ""
                }`}
                onClick={() => chooseAnswer(value)}
              >
                <ObjectIcon name={value} />
                <strong>{label}</strong>
              </button>
            ))}
          </div>
          <div className="quiz-footer single-action">
            <button
              className="quiet-link"
              type="button"
              onClick={() => finishRound(false)}
            >
              I’m not sure — continue →
            </button>
          </div>
        </section>
      )}

      {screen === "antisaccade" && (
        <AntisaccadeGame
          onComplete={(result) => {
            setAntisaccadeResult(result)
            setScreen("results")
          }}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          rounds={roundResults}
          antisaccade={antisaccadeResult}
          onHome={goHome}
          onReplay={() => {
            setRoundResults([])
            setAntisaccadeResult(null)
            setScreen("map")
          }}
        />
      )}
    </main>
  )
}

function ActivityHeader({
  chapter,
  seconds,
}: {
  chapter: typeof chapters[number]
  seconds: number
}) {
  return (
    <header className="activity-header">
      <div className="activity-title">
        <span>{chapter.step}</span>
        <div>
          <strong>{chapter.title}</strong>
          <small>Round {chapter.step} of 3</small>
        </div>
      </div>
      <StepProgress active={chapter.step} />
      <Timer seconds={seconds} />
    </header>
  )
}

const antisaccadeTrials = [
  "left",
  "right",
  "right",
  "left",
  "right",
  "left",
] as const

function AntisaccadeGame({
  onComplete,
}: {
  onComplete: (result: AntisaccadeResult) => void
}) {
  const [started, setStarted] = useState(false)
  const [trial, setTrial] = useState(0)
  const [responses, setResponses] = useState<{ correct: boolean; ms: number }[]>(
    [],
  )
  const [locked, setLocked] = useState(false)
  const trialStartedAt = useRef(0)
  const cue = antisaccadeTrials[trial]

  const start = () => {
    setStarted(true)
    trialStartedAt.current = performance.now()
  }

  const respond = (side: "left" | "right") => {
    if (locked) return
    setLocked(true)
    const response = {
      correct: side !== cue,
      ms: Math.round(performance.now() - trialStartedAt.current),
    }
    const updated = [...responses, response]
    setResponses(updated)

    window.setTimeout(() => {
      if (trial === antisaccadeTrials.length - 1) {
        const totalMs = updated.reduce((sum, item) => sum + item.ms, 0)
        onComplete({
          correct: updated.filter((item) => item.correct).length,
          total: updated.length,
          averageMs: Math.round(totalMs / updated.length),
        })
        return
      }

      setTrial((current) => current + 1)
      setLocked(false)
      trialStartedAt.current = performance.now()
    }, 450)
  }

  return (
    <section className="antisaccade-screen">
      <header className="challenge-header">
        <Brand onHome={() => window.location.reload()} />
        <span>Final mini-game</span>
      </header>
      {!started ? (
        <div className="challenge-intro">
          <p className="picture-mind">THE OPPOSITE GAME</p>
          <h1>Don’t follow the sparkle!</h1>
          <p>
            A sparkle will pop up on one side. Tap the{" "}
            <strong>opposite side</strong> as quickly as you can.
          </p>
          <div
            className="opposite-example"
            aria-label="Example: sparkle left, tap right"
          >
            <span className="example-cue">✦</span>
            <span className="example-arrow">→</span>
            <span className="example-target">TAP</span>
          </div>
          <div className="concept-note">
            <strong>Prototype note:</strong> A clinical antisaccade task
            measures eye movement. This tap game only explores the same “look
            away from the distraction” idea.
          </div>
          <button className="flow-button" type="button" onClick={start}>
            Start 6 quick turns →
          </button>
        </div>
      ) : (
        <div className="challenge-play">
          <div className="challenge-progress">
            <span>
              Turn {trial + 1} of {antisaccadeTrials.length}
            </span>
            <div>
              {antisaccadeTrials.map((_, index) => (
                <i
                  key={index}
                  className={
                    index < trial ? "done" : index === trial ? "active" : ""
                  }
                />
              ))}
            </div>
          </div>
          <h1>Tap the opposite side</h1>
          <div
            className={`antisaccade-stage cue-${cue} ${
              locked ? "answered" : ""
            }`}
          >
            <button
              type="button"
              aria-label="Choose left"
              onClick={() => respond("left")}
              disabled={locked}
            >
              LEFT
            </button>
            <span className="center-focus">+</span>
            <span className="flash-cue" aria-hidden="true">
              ✦
            </span>
            <span className="orbiting-distraction" aria-hidden="true" />
            <button
              type="button"
              aria-label="Choose right"
              onClick={() => respond("right")}
              disabled={locked}
            >
              RIGHT
            </button>
          </div>
          <p className="challenge-reminder">
            Resist the sparkle and choose the other side.
          </p>
        </div>
      )}
    </section>
  )
}

function ResultsScreen({
  rounds,
  antisaccade,
  onHome,
  onReplay,
}: {
  rounds: RoundResult[]
  antisaccade: AntisaccadeResult | null
  onHome: () => void
  onReplay: () => void
}) {
  const correctRounds = rounds.filter((round) => round.correct).length
  const totalSeconds = rounds.reduce((sum, round) => sum + round.seconds, 0)

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
          <small>LOOK &amp; REMEMBER</small>
          <strong>{correctRounds} / 3</strong>
          <span>rounds answered correctly</span>
        </article>
        <article>
          <small>ROUND TIME</small>
          <strong>
            {Math.floor(totalSeconds / 60)}:
            {(totalSeconds % 60).toString().padStart(2, "0")}
          </strong>
          <span>total observation time</span>
        </article>
        <article>
          <small>OPPOSITE TAPS</small>
          <strong>
            {antisaccade?.correct ?? 0} / {antisaccade?.total ?? 6}
          </strong>
          <span>{antisaccade?.averageMs ?? "—"} ms average response</span>
        </article>
      </div>
      <div className="round-breakdown">
        {chapters.map((chapter) => {
          const result = rounds.find((round) => round.key === chapter.key)
          return (
            <div key={chapter.key}>
              <span>Round {chapter.step}</span>
              <strong>
                {result?.correct ? "Matched the clue" : "Different / no answer"}
              </strong>
              <small>{result?.seconds ?? 0} seconds</small>
            </div>
          )
        })}
      </div>
      <div className="parent-synopsis">
        <article>
          <p className="result-label">WHAT THIS MAY REFLECT</p>
          <h2>Attention, memory, and inhibition</h2>
          <p>
            The first rounds combine gaze-following, visual attention, working
            memory, and choosing between distractions. The opposite game adds
            inhibitory control: pausing an automatic response and making a
            different one.
          </p>
          <p>
            Differences in these skills can occur in children with ADHD or
            autism, but they also occur in many children without either
            condition. Autism involves broader patterns in social communication
            and restricted or repetitive behaviors. ADHD involves persistent
            inattention and/or hyperactivity-impulsivity across settings. This
            game does not assess those full criteria.
          </p>
        </article>
        <article className="next-steps-card">
          <p className="result-label">SENSIBLE NEXT STEPS</p>
          <h2>Look for patterns in everyday life</h2>
          <ol>
            <li>
              Notice strengths and challenges across home, school, and social
              situations.
            </li>
            <li>
              Ask teachers or caregivers what they observe, without using this
              score as proof.
            </li>
            <li>
              If concerns persist, speak with your pediatrician or a qualified
              developmental, behavioral, or neuropsychology professional.
            </li>
            <li>
              Ask about validated screening and comprehensive assessment,
              including hearing and vision checks when appropriate.
            </li>
          </ol>
        </article>
      </div>
      <div className="results-disclaimer">
        <strong>
          Seek support based on real-world concerns—not a game score.
        </strong>
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
