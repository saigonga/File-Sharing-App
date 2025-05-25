import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { Link, replace, useNavigate } from "react-router-dom";
import {
  doPasswordReset,
  doSignInWithEmailAndPassword,
  doSignOut,
} from "../../../Firebase/auth";
import { doSignInWithGoogle } from "../../../Firebase/auth";
import { useAuth } from "../../../context/authContext/authContext";

function Login() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [resetMsg, setResetMsg] = useState("");
  const [loading, setLoading] = useState(false); // For login
  const [resetLoading, setResetLoading] = useState(false); // For reset

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [userLoggedIn, navigate]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await doSignInWithEmailAndPassword(data.email, data.password);
    } catch (err) {
      setError(err.message || " Failed to Sign in");
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    setResetMsg("");
    setResetLoading(true);
    try {
      await doPasswordReset(data.email);
      setResetMsg("Password reset email sent! Check your inbox");
    } catch (err) {
      setResetMsg(err.message || "Failed to send reset email.");
    }
    setResetLoading(false);
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await doSignInWithGoogle();
    } catch (err) {
      setError(err.message || " Failed to sign in with Google");
    }
    setLoading(false);
  };

  const handleLogout = async (e) => {
    await doSignOut();
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && (
              <div className={styles.error_msg} aria-live="polite">
                {error}
              </div>
            )}
            <div className={styles.button_row}>
              <button
                type="submit"
                className={styles.green_btn}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && (
                <button
                  type="button"
                  className={styles.green_btn}
                  onClick={handlePasswordReset}
                  disabled={loading || !data.email}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="googlesignin">
              <button
                type="button"
                className={styles.google_btn}
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg
                  className={styles.google_icon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.77-5.62C34.36 3.7 29.64 1.5 24 1.5 14.82 1.5 6.98 7.48 3.69 15.09l6.91 5.37C12.18 14.09 17.62 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.24h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.18 5.59C43.98 37.13 46.1 31.27 46.1 24.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.6 28.46c-1.04-3.09-1.04-6.41 0-9.5l-6.91-5.37C1.1 17.36 0 20.57 0 24s1.1 6.64 3.69 10.41l6.91-5.37z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 46.5c6.48 0 11.92-2.14 15.9-5.84l-7.18-5.59c-2 1.36-4.56 2.18-8.72 2.18-6.38 0-11.82-4.59-13.4-10.77l-6.91 5.37C6.98 40.52 14.82 46.5 24 46.5z"
                    />
                  </g>
                </svg>
                {loading ? "Please wait..." : "Sign in with Google"}
              </button>
            </div>
          </form>
          {resetMsg && (
            <div
              className={
                !resetMsg.includes("sent!") ? styles.error_msg : undefined
              }
              aria-live="polite"
            >
              {resetMsg}
            </div>
          )}
        </div>

        <div className={styles.right}>
          <h1>New Here?</h1>
          <div>
            <Link to="/signup">
              <button type="button" className={styles.white_btn}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
