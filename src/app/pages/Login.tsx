import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../../services/auth/authService";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "operator",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken ||
        "";

      const user =
        response?.user ||
        response?.data?.user ||
        {};

      localStorage.setItem(
        "nvbs_auth",
        JSON.stringify({
          token,
          username: user?.username || user?.name || user?.email || formData.email,
          role: user?.role || formData.role || "Admin",
          email: user?.email || formData.email,
          authenticated: true,
        })
      );

      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      setErrorMsg(
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm border border-gray-200">
            <img
              src="/logo.jfif"
              alt="VOXIS Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">VOXIS</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
               <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      placeholder="Enter your password"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
            </div>

            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <p className="text-sm text-center text-gray-500 mt-4">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline font-medium"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}