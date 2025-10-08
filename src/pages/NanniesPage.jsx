
import { useEffect, useState, useContext } from "react";
import { db } from "../lib/firebase";
import { get, ref } from "firebase/database";
import { AuthContext } from "../App";
import NannyCard from "../components/NannyCard";
import { setFavorites } from "../utils/favorites";

const PAGE_SIZE = 3;

function toArray(obj) {
  return Object.entries(obj || {}).map(([id, v]) => ({ id, ...v }));
}

export default function NanniesPage() {
  const { currentUser } = useContext(AuthContext);
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name-asc");
  const [price, setPrice] = useState([0, 1000]);
  const [loading, setLoading] = useState(false);

  async function fetchAll() {
    setLoading(true);
    const rootSnap = await get(ref(db, "/"));
    const rootVal = rootSnap.val();
    const maybe = rootVal?.nannies ?? rootVal?.nannies?.data ?? rootVal; // tolerate different shapes
    const data = toArray(maybe);
    setAllItems(data);
    setLoading(false);
  }

  function applySortAndSlice(pageNum = 1) {
    let data = [...allItems];
    if (sort.startsWith("name")) {
      data.sort((a,b)=> a.name.localeCompare(b.name));
      if (sort === "name-desc") data.reverse();
    } else if (sort === "price") {
      data = data.filter(x=> Number(x.price_per_hour) >= price[0] && Number(x.price_per_hour) <= price[1])
                 .sort((a,b)=> a.price_per_hour - b.price_per_hour);
    } else if (sort === "rating-asc") {
      data.sort((a,b)=> a.rating - b.rating);
    } else if (sort === "rating-desc") {
      data.sort((a,b)=> b.rating - a.rating);
    }
    const end = pageNum * PAGE_SIZE;
    setItems(data.slice(0, end));
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    applySortAndSlice(next);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setPage(1);
    applySortAndSlice(1);
  }, [allItems, sort, price]);

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
        <button onClick={loadMore} disabled={loading || items.length >= allItems.length}>Load more</button>
      </div>
    </section>
  );
}
