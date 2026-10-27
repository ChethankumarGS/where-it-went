export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: 'groceries', color: '#f5c518' },
  { id: 'vegetables', label: 'Vegetables', icon: 'vegetables', color: '#f5c518' },
  { id: 'fruits', label: 'Fruits', icon: 'fruits', color: '#f5c518' },
  { id: 'milk', label: 'Milk', icon: 'milk', color: '#e5e5ea' },
  { id: 'petrol', label: 'Petrol', icon: 'petrol', color: '#5ad1c2' },
  { id: 'bills', label: 'Bills', icon: 'bills', color: '#f5c518' },
  { id: 'health', label: 'Health', icon: 'health', color: '#ff7a8a' },
  { id: 'repair', label: 'Repair', icon: 'repair', color: '#5ad1c2' },
  { id: 'others', label: 'Others', icon: 'others', color: '#f5c518' },
]
export const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

export const iso = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export function startOfWeek(d) {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

export function seed() {
  const today = new Date()
  const mk = (daysAgo, category, name, amount) => {
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    return { id: crypto.randomUUID(), date: iso(d), category, name, amount }
  }
  return [
    mk(0, 'milk', 'Milk packets', 60),
    mk(0, 'vegetables', 'Tomato, onion', 85),
    mk(1, 'petrol', 'Bike petrol', 420),
    mk(1, 'groceries', 'Rice, dal', 640),
    mk(2, 'bills', 'Phone recharge', 200),
    mk(2, 'fruits', 'Bananas', 70),
    mk(3, 'health', 'Pharmacy', 200),
    mk(3, 'milk', 'Milk packets', 60),
    mk(4, 'vegetables', 'Weekly veggies', 350),
    mk(5, 'groceries', 'Oil, sugar', 685),
    mk(6, 'repair', 'Roof repair', 12500),
    mk(8, 'others', 'Stationery', 265),
    mk(9, 'milk', 'Milk packets', 280),
  ]
}
