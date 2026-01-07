import Link from "next/link";
import styles from "../../app/landing.module.css";

export default function LandingNav() {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            zIndex: 100, backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.8)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                ReputaAI <span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span>
            </div>

            <div style={{ display: 'flex', gap: '32px', fontWeight: 500, color: 'var(--text-secondary)' }} className="hide-mobile">
                <a href="#features" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Features</a>
                <a href="#demo" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>How it Works</a>
                <a href="#pricing" style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Pricing</a>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--text-primary)', padding: '10px 20px' }}>
                    Log in
                </Link>
                <Link href="/dashboard" style={{
                    background: 'var(--primary)', color: 'white', padding: '10px 24px',
                    borderRadius: '100px', fontWeight: 600, transition: 'transform 0.2s'
                }}>
                    Start Free Trial
                </Link>
            </div>
        </nav>
    );
}
