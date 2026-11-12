import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import getError from "../utils/getError";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) 
    return <Navigate to="/dashboard" />;

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getError(error));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-800 text-center mb-1">Leave Management</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Login to your account</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="Enter email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter password"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
