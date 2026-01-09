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
    const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
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
            address: '',
            city: '',
            country: '',
            lat: location?.lat || 0,
            lng: location?.lng || 0,
            placeId: 'manual_' + Math.random().toString(36).substr(2, 9)
        });
        setStep(2);
    };

    const handleContinue = async () => {
        if (!selectedBusiness?.name || !selectedBusiness?.address) {
            return alert('Please select a business with a valid address or enter details manually');
        }

        setLoading(true);
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: selectedBusiness.name,
                    address: selectedBusiness.address,
                    city: selectedBusiness.city,
                    country: selectedBusiness.country,
                    lat: selectedBusiness.lat,
                    lng: selectedBusiness.lng,
                    placeId: selectedBusiness.placeId,
                    googleMapUrl: selectedBusiness.googleMapUrl
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setCreatedBusinessId(data.business.id);
                setStep(3);
            } else {
                alert('Failed to save business profile. Please try again.');
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
                    <div key={i} style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= i ? '#6366f1' : '#cbd5e1', transition: 'all 0.3s ease' }} />
                ))}
            </div>

            <div className="glass" style={{ width: '100%', maxWidth: '540px', padding: '40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>

                {step === 1 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', marginBottom: '24px', fontSize: '2rem' }}>📍</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Find your business</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>Search for your business profile to get started.</p>

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
                            {loading && <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                        </div>

                        {searchResults.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
                                {searchResults.map((biz) => (
                                    <button
                                        key={biz.placeId}
                                        onClick={() => { setSelectedBusiness(biz); setStep(2); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', textAlign: 'left', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    >
                                        <div style={{ fontSize: '1.25rem' }}>🏢</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{biz.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{biz.address}</div>
                                        </div>
                                    </button>
                                ))}
                                <button onClick={handleManualEntry} style={{ color: '#6366f1', background: 'none', border: 'none', padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>None of these? Add manually →</button>
                            </div>
                        ) : (
                            <button
                                onClick={searchBusinesses}
                                className={styles.primaryBtn}
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}
                                disabled={loading || !query}
                            >
                                Search Business
                            </button>
                        )}

                        {!loading && searchResults.length === 0 && query && (
                            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', cursor: 'pointer' }} onClick={handleManualEntry}>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Don't see your business? <span style={{ color: '#6366f1', fontWeight: 700 }}>Click here to enter details manually</span>.</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px', fontSize: '2rem' }}>✨</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Confirm Business</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>Please verify your business information below.</p>

                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Business Name</label>
                                <input
                                    type="text"
                                    value={selectedBusiness?.name || ''}
                                    onChange={(e) => setSelectedBusiness({ ...selectedBusiness, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Address</label>
                                <input
                                    type="text"
                                    value={selectedBusiness?.address || ''}
                                    onChange={(e) => setSelectedBusiness({ ...selectedBusiness, address: e.target.value })}
                                    placeholder="Enter full address"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#475569' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>City</label>
                                    <input
                                        type="text"
                                        value={selectedBusiness?.city || ''}
                                        onChange={(e) => setSelectedBusiness({ ...selectedBusiness, city: e.target.value })}
                                        placeholder="City"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#475569' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Country</label>
                                    <input
                                        type="text"
                                        value={selectedBusiness?.country || ''}
                                        onChange={(e) => setSelectedBusiness({ ...selectedBusiness, country: e.target.value })}
                                        placeholder="Country"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#475569' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Google Maps Link (Optional)</label>
                                <input
                                    type="text"
                                    value={selectedBusiness?.googleMapUrl || ''}
                                    onChange={(e) => setSelectedBusiness({ ...selectedBusiness, googleMapUrl: e.target.value })}
                                    placeholder="Paste your business Google Maps link here"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#475569' }}
                                />
                            </div>
                        </div>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${selectedBusiness?.lat},${selectedBusiness?.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                background: 'white',
                                color: '#1e293b',
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '2px solid #e2e8f0',
                                marginBottom: '24px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            🗺️ Open in Google Maps
                        </a>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '16px 24px', borderRadius: '16px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Back</button>
                            <button
                                onClick={handleContinue}
                                style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Confirm & Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🚀</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Profile Ready!</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>Your business profile for <strong>{selectedBusiness?.name}</strong> has been created.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div className="glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🔄</div>
                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Sync Reviews</div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>Import your existing reviews to get started.</p>
                                <button
                                    onClick={async () => {
                                        try {
                                            await fetch('/api/reviews', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ businessId: createdBusinessId })
                                            });
                                            alert('Demo reviews synced!');
                                        } catch (e) { }
                                    }}
                                    style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Sync Demo Data →
                                </button>
                            </div>
                            <div className="glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📝</div>
                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Set Template</div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>Customize your review request message.</p>
                                <button
                                    onClick={() => router.push(`/dashboard/requests?businessId=${createdBusinessId}`)}
                                    style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Edit Template →
                                </button>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                                💡 <strong>Note:</strong> Ratings and reviews are managed directly on your Google Maps profile. We provide the tools to help you engage with customers and respond faster with AI.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push(createdBusinessId ? `/dashboard?businessId=${createdBusinessId}` : '/dashboard')}
                            style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 700, fontSize: '1.2rem', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Go to Dashboard
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
                .glass {
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
            `}</style>
        </div>
    );
}
