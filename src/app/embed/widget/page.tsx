'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Mock data (in a real app, this would come from the API via ID)
const mockReviews = [
    { id: 1, author: 'Alice Brown', rating: 5, content: 'Absolutely love the service! The team went above and beyond.', date: '2 days ago', platform: 'Google' },
    { id: 2, author: 'Mike Ross', rating: 5, content: 'Best coffee in town, hands down. Highly recommend the cold brew.', date: '1 week ago', platform: 'Yelp' },
    { id: 3, author: 'Sarah Jenkins', rating: 4, content: 'Great atmosphere, but a bit noisy on weekends.', date: '3 weeks ago', platform: 'Google' },
    { id: 4, author: 'David Lee', rating: 5, content: 'A hidden gem. The pastries are fresh and the staff is super friendly.', date: '1 month ago', platform: 'Facebook' },
];

function WidgetContent() {
    const searchParams = useSearchParams();
    const theme = searchParams.get('theme') || 'light';
    const layout = searchParams.get('layout') || 'list';
    const accentColor = searchParams.get('color') || '#4f46e5';
    const showHeader = searchParams.get('header') !== 'false';

    const isDark = theme === 'dark';
    const bg = isDark ? 'transparent' : 'transparent'; // iframe usually transparent
    const cardBg = isDark ? '#1f2937' : '#ffffff';
    const textPrimary = isDark ? '#f9fafb' : '#111827';
    const textSecondary = isDark ? '#9ca3af' : '#6b7280';
    const border = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

    return (
        <div style={{ background: bg, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '16px' }}>

            {showHeader && (
                <div style={{ textAlign: 'center', marginBottom: '24px', color: textPrimary }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 800 }}>
                        <span style={{ color: '#FFB700' }}>★★★★★</span>
                        <span>4.8</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: textSecondary }}>Based on 1,284 reviews</div>
                </div>
            )}

            <div
                style={{
                    display: layout === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'none',
                    flexDirection: layout === 'list' ? 'column' : 'row',
                    overflowX: layout === 'carousel' ? 'auto' : 'visible',
                    gap: '16px',
                    paddingBottom: layout === 'carousel' ? '16px' : '0' // scrollbar space
                }}
            >
                {mockReviews.map(review => (
                    <div key={review.id} style={{
                        minWidth: layout === 'carousel' ? '280px' : 'auto',
                        padding: '24px',
                        borderRadius: '16px',
                        background: cardBg,
                        border: `1px solid ${border}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        color: textPrimary
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: accentColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{review.author[0]}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.author}</div>
                            </div>
                            {/* Platform Icon */}
                            <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                                {review.platform === 'Google' && 'Google'}
                                {review.platform === 'Yelp' && 'Yelp'}
                                {review.platform === 'Facebook' && 'FB'}
                            </div>
                        </div>
                        <div style={{ color: '#FFB700', fontSize: '1.1rem', marginBottom: '12px', letterSpacing: '2px' }}>{'★'.repeat(review.rating)}</div>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: textSecondary, marginBottom: '16px' }}>"{review.content}"</p>
                        <div style={{ fontSize: '0.8rem', color: textSecondary, opacity: 0.7 }}>Posted {review.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function EmbedWidgetPage() {
    return (
        <Suspense fallback={<div>Loading widget...</div>}>
            <WidgetContent />
        </Suspense>
    )
}
