// Variation 1 — "Profile" · light identity panel left, stacked prompts right.
// The by-the-book treatment: closest to the Pluralistic Program Description's
// vocabulary (gold bar, serif-italic section titles in the margin, chip lists).
const PC1 = window.PersonaCore;
const WS1 = window.WSCore;
const { useRef: useRef1 } = React;

const v1 = {
  root: { background: "var(--vu-paper)", display: "grid", gridTemplateColumns: "16px 1fr" },
  goldBar: { background: "linear-gradient(180deg, var(--vu-gold-d), var(--vu-gold))" },
  inner: { padding: "40px 64px 30px 60px", display: "flex", flexDirection: "column", gap: 20, minHeight: 0 },

  headRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 },
  title: {
    margin: "8px 0 0", fontFamily: "var(--sans)", fontSize: 52, lineHeight: 0.95,
    letterSpacing: "-0.035em", fontWeight: 700, color: "var(--vu-black)",
  },
  intro: { margin: "12px 0 0", maxWidth: 1180, fontSize: 16.5, lineHeight: 1.45, color: "var(--vu-ink)" },

  body: { flex: 1, display: "grid", gridTemplateColumns: "486px 1fr", gap: 40, minHeight: 0 },

  // Identity panel
  idPanel: {
    background: "var(--vu-cream)", border: "1px solid var(--vu-rule)", borderRadius: 20,
    padding: "36px 36px 32px", display: "flex", flexDirection: "column", gap: 20,
    position: "relative",
  },
  idTop: { display: "flex", alignItems: "center", gap: 26 },
  idKicker: {
    fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em",
    textTransform: "uppercase", color: "var(--vu-oak)", marginBottom: 4,
  },
  nameField: {
    fontFamily: "var(--sans)", fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em",
    lineHeight: 1.0, color: "var(--vu-black)", display: "block",
  },
  roleField: {
    fontFamily: "var(--sans)", fontSize: 19, fontWeight: 500, letterSpacing: "-0.01em",
    color: "var(--vu-muted)", display: "block", marginTop: 8,
  },
  quoteWrap: { borderTop: "1px solid var(--vu-rule)", paddingTop: 22, position: "relative" },
  quoteMark: {
    fontFamily: "var(--serif)", fontSize: 80, lineHeight: 0.4, color: "var(--vu-sand)",
    display: "block", height: 30, userSelect: "none",
  },
  quoteField: {
    fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: 25,
    lineHeight: 1.4, color: "var(--vu-ink)", display: "block", letterSpacing: "-0.01em",
  },

  // Right: stacked prompt sections
  prompts: { display: "flex", flexDirection: "column", gap: 0 },
  section: { padding: "20px 0", borderTop: "1px solid var(--vu-rule)" },
  sectionFirst: { borderTop: "none", paddingTop: 0 },
  sHeadRow: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 },
  sNum: {
    fontFamily: "var(--mono)", fontSize: 12.5, fontWeight: 600, color: "var(--vu-gold-d)",
    letterSpacing: "0.06em", whiteSpace: "nowrap", flex: "0 0 auto",
  },
  sTitle: {
    margin: 0, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 500,
    color: "var(--vu-oak)", fontSize: 31, lineHeight: 1.08, letterSpacing: "-0.02em",
    flex: "1 1 auto", minWidth: 0,
  },
  sLead: { margin: "0 0 14px", fontSize: 15, lineHeight: 1.4, color: "var(--vu-muted)" },
  facetLabel: {
    fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "var(--vu-muted)", width: 116, paddingTop: 8, flex: "0 0 auto",
  },
  facetRow: { display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 10 },

  footer: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
    color: "var(--vu-muted)", fontWeight: 600, paddingTop: 14, borderTop: "1px solid var(--vu-rule)",
  },
};

function V1Field({ value, onChange, placeholder, className, style, tag = "span", multiline }) {
  return <WS1.Editable value={value} onChange={onChange} placeholder={placeholder}
                       className={className} style={style} tag={tag} multiline={multiline} />;
}

function V1Section({ num, title, lead, children, first }) {
  return (
    <section style={{ ...v1.section, ...(first ? v1.sectionFirst : {}) }}>
      <div style={v1.sHeadRow}>
        <span style={v1.sNum}>{num}</span>
        <h2 style={v1.sTitle}>{title}</h2>
      </div>
      <p style={v1.sLead}>{lead}</p>
      <div>{children}</div>
    </section>
  );
}

