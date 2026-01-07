'use client';

import { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';

interface AIResponseModalProps {
  review: {
    author: string;
    content: string;
    rating: number;
  };
  onClose: () => void;
  onPost: (response: string) => void;
}

export default function AIResponseModal({ review, onClose, onPost }: AIResponseModalProps) {
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewContent: review.content,
          rating: review.rating,
          authorName: review.author
        })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '32px',
        borderRadius: '24px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '1.25rem', color: 'var(--text-muted)' }}>✕</button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>AI Response Generator</h2>

        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>Review from {review.author}</div>
          <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>"{review.content}"</div>
        </div>

        {!response && !isGenerating && (
          <button
            onClick={generateResponse}
            className={styles.primaryBtn}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span>🤖</span> Generate Premium Response
          </button>
        )}

        {isGenerating && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner" style={{
              width: '32px', height: '32px', border: '3px solid var(--primary)',
              borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px'
            }}></div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>AI is analyzing sentiment and crafting the perfect reply...</p>
          </div>
        )}

        {response && !isGenerating && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>AI Draft</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={{
                width: '100%',
                height: '150px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: 'white',
                fontFamily: 'inherit',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                marginBottom: '24px',
                resize: 'none'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={generateResponse}
                className={styles.secondaryBtn}
                style={{ flex: 1 }}
              >
                Regenerate
              </button>
              <button
                onClick={() => onPost(response)}
                className={styles.primaryBtn}
                style={{ flex: 2 }}
              >
                Approve & Post Response
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div >
  );
}
