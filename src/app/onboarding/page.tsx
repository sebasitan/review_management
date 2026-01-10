'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Business = {
    name: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    placeId: string;
    source: string;
    googleMapUrl: string;
};

export default function OnboardingPage() {
    const { status } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    // Get user's location for better search results
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    }, []);

    // Debounced search using Geoapify Autocomplete
    const searchBusinesses = useCallback(
        async (searchText: string) => {
            if (!searchText || searchText.length < 3) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            setError('');

            try {
                let url = `/api/geoapify/autocomplete?text=${encodeURIComponent(searchText)}`;
                if (location) {
                    url += `&lat=${location.lat}&lon=${location.lng}`;
                }

                const res = await fetch(url);
                if (!res.ok) throw new Error('Search failed');

                const data = await res.json();
                setSearchResults(data);
            } catch (err) {
                console.error('Search failed:', err);
                setError('Search failed. Please try again.');
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        },
        [location]
    );

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            searchBusinesses(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, searchBusinesses]);

    // STRICT: User MUST select from dropdown
    const handleBusinessSelect = (business: Business) => {
        setSelectedBusiness(business);
        setStep(2);
        setSearchResults([]);
        setQuery('');
    };

    // Step 2: Save business to database
    const handleConfirmAndSave = async () => {
        if (!selectedBusiness) {
            alert('No business selected');
            return;
        }

        // Validation: Ensure required fields exist
        if (!selectedBusiness.name || !selectedBusiness.address || !selectedBusiness.lat || !selectedBusiness.lng) {
            alert('Invalid business data. Please select again.');
            setStep(1);
            return;
        }

        setLoading(true);
        setError('');

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
                    source: selectedBusiness.source,
                    googleMapUrl: selectedBusiness.googleMapUrl,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setCreatedBusinessId(data.business.id);
                setStep(3);
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to save business profile. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={styles.main}
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            {/* Progress Indicator */}
            <div style={{ position: 'absolute', top: '40px', display: 'flex', gap: '8px' }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '40px',
                            height: '4px',
                            borderRadius: '2px',
                            background: step >= i ? '#6366f1' : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>

            <div
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '580px',
                    padding: '48px',
                    borderRadius: '32px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* STEP 1: FIND YOUR BUSINESS (STRICT) */}
                {step === 1 && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                padding: '16px',
                                borderRadius: '20px',
                                background: 'rgba(99, 102, 241, 0.2)',
                                color: '#818cf8',
                                marginBottom: '24px',
                                fontSize: '2rem',
                            }}
                        >
                            📍
                        </div>
                        <h1
                            style={{
                                fontSize: '2.25rem',
                                fontWeight: 800,
                                color: '#f1f5f9',
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Find your business
                        </h1>
                        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
                            Search for your business using our location finder. You must select from the dropdown results.
                        </p>

                        {/* Search Input */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b',
                                    fontSize: '1.25rem',
                                }}
                            >
                                🔍
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your business name or address..."
                                style={{
                                    width: '100%',
                                    padding: '18px 48px 18px 52px',
                                    borderRadius: '16px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    fontSize: '1.1rem',
                                    color: '#f1f5f9',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                            />
                            {loading && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderTopColor: '#6366f1',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                    }}
                                />
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#fca5a5',
                                    marginBottom: '20px',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Dropdown Results - STRICT SELECTION ONLY */}
                        {searchResults.length > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    marginBottom: '24px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    padding: '4px',
                                }}
                            >
                                {searchResults.map((biz, index) => (
                                    <button
                                        key={biz.placeId || index}
                                        onClick={() => handleBusinessSelect(biz)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            textAlign: 'left',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(15, 23, 42, 0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#6366f1';
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem' }}>🏢</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: '4px' }}>
                                                {biz.name}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{biz.address}</div>
                                            {biz.city && biz.country && (
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                                    {biz.city}, {biz.country}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No Results Message */}
                        {!loading && query.length >= 3 && searchResults.length === 0 && (
                            <div
                                style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px dashed rgba(59, 130, 246, 0.3)',
                                    textAlign: 'center',
                                    color: '#93c5fd',
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔎</div>
                                <p style={{ fontSize: '0.95rem', margin: 0 }}>
                                    No results found. Try different keywords or check your spelling.
                                </p>
                            </div>
                        )}

                        {/* Help Text */}
                        {query.length < 3 && (
                            <div
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    fontSize: '0.875rem',
                                    color: '#93c5fd',
                                }}
                            >
                                💡 Type at least 3 characters to search for your business
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: CONFIRM BUSINESS (READ-ONLY) */}
                {step === 2 && selectedBusiness && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                padding: '16px',
                                borderRadius: '20px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#6ee7b7',
                                marginBottom: '24px',
                                fontSize: '2rem',
                            }}
                        >
                            ✨
                        </div>
                        <h1
                            style={{
                                fontSize: '2.25rem',
                                fontWeight: 800,
                                color: '#f1f5f9',
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Confirm your business
                        </h1>
                        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
                            Please verify the business information below is correct.
                        </p>

                        {/* READ-ONLY Business Info Display */}
                        <div
                            style={{
                                background: 'rgba(15, 23, 42, 0.5)',
                                padding: '28px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: '24px',
                            }}
                        >
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Business Name
                                </label>
                                <div
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#f1f5f9',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {selectedBusiness.name}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        display: 'block',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Full Address
                                </label>
                                <div
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        fontSize: '1rem',
                                        color: '#cbd5e1',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {selectedBusiness.address}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: '#64748b',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'block',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        City
                                    </label>
                                    <div
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            fontSize: '1rem',
                                            color: '#cbd5e1',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        {selectedBusiness.city || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: '#64748b',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'block',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        Country
                                    </label>
                                    <div
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            fontSize: '1rem',
                                            color: '#cbd5e1',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        {selectedBusiness.country || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Link */}
                        <a
                            href={selectedBusiness.googleMapUrl}
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
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: '#93c5fd',
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '2px solid rgba(59, 130, 246, 0.3)',
                                marginBottom: '24px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            🗺️ Open in Google Maps
                        </a>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedBusiness(null);
                                }}
                                style={{
                                    padding: '16px 24px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleConfirmAndSave}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '18px',
                                    borderRadius: '16px',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    background: loading ? '#475569' : '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loading ? 'Saving...' : 'Confirm & Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS */}
                {step === 3 && selectedBusiness && (
                    <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🚀</div>
                        <h1
                            style={{
                                fontSize: '2.25rem',
                                fontWeight: 800,
                                color: '#f1f5f9',
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Profile Ready!
                        </h1>
                        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6, fontSize: '1.1rem' }}>
                            Your business profile for <strong style={{ color: '#6ee7b7' }}>{selectedBusiness.name}</strong> has been created.
                        </p>

                        {/* Google-Safe Compliance Notice */}
                        <div
                            style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                padding: '20px',
                                borderRadius: '16px',
                                marginBottom: '32px',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#93c5fd', lineHeight: 1.6 }}>
                                💡 <strong>Important:</strong> Reviews are managed on Google Maps. We provide tools to help you request reviews from customers and generate AI-powered reply drafts.
                            </p>
                        </div>

                        {/* Next Steps */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div
                                style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    textAlign: 'left',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📧</div>
                                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#f1f5f9' }}>Request Reviews</div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Send review requests via WhatsApp, SMS, or Email</p>
                            </div>
                            <div
                                style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    textAlign: 'left',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🤖</div>
                                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#f1f5f9' }}>AI Assistant</div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Generate professional reply drafts with AI</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(createdBusinessId ? `/dashboard?businessId=${createdBusinessId}` : '/dashboard')}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '16px',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes spin {
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
        .glass {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
        </div>
    );
}
