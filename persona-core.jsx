// Persona Profile — shared building blocks for the LLO 8230 worksheet family.
// Reuses WSCore (Editable / Chip / Blank / EditableChipList / ExportButton)
// from worksheet-core.jsx and adds persona-specific state + identity pieces.
// Exposed via window.PersonaCore.

const WSc = window.WSCore;
const { useState: useStateP, useCallback: useCallbackP, useMemo: useMemoP } = React;

// ── The three prompts this template captures (confirmed with the user) ──
// 1. What does the user NEED from the program?  (surface, practical)
// 2. What do they THINK the main problems / challenges are? (perceived)
// 3. What are their UNDERLYING needs? — split into Interests / Motivations /
//    Challenges so the deeper drivers are separated from the surface ones.

const PERSONA_INTRO =
  "A persona turns an abstract “user” into one specific person the evaluation must serve. Sketch a representative user of the program being evaluated — who they are, what they need from it, the problems they perceive, and the deeper needs beneath the surface. Keep the end in mind: these are the people whose change the evaluation will try to detect.";

// ── Generic worked example (a leadership / management development program) ──
const EXAMPLE = {
  name: "Maya R.",
  role: "Newly promoted team lead",
  photo: "https://api.dicebear.com/8.x/open-peeps/svg?seed=MayaR&backgroundColor=1c1c1c&backgroundType=solid&clothingColor=b49248&skinColor=d08b5b",
  quote: "I was great at the work. Now I’m responsible for the people who do it — and no one taught me how.",
  needs: [
    "Concrete tactics I can try in my very next 1:1",
    "A way to give hard feedback without bruising the relationship",
    "Proof I’m not the only one figuring this out",
  ],
  problems: [
    "My team keeps missing deadlines and I can’t tell why",
    "Meetings run long and decisions don’t stick",
    "I’m still doing too much of the work myself",
  ],
  interests:   ["Career growth", "Being seen as a fair manager"],
  motivations: ["Earn the team’s respect", "Not let her former peers down"],
  challenges:  ["No time to step back and learn", "Fear of looking like she doesn’t belong"],
};

const BLANK = {
  name: "", role: "", quote: "", photo: "",
  needs: ["", "", ""],
  problems: ["", "", ""],
  interests: ["", ""],
  motivations: ["", ""],
  challenges: ["", ""],
};

// ── Persisted state (one row per variation key) ─────────────────────────
// Starts on the worked EXAMPLE so students see a filled-in model; `touched`
// flips to true on any edit (hides the “sample” ribbon). loadExample / clear
// reset the whole sheet.
function usePersonaState(variantKey, { startBlank = false } = {}) {
  const storageKey = `ws.personaProfile.${variantKey}`;
  const [state, setState] = useStateP(() => {
    const base = startBlank ? { ...BLANK, touched: true } : { ...EXAMPLE, touched: false };
    try {
      const raw = localStorage.getItem(storageKey);
      // Spread base first so any new fields added to EXAMPLE/BLANK since the
      // last save are picked up, then overlay stored edits so nothing is lost.
      if (raw) return { ...base, ...JSON.parse(raw) };
    } catch (_) {}
    return base;
  });

  const commit = useCallbackP((next) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) {}
    return next;
  }, [storageKey]);

  const set = useCallbackP((field, value) => {
    setState(prev => commit({ ...prev, [field]: value, touched: true }));
  }, [commit]);

  const setArr = useCallbackP((field, idx, value) => {
    setState(prev => {
      const arr = [...prev[field]]; arr[idx] = value;
      return commit({ ...prev, [field]: arr, touched: true });
    });
  }, [commit]);

  const setList = useCallbackP((field, list) => {
    setState(prev => commit({ ...prev, [field]: list, touched: true }));
  }, [commit]);

  const loadExample = useCallbackP(() => setState(commit({ ...EXAMPLE, touched: false })), [commit]);
  const clearAll    = useCallbackP(() => setState(commit({ ...BLANK,   touched: true  })), [commit]);

  return { state, set, setArr, setList, loadExample, clearAll };
}

