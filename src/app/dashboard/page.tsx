'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from "./dashboard.module.css";
import AIResponseModal from "@/components/dashboard/AIResponseModal";
import ManualReplyModal from "@/components/dashboard/ManualReplyModal";
import ConnectGoogleModal from "@/components/dashboard/ConnectGoogleModal";

const mockStats = [
    { label: "Average Rating", value: "4.8", trend: "+0.2", trendUp: true, icon: "⭐" },
    { label: "Total Reviews", value: "1,284", trend: "+12%", trendUp: true, icon: "💬" },
    { label: "Response Rate", value: "98.2%", trend: "+2.1%", trendUp: true, icon: "⚡" },
    { label: "Sentiment Score", value: "92/100", trend: "+5", trendUp: true, icon: "😊" },
];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [manualReview, setManualReview] = useState<any>(null);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsRes, statsRes] = await Promise.all([
                    fetch('/api/reviews'),
                    fetch('/api/stats')
                ]);

                const reviewsData = await reviewsRes.json();
                const statsData = await statsRes.json();

                if (Array.isArray(reviewsData)) {
                    setReviews(reviewsData);
                }
                setStats(statsData);
                setIsOfficial(statsData.isOfficial);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);

    const dashboardStats = stats ? [
        { label: "Average Rating", value: stats.avgRating, trend: "+0.2", trendUp: true, icon: "⭐" },
        { label: "Total Reviews", value: stats.totalReviews, trend: "+12%", trendUp: true, icon: "💬" },
        { label: "Response Rate", value: stats.responseRate, trend: "+2.1%", trendUp: true, icon: "⚡" },
        { label: "Sentiment Score", value: stats.sentimentScore, trend: "+5", trendUp: true, icon: "😊" },
    ] : mockStats;

    const handleReviewAction = (review: any, type: 'ai' | 'manual') => {
        if (!isOfficial) {
            setShowConnectModal(true);
            return;
        }
        if (type === 'ai') setSelectedReview(review);
        else setManualReview(review);
    };

    const handlePostResponse = (response: string) => {
        const targetId = selectedReview?.id || manualReview?.id;
        if (!targetId) return;

        setReviews(prev => prev.map(r =>
            r.id === targetId ? { ...r, status: 'REPLIED' } : r
        ));
        setSelectedReview(null);
        setManualReview(null);
    };

    const handleOnConnected = async (locationId: string) => {
        setLoading(true);
        try {
            await fetch('/api/google/sync-reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locationName: locationId })
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setShowConnectModal(false);
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    if (reviews.length === 0) {
        return (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🔍</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>No Business Connected</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                    Connect your business to start monitoring reviews and generating AI responses.
                </p>
                <Link href="/onboarding" className={styles.primaryBtn} style={{ display: 'inline-block' }}>
                    Connect My Business
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>
                    {stats?.businessName || 'Overview'}
                </h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>Review management and reputation insights</p>
            </div>

            <div className={styles.grid}>
                {dashboardStats.map((stat, i) => (
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
                                        {review.authorImage ? (
                                            <img src={review.authorImage} alt="" className={styles.authorAvatar} style={{ padding: 0 }} />
                                        ) : (
                                            <div className={styles.authorAvatar}>
                                                {review.authorName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className={styles.authorName}>{review.authorName}</div>
                                            <div className={styles.reviewMeta}>{review.platform} • {new Date(review.publishDate).toLocaleDateString()}</div>
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
                                    {review.status === 'REPLIED' ? (
                                        <div className={styles.aiBadge}>
                                            <span>🤖</span> Replied
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleReviewAction(review, 'ai')}
                                                className={`${styles.primaryBtn} ${styles.btnSm}`}
                                            >
                                                Generate AI Response
                                            </button>
                                            <button
                                                onClick={() => handleReviewAction(review, 'manual')}
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

            {showConnectModal && (
                <ConnectGoogleModal
                    onClose={() => setShowConnectModal(false)}
                    onConnected={handleOnConnected}
                />
            )}
        </div>
    );
}
