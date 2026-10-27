import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import { CATEGORIES, catOf, iso, inr, seed, startOfWeek } from './data.js'

const KEY = 'kharcha.expenses.v1'
const DKEY = 'kharcha.demo.v1'
const loadDemo = () => { const v = localStorage.getItem(DKEY); return v === null ? !localStorage.getItem(KEY) : v === '1' }
const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed()
}

const monthName = (d) => d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
const short = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export default function App() {
  const [items, setItems] = useState(load)
  const [demo, setDemo] = useState(loadDemo)
  const [tab, setTab] = useState(() => ['home','fill','stats','history'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home')
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [analysing, setAnalysing] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items])
  useEffect(() => localStorage.setItem(DKEY, demo ? '1' : '0'), [demo])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const monthKey = iso(month).slice(0, 7)
  const monthItems = useMemo(() => items.filter((i) => i.date.startsWith(monthKey)), [items, monthKey])
  const total = monthItems.reduce((s, i) => s + i.amount, 0)

  const prevKey = iso(new Date(month.getFullYear(), month.getMonth() - 1, 1)).slice(0, 7)
  const prevTotal = items.filter((i) => i.date.startsWith(prevKey)).reduce((s, i) => s + i.amount, 0)

  const byCat = useMemo(() => {
    const m = {}
    monthItems.forEach((i) => (m[i.category] = (m[i.category] || 0) + i.amount))
    return Object.entries(m)
      .map(([id, amount]) => ({ ...catOf(id), amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthItems])

  const shiftMonth = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))
  const add = (rows) => {
    setItems((prev) => [...rows, ...prev])
    setToast(`${rows.length} saved`)
  }
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const goStats = () => {
    setAnalysing(true)
    setTab('stats')
    setTimeout(() => setAnalysing(false), 1100)
  }
  const nav = (t) => (t === 'stats' ? goStats() : setTab(t))

  return (
    <div className="stage">
      <div className="phone">
        <header className="top">
          <div className="avatar">K</div>
          <div className="brand">
            <span className="brand-k">ಖ</span>harcha
          </div>
          <button className="menu" aria-label="Reset" title="Load sample data" onClick={() => {
            if (confirm('Replace everything with sample data?')) { setItems(seed()); setDemo(true) }
          }}>☰</button>
        </header>

        {demo && (
          <div className="demo" role="status">
            <span><b>Sample data.</b> These entries are made up, not your spending.</span>
            <button onClick={() => { setItems([]); setDemo(false) }}>Start fresh</button>
          </div>
        )}
        <main className="body">
          {tab === 'home' && (
            <Home month={month} shiftMonth={shiftMonth} total={total} prevTotal={prevTotal} byCat={byCat}
              items={items} weekStart={weekStart} setWeekStart={setWeekStart}
              onPick={(id) => { setPreset(id); setTab('fill') }} />
          )}
          {tab === 'fill' && <Fill onAdd={add} onDone={() => setTab('home')} />}
          {tab === 'stats' && (analysing ? <Analysing /> : <Stats monthItems={monthItems} byCat={byCat} total={total} month={month} shiftMonth={shiftMonth} />)}
          {tab === 'history' && <History items={items} remove={remove} />}
        </main>

        {toast && <div className="toast">{toast}</div>}

        <nav className="tabs">
          {[['home', 'home', 'Home'], ['fill', 'fill', 'Fill'], ['stats', 'stats', 'Stats'], ['history', 'history', 'History']].map(([id, ic, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => nav(id)}>
              <span className="ic"><Icon name={ic} size={22} /></span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

let presetCat = null
function setPreset(id) { presetCat = id }

function Home({ month, shiftMonth, total, prevTotal, byCat, items, weekStart, setWeekStart, onPick }) {
  const diff = prevTotal ? Math.round(((total - prevTotal) / prevTotal) * 100) : null
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    const key = iso(d)
    const sum = items.filter((x) => x.date === key).reduce((s, x) => s + x.amount, 0)
    return { d, sum, key }
  })
  const max = Math.max(...days.map((d) => d.sum), 1)
  const wEnd = new Date(weekStart); wEnd.setDate(wEnd.getDate() + 6)
  const shiftWeek = (n) => { const x = new Date(weekStart); x.setDate(x.getDate() + n * 7); setWeekStart(x) }
  const todayKey = iso(new Date())

  return (
    <>
      <section className="row-head">
        <h2>Overview</h2>
        <div className="pager"><button onClick={() => shiftMonth(-1)}>‹</button>{monthName(month)}<button onClick={() => shiftMonth(1)}>›</button></div>
      </section>
      <section className="card glow">
        <div className="total">
          <div>
            <small>Total spent</small>
            <strong>{inr(total)}</strong>
            {diff !== null && (
              <em className={diff > 0 ? 'up' : 'down'}>{Math.abs(diff)}% {diff > 0 ? 'more' : 'less'} than last month</em>
            )}
          </div>
          <ul className="legend">
            {byCat.slice(0, 4).map((c) => (
              <li key={c.id}><i style={{ background: c.color }} />{c.label}<b>{inr(c.amount)}</b></li>
            ))}
            {!byCat.length && <li>No spending yet</li>}
          </ul>
        </div>
      </section>

      <section className="row-head">
        <h2>This Week</h2>
        <div className="pager small"><button onClick={() => shiftWeek(-1)}>‹</button>{short(weekStart)} – {short(wEnd)}<button onClick={() => shiftWeek(1)}>›</button></div>
      </section>
      <section className="card glow">
        <div className="bars">
          {days.map((x) => (
            <div key={x.key} className="bar-col">
              <span className="bar-val">{x.sum ? inr(x.sum) : ''}</span>
              <div className="bar-track">
                <div className={'bar' + (x.key === todayKey ? ' today' : '')} style={{ height: `${(x.sum / max) * 100}%` }} />
              </div>
              <span className="bar-day">{x.d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              <span className="bar-date">{x.d.getDate()}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="row-head"><h2>Add Expenses</h2></section>
      <section className="grid">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat" onClick={() => onPick(c.id)}>
            <span className="cat-ic"><Icon name={c.icon} /></span>
            {c.label}
          </button>
        ))}
      </section>
    </>
  )
}

function Fill({ onAdd, onDone }) {
  const [date, setDate] = useState(iso(new Date()))
  const first = presetCat
  const order = first ? [first, ...CATEGORIES.map((c) => c.id).filter((i) => i !== first)] : CATEGORIES.map((c) => c.id)
  const [rows, setRows] = useState(() => Object.fromEntries(order.map((id) => [id, [{ name: '', amount: '' }]])))
  useEffect(() => { presetCat = null }, [])

  const set = (cat, i, k, v) => setRows((r) => ({ ...r, [cat]: r[cat].map((x, j) => (j === i ? { ...x, [k]: v } : x)) }))
  const more = (cat) => setRows((r) => ({ ...r, [cat]: [...r[cat], { name: '', amount: '' }] }))

  const save = () => {
    const out = []
    order.forEach((cat) => rows[cat].forEach((x) => {
      const amt = parseFloat(x.amount)
      if (amt > 0) out.push({ id: crypto.randomUUID(), date, category: cat, name: x.name.trim() || catOf(cat).label, amount: amt })
    }))
    if (!out.length) return
    onAdd(out)
    onDone()
  }

  return (
    <>
      <section className="row-head">
        <h2>Add Expenses</h2>
        <label className="date"><Icon name="cal" size={16} /><input type="date" value={date} max={iso(new Date())} onChange={(e) => setDate(e.target.value)} /></label>
      </section>
      {order.map((cat) => (
        <section key={cat} className="group">
          <div className="group-head"><span className="gl"><Icon name={catOf(cat).icon} size={18} /> {catOf(cat).label}</span><button onClick={() => more(cat)} aria-label={`Add row to ${catOf(cat).label}`}>+</button></div>
          {rows[cat].map((x, i) => (
            <div key={i} className="inputs">
              <input placeholder="enter name" value={x.name} onChange={(e) => set(cat, i, 'name', e.target.value)} />
              <input placeholder="enter price" inputMode="decimal" value={x.amount} onChange={(e) => set(cat, i, 'amount', e.target.value.replace(/[^0-9.]/g, ''))} />
            </div>
          ))}
        </section>
      ))}
      <button className="save" onClick={save}>Save expenses</button>
    </>
  )
}

function Analysing() {
  return (
    <div className="analysing">
      <div className="spinner" />
      <p>Analysing your expenses...</p>
    </div>
  )
}

function Stats({ monthItems, byCat, total, month, shiftMonth }) {
  const [mode, setMode] = useState('Daily')
  const dim = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const perDay = Array.from({ length: dim }, (_, i) => {
    const key = `${iso(month).slice(0, 7)}-${String(i + 1).padStart(2, '0')}`
    return monthItems.filter((x) => x.date === key).reduce((s, x) => s + x.amount, 0)
  })
  const weeks = [0, 1, 2, 3, 4].map((w) => perDay.slice(w * 7, w * 7 + 7).reduce((a, b) => a + b, 0))
  const series = mode === 'Daily' ? perDay : weeks
  const labels = mode === 'Daily' ? perDay.map((_, i) => i + 1) : weeks.map((_, i) => `W${i + 1}`)
  const max = Math.max(...series, 1)

  const topExpense = [...monthItems].sort((a, b) => b.amount - a.amount)[0]
  const topDayIdx = perDay.indexOf(Math.max(...perDay))
  const top = byCat[0]
  const share = top && total ? Math.round((top.amount / total) * 100) : 0
  const activeDays = perDay.filter(Boolean).length
  const avg = activeDays ? total / activeDays : 0

  return (
    <>
      <section className="row-head">
        <h2>Where did it go?</h2>
        <div className="pager small"><button onClick={() => shiftMonth(-1)}>‹</button>{monthName(month)}<button onClick={() => shiftMonth(1)}>›</button></div>
      </section>
      <section className="card glass">
        {byCat.length ? byCat.map((c) => {
          const pct = Math.round((c.amount / total) * 100)
          return (
            <div key={c.id} className="cat-row">
              <div className="cat-line"><i style={{ background: c.color }} /><span>{c.label}</span><b>{inr(c.amount)}</b></div>
              <div className="meter"><div style={{ width: `${Math.max(pct, 1)}%`, background: c === top ? '#5ad1c2' : '#f5c518' }} /></div>
              <small>{pct}%</small>
            </div>
          )
        }) : <p className="empty">Nothing recorded for this month.</p>}
      </section>

      <section className="row-head"><h2>Spending trend</h2>
        <div className="seg">{['Daily', 'Weekly'].map((m) => <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m}</button>)}</div>
      </section>
      <section className="card">
        <div className="trend">
          {series.map((v, i) => (
            <div key={i} className="t-col" title={`${labels[i]}: ${inr(v)}`}>
              <div className="t-track"><div className={'t-bar' + (v === max && v > 0 ? ' peak' : '')} style={{ height: `${(v / max) * 100}%` }} /></div>
              {(mode === 'Weekly' || i % 5 === 0) && <span>{labels[i]}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="insight">
        <i className="bulb">!</i>
        <div><b>Spending insight</b>
          <p>{top ? `${top.label} accounts for ${share}% of your spending this month. You spent on ${activeDays} day${activeDays === 1 ? '' : 's'}, about ${inr(avg)} on each.` : 'Add some expenses to see insights.'}</p>
        </div>
      </section>
      {top && (
        <div className="facts">
          <div><small>Highest category</small><b>{top.label}</b><span>{inr(top.amount)}</span></div>
          <div><small>Highest expense</small><b>{topExpense.name}</b><span>{inr(topExpense.amount)}</span></div>
          <div><small>Highest spending day</small><b>{topDayIdx + 1} {month.toLocaleDateString('en-IN', { month: 'short' })}</b><span>{inr(perDay[topDayIdx])}</span></div>
        </div>
      )}
    </>
  )
}

function History({ items, remove }) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  const groups = sorted.reduce((m, i) => ((m[i.date] ||= []).push(i), m), {})
  return (
    <>
      <section className="row-head"><h2>History</h2><small className="muted">{items.length} entries</small></section>
      {Object.entries(groups).map(([date, list]) => (
        <section key={date} className="hist-day">
          <div className="hist-head"><span>{short(new Date(date + 'T00:00:00'))}</span><b>{inr(list.reduce((s, x) => s + x.amount, 0))}</b></div>
          {list.map((x) => (
            <div key={x.id} className="hist-row">
              <span className="cat-ic sm"><Icon name={catOf(x.category).icon} size={18} /></span>
              <div><b>{x.name}</b><small>{catOf(x.category).label}</small></div>
              <span className="amt">{inr(x.amount)}</span>
              <button aria-label="Delete" onClick={() => remove(x.id)}>✕</button>
            </div>
          ))}
        </section>
      ))}
      {!items.length && <p className="empty">No entries yet. Add one from Fill.</p>}
    </>
  )
}
