'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from "./dashboard.module.css";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const url = businessId ? `/api/stats?businessId=${businessId}` : '/api/stats';
                const res = await fetch(url);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status, businessId]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    if (!data || !data.hasBusiness) {
        return (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🏬</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>No Business Profile</h2>
                <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                    Set up your business profile to start managing review requests and internal analytics.
                </p>
                <Link href="/onboarding" className={styles.primaryBtn} style={{ display: 'inline-block', background: '#6366f1', color: 'white', textDecoration: 'none' }}>
                    Set Up Business Profile
                </Link>
            </div>
        );
    }

    const { business, stats } = data;

    const dashboardStats = [
        { label: "Requests Sent", value: stats.totalRequests, trend: stats.growth, trendUp: true, icon: "📩" },
        { label: "WhatsApp", value: stats.channels.WHATSAPP, icon: "📱" },
        { label: "SMS / Email", value: stats.channels.SMS + stats.channels.EMAIL, icon: "✉️" },
        { label: "QR Scans", value: stats.totalEngagement, icon: "🔍" },
    ];

    return (
        <div>
            {/* Header Section */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>
                        {business.name}
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>{business.address}, {business.city}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>ACTIVE</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Free Tier</span>
                    </div>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryBtn}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <span>🗺️</span> Open in Google Maps
                </a>
            </div>

            {/* Mandatory Message */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>
                    💡 <strong>Pro Tip:</strong> Reviews are managed directly on Google Maps. Use the tools below to request reviews from customers and generate AI-powered response drafts.
                </p>
            </div>

            {/* Stats Grid */}
            <div className={styles.grid}>
                {dashboardStats.map((stat, i) => (
                    <div key={i} className={`${styles.statCard} glass`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            {stat.trend && (
                                <span className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Operations Grid */}
            <div className={styles.contentGrid}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Engagement Tools</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <Link href="/dashboard/requests" style={{ textDecoration: 'none' }}>
                            <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', height: '100%', transition: 'all 0.2s' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📣</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Request Reviews</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>Generate WhatsApp, SMS, and Email templates to send to your customers.</p>
                                <div style={{ marginTop: '20px', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>Open Tools →</div>
                            </div>
                        </Link>

                        <Link href="/dashboard/ai-assistant" style={{ textDecoration: 'none' }}>
                            <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', height: '100%', transition: 'all 0.2s' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🤖</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>AI Reply Assistant</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>Paste review text and get professional response suggestions in seconds.</p>
                                <div style={{ marginTop: '20px', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>Try Assistant →</div>
                            </div>
                        </Link>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ fontSize: '2rem' }}>🖨️</div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Print QR Code</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Place this on your counter or table for easy Google reviews.</p>
                            </div>
                            <button className={styles.primaryBtn} style={{ background: '#6366f1' }}>Download QR</button>
                        </div>
                    </div>
                </section>

                <section className={`${styles.statCard} glass`} style={{ height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '20px' }}>Channel Analysis</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>WhatsApp Messages</span>
                                <span style={{ fontWeight: 600 }}>{stats.channels.WHATSAPP}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: stats.totalRequests ? `${(stats.channels.WHATSAPP / stats.totalRequests) * 100}%` : '0%', height: '100%', background: '#25D366', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>SMS / Email</span>
                                <span style={{ fontWeight: 600 }}>{stats.channels.SMS + stats.channels.EMAIL}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: stats.totalRequests ? `${((stats.channels.SMS + stats.channels.EMAIL) / stats.totalRequests) * 100}%` : '0%', height: '100%', background: '#6366f1', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span>QR Code Scans</span>
                                <span style={{ fontWeight: 600 }}>{stats.totalEngagement}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                <div style={{ width: '100%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px dashed #6366f1' }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#6366f1', marginBottom: '8px' }}>Internal Growth Tip 💡</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                            Businesses using WhatsApp requests see 30% higher engagement compared to Email. Try sending more links via WhatsApp today!
                        </p>
                    </div>
                </section>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

