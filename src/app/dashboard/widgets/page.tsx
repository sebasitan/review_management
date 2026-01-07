'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';

const mockReviews = [
    { id: 1, author: 'Alice Brown', rating: 5, content: 'Absolutely love the service! The team went above and beyond.', date: '2 days ago', platform: 'Google' },
    { id: 2, author: 'Mike Ross', rating: 5, content: 'Best coffee in town, hands down. Highly recommend the cold brew.', date: '1 week ago', platform: 'Yelp' },
    { id: 3, author: 'Sarah Jenkins', rating: 4, content: 'Great atmosphere, but a bit noisy on weekends.', date: '3 weeks ago', platform: 'Google' },
];

export default function WidgetsPage() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [layout, setLayout] = useState<'list' | 'carousel' | 'grid'>('list');
    const [showHeader, setShowHeader] = useState(true);
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');

    // Generate Embed Code
    const embedCode = `
<script src="https://cdn.reputa.ai/widget.js" data-id="12345"></script>
<div id="reputa-widget" 
  data-theme="${theme}" 
  data-layout="${layout}" 
  data-color="${primaryColor}">
</div>
  `.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        alert('Embed code copied to clipboard!');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button onClick={handleCopy} className={styles.primaryBtn} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>📋</span> Copy Embed Code
                </button>
            </div>

            <div className={styles.contentGrid} style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr' }}>

                {/* Configuration Panel */}
                <div className={`${styles.statCard} glass`} style={{ padding: '24px', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Customization</h2>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>Theme</label>
                        <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                            <button
                                onClick={() => setTheme('light')}
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: theme === 'light' ? 'white' : 'transparent', fontWeight: 600, boxShadow: theme === 'light' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
                            >Light</button>
                            <button
                                onClick={() => setTheme('dark')}
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: theme === 'dark' ? 'white' : 'transparent', fontWeight: 600, boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
                            >Dark</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>Layout</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['list', 'grid', 'carousel'].map(l => (
                                <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: layout === l ? '2px solid var(--primary)' : '1px solid var(--card-border)', borderRadius: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={layout === l} onChange={() => setLayout(l as any)} />
                                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{l} View</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>Accent Color</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#ec4899'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setPrimaryColor(c)}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: primaryColor === c ? '3px solid white' : 'none', boxShadow: primaryColor === c ? '0 0 0 2px var(--text-primary)' : 'none', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                            <span style={{ fontWeight: 600 }}>Show Header & Total Rating</span>
                        </label>
                    </div>

                </div>

                {/* Live Preview Area */}
                <div style={{ background: theme === 'light' ? '#f3f4f6' : '#111827', borderRadius: '24px', padding: '40px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, color: theme === 'light' ? '#374151' : '#e5e7eb' }}>LIVE PREVIEW</div>
                        <div style={{ fontSize: '0.875rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>Desktop • 1200px</div>
                    </div>

                    {/* The Actual Widget Markup (Simulated) */}
                    <div style={{
                        background: theme === 'light' ? '#ffffff' : '#1f2937',
                        color: theme === 'light' ? '#111827' : '#f9fafb',
                        padding: '32px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        {showHeader && (
                            <div style={{ textAlign: 'center', borderBottom: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #374151', paddingBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Our Customers Love Us</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 700 }}>
                                    <span style={{ color: '#FFB700' }}>★★★★★</span>
                                    <span>4.8/5</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '4px' }}>Based on 1,284 reviews</div>
                            </div>
                        )}

                        <div
                            style={{
                                display: layout === 'grid' ? 'grid' : 'flex',
                                gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'none',
                                flexDirection: layout === 'list' ? 'column' : 'row',
                                overflowX: layout === 'carousel' ? 'auto' : 'visible',
                                gap: '16px'
                            }}
                        >
                            {mockReviews.map(review => (
                                <div key={review.id} style={{
                                    minWidth: layout === 'carousel' ? '300px' : 'auto',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    background: theme === 'light' ? '#f9fafb' : '#374151',
                                    border: `1px solid ${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.1)'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>{review.author[0]}</div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.author}</div>
                                        </div>
                                        <div style={{ fontSize: '1.25rem' }}>{review.platform === 'Google' ? '🇬' : '🇾'}</div>
                                    </div>
                                    <div style={{ color: '#FFB700', fontSize: '1rem', marginBottom: '8px' }}>{'★'.repeat(review.rating)}</div>
                                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, opacity: 0.9 }}>"{review.content}"</p>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '12px' }}>{review.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '16px', background: theme === 'light' ? '#ffffff' : '#374151', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.875rem', color: theme === 'light' ? '#4b5563' : '#d1d5db', border: '1px solid var(--card-border)' }}>
                        {embedCode}
                    </div>
                </div>

            </div>
        </div>
    );
}
