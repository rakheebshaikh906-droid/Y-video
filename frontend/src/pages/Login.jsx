
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login(onLoginSuccess) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginUser(formData);
            onLoginSuccess?.();
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-10 dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-gray-200 p-8 shadow-sm dark:border-zinc-800"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to YVideo
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Login to watch videos and access your account.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <label
                    htmlFor="email"
                    className="mt-6 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none focus:border-red-600 dark:border-zinc-700 dark:text-white"
                    placeholder="you@example.com"
                />

                <label
                    htmlFor="password"
                    className="mt-5 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none focus:border-red-600 dark:border-zinc-700 dark:text-white"
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-red-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default Login;
