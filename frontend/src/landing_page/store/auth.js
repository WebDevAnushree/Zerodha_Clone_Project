import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!token;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  const userAuthentication = async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.userData);
      } else {
        // token invalid / expired
        LogoutUser();
      }

    } catch (error) {
      console.log("Auth error :", error);
      LogoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ fetch user whenever token changes (login / refresh)
  useEffect(() => {
    userAuthentication();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        token,
        isLoading,
        userAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


