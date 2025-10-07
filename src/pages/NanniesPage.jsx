
import { useEffect, useState, useContext } from "react";
import { db } from "../lib/firebase";
import { get, query, ref, orderByChild, limitToFirst, startAt, limitToLast } from "firebase/database";
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
  const [loading, setLoading] = useState(false);

  async function fetchFirst() {
    setLoading(true);
    let q;
    if (sort === "name-asc") q = query(ref(db, "nannies"), orderByChild("name"), limitToFirst(PAGE_SIZE));
    else if (sort === "name-desc") q = query(ref(db, "nannies"), orderByChild("name"), limitToLast(PAGE_SIZE));
    else if (sort === "price") q = query(ref(db, "nannies"), orderByChild("price_per_hour"), limitToFirst(PAGE_SIZE));
    else q = query(ref(db, "nannies"), orderByChild("rating"), limitToFirst(PAGE_SIZE));
    const snap = await get(q);
    const data = toArray(snap.val());
    setItems(data);
    setLastName(data[data.length - 1]?.name || null);
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
  }, [sort]);

  return (
    <section>
      <h2>Nannies</h2>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="price">Price (low first)</option>
          <option value="rating">Rating (low first)</option>
        </select>
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
