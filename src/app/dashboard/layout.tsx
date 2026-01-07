'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./dashboard.module.css";
import Link from "next/link";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!session) return null;

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: '📊' },
        { name: 'Reviews', href: '/dashboard/reviews', icon: '⭐' },
        { name: 'Requests', href: '/dashboard/requests', icon: '📩' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
        { name: 'Automations', href: '/dashboard/automation', icon: '⚡' },
        { name: 'Competitors', href: '/dashboard/competitors', icon: '⚔️' },
        { name: 'Widgets', href: '/dashboard/widgets', icon: '🧩' },
        { name: 'Marketing', href: '/dashboard/marketing', icon: '📢' },
        { name: 'Help & Support', href: '/dashboard/help', icon: '❓' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ];

    return (
        <div className={styles.container}>
            {/* Mobile Overlay */}
            <div
                className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside className={`${styles.sidebar} glass ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    ReputaAI <span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                            onClick={() => setIsSidebarOpen(false)} // Close on nav
                        >
                            <span>{item.icon}</span> {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>PRO PLAN</p>
                    <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>650 / 1000 reviews</p>
                </div>
            </aside>

            <main className={styles.main}>
                <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div style={{ padding: '32px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
