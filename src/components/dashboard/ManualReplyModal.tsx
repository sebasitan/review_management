'use client';

import { useState } from 'react';

interface ManualReplyModalProps {
    review: any;
    onClose: () => void;
    onPost: (reply: string) => void;
}

export default function ManualReplyModal({ review, onClose, onPost }: ManualReplyModalProps) {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = () => {
        if (!replyText.trim()) return;
        onPost(replyText);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div className="glass" style={{ width: '600px', background: 'var(--background)', borderRadius: '24px', padding: '32px', position: 'relative', border: '1px solid var(--card-border)' }}>

                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '1.5rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >✕</button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Reply to {review.author}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Write a personal response to this customer's review.</p>

                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', marginBottom: '24px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{review.content}"
                </div>

                <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    style={{
                        width: '100%', height: '150px', padding: '16px', borderRadius: '12px',
                        border: '1px solid var(--card-border)', marginBottom: '24px', fontSize: '0.9375rem', lineHeight: 1.5, resize: 'none'
                    }}
                    autoFocus
                />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!replyText.trim()}
                        style={{
                            padding: '12px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                            opacity: !replyText.trim() ? 0.5 : 1
                        }}
                    >
                        Post Reply
                    </button>
                </div>
            </div>
        </div>
    );
}
