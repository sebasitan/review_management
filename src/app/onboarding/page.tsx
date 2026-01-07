'use client';

import { useState } from 'react';
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
    const router = useRouter();

    const searchBusinesses = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // This will call our internal search API which uses Google Places search
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed:", error);
            alert("Business search is currently unavailable. Please try typing the exact name.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!selectedBusiness) return alert('Please select your business');

        setLoading(true);
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: selectedBusiness.name,
                    googlePlaceId: selectedBusiness.placeId,
                    address: selectedBusiness.address,
                    rating: selectedBusiness.rating
                }),
            });

            if (res.ok) {
                setStep(3); // Show success/preview
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const enterDashboard = () => router.push('/dashboard');

    return (
        <div className={styles.main} style={{ background: 'var(--background)', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '48px', borderRadius: '32px', textAlign: 'center' }}>

                {step === 1 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🔍</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Find your business</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter your business name or Google Maps URL to see your reviews instantly.</p>

                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchBusinesses()}
                                placeholder="Business name or Maps URL..."
                                style={{ width: '100%', padding: '16px 48px 16px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white', fontSize: '1rem', color: 'black' }}
                            />
                            <button
                                onClick={searchBusinesses}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
                            >
                                {loading ? '...' : '🔍'}
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', maxHeight: '250px', overflowY: 'auto' }}>
                                {searchResults.map((biz) => (
                                    <button
                                        key={biz.placeId}
                                        onClick={() => setSelectedBusiness(biz)}
                                        className="glass"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', textAlign: 'left',
                                            border: selectedBusiness?.placeId === biz.placeId ? '2px solid var(--primary)' : '1px solid transparent',
                                            background: selectedBusiness?.placeId === biz.placeId ? 'rgba(99, 102, 241, 0.05)' : 'white'
                                        }}
                                    >
                                        <div style={{ fontSize: '1.25rem' }}>📍</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'black' }}>{biz.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{biz.address}</div>
                                        </div>
                                        {biz.rating && <span style={{ marginLeft: 'auto', color: '#ffb700', fontSize: '0.875rem' }}>{biz.rating} ★</span>}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (selectedBusiness) {
                                    setStep(2);
                                } else if (query) {
                                    // Manual entry fallback
                                    setSelectedBusiness({
                                        name: query,
                                        placeId: 'manual_' + Math.random().toString(36).substr(2, 9),
                                        address: 'Manual Entry Location',
                                        rating: 5.0
                                    });
                                    setStep(2);
                                } else {
                                    searchBusinesses();
                                }
                            }}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading && !query}
                        >
                            {selectedBusiness ? 'Confirm Selection' : query ? 'Continue with this name' : 'Search Business'}
                        </button>

                        {query && !loading && searchResults.length === 0 && (
                            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Business not found? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => {
                                    setSelectedBusiness({ name: query, placeId: 'manual_loc', address: 'Custom Location', rating: 5.0 });
                                    setStep(2);
                                }}>Enter details manually</span>
                            </p>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>✨</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Ready to analyze</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We found <strong>{selectedBusiness.name}</strong>. We'll pull your public reviews and prepare your dashboard.</p>

                        <div className="glass" style={{ padding: '24px', borderRadius: '20px', marginBottom: '32px', textAlign: 'left', background: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                    {selectedBusiness.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'black' }}>{selectedBusiness.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedBusiness.address}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Platforms</div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span title="Google Maps">🔵</span>
                                        <span title="Yelp" style={{ opacity: 0.3 }}>🔴</span>
                                        <span title="Facebook" style={{ opacity: 0.3 }}>🔵</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg. Rating</div>
                                    <div style={{ color: '#ffb700', fontWeight: 700 }}>{selectedBusiness.rating || 'N/A'} ★</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleContinue}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Fetching Reviews...' : 'Confirm & Go to Dashboard'}
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No Google account login required to see your data.</p>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🚀</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Dashboard Ready!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We've successfully pulled your latest reviews. Your AI assistant is ready.</p>

                        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '24px', borderRadius: '20px', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '0.875rem' }}>Next steps:</div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ color: 'var(--success)' }}>✓</div>
                                <div style={{ fontSize: '0.875rem' }}>Analyze reviews with AI</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ color: 'var(--success)' }}>✓</div>
                                <div style={{ fontSize: '0.875rem' }}>Check sentiment analysis</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: 'var(--primary)' }}>🔒</div>
                                <div style={{ fontSize: '0.875rem' }}>Connect official account to post replies (Unlock later)</div>
                            </div>
                        </div>

                        <button
                            onClick={enterDashboard}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                        >
                            Enter My Dashboard
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
