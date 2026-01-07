'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface ConnectGoogleModalProps {
    onClose: () => void;
    onConnected: (locationId: string) => void;
}

export default function ConnectGoogleModal({ onClose, onConnected }: ConnectGoogleModalProps) {
    const { data: session, status } = useSession();
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Intro, 2: Select Location

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/google/locations');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setLocations(data);
                setStep(2);
            } else {
                // If it fails, they might need to re-auth with correct scopes
                signIn('google', { callbackUrl: window.location.href });
            }
        } catch (error) {
            console.error("Fetch locations failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '32px', padding: '40px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                {step === 1 && (
                    <div>
                        <div style={{ fontSize: '3.5rem', marginBottom: '24px' }}>🛡️</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>Official Connection</h2>
                        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
                            To post replies directly to Google Maps, we need official permission from your Google Business account.
                        </p>

                        <button
                            onClick={fetchLocations}
                            style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}
                        >
                            {loading ? 'Fetching Locations...' : 'Connect Google Profile'}
                        </button>

                        <button onClick={onClose} style={{ marginTop: '16px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Maybe Later</button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>📍</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>Select Your Location</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Choose the Google Map listing you want to link to this dashboard.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', padding: '4px', marginBottom: '32px' }}>
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => onConnected(loc.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{loc.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{loc.address}</div>
                                    </div>
                                    <div style={{ color: 'var(--primary)' }}>→</div>
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setStep(1)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Back</button>
                    </div>
                )}

            </div>

            <style jsx>{`
                @keyframes scaleUp {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
