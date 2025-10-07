import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "./Modal";
import { auth, db } from "../lib/firebase";
import { push, ref } from "firebase/database";

const schema = yup.object({
  name: yup.string().required(),
  phone: yup.string().required(),
  comment: yup.string().required(),
});

export default function AppointmentModal({ isOpen, onClose, nanny }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(values) {
    const user = auth.currentUser;
    if (!user) return alert("Lütfen giriş yapın.");
    await push(ref(db, "appointments"), {
      ...values,
      nannyId: nanny?.id,
      uid: user.uid,
      createdAt: Date.now(),
    });
    reset();
    onClose();
    alert("Başvurunuz iletildi.");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make an appointment">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Ad Soyad</span>
          <input {...register("name")} />
          {errors.name && <em className="error">{errors.name.message}</em>}
        </label>
        <label>
          <span>Telefon</span>
          <input {...register("phone")} />
          {errors.phone && <em className="error">{errors.phone.message}</em>}
        </label>
        <label>
          <span>Not</span>
          <input {...register("comment")} />
          {errors.comment && <em className="error">{errors.comment.message}</em>}
        </label>
        <button type="submit" disabled={isSubmitting}>Gönder</button>
      </form>
    </Modal>
  );
}
