"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "../hooks/useAuth";

export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailError = useMemo(() => {
    if (!submitted) return "";
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email";
    return "";
  }, [email, submitted]);

  const passwordError = useMemo(() => {
    if (!submitted) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  }, [password, submitted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setAuthError("");
    setIsLoading(false);
  }, [open]);

  if (!open) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
    >
      {/* Blurry background overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-50 w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-white/60">
                Use your account to continue to the dashboard.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitted(true);
              setAuthError("");
              if (emailError || passwordError) return;

              setIsLoading(true);
              
              // Simulate loading delay for better UX
              await new Promise(resolve => setTimeout(resolve, 1500));

              const normalizedEmail = email.trim().toLowerCase();

              // User accounts with roles
              const users = [
                { email: "admin@bohol.com", password: "admin123", role: "admin" as UserRole, name: "Administrator" },
                { email: "personnel@bohol.com", password: "personnel123", role: "personnel" as UserRole, name: "Field Personnel" },
              ];

              const authenticatedUser = users.find(
                user => user.email === normalizedEmail && user.password === password
              );

              if (!authenticatedUser) {
                setAuthError("Invalid email or password");
                setIsLoading(false);
                return;
              }

              // Login with role
              login(authenticatedUser.email, authenticatedUser.role, authenticatedUser.name);
              setIsLoading(false);
              onClose();
              router.push("/dashboard");
            }}
          >
            {authError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {authError}
              </div>
            ) : null}
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                />
                {emailError ? (
                  <span className="text-xs text-rose-300 mt-1 block">{emailError}</span>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                />
                {passwordError ? (
                  <span className="text-xs text-rose-300 mt-1 block">{passwordError}</span>
                ) : null}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-3 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </motion.button>

              <div className="text-center text-xs text-white/55">
                Don't have an account? <a href="#" className="font-semibold text-white/80 hover:text-white">Request access</a>
              </div>
              
              <div className="text-center text-xs text-white/40 mt-3">
                <div className="mb-2 font-medium text-white/60">Demo Accounts:</div>
                <div>Admin: admin@bohol.com / admin123</div>
                <div>Personnel: personnel@bohol.com / personnel123</div>
              </div>
            </motion.div>
          </form>
        </div>
      </motion.div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-50 flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="mt-4 text-white/80 text-sm">Authenticating...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
