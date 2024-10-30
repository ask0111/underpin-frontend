import Cookies from "js-cookie";

export const isAuthenticated = async () => {
  const token = Cookies.get("token");

  if (!token) return false;

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const userId = await response.json();
      return userId.user.userId; // Token is valid
    } else {
      Cookies.remove("token"); // Remove invalid token
      return false;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};
export const isAdminAuthenticated = async () => {
  const token = Cookies.get("token");
  if (!token) return false;
  
  try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-admin`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        });
        
    if (response.ok) {
      return true; // Token is valid
    } else {
      Cookies.remove("token"); // Remove invalid token
      return false;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};
