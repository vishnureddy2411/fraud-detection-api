import { useState } from "react"

const API_URL = "/api"

const TRANSACTIONS = [
  {
    id: 1,
    label: "Small everyday purchase",
    context: "$2.69 — Early morning, low value",
    amount: 2.69, hour: 0,
    v1:1.1919,v2:0.2662,v3:0.1665,v4:0.4481,v5:0.0600,v6:-0.0824,
    v7:-0.0788,v8:0.0985,v9:0.1712,v10:-0.4513,v11:-0.2258,v12:-0.1638,
    v13:-0.4395,v14:-0.6391,v15:0.0491,v16:-0.4382,v17:-0.1192,v18:0.0003,
    v19:0.4079,v20:0.0227,v21:0.0606,v22:0.0959,v23:-0.1007,v24:-0.2554,
    v25:0.0426,v26:0.5046,v27:-0.0198,v28:0.0148
  },
  {
    id: 2,
    label: "Grocery store purchase",
    context: "$378.66 — Morning, routine shopping",
    amount: 378.66, hour: 9,
    v1:-1.3584,v2:-1.3402,v3:1.7732,v4:0.3798,v5:-0.5032,v6:1.8005,
    v7:0.7915,v8:0.2477,v9:-1.5146,v10:0.2076,v11:0.6246,v12:0.0662,
    v13:0.7172,v14:-0.1658,v15:2.3458,v16:-2.8902,v17:1.1098,v18:-0.1214,
    v19:-2.2616,v20:0.5249,v21:0.2479,v22:0.7716,v23:0.9094,v24:-0.6893,
    v25:-0.3278,v26:-0.1390,v27:-0.0553,v28:-0.0600
  },
  {
    id: 3,
    label: "Late night online purchase",
    context: "$149.62 — 3am, moderate amount",
    amount: 149.62, hour: 3,
    v1:-1.3598,v2:-0.0728,v3:2.5363,v4:1.3782,v5:-0.3383,v6:0.4624,
    v7:0.2396,v8:0.0987,v9:0.3638,v10:0.0908,v11:-0.5516,v12:-0.6178,
    v13:-0.9914,v14:-0.3111,v15:1.4681,v16:-0.4704,v17:0.2079,v18:0.0258,
    v19:0.4039,v20:0.2514,v21:-0.0183,v22:0.2778,v23:-0.1104,v24:0.0669,
    v25:0.1285,v26:-0.1891,v27:0.1336,v28:-0.0211
  },
  {
    id: 4,
    label: "Suspicious small amount",
    context: "$9.99 — 2am, unusual feature pattern",
    amount: 9.99, hour: 2,
    v1:-2.1122,v2:0.8784,v3:2.4793,v4:1.9783,v5:-3.1951,v6:-1.9626,
    v7:-2.5008,v8:0.8726,v9:-1.8624,v10:-3.2147,v11:2.8474,v12:-3.8735,
    v13:1.1629,v14:-5.8008,v15:0.5285,v16:-3.2654,v17:-3.5234,v18:1.5868,
    v19:0.1967,v20:0.1243,v21:0.4231,v22:-0.1849,v23:0.2097,v24:0.3826,
    v25:0.1812,v26:-0.2479,v27:0.2157,v28:0.0758
  },
  {
    id: 5,
    label: "High value midnight transaction",
    context: "$529.00 — 4am, high risk hour",
    amount: 529.00, hour: 4,
    v1:-1.5821,v2:-0.7692,v3:2.2184,v4:0.4249,v5:-1.2073,v6:0.4061,
    v7:-0.1252,v8:-0.4143,v9:0.6017,v10:-1.0021,v11:1.4088,v12:-2.0612,
    v13:0.8218,v14:-3.9300,v15:0.3518,v16:-1.5328,v17:-1.5654,v18:0.2028,
    v19:0.2540,v20:0.0810,v21:0.3542,v22:-0.1540,v23:0.1791,v24:0.3268,
    v25:0.1524,v26:-0.2267,v27:0.1901,v28:0.0672
  },
  {
    id: 6,
    label: "Large amount abnormal pattern",
    context: "$2125.87 — 1am, extreme feature deviation",
    amount: 2125.87, hour: 1,
    v1:-2.3122,v2:1.9519,v3:-1.6097,v4:3.9979,v5:-0.5222,v6:-1.4265,
    v7:-2.5374,v8:1.3919,v9:-2.7700,v10:-2.7722,v11:3.2020,v12:-2.8992,
    v13:1.2812,v14:-4.7503,v15:0.5583,v16:-3.5011,v17:-3.0000,v18:1.2992,
    v19:-0.1590,v20:0.2127,v21:0.4741,v22:-0.1697,v23:0.2395,v24:0.4173,
    v25:0.1892,v26:-0.2499,v27:0.2320,v28:0.0767
  },
]

