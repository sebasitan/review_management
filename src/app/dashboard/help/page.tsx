'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';

const categories = [
    { id: 'start', icon: '🚀', title: 'Getting Started', desc: 'Connect your accounts and set up your first AI profile.' },
    { id: 'features', icon: '⚡', title: 'Features & Tools', desc: 'Learn to use the Review Widget, Social Hub, and more.' },
    { id: 'billing', icon: '💳', title: 'Billing & Plans', desc: 'Manage your subscription, invoices, and payment methods.' },
    { id: 'trouble', icon: '🔧', title: 'Troubleshooting', desc: 'Solutions to common connection and sync issues.' },
];

const faqs = [
    {
        q: 'How do I connect my Google Business Profile?',
        a: 'Go to Settings > Integrations and click "Connect" next to the Google icon. You will be redirected to Google to authorize the connection.'
    },
    {
        q: 'Can I edit the AI-generated responses?',
        a: 'Absolutely! Before posting, you can edit any AI draft in the "Review" modal. The system learns from your edits over time.'
    },
    {
        q: 'How often does the data refresh?',
        a: 'We sync with Google and Facebook every 15 minutes. Yelp reviews are updated once every 24 hours.'
    },
    {
        q: 'What happens if I downgrade my plan?',
        a: 'You will retain access to Pro features until the end of your billing cycle. After that, you will be moved to the Free tier limits.'
    },
];

export default function HelpPage() {
    const [search, setSearch] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div>


            {/* Search Hero */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                marginBottom: '40px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 800 }}>How can we help you effortlessly?</h2>
                    <input
                        type="text"
                        placeholder="Search for articles (e.g., 'API Keys')..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%', maxWidth: '500px', padding: '16px 24px', borderRadius: '100px',
                            border: 'none', fontSize: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            outline: 'none'
                        }}
                    />
                </div>
                {/* Decorative Circles */}
                <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-40%', right: '-5%', width: '200px', height: '200px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
            </div>

            <div className={styles.contentGrid}>

                <div style={{ gridColumn: 'span 2' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Browse Categories</h2>
                    <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {categories.map(cat => (
                            <div key={cat.id} className={`${styles.card} glass`} style={{ padding: '24px', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--card-border)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{cat.icon}</div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{cat.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '1.25rem', margin: '40px 0 24px' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: '100%', padding: '20px', textAlign: 'left', background: 'transparent', border: 'none',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                                        fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)'
                                    }}
                                >
                                    {faq.q}
                                    <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Sidebar */}
                <div>
                    <div className={`${styles.statCard} glass`} style={{ padding: '32px', position: 'sticky', top: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Still need help?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Our support team is available Mon-Fri, 9am - 5pm EST. We usually respond within 2 hours.
                        </p>
                        <button className={styles.primaryBtn} style={{ width: '100%', marginBottom: '12px' }}>Contact Support</button>
                        <div style={{ textAlign: 'center' }}>
                            <a href="#" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>View Documentation →</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
