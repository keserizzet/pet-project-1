import { useState, useContext } from "react";
import { AuthContext } from "../App";
import { isFav, toggleFav, saveSnapshot } from "../utils/favorites";
import ReadMoreModal from "./ReadMoreModal";
import AppointmentModal from "./AppointmentModal";

export default function NannyCard({ nanny, onChangeFav }) {
  const { currentUser } = useContext(AuthContext);
  const [openMore, setOpenMore] = useState(false);
  const [openApp, setOpenApp] = useState(false);
  const [fav, setFav] = useState(isFav(nanny.id));

  function onHeart() {
    if (!currentUser) {
      alert("Bu özellik için giriş yapmalısınız.");
      return;
    }
    // favoriye alınırken görsel ve detaylar offline kalabilsin
    saveSnapshot(nanny);
    const list = toggleFav(nanny.id);
    setFav(list.includes(nanny.id));
    onChangeFav?.(list);
  }

  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <img src={nanny.avatar_url} alt={nanny.name} width={80} height={80} style={{ borderRadius: 12, objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{nanny.name}</h3>
            <button onClick={onHeart} aria-label="favorite" style={{ color: fav ? "#ef4444" : "#6b7280" }}>❤</button>
          </div>
          <div>Price: ${nanny.price_per_hour}/h · Rating: {nanny.rating}</div>
          <div>{nanny.location}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setOpenMore(true)}>Read more</button>
            <button onClick={() => setOpenApp(true)}>Make an appointment</button>
          </div>
        </div>
      </div>
      <ReadMoreModal isOpen={openMore} onClose={() => setOpenMore(false)} nanny={nanny} />
      <AppointmentModal isOpen={openApp} onClose={() => setOpenApp(false)} nanny={nanny} />
    </div>
  );
}
