
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

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

        if (!avatar) {
            setError("Please select an avatar image.");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("fullName", formData.fullName.trim());
            data.append("username", formData.username.trim());
            data.append("email", formData.email.trim());
            data.append("password", formData.password);
            data.append("avatar", avatar);

            if (coverImage) {
                data.append("coverImage", coverImage);
            }

            await registerUser(data);

            navigate("/login", {
                replace: true,
                state: {
                    message: "Account created successfully. Please log in.",
                },
            });
        } catch (err) {
            setError(
                err.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "mt-2 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none focus:border-red-600 dark:border-zinc-700 dark:text-white";

    const labelClass =
        "mt-5 block text-sm font-medium text-gray-700 dark:text-gray-200";

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-10 dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-gray-200 p-8 shadow-sm dark:border-zinc-800"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create your account
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Join YVideo to upload and watch videos.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <label htmlFor="fullName" className={labelClass}>
                    Full name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                />

                <label htmlFor="username" className={labelClass}>
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Choose a username"
                />

                <label htmlFor="email" className={labelClass}>
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
                    className={inputClass}
                    placeholder="you@example.com"
                />

                <label htmlFor="password" className={labelClass}>
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Create a password"
                />

                <label htmlFor="avatar" className={labelClass}>
                    Avatar <span className="text-red-600">(Required)</span>
                </label>
                <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(event) =>
                        setAvatar(event.target.files?.[0] ?? null)
                    }
                    className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium dark:text-gray-300 dark:file:bg-zinc-800 dark:file:text-white"
                />

                {avatar && (
                    <p className="mt-1 text-xs text-gray-500">
                        Selected: {avatar.name}
                    </p>
                )}

                <label htmlFor="coverImage" className={labelClass}>
                    Cover image (Optional)
                </label>
                <input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                        setCoverImage(event.target.files?.[0] ?? null)
                    }
                    className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium dark:text-gray-300 dark:file:bg-zinc-800 dark:file:text-white"
                />

                {coverImage && (
                    <p className="mt-1 text-xs text-gray-500">
                        Selected: {coverImage.name}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-7 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-red-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default Register;
