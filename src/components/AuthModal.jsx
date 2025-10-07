import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "./Modal";
import { AuthContext } from "../App";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(values) {
    try {
      if (mode === "login") {
        await login(values.email, values.password);
      } else {
        await signup(values.email, values.password);
      }
      reset();
      onClose();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "login" ? "Login" : "Sign up"}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>
          <span>Email</span>
          <input type="email" {...register("email")} />
          {errors.email && <em className="error">{errors.email.message}</em>}
        </label>
        <label>
          <span>Password</span>
          <input type="password" {...register("password")} />
          {errors.password && <em className="error">{errors.password.message}</em>}
        </label>
        <div className="row">
          <button type="submit" disabled={isSubmitting}>
            {mode === "login" ? "Login" : "Create account"}
          </button>
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
