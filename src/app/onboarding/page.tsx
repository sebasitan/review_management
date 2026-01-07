'use client';

import { useState } from 'react';
import styles from '../page.module.css'; // Borrowing some hero styles
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const router = useRouter();

    const handleNext = async () => {
        if (step === 1) {
            if (!businessName) return alert('Please enter a business name');
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            setLoading(true);
            try {
                const res = await fetch('/api/onboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessName }),
                });

                if (res.ok) {
                    router.push('/dashboard');
                } else {
                    alert('Something went wrong. Please try again.');
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.main} style={{ background: 'var(--background)', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '48px', borderRadius: '32px', textAlign: 'center' }}>

                {step === 1 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🏢</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Let's set up your business</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter your business name to start monitoring reviews across all platforms.</p>

                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Blue Coffee Roasters"
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white', marginBottom: '24px', fontSize: '1rem', color: 'black' }}
                        />

                        <button
                            onClick={handleNext}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🔗</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Connect Platforms</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Choose which platforms you want ReputaAI to monitor for your business.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            <button className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', textAlign: 'left', fontWeight: 600 }}>
                                <span style={{ fontSize: '1.25rem' }}>G</span> Google Business Profile <span style={{ marginLeft: 'auto', color: 'var(--success)' }}>✓ Connected</span>
                            </button>
                            <button className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', textAlign: 'left', fontWeight: 600, opacity: 0.6 }}>
                                <span style={{ fontSize: '1.25rem' }}>Y</span> Yelp Business <span style={{ marginLeft: 'auto', color: 'var(--primary)', cursor: 'pointer' }}>Connect</span>
                            </button>
                            <button className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', textAlign: 'left', fontWeight: 600, opacity: 0.6 }}>
                                <span style={{ fontSize: '1.25rem' }}>F</span> Facebook Pages <span style={{ marginLeft: 'auto', color: 'var(--primary)', cursor: 'pointer' }}>Connect</span>
                            </button>
                        </div>

                        <button
                            onClick={handleNext}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                        >
                            Go to Summary
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>✨</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>You're all set!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We're ready to import reviews for <strong>{businessName}</strong>. Your AI assistant is ready to help you respond.</p>

                        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '24px', borderRadius: '20px', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reviews Found:</span>
                                <span style={{ fontWeight: 700 }}>3</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg. Rating:</span>
                                <span style={{ fontWeight: 700, color: '#ffb700' }}>4.7 ★</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending Replies:</span>
                                <span style={{ fontWeight: 700, color: 'var(--error)' }}>3</span>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Preparing Dashboard...' : 'Enter Dashboard'}
                        </button>
                    </div>
                )}

            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
