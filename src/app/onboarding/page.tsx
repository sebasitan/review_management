'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
    const { status } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    }, []);

    const searchBusinesses = async () => {
        if (!query) return;
        setLoading(true);
        try {
            let url = `/api/search?q=${encodeURIComponent(query)}`;
            if (location) {
                url += `&lat=${location.lat}&lng=${location.lng}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualEntry = () => {
        setSelectedBusiness({
            name: query || '',
            placeId: 'manual_' + Math.random().toString(36).substr(2, 9),
            address: '',
            rating: 4.0,
            reviewCount: 10
        });
        setStep(2);
    };

    const handleContinue = async () => {
        if (!selectedBusiness?.name) return alert('Please enter your business name');

        setLoading(true);
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: selectedBusiness.name,
                    googlePlaceId: selectedBusiness.placeId,
                    address: selectedBusiness.address,
                    rating: selectedBusiness.rating,
                    reviewCount: selectedBusiness.reviewCount
                }),
            });

            if (res.ok) {
                setStep(3);
            } else {
                alert('Connection failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main} style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

            {/* Progress Header */}
            <div style={{ position: 'absolute', top: '40px', display: 'flex', gap: '8px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= i ? 'var(--primary)' : '#cbd5e1', transition: 'all 0.3s ease' }} />
                ))}
            </div>

            <div className="glass" style={{ width: '100%', maxWidth: '540px', padding: '40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>

                {step === 1 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '24px', fontSize: '2rem' }}>📍</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Find your business</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>We'll analyze your public reviews and prepare your AI dashboard in seconds.</p>

                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchBusinesses()}
                                placeholder="E.g. Stallioni Net Solutions"
                                style={{ width: '100%', padding: '18px 18px 18px 48px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.1rem', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }}
                            />
                            {loading && <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                        </div>

                        {searchResults.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto', padding: '4px' }}>
                                {searchResults.map((biz) => (
                                    <button
                                        key={biz.placeId}
                                        onClick={() => { setSelectedBusiness(biz); setStep(2); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', textAlign: 'left', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    >
                                        <div style={{ fontSize: '1.25rem' }}>🏢</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{biz.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{biz.address}</div>
                                        </div>
                                        <div style={{ color: '#f59e0b', fontWeight: 600 }}>{biz.rating} ★</div>
                                    </button>
                                ))}
                                <button onClick={handleManualEntry} style={{ color: 'var(--primary)', background: 'none', border: 'none', padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>None of these? Add manually →</button>
                            </div>
                        ) : (
                            <button
                                onClick={searchBusinesses}
                                className={styles.primaryBtn}
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}
                                disabled={loading || !query}
                            >
                                Search Reviews
                            </button>
                        )}

                        {!loading && searchResults.length === 0 && query && (
                            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', cursor: 'pointer' }} onClick={handleManualEntry}>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Search not working? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Click here to enter details manually</span> and see your dashboard.</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px', fontSize: '2rem' }}>✨</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Verify Details</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>Make sure these match your Google profile for accurate AI insights.</p>

                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Business Display Name</label>
                                <input
                                    type="text"
                                    value={selectedBusiness?.name || ''}
                                    onChange={(e) => setSelectedBusiness({ ...selectedBusiness, name: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#1e293b', fontWeight: 500 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Google Rating</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={selectedBusiness?.rating || 0}
                                            onChange={(e) => setSelectedBusiness({ ...selectedBusiness, rating: parseFloat(e.target.value) })}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#1e293b', fontWeight: 600 }}
                                        />
                                        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }}>★</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Total Reviews</label>
                                    <input
                                        type="number"
                                        value={selectedBusiness?.reviewCount || 0}
                                        onChange={(e) => setSelectedBusiness({ ...selectedBusiness, reviewCount: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#1e293b', fontWeight: 600 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '16px 24px', borderRadius: '16px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Back</button>
                            <button
                                onClick={handleContinue}
                                className={styles.primaryBtn}
                                style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Creating Dashboard...' : 'Create My Dashboard'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🚀</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Success!</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>We've set up your reputation engine for <strong>{selectedBusiness.name}</strong>.</p>

                        <div style={{ background: 'linear-gradient(rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.02))', padding: '24px', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>Public reviews analyzed</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>AI response model trained</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🔒</div>
                                <div style={{ fontSize: '0.95rem', color: '#475569' }}>Connect Official account to auto-reply</div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className={styles.primaryBtn}
                            style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 700, fontSize: '1.2rem' }}
                        >
                            Open Dashboard
                        </button>
                    </div>
                )}

            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
