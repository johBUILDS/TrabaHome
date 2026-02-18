import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { workerAPI } from "../services/WorkerApi.ts";
import { saveWorkerSession } from "../utils/workerAuth.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_PATTERN = /^\d{6}$/;

const getApiErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
};

export default function WorkerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const completeWorkerSignIn = (result, fallbackEmail) => {
    if (!result?.token) {
      setError("Login succeeded but no token was returned by the server.");
      return;
    }

    const workerEmail =
      result?.worker?.email ||
      result?.email ||
      fallbackEmail;

    saveWorkerSession({
      token: result.token,
      email: String(workerEmail || "").toLowerCase(),
      worker: result.worker ?? null,
    });

    navigate("/home-worker", { replace: true });
  };

  const handleCredentialsSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfoMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await workerAPI.login({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (result?.otpRequired) {
        const resolvedEmail = String(result?.email || trimmedEmail).toLowerCase();
        setPendingEmail(resolvedEmail);
        setIsOtpStep(true);
        setOtpCode("");
        setPassword("");
        setInfoMessage("A 6-digit login code was sent to your email.");
        return;
      }

      completeWorkerSignIn(result, trimmedEmail);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfoMessage("");

    const trimmedOtp = otpCode.trim();
    const targetEmail = pendingEmail || email.trim().toLowerCase();

    if (!OTP_PATTERN.test(trimmedOtp)) {
      setError("Enter the 6-digit login code.");
      return;
    }

    if (!targetEmail) {
      setError("Email is missing. Please sign in again.");
      setIsOtpStep(false);
      return;
    }

    setLoading(true);

    try {
      const result = await workerAPI.verifyLoginOtp({
        email: targetEmail,
        code: trimmedOtp,
      });
      completeWorkerSignIn(result, targetEmail);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Invalid or expired code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resetToCredentials = () => {
    setIsOtpStep(false);
    setOtpCode("");
    setPendingEmail("");
    setError("");
    setInfoMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3B68] to-[#154875] flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-6">
            <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Worker Portal</p>
          </div>

          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-semibold text-blue-900">
              Secure sign-in is enabled. Step 1: password, Step 2: email login code.
            </p>
          </div>

          {infoMessage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {!isOtpStep ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label htmlFor="worker-email" className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  id="worker-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="worker-password" className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="worker-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button type="button" className="text-sm text-[#0B3B68] hover:underline font-semibold">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-[#0B3B68] font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label htmlFor="worker-otp-email" className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  id="worker-otp-email"
                  type="email"
                  value={pendingEmail}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="worker-otp-code" className="block text-gray-700 font-semibold mb-2">
                  6-digit Login Code
                </label>
                <input
                  id="worker-otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg tracking-[0.35em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-[#0B3B68] font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify and Sign In"}
              </button>

              <button
                type="button"
                onClick={resetToCredentials}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Use a different account
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Do not have an account?{" "}
              <Link to="/worker-signup" className="text-[#0B3B68] font-bold hover:underline">
                Sign up as a worker
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm font-semibold">
              &lt;- Back to role selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
