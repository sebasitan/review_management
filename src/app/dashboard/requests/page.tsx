'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import styles from "../dashboard.module.css";

const DEFAULT_TEMPLATE = `Hi {Customer Name},
Thank you for visiting {Business Name}.
We’d really appreciate your feedback.
Please leave us a review here:
{Review Link}`;

function RequestsContent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [method, setMethod] = useState<'whatsapp' | 'sms' | 'email' | 'qr'>('whatsapp');
    const [recipient, setRecipient] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [businessData, setBusinessData] = useState<any>(null);
    const [message, setMessage] = useState(DEFAULT_TEMPLATE);
    const [emailSubject, setEmailSubject] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const qrRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const url = businessId ? `/api/stats?businessId=${businessId}` : '/api/stats';
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.hasBusiness) {
                    setBusinessData(data.business);
                    setEmailSubject(`We’d love your feedback – ${data.business.name}`);
                }
            });
    }, [businessId]);

    const getReviewLink = () => {
        if (!businessData) return '';
        if (businessData.placeId) {
            return `https://search.google.com/local/writereview?placeid=${businessData.placeId}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${businessData.lat},${businessData.lng}`;
    };

    const getFinalMessage = () => {
        let final = message
            .replace('{Customer Name}', customerName || '[Customer Name]')
            .replace('{Business Name}', businessData?.name || '[Business Name]')
            .replace('{Review Link}', getReviewLink());
        return final;
    };

    const handleAction = async () => {
        setIsSending(true);
        setStatus(null);

        const finalMessage = getFinalMessage();
        const reviewLink = getReviewLink();

        try {
            // Track internally
            await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient,
                    method,
                    content: finalMessage,
                    businessId: businessData?.id
                })
            });

            if (method === 'whatsapp') {
                const waUrl = `https://wa.me/${recipient.replace(/\D/g, '')}?text=${encodeURIComponent(finalMessage)}`;
                window.open(waUrl, '_blank');
            } else if (method === 'email') {
                // Email usually opens client or copies
                const mailto = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(finalMessage)}`;
                window.location.href = mailto;
            } else if (method === 'sms') {
                const smsUrl = `sms:${recipient}?body=${encodeURIComponent(finalMessage)}`;
                window.location.href = smsUrl;
            }

            setStatus({ type: 'success', msg: 'Request logged!' });
            if (method !== 'qr') {
                // Keep recipient for QR if they want to track? 
                // Actually tracking QR is usually generic or scanned.
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to log request.' });
        } finally {
            setIsSending(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setStatus({ type: 'success', msg: 'Copied to clipboard!' });
        setTimeout(() => setStatus(null), 2000);
    };

    const downloadQR = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "business-review-qr.png";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();

            // Track QR download/engagement
            fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'qr',
                    businessId: businessData?.id
                })
            });
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>Review Requests</h1>
                <p style={{ color: '#64748b' }}>Generate links and send requests to your customers across different channels.</p>
            </div>

            {/* Compliance Notice */}
            <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                borderLeft: '4px solid #6366f1',
                padding: '16px 20px',
                borderRadius: '8px',
                marginBottom: '32px',
                fontSize: '0.9rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                <p style={{ margin: 0 }}>
                    Reviews are submitted and managed on Google Maps. We provide tools to help you request reviews from customers.
                </p>
            </div>

            <div className={styles.contentGrid} style={{ gridTemplateColumns: '1.4fr 1fr' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Channel Selection</h2>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '32px',
                        background: 'rgba(0,0,0,0.03)',
                        padding: '6px',
                        borderRadius: '12px',
                        width: 'fit-content'
                    }}>
                        {(['whatsapp', 'sms', 'email', 'qr'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMethod(m); setStatus(null); }}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                                    background: method === m ? 'white' : 'transparent',
                                    boxShadow: method === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    color: method === m ? '#6366f1' : '#64748b',
                                    border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.025em'
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {status && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '12px', marginBottom: '24px',
                            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: status.type === 'success' ? '#16a34a' : '#ef4444',
                            fontSize: '0.875rem', fontWeight: 500,
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            {status.type === 'success' ? '✅' : '❌'} {status.msg}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Customer Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'
                                    }}
                                />
                            </div>
                            {method !== 'qr' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                                        {method === 'email' ? 'Customer Email' : 'Phone Number'}
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
                            )}
                        </div>

                        {method === 'email' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Subject Line</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Message Template</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white',
                                    minHeight: '150px', fontSize: '0.9375rem', lineHeight: 1.5, fontFamily: 'inherit'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                                Use <code>{'{Customer Name}'}</code>, <code>{'{Business Name}'}</code>, and <code>{'{Review Link}'}</code> as variables.
                            </p>
                        </div>

                        {method === 'whatsapp' && (
                            <button
                                onClick={handleAction}
                                disabled={isSending || !recipient}
                                className={styles.primaryBtn}
                                style={{ width: '100%', background: '#25D366', color: 'white', marginTop: '12px', fontSize: '1rem' }}
                            >
                                {isSending ? 'Logging...' : 'Open WhatsApp'}
                            </button>
                        )}

                        {(method === 'sms' || method === 'email') && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button
                                    onClick={handleAction}
                                    className={styles.primaryBtn}
                                    style={{ flex: 1, background: '#6366f1' }}
                                >
                                    Open {method === 'sms' ? 'SMS App' : 'Email App'}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(getFinalMessage())}
                                    className={styles.secondaryBtn}
                                    style={{ flex: 1 }}
                                >
                                    Copy Message
                                </button>
                            </div>
                        )}

                        {method === 'qr' && (
                            <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <div style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                                    <QRCodeSVG
                                        ref={qrRef}
                                        value={getReviewLink()}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button
                                        onClick={downloadQR}
                                        className={styles.primaryBtn}
                                        style={{ width: '100%', background: '#6366f1' }}
                                    >
                                        Download QR Code (PNG)
                                    </button>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        💡 <strong>Tip:</strong> Use this QR code at checkout or on invoices.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={`${styles.statCard} glass`} style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Review Link Preview</h3>
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>Google Review URL (Auto-generated)</p>
                            <div style={{
                                display: 'flex', gap: '8px', padding: '12px', background: '#f1f5f9', borderRadius: '10px',
                                border: '1px solid #e2e8f0', wordBreak: 'break-all', fontSize: '0.8125rem', color: '#1e293b'
                            }}>
                                <span style={{ flex: 1 }}>{getReviewLink()}</span>
                                <button
                                    onClick={() => copyToClipboard(getReviewLink())}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
                                    title="Copy Link"
                                >
                                    📋
                                </button>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px' }}>Live Preview</h4>
                            <div style={{
                                padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white',
                                fontSize: '0.875rem', lineHeight: 1.5, color: '#475569', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                            }}>
                                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                                    {getFinalMessage()}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} glass`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', padding: '28px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>Why personal links?</h3>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '20px' }}>
                            Customers are 70% more likely to leave a review when they get a direct link. Personalizing the message with their name increases engagement even further.
                        </p>
                        <ul style={{ paddingLeft: '20px', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.9 }}>
                            <li>Directly opens review compose screen</li>
                            <li>No searching required by customer</li>
                            <li>Mobile-optimized links</li>
                        </ul>
                    </div>
                </section>
            </div>

            <style jsx>{`
                pre {
                    font-family: inherit;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
            `}</style>
        </div>
    );
}

export default function RequestsPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        }>
            <RequestsContent />
        </Suspense>
    );
}
