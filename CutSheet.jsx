import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const EMPTY_PROJECT = { name: "", county: "", state: "", type: "", mw: "", yield: "", ptoDate: "", utility: "", tariff: "", energyValue: "", srecEligible: "No", srecValue: "" };

const C = {
  bg: "#ffffff", bgLight: "#f5f7fb", bgMid: "#edf0f7",
  navy: "#1a3a6b", navyLight: "#2a5298", navyAccent: "#4a7fd4",
  text: "#111827", textMid: "#374151", textLight: "#6b7280",
  border: "#d1d9e6", borderLight: "#e8edf5",
  rowAlt: "#f8f9fd", totalBg: "#eef2fb",
};

export default function CutSheetForm() {
  const [mode, setMode] = useState("edit");
  const [portfolio, setPortfolio] = useState({ developerName: "", portfolioName: "", territory: "", state: "", date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
  const [projects, setProjects] = useState([{ ...EMPTY_PROJECT }, { ...EMPTY_PROJECT }]);
  const [offtake, setOfftake] = useState({ structure: "", counterparty: "", counterpartyCredit: "", term: "", startYear: "", endYear: "", priceFormula: "", notes: "" });
  const [deal, setDeal] = useState({ ask: "", epcIncluded: "", timeline: "", targetClose: "", contactName: "", contactEmail: "", contactPhone: "", additionalNotes: "" });

  const addProject = () => setProjects([...projects, { ...EMPTY_PROJECT }]);
  const removeProject = (i) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i, field, val) => { const u = [...projects]; u[i][field] = val; setProjects(u); };
  const totalMW = projects.reduce((sum, p) => sum + (parseFloat(p.mw) || 0), 0).toFixed(2);

  const inp = { background: C.bgLight, border: `1px solid ${C.border}`, color: C.text, padding: "7px 10px", fontSize: "13px", fontFamily: "Georgia, serif", width: "100%", outline: "none", borderRadius: "2px" };
  const lbl = { fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.navyLight, fontFamily: "Georgia, serif", fontWeight: "600", marginBottom: "5px", display: "block" };
  const sec = { fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.navy, fontFamily: "Georgia, serif", fontWeight: "700", borderBottom: `2px solid ${C.navyAccent}`, paddingBottom: "8px", marginBottom: "18px", marginTop: "32px" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Georgia, serif" }}>

      {/* Header + Nav */}
      <div style={{ background: C.navy, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(26,58,107,0.15)" }}>
        <div style={{ padding: "14px 40px", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.5px" }}>OneBig.Energy</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {[["Edit", "edit"], ["Preview", "preview"]].map(([label, m]) => (
              <button key={m} onClick={() => setMode(m)} style={{ background: mode === m ? "#ffffff" : "transparent", border: "1px solid rgba(255,255,255,0.3)", color: mode === m ? C.navy : "#ffffff", padding: "6px 18px", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "600", cursor: "pointer", borderRadius: "2px" }}>{label}</button>
            ))}
            <button onClick={() => window.print()} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)", padding: "6px 18px", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>Print / PDF</button>
          </div>
        </div>
        <div style={{ padding: "0 40px", display: "flex" }}>
          {[["Hold or Sell", "/", false], ["Cut Sheet", "/cutsheet", true], ["Valuation", "/valuation", false], ["Structure Selector", "/structure", false]].map(([label, href, active]) => (
            <Link key={label} to={href} style={{ padding: "10px 20px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: active ? "700" : "400", color: active ? "#ffffff" : "rgba(255,255,255,0.45)", textDecoration: "none", borderBottom: active ? "2px solid #4a7fd4" : "2px solid transparent" }}>{label}</Link>
          ))}
        </div>
      </div>

      {mode === "edit" ? (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 28px" }}>

          <div style={sec}>Portfolio Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[["Developer / Sponsor", "developerName"], ["Portfolio Name", "portfolioName"], ["Territory / Market", "territory"]].map(([label, field]) => (
              <div key={field}><label style={lbl}>{label}</label><input style={inp} value={portfolio[field]} onChange={e => setPortfolio({ ...portfolio, [field]: e.target.value })} /></div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
            {[["State(s)", "state"], ["Date", "date"]].map(([label, field]) => (
              <div key={field}><label style={lbl}>{label}</label><input style={inp} value={portfolio[field]} onChange={e => setPortfolio({ ...portfolio, [field]: e.target.value })} /></div>
            ))}
            <div><label style={lbl}>Total MW</label><div style={{ ...inp, color: C.navyLight, background: C.bgMid }}>{totalMW} MW</div></div>
            <div><label style={lbl}># Assets</label><div style={{ ...inp, color: C.navyLight, background: C.bgMid }}>{projects.length} assets</div></div>
          </div>

          <div style={sec}>Individual Projects</div>
          <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: "3px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: C.navy }}>
                  {["Project Name", "County", "ST", "Type", "MW", "Yield kWh/kWp", "PTO Date", "Utility", "Tariff", "$/MWh", "SREC?", "SREC $/MWh", ""].map(h => (
                    <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: "#9ab5e0", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.rowAlt, borderBottom: `1px solid ${C.borderLight}` }}>
                    {[["name","160px"],["county","80px"],["state","40px"],["type","70px"],["mw","55px"],["yield","75px"],["ptoDate","90px"],["utility","90px"],["tariff","75px"],["energyValue","65px"]].map(([field, width]) => (
                      <td key={field} style={{ padding: "4px 3px" }}>
                        <input style={{ ...inp, padding: "5px 6px", width, minWidth: "36px" }} value={p[field]} onChange={e => updateProject(i, field, e.target.value)} />
                      </td>
                    ))}
                    <td style={{ padding: "4px 3px" }}><select style={{ ...inp, padding: "5px 6px", width: "58px" }} value={p.srecEligible} onChange={e => updateProject(i, "srecEligible", e.target.value)}><option>Yes</option><option>No</option></select></td>
                    <td style={{ padding: "4px 3px" }}><input style={{ ...inp, padding: "5px 6px", width: "65px" }} value={p.srecValue} onChange={e => updateProject(i, "srecValue", e.target.value)} /></td>
                    <td style={{ padding: "4px 8px" }}><button onClick={() => removeProject(i)} style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: "16px" }}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addProject} style={{ marginTop: "10px", background: C.bgLight, border: `1px solid ${C.border}`, color: C.navyLight, padding: "7px 18px", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "600", cursor: "pointer", borderRadius: "2px" }}>+ Add Project</button>

          <div style={sec}>Offtake & Revenue</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[["Offtake Structure", "structure", ["PPA — Fixed Price","PPA — Escalating","Community Solar","Merchant","TB2 Hedge","Net Metering","Other"]],["Counterparty","counterparty",null],["Counterparty Credit","counterpartyCredit",["Investment Grade","Sub-Investment Grade","Municipal / Government","Unrated","Unknown"]]].map(([label, field, options]) => (
              <div key={field}><label style={lbl}>{label}</label>
                {options ? <select style={inp} value={offtake[field]} onChange={e => setOfftake({ ...offtake, [field]: e.target.value })}><option value="">Select...</option>{options.map(o => <option key={o}>{o}</option>)}</select>
                  : <input style={inp} value={offtake[field]} onChange={e => setOfftake({ ...offtake, [field]: e.target.value })} />}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[["Contract Term (yrs)","term"],["Start Year","startYear"],["End Year","endYear"],["Price / Formula","priceFormula"]].map(([label, field]) => (
              <div key={field}><label style={lbl}>{label}</label><input style={inp} value={offtake[field]} onChange={e => setOfftake({ ...offtake, [field]: e.target.value })} /></div>
            ))}
          </div>
          <div><label style={lbl}>Offtake Notes</label><textarea style={{ ...inp, resize: "vertical", minHeight: "64px" }} value={offtake.notes} onChange={e => setOfftake({ ...offtake, notes: e.target.value })} /></div>

          <div style={sec}>Deal Structure & Ask</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div><label style={lbl}>What Are You Seeking?</label>
              <select style={inp} value={deal.ask} onChange={e => setDeal({ ...deal, ask: e.target.value })}>
                <option value="">Select...</option>
                {["Sell Project(s) Outright","Sell Tax Credits Only","Tax Equity Partnership","Tax Equity + Construction Debt","Sale-Leaseback","Inverted Lease","Open to Structure"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>EPC Included in Sale?</label>
              <select style={inp} value={deal.epcIncluded} onChange={e => setDeal({ ...deal, epcIncluded: e.target.value })}>
                <option value="">Select...</option>
                {["Yes — Turnkey including EPC","No — Buyer sources own EPC","Negotiable","Project already operating"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div><label style={lbl}>Development Stage</label>
              <select style={inp} value={deal.timeline} onChange={e => setDeal({ ...deal, timeline: e.target.value })}>
                <option value="">Select...</option>
                {["Operating","Construction","NTP Ready","Permitted — Pre-NTP","Late Development","Early Development","Mixed Portfolio"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Target Close / COD</label><input style={inp} placeholder="e.g. Q3 2025" value={deal.targetClose} onChange={e => setDeal({ ...deal, targetClose: e.target.value })} /></div>
          </div>
          <div><label style={lbl}>Additional Notes (FEOC status, equipment, constraints...)</label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: "80px" }} value={deal.additionalNotes} onChange={e => setDeal({ ...deal, additionalNotes: e.target.value })} />
          </div>

          <div style={sec}>Contact</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[["Name","contactName"],["Email","contactEmail"],["Phone","contactPhone"]].map(([label, field]) => (
              <div key={field}><label style={lbl}>{label}</label><input style={inp} value={deal[field]} onChange={e => setDeal({ ...deal, [field]: e.target.value })} /></div>
            ))}
          </div>
          <div style={{ marginTop: "40px", padding: "16px 20px", background: C.bgLight, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.navyAccent}`, borderRadius: "2px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: C.navyLight }}>Switch to Preview to see the formatted cut sheet. Use Print / PDF to export.</p>
          </div>
        </div>

      ) : (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 52px", color: C.text }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", borderBottom: `3px solid ${C.navy}`, paddingBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: C.navy, letterSpacing: "-0.5px", marginBottom: "6px" }}>{portfolio.portfolioName || "Portfolio Name"}</div>
              <div style={{ fontSize: "14px", color: C.navyLight }}>{[`${totalMW} MW`, `${projects.length} assets`, portfolio.territory, portfolio.state].filter(Boolean).join("  ·  ")}</div>
              {portfolio.developerName && <div style={{ fontSize: "13px", color: C.textMid, marginTop: "4px" }}>{portfolio.developerName}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: C.textLight, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Confidential</div>
              <div style={{ fontSize: "11px", color: C.textLight }}>{portfolio.date}</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "28px", border: `1px solid ${C.border}` }}>
            <thead>
              <tr style={{ background: C.navy }}>
                {["Project Name","County","ST","Type","MW","Yield","PTO Date","Utility","Tariff","$/MWh","SREC","SREC $/MWh"].map(h => (
                  <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: "#9ab5e0", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.rowAlt, borderBottom: `1px solid ${C.borderLight}` }}>
                  {[p.name||"—",p.county||"—",p.state||"—",p.type||"—",p.mw||"—",p.yield||"—",p.ptoDate||"—",p.utility||"—",p.tariff||"—",p.energyValue?`$${p.energyValue}`:"—",p.srecEligible,p.srecValue?`$${p.srecValue}`:"—"].map((val, j) => (
                    <td key={j} style={{ padding: "9px 10px", color: C.textMid, fontSize: "12px" }}>{val}</td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: C.totalBg, borderTop: `2px solid ${C.navyAccent}` }}>
                <td style={{ padding: "9px 10px", fontWeight: "700", color: C.navy, fontSize: "12px" }}>TOTAL</td>
                <td colSpan={3} />
                <td style={{ padding: "9px 10px", fontWeight: "700", color: C.navy, fontSize: "12px" }}>{totalMW} MW</td>
                <td colSpan={7} />
              </tr>
            </tbody>
          </table>

          {(offtake.structure || offtake.counterparty || offtake.notes) && (
            <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.navyAccent}`, padding: "16px 20px", marginBottom: "16px", borderRadius: "2px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.navy, fontWeight: "700", marginBottom: "10px" }}>Offtake</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", fontSize: "12px" }}>
                {[["Structure",offtake.structure],["Counterparty",offtake.counterparty],["Credit",offtake.counterpartyCredit],["Term",offtake.startYear&&offtake.endYear?`${offtake.startYear}–${offtake.endYear}`:offtake.startYear||offtake.endYear||""],["Price / Formula",offtake.priceFormula]].filter(([,v])=>v).map(([label,val])=>(
                  <div key={label}><span style={{ color: C.textLight, fontSize: "10px", display: "block", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span><span style={{ color: C.text }}>{val}</span></div>
                ))}
              </div>
              {offtake.notes && <div style={{ marginTop: "12px", fontSize: "12px", color: C.textMid, lineHeight: "1.6", borderTop: `1px solid ${C.borderLight}`, paddingTop: "10px" }}>{offtake.notes}</div>}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, padding: "16px 20px", borderRadius: "2px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.navy, fontWeight: "700", marginBottom: "12px" }}>Deal Structure</div>
              {[["Seeking",deal.ask],["EPC",deal.epcIncluded],["Stage",deal.timeline],["Target Close",deal.targetClose]].filter(([,v])=>v).map(([label,val])=>(
                <div key={label} style={{ marginBottom: "7px", fontSize: "13px" }}>
                  <span style={{ color: C.textLight, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginRight: "8px" }}>{label}</span>
                  <span style={{ color: C.text }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, padding: "16px 20px", borderRadius: "2px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.navy, fontWeight: "700", marginBottom: "12px" }}>Contact</div>
              {deal.contactName && <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, marginBottom: "5px" }}>{deal.contactName}</div>}
              {deal.contactEmail && <div style={{ fontSize: "13px", color: C.navyLight, marginBottom: "3px" }}>{deal.contactEmail}</div>}
              {deal.contactPhone && <div style={{ fontSize: "13px", color: C.textMid }}>{deal.contactPhone}</div>}
            </div>
          </div>

          {deal.additionalNotes && (
            <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, padding: "16px 20px", marginBottom: "16px", borderRadius: "2px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.navy, fontWeight: "700", marginBottom: "8px" }}>Notes</div>
              <div style={{ fontSize: "12px", color: C.textMid, lineHeight: "1.7" }}>{deal.additionalNotes}</div>
            </div>
          )}

          <div style={{ marginTop: "40px", paddingTop: "16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: "10px", color: C.textLight, letterSpacing: "1px", textTransform: "uppercase" }}>
            <span>Confidential — For Discussion Purposes Only</span>
            <span style={{ color: C.navyAccent }}>onebig.energy</span>
          </div>
        </div>
      )}

      <style>{`
        @media print { div[style*="sticky"] { display: none !important; } }
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #2a5298 !important; }
        select option { background: white; color: #111827; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
