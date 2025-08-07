"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract tokens from URL hash (Supabase auth callback)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessTokenParam = hashParams.get("access_token") || "";
    const refreshTokenParam = hashParams.get("refresh_token") || "";
    
    // Also check search params as fallback
    const accessTokenSearch = searchParams.get("access_token") || "";
    const refreshTokenSearch = searchParams.get("refresh_token") || "";
    
    setAccessToken(accessTokenParam || accessTokenSearch);
    setRefreshToken(refreshTokenParam || refreshTokenSearch);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await resetPassword(accessToken, refreshToken, newPassword);
      setSuccess("Your password has been reset. You can now sign in.");
      setNewPassword("");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const isTokenMissing = !accessToken;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
        </div>
        {isTokenMissing ? (
          <div className="text-red-600 text-center">Invalid or missing reset link.</div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="new-password" className="sr-only">
                  New password
                </label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">{success}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting password...
                  </span>
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
