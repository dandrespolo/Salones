import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { login } from "../api/endpoints";
import useAuthStore from "../store/authStore";

import logo from "../assets/image.png";

import "../styles/login.css";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const { data } = await login(email, password);

      setAuth(data.token, data.usuario);

      navigate("/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Error al iniciar sesión."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-root">

      <div className="login-card">

        {/* LEFT */}
        <div className="login-left">

          <div className="blob-tl"></div>
          <div className="blob-br"></div>
          <div className="blob-mid"></div>

          <div className="logo-box">

            <img
              src={logo}
              alt="Logo"
              className="logo-img"
            />

          </div>

          <h1 className="login-title">
            Gestion de salones
          </h1>

        </div>

        {/* RIGHT */}
        <div className="login-right">

          <div className="login-right-inner">

            <h2 className="login-heading">
              Bienvenido
            </h2>

            <p className="login-subtitle">
              Ingresa tus credenciales para continuar
            </p>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="input-wrap">

                <span className="input-icon">
                  <Mail size={16} />
                </span>

                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="input-wrap">

                <span className="input-icon">
                  <Lock size={16} />
                </span>

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              {/* BUTTON */}
              <button
                className="btn-primary"
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Sparkles
                      size={15}
                      className="animate-spin"
                    />

                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar

                    <ArrowRight size={15} />
                  </>
                )}

              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}