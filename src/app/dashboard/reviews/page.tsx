'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "../dashboard.module.css";
import AIResponseModal from "@/components/dashboard/AIResponseModal";
import ManualReplyModal from "@/components/dashboard/ManualReplyModal";

export default function ReviewsPage() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [filter, setFilter] = useState('all');
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<any>(null); // AI
    const [manualReview, setManualReview] = useState<any>(null);   // Manual
    const [isImporting, setIsImporting] = useState(false);

    const fetchReviews = async () => {
        if (!businessId) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/reviews?businessId=${businessId}`);
            const data = await res.json();

            // Map DB schema to UI schema
            const mappedReviews = data.map((r: any) => ({
                id: r.id,
                author: r.author,
                rating: r.rating,
                content: r.content,
                platform: r.platform.charAt(0) + r.platform.slice(1).toLowerCase(),
                date: new Date(r.date).toLocaleDateString(),
                status: r.reply ? 'replied' : 'pending',
                sentiment: r.rating >= 4 ? 'positive' : r.rating <= 2 ? 'negative' : 'neutral'
            }));

            setReviews(mappedReviews);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [businessId]);

    const handleImport = async () => {
        if (!businessId) return;
        setIsImporting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessId })
            });
            if (res.ok) {
                await fetchReviews();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsImporting(false);
        }
    }

    const filteredReviews = reviews.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'pending') return r.status === 'pending';
        if (filter === 'negative') return r.rating <= 3;
        if (filter === 'google') return r.platform === 'Google';
        if (filter === 'yelp') return r.platform === 'Yelp';
        if (filter === 'facebook') return r.platform === 'Facebook';
        return true;
    });

    const handlePostResponse = async (response: string) => {
        const targetId = selectedReview?.id || manualReview?.id;
        if (!targetId) return;

        try {
            // Optimistically update UI
            setReviews(prev => prev.map(r =>
                r.id === targetId ? { ...r, status: 'replied' } : r
            ));
            setSelectedReview(null);
            setManualReview(null);

            // In a real app, call an API to save the reply
            // await fetch(`/api/reviews/${targetId}/reply`, { method: 'POST', body: JSON.stringify({ response }) });
        } catch (error) {
            console.error("Failed to post response:", error);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="spinner" style={{
                width: '32px', height: '32px', border: '3px solid var(--primary)',
                borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
            }}></div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end' }}>
                <select
                    className="glass"
                    style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500, border: '1px solid var(--card-border)' }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Platforms</option>
                    <option value="google">Google</option>
                    <option value="yelp">Yelp</option>
                    <option value="facebook">Facebook</option>
                </select>
                <select
                    className="glass"
                    style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500, border: '1px solid var(--card-border)' }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Reviews</option>
                    <option value="pending">Pending Reply</option>
                    <option value="negative">Critical (1-3★)</option>
                </select>
                <button
                    onClick={handleImport}
                    className={styles.secondaryBtn}
                    disabled={isImporting}
                    style={{ padding: '10px 16px', fontSize: '0.875rem' }}
                >
                    {isImporting ? 'Syncing...' : '🔄 Sync Reviews'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredReviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                        <div>
                            <div className={styles.reviewHeader} style={{ marginBottom: '12px' }}>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorAvatar}>{review.author.charAt(0)}</div>
                                    <div>
                                        <div className={styles.authorName}>{review.author}</div>
                                        <div className={styles.reviewMeta}>
                                            {review.platform} • {review.date} •
                                            <span style={{
                                                marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                                                background: review.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.1)' : review.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                                                color: review.sentiment === 'positive' ? 'var(--success)' : review.sentiment === 'negative' ? 'var(--error)' : 'var(--text-secondary)'
                                            }}>
                                                {review.sentiment.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className={styles.reviewText} style={{ marginBottom: '0' }}>{review.content}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                            <div className={styles.rating} style={{ justifyContent: 'flex-end', marginBottom: '8px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ opacity: i < review.rating ? 1 : 0.2, fontSize: '1.25rem' }}>★</span>
                                ))}
                            </div>
                            {review.status === 'replied' ? (
                                <div className={styles.aiBadge} style={{ alignSelf: 'flex-end' }}>
                                    <span>🤖</span> Replied
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedReview(review)}
                                        className={styles.primaryBtn}
                                        style={{ padding: '10px', fontSize: '0.8125rem' }}
                                    >
                                        AI Reply
                                    </button>
                                    <button
                                        onClick={() => setManualReview(review)}
                                        className={styles.secondaryBtn}
                                        style={{ padding: '10px', fontSize: '0.8125rem' }}
                                    >
                                        Manual Reply
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedReview && (
                <AIResponseModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                    onPost={handlePostResponse}
                />
            )}

            {manualReview && (
                <ManualReplyModal
                    review={manualReview}
                    onClose={() => setManualReview(null)}
                    onPost={handlePostResponse}
                />
            )}
        </div>
    );
}
