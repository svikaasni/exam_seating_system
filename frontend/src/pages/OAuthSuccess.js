import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const email = params.get("email");
    const role = params.get("role") || "STUDENT";

    if (email) {
      // ✅ Store user info
      localStorage.setItem("username", email);
      localStorage.setItem("role", role);
      localStorage.setItem("auth", "oauth");

      // ✅ Redirect to home/dashboard
      navigate("/");
    } else {
      // ❌ If something went wrong
      alert("OAuth login failed ❌");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
}

export default OAuthSuccess;