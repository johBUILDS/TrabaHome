import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ROLE_META = {
  homeowner: { label: "Homeowner", loginPath: "/login" },
  worker: { label: "Worker", loginPath: "/worker-login" }
};

export default function VerifyEmail({ forcedRole }) {
  const [searchParams] = useSearchParams();
  const roleParam = (forcedRole || searchParams.get("role") || "").toLowerCase();
  const initialRole = ROLE_META[roleParam] ? roleParam : (forcedRole || "homeowner");

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isRoleLocked = Boolean(forcedRole);
  const roleInfo = ROLE_META[selectedRole];

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email || !code) {
      setStatus({ type: "error", message: "Please enter your email and the 6-digit code." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${selectedRole}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Verification failed.");
      }

      setStatus({ type: "success", message: data?.message || "Email verified successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Verification failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setStatus({ type: "", message: "" });
    if (!email) {
      setStatus({ type: "error", message: "Please enter your email address first." });
      return;
    }

    setResending(true);
    try {
      const response = await fetch(`${API_URL}/${selectedRole}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Unable to resend code.");
      }

      setStatus({ type: "success", message: data?.message || "Verification code sent." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Unable to resend code." });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-sm p-10">
        <div className="text-center mb-6">
          <img src="/assets/Logo.png" alt="TrabaHome" className="h-10 w-auto mx-auto mb-3" />
          <h1 className="text-[#0B3B68] text-2xl font-bold">Verify Your Email</h1>
          <p className="text-[#0B3B68] text-[11px] opacity-80 mt-2">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        {status.message && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-[11px] font-semibold ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1 ml-1">Role</label>
            {isRoleLocked ? (
              <div className="w-full bg-[#EEEEEE] rounded-xl px-4 py-3 text-sm font-semibold text-[#0B3B68]">
                {ROLE_META[selectedRole]?.label || "Homeowner"}
              </div>
            ) : (
              <div className="flex gap-2">
                {Object.keys(ROLE_META).map((roleKey) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedRole(roleKey)}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-bold border transition ${
                      selectedRole === roleKey
                        ? "bg-[#0B3B68] text-white border-[#0B3B68]"
                        : "bg-white text-[#0B3B68] border-[#0B3B68]/20"
                    }`}
                  >
                    {ROLE_META[roleKey].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#EEEEEE] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B3B68] outline-none placeholder:text-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1 ml-1">6-Digit Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full bg-[#EEEEEE] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B3B68] outline-none placeholder:text-gray-400 tracking-[0.35em] text-center"
              placeholder="______"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3B68] text-white font-bold py-3 rounded-xl hover:bg-[#082d50] transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-[#0B3B68] text-[#0B3B68] font-bold py-2.5 rounded-xl hover:bg-[#0B3B68]/10 transition-colors disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>

          <div className="text-center text-[11px] text-gray-600 font-semibold">
            Back to{" "}
            <Link to={roleInfo?.loginPath || "/"} className="text-black font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
