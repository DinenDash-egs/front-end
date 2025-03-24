import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    user_type: 0,
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const navigate = useNavigate();
  const verifyRef = useRef(null);

  useEffect(() => {
    if (showVerify && verifyRef.current) {
      verifyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showVerify]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8001/v1/auth/register", form);
      setShowVerify(true); // mostra seção de verificação
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao registrar");
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError("");
    try {
      await axios.post("http://127.0.0.1:8001/v1/auth/verify-email", {
        email: form.email,
        code: verificationCode,
      });
      navigate("/login");
    } catch (err) {
      setError("Código inválido ou expirado");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div data-theme="forest" className="flex flex-col items-center min-h-screen bg-base-200 p-4">
      {/* Formulário de Registro */}
      <div className="w-full max-w-sm bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>

        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <div className="form-control">
            <label className="label text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              className="input input-bordered rounded-full"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="mail@site.com"
              className="input input-bordered rounded-full"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="input input-bordered rounded-full"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success rounded-full text-white mt-2">
            Register
          </button>

          {error && !showVerify && <p className="text-error text-sm">{error}</p>}
        </form>
      </div>

      {/* Bloco de Verificação */}
      {showVerify && (
        <div
          ref={verifyRef}
          className="w-full max-w-sm mt-12 bg-base-100 shadow-lg rounded-2xl px-6 py-8 space-y-4 text-center"
        >
          <h2 className="text-xl font-bold">Verifique seu Email</h2>
          <p className="text-sm">Insira o código enviado para <span className="font-semibold">{form.email}</span></p>

          <input
            type="text"
            placeholder="Código de verificação"
            className="input input-bordered w-full"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            className="btn btn-success w-full"
            onClick={handleVerify}
            disabled={verifying}
          >
            {verifying ? "Verificando..." : "Verificar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
