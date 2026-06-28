import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Signup = () => {

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const { storeTokenInLS } = useAuth();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL?.trim();
  const URL = `${BASE_URL}/api/auth/register`;
  const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL?.trim() || "http://localhost:3001"; // ✅ added

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        toast.success("Registration successful");
        window.location.href = `${DASHBOARD_URL}?token=${res_data.token}`; // ✅ go to dashboard, not "/"
      } else {
        toast.error(res_data.extraDetails || res_data.message);
      }

    } catch (error) {
      console.log("Register error:", error);
      toast.error("Server error");
    }
  };

  return (
    <section>
      <main>
        <div className="section-registration">
          <div className="container grid grid-two-cols">

            <div className="registration-image">
              <img
                src="media/images/register.png"
                alt="register"
                width="500"
                height="500"
              />
            </div>

            <div className="registration-form">
              <h1 className="main-heading mb-3">Registration Form</h1>

              <form onSubmit={handleSubmit}>

                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={user.username}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={user.email}
                    onChange={handleInput}
                    required
                  />
                </div>

                {/* phone must be string (Zod expects string) */}
                <div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="phone"
                    value={user.phone}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={user.password}
                    onChange={handleInput}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-submit">
                  Register Now
                </button>

              </form>
            </div>

          </div>
        </div>
      </main>
    </section>
  );
};

export default Signup;