function V1Facet({ label, items, onChange, placeholder }) {
  return (
    <div style={v1.facetRow}>
      <div style={v1.facetLabel}>{label}</div>
      <WS1.EditableChipList items={items} onChange={onChange} placeholder={placeholder}
                            addLabel="Add" minItems={1} maxItems={5} />
    </div>
  );
}

function PersonaProfileV1() {
  const { state, set, setList, loadExample, clearAll } = PC1.usePersonaState("v1");
  const ref = useRef1(null);

  return (
    <div ref={ref} className="ws" style={v1.root}>
      <WS1.ExportButton getTarget={() => ref.current} pageClass="print-slide" />
      <div style={v1.goldBar}></div>

      <div style={v1.inner}>
        <header>
          <PC1.Eyebrow />
          <div style={v1.headRow}>
            <h1 style={v1.title}>User Persona Profile.</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, marginRight: 132 }}>
              <PC1.SampleToggle touched={state.touched} onExample={loadExample} onClear={clearAll} />
              {!state.touched && <PC1.SampleRibbon />}
            </div>
          </div>
          <p style={v1.intro}>{PC1.PERSONA_INTRO}</p>
        </header>

        <div style={v1.body}>
          {/* Identity panel */}
          <aside style={v1.idPanel}>
            <div style={v1.idTop}>
              <PC1.Avatar name={state.name} size={150} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={v1.idKicker}>Persona</div>
                <V1Field value={state.name} onChange={(v) => set("name", v)}
                         placeholder="Name the persona" style={v1.nameField} />
                <V1Field value={state.role} onChange={(v) => set("role", v)}
                         placeholder="Role or title" style={v1.roleField} />
              </div>
            </div>
            <div style={v1.quoteWrap}>
              <span style={v1.quoteMark}>&ldquo;</span>
              <V1Field value={state.quote} onChange={(v) => set("quote", v)} multiline tag="div"
                       placeholder="A short quote, in the user’s own words" style={v1.quoteField} />
            </div>
            <div style={{ marginTop: "auto", display: "flex", gap: 10, alignItems: "center", color: "var(--vu-muted)", fontSize: 12.5, fontWeight: 500 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="12" height="10" rx="2"/><circle cx="6" cy="7" r="1.4"/><path d="M3 12l3.5-3 2.5 2 2-1.5 2 2.5"/>
              </svg>
              Drop in a real photo when you have one.
            </div>
          </aside>

          {/* Prompts */}
          <div style={v1.prompts}>
            <V1Section first num="01 · Surface" title="What they need from the program"
                       lead="The practical outcomes and support this user is looking for.">
              <WS1.EditableChipList items={state.needs} onChange={(l) => setList("needs", l)}
                                    placeholder={(i) => `Need ${i + 1}`} addLabel="Add a need"
                                    minItems={1} maxItems={6} />
            </V1Section>

            <V1Section num="02 · Perceived" title="Problems they think they have"
                       lead="The obstacles as the user sees them — in their own words.">
              <WS1.EditableChipList items={state.problems} onChange={(l) => setList("problems", l)}
                                    placeholder={(i) => `Perceived problem ${i + 1}`} addLabel="Add a problem"
                                    minItems={1} maxItems={6} />
            </V1Section>

            <V1Section num="03 · Underlying" title="What’s really driving them"
                       lead="The deeper interests, motivations, and challenges they may not name themselves.">
              <V1Facet label="Interests" items={state.interests}
                       onChange={(l) => setList("interests", l)} placeholder={(i) => `Interest ${i + 1}`} />
              <V1Facet label="Motivations" items={state.motivations}
                       onChange={(l) => setList("motivations", l)} placeholder={(i) => `Motivation ${i + 1}`} />
              <V1Facet label="Challenges" items={state.challenges}
                       onChange={(l) => setList("challenges", l)} placeholder={(i) => `Challenge ${i + 1}`} />
            </V1Section>
          </div>
        </div>

        <footer style={v1.footer}>
          <span>Program Evaluation Design Portfolio Project</span>
          <span>Persona Profile</span>
        </footer>
      </div>
    </div>
  );
}

window.PersonaProfileV1 = PersonaProfileV1;
