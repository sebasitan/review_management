'use client';

import { useState } from 'react';
import styles from "../dashboard.module.css";
import AIResponseModal from "@/components/dashboard/AIResponseModal";
import ManualReplyModal from "@/components/dashboard/ManualReplyModal";

const allReviews = [
    { id: "1", author: "James Wilson", rating: 5, content: "Absolutely amazing experience! The staff was incredibly helpful and the service was top-notch. Highly recommend to everyone looking for quality.", platform: "Google", date: "2 hours ago", status: "replied", sentiment: 'positive' },
    { id: "2", author: "Sarah Jenkins", rating: 4, content: "Great service overall. Had a minor delay with my order but the team handled it professionally. Will definitely come back again.", platform: "Yelp", date: "5 hours ago", status: "pending", sentiment: 'neutral' },
    { id: "3", author: "Michael Chen", rating: 5, content: "The best in the business. Very professional and detail-oriented. Worth every penny spent here.", platform: "Facebook", date: "Yesterday", status: "replied", sentiment: 'positive' },
    { id: "4", author: "Robert Taylor", rating: 2, content: "Service was slow and the prices are quite high. Not sure if I will return.", platform: "Google", date: "2 days ago", status: "pending", sentiment: 'negative' },
    { id: "5", author: "Emily Davis", rating: 4, content: "Love the atmosphere and the selection of products. Definitely a 4.5 star experience.", platform: "Google", date: "3 days ago", status: "replied", sentiment: 'positive' },
];

export default function ReviewsPage() {
    const [filter, setFilter] = useState('all');
    const [reviews, setReviews] = useState(allReviews);
    const [selectedReview, setSelectedReview] = useState<any>(null); // AI
    const [manualReview, setManualReview] = useState<any>(null);   // Manual

    const filteredReviews = reviews.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'pending') return r.status === 'pending';
        if (filter === 'negative') return r.rating <= 3;
        return true;
    });

    const handlePostResponse = (response: string) => {
        // Update either AI or Manual target
        const targetId = selectedReview?.id || manualReview?.id;
        if (!targetId) return;

        setReviews(prev => prev.map(r =>
            r.id === targetId ? { ...r, status: 'replied' } : r
        ));
        setSelectedReview(null);
        setManualReview(null);
        console.log(`Posted response for review ${targetId}: ${response}`);
    };

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
