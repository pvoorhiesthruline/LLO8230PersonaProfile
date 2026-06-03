// Shared building blocks for the Evaluation Purpose worksheet variations.
// Each variation imports these via window.WSCore.
const { useState, useEffect, useRef, useCallback } = React;

// ── The five evaluation-type categories the student selects from.
// Sourced from the LLO program description rubric — short label + tooltip
// description (description shown on hover).
const PURPOSE_CATEGORIES = [
  { id: "needs",    label: "Needs assessment",
    desc: "The gap between current conditions and desired outcomes. Answers ‘what is’ v ‘what should be’." },
  { id: "process",  label: "Process evaluation",
    desc: "How a program is operating. Supports decisions about changing or improving program delivery." },
  { id: "outcome",  label: "Outcome evaluation",
    desc: "Whether a program’s goals are being met — short-term results (changes in knowledge, skills, behavior). Supports similar decisions as process evaluation." },
  { id: "impact",   label: "Impact evaluation",
    desc: "Whether long-term, broad changes are happening as a result of a program. Supports high-stakes decisions like continuing or scaling." },
  { id: "economic", label: "Economic evaluation",
    desc: "Assessment of costs associated with a need or a program. Supports decisions about cost effectiveness and cost-benefit analysis." },
];

// ── Default content (LLO-program-flavored placeholders the student can replace)
const DEFAULTS = {
  purposeCategories: [],   // student selects
  purposeSentence: "",
  users: ["", "", ""],
  uses:  ["", "", ""],
  aim:        "",
  ultimately: "",
};

