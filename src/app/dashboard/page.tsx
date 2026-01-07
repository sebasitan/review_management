'use client';

import { useState } from 'react';
import styles from "./dashboard.module.css";
import AIResponseModal from "@/components/dashboard/AIResponseModal";
import ManualReplyModal from "@/components/dashboard/ManualReplyModal";

const mockStats = [
    { label: "Average Rating", value: "4.8", trend: "+0.2", trendUp: true, icon: "⭐" },
    { label: "Total Reviews", value: "1,284", trend: "+12%", trendUp: true, icon: "💬" },
    { label: "Response Rate", value: "98.2%", trend: "+2.1%", trendUp: true, icon: "⚡" },
    { label: "Sentiment Score", value: "92/100", trend: "+5", trendUp: true, icon: "😊" },
];

const initialReviews = [
    {
        id: "1",
        author: "James Wilson",
        rating: 5,
        content: "Absolutely amazing experience! The staff was incredibly helpful and the service was top-notch. Highly recommend to everyone looking for quality.",
        platform: "Google",
        date: "2 hours ago",
        status: "replied",
    },
    {
        id: "2",
        author: "Sarah Jenkins",
        rating: 4,
        content: "Great service overall. Had a minor delay with my order but the team handled it professionally. Will definitely come back again.",
        platform: "Yelp",
        date: "5 hours ago",
        status: "pending",
    },
    {
        id: "3",
        author: "Michael Chen",
        rating: 5,
        content: "The best in the business. Very professional and detail-oriented. Worth every penny spent here.",
        platform: "Facebook",
        date: "Yesterday",
        status: "replied",
    }
];

export default function DashboardPage() {
    const [reviews, setReviews] = useState(initialReviews);
    const [selectedReview, setSelectedReview] = useState<any>(null); // For AI
    const [manualReview, setManualReview] = useState<any>(null);   // For Manual

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
            <div className={styles.grid}>
                {mockStats.map((stat, i) => (
                    <div key={i} className={`${styles.statCard} glass`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            <span className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Reviews</h2>
                        <button className="gradient-text" style={{ fontSize: '0.875rem', fontWeight: 600 }}>View all</button>
                    </div>

                    <div className={styles.reviewList}>
                        {reviews.map((review) => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.authorInfo}>
                                        <div className={styles.authorAvatar}>
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div className={styles.authorName}>{review.author}</div>
                                            <div className={styles.reviewMeta}>{review.platform} • {review.date}</div>
                                        </div>
                                    </div>
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ opacity: i < review.rating ? 1 : 0.2 }}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className={styles.reviewText}>{review.content}</p>
                                <div className={styles.reviewFooter}>
                                    {review.status === 'replied' ? (
                                        <div className={styles.aiBadge}>
                                            <span>🤖</span> Replied
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setSelectedReview(review)}
                                                className={`${styles.primaryBtn} ${styles.btnSm}`}
                                            >
                                                Generate AI Response
                                            </button>
                                            <button
                                                onClick={() => setManualReview(review)}
                                                className={`${styles.secondaryBtn} ${styles.btnSm}`}
                                            >
                                                Manual Reply
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`${styles.statCard} glass`} style={{ height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '20px' }}>Platform Distribution</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>Google Maps</span>
                                <span style={{ fontWeight: 600 }}>65%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: '65%', height: '100%', background: '#4285F4', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>Yelp</span>
                                <span style={{ fontWeight: 600 }}>25%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: '25%', height: '100%', background: '#FF1A1A', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>Facebook</span>
                                <span style={{ fontWeight: 600 }}>10%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: '10%', height: '100%', background: '#1877F2', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px dashed var(--primary)' }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>AI Tip 💡</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Your Google reviews are growing 2x faster than Yelp. Focus on requesting more Yelp reviews to balance your local SEO.
                        </p>
                    </div>
                </section>
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
