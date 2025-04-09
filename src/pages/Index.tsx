
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "student") {
        navigate("/dashboard");
      } else if (parsedUser.role === "mentor") {
        navigate("/mentor-dashboard");
      } else if (parsedUser.role === "admin") {
        navigate("/admin-dashboard");
      }
    }
  }, [navigate]);

  return <LandingPage />;
};

export default Index;
