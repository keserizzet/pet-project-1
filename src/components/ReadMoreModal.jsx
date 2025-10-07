import Modal from "./Modal";

export default function ReadMoreModal({ isOpen, onClose, nanny }) {
  if (!nanny) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={nanny.name}>
      <div style={{ display: "grid", gap: 8 }}>
        <div><strong>Experience:</strong> {nanny.experience}</div>
        <div><strong>Education:</strong> {nanny.education}</div>
        <div><strong>About:</strong> {nanny.about}</div>
        <div><strong>Characters:</strong> {Array.isArray(nanny.characters) ? nanny.characters.join(", ") : nanny.characters}</div>
        <div>
          <strong>Reviews:</strong>
          <ul>
            {(nanny.reviews || []).map((r, i) => (
              <li key={i}>{r.reviewer}: {r.comment} ({r.rating}/5)</li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
