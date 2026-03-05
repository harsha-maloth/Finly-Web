import { useState, useEffect, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const COLORS = {
  bg: "#0f0f11",
  surface: "#18181c",
  border: "#2a2a30",
  accent: "#c8f55a",
  accentDim: "#9bbd3e",
  income: "#4ade80",
  expense: "#f87171",
  text: "#f0f0f0",
  muted: "#888",
  card: "#1e1e24",
};

const initialUsers = {
  demo: { password: "demo123", transactions: [
    { id: 1, date: "2025-03-15", amount: 3200, type: "Income", category: "Salary", description: "March salary" },
    { id: 2, date: "2025-03-10", amount: 45.50, type: "Expense", category: "Food", description: "Groceries" },
    { id: 3, date: "2025-03-08", amount: 120, type: "Expense", category: "Utilities", description: "Electricity bill" },
    { id: 4, date: "2025-03-05", amount: 500, type: "Income", category: "Freelance", description: "Web project" },
    { id: 5, date: "2025-03-02", amount: 89, type: "Expense", category: "Transport", description: "Monthly bus pass" },
  ], categories: ["Salary","Freelance","Food","Utilities","Transport","Health","Entertainment","Other"], nextId: 6 }
};

function fmt(n) { return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  input, select, textarea { font-family: 'Outfit', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .fade-up-1 { animation: fadeUp 0.4s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.4s 0.1s ease both; }
  .fade-up-3 { animation: fadeUp 0.4s 0.15s ease both; }
  .fade-up-4 { animation: fadeUp 0.4s 0.2s ease both; }
`;
document.head.appendChild(style);

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:32,width:"100%",maxWidth:440,animation:"fadeUp 0.25s ease" }}>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block",fontSize:12,color:COLORS.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase" }}>{label}</label>
      <input {...props} style={{ width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"10px 14px",color:COLORS.text,fontSize:14,outline:"none",transition:"border 0.2s",...props.style }}
        onFocus={e=>e.target.style.borderColor=COLORS.accent}
        onBlur={e=>e.target.style.borderColor=COLORS.border}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block",fontSize:12,color:COLORS.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase" }}>{label}</label>
      <select {...props} style={{ width:"100%",background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"10px 14px",color:COLORS.text,fontSize:14,outline:"none",...props.style }}>
        {children}
      </select>
    </div>
  );
}

function Btn({ children, variant="primary", ...props }) {
  const base = { padding:"10px 20px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:500,transition:"all 0.15s" };
  const variants = {
    primary: { background:COLORS.accent,color:"#0f0f11" },
    ghost: { background:"transparent",color:COLORS.muted,border:`1px solid ${COLORS.border}` },
    danger: { background:"transparent",color:COLORS.expense,border:`1px solid ${COLORS.expense}` },
  };
  return <button {...props} style={{ ...base,...variants[variant],...props.style }}
    onMouseEnter={e=>{ if(variant==="primary") e.target.style.background=COLORS.accentDim; }}
    onMouseLeave={e=>{ if(variant==="primary") e.target.style.background=COLORS.accent; }}
  >{children}</button>;
}

function LoginPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Fill in all fields.");
    if (mode === "login") { const ok = onLogin(username.trim(), password); if (!ok) setError("Wrong username or password."); }
    else { const ok = onRegister(username.trim(), password); if (!ok) setError("Username already taken."); }
  }

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:COLORS.bg,position:"relative",overflow:"hidden" }}>
      {/* Background grid */}
      <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,backgroundSize:"40px 40px",opacity:0.3 }} />
      <div style={{ position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:600,background:`radial-gradient(circle, ${COLORS.accent}15 0%, transparent 70%)`,pointerEvents:"none" }} />

      <div className="fade-up" style={{ position:"relative",background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:20,padding:48,width:"100%",maxWidth:420 }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:42,color:COLORS.accent,lineHeight:1 }}>Finly</div>
          <div style={{ color:COLORS.muted,fontSize:14,marginTop:6 }}>track your money, simply</div>
        </div>

        <div style={{ display:"flex",marginBottom:28,background:COLORS.bg,borderRadius:8,padding:4 }}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1,padding:"8px",border:"none",borderRadius:6,background:mode===m?COLORS.card:"transparent",color:mode===m?COLORS.text:COLORS.muted,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:14,transition:"all 0.2s",textTransform:"capitalize" }}>{m}</button>
          ))}
        </div>

        <Input label="Username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your username" onKeyDown={e=>e.key==="Enter"&&submit()} />
        <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} />

        {error && <div style={{ color:COLORS.expense,fontSize:13,marginBottom:16,padding:"8px 12px",background:`${COLORS.expense}15`,borderRadius:6 }}>{error}</div>}

        <Btn style={{ width:"100%",padding:"12px" }} onClick={submit}>{mode === "login" ? "Sign in" : "Create account"}</Btn>

        <div style={{ textAlign:"center",marginTop:16,fontSize:12,color:COLORS.muted }}>
          Try demo: <span style={{ color:COLORS.accent,cursor:"pointer" }} onClick={()=>{setUsername("demo");setPassword("demo123");}}>demo / demo123</span>
        </div>
      </div>
    </div>
  );
}

function TransactionModal({ tx, categories, onSave, onClose }) {
  const now = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState(tx ? {...tx} : { date:now, amount:"", type:"Expense", category:categories[0]||"Other", description:"" });

  function save() {
    if (!form.date || !form.amount || parseFloat(form.amount) <= 0) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  }

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:24 }}>{tx ? "Edit transaction" : "New transaction"}</h3>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
        <Input label="Date" type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
        <Input label="Amount" type="number" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00" />
      </div>
      <Select label="Type" value={form.type} onChange={e=>set("type",e.target.value)}>
        <option>Income</option>
        <option>Expense</option>
      </Select>
      <Select label="Category" value={form.category} onChange={e=>set("category",e.target.value)}>
        {categories.map(c=><option key={c}>{c}</option>)}
      </Select>
      <Input label="Description" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What was this for?" />
      <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:8 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save}>{tx ? "Save changes" : "Add"}</Btn>
      </div>
    </Modal>
  );
}

function CategoryModal({ categories, onSave, onClose }) {
  const [cats, setCats] = useState([...categories]);
  const [newCat, setNewCat] = useState("");

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:20 }}>Manage categories</h3>
      <div style={{ maxHeight:240,overflowY:"auto",marginBottom:16 }}>
        {cats.filter(c=>c!=="Uncategorized").map(c=>(
          <div key={c} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,marginBottom:4,background:COLORS.bg }}>
            <span style={{ fontSize:14 }}>{c}</span>
            <button onClick={()=>setCats(cats.filter(x=>x!==c))} style={{ background:"none",border:"none",color:COLORS.expense,cursor:"pointer",fontSize:16 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category name"
          onKeyDown={e=>{ if(e.key==="Enter"&&newCat.trim()&&!cats.includes(newCat.trim())){ setCats([...cats,newCat.trim()]);setNewCat(""); }}}
          style={{ flex:1,background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"8px 12px",color:COLORS.text,fontSize:14,outline:"none" }} />
        <Btn onClick={()=>{ if(newCat.trim()&&!cats.includes(newCat.trim())){setCats([...cats,newCat.trim()]);setNewCat("");} }}>Add</Btn>
      </div>
      <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>onSave(cats)}>Save</Btn>
      </div>
    </Modal>
  );
}

function StatCard({ label, value, color, delay="" }) {
  return (
    <div className={`fade-up${delay}`} style={{ background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"20px 24px",flex:1 }}>
      <div style={{ fontSize:11,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:"'DM Mono',monospace",fontSize:26,color,fontWeight:500 }}>₹{fmt(value)}</div>
    </div>
  );
}

function Dashboard({ userData, onUpdate, onLogout, username }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "categories"
  const [editTx, setEditTx] = useState(null);
  const [search, setSearch] = useState("");

  const { transactions, categories, nextId } = userData;

  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear()===year && d.getMonth()===month;
  }).filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  const income = filtered.filter(t=>t.type==="Income").reduce((s,t)=>s+t.amount,0);
  const expense = filtered.filter(t=>t.type==="Expense").reduce((s,t)=>s+t.amount,0);
  const balance = income - expense;

  function prevMonth() { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }
  function nextMonth() { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }

  function addTx(form) {
    onUpdate({ ...userData, transactions:[...transactions,{...form,id:nextId}], nextId:nextId+1 });
    setModal(null);
  }

  function saveTx(form) {
    onUpdate({ ...userData, transactions:transactions.map(t=>t.id===editTx.id?{...form,id:editTx.id}:t) });
    setModal(null); setEditTx(null);
  }

  function deleteTx(id) {
    onUpdate({ ...userData, transactions:transactions.filter(t=>t.id!==id) });
  }

  function saveCats(cats) {
    onUpdate({ ...userData, categories:cats });
    setModal(null);
  }

  // Category breakdown for mini chart
  const catBreakdown = categories.map(cat => ({
    name: cat,
    total: filtered.filter(t=>t.type==="Expense"&&t.category===cat).reduce((s,t)=>s+t.amount,0)
  })).filter(c=>c.total>0).sort((a,b)=>b.total-a.total).slice(0,5);

  const maxCat = catBreakdown[0]?.total || 1;

  return (
    <div style={{ minHeight:"100vh",background:COLORS.bg }}>
      {/* Header */}
      <div style={{ borderBottom:`1px solid ${COLORS.border}`,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,background:COLORS.bg,zIndex:100 }}>
        <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:26,color:COLORS.accent }}>Finly</div>
        <div style={{ display:"flex",alignItems:"center",gap:16 }}>
          <span style={{ fontSize:13,color:COLORS.muted }}>@{username}</span>
          <Btn variant="ghost" style={{ padding:"6px 14px",fontSize:13 }} onClick={onLogout}>Sign out</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"32px 24px" }}>

        {/* Month nav */}
        <div className="fade-up" style={{ display:"flex",alignItems:"center",gap:16,marginBottom:28 }}>
          <button onClick={prevMonth} style={{ background:COLORS.surface,border:`1px solid ${COLORS.border}`,color:COLORS.text,width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18 }}>‹</button>
          <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:28,minWidth:240 }}>{MONTHS[month]} {year}</div>
          <button onClick={nextMonth} style={{ background:COLORS.surface,border:`1px solid ${COLORS.border}`,color:COLORS.text,width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18 }}>›</button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex",gap:16,marginBottom:28,flexWrap:"wrap" }}>
          <StatCard label="Income" value={income} color={COLORS.income} delay="-1" />
          <StatCard label="Expenses" value={expense} color={COLORS.expense} delay="-2" />
          <StatCard label="Balance" value={balance} color={balance>=0?COLORS.accent:COLORS.expense} delay="-3" />
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start" }}>

          {/* Transactions */}
          <div className="fade-up-3" style={{ background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,overflow:"hidden" }}>
            <div style={{ padding:"20px 24px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,flex:1 }}>Transactions</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                style={{ background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"6px 12px",color:COLORS.text,fontSize:13,outline:"none",width:160 }} />
              <Btn style={{ padding:"7px 14px",fontSize:13 }} onClick={()=>setModal("add")}>+ Add</Btn>
              <Btn variant="ghost" style={{ padding:"7px 14px",fontSize:13 }} onClick={()=>setModal("categories")}>Categories</Btn>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding:48,textAlign:"center",color:COLORS.muted,fontSize:14 }}>No transactions this month</div>
            ) : (
              <div>
                {filtered.map((t,i) => (
                  <div key={t.id} style={{ display:"flex",alignItems:"center",padding:"14px 24px",borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s",animation:`fadeUp 0.3s ${i*0.03}s ease both` }}
                    onMouseEnter={e=>e.currentTarget.style.background=COLORS.surface}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ width:36,height:36,borderRadius:8,background:t.type==="Income"?`${COLORS.income}20`:`${COLORS.expense}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginRight:16 }}>
                      {t.type==="Income"?"↑":"↓"}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:14,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.description||t.category}</div>
                      <div style={{ fontSize:12,color:COLORS.muted,marginTop:2 }}>{t.category} · {t.date}</div>
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:15,color:t.type==="Income"?COLORS.income:COLORS.expense,marginRight:16,whiteSpace:"nowrap" }}>
                      {t.type==="Income"?"+":"-"}₹{fmt(t.amount)}
                    </div>
                    <div style={{ display:"flex",gap:6 }}>
                      <button onClick={()=>{setEditTx(t);setModal("edit");}} style={{ background:"none",border:`1px solid ${COLORS.border}`,color:COLORS.muted,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12 }}>Edit</button>
                      <button onClick={()=>deleteTx(t.id)} style={{ background:"none",border:`1px solid ${COLORS.expense}33`,color:COLORS.expense,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:12 }}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {/* Category breakdown */}
            <div className="fade-up-4" style={{ background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:24 }}>
              <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:18,marginBottom:20 }}>Top spending</div>
              {catBreakdown.length === 0 ? (
                <div style={{ color:COLORS.muted,fontSize:13,textAlign:"center",padding:"16px 0" }}>No expenses yet</div>
              ) : catBreakdown.map(c => (
                <div key={c.name} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5 }}>
                    <span>{c.name}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace",color:COLORS.muted,fontSize:12 }}>₹{fmt(c.total)}</span>
                  </div>
                  <div style={{ height:5,background:COLORS.bg,borderRadius:4,overflow:"hidden" }}>
                    <div style={{ height:"100%",width:`${(c.total/maxCat)*100}%`,background:COLORS.accent,borderRadius:4,transition:"width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Savings rate */}
            <div className="fade-up-4" style={{ background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:24 }}>
              <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:18,marginBottom:16 }}>Savings rate</div>
              {income > 0 ? (
                <>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:36,color:balance>=0?COLORS.accent:COLORS.expense }}>
                    {Math.max(0,Math.round((balance/income)*100))}%
                  </div>
                  <div style={{ color:COLORS.muted,fontSize:12,marginTop:4 }}>of income saved this month</div>
                  <div style={{ marginTop:16,height:8,background:COLORS.bg,borderRadius:4,overflow:"hidden" }}>
                    <div style={{ height:"100%",width:`${Math.min(100,Math.max(0,(balance/income)*100))}%`,background:balance>=0?COLORS.accent:COLORS.expense,borderRadius:4,transition:"width 0.6s ease" }} />
                  </div>
                </>
              ) : <div style={{ color:COLORS.muted,fontSize:13 }}>Add income to see your rate</div>}
            </div>
          </div>
        </div>
      </div>

      {modal === "add" && <TransactionModal categories={categories} onSave={addTx} onClose={()=>setModal(null)} />}
      {modal === "edit" && <TransactionModal tx={editTx} categories={categories} onSave={saveTx} onClose={()=>{setModal(null);setEditTx(null);}} />}
      {modal === "categories" && <CategoryModal categories={categories} onSave={saveCats} onClose={()=>setModal(null)} />}
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [loggedIn, setLoggedIn] = useState(null);

  function login(username, password) {
    const u = users[username.toLowerCase()];
    if (u && u.password === password) { setLoggedIn(username.toLowerCase()); return true; }
    return false;
  }

  function register(username, password) {
    const key = username.toLowerCase();
    if (users[key]) return false;
    setUsers(u => ({ ...u, [key]: { password, transactions:[], categories:["Salary","Freelance","Food","Utilities","Transport","Health","Entertainment","Other"], nextId:1 } }));
    setLoggedIn(key);
    return true;
  }

  function updateUserData(data) {
    setUsers(u => ({ ...u, [loggedIn]: { ...u[loggedIn], ...data } }));
  }

  if (!loggedIn) return <LoginPage onLogin={login} onRegister={register} />;

  return <Dashboard userData={users[loggedIn]} onUpdate={updateUserData} onLogout={()=>setLoggedIn(null)} username={loggedIn} />;
}
