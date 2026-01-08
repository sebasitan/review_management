'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../dashboard.module.css";

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('business');
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {
        fetchBusiness();
    }, []);

    const fetchBusiness = async () => {
        try {
            const res = await fetch('/api/business');
            const data = await res.json();
            if (data.business) {
                setBusiness(data.business);
                setBusinessName(data.business.name);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!business) return;
        setSaving(true);
        try {
            const res = await fetch('/api/business', {
                method: 'PUT',
                body: JSON.stringify({ id: business.id, name: businessName })
            });
            if (res.ok) {
                const updated = await res.json();
                setBusiness(updated);
                alert('Business updated successfully!');
            }
        } catch (e) {
            alert('Failed to update');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!business || !confirm('Are you sure you want to delete your business? This action cannot be undone and will delete all review data.')) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/business?id=${business.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setBusiness(null);
                setBusinessName('');
                alert('Business deleted.');
                window.location.reload();
            }
        } catch (e) {
            alert('Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = () => {
        router.push('/onboarding');
    }

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

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Settings</h1>
            <p style={{ color: '#64748b', marginTop: '4px', marginBottom: '32px' }}>Manage your account and preferences</p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setActiveTab('business')}
                    style={{
                        padding: '12px 4px',
                        borderBottom: activeTab === 'business' ? '2px solid var(--primary)' : '2px solid transparent',
                        fontWeight: activeTab === 'business' ? 600 : 500,
                        color: activeTab === 'business' ? 'var(--primary)' : '#64748b',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderBottomWidth: activeTab === 'business' ? '2px' : '0px',
                        marginBottom: '-1px'
                    }}
                >
                    Business Profile
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    style={{
                        padding: '12px 4px',
                        borderBottom: activeTab === 'billing' ? '2px solid var(--primary)' : '2px solid transparent',
                        fontWeight: activeTab === 'billing' ? 600 : 500,
                        color: activeTab === 'billing' ? 'var(--primary)' : '#64748b',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderBottomWidth: activeTab === 'billing' ? '2px' : '0px',
                        marginBottom: '-1px'
                    }}
                >
                    Billing & Plans
                </button>
            </div>

            {activeTab === 'business' && (
                <div className="glass" style={{ padding: '32px', maxWidth: '800px' }}>
                    {business ? (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Google Place ID</label>
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '0.875rem', border: '1px solid #e2e8f0' }}>
                                    {business.googlePlaceId || 'Not connected'}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>To change the connected Google Business location, please delete this profile and add a new one.</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                                <button
                                    onClick={handleDelete}
                                    style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                    disabled={saving}
                                >
                                    Delete Business
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className={styles.primaryBtn}
                                    disabled={saving || !businessName.trim()}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Business Profile</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You haven't linked a business yet.</p>
                            <button onClick={handleAdd} className={styles.primaryBtn}>
                                Add Business
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'billing' && (
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
                            <button className="gradient-text" style={{ fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
