'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';

const mockPosts = [
    { id: 1, platform: 'Instagram', content: 'Huge thanks to Alice for the 5-star review! ☕✨ "Absolutely love the service!" #CoffeeLovers #Review', date: '2 days ago', status: 'Published', likes: 124 },
    { id: 2, platform: 'Facebook', content: 'We are humbled. 4.8 stars average rating this month! Thank you for supporting local business. 🙏', date: '1 week ago', status: 'Published', likes: 45 },
    { id: 3, platform: 'Twitter', content: 'Did you know? Our cold brew is rated #1 in downtown. Come taste why! 🧊☕', date: 'Scheduled (Tomorrow)', status: 'Scheduled', likes: 0 },
];

const reviewHighlight = {
    author: 'Alice Brown',
    rating: 5,
    content: 'Absolutely love the service! The team went above and beyond to make my morning coffee perfect.',
    source: 'Google'
};

export default function MarketingPage() {
    const [selectedReview, setSelectedReview] = useState<typeof reviewHighlight | null>(reviewHighlight);
    const [generatedCaption, setGeneratedCaption] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'calendar'

    const generateSocialPost = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedCaption(`🌟 Customer Love Alert! 🌟\n\nBig thanks to ${selectedReview?.author} for the kind words: "${selectedReview?.content}"\n\nWe come to work every day to serve you better. Come visit us! ☕\n\n#CustomerFeedback #GreatService #LocalBusiness`);
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button className={styles.primaryBtn} disabled>Connect Social Utility</button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                <button
                    onClick={() => setActiveTab('create')}
                    className={activeTab === 'create' ? styles.primaryBtn : styles.secondaryBtn}
                    style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                >
                    Create Post
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={activeTab === 'calendar' ? styles.primaryBtn : styles.secondaryBtn}
                    style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                >
                    Content Calendar
                </button>
            </div>

            {activeTab === 'create' && (
                <div className={styles.contentGrid}>

                    {/* Left: Review Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className={`${styles.statCard} glass`} style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>1. Select a Win</h2>
                            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>{selectedReview?.author}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{selectedReview?.source}</span>
                                </div>
                                <div style={{ color: '#FFB700', marginBottom: '8px' }}>★★★★★</div>
                                <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"{selectedReview?.content}"</p>
                            </div>
                            <button className={styles.secondaryBtn} style={{ width: '100%', marginTop: '16px', fontSize: '0.875rem' }}>Pick Another Review</button>
                        </div>

                        <div className={`${styles.statCard} glass`} style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>2. AI Magic</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Generate a catchy caption tailored for Instagram & Facebook.</p>
                            <button
                                onClick={generateSocialPost}
                                className={styles.primaryBtn}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Drafting...' : '✨ Generate Caption'}
                            </button>
                        </div>
                    </div>

                    {/* Right: Post Preview */}
                    <div className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>3. Studio Preview</h2>

                        <div style={{ display: 'flex', gap: '32px' }}>
                            {/* Mock Phone Preview */}
                            <div style={{
                                width: '300px',
                                height: '500px',
                                background: 'white',
                                borderRadius: '32px',
                                border: '8px solid #333',
                                padding: '20px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: 'sans-serif'
                            }}>
                                {/* Instagram-style Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee' }}></div>
                                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'black' }}>blue_coffee_roasters</div>
                                </div>

                                {/* Image Placeholder */}
                                <div style={{
                                    width: '100%', aspectRatio: '1/1', background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
                                    borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '12px', color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', padding: '12px'
                                }}>
                                    {selectedReview ? (
                                        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                            <div style={{ color: '#FFB700', textAlign: 'center' }}>★★★★★</div>
                                            <div style={{ fontSize: '0.7rem', color: 'black', marginTop: '8px', fontStyle: 'italic' }}>"{selectedReview.content}"</div>
                                            <div style={{ fontSize: '0.6rem', color: 'gray', marginTop: '8px', textAlign: 'right' }}>- {selectedReview.author}</div>
                                        </div>
                                    ) : 'Select a Review'}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '1.2rem' }}>
                                    <span>❤️</span> <span>💬</span> <span>✈️</span>
                                </div>

                                {/* Caption */}
                                <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4, flex: 1, overflowY: 'auto' }}>
                                    <span style={{ fontWeight: 600 }}>blue_coffee_roasters</span> {generatedCaption || 'Your caption will appear here...'}
                                </div>
                            </div>

                            {/* Publishing Controls */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="input-group">
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Edit Caption</label>
                                    <textarea
                                        value={generatedCaption}
                                        onChange={(e) => setGeneratedCaption(e.target.value)}
                                        className="input"
                                        style={{ height: '150px', width: '100%', marginTop: '8px', padding: '12px', border: '1px solid var(--card-border)', borderRadius: '12px', resize: 'none' }}
                                        placeholder="Generate content first..."
                                    />
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                    <button className={styles.secondaryBtn} style={{ flex: 1 }}>Schedule for Later</button>
                                    <button className={styles.primaryBtn} style={{ flex: 1 }}>Post Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'calendar' && (
                <div className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ marginBottom: '24px' }}>Scheduled Content</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '16px 24px' }}>Platform</th>
                                <th style={{ padding: '16px 24px' }}>Content Snippet</th>
                                <th style={{ padding: '16px 24px' }}>Date</th>
                                <th style={{ padding: '16px 24px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPosts.map(post => (
                                <tr key={post.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{post.platform}</td>
                                    <td style={{ padding: '16px 24px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>{post.content}</td>
                                    <td style={{ padding: '16px 24px' }}>{post.date}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                            background: post.status === 'Published' ? 'var(--success)' : 'rgba(99, 102, 241, 0.2)',
                                            color: post.status === 'Published' ? 'white' : 'var(--primary)'
                                        }}>
                                            {post.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
