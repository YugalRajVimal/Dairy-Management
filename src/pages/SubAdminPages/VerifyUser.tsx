import { useState } from "react";

function VerifyUser() {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/subadmin/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Verification failed.");
        setSuccess(null);
      } else {
        setSuccess(data.message || "Password verified.");
        setError(null);
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-10">
      <form
        className="bg-white dark:bg-gray-900 shadow rounded-lg px-8 py-8 w-full max-w-md space-y-5 border border-gray-200 dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Verify Your Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          For security, please enter your password to continue.
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-2 rounded text-sm">
            {success}
          </div>
        )}
        <div>
          <label
            htmlFor="user-password"
            className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2"
          >
            Password
          </label>
          <input
            id="user-password"
            type="password"
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

export default VerifyUser;