const riskColors = {
  LOW:    { bg:"#f0fdf4", border:"#86efac", text:"#166534", bar:"#22c55e", badge:"#dcfce7" },
  MEDIUM: { bg:"#fffbeb", border:"#fcd34d", text:"#92400e", bar:"#f59e0b", badge:"#fef3c7" },
  HIGH:   { bg:"#fef2f2", border:"#fca5a5", text:"#991b1b", bar:"#ef4444", badge:"#fee2e2" },
}

function FlowStep({ label, sub, isArrow }) {
  if (isArrow) {
    return (
      <span style={{ fontSize:"16px", color:"#cbd5e1",
        padding:"0 4px", marginBottom:"1rem" }}>
        &#8594;
      </span>
    )
  }
  return (
    <div style={{ textAlign:"center", padding:"0.5rem 0.75rem",
      marginBottom:"0.5rem", minWidth:"90px" }}>
      <div style={{ fontSize:"13px", fontWeight:600,
        color:"#1e293b", marginBottom:"3px" }}>{label}</div>
      <div style={{ fontSize:"11px", color:"#94a3b8",
        lineHeight:"1.4" }}>{sub}</div>
    </div>
  )
}

export default function App() {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tested, setTested] = useState({})

  const analyse = async (tx) => {
    setSelected(tx)
    setResult(null)
    setError(null)
    setLoading(true)

    const payload = {
      amount: tx.amount, hour: tx.hour,
      v1:tx.v1,v2:tx.v2,v3:tx.v3,v4:tx.v4,v5:tx.v5,v6:tx.v6,
      v7:tx.v7,v8:tx.v8,v9:tx.v9,v10:tx.v10,v11:tx.v11,v12:tx.v12,
      v13:tx.v13,v14:tx.v14,v15:tx.v15,v16:tx.v16,v17:tx.v17,v18:tx.v18,
      v19:tx.v19,v20:tx.v20,v21:tx.v21,v22:tx.v22,v23:tx.v23,v24:tx.v24,
      v25:tx.v25,v26:tx.v26,v27:tx.v27,v28:tx.v28
    }

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResult(data)
      setTested(prev => ({ ...prev, [tx.id]: data }))
    } catch {
      setError("Cannot reach the API. Make sure uvicorn is running on port 8000.")
    } finally {
      setLoading(false)
    }
  }

  const c = result ? (riskColors[result.risk_level] || riskColors.LOW) : null
  const prob = result ? (result.fraud_probability * 100).toFixed(2) : null

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc",
      fontFamily:"Inter, system-ui, sans-serif", color:"#1e293b" }}>

      {/* NAV */}
      <nav style={{ background:"#fff", borderBottom:"1px solid #e2e8f0",
        padding:"0 2rem", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:"56px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"28px", height:"28px", borderRadius:"6px",
            background:"#1d4ed8", display:"flex", alignItems:"center",
            justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:"14px",
              fontWeight:700 }}>F</span>
          </div>
          <span style={{ fontWeight:600, fontSize:"16px" }}>
            Fraud Detection API
          </span>
          <span style={{ fontSize:"11px", padding:"2px 8px",
            borderRadius:"20px", background:"#eff6ff", color:"#1d4ed8",
            border:"1px solid #bfdbfe", fontWeight:500 }}>
            LightGBM v1.0.0
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <span style={{ fontSize:"12px", color:"#94a3b8" }}>
            AUC-ROC: 0.9135
          </span>
          <span style={{ fontSize:"12px", color:"#94a3b8" }}>
            Trained on 284,807 transactions
          </span>
        </div>
      </nav>

      <main style={{ maxWidth:"960px", margin:"0 auto",
        padding:"2rem 1.5rem" }}>

        <h1 style={{ fontSize:"22px", fontWeight:600, margin:"0 0 4px" }}>
          Transaction Analyser
        </h1>
        <p style={{ fontSize:"14px", color:"#64748b", margin:"0 0 1.5rem" }}>
          Real-time credit card fraud detection using LightGBM.
          Select any transaction below to run it through the model.
        </p>

        {/* ARCHITECTURE */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0",
          borderRadius:"12px", padding:"1.25rem", marginBottom:"1rem" }}>
          <p style={{ fontSize:"11px", fontWeight:600, color:"#64748b",
            textTransform:"uppercase", letterSpacing:"0.06em",
            margin:"0 0 1rem" }}>
            Production architecture
          </p>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { label:"Card Transaction", sub:"Customer makes payment", isArrow:false },
              { isArrow:true },
              { label:"Bank System", sub:"Generates 28 PCA features", isArrow:false },
              { isArrow:true },
              { label:"Fraud API", sub:"LightGBM scores transaction", isArrow:false },
              { isArrow:true },
              { label:"Decision", sub:"Approve or decline", isArrow:false },
            ].map((step, i) => <FlowStep key={i} {...step} />)}
          </div>
          <div style={{ background:"#f8fafc", borderRadius:"8px",
            padding:"10px 14px", fontSize:"12px", color:"#64748b",
            borderLeft:"3px solid #3b82f6", marginTop:"0.75rem",
            lineHeight:"1.6" }}>
            <strong style={{ color:"#1e293b" }}>About V1-V28 features:</strong>{" "}
            These 28 features are anonymised using PCA by the bank to protect
            cardholder privacy. In production, the bank system sends them
            automatically with every transaction. This demo uses real transactions
            from the Kaggle credit card fraud dataset (284,807 transactions,
            European cardholders, 2013).
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0",
          borderRadius:"12px", padding:"1.25rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:"1rem" }}>
            <p style={{ fontSize:"11px", fontWeight:600, color:"#64748b",
              textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>
              Sample transactions
            </p>
            <span style={{ fontSize:"12px", color:"#94a3b8" }}>
              {Object.keys(tested).length} of {TRANSACTIONS.length} analysed
            </span>
          </div>

          {/* HEADER */}
          <div style={{ display:"grid",
            gridTemplateColumns:"2.5fr 1fr 1fr 1.5fr",
            padding:"6px 12px", fontSize:"11px", fontWeight:600,
            color:"#94a3b8", textTransform:"uppercase",
            letterSpacing:"0.04em",
            borderBottom:"1px solid #f1f5f9",
            marginBottom:"6px" }}>
            <span>Transaction</span>
            <span>Amount</span>
            <span>Hour</span>
            <span>Result</span>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
            {TRANSACTIONS.map(tx => {
              const isSelected = selected?.id === tx.id
              const txResult = tested[tx.id]
              return (
                <div key={tx.id}
                  onClick={() => !loading && analyse(tx)}
                  style={{
                    display:"grid",
                    gridTemplateColumns:"2.5fr 1fr 1fr 1.5fr",
                    gap:"8px", alignItems:"center",
                    padding:"10px 12px", borderRadius:"8px",
                    cursor: loading ? "wait" : "pointer",
                    border: isSelected
                      ? "1.5px solid #3b82f6"
                      : "1px solid #f1f5f9",
                    background: isSelected ? "#eff6ff" : "#fafafa",
                    transition:"all 0.15s"
                  }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:500,
                      color:"#1e293b" }}>{tx.label}</div>
                    <div style={{ fontSize:"11px", color:"#94a3b8",
                      marginTop:"2px" }}>{tx.context}</div>
                  </div>
                  <div style={{ fontSize:"13px",
                    color:"#475569", fontWeight:500 }}>
                    ${tx.amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize:"13px", color:"#475569" }}>
                    {tx.hour}:00
                  </div>
                  <div>
                    {isSelected && loading ? (
                      <span style={{ fontSize:"12px",
                        color:"#3b82f6" }}>Analysing...</span>
                    ) : txResult ? (
                      <div style={{ display:"flex",
                        flexDirection:"column", gap:"3px" }}>
                        <span style={{
                          fontSize:"11px", padding:"2px 8px",
                          borderRadius:"4px", fontWeight:600,
                          letterSpacing:"0.04em", display:"inline-block",
                          width:"fit-content",
                          background: riskColors[txResult.risk_level]?.badge,
                          color: riskColors[txResult.risk_level]?.text,
                          border:`1px solid ${riskColors[txResult.risk_level]?.border}`
                        }}>
                          {txResult.risk_level} RISK
                        </span>
                        <span style={{ fontSize:"11px",
                          color:"#64748b" }}>
                          {(txResult.fraud_probability * 100).toFixed(2)}% fraud probability
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize:"12px",
                        color:"#3b82f6", fontWeight:500,
                        cursor:"pointer" }}>
                        Analyse
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background:"#fef2f2",
            border:"1px solid #fca5a5", borderRadius:"8px",
            padding:"12px 16px", marginBottom:"1rem",
            fontSize:"13px", color:"#991b1b" }}>
            Error: {error}
          </div>
        )}

        {/* RESULT PANEL */}
        {result && selected && (
          <div style={{ background:c.bg,
            border:`1.5px solid ${c.border}`,
            borderRadius:"12px", padding:"1.25rem" }}>

            <div style={{ display:"flex", alignItems:"flex-start",
              justifyContent:"space-between", marginBottom:"1.25rem" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center",
                  gap:"8px", marginBottom:"6px" }}>
                  <span style={{
                    fontSize:"11px", fontWeight:700,
                    padding:"3px 10px", borderRadius:"4px",
                    letterSpacing:"0.06em",
                    background: result.is_fraud ? "#fee2e2" : "#dcfce7",
                    color: result.is_fraud ? "#991b1b" : "#166534",
                    border:`1px solid ${result.is_fraud ? "#fca5a5" : "#86efac"}`
                  }}>
                    {result.is_fraud ? "FRAUD DETECTED" : "LEGITIMATE"}
                  </span>
                  <span style={{
                    fontSize:"11px", fontWeight:600,
                    padding:"3px 10px", borderRadius:"4px",
                    letterSpacing:"0.06em",
                    background: riskColors[result.risk_level]?.badge,
                    color: riskColors[result.risk_level]?.text,
                    border:`1px solid ${riskColors[result.risk_level]?.border}`
                  }}>
                    {result.risk_level} RISK
                  </span>
                </div>
                <div style={{ fontSize:"16px", fontWeight:600,
                  color:c.text, marginBottom:"3px" }}>
                  {result.is_fraud
                    ? "This transaction shows fraud indicators"
                    : "This transaction appears legitimate"}
                </div>
                <div style={{ fontSize:"12px", color:"#64748b" }}>
                  {selected.label} — {selected.context}
                </div>
              </div>
            </div>

            {/* METRICS */}
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(4, 1fr)",
              gap:"8px", marginBottom:"1.25rem" }}>
              {[
                { label:"Verdict",
                  value: result.is_fraud ? "FRAUD" : "LEGIT" },
                { label:"Fraud probability", value:`${prob}%` },
                { label:"Risk level", value:result.risk_level },
                { label:"Amount",
                  value:`$${selected.amount.toFixed(2)}` },
              ].map(m => (
                <div key={m.label} style={{ background:"#fff",
                  borderRadius:"8px", padding:"10px 12px",
                  border:"1px solid #e2e8f0" }}>
                  <div style={{ fontSize:"11px", color:"#64748b",
                    marginBottom:"4px" }}>{m.label}</div>
                  <div style={{ fontSize:"18px", fontWeight:600,
                    color:c.text }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* PROBABILITY BAR */}
            <div style={{ marginBottom:"1rem" }}>
              <div style={{ display:"flex",
                justifyContent:"space-between",
                fontSize:"12px", color:"#64748b", marginBottom:"6px" }}>
                <span>0% Safe</span>
                <span style={{ fontWeight:500, color:c.text }}>
                  Fraud probability: {prob}%
                </span>
                <span>100% High risk</span>
              </div>
              <div style={{ height:"10px", background:"#e2e8f0",
                borderRadius:"5px", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"5px",
                  background:c.bar,
                  width:`${Math.min(parseFloat(prob),100)}%`,
                  transition:"width 0.7s ease" }} />
              </div>
            </div>

            {/* INTERPRETATION */}
            <div style={{ padding:"10px 14px", background:"#fff",
              borderRadius:"8px", border:"1px solid #e2e8f0",
              fontSize:"12px", color:"#64748b", lineHeight:"1.6" }}>
              <strong style={{ color:"#1e293b" }}>Interpretation:</strong>{" "}
              {result.is_fraud
                ? `The model assigned a fraud probability of ${prob}% to this transaction. The PCA feature values matched patterns associated with fraudulent behaviour in the training data. In a production system, this transaction would be automatically declined or flagged for analyst review.`
                : `The model assigned a fraud probability of ${prob}% to this transaction. The feature values are consistent with legitimate purchasing patterns seen in the training data. In production, this transaction would be approved.`
              }
            </div>
          </div>
        )}
      </main>
    </div>
  )
}