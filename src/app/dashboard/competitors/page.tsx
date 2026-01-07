'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';

interface Competitor {
    id: number;
    name: string;
    rating: number;
    reviews: number;
    sentiment: number;
    trend: string;
}

const initialCompetitors: Competitor[] = [
    { id: 1, name: 'The Roasted Bean', rating: 4.5, reviews: 890, sentiment: 82, trend: '+2%' },
    { id: 2, name: 'Daily Grid Coffee', rating: 4.2, reviews: 450, sentiment: 75, trend: '-1%' },
    { id: 3, name: 'Starbucks (Downtown)', rating: 4.1, reviews: 3200, sentiment: 68, trend: '+0.5%' },
];

const myBusiness = {
    name: 'Blue Coffee Roasters',
    rating: 4.8,
    reviews: 1284,
    sentiment: 88,
    trend: '+5%'
};

export default function CompetitorsPage() {
    const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);
    const [isAdding, setIsAdding] = useState(false);
    const [newCompName, setNewCompName] = useState('');

    const handleAddCompetitor = () => {
        if (!newCompName.trim()) return;

        const newComp: Competitor = {
            id: Date.now(),
            name: newCompName,
            rating: Number((3.5 + Math.random() * 1.4).toFixed(1)), // Mock random rating
            reviews: Math.floor(Math.random() * 500),
            sentiment: Math.floor(60 + Math.random() * 30),
            trend: 'New'
        };

        setCompetitors([...competitors, newComp]);
        setNewCompName('');
        setIsAdding(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button
                    onClick={() => setIsAdding(true)}
                    className={styles.primaryBtn}
                >
                    + Add Competitor
                </button>
            </div>

            {/* Head-to-Head Summary */}
            <div className={styles.grid} style={{ marginBottom: '40px' }}>
                <div className={`${styles.statCard} glass`} style={{ border: '2px solid var(--primary)' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>YOU (Leader)</div>
                    <div className={styles.statLabel}>{myBusiness.name}</div>
                    <div className={styles.statValue} style={{ fontSize: '2.5rem' }}>{myBusiness.rating} <span style={{ fontSize: '1rem', color: '#ffb700' }}>★</span></div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span><b>{myBusiness.reviews}</b> Reviews</span>
                        <span><b>{myBusiness.sentiment}%</b> Positive</span>
                    </div>
                </div>

                {competitors.map((comp) => (
                    <div key={comp.id} className={`${styles.statCard} glass`}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>RIVAL</div>
                        <div className={styles.statLabel}>{comp.name}</div>
                        <div className={styles.statValue} style={{ fontSize: '2.5rem' }}>{comp.rating} <span style={{ fontSize: '1rem', color: '#ffb700' }}>★</span></div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span><b>{comp.reviews}</b> Reviews</span>
                            <span><b>{comp.sentiment}%</b> Positive</span>
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '0.8rem', color: comp.rating < myBusiness.rating ? 'var(--success)' : 'var(--error)' }}>
                            {comp.rating < myBusiness.rating ? `You are +${(Number(myBusiness.rating) - comp.rating).toFixed(1)} ahead` : 'They are winning'}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ marginBottom: '24px' }}>Market Share (Share of Voice)</h2>
                    <div style={{ display: 'flex', alignItems: 'center', height: '200px', gap: '4px' }}>
                        {[{ ...myBusiness, isMe: true }, ...competitors].map((c: any, i) => {
                            // Simple visualization based on review count
                            const totalReviews = myBusiness.reviews + competitors.reduce((acc, curr) => acc + curr.reviews, 0);
                            const percentage = (Number(c.reviews) / totalReviews) * 100;
                            return (
                                <div key={i} style={{
                                    height: '100%',
                                    width: `${percentage}%`,
                                    background: c.isMe ? 'var(--primary)' : `hsl(${200 + i * 40}, 70%, 80%)`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: c.isMe ? 'white' : 'var(--text-primary)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    minWidth: '20px'
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: percentage < 10 ? '0.7rem' : '1rem' }}>{Math.round(percentage)}%</span>
                                    {percentage > 12 && <span style={{ fontSize: '0.75rem', textAlign: 'center', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>}
                                </div>
                            )
                        })}
                    </div>
                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        You currently hold <b>{Math.round((myBusiness.reviews / (myBusiness.reviews + competitors.reduce((acc, curr) => acc + curr.reviews, 0))) * 100)}%</b> of the detailed review volume in your local area.
                    </p>
                </section>

                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ marginBottom: '24px' }}>AI Insights</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.25rem' }}>✅</span>
                            <div>
                                <div style={{ fontWeight: 600 }}>Service Advantage</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Customers mention "Friendly Staff" 4x more often in your reviews compared to <i>The Roasted Bean</i>.</div>
                            </div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                            <div>
                                <div style={{ fontWeight: 600 }}>Price Sensitivity</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><i>Daily Grid Coffee</i> is frequently praised for "Affordable Prices", a keyword missing from your positive feedback.</div>
                            </div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.25rem' }}>💡</span>
                            <div>
                                <div style={{ fontWeight: 600 }}>Opportunity</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><i>Starbucks</i> has a spike in "Long Wait Time" complaints on weekends. Target weekend promotions to capture their dissatisfied traffic.</div>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>

            {/* Add Competitor Modal */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                    <div className="glass" style={{ width: '400px', padding: '32px', borderRadius: '24px', background: 'var(--background)', position: 'relative' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 700 }}>Track New Competitor</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Add a competitor to compare their ratings and reviews against yours.
                        </p>

                        <input
                            autoFocus
                            className="input"
                            placeholder="e.g. Starbucks or Google Maps URL"
                            value={newCompName}
                            onChange={(e) => setNewCompName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCompetitor()}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '24px' }}
                        />

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsAdding(false)}
                                className={styles.secondaryBtn}
                                style={{ flex: 1, padding: '12px' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCompetitor}
                                className={styles.primaryBtn}
                                style={{ flex: 1, padding: '12px' }}
                                disabled={!newCompName.trim()}
                            >
                                Add Tracker
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
