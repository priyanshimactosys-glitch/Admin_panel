import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { signupUser } from "../../services/auth/authService";

/* ================= TYPES ================= */

type RoleType =
    | "Super Admin"
    | "Campaign Manager"
    | "Operator"
    | "Analyst";

interface SignupForm {
    first_name: string;
    mob: string;
    email: string;
    password: string;
    role_type: RoleType;
}

/* ================= DATA ================= */

const roleTypes: RoleType[] = [
    "Super Admin",
    "Campaign Manager",
    "Operator",
    "Analyst",
];

/* ================= COMPONENT ================= */

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupForm>({
        first_name: "",
        mob: "",
        email: "",
        password: "",
        role_type: "Operator",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await signupUser(formData);

            setSuccessMsg("Account created successfully 🚀");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error: any) {
            console.error("Signup failed:", error);

            setErrorMsg(
                error?.response?.data?.message ||
                error?.message ||
                "Signup failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm border border-gray-200">
                        <img
                            src="/logo.jfif"
                            alt="VOXIS Logo"
                            className="w-full h-full object-contain p-1"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">VOXIS</h1>
                    <p className="text-gray-600 mt-2">
                        Create a new admin panel account
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, first_name: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            {/* MOBILE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mob}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mob: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0971234567"
                                    required
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@voxis.zm"
                                    required
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            {/* ROLE (full width) */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role Type
                                </label>
                                <select
                                    value={formData.role_type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            role_type: e.target.value as RoleType,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    {roleTypes.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* ERROR */}
                        {errorMsg && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {errorMsg}
                            </div>
                        )}

                        {/* SUCCESS */}
                        {successMsg && (
                            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                {successMsg}
                            </div>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
<p className="text-sm text-center text-gray-500 mt-4">
 Already have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer hover:underline font-medium"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>
                    </form>
                </div>
            </div>
        </div>
    );
}