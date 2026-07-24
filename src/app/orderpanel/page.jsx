"use client";
import { useState, useEffect } from "react";

// ─── Fonts via Google Fonts import (inline style tag) ───────────────────────
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ─── Color tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f1117",
  sidebar: "#161b27",
  card: "#1c2130",
  cardHover: "#232a3b",
  accent: "#f97316",
  accentSoft: "#f9731618",
  accentMuted: "#f9731640",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  text: "#f1f5f9",
  muted: "#64748b",
  border: "#1e293b",
  headerBg: "#161b27",
};

// ─── Initial menu data ────────────────────────────────────────────────────────
const INITIAL_MENU = [
  // Starters
  { id: 1, name: "Garlic Bread", cat: "Starters", price: 120, emoji: "🍞", ingredients: [{ name: "bread", qty: 1 }, { name: "garlic", qty: 10 }, { name: "butter", qty: 20 }] },
  { id: 2, name: "Soup of Day", cat: "Starters", price: 150, emoji: "🍲", ingredients: [{ name: "stock", qty: 200 }, { name: "veggies", qty: 100 }] },
  { id: 3, name: "Spring Rolls", cat: "Starters", price: 180, emoji: "🥟", ingredients: [{ name: "wrapper", qty: 3 }, { name: "cabbage", qty: 50 }, { name: "carrot", qty: 30 }] },
  { id: 4, name: "Bruschetta", cat: "Starters", price: 160, emoji: "🥖", ingredients: [{ name: "bread", qty: 2 }, { name: "tomato", qty: 50 }, { name: "basil", qty: 5 }] },
  // Breakfast
  { id: 5, name: "Pancake Stack", cat: "Breakfast", price: 200, emoji: "🥞", ingredients: [{ name: "flour", qty: 100 }, { name: "eggs", qty: 2 }, { name: "milk", qty: 150 }, { name: "butter", qty: 15 }] },
  { id: 6, name: "Eggs Benedict", cat: "Breakfast", price: 280, emoji: "🍳", ingredients: [{ name: "eggs", qty: 2 }, { name: "ham", qty: 50 }, { name: "hollandaise", qty: 30 }] },
  { id: 7, name: "Avocado Toast", cat: "Breakfast", price: 220, emoji: "🥑", ingredients: [{ name: "bread", qty: 2 }, { name: "avocado", qty: 1 }, { name: "lemon", qty: 5 }] },
  { id: 8, name: "Full English", cat: "Breakfast", price: 350, emoji: "🍴", ingredients: [{ name: "eggs", qty: 2 }, { name: "sausage", qty: 2 }, { name: "bacon", qty: 3 }, { name: "beans", qty: 100 }] },
  // Lunch
  { id: 9, name: "Grilled Chicken", cat: "Lunch", price: 420, emoji: "🍗", ingredients: [{ name: "chicken", qty: 200 }, { name: "olive oil", qty: 15 }, { name: "herbs", qty: 5 }] },
  { id: 10, name: "Caesar Salad", cat: "Lunch", price: 280, emoji: "🥗", ingredients: [{ name: "lettuce", qty: 100 }, { name: "croutons", qty: 30 }, { name: "parmesan", qty: 20 }, { name: "dressing", qty: 40 }] },
  { id: 11, name: "Margherita Pizza", cat: "Lunch", price: 480, emoji: "🍕", ingredients: [{ name: "pizza base", qty: 1 }, { name: "tomato sauce", qty: 80 }, { name: "mozzarella", qty: 120 }, { name: "basil", qty: 5 }] },
  { id: 12, name: "Club Sandwich", cat: "Lunch", price: 320, emoji: "🥪", ingredients: [{ name: "bread", qty: 3 }, { name: "chicken", qty: 80 }, { name: "lettuce", qty: 20 }, { name: "tomato", qty: 30 }] },
  // Supper
  { id: 13, name: "Grilled Salmon", cat: "Supper", price: 650, emoji: "🐟", ingredients: [{ name: "salmon", qty: 200 }, { name: "lemon", qty: 10 }, { name: "butter", qty: 20 }] },
  { id: 14, name: "Beef Steak", cat: "Supper", price: 900, emoji: "🥩", ingredients: [{ name: "beef", qty: 250 }, { name: "pepper", qty: 5 }, { name: "salt", qty: 3 }] },
  { id: 15, name: "Pasta Alfredo", cat: "Supper", price: 380, emoji: "🍝", ingredients: [{ name: "pasta", qty: 120 }, { name: "cream", qty: 100 }, { name: "parmesan", qty: 40 }, { name: "butter", qty: 20 }] },
  { id: 16, name: "Lamb Chops", cat: "Supper", price: 780, emoji: "🍖", ingredients: [{ name: "lamb", qty: 250 }, { name: "rosemary", qty: 3 }, { name: "garlic", qty: 10 }] },
  // Desserts
  { id: 17, name: "Chocolate Lava", cat: "Deserts", price: 220, emoji: "🍫", ingredients: [{ name: "chocolate", qty: 80 }, { name: "eggs", qty: 2 }, { name: "flour", qty: 30 }, { name: "butter", qty: 40 }] },
  { id: 18, name: "Crème Brûlée", cat: "Deserts", price: 240, emoji: "🍮", ingredients: [{ name: "cream", qty: 150 }, { name: "eggs", qty: 3 }, { name: "sugar", qty: 50 }] },
  { id: 19, name: "Tiramisu", cat: "Deserts", price: 260, emoji: "☕", ingredients: [{ name: "mascarpone", qty: 100 }, { name: "ladyfingers", qty: 6 }, { name: "espresso", qty: 60 }] },
  { id: 20, name: "Ice Cream", cat: "Deserts", price: 150, emoji: "🍨", ingredients: [{ name: "cream", qty: 100 }, { name: "sugar", qty: 40 }] },
  // Beverages
  { id: 21, name: "Fresh Juice", cat: "Beverages", price: 120, emoji: "🍊", ingredients: [{ name: "oranges", qty: 3 }] },
  { id: 22, name: "Cold Coffee", cat: "Beverages", price: 180, emoji: "☕", ingredients: [{ name: "espresso", qty: 60 }, { name: "milk", qty: 150 }, { name: "ice", qty: 100 }] },
  { id: 23, name: "Lemonade", cat: "Beverages", price: 100, emoji: "🍋", ingredients: [{ name: "lemon", qty: 2 }, { name: "sugar", qty: 30 }, { name: "water", qty: 300 }] },
  { id: 24, name: "Masala Chai", cat: "Beverages", price: 80, emoji: "🍵", ingredients: [{ name: "tea leaves", qty: 5 }, { name: "milk", qty: 100 }, { name: "spices", qty: 3 }] },
];

