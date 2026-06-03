// Variation 2 — "Portrait" · full-bleed dark identity panel left, prompt cards
// right. Editorial contrast: the black panel + gold avatar ring carry the
// brand, prompts become bordered cards with mono tab labels.
const PC2 = window.PersonaCore;
const WS2 = window.WSCore;
const { useRef: useRef2 } = React;

const v2 = {
  root: { background: "var(--vu-paper)", display: "grid", gridTemplateColumns: "568px 1fr" },

  // Dark identity panel
  panel: {
    background: "var(--vu-black)", color: "var(--vu-cream)",
    padding: "52px 52px 44px", display: "flex", flexDirection: "column", gap: 30,
    position: "relative", overflow: "hidden",
  },
  pKicker: {
    fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--vu-gold)",
  },
  pName: {
    fontFamily: "var(--sans)", fontSize: 52, fontWeight: 700, letterSpacing: "-0.035em",
    lineHeight: 0.98, color: "var(--vu-cream)", display: "block",
  },
  pRole: {
    fontFamily: "var(--sans)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em",
    color: "var(--vu-gold)", display: "block", marginTop: 12,
  },
  pQuoteWrap: { borderTop: "1px solid rgba(245,243,239,0.18)", paddingTop: 26, position: "relative" },
  pQuoteMark: {
    fontFamily: "var(--serif)", fontSize: 92, lineHeight: 0.35, color: "rgba(207,174,112,0.5)",
    display: "block", height: 34, userSelect: "none",
  },
  pQuote: {
    fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: 28,
    lineHeight: 1.42, color: "#EDE7DB", display: "block", letterSpacing: "-0.01em",
  },
  pFootHint: {
    display: "flex", gap: 9, alignItems: "center", color: "rgba(245,243,239,0.55)",
    fontSize: 12.5, fontWeight: 500,
  },

  // Right side
  right: { padding: "46px 56px 30px", display: "flex", flexDirection: "column", gap: 18, minHeight: 0 },
  headRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 },
  title: {
    margin: "8px 0 0", fontFamily: "var(--sans)", fontSize: 46, lineHeight: 0.96,
    letterSpacing: "-0.035em", fontWeight: 700, color: "var(--vu-black)",
    whiteSpace: "nowrap", flex: "0 0 auto",
  },
  intro: { margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.45, color: "var(--vu-ink)", maxWidth: 1080 },

  cards: { flex: 1, display: "flex", flexDirection: "column", gap: 14, marginTop: 4 },
  card: {
    border: "1px solid var(--vu-rule)", borderRadius: 16, background: "#fff",
    padding: "20px 24px 22px", position: "relative",
  },
  cardHead: { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 },
  tab: {
    fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
    color: "var(--vu-paper)", background: "var(--vu-gold-d)", padding: "4px 9px",
    borderRadius: 6, flex: "0 0 auto",
  },
  cTitle: {
    margin: 0, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 500,
    fontSize: 28, color: "var(--vu-oak)", letterSpacing: "-0.015em", lineHeight: 1.08,
    flex: "1 1 auto", minWidth: 0,
  },
  cLead: { margin: 0, fontSize: 14, lineHeight: 1.4, color: "var(--vu-muted)", maxWidth: 760 },
  facetRow: { display: "grid", gridTemplateColumns: "150px 1fr", gap: 18, alignItems: "start", marginTop: 12 },
  facetLabel: {
    fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "var(--vu-gold-d)", paddingTop: 9,
  },
};