// ── Avatar placeholder ──────────────────────────────────────────────────
// A drop-a-photo placeholder. Shows derived initials if a name is typed,
// else a neutral head silhouette. `shape` = "circle" | "square".
function Avatar({ name = "", src = "", size = 168, shape = "circle", variant = "light" }) {
  const initials = (name || "").trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const dark = variant === "dark";
  const radius = shape === "square" ? 18 : "50%";
  const ring  = dark ? "var(--vu-gold)" : "var(--vu-gold-d)";
  const bg    = dark ? "rgba(207,174,112,0.10)" : "var(--vu-cream)";
  const fg    = dark ? "var(--vu-cream)" : "var(--vu-oak)";
  return (
    <div
      title="Persona photo"
      style={{
        width: size, height: size, borderRadius: radius,
        background: bg,
        border: `2px solid ${ring}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flex: "0 0 auto", overflow: "hidden", position: "relative",
      }}
    >
      {src ? (
        <img src={src} alt={name || "Persona"} crossOrigin="anonymous"
             style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : initials ? (
        <span style={{
          fontFamily: "var(--serif)", fontWeight: 600, fontStyle: "italic",
          fontSize: size * 0.4, color: fg, letterSpacing: "-0.02em", lineHeight: 1,
        }}>{initials}</span>
      ) : (
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none"
             stroke={dark ? "var(--vu-gold)" : "var(--vu-gold-d)"} strokeWidth="1.4"
             strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.65 }}>
          <circle cx="12" cy="8.5" r="4" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      )}
    </div>
  );
}

// ── Sample / Blank toggle (a small new interaction) ─────────────────────
function SampleToggle({ touched, onExample, onClear, dark = false }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "7px 13px", borderRadius: 999,
    fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600,
    letterSpacing: "0.01em", cursor: "pointer",
    border: `1.5px solid ${dark ? "rgba(245,243,239,0.30)" : "var(--vu-rule)"}`,
    background: "transparent",
    color: dark ? "var(--vu-cream)" : "var(--vu-ink)",
    transition: "background .14s, border-color .14s, color .14s",
  };
  return (
    <div className="export-hide" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <button type="button" style={base} onClick={onExample}
              title="Fill the sheet with a worked sample persona">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v12M2 8h12" />
        </svg>
        Sample
      </button>
      <button type="button" style={base} onClick={onClear}
              title="Clear every field to start your own persona">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h10M6.5 4V2.8h3V4M5 4l.6 9.2h4.8L11 4" />
        </svg>
        Blank
      </button>
    </div>
  );
}

// ── Sample ribbon — shown while the sheet still holds the untouched example
function SampleRibbon({ dark = false }) {
  return (
    <span className="export-hide" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "5px 12px", borderRadius: 999,
      background: dark ? "rgba(207,174,112,0.18)" : "rgba(207,174,112,0.20)",
      color: dark ? "var(--vu-gold)" : "var(--vu-oak)",
      fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700,
      letterSpacing: "0.14em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></span>
      Sample — edit any field to make it yours
    </span>
  );
}

// ── Eyebrow line (shared header kicker) ─────────────────────────────────
function Eyebrow({ dark = false }) {
  const muted = dark ? "rgba(245,243,239,0.55)" : "var(--vu-muted)";
  const gold  = dark ? "var(--vu-gold)" : "var(--vu-oak)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9, flexWrap: "nowrap", whiteSpace: "nowrap",
      fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase",
      color: muted, fontWeight: 700, fontFamily: "var(--sans)",
    }}>
      <span style={{ flex: "0 0 auto" }}>Vanderbilt Peabody College</span>
      <span style={{ opacity: 0.4, flex: "0 0 auto" }}>—</span>
      <span style={{ color: gold, flex: "0 0 auto" }}>LLO 8230: Program Evaluation</span>
    </div>
  );
}

window.PersonaCore = {
  PERSONA_INTRO, EXAMPLE, BLANK,
  usePersonaState,
  Avatar, SampleToggle, SampleRibbon, Eyebrow,
};
