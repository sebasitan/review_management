'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import styles from "../dashboard.module.css";

function ReviewsInbox() {
    const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE');
    const [isConnected, setIsConnected] = useState(false);
    const [isLocationConnected, setIsLocationConnected] = useState(false);
    const [businessId, setBusinessId] = useState<string | null>(null);

    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isPostingReply, setIsPostingReply] = useState(false);

    const loadProfile = useCallback(async () => {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        setPlan(data.plan);
        setIsConnected(data.isGoogleConnected);
        setIsLocationConnected(data.isLocationConnected);
        setBusinessId(data.businessId);
        return data;
    }, []);

    const fetchReviews = useCallback(async (bId: string, currentFilter: string, currentPage: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/google/reviews?businessId=${bId}&filter=${currentFilter}&page=${currentPage}`);
            const data = await res.json();
            setReviews(data.reviews || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile().then(data => {
            if (data.plan === 'PRO' && data.isLocationConnected) {
                fetchReviews(data.businessId, filter, page);
            } else {
                setLoading(false);
            }
        });
    }, [filter, page, fetchReviews, loadProfile]);

    const handleSync = async () => {
        if (!businessId) return;
        setSyncing(true);
        await fetch('/api/google/reviews/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessId })
        });
        await fetchReviews(businessId, filter, 1);
        setPage(1);
        setSyncing(false);
    };

    const handlePostReply = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setIsPostingReply(true);
        const res = await fetch('/api/google/reviews/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId, comment: replyText })
        });

        if (res.ok) {
            setReplyingTo(null);
            setReplyText('');
            if (businessId) fetchReviews(businessId, filter, page);
        }
        setIsPostingReply(false);
    };

    if (loading && reviews.length === 0) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    if (plan === 'FREE') {
        return (
            <div className="glass" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '32px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>📥</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>Review Inbox</h2>
                <p style={{ color: '#64748b', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Unlock the **Review Inbox** to fetch real-time Google reviews and reply directly from your dashboard.
                </p>
                <button className={styles.primaryBtn} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '16px 40px', fontSize: '1.1rem' }}>
                    Upgrade to PRO
                </button>
            </div>
        );
    }

    if (!isConnected || !isLocationConnected) {
        return (
            <div className="glass" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '32px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🗺️</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#1e293b' }}>Connect Your Business</h2>
                <p style={{ color: '#64748b', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', fontSize: '1.1rem' }}>
                    Connect your Google Business Profile to start managing your location reviews.
                </p>
                <button
                    onClick={() => window.location.href = '/dashboard/settings'}
                    className={styles.primaryBtn}
                    style={{ background: '#4285F4', padding: '16px 40px' }}
                >
                    Connect Google Business
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Review Inbox</h1>
                    <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
                        Manage and respond to real-time Google reviews.
                    </p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={styles.secondaryBtn}
                    style={{ background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                >
                    {syncing ? 'Syncing...' : '🔄 Sync Reviews'}
                </button>
            </div>

            {/* Compliance Note */}
            <div style={{ background: '#f8fafc', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', fontSize: '0.9rem', color: '#64748b' }}>
                💡 Reviews are fetched from Google Business Profile for businesses you own or manage.
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[
                    { id: 'all', label: 'All Reviews', icon: '📁' },
                    { id: 'unreplied', label: 'Needs Reply', icon: '🔴' },
                    { id: 'low_rating', label: '1–3 Stars', icon: '⚠️' },
                    { id: 'recent', label: 'Last 30 Days', icon: '⏳' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => { setFilter(f.id); setPage(1); }}
                        style={{
                            padding: '10px 20px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600,
                            background: filter === f.id ? '#6366f1' : 'white',
                            color: filter === f.id ? 'white' : '#64748b',
                            border: '1px solid',
                            borderColor: filter === f.id ? '#6366f1' : '#e2e8f0',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                    >
                        <span>{f.icon}</span> {f.label}
                    </button>
                ))}
            </div>

            {/* Inbox List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>No reviews found</h3>
                        <p style={{ color: '#64748b' }}>Try changing your filters or sync with Google.</p>
                    </div>
                ) : (
                    reviews.map(rev => (
                        <div key={rev.id} className="glass" style={{
                            padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0',
                            background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                            position: 'relative'
                        }}>
                            {/* Status Tag */}
                            <div style={{
                                position: 'absolute', top: '32px', right: '32px',
                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                background: rev.replied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: rev.replied ? '#16a34a' : '#ef4444'
                            }}>
                                {rev.replied ? 'REPLIED' : 'NEEDS REPLY'}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem', fontWeight: 800, color: '#6366f1'
                                }}>
                                    {rev.reviewerName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1e293b', marginBottom: '4px' }}>
                                        {rev.reviewerName}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', fontSize: '1.1rem' }}>
                                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto', marginRight: '100px', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            <p style={{
                                fontSize: '1.05rem', lineHeight: 1.6, color: '#475569',
                                marginBottom: rev.replied ? '24px' : '32px', whiteSpace: 'pre-wrap'
                            }}>
                                {rev.comment || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No comment provided.</span>}
                            </p>

                            {rev.replied ? (
                                <div style={{
                                    background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute', top: '-10px', left: '24px',
                                        background: 'white', padding: '0 8px', fontSize: '0.7rem',
                                        fontWeight: 800, color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px'
                                    }}>
                                        YOUR REPLY
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>{rev.reply}</p>
                                    {rev.repliedAt && (
                                        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            Replied on {new Date(rev.repliedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                                    {replyingTo === rev.reviewId ? (
                                        <div style={{ animation: 'fadeIn 0.2s ease' }}>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Craft your professional response here..."
                                                style={{
                                                    width: '100%', padding: '16px', borderRadius: '16px',
                                                    border: '1px solid #e2e8f0', minHeight: '120px',
                                                    marginBottom: '16px', fontSize: '0.95rem', background: '#fafafa',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => handlePostReply(rev.reviewId)}
                                                    disabled={isPostingReply || !replyText.trim()}
                                                    className={styles.primaryBtn}
                                                    style={{ background: '#6366f1', padding: '10px 24px' }}
                                                >
                                                    {isPostingReply ? 'Posting...' : 'Post Reply to Google'}
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                    className={styles.secondaryBtn}
                                                    style={{ padding: '10px 24px' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setReplyingTo(rev.reviewId)}
                                            className={styles.secondaryBtn}
                                            style={{
                                                color: '#6366f1', borderColor: '#e0e7ff', background: '#f5f7ff',
                                                fontWeight: 700, padding: '10px 24px', width: 'fit-content'
                                            }}
                                        >
                                            ✍️ Write a Reply
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px', marginBottom: '40px' }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className={styles.secondaryBtn}
                        style={{ padding: '8px 16px', opacity: page === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>
                        Page {page} of {pagination.pages}
                    </span>
                    <button
                        disabled={page === pagination.pages}
                        onClick={() => setPage(p => p + 1)}
                        className={styles.secondaryBtn}
                        style={{ padding: '8px 16px', opacity: page === pagination.pages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <Suspense fallback={<div>Loading Reviews...</div>}>
            <ReviewsInbox />
        </Suspense>
    );
}
