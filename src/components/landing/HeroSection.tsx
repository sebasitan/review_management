import Link from "next/link";
import styles from "../../app/landing.module.css";

export default function HeroSection() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBackground}></div>

            <div className={styles.heroContent}>
                <div className={styles.pill}>
                    <span>✨ New: AI Auto-Reply V2 is live</span>
                </div>

                <h1 className={styles.heroTitle}>
                    Turn Reviews into <br />
                    <span className="gradient-text">Revenue</span> on Autopilot
                </h1>

                <p className={styles.heroSubtitle}>
                    The all-in-one reputation management platform. Collect more 5-star reviews,
                    automate responses with AI, and dominate local SEO—all while you sleep.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/login" style={{
                        padding: '16px 32px', background: 'var(--primary)', color: 'white',
                        borderRadius: '12px', fontWeight: 600, fontSize: '1.125rem',
                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                        textDecoration: 'none'
                    }}>
                        Get Started Free
                    </Link>
                    <a href="#pricing" style={{
                        padding: '16px 32px', background: 'white', color: 'var(--text-primary)',
                        borderRadius: '12px', fontWeight: 600, fontSize: '1.125rem',
                        border: '1px solid var(--card-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        textDecoration: 'none'
                    }}>
                        View Live Demo
                    </a>
                </div>

                <div className={styles.trustBadge}>
                    <span>TRUSTED BY 500+ BUSINESSES</span>
                </div>
            </div>

            <div className={styles.dashboardPreview}>
                <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{ width: '100%', aspectRatio: '16/10', background: '#f8fafc', position: 'relative', display: 'flex', overflow: 'hidden' }}>
                    {/* Mock Sidebar */}
                    <div style={{ width: '20%', height: '100%', background: 'white', borderRight: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '80%', height: '24px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }}></div>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                        ))}
                    </div>

                    {/* Mock Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Mock Header */}
                        <div style={{ height: '60px', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
                            <div style={{ width: '120px', height: '16px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0' }}></div>
                        </div>

                        {/* Mock Widgets */}
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: '100px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                                    <div style={{ width: '40%', height: '12px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '12px' }}></div>
                                    <div style={{ width: '80%', height: '24px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                                </div>
                            ))}
                            <div style={{ gridColumn: 'span 2', height: '200px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                                <div style={{ width: '30%', height: '12px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '20px' }}></div>
                                <div style={{ width: '100%', height: '80%', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}></div>
                            </div>
                            <div style={{ height: '200px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                                <div style={{ width: '50%', height: '12px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '12px' }}></div>
                                {[1, 2, 3].map(j => (
                                    <div key={j} style={{ width: '100%', height: '30px', background: '#f8fafc', borderRadius: '6px', marginBottom: '8px' }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
