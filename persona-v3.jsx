// Variation 3 — "Dossier" · a case-file identity card + ruled field-notes.
// The novel treatment: mono labels, square avatar, hairline rules, and a
// write-on-the-lines input metaphor (instead of chips) so it reads like an
// investigator's empathy notebook. Underlying needs sit in a gold-tinted block.
const PC3 = window.PersonaCore;
const WS3 = window.WSCore;
const { useRef: useRef3 } = React;

const v3 = {
  root: {
    background: "var(--vu-cream)",
    backgroundImage: "linear-gradient(var(--vu-rule) 1px, transparent 1px)",
    backgroundSize: "100% 40px", backgroundPosition: "0 0",
    padding: "44px 60px 30px", display: "flex", flexDirection: "column", gap: 24,
  },
  headRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 },
  title: {
    margin: "8px 0 0", fontFamily: "var(--sans)", fontSize: 50, lineHeight: 0.95,
    letterSpacing: "-0.035em", fontWeight: 700, color: "var(--vu-black)",
  },
  intro: { margin: "12px 0 0", fontSize: 16, lineHeight: 1.45, color: "var(--vu-ink)", maxWidth: 1240 },

  body: { flex: 1, display: "grid", gridTemplateColumns: "470px 1fr", gap: 44, minHeight: 0 },

  // Case-file card
  file: {
    background: "var(--vu-paper)", border: "1.5px solid var(--vu-ink)", borderRadius: 4,
    padding: "0", position: "relative", display: "flex", flexDirection: "column",
    boxShadow: "10px 10px 0 rgba(28,28,28,0.06)", alignSelf: "start",
  },
  fileBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "var(--vu-black)", color: "var(--vu-cream)", padding: "10px 16px",
    fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
  },
  fileBody: { padding: "26px 28px 28px", display: "flex", flexDirection: "column", gap: 20 },
  fileTop: { display: "flex", gap: 22, alignItems: "flex-start" },
  monoLabel: {
    fontFamily: "var(--mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "var(--vu-gold-d)", display: "block", marginBottom: 5,
  },
  nameField: {
    fontFamily: "var(--sans)", fontSize: 33, fontWeight: 700, letterSpacing: "-0.03em",
    lineHeight: 1.0, color: "var(--vu-black)", display: "block",
  },
  roleField: {
    fontFamily: "var(--sans)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em",
    color: "var(--vu-muted)", display: "block",
  },
  quoteField: {
    fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: 22,
    lineHeight: 1.42, color: "var(--vu-ink)", display: "block", letterSpacing: "-0.005em",
    borderLeft: "3px solid var(--vu-gold)", paddingLeft: 16,
  },
  divider: { borderTop: "1px dashed var(--vu-rule)" },

  // Right notes
  notes: { display: "flex", flexDirection: "column", gap: 4 },
  note: { padding: "16px 0 18px", borderTop: "1px solid var(--vu-rule)" },
  noteFirst: { borderTop: "none", paddingTop: 0 },
  noteHead: { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 },
  numDot: {
    width: 30, height: 30, borderRadius: "50%", border: "1.5px solid var(--vu-ink)",
    display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
    fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: "var(--vu-ink)",
    transform: "translateY(4px)",
  },
  nTitle: {
    margin: 0, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 500,
    fontSize: 30, color: "var(--vu-oak)", letterSpacing: "-0.015em", lineHeight: 1.08,
  },
  noteHeadText: { flex: "1 1 auto", minWidth: 0 },
  nLead: { margin: "4px 0 0", fontSize: 14, lineHeight: 1.38, color: "var(--vu-muted)" },

  underBlock: {
    background: "rgba(207,174,112,0.12)", border: "1px solid var(--vu-sand)",
    borderRadius: 12, padding: "18px 22px 20px",
  },
  facetGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 12 },
  facetCol: {},
  facetLabel: {
    fontFamily: "var(--mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "var(--vu-oak)", marginBottom: 8, display: "block",
  },
};

