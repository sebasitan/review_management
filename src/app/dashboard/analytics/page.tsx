import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "../dashboard.module.css";

export default function AnalyticsPage() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!businessId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/analytics?businessId=${businessId}`);
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [businessId]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    if (!data) return (
        <div style={{ textAlign: 'center', padding: '60px' }}>
            <h3>No analytics data available for this business.</h3>
            <p>Sync reviews to see your performance metrics.</p>
        </div>
    );

    const progressBars = [
        { label: 'Positive Sentiment', value: data.sentiment.positive, color: 'var(--success)' },
        { label: 'Neutral Sentiment', value: data.sentiment.neutral, color: '#e2e8f0' },
        { label: 'Negative Sentiment', value: data.sentiment.negative, color: 'var(--error)' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button
                    onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8,"
                            + "Metric,Value\n"
                            + `Monthly Growth,${data.stats.growth}\n`
                            + `Response Time,${data.stats.responseTime}\n`
                            + `Reach Estimate,${data.stats.reach}\n`
                            + `Positive Sentiment,${data.sentiment.positive}%\n`
                            + `Neutral Sentiment,${data.sentiment.neutral}%\n`
                            + `Negative Sentiment,${data.sentiment.negative}%`;

                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "reputation_report.csv");
                        document.body.appendChild(link);
                        link.click();
                    }}
                    className={styles.secondaryBtn}
                    style={{ fontSize: '0.875rem' }}
                >
                    📥 Download CSV Report
                </button>
            </div>

            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Monthly Growth</div>
                    <div className={styles.statValue} style={{ color: 'var(--success)' }}>{data.stats.growth}</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>vs. previous month</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Response Time</div>
                    <div className={styles.statValue}>{data.stats.responseTime}</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Average AI reply time</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Reach Estimate</div>
                    <div className={styles.statValue}>{data.stats.reach}</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Estimated impressions</p>
                </div>
            </div>

            <div className={styles.contentGrid} style={{ marginTop: '32px' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px' }}>Sentiment Trend</h2>

                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--card-border)' }}>
                        {data.trend.map((h: number, i: number) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '4px 4px 0 0', position: 'relative', height: `${h}%`, transition: 'all 0.5s ease' }}>
                                <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary)' }}>{h}%</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </section>

                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Audience Perception</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {progressBars.map(bar => (
                            <div key={bar.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                    <span style={{ fontWeight: 500 }}>{bar.label}</span>
                                    <span style={{ fontWeight: 700 }}>{bar.value}%</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px' }}>
                                    <div style={{ width: `${bar.value}%`, height: '100%', background: bar.color, borderRadius: '5px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '40px', padding: '20px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '12px' }}>Keywords Breakdown</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {data.keywords.map((kw: any, i: number) => (
                                <span key={i} style={{
                                    padding: '6px 12px',
                                    background: kw.type === 'positive' ? 'rgba(16, 185, 129, 0.1)' : kw.type === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                    color: kw.type === 'positive' ? 'var(--success)' : kw.type === 'negative' ? 'var(--error)' : 'var(--primary)',
                                    borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600
                                }}>
                                    {kw.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
