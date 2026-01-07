'use client';

import { useState } from 'react';
import styles from "../dashboard.module.css";

const templates = [
    { id: 1, name: 'Standard Request', content: "Hi! We'd love to hear your feedback about your recent visit. Could you spare a minute to leave us a review?" },
    { id: 2, name: 'Post-Purchase', content: "Thank you for your purchase! How are you enjoying it? Let us know with a quick review." },
    { id: 3, name: 'Service-Based', content: "It was a pleasure serving you today. Your feedback helps us improve. Leave us a review here:" }
];

export default function RequestsPage() {
    const [method, setMethod] = useState<'email' | 'sms'>('email');
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [recipient, setRecipient] = useState('');

    return (
        <div>


            <div className={styles.contentGrid} style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Compose Request</h2>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                        <button
                            onClick={() => setMethod('email')}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                                background: method === 'email' ? 'white' : 'transparent',
                                boxShadow: method === 'email' ? 'var(--shadow-sm)' : 'none',
                                color: method === 'email' ? 'var(--primary)' : 'var(--text-secondary)'
                            }}
                        >
                            📧 Email
                        </button>
                        <button
                            onClick={() => setMethod('sms')}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                                background: method === 'sms' ? 'white' : 'transparent',
                                boxShadow: method === 'sms' ? 'var(--shadow-sm)' : 'none',
                                color: method === 'sms' ? 'var(--primary)' : 'var(--text-secondary)'
                            }}
                        >
                            📱 SMS
                        </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                            {method === 'email' ? 'Customer Email' : 'Customer Phone Number'}
                        </label>
                        <input
                            type="text"
                            placeholder={method === 'email' ? 'customer@example.com' : '+1 (555) 000-0000'}
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white'
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
                                        borderColor: selectedTemplate.id === t.id ? 'var(--primary)' : 'var(--card-border)',
                                        background: selectedTemplate.id === t.id ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        fontSize: '0.8125rem', fontWeight: 500, textAlign: 'left'
                                    }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Message Preview</label>
                        <textarea
                            value={selectedTemplate.content}
                            onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })}
                            style={{
                                width: '100%', height: '120px', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--card-border)', background: 'white', resize: 'none',
                                fontSize: '0.9375rem', lineHeight: 1.5
                            }}
                        />
                    </div>

                    <button className={styles.primaryBtn} style={{ width: '100%' }}>
                        Send Review Request
                    </button>
                </section>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={`${styles.statCard} glass`}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Campaign Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span color="var(--text-secondary)">Requests Sent</span>
                                <span style={{ fontWeight: 600 }}>1,240</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span color="var(--text-secondary)">Open Rate</span>
                                <span style={{ fontWeight: 600, color: 'var(--success)' }}>68%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span color="var(--text-secondary)">Conversion Rate</span>
                                <span style={{ fontWeight: 600 }}>12.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} glass`} style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>Bulk Campaigns</h3>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '20px' }}>
                            Upload a CSV file to send automated requests to your entire customer list at once.
                        </p>
                        <button style={{
                            width: '100%', padding: '12px', background: 'white', color: 'var(--primary)',
                            borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem'
                        }}>
                            Upload CSV
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