// ── Write-on-the-lines list — each item is an editable underline row with a
// hover-remove, plus an "add line" affordance. Maps the same arrays as chips.
function LineList({ items, onChange, placeholder, dense }) {
  const update = (i, v) => onChange(items.map((x, idx) => idx === i ? v : x));
  const remove = (i)    => onChange(items.filter((_, idx) => idx !== i));
  const add    = ()     => onChange([...items, ""]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: dense ? 6 : 9 }}>
      {items.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <span style={{ color: "var(--vu-gold-d)", fontSize: 16, lineHeight: 1, flex: "0 0 auto", transform: "translateY(-1px)" }}>›</span>
          <WS3.Editable
            value={v} onChange={(x) => update(i, x)} placeholder={placeholder(i)}
            style={{
              flex: 1, borderBottom: "1.5px solid var(--vu-rule)", padding: "3px 4px 6px",
              fontFamily: "var(--sans)", fontSize: dense ? 14.5 : 16, fontWeight: 500,
              color: "var(--vu-ink)", outline: "none", letterSpacing: "-0.005em",
              minHeight: 22, transition: "border-color .14s, background .14s",
            }}
          />
          {items.length > 1 && (
            <button type="button" onClick={() => remove(i)} title="Remove" aria-label="Remove line"
              style={{
                flex: "0 0 auto", width: 20, height: 20, borderRadius: "50%", border: "none",
                background: "transparent", color: "var(--vu-muted)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              }}>
              <svg viewBox="0 0 10 10" width="10" height="10"><path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={add} title="Add a line"
        style={{
          alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7,
          marginTop: 2, padding: "4px 6px", border: "none", background: "transparent",
          color: "var(--vu-oak)", fontFamily: "var(--mono)", fontSize: 11.5, fontWeight: 600,
          letterSpacing: "0.06em", cursor: "pointer", textTransform: "uppercase",
        }}>
        <span style={{ fontSize: 14 }}>+</span> Add line
      </button>
    </div>
  );
}

function PersonaProfileV3() {
  const { state, set, setList, loadExample, clearAll } = PC3.usePersonaState("v3");
  const ref = useRef3(null);
  const F = (props) => <WS3.Editable {...props} />;

  return (
    <div ref={ref} className="ws" style={v3.root}>
      <WS3.ExportButton getTarget={() => ref.current} pageClass="print-slide" />

      <header>
        <PC3.Eyebrow />
        <div style={v3.headRow}>
          <h1 style={v3.title}>User Persona Profile.</h1>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, marginRight: 128 }}>
            <PC3.SampleToggle touched={state.touched} onExample={loadExample} onClear={clearAll} />
            {!state.touched && <PC3.SampleRibbon />}
          </div>
        </div>
        <p style={v3.intro}>{PC3.PERSONA_INTRO}</p>
      </header>

      <div style={v3.body}>
        {/* Case file */}
        <aside style={v3.file}>
          <div style={v3.fileBar}>
            <span>PERSONA FILE</span>
            <span style={{ color: "var(--vu-gold)" }}>No. ___</span>
          </div>
          <div style={v3.fileBody}>
            <div style={v3.fileTop}>
              <PC3.Avatar name={state.name} size={120} shape="square" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={v3.monoLabel}>Name</span>
                <F value={state.name} onChange={(v) => set("name", v)} placeholder="Name the persona" style={v3.nameField} />
                <span style={{ ...v3.monoLabel, marginTop: 14 }}>Role</span>
                <F value={state.role} onChange={(v) => set("role", v)} placeholder="Role or title" style={v3.roleField} />
              </div>
            </div>
            <div style={v3.divider}></div>
            <div>
              <span style={v3.monoLabel}>In their own words</span>
              <F value={state.quote} onChange={(v) => set("quote", v)} multiline tag="div"
                 placeholder="A short quote from the user" style={v3.quoteField} />
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "center", color: "var(--vu-muted)", fontSize: 12, fontWeight: 500, fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="12" height="10" rx="2"/><circle cx="6" cy="7" r="1.4"/><path d="M3 12l3.5-3 2.5 2 2-1.5 2 2.5"/>
              </svg>
              ATTACH PHOTO LATER
            </div>
          </div>
        </aside>

        {/* Field notes */}
        <div style={v3.notes}>
          <section style={{ ...v3.note, ...v3.noteFirst }}>
            <div style={v3.noteHead}>
              <span style={v3.numDot}>1</span>
              <div style={v3.noteHeadText}>
                <h2 style={v3.nTitle}>What they need from the program</h2>
                <p style={v3.nLead}>The practical outcomes and support this user is looking for.</p>
              </div>
            </div>
            <LineList items={state.needs} onChange={(l) => setList("needs", l)} placeholder={(i) => `Need ${i + 1}…`} />
          </section>

          <section style={v3.note}>
            <div style={v3.noteHead}>
              <span style={v3.numDot}>2</span>
              <div style={v3.noteHeadText}>
                <h2 style={v3.nTitle}>Problems they think they have</h2>
                <p style={v3.nLead}>The obstacles as the user sees them — in their own words.</p>
              </div>
            </div>
            <LineList items={state.problems} onChange={(l) => setList("problems", l)} placeholder={(i) => `Perceived problem ${i + 1}…`} />
          </section>

          <section style={v3.note}>
            <div style={v3.noteHead}>
              <span style={v3.numDot}>3</span>
              <div style={v3.noteHeadText}>
                <h2 style={v3.nTitle}>What’s really driving them</h2>
                <p style={v3.nLead}>The deeper interests, motivations, and challenges they may not name themselves.</p>
              </div>
            </div>
            <div style={v3.underBlock}>
              <div style={v3.facetGrid}>
                <div style={v3.facetCol}>
                  <span style={v3.facetLabel}>Interests</span>
                  <LineList dense items={state.interests} onChange={(l) => setList("interests", l)} placeholder={(i) => `Interest ${i + 1}…`} />
                </div>
                <div style={v3.facetCol}>
                  <span style={v3.facetLabel}>Motivations</span>
                  <LineList dense items={state.motivations} onChange={(l) => setList("motivations", l)} placeholder={(i) => `Motivation ${i + 1}…`} />
                </div>
                <div style={v3.facetCol}>
                  <span style={v3.facetLabel}>Challenges</span>
                  <LineList dense items={state.challenges} onChange={(l) => setList("challenges", l)} placeholder={(i) => `Challenge ${i + 1}…`} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

window.PersonaProfileV3 = PersonaProfileV3;