// ── Persisted-state hook ───────────────────────────────────────────────
// One row per variation key so each artboard remembers its own edits.
function useWorksheetState(variantKey) {
  const storageKey = `ws.evalPurpose.${variantKey}`;
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (_) {}
    return DEFAULTS;
  });
  const set = useCallback((patch) => {
    setState(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, [storageKey]);
  // also a setter for array entries
  const setArr = useCallback((field, idx, value) => {
    set(prev => {
      const arr = [...prev[field]]; arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  }, [set]);
  return [state, set, setArr];
}

// ── Editable pieces ────────────────────────────────────────────────────
// contentEditable spans that fire onChange on blur — keeps caret stable
// during typing (vs. controlled re-render on every keystroke).

function Editable({ value, onChange, className, placeholder, style, tag = "span", multiline = false }) {
  const ref = useRef(null);

  // Push value in only when it changed from the outside (e.g. reset).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.textContent !== value) el.textContent = value || "";
  }, [value]);

  const onInput = (e) => {
    // Don't re-set textContent on every keystroke — would jump caret to end.
    // Just forward the raw text upward; parent will store it.
    onChange(e.currentTarget.textContent);
  };

  const onKeyDown = (e) => {
    if (!multiline && e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
  };

  const Tag = tag;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={onInput}
      onKeyDown={onKeyDown}
      className={className}
      style={style}
      data-placeholder={placeholder}
    />
  );
}

function Chip({ value, onChange, placeholder = "type…", style }) {
  return <Editable value={value} onChange={onChange} className="chip" placeholder={placeholder} style={style} />;
}

function Blank({ value, onChange, placeholder = "fill in…", minWidth = 240, style }) {
  return <Editable value={value} onChange={onChange} className="blank" placeholder={placeholder}
                   style={{ minWidth, ...style }} />;
}

// ── Editable list of free-text chips with add/remove ──────────────────
// Wraps each chip in a hover-revealed × button and appends a dashed "+ Add"
// pill at the end. `minItems` (default 1) keeps the list from emptying out.
// `variant` ("default" | "compact") scales the add-button + remove-button.

function EditableChipList({
  items, onChange,
  placeholder = (i) => `item ${i + 1}`,
  chipStyle, addLabel = "Add",
  minItems = 1, maxItems = 8,
  variant = "default",
}) {
  const compact = variant === "compact";
  const update = (i, v) => onChange(items.map((x, idx) => idx === i ? v : x));
  const remove = (i)    => onChange(items.filter((_, idx) => idx !== i));
  const add    = ()     => onChange([...items, ""]);
  return (
    <div className={"chip-list" + (compact ? " chip-list--compact" : "")}>
      {items.map((v, i) => (
        <span key={i} className="chip-wrap">
          <Chip value={v} placeholder={placeholder(i)} style={chipStyle}
                onChange={(x) => update(i, x)} />
          {items.length > minItems && (
            <button type="button" className={"chip-remove" + (compact ? " chip-remove--compact" : "")}
                    onClick={() => remove(i)}
                    aria-label={`Remove ${v || "item"}`}
                    title="Remove">
              <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
                <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      ))}
      {items.length < maxItems && (
        <button type="button" className={"chip-add" + (compact ? " chip-add--compact" : "")}
                onClick={add} title="Add a new item">
          <span className="chip-add__plus" aria-hidden="true">+</span>
          <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
}


// Click a chip to toggle. Active chips fill with Vanderbilt gold; inactive
// chips are outlined. Hover reveals the description in a tooltip card.
// `variant` controls visual scale: "default" (slide) | "compact" (letter).

function CategoryGroup({ selected, onToggle, variant = "default" }) {
  const compact = variant === "compact";
  return (
    <div className={"cat-group" + (compact ? " cat-group--compact" : "")}>
      {PURPOSE_CATEGORIES.map(cat => {
        const active = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            className={"cat-chip" + (active ? " is-active" : "") + (compact ? " cat-chip--compact" : "")}
            aria-pressed={active}
            onClick={() => onToggle(cat.id)}
            title={cat.desc}
          >
            <span className="cat-chip__dot" aria-hidden="true"></span>
            <span className="cat-chip__label">{cat.label}</span>
            <span className="cat-chip__tip" role="tooltip">{cat.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Script loader (lazy CDN deps for export) ──────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── Export helpers ─────────────────────────────────────────────────────

async function captureCanvas(el) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  // Wait for all webfonts to finish loading before capture
  await document.fonts.ready;
  return window.html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    width: 1920,
    height: 1080,
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1920,
    windowHeight: 1080,
    onclone: (_doc, clonedEl) => {
      // The real #slide-frame has a translate+scale transform applied for
      // fit-to-viewport. Strip it in the clone so html2canvas sees the element
      // at its native 1920×1080 size with no transform interference.
      const frame = clonedEl.closest
        ? clonedEl.closest("#slide-frame") || _doc.getElementById("slide-frame")
        : _doc.getElementById("slide-frame");
      if (frame) {
        frame.style.transform = "none";
        frame.style.position = "relative";
      }
    },
  });
}

async function exportPDF(target) {
  const canvas = await captureCanvas(target);
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { jsPDF } = window.jspdf;
  // Landscape page sized exactly to the 16:9 artboard (508×285.75mm)
  const W_MM = 508, H_MM = 285.75;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [W_MM, H_MM] });
  // PNG preserves sharp text better than JPEG for type-heavy layouts
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, W_MM, H_MM);
  pdf.save("persona-profile.pdf");
}

async function exportPPT(target) {
  const canvas = await captureCanvas(target);
  const dataUrl = canvas.toDataURL("image/png");
  await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  const pptx = new window.PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  const slide = pptx.addSlide();
  slide.addImage({ data: dataUrl, x: 0, y: 0, w: "100%", h: "100%" });
  await pptx.writeFile({ fileName: "persona-profile.pptx" });
}

async function exportPNG(target) {
  const canvas = await captureCanvas(target);
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "persona-profile.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Export menu button ─────────────────────────────────────────────────
// Replaces the single PDF button with a compact three-option dropdown.

function ExportButton({ getTarget, pageClass = "print-slide" }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const run = async (key, fn) => {
    setOpen(false);
    setBusy(key);
    try { await fn(); } catch(e) { console.error("Export failed:", e); }
    setBusy(null);
  };

  const target = () => getTarget();

  const menuStyle = {
    position: "absolute", top: "calc(100% + 8px)", right: 0,
    background: "#1C1C1C", borderRadius: 12,
    border: "1px solid rgba(245,243,239,0.14)",
    boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
    overflow: "hidden", minWidth: 160, zIndex: 100,
  };
  const itemStyle = {
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", padding: "11px 16px",
    background: "none", border: "none", cursor: "pointer",
    color: "#F5F3EF", fontFamily: "var(--sans)", fontSize: 13,
    fontWeight: 600, letterSpacing: "0.01em", textAlign: "left",
    transition: "background 0.12s",
  };
  const dividerStyle = { height: 1, background: "rgba(245,243,239,0.1)", margin: "0 12px" };

  return (
    <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        className="ws-export"
        onClick={() => setOpen(o => !o)}
        title="Export worksheet"
        style={{ gap: 8 }}
      >
        {busy ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" strokeDasharray="20 12" strokeDashoffset="0">
              <animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur="0.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v8M5 7l3 3 3-3"/><path d="M3 12h10"/>
          </svg>
        )}
        {busy ? `Exporting ${busy}…` : "Export"}
        {!busy && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3.5 5 6.5 8 3.5"/>
          </svg>
        )}
      </button>

      {open && (
        <div style={menuStyle}>
          <button
            style={itemStyle}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,243,239,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            onClick={() => run("PDF", () => exportPDF(target(), pageClass))}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 3h8v4H4z"/><path d="M4 11h8v3H4z"/><path d="M2 7h12v4H2z"/>
              <circle cx="11.5" cy="9" r=".6" fill="currentColor" stroke="none"/>
            </svg>
            PDF
          </button>
          <div style={dividerStyle} />
          <button
            style={itemStyle}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,243,239,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            onClick={() => run("PPT", () => exportPPT(target()))}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="12" height="10" rx="2"/>
              <path d="M6 7h2.5a1.5 1.5 0 0 1 0 3H6V7z"/>
            </svg>
            PowerPoint
          </button>
          <div style={dividerStyle} />
          <button
            style={itemStyle}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,243,239,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            onClick={() => run("PNG", () => exportPNG(target()))}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="12" height="12" rx="2"/>
              <circle cx="5.5" cy="5.5" r="1.2"/><path d="M2 11l3.5-3.5 2.5 2 2-2 3 3"/>
            </svg>
            PNG
          </button>
        </div>
      )}
    </div>
  );
}

// ── Footer copy (operating principles — fixed text from the original) ──
const OPERATING_PRINCIPLES_HTML = (
  <>
    Consider establishing <b>operating principles</b> to guide the evaluation.
    The principle of <b>utility</b> ensures that the evaluation prioritizes findings that
    can directly guide next steps and that the evaluation sponsors are ready and willing to
    champion the evaluation process. <b>Feasibility</b> ensures that the evaluation can be
    completed within a reasonable timeframe and that appropriate resources are available
    (or can be made available). Other principles may be agreed upon with stakeholders.
  </>
);

const INTRO_COPY = "The evaluation purpose is a brief paragraph that sets the frame for everything that is to come. This template helps to clearly articulate the goals, users, and intended outcomes of the evaluation. It helps us ‘keep the end in mind’ by encouraging thoughtful consideration of how evaluation results will be applied and what specific actions or decisions they will inform.";

window.WSCore = {
  DEFAULTS,
  PURPOSE_CATEGORIES,
  useWorksheetState,
  Editable, Chip, Blank, CategoryGroup, EditableChipList,
  ExportButton,
  OPERATING_PRINCIPLES_HTML,
  INTRO_COPY,
};
