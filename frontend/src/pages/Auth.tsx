import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Auth() {
  const { user, loading, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  async function handleSignIn(provider: "google" | "github") {
    try {
      setAuthLoading(provider);
      await signInWithOAuth(provider);
    } catch (err) {
      console.error("Auth error:", err);
      setAuthLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[oklch(0.65_0.18_230)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[oklch(0.65_0.18_230/6%)] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[oklch(0.55_0.22_300/4%)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[380px] animate-fade-in-up">


        {/* Card */}
        <div className="bg-[oklch(0.15_0.005_260)] border border-[oklch(1_0_0/7%)] rounded-2xl p-6 shadow-xl shadow-[oklch(0_0_0/30%)]">
          <h2 className="text-[1.15rem] font-semibold text-[oklch(0.93_0.005_260)] text-center mb-1">
            Welcome back
          </h2>
          <p className="text-[0.82rem] text-[oklch(0.48_0.01_260)] text-center mb-6">
            Sign in to continue searching with AI
          </p>

          <div className="flex flex-col gap-3">
            {/* Google */}
            <button
              onClick={() => handleSignIn("google")}
              disabled={authLoading !== null}
              className="
                group relative flex items-center justify-center gap-3 w-full
                px-4 py-3 rounded-xl
                bg-[oklch(0.98_0_0)] text-[oklch(0.2_0_0)]
                font-medium text-[0.88rem]
                hover:bg-[oklch(0.94_0_0)]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer border-none
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {authLoading === "google" ? "Signing in..." : "Continue with Google"}
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleSignIn("github")}
              disabled={authLoading !== null}
              className="
                group relative flex items-center justify-center gap-3 w-full
                px-4 py-3 rounded-xl
                bg-[oklch(0.2_0.005_260)] text-[oklch(0.9_0.005_260)]
                border border-[oklch(1_0_0/10%)]
                font-medium text-[0.88rem]
                hover:bg-[oklch(0.25_0.005_260)]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {authLoading === "github" ? "Signing in..." : "Continue with GitHub"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[0.72rem] text-[oklch(0.38_0.01_260)] mt-5 leading-relaxed">
          By continuing, you agree to our Terms of Service
          <br />
          and Privacy Policy
        </p>
      </div>
    </div>
  );
}