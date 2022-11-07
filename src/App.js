import { useRef, useState } from "react";
import "./App.css";

const BEEP_SOUND_SRC =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

const DEFAULT_BREAK_LENGTH = 5;
const DEFAULT_SESSION_LENGTH = 25;

const renderTime = (value) => {
  let remaining = value;
  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;
  const seconds = remaining;

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const MODES = Object.freeze({
  BREAK: "BREAK",
  SESSION: "SESSION",
});

function App() {
  const [breakLength, setBreakLength] = useState(DEFAULT_BREAK_LENGTH);
  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION_LENGTH);

  const [mode, setMode] = useState(MODES.SESSION);
  const [clock, setClock] = useState(DEFAULT_SESSION_LENGTH * 60);
  const [playing, setPlaying] = useState(false);

  const timerRef = useRef();
  const audioRef = useRef();
  const modeRef = useRef();
  modeRef.current = mode;
  const clockRef = useRef();
  clockRef.current = clock;

  const playBeep = () => {
    audioRef.current?.play();
    setTimeout(() => audioRef.current?.pause(), 1000);
  };

  const togglePlay = () => {
    if (playing) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        const newValue = clockRef.current - 1;
        if (newValue < 0) {
          playBeep();
          const newMode =
            modeRef.current === MODES.SESSION ? MODES.BREAK : MODES.SESSION;
          setMode(newMode);
          setClock(
            (newMode === MODES.SESSION ? sessionLength : breakLength) * 60
          );
        } else {
          setClock(newValue);
        }
      }, 1000);
    }

    setPlaying((pPlaying) => !pPlaying);
  };

  const handleReset = () => {
    setBreakLength(DEFAULT_BREAK_LENGTH);
    setSessionLength(DEFAULT_SESSION_LENGTH);
    setClock(DEFAULT_SESSION_LENGTH * 60);
    setPlaying(false);
    setMode(MODES.SESSION);
  };

  const afterChangeLength = (v, inputMode) => {
    if (!playing && mode === inputMode) {
      setClock(v * 60);
    }
  };

  return (
    <div className="App">
      <audio id="beep" ref={audioRef}>
        <source src={BEEP_SOUND_SRC} type="audio/wav" />
      </audio>
      <div>25 + 5 Clock</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: "20px",
        }}
      >
        <div>
          <p id="break-label">Break Length</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="break-decrement"
              onClick={() => {
                setBreakLength((prev) => {
                  const newLength = prev - 1 < 1 ? 1 : prev - 1;
                  afterChangeLength(newLength, MODES.BREAK);
                  return newLength;
                });
              }}
            >
              -
            </button>
            <div id="break-length">{breakLength}</div>
            <button
              id="break-increment"
              onClick={() => {
                setBreakLength((prev) => {
                  const newLength = prev + 1 > 60 ? 60 : prev + 1;
                  afterChangeLength(newLength, MODES.BREAK);
                  return newLength;
                });
              }}
            >
              +
            </button>
          </div>
        </div>
        <div>
          <p id="session-label">Session Length</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="session-decrement"
              onClick={() => {
                setSessionLength((prev) => {
                  const newLength = prev - 1 < 1 ? 1 : prev - 1;
                  afterChangeLength(newLength, MODES.SESSION);
                  return newLength;
                });
              }}
            >
              -
            </button>
            <div id="session-length">{sessionLength}</div>
            <button
              id="session-increment"
              onClick={() => {
                setSessionLength((prev) => {
                  const newLength = prev + 1 > 60 ? 60 : prev + 1;
                  afterChangeLength(newLength, MODES.SESSION);
                  return newLength;
                });
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid #fff", margin: "40px" }}>
        <p id="timer-label">{mode === MODES.SESSION ? "Session" : "Break"}</p>

        <p id="time-left">{renderTime(clock)}</p>
      </div>

      <div>
        <button onClick={() => setClock(5)}>Quick</button>
        <button id="start_stop" onClick={togglePlay}>
          Play/Pause
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
