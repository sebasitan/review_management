'use client';

import { useState, useEffect } from 'react';
import styles from "../dashboard.module.css";

const templates = [
    { id: 1, name: 'Standard Request', content: "Hi! We'd love to hear your feedback about your recent visit. Could you spare a minute to leave us a review on Google?" },
    { id: 2, name: 'Post-Purchase', content: "Thank you for your business! How was your experience? Let us know with a quick Google review." },
    { id: 3, name: 'Personalized', content: "It was a pleasure serving you today. Your feedback helps us grow. Please leave us a review here:" }
];

export default function RequestsPage() {
    const [method, setMethod] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [recipient, setRecipient] = useState('');
    const [businessData, setBusinessData] = useState<any>(null);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.hasBusiness) setBusinessData(data.business);
            });
    }, []);

    const getReviewLink = () => {
        if (!businessData) return '';
        // Using Google Maps search as a safe, no-API-key fallback that points to the business
        const query = encodeURIComponent(`${businessData.name} ${businessData.address} ${businessData.city}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    const handleAction = async () => {
        setIsSending(true);
        setStatus(null);

        const reviewLink = getReviewLink();
        const fullMessage = `${selectedTemplate.content}\n\n${reviewLink}`;

        try {
            // Log the request internally first
            await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient,
                    method,
                    content: fullMessage
                })
            });

            // Handle the actual "sending" via client-side redirect where possible
            if (method === 'whatsapp') {
                const waUrl = `https://wa.me/${recipient.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`;
                window.open(waUrl, '_blank');
            } else if (method === 'email') {
                const mailto = `mailto:${recipient}?subject=${encodeURIComponent('We value your feedback')}&body=${encodeURIComponent(fullMessage)}`;
                window.location.href = mailto;
            } else if (method === 'sms') {
                const smsUrl = `sms:${recipient}?body=${encodeURIComponent(fullMessage)}`;
                window.location.href = smsUrl;
            }

            setStatus({ type: 'success', msg: 'Request logged and app opened!' });
            setRecipient('');
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to log request.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>Review Requests</h1>
                <p style={{ color: '#64748b' }}>Generate links and send requests to your customers across different channels.</p>
            </div>

            <div className={styles.contentGrid} style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Compose Request</h2>

                    {status && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '12px', marginBottom: '24px',
                            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: status.type === 'success' ? '#16a34a' : '#ef4444',
                            fontSize: '0.875rem', fontWeight: 500
                        }}>
                            {status.type === 'success' ? '✅' : '❌'} {status.msg}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                        {(['whatsapp', 'sms', 'email'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMethod(m); setStatus(null); }}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                                    background: method === m ? 'white' : 'transparent',
                                    boxShadow: method === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    color: method === m ? '#6366f1' : '#64748b',
                                    border: 'none', cursor: 'pointer', textTransform: 'capitalize'
                                }}
                            >
                                {m === 'whatsapp' ? '📱 WhatsApp' : m === 'sms' ? '💬 SMS' : '📧 Email'}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                            {method === 'email' ? 'Customer Email' : 'Phone Number (with Country Code)'}
                        </label>
                        <input
                            type="text"
                            placeholder={method === 'email' ? 'customer@example.com' : '447123456789'}
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Select Template</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t)}
                                    style={{
                                        padding: '12px', borderRadius: '12px', border: '1px solid',
                                        borderColor: selectedTemplate.id === t.id ? '#6366f1' : '#e2e8f0',
                                        background: selectedTemplate.id === t.id ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        fontSize: '0.8125rem', fontWeight: 500, textAlign: 'left', cursor: 'pointer'
                                    }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Message Preview</label>
                        <div style={{
                            padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc',
                            fontSize: '0.9375rem', lineHeight: 1.5, color: '#475569', minHeight: '100px'
                        }}>
                            {selectedTemplate.content}
                            <div style={{ color: '#6366f1', marginTop: '12px', wordBreak: 'break-all' }}>
                                {getReviewLink()}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAction}
                        disabled={isSending || !recipient}
                        className={styles.primaryBtn}
                        style={{ width: '100%', opacity: isSending || !recipient ? 0.7 : 1, background: '#6366f1' }}
                    >
                        {isSending ? 'Processing...' : `Send via ${method}`}
                    </button>
                </section>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={`${styles.statCard} glass`} style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Store QR Code</h3>
                        <div style={{
                            width: '200px', height: '200px', background: '#f1f5f9', margin: '0 auto 20px',
                            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px dashed #cbd5e1'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem' }}>🔳</div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>QR Code Preview</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
                            Print this QR code and place it on your counter for instant Google reviews.
                        </p>
                        <button className={styles.secondaryBtn} style={{ width: '100%' }}>Download High-Res PDF</button>
                    </div>

                    <div className={`${styles.statCard} glass`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>Direct Link Tips</h3>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '20px' }}>
                            Sending the direct link significantly increases the chance of receiving a review. Make sure to personalize the message!
                        </p>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.75rem' }}>
                            💡 Using the free tier link. No Google API billing required.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

