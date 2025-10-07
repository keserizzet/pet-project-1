
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { get, ref } from "firebase/database";
import NannyCard from "../components/NannyCard";
import { readFavorites } from "../utils/favorites";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const ids = readFavorites();
      const promises = ids.map(async (id) => {
        const snap = await get(ref(db, `nannies/${id}`));
        return { id, ...snap.val() };
      });
      const data = (await Promise.all(promises)).filter(Boolean);
      setItems(data);
    }
    load();
  }, []);

  return (
    <section>
      <h2>Favorites</h2>
      {items.length === 0 ? <p>Favori eklenmemiş.</p> : (
        <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
          {items.map((n) => (
            <li key={n.id}><NannyCard nanny={n} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}
