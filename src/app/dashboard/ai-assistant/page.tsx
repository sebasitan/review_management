'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "../dashboard.module.css";

function AIAssistantContent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [reviewText, setReviewText] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [tone, setTone] = useState('Professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResponse, setGeneratedResponse] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!reviewText) return;
        setIsGenerating(true);
        setError('');
        setGeneratedResponse('');

        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewContent: reviewText,
                    tone,
                    authorName: authorName || 'Customer',
                    businessId
                })
            });

            if (res.ok) {
                const data = await res.json();
                setGeneratedResponse(data.response);
            } else {
                throw new Error('Failed to generate response');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedResponse);
        alert('Copied to clipboard!');
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>AI Reply Assistant</h1>
                <p style={{ color: '#64748b' }}>Paste a customer review and get a professional AI-generated response draft.</p>
            </div>

            <div className={styles.contentGrid} style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Input Review</h2>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Review Text</label>
                        <textarea
                            placeholder="Paste the customer's review here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            style={{
                                width: '100%', height: '160px', padding: '16px', borderRadius: '12px',
                                border: '1px solid #e2e8f0', background: 'white', resize: 'none',
                                fontSize: '0.9375rem', lineHeight: 1.5
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Customer Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Desired Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'
                                }}
                            >
                                <option>Professional</option>
                                <option>Friendly</option>
                                <option>Empathetic</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !reviewText}
                        className={styles.primaryBtn}
                        style={{ width: '100%', padding: '14px', background: '#6366f1', opacity: isGenerating || !reviewText ? 0.7 : 1 }}
                    >
                        {isGenerating ? 'Generating Draft...' : '✨ Generate Reply Draft'}
                    </button>

                    {error && <p style={{ color: '#ef4444', marginTop: '16px', fontSize: '0.875rem' }}>{error}</p>}
                </section>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={`${styles.statCard} glass`} style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>AI Suggestion</h2>

                        {generatedResponse ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '16px',
                                    fontSize: '0.9375rem', lineHeight: 1.6, color: '#334155', border: '1px solid #e2e8f0',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {generatedResponse}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={styles.secondaryBtn}
                                    style={{ marginTop: '20px', width: '100%' }}
                                >
                                    📋 Copy to Clipboard
                                </button>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>
                                    Don't forget to paste this in your Google Maps response box!
                                </p>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
                                <div style={{ color: '#94a3b8' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                                    <p>Your generated response will appear here.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '24px', background: '#f0fdf4', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
                        <h4 style={{ color: '#166534', fontWeight: 700, marginBottom: '8px' }}>Why use AI drafts?</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.5 }}>
                            Responding to reviews within 24 hours can boost your Local SEO ranking by up to 15%. AI helps you stay fast and professional.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function AIAssistantPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <div style={{ weight: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        }>
            <AIAssistantContent />
        </Suspense>
    );
}

