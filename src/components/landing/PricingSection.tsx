import Link from "next/link";
import styles from "../../app/landing.module.css";

export default function PricingSection() {
    return (
        <section id="pricing" className={styles.section}>
            <div className={styles.sectionTitle}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Pricing</span>
                <h2>Simple, transparent pricing</h2>
                <p>Start for free, scale as you grow. No hidden fees.</p>
            </div>

            <div className={styles.grid} style={{ maxWidth: '1000px' }}>
                {/* Starter */}
                <div className={styles.pricingCard}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Starter</h3>
                    <div style={{ margin: '16px 0', fontSize: '3rem', fontWeight: 800 }}>$29<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Perfect for small businesses just getting started.</p>

                    <ul className={styles.checkList}>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> 1 Location</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> Google & Facebook Sync</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> 100 AI Replies / mo</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> Basic Analytics</li>
                    </ul>

                    <Link href="/dashboard" style={{
                        width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--primary)',
                        color: 'var(--primary)', fontWeight: 600, textAlign: 'center'
                    }}>Start Free Trial</Link>
                </div>

                {/* Pro */}
                <div className={`${styles.pricingCard} ${styles.popularPricing}`}>
                    <div style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px',
                        fontSize: '0.75rem', fontWeight: 700
                    }}>MOST POPULAR</div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Growth</h3>
                    <div style={{ margin: '16px 0', fontSize: '3rem', fontWeight: 800 }}>$79<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
                    <p style={{ color: 'var(--text-secondary)' }}>For growing businesses that need serious automation.</p>

                    <ul className={styles.checkList}>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> Up to 3 Locations</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> All Platforms Sync</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> Unlimited AI Replies</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> SMS Campaigns</li>
                        <li className={styles.checkItem}><span className={styles.checkIcon}>✓</span> Competitor Tracking</li>
                    </ul>

                    <Link href="/dashboard" style={{
                        width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary)',
                        color: 'white', fontWeight: 600, textAlign: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>Get Started</Link>
                </div>
            </div>
        </section>
    );
}