const CATS = ["Starters", "Breakfast", "Lunch", "Supper", "Deserts", "Beverages"];

const SIDEBAR_ITEMS = [
  { id: "pos", icon: "🏠", label: "POS" },
  { id: "orders", icon: "📋", label: "Orders" },
  { id: "inventory", icon: "📦", label: "Inventory" },
  { id: "reports", icon: "📊", label: "Reports" },
  { id: "tables", icon: "🪑", label: "Tables" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

// ─── Utility ─────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toFixed(2)}`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DineEatPOS() {
  const [activeNav, setActiveNav] = useState("pos");
  const [activeCat, setActiveCat] = useState("Lunch");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [inventory, setInventory] = useState([
    { id: 1, name: "chicken", unit: "g", stock: 2000, cost: 0.8, lastUpdated: new Date().toLocaleDateString() },
    { id: 2, name: "flour", unit: "g", stock: 5000, cost: 0.05, lastUpdated: new Date().toLocaleDateString() },
    { id: 3, name: "eggs", unit: "pcs", stock: 48, cost: 8, lastUpdated: new Date().toLocaleDateString() },
    { id: 4, name: "milk", unit: "ml", stock: 3000, cost: 0.06, lastUpdated: new Date().toLocaleDateString() },
    { id: 5, name: "butter", unit: "g", stock: 500, cost: 0.5, lastUpdated: new Date().toLocaleDateString() },
    { id: 6, name: "mozzarella", unit: "g", stock: 1000, cost: 0.9, lastUpdated: new Date().toLocaleDateString() },
    { id: 7, name: "tomato", unit: "g", stock: 2000, cost: 0.1, lastUpdated: new Date().toLocaleDateString() },
    { id: 8, name: "bread", unit: "slices", stock: 60, cost: 5, lastUpdated: new Date().toLocaleDateString() },
    { id: 9, name: "garlic", unit: "g", stock: 500, cost: 0.3, lastUpdated: new Date().toLocaleDateString() },
    { id: 10, name: "cream", unit: "ml", stock: 1000, cost: 0.2, lastUpdated: new Date().toLocaleDateString() },
    { id: 11, name: "pizza base", unit: "pcs", stock: 20, cost: 40, lastUpdated: new Date().toLocaleDateString() },
    { id: 12, name: "tomato sauce", unit: "ml", stock: 2000, cost: 0.1, lastUpdated: new Date().toLocaleDateString() },
    { id: 13, name: "pasta", unit: "g", stock: 2000, cost: 0.2, lastUpdated: new Date().toLocaleDateString() },
    { id: 14, name: "salmon", unit: "g", stock: 1500, cost: 2.5, lastUpdated: new Date().toLocaleDateString() },
    { id: 15, name: "beef", unit: "g", stock: 2000, cost: 2.0, lastUpdated: new Date().toLocaleDateString() },
  ]);
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1001);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  const [showInvModal, setShowInvModal] = useState(false);
  const [invForm, setInvForm] = useState({ name: "", unit: "g", qty: "", cost: "" });
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeItem, setRecipeItem] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("cash");
  const [tableNum, setTableNum] = useState("T-01");
  const [toast, setToast] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", cat: "Starters", price: "", emoji: "🍽️", ingredients: [] });
  const [newIngredient, setNewIngredient] = useState({ name: "", qty: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addToCart = (item) => {
    // Check stock
    for (const ing of item.ingredients) {
      const inv = inventory.find((i) => i.name.toLowerCase() === ing.name.toLowerCase());
      if (inv && inv.stock < ing.qty) {
        showToast(`Low stock: ${ing.name} (only ${inv.stock}${inv.unit} left)`, "error");
        return;
      }
    }
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.emoji} ${item.name} added`, "success");
  };

  const removeFromCart = (id) => setCart((p) => p.filter((c) => c.id !== id));
  const changeQty = (id, delta) => setCart((p) =>
    p.map((c) => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter((c) => c.qty > 0)
  );

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = subtotal * 0.05;
  const discountAmt = subtotal * (discount / 100);
  const payable = subtotal + tax - discountAmt;

  const handleProceed = () => {
    if (cart.length === 0) { showToast("Cart is empty!", "error"); return; }
    setShowPayModal(true);
  };

  const confirmPayment = () => {
    // Deduct inventory
    const updatedInv = [...inventory];
    for (const cartItem of cart) {
      const menuItem = menu.find((m) => m.id === cartItem.id);
      if (!menuItem) continue;
      for (let q = 0; q < cartItem.qty; q++) {
        for (const ing of menuItem.ingredients) {
          const idx = updatedInv.findIndex((i) => i.name.toLowerCase() === ing.name.toLowerCase());
          if (idx !== -1) updatedInv[idx] = { ...updatedInv[idx], stock: Math.max(0, updatedInv[idx].stock - ing.qty) };
        }
      }
    }
    setInventory(updatedInv);
    const order = {
      id: orderCounter,
      table: tableNum,
      items: [...cart],
      subtotal, tax, discount: discountAmt, total: payable,
      payMethod, note,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      status: "Completed",
    };
    setOrders((p) => [order, ...p]);
    setOrderCounter((p) => p + 1);
    setCart([]); setDiscount(0); setCoupon(""); setNote("");
    setShowPayModal(false);
    showToast(`Order #${orderCounter} placed! Inventory updated.`, "success");
  };

  // ── Inventory helpers ─────────────────────────────────────────────────────
  const addInventoryItem = () => {
    if (!invForm.name || !invForm.qty) { showToast("Fill all fields", "error"); return; }
    const existing = inventory.find((i) => i.name.toLowerCase() === invForm.name.toLowerCase());
    if (existing) {
      setInventory((p) => p.map((i) => i.name.toLowerCase() === invForm.name.toLowerCase()
        ? { ...i, stock: i.stock + Number(invForm.qty), cost: Number(invForm.cost) || i.cost, lastUpdated: new Date().toLocaleDateString() }
        : i));
      showToast(`Restocked ${invForm.name} +${invForm.qty}${invForm.unit}`, "success");
    } else {
      setInventory((p) => [...p, { id: Date.now(), name: invForm.name, unit: invForm.unit, stock: Number(invForm.qty), cost: Number(invForm.cost) || 0, lastUpdated: new Date().toLocaleDateString() }]);
      showToast(`Added ${invForm.name} to inventory`, "success");
    }
    setInvForm({ name: "", unit: "g", qty: "", cost: "" });
    setShowInvModal(false);
  };

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price) { showToast("Fill name and price", "error"); return; }
    const item = { ...newProduct, id: Date.now(), price: Number(newProduct.price) };
    setMenu((p) => [...p, item]);
    setNewProduct({ name: "", cat: "Starters", price: "", emoji: "🍽️", ingredients: [] });
    setShowAddProduct(false);
    showToast(`${item.emoji} ${item.name} added to menu`, "success");
  };

  const filtered = menu.filter((m) => {
    const matchCat = m.cat === activeCat;
    const matchSearch = search ? m.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchSearch ? (search ? true : matchCat) : false;
  });

  const lowStock = inventory.filter((i) => i.stock < 100);

  return (
    <>
      <style>{`
        ${FONT_LINK}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { font-family: 'DM Sans', sans-serif; background: ${C.bg}; color: ${C.text}; height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 4px; }
        .syne { font-family: 'Syne', sans-serif; }
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
        .btn-primary { background: ${C.accent}; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; border-radius: 10px; transition: all 0.18s; }
        .btn-primary:hover { background: #ea6a05; transform: translateY(-1px); box-shadow: 0 4px 20px #f9731660; }
        .btn-ghost { background: transparent; border: 1px solid ${C.border}; color: ${C.muted}; cursor: pointer; font-family: 'DM Sans', sans-serif; border-radius: 10px; transition: all 0.18s; }
        .btn-ghost:hover { border-color: ${C.accent}; color: ${C.accent}; }
        .tag-badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? C.red : C.green, color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px #0008", animation: "fadeIn 0.2s ease" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside style={{ width: 80, background: C.sidebar, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 6, borderRight: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 4px 18px ${C.accentMuted}` }}>
            <span style={{ fontSize: 22 }}>🍽️</span>
          </div>
          {SIDEBAR_ITEMS.map((s) => (
            <button key={s.id} onClick={() => setActiveNav(s.id)} title={s.label} style={{ width: 56, height: 56, borderRadius: 14, border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 20, background: activeNav === s.id ? C.accentSoft : "transparent", color: activeNav === s.id ? C.accent : C.muted, transition: "all 0.18s", position: "relative" }}>
              <span>{s.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.3 }}>{s.label}</span>
              {activeNav === s.id && <div style={{ position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)", width: 3, height: 28, background: C.accent, borderRadius: "3px 0 0 3px" }} />}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ width: 38, height: 38, borderRadius: 50, background: "#2d3748", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>👤</div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* ── Header ────────────────────────────────────────────────────── */}
          <header style={{ height: 64, background: C.headerBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
            <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: -0.5, marginRight: 8 }}>DineEat</div>
            {activeNav === "pos" && (
              <>
                <div style={{ flex: 1, maxWidth: 420, position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 16 }}>🔍</span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu..." style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px 9px 36px", color: C.text, fontSize: 14, outline: "none" }} />
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                  {lowStock.length > 0 && <span style={{ background: "#ef444420", color: C.red, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>⚠️ {lowStock.length} low stock</span>}
                  <select value={tableNum} onChange={(e) => setTableNum(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "8px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
                    {["T-01","T-02","T-03","T-04","T-05","T-06","Takeaway","Delivery"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <button className="btn-primary" onClick={() => setShowAddProduct(true)} style={{ padding: "8px 16px", fontSize: 13 }}>+ Add Item</button>
                </div>
              </>
            )}
            {activeNav !== "pos" && (
              <div style={{ marginLeft: "auto", color: C.muted, fontSize: 14 }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            )}
          </header>

          {/* ── Body ──────────────────────────────────────────────────────── */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {activeNav === "pos" && <POSView activeCat={activeCat} setActiveCat={setActiveCat} filtered={filtered} menu={menu} addToCart={addToCart} cart={cart} removeFromCart={removeFromCart} changeQty={changeQty} subtotal={subtotal} tax={tax} payable={payable} discount={discount} setDiscount={setDiscount} coupon={coupon} setCoupon={setCoupon} note={note} setNote={setNote} handleProceed={handleProceed} setCart={setCart} search={search} inventory={inventory} />}
            {activeNav === "inventory" && <InventoryView inventory={inventory} setInventory={setInventory} showToast={showToast} />}
            {activeNav === "orders" && <OrdersView orders={orders} />}
            {activeNav === "reports" && <ReportsView orders={orders} inventory={inventory} />}
            {activeNav === "tables" && <TablesView orders={orders} tableNum={tableNum} setTableNum={setTableNum} setActiveNav={setActiveNav} />}
            {activeNav === "customers" && <CustomersView orders={orders} />}
            {activeNav === "settings" && <SettingsView />}
          </div>
        </div>
      </div>

      {/* ── Pay Modal ─────────────────────────────────────────────────────────── */}
      {showPayModal && (
        <Modal title="Confirm Payment" onClose={() => setShowPayModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: C.card, borderRadius: 12, padding: 16 }}>
              {cart.map((c) => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0", color: C.muted }}><span>{c.emoji} {c.name} x{c.qty}</span><span style={{ color: C.text }}>{fmt(c.price * c.qty)}</span></div>)}
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>Total</span><span style={{ color: C.accent, fontSize: 18 }}>{fmt(payable)}</span></div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Payment Method</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["cash", "card", "upi"].map((m) => (
                  <button key={m} onClick={() => setPayMethod(m)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${payMethod === m ? C.accent : C.border}`, background: payMethod === m ? C.accentSoft : "transparent", color: payMethod === m ? C.accent : C.muted, cursor: "pointer", fontWeight: 600, textTransform: "uppercase", fontSize: 13 }}>
                    {m === "cash" ? "💵" : m === "card" ? "💳" : "📱"} {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setShowPayModal(false)} style={{ flex: 1, padding: "12px 0" }}>Cancel</button>
              <button className="btn-primary" onClick={confirmPayment} style={{ flex: 2, padding: "12px 0", fontSize: 15 }}>Confirm & Place Order</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Add Product Modal ─────────────────────────────────────────────────── */}
      {showAddProduct && (
        <Modal title="Add Menu Item" onClose={() => setShowAddProduct(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <FormInput label="Emoji" value={newProduct.emoji} onChange={(v) => setNewProduct((p) => ({ ...p, emoji: v }))} style={{ width: 80 }} />
              <FormInput label="Item Name" value={newProduct.name} onChange={(v) => setNewProduct((p) => ({ ...p, name: v }))} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Category</div>
                <select value={newProduct.cat} onChange={(e) => setNewProduct((p) => ({ ...p, cat: e.target.value }))} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "9px 12px", outline: "none" }}>
                  {CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <FormInput label="Price (₹)" type="number" value={newProduct.price} onChange={(v) => setNewProduct((p) => ({ ...p, price: v }))} style={{ flex: 1 }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Ingredients (recipe)</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input placeholder="ingredient name" value={newIngredient.name} onChange={(e) => setNewIngredient((p) => ({ ...p, name: e.target.value }))} style={{ flex: 2, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "8px 10px", outline: "none", fontSize: 13 }} />
                <input placeholder="qty" type="number" value={newIngredient.qty} onChange={(e) => setNewIngredient((p) => ({ ...p, qty: e.target.value }))} style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "8px 10px", outline: "none", fontSize: 13 }} />
                <button className="btn-primary" onClick={() => { if (newIngredient.name && newIngredient.qty) { setNewProduct((p) => ({ ...p, ingredients: [...p.ingredients, { name: newIngredient.name, qty: Number(newIngredient.qty) }] })); setNewIngredient({ name: "", qty: "" }); } }} style={{ padding: "8px 14px" }}>+</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {newProduct.ingredients.map((ing, i) => (
                  <span key={i} style={{ background: C.accentSoft, color: C.accent, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{ing.name} {ing.qty}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn-ghost" onClick={() => setShowAddProduct(false)} style={{ flex: 1, padding: "11px 0" }}>Cancel</button>
              <button className="btn-primary" onClick={addNewProduct} style={{ flex: 2, padding: "11px 0" }}>Add to Menu</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── POS View ─────────────────────────────────────────────────────────────────
function POSView({ activeCat, setActiveCat, filtered, addToCart, cart, removeFromCart, changeQty, subtotal, tax, payable, discount, setDiscount, coupon, setCoupon, note, setNote, handleProceed, setCart, search }) {
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Menu Panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "20px 20px 20px 24px" }}>
        {/* Category tabs */}
        {!search && (
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexShrink: 0 }}>
            {["Starters","Breakfast","Lunch","Supper","Deserts","Beverages"].map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "8px 18px", borderRadius: 10, border: `1.5px solid ${activeCat === c ? C.accent : C.border}`, background: activeCat === c ? C.accentSoft : "transparent", color: activeCat === c ? C.accent : C.muted, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.15s" }}>{c}</button>
            ))}
          </div>
        )}
        {/* Grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14, alignContent: "start" }}>
          {filtered.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <div key={item.id} onClick={() => addToCart(item)} className="fade-in" style={{ background: C.card, borderRadius: 16, padding: "16px 14px", cursor: "pointer", border: `1.5px solid ${inCart ? C.accent : "transparent"}`, transition: "all 0.18s", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.transform = "none"; }}>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8, lineHeight: 1 }}>{item.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 13, textAlign: "center", color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ textAlign: "center", color: C.accent, fontWeight: 700, fontSize: 15 }}>{fmt(item.price)}</div>
                {inCart && <div style={{ position: "absolute", top: 8, right: 8, background: C.accent, color: "#fff", width: 22, height: 22, borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{inCart.qty}</div>}
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: C.muted, paddingTop: 60, fontSize: 14 }}>No items found</div>}
        </div>
      </div>

      {/* Cart Panel */}
      <div style={{ width: 320, background: C.sidebar, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "20px 18px", overflow: "hidden" }}>
        <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: C.text }}>🛒 Current Order</div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {cart.length === 0 && <div style={{ textAlign: "center", color: C.muted, paddingTop: 40, fontSize: 13 }}>Add items to begin an order</div>}
          {cart.map((c) => (
            <div key={c.id} className="fade-in" style={{ background: C.card, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</div>
                <div style={{ fontSize: 12, color: C.accent }}>{fmt(c.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => changeQty(c.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>−</button>
                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{c.qty}</span>
                <button onClick={() => changeQty(c.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>+</button>
                <button onClick={() => removeFromCart(c.id)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "#ef444420", color: C.red, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginLeft: 2 }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount / Note */}
        <div style={{ display: "flex", gap: 8, margin: "12px 0 0" }}>
          <input placeholder="Discount %" type="number" value={discount} onChange={(e) => setDiscount(Math.min(100, Number(e.target.value)))} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none" }} />
          <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} style={{ flex: 2, background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none" }} />
        </div>

        {/* Totals */}
        <div style={{ background: C.card, borderRadius: 12, padding: 14, margin: "12px 0", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted }}><span>Subtotal</span><span style={{ color: C.text }}>{fmt(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted }}><span>Tax (5%)</span><span style={{ color: C.text }}>{fmt(tax)}</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted }}><span>Discount ({discount}%)</span><span style={{ color: C.green }}>−{fmt(subtotal * discount / 100)}</span></div>}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}><span>Payable</span><span style={{ color: C.accent, fontSize: 18 }}>{fmt(payable)}</span></div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={() => setCart([])} style={{ flex: 1, padding: "11px 0", fontSize: 13 }}>Clear</button>
          <button className="btn-primary" onClick={handleProceed} style={{ flex: 2, padding: "11px 0", fontSize: 14 }}>⊕ Proceed</button>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory View ──────────────────────────────────────────────────────────
const INV_CATS = ["Vegetables", "Dairy", "Meat & Seafood", "Grains & Flour", "Spices", "Beverages", "Bakery", "Other"];
const UNITS = ["g", "kg", "ml", "l", "pcs", "slices", "cups", "dozen"];

const EMPTY_FORM = { category: "Vegetables", name: "", qty: "", unit: "g" };

function InventoryView({ inventory, setInventory, showToast }) {
  const [stockItems, setStockItems] = useState(inventory);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState("");

  // keep parent inventory in sync
  useEffect(() => { setInventory(stockItems); }, [stockItems]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.qty || isNaN(form.qty) || Number(form.qty) <= 0) e.qty = "Enter a valid quantity";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const nameKey = form.name.trim().toLowerCase();
    const existing = stockItems.find((i) => i.name.toLowerCase() === nameKey && i.category === form.category);
    if (existing) {
      // restock existing item
      setStockItems((p) =>
        p.map((i) =>
          i.id === existing.id
            ? { ...i, stock: i.stock + Number(form.qty), lastUpdated: new Date().toLocaleDateString() }
            : i
        )
      );
      showToast(`Restocked "${form.name}" +${form.qty} ${form.unit}`, "success");
    } else {
      const newItem = {
        id: Date.now(),
        category: form.category,
        name: form.name.trim(),
        stock: Number(form.qty),
        unit: form.unit,
        lastUpdated: new Date().toLocaleDateString(),
      };
      setStockItems((p) => [newItem, ...p]);
      showToast(`"${form.name}" added to inventory`, "success");
    }
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    setStockItems((p) => p.filter((i) => i.id !== id));
    showToast("Item removed", "error");
  };

  const saveEdit = (id) => {
    if (!editQty || isNaN(editQty) || Number(editQty) < 0) return;
    setStockItems((p) => p.map((i) => i.id === id ? { ...i, stock: Number(editQty), lastUpdated: new Date().toLocaleDateString() } : i));
    setEditId(null);
    showToast("Stock updated", "success");
  };

  const allCats = ["All", ...INV_CATS];
  const displayed = stockItems.filter((i) => {
    const matchCat = filterCat === "All" || i.category === filterCat;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // summary counts
  const low = stockItems.filter((i) => i.stock < 100).length;
  const healthy = stockItems.filter((i) => i.stock >= 500).length;
  const medium = stockItems.filter((i) => i.stock >= 100 && i.stock < 500).length;

  const inp = (field) => ({
    value: form[field],
    onChange: (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); setErrors((p) => ({ ...p, [field]: undefined })); },
    style: {
      width: "100%", background: C.bg, border: `1.5px solid ${errors[field] ? C.red : C.border}`,
      color: C.text, borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none",
      fontFamily: "'DM Sans', sans-serif",
    },
  });

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* ── LEFT: Add Stock Form ── */}
      <div style={{ width: 300, background: C.sidebar, borderRight: `1px solid ${C.border}`, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0, overflowY: "auto" }}>
        <div>
          <div className="syne" style={{ fontSize: 17, fontWeight: 800, color: C.text }}>Add Stock</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Fill details to update inventory</div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600, letterSpacing: 0.3 }}>CATEGORY</label>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            style={{ width: "100%", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            {INV_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Food Name */}
        <div>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600, letterSpacing: 0.3 }}>ITEM NAME</label>
          <input placeholder="e.g. Chicken Breast, Flour…" {...inp("name")} />
          {errors.name && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.name}</div>}
        </div>

        {/* Qty + Unit side by side */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600, letterSpacing: 0.3 }}>QUANTITY</label>
            <input type="number" placeholder="0" {...inp("qty")} />
            {errors.qty && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.qty}</div>}
          </div>
          <div style={{ width: 90 }}>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600, letterSpacing: 0.3 }}>UNIT</label>
            <select value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              style={{ width: "100%", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "10px 8px", fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Preview pill */}
        {form.name && form.qty && (
          <div style={{ background: C.accentSoft, border: `1px dashed ${C.accentMuted}`, borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
            <span style={{ color: C.muted }}>Adding: </span>
            <span style={{ color: C.accent, fontWeight: 700 }}>{form.qty} {form.unit}</span>
            <span style={{ color: C.muted }}> of </span>
            <span style={{ color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{form.name}</span>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>📂 {form.category}</div>
          </div>
        )}

        <button className="btn-primary" onClick={handleAdd}
          style={{ padding: "13px 0", fontSize: 14, marginTop: 4, borderRadius: 12 }}>
          + Add to Inventory
        </button>

        {/* Quick stats */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: 0.4 }}>STOCK SUMMARY</div>
          {[
            { label: "Total Items", val: stockItems.length, color: C.accent },
            { label: "Low Stock", val: low, color: C.red },
            { label: "Medium", val: medium, color: C.yellow },
            { label: "Healthy", val: healthy, color: C.green },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: C.muted }}>{s.label}</span>
              <span style={{ color: s.color, fontWeight: 700 }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Stock List ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
          <div>
            <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Stock List</div>
            <div style={{ fontSize: 12, color: C.muted }}>{displayed.length} item{displayed.length !== 1 ? "s" : ""} shown</div>
          </div>
          {/* search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 260 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items…"
              style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "9px 12px 9px 32px", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
        </div>

        {/* Category filter chips */}
        <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
          {allCats.map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${filterCat === c ? C.accent : C.border}`, background: filterCat === c ? C.accentSoft : "transparent", color: filterCat === c ? C.accent : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto", background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr 80px", padding: "11px 18px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", position: "sticky", top: 0, background: C.card, zIndex: 1 }}>
            <span>Item Name</span><span>Category</span><span>Quantity</span><span>Unit</span><span>Status</span><span style={{ textAlign: "center" }}>Action</span>
          </div>

          {/* Empty state */}
          {displayed.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No stock items yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Use the form on the left to add your first item</div>
            </div>
          )}

          {/* Rows */}
          {displayed.map((inv, idx) => {
            const status = inv.stock < 100
              ? { label: "Low", color: C.red }
              : inv.stock < 500
              ? { label: "Medium", color: C.yellow }
              : { label: "Good", color: C.green };
            const isEditing = editId === inv.id;

            return (
              <div key={inv.id} className="fade-in"
                style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr 80px", padding: "12px 18px", borderBottom: `1px solid ${C.border}18`, alignItems: "center", fontSize: 14, background: idx % 2 === 0 ? "transparent" : "#ffffff04" }}>

                <span style={{ fontWeight: 600, color: C.text, textTransform: "capitalize" }}>{inv.name}</span>

                <span>
                  <span style={{ background: C.accentSoft, color: C.accent, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{inv.category}</span>
                </span>

                <span>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} autoFocus
                        style={{ width: 70, background: C.bg, border: `1.5px solid ${C.accent}`, color: C.text, borderRadius: 7, padding: "5px 8px", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
                      <button onClick={() => saveEdit(inv.id)} style={{ background: C.green, border: "none", color: "#fff", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✓</button>
                      <button onClick={() => setEditId(null)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </div>
                  ) : (
                    <span style={{ color: status.color, fontWeight: 700, cursor: "pointer" }} onClick={() => { setEditId(inv.id); setEditQty(String(inv.stock)); }} title="Click to edit">
                      {inv.stock}
                    </span>
                  )}
                </span>

                <span style={{ color: C.muted }}>{inv.unit}</span>

                <span>
                  <span className="tag-badge" style={{ background: `${status.color}20`, color: status.color }}>{status.label}</span>
                </span>

                <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                  <button onClick={() => handleDelete(inv.id)} title="Remove"
                    style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "#ef444420", color: C.red, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Orders View ─────────────────────────────────────────────────────────────
function OrdersView({ orders }) {
  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: C.text }}>Order History</div>
      {orders.length === 0 && <div style={{ textAlign: "center", color: C.muted, paddingTop: 60 }}>No orders yet. Start serving!</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map((o) => (
          <div key={o.id} style={{ background: C.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="syne" style={{ fontWeight: 800, fontSize: 16, color: C.accent }}>#{o.id}</span>
                <span style={{ background: C.accentSoft, color: C.accent, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{o.table}</span>
                <span style={{ background: `${C.green}20`, color: C.green, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{o.status}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: C.accent, fontSize: 18 }}>{fmt(o.total)}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{o.date} · {o.time}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {o.items.map((it, i) => <span key={i} style={{ background: C.bg, color: C.muted, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{it.emoji} {it.name} x{it.qty}</span>)}
            </div>
            {o.note && <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>📝 {o.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────
function ReportsView({ orders, inventory }) {
  const total = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? total / orders.length : 0;
  const topItems = {};
  orders.forEach(o => o.items.forEach(it => { topItems[it.name] = (topItems[it.name] || 0) + it.qty; }));
  const sortedItems = Object.entries(topItems).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: C.text }}>Reports & Analytics</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[{ label: "Total Revenue", val: fmt(total), icon: "💰", color: C.accent }, { label: "Orders Today", val: orders.length, icon: "📋", color: C.green }, { label: "Avg Order", val: fmt(avgOrder), icon: "📊", color: C.yellow }, { label: "Inventory Items", val: inventory.length, icon: "📦", color: "#a78bfa" }].map((s) => (
          <div key={s.label} style={{ background: C.card, borderRadius: 14, padding: "18px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div className="syne" style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>🏆 Top Selling Items</div>
          {sortedItems.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No data yet</div>}
          {sortedItems.map(([name, qty], i) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}10`, fontSize: 14 }}>
              <span style={{ color: C.text }}>{i + 1}. {name}</span>
              <span style={{ color: C.accent, fontWeight: 700 }}>{qty} sold</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div className="syne" style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>⚠️ Low Stock Alerts</div>
          {inventory.filter(i => i.stock < 200).length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>All stock levels healthy</div>}
          {inventory.filter(i => i.stock < 200).map((inv) => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}10`, fontSize: 14 }}>
              <span style={{ color: C.text, textTransform: "capitalize" }}>{inv.name}</span>
              <span style={{ color: inv.stock < 100 ? C.red : C.yellow, fontWeight: 700 }}>{inv.stock} {inv.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tables View ─────────────────────────────────────────────────────────────
function TablesView({ orders, tableNum, setTableNum, setActiveNav }) {
  const tables = ["T-01","T-02","T-03","T-04","T-05","T-06","T-07","T-08","Takeaway","Delivery"];
  const activeOrders = orders.filter(o => o.status === "Completed");
  const occupiedTables = [...new Set(activeOrders.map(o => o.table))];

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: C.text }}>Table Management</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
        {tables.map((t) => {
          const isOccupied = occupiedTables.includes(t);
          const tableOrders = orders.filter(o => o.table === t);
          const tableTotal = tableOrders.reduce((s, o) => s + o.total, 0);
          return (
            <div key={t} onClick={() => { setTableNum(t); setActiveNav("pos"); }} style={{ background: C.card, borderRadius: 16, padding: "20px 16px", cursor: "pointer", border: `2px solid ${t === tableNum ? C.accent : isOccupied ? C.green : C.border}`, textAlign: "center", transition: "all 0.18s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{t.includes("T-") ? "🪑" : t === "Takeaway" ? "🛍️" : "🚚"}</div>
              <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t}</div>
              <span className="tag-badge" style={{ background: isOccupied ? `${C.green}20` : `${C.muted}20`, color: isOccupied ? C.green : C.muted, marginTop: 6, display: "inline-block" }}>{isOccupied ? "Active" : "Free"}</span>
              {tableOrders.length > 0 && <div style={{ fontSize: 12, color: C.accent, marginTop: 4, fontWeight: 700 }}>{tableOrders.length} orders · {fmt(tableTotal)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Customers View ───────────────────────────────────────────────────────────
function CustomersView({ orders }) {
  const customerMap = {};
  orders.forEach((o) => {
    const key = o.table;
    if (!customerMap[key]) customerMap[key] = { table: key, visits: 0, spent: 0 };
    customerMap[key].visits++;
    customerMap[key].spent += o.total;
  });
  const customers = Object.values(customerMap);

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: C.text }}>Customers</div>
      {customers.length === 0 && <div style={{ color: C.muted, textAlign: "center", paddingTop: 60 }}>No customer data yet</div>}
      <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 18px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>
          <span>Table / Source</span><span>Visits</span><span>Total Spent</span>
        </div>
        {customers.map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 18px", borderBottom: `1px solid ${C.border}10`, fontSize: 14, alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: C.text }}>{c.table}</span>
            <span style={{ color: C.muted }}>{c.visits}</span>
            <span style={{ color: C.accent, fontWeight: 700 }}>{fmt(c.spent)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: C.text }}>Settings</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[{ label: "Restaurant Name", val: "DineEat" }, { label: "GST Number", val: "27AADCE0000A1Z5" }, { label: "Tax Rate", val: "5%" }, { label: "Currency", val: "INR (₹)" }, { label: "Address", val: "Mumbai, Maharashtra" }, { label: "Phone", val: "+91 98765 43210" }].map((s) => (
          <div key={s.label} style={{ background: C.card, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontWeight: 600, color: C.text }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.sidebar, borderRadius: 20, padding: 24, width: 480, maxWidth: "90vw", border: `1px solid ${C.border}`, boxShadow: "0 20px 60px #000a", animation: "fadeIn 0.2s ease", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div className="syne" style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text", placeholder = "", style = {} }) {
  return (
    <div style={{ ...style }}>
      {label && <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}</div>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "9px 12px", fontSize: 14, outline: "none" }} />
    </div>
  );
}