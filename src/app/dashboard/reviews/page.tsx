'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import styles from "../dashboard.module.css";

function ReviewsContent() {
    const { data: session }: any = useSession();
    const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE');
    const [isConnected, setIsConnected] = useState(false);
    const [isLocationConnected, setIsLocationConnected] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                setPlan(data.plan);
                setIsConnected(data.isGoogleConnected);
                setIsLocationConnected(data.isLocationConnected);
                setLoading(false);

                if (data.plan === 'PRO' && data.isLocationConnected) {
                    fetchReviews(data.businessId);
                } else if (data.plan === 'PRO' && data.isGoogleConnected) {
                    fetchAccounts();
                }
            });
    }, []);

    const fetchReviews = (businessId: string) => {
        fetch(`/api/google/reviews?businessId=${businessId}`)
            .then(res => res.json())
            .then(data => setReviews(data));
    };

    const fetchAccounts = () => {
        fetch('/api/google/accounts')
            .then(res => res.json())
            .then(data => setAccounts(data.accounts || []));
    };

    const fetchLocations = (accountName: string) => {
        setSelectedAccount(accountName);
        fetch(`/api/google/locations?accountName=${accountName}`)
            .then(res => res.json())
            .then(data => setLocations(data.locations || []));
    };

    const connectLocation = async (loc: any) => {
        const profile = await (await fetch('/api/user/profile')).json();
        const res = await fetch('/api/google/locations/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessId: profile.businessId,
                googleAccountId: selectedAccount?.split('/')[1],
                locationId: loc.name.split('/')[3],
                locationName: loc.title,
                accountId: profile.googleAccountId
            })
        });

        if (res.ok) {
            setIsLocationConnected(true);
            fetchReviews(profile.businessId);
        }
    };

    const syncReviews = async () => {
        setSyncing(true);
        const profile = await (await fetch('/api/user/profile')).json();
        await fetch('/api/google/reviews/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessId: profile.businessId })
        });
        fetchReviews(profile.businessId);
        setSyncing(false);
    };

    const postReply = async (reviewId: string) => {
        const res = await fetch('/api/google/reviews/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId, comment: replyText })
        });

        if (res.ok) {
            const profile = await (await fetch('/api/user/profile')).json();
            fetchReviews(profile.businessId);
            setReplyingTo(null);
            setReplyText('');
        }
    };

    const handleConnectGoogle = async () => {
        const res = await fetch('/api/google/auth/url');
        const { url } = await res.json();
        window.location.href = url;
    };

    if (loading) return <div>Loading...</div>;

    if (plan === 'FREE') {
        return (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px' }}>⭐</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Premium Feature</h2>
                <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                    Connect your Google Business Profile to fetch and manage real reviews directly from your dashboard.
                </p>
                <button className={styles.primaryBtn} style={{ background: '#6366f1' }}>Upgrade to PRO</button>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Connect Google Business Profile</h2>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>
                    To view and manage your Google reviews, connect your Google Business Profile.<br />
                    We only access data for businesses you own or manage.
                </p>
                <button onClick={handleConnectGoogle} className={styles.primaryBtn} style={{ background: '#4285F4' }}>
                    Connect Google Business
                </button>
            </div>
        );
    }

    if (!isLocationConnected) {
        return (
            <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Select Your Business Location</h2>

                {!selectedAccount ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {accounts.map(acc => (
                            <button key={acc.name} onClick={() => fetchLocations(acc.name)} className={styles.secondaryBtn} style={{ textAlign: 'left', padding: '20px' }}>
                                <strong>{acc.accountName}</strong>
                                <span style={{ fontSize: '0.8rem', display: 'block', opacity: 0.7 }}>Account Type: {acc.type}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <button onClick={() => setSelectedAccount(null)} style={{ border: 'none', background: 'none', color: '#6366f1', cursor: 'pointer', marginBottom: '12px', fontWeight: 600 }}>← Back to Accounts</button>
                        {locations.map(loc => (
                            <button key={loc.name} onClick={() => connectLocation(loc)} className={styles.secondaryBtn} style={{ textAlign: 'left', padding: '20px' }}>
                                <strong>{loc.title}</strong>
                                <span style={{ fontSize: '0.8rem', display: 'block', opacity: 0.7 }}>{loc.storefrontAddress?.addressLines?.join(', ')}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Google Reviews</h1>
                    <p style={{ color: '#64748b' }}>Manage your real-time Google Business reviews.</p>
                </div>
                <button onClick={syncReviews} disabled={syncing} className={styles.secondaryBtn} style={{ border: '1px solid #e2e8f0' }}>
                    {syncing ? 'Syncing...' : '🔄 Refresh Reviews'}
                </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {reviews.map(rev => (
                    <div key={rev.id} className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{rev.reviewerName}</div>
                            <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                        </div>
                        <p style={{ color: '#475569', marginBottom: '20px', lineHeight: 1.6 }}>{rev.comment || '(No comment)'}</p>

                        {rev.reply ? (
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>YOUR REPLY</div>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{rev.reply}</p>
                            </div>
                        ) : (
                            <div>
                                {replyingTo === rev.reviewId ? (
                                    <div style={{ marginTop: '12px' }}>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply..."
                                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px', marginBottom: '12px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => postReply(rev.reviewId)} className={styles.primaryBtn} style={{ padding: '8px 16px', background: '#6366f1' }}>Post Reply</button>
                                            <button onClick={() => setReplyingTo(null)} className={styles.secondaryBtn} style={{ padding: '8px 16px' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => setReplyingTo(rev.reviewId)} className={styles.secondaryBtn} style={{ color: '#6366f1', borderColor: 'transparent', padding: '0', background: 'none', fontWeight: 600 }}>
                                        Reply to this review →
                                    </button>
                                )}
                            </div>
                        )}
                        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
                            Received on {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewsContent />
        </Suspense>
    );
}
