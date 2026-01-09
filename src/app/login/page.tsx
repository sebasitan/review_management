"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (isRegister) {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name }),
                });

                if (res.ok) {
                    const result = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });

                    if (result?.error) {
                        setError("Account created, but could not sign in. Please try manually.");
                    } else {
                        router.push("/onboarding");
                    }
                } else {
                    const data = await res.text();
                    setError(data || "Registration failed");
                }
            } catch (err) {
                setError("Something went wrong");
            }
        } else {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.loginCard} glass`}>
                <div className={`${styles.logo} gradient-text`}>ReputaAI</div>
                <h1 className={styles.title}>{isRegister ? "Create Account" : "Welcome back!"}</h1>
                <p className={styles.subtitle}>
                    {isRegister
                        ? "Join thousands of businesses managing their reputation with AI."
                        : "Sign in to your account and manage your reputation effortlessly."}
                </p>

                {error && <div style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? "Processing..." : (isRegister ? "Sign Up" : "Sign In")}
                    </button>
                </form>

                <div className={styles.divider}>or</div>

                <button className={styles.googleButton} onClick={handleGoogleSignIn} type="button">
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <p className={styles.footer}>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        className={styles.link}
                        onClick={() => setIsRegister(!isRegister)}
                        style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}
                    >
                        {isRegister ? "Sign In" : "Get Started"}
                    </span>
                </p>

                <p style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By clicking continue, you agree to our <br />
                    <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
