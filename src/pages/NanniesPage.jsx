
import { useEffect, useState, useContext } from "react";
import { db } from "../lib/firebase";
import { get, query, ref, orderByChild, limitToFirst, startAt, limitToLast, endAt } from "firebase/database";
import { AuthContext } from "../App";
import NannyCard from "../components/NannyCard";
import { setFavorites } from "../utils/favorites";

const PAGE_SIZE = 3;

function toArray(obj) {
  return Object.entries(obj || {}).map(([id, v]) => ({ id, ...v }));
}

export default function NanniesPage() {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [lastName, setLastName] = useState(null);
  const [sort, setSort] = useState("name-asc");
  const [price, setPrice] = useState([0, 1000]);
  const [loading, setLoading] = useState(false);

  async function fetchFirst() {
    setLoading(true);
    let q;
    try {
      if (sort === "name-asc") q = query(ref(db, "nannies"), orderByChild("name"), limitToFirst(PAGE_SIZE));
      else if (sort === "name-desc") q = query(ref(db, "nannies"), orderByChild("name"), limitToLast(PAGE_SIZE));
      else if (sort === "price") q = query(ref(db, "nannies"), orderByChild("price_per_hour"), startAt(price[0]), endAt(price[1]), limitToFirst(PAGE_SIZE));
      else if (sort === "rating-asc") q = query(ref(db, "nannies"), orderByChild("rating"), limitToFirst(PAGE_SIZE));
      else if (sort === "rating-desc") q = query(ref(db, "nannies"), orderByChild("rating"), limitToLast(PAGE_SIZE));
      const snap = await get(q);
      let data = toArray(snap.val());
      if (data.length === 0) {
        // Path bos ise root'tan dene (yanlis import edilmis olabilir)
        const rootSnap = await get(ref(db, "/"));
        const rootVal = rootSnap.val();
        const maybe = rootVal?.nannies ?? rootVal;
        data = toArray(maybe);
      }
      setItems(data);
      setLastName(data[data.length - 1]?.name || null);
    } catch (e) {
      // Fallback: index yoksa tüm veriyi al, client-side sırala/filtrele
      const snap = await get(ref(db, "nannies"));
      let data = toArray(snap.val());
      if (sort.startsWith("name")) {
        data.sort((a,b)=> a.name.localeCompare(b.name));
        if (sort === "name-desc") data.reverse();
      } else if (sort === "price") {
        data = data.filter(x=> x.price_per_hour >= price[0] && x.price_per_hour <= price[1]).sort((a,b)=> a.price_per_hour - b.price_per_hour);
      } else if (sort === "rating-asc" || sort === "rating") {
        data.sort((a,b)=> a.rating - b.rating);
      } else if (sort === "rating-desc") {
        data.sort((a,b)=> b.rating - a.rating);
      }
      data = data.slice(0, PAGE_SIZE);
      setItems(data);
      setLastName(data[data.length - 1]?.name || null);
      console.warn('Index not defined in RTDB rules. Using client-side sort as fallback.');
    }
    setLoading(false);
  }

  async function loadMore() {
    if (!lastName) return;
    setLoading(true);
    const q = query(ref(db, "nannies"), orderByChild("name"), startAt(lastName), limitToFirst(PAGE_SIZE + 1));
    const snap = await get(q);
    const data = toArray(snap.val());
    const sliced = data.filter((x, i) => !(i === 0 && x.name === lastName));
    setItems((prev) => [...prev, ...sliced]);
    setLastName(sliced[sliced.length - 1]?.name || null);
    setLoading(false);
  }

  useEffect(() => {
    fetchFirst();
  }, [sort, price]);

  return (
    <section>
      <h2>Nannies</h2>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="price">Price (range)</option>
          <option value="rating-asc">Rating (low→high)</option>
          <option value="rating-desc">Rating (high→low)</option>
        </select>
        {sort === "price" && (
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" value={price[0]} min={0} onChange={(e)=> setPrice([Number(e.target.value), price[1]])} />
            <span>to</span>
            <input type="number" value={price[1]} min={0} onChange={(e)=> setPrice([price[0], Number(e.target.value)])} />
          </div>
        )}
      </div>
      <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
        {items.map((n) => (
          <li key={n.id}>
            <NannyCard nanny={n} onChangeFav={(ids) => setFavorites(ids)} />
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>
        <button onClick={loadMore} disabled={loading || !lastName}>Load more</button>
      </div>
    </section>
  );
}
