import styles from "../../app/landing.module.css";

const features = [
    {
        icon: '💬',
        title: 'Centralized Inbox',
        desc: 'Manage Google, Yelp, and Facebook reviews from a single dashboard. No more tab switching.'
    },
    {
        icon: '🤖',
        title: 'AI Auto-Reply',
        desc: 'Let GPT-4 draft personalized, empathetic responses to every review in seconds. '
    },
    {
        icon: '🚀',
        title: 'Campaign Boosts',
        desc: 'Send SMS & Email requests to your recent customers to skyrocket your review volume.'
    },
    {
        icon: '⚔️',
        title: 'Competitor Intel',
        desc: 'Spy on local rivals. See their ratings, review volume, and sentiment trends in real-time.'
    },
    {
        icon: '📢',
        title: 'Social Marketing',
        desc: 'Turn your best 5-star reviews into beautiful Instagram & Facebook posts with one click.'
    },
    {
        icon: '📊',
        title: 'Advanced Analytics',
        desc: 'Track your growth, sentiment score, and response time with enterprise-grade charts.'
    }
];

export default function FeaturesSection() {
    return (
        <section id="features" className={styles.section} style={{ background: '#f8fafc' }}>
            <div className={styles.sectionTitle}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Features</span>
                <h2>Everything you need to grow</h2>
                <p>Powerful tools built specifically for local businesses.</p>
            </div>

            <div className={styles.grid}>
                {features.map((feat, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.iconBox}>{feat.icon}</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{feat.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