function PersonaProfileV2({ mode = "example" }) {
  const startBlank = mode === "blank";
  const { state, set, setList, loadExample, clearAll } = PC2.usePersonaState(`v2-${mode}`, { startBlank });
  const ref = useRef2(null);

  return (
    <div ref={ref} className="ws" style={v2.root}>

      {/* Dark identity panel */}
      <aside style={v2.panel}>
        <PC2.Eyebrow dark />
        <PC2.Avatar name={state.name} size={172} variant="dark" />
        <div>
          <div style={v2.pKicker}>The Persona</div>
          <WS2.Editable value={state.name} onChange={(v) => set("name", v)} placeholder="Name the persona"
             className="id-field" style={{ ...v2.pName, marginTop: 10 }} />
          <WS2.Editable value={state.role} onChange={(v) => set("role", v)} placeholder="Role or title" className="id-field" style={v2.pRole} />
        </div>
        <div style={v2.pQuoteWrap}>
          <span style={v2.pQuoteMark}>&ldquo;</span>
          <WS2.Editable value={state.quote} onChange={(v) => set("quote", v)} multiline tag="div"
             className="id-field" placeholder="A short quote, in the user’s own words" style={v2.pQuote} />
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {!state.touched && <PC2.SampleRibbon dark />}
          <div className="export-hide" style={v2.pFootHint}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="12" height="10" rx="2"/><circle cx="6" cy="7" r="1.4"/><path d="M3 12l3.5-3 2.5 2 2-1.5 2 2.5"/>
            </svg>
            Drop in a real photo when you have one.
          </div>
        </div>
      </aside>

      {/* Prompts */}
      <div style={v2.right}>
        <div style={v2.headRow}>
          <h1 style={v2.title}>User Persona Profile.</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <PC2.SampleToggle touched={state.touched} onExample={loadExample} onClear={clearAll} />
            <WS2.ExportButton getTarget={() => ref.current} pageClass="print-slide" />
          </div>
        </div>
        <p style={v2.intro}>{PC2.PERSONA_INTRO}</p>

        <div style={v2.cards}>
          <div style={v2.card}>
            <div style={v2.cardHead}>
              <span style={v2.tab}>NEEDS</span>
              <h2 style={v2.cTitle}>What they need from the program</h2>
            </div>
            <p style={v2.cLead}>The practical outcomes and support this user is looking for.</p>
            <div style={{ marginTop: 14 }}>
              <WS2.EditableChipList items={state.needs} onChange={(l) => setList("needs", l)}
                                    placeholder={(i) => `Need ${i + 1}`} addLabel="Add a need" minItems={1} maxItems={6} />
            </div>
          </div>

          <div style={v2.card}>
            <div style={v2.cardHead}>
              <span style={v2.tab}>PROBLEMS</span>
              <h2 style={v2.cTitle}>Problems they think they have</h2>
            </div>
            <p style={v2.cLead}>The obstacles as the user sees them — in their own words.</p>
            <div style={{ marginTop: 14 }}>
              <WS2.EditableChipList items={state.problems} onChange={(l) => setList("problems", l)}
                                    placeholder={(i) => `Perceived problem ${i + 1}`} addLabel="Add a problem" minItems={1} maxItems={6} />
            </div>
          </div>

          <div style={v2.card}>
            <div style={v2.cardHead}>
              <span style={{ ...v2.tab, background: "var(--vu-black)" }}>UNDERLYING</span>
              <h2 style={v2.cTitle}>What’s really driving them</h2>
            </div>
            <p style={v2.cLead}>The deeper interests, motivations, and challenges they may not name themselves.</p>
            <div style={v2.facetRow}>
              <div style={v2.facetLabel}>Interests</div>
              <WS2.EditableChipList items={state.interests} onChange={(l) => setList("interests", l)}
                                    placeholder={(i) => `Interest ${i + 1}`} addLabel="Add" minItems={1} maxItems={5} />
            </div>
            <div style={v2.facetRow}>
              <div style={v2.facetLabel}>Motivations</div>
              <WS2.EditableChipList items={state.motivations} onChange={(l) => setList("motivations", l)}
                                    placeholder={(i) => `Motivation ${i + 1}`} addLabel="Add" minItems={1} maxItems={5} />
            </div>
            <div style={v2.facetRow}>
              <div style={v2.facetLabel}>Challenges</div>
              <WS2.EditableChipList items={state.challenges} onChange={(l) => setList("challenges", l)}
                                    placeholder={(i) => `Challenge ${i + 1}`} addLabel="Add" minItems={1} maxItems={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PersonaProfileV2 = PersonaProfileV2;
