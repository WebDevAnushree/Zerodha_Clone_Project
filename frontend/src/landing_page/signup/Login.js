import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Login = () => {

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { storeTokenInLS } = useAuth();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL?.trim();
  const URL = `${BASE_URL}/api/auth/login`;
  const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL?.trim() || "https://zerodha-clone-project-chi.vercel.app"; // ✅ env-driven, not hardcoded

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token); // ✅ saves to frontend's localStorage (harmless, kept for consistency)
        toast.success("Login successful");
        window.location.href = `${DASHBOARD_URL}?token=${res_data.token}`; // ✅ pass token across origins
      } else {
        toast.error(res_data.extraDetails || res_data.message);
      }

    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <section>
      <main>
        <div className="section-registration">
          <div className="container grid-two-cols">

            <div className="registration-image">
              <img
                src="media/images/login.png"
                alt="login"
                width="450"
                height="450"
              />
            </div>

            <div className="registration-form">

              <h1 className="main-heading mb-3">Login</h1>

              <form onSubmit={handleSubmit} className="login-form">

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  placeholder="Enter email"
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInput}
                  placeholder="Enter password"
                  required
                />

                <button type="submit" className="btn btn-submit">
                  Login
                </button>

              </form>

            </div>

          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;