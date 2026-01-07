'use client';

import styles from "../dashboard.module.css";

export default function PricingPage() {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            features: ['Up to 100 reviews/mo', 'AI Response Drafts', 'Google Business Sync', 'Email Support'],
            button: 'Current Plan',
            current: true
        },
        {
            name: 'Professional',
            price: '$79',
            features: ['Up to 1,000 reviews/mo', 'Advanced AI Customization', 'Yelp & Facebook Sync', 'SMS Review Requests', 'Priority Support'],
            button: 'Upgrade to Pro',
            current: false,
            recommended: true
        },
        {
            name: 'Enterprise',
            price: '$199',
            features: ['Unlimited reviews', 'Whitelabel Dashboard', 'API Access', 'Custom AI Training', 'Dedicated Account Manager'],
            button: 'Contact Sales',
            current: false
        }
    ];

    return (
        <div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`${styles.statCard} glass`}
                        style={{
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: plan.recommended ? '2px solid var(--primary)' : '1px solid var(--card-border)'
                        }}
                    >
                        {plan.recommended && (
                            <span style={{
                                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px',
                                fontSize: '0.75rem', fontWeight: 700
                            }}>
                                MOST POPULAR
                            </span>
                        )}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{plan.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>/mo</span>
                        </div>

                        <ul style={{ listStyle: 'none', marginBottom: '40px', flex: 1 }}>
                            {plan.features.map(f => (
                                <li key={f} style={{ display: 'flex', gap: '12px', fontSize: '0.9375rem', marginBottom: '12px', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={plan.recommended ? styles.primaryBtn : styles.secondaryBtn}
                            disabled={plan.current}
                            style={{ width: '100%' }}
                        >
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>

            <section className={`${styles.statCard} glass`} style={{ marginTop: '40px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '24px' }}>Payment Method</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '32px', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.6rem', color: '#64748b' }}>VISA</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Visa ending in 4242</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Expires 12/26</div>
                        </div>
                    </div>
                    <button className="gradient-text" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Edit</button>
                </div>
            </section>
        </div>
    );
}
