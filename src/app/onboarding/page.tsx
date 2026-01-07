'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export default function OnboardingPage() {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [syncProgress, setSyncProgress] = useState(0);
    const router = useRouter();

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/google/locations');
            const data = await res.json();
            if (Array.isArray(data)) {
                setLocations(data);
                if (data.length > 0) {
                    setStep(3); // Go to location selection
                } else {
                    alert("No Google Business locations found for this account. Make sure you have a business set up on Google Maps.");
                    setStep(2);
                }
            } else if (data.error) {
                // If scope is missing, we might need to re-auth
                console.error("Fetch Locations Error:", data.error);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!businessName) return alert('Please enter a business name');
            setStep(2);
        } else if (step === 2) {
            // This step is "Connect Google"
            await fetchLocations();
        } else if (step === 3) {
            if (!selectedLocation) return alert('Please select a business location');
            setStep(4);
        } else if (step === 4) {
            setLoading(true);
            try {
                // 1. Create Business
                const onbRes = await fetch('/api/onboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessName, googlePlaceId: selectedLocation.id }),
                });

                if (!onbRes.ok) throw new Error("Failed to create business");
                const onbData = await onbRes.json();
                const businessId = onbData.business?.id;

                // 2. Sync Reviews
                setSyncProgress(20);
                const syncRes = await fetch('/api/google/sync-reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ locationName: selectedLocation.id, businessId }),
                });

                if (syncRes.ok) {
                    setSyncProgress(100);
                    router.push('/dashboard');
                } else {
                    alert('Business created, but review sync failed. You can sync later from the dashboard.');
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error(error);
                alert('Something went wrong. Please try again.');
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.main} style={{ background: 'var(--background)', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '48px', borderRadius: '32px', textAlign: 'center' }}>

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
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Connect Google Business</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We need official permission to manage your reviews and pull your full history.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
                                className="glass"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderRadius: '16px', textAlign: 'left', fontWeight: 600, border: '2px solid var(--primary)' }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>G</span>
                                <div>
                                    <div style={{ fontSize: '1rem' }}>Connect Official Google Profile</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7 }}>Recommended for automated replies</div>
                                </div>
                                <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>Connect ➔</span>
                            </button>

                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                Use the same account that manages your business on Google Maps.
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className={styles.secondaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Checking connection...' : 'I already connected, continue'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🗺️</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Select Your Location</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We found {locations.length} businesses in your Google account. Which one should we sync?</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => setSelectedLocation(loc)}
                                    className="glass"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', textAlign: 'left', fontWeight: 600,
                                        border: selectedLocation?.id === loc.id ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                        background: selectedLocation?.id === loc.id ? 'rgba(99, 102, 241, 0.05)' : 'white'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.9375rem', color: 'black' }}>{loc.name}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{loc.address}</div>
                                    </div>
                                    {selectedLocation?.id === loc.id && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>✓</span>}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                        >
                            Confirm Selection
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🚀</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Finalizing Setup</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We're importing your official history for <strong>{selectedLocation?.name}</strong>.</p>

                        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginBottom: '16px', overflow: 'hidden' }}>
                            <div style={{ width: `${syncProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                        </div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary)', marginBottom: '40px' }}>
                            {syncProgress < 100 ? 'Syncing historical reviews...' : 'All caught up!'}
                        </p>

                        <button
                            onClick={handleNext}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Entering Dashboard...' : 'Enter Dashboard'}
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
