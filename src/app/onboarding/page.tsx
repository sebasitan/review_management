'use client';

import { useState } from 'react';
import styles from '../page.module.css'; // Borrowing some hero styles
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const nextStep = () => {
        setLoading(true);
        setTimeout(() => {
            setStep(step + 1);
            setLoading(false);
        }, 1000);
    };

    const finish = () => {
        setLoading(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className={styles.main} style={{ background: 'var(--background)', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '48px', borderRadius: '32px', textAlign: 'center' }}>

                {step === 1 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🏢</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Let's set up your business</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter your business name to start monitoring reviews across all platforms.</p>

                        <input
                            type="text"
                            placeholder="e.g. Blue Coffee Roasters"
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white', marginBottom: '24px', fontSize: '1rem' }}
                        />

                        <button
                            onClick={nextStep}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Continue'}
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
                            onClick={nextStep}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Linking...' : 'Go to Dashboard Setup'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>✨</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>You're all set!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We've successfully imported your last 100 reviews. Your AI assistant is ready to help you respond.</p>

                        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '24px', borderRadius: '20px', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reviews Found:</span>
                                <span style={{ fontWeight: 700 }}>1,284</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg. Rating:</span>
                                <span style={{ fontWeight: 700, color: '#ffb700' }}>4.8 ★</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending Replies:</span>
                                <span style={{ fontWeight: 700, color: 'var(--error)' }}>12</span>
                            </div>
                        </div>

                        <button
                            onClick={finish}
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
