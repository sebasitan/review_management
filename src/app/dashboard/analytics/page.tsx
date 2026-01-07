'use client';

import styles from "../dashboard.module.css";

const progressBars = [
    { label: 'Positive Sentiment', value: 85, color: 'var(--success)' },
    { label: 'Neutral Sentiment', value: 10, color: '#e2e8f0' },
    { label: 'Negative Sentiment', value: 5, color: 'var(--error)' },
];

export default function AnalyticsPage() {
    return (
        <div>


            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Monthly Growth</div>
                    <div className={styles.statValue} style={{ color: 'var(--success)' }}>+24%</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>vs. previous month</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Response Time</div>
                    <div className={styles.statValue}>1.2 hrs</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Average AI reply time</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Reach Estimate</div>
                    <div className={styles.statValue}>14.2k</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Estimated impressions</p>
                </div>
            </div>

            <div className={styles.contentGrid} style={{ marginTop: '32px' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px' }}>Sentiment Trend</h2>

                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid var(--card-border)' }}>
                        {[40, 65, 55, 80, 75, 90, 85, 95, 88, 92, 100, 96].map((h, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '4px 4px 0 0', position: 'relative', height: `${h}%`, transition: 'all 0.5s ease' }}>
                                <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary)' }}>{h}%</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
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
                            <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Friendly Staff</span>
                            <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Fast Order</span>
                            <span style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Atmosphere</span>
                            <span style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Waiting Time</span>
                            <span style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Cleanliness</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
