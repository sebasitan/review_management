'use client';

import { useState } from 'react';
import styles from "../dashboard/dashboard.module.css";
import Link from "next/link";

// --- Mock Data ---

const mockBusinesses = [
    {
        id: '1', name: 'Blue Coffee Roasters', owner: 'james@example.com', plan: 'Professional',
        reviews: 1284, status: 'Active', renewalDate: '2026-02-15', paymentMethod: 'Visa •••• 4242',
        lastPaymentAmount: '$79.00', billingStatus: 'Paid'
    },
    {
        id: '2', name: 'Downtown Dental', owner: 'sarah@dental.com', plan: 'Professional',
        reviews: 450, status: 'Active', renewalDate: '2026-02-10', paymentMethod: 'Mastercard •••• 8890',
        lastPaymentAmount: '$79.00', billingStatus: 'Paid'
    },
    {
        id: '3', name: 'Swift Logistics', owner: 'admin@swift.log', plan: 'Starter',
        reviews: 89, status: 'Active', renewalDate: '2026-01-28', paymentMethod: 'Amex •••• 1001',
        lastPaymentAmount: '$29.00', billingStatus: 'Paid'
    },
    {
        id: '4', name: 'The Garden Bistro', owner: 'bistro@web.com', plan: 'Enterprise',
        reviews: 3421, status: 'Past Due', renewalDate: '2026-01-01', paymentMethod: 'Visa •••• 1234',
        lastPaymentAmount: '$199.00', billingStatus: 'Overdue'
    },
    {
        id: '5', name: 'Apex Fitness', owner: 'mike@apex.com', plan: 'Professional',
        reviews: 612, status: 'Active', renewalDate: '2026-02-20', paymentMethod: 'PayPal',
        lastPaymentAmount: '$79.00', billingStatus: 'Paid'
    },
];

const activityLog = [
    { id: 1, event: 'New Subscription', detail: 'Blue Coffee Roasters upgraded to Pro', time: '2 mins ago', icon: '💰' },
    { id: 2, event: 'System Alert', detail: 'OpenAI API latency high (>2s)', time: '15 mins ago', icon: '⚠️' },
    { id: 3, event: 'User Signup', detail: 'New user registered: sarah@dental.com', time: '1 hour ago', icon: '👤' },
    { id: 4, event: 'Plan Change', detail: 'Swift Logistics downgraded to Starter', time: '3 hours ago', icon: '📉' },
];

const mockTickets = [
    { id: 101, user: 'james@example.com', subject: 'AI responses are too long', status: 'Open', priority: 'Medium', date: '2 hours ago' },
    { id: 102, user: 'sarah@dental.com', subject: 'Billing invoice incorrect', status: 'Urgent', priority: 'High', date: '5 hours ago' },
    { id: 103, user: 'admin@swift.log', subject: 'Feature request: LinkedIn support', status: 'Closed', priority: 'Low', date: '1 day ago' },
];

const mockCoupons = [
    { code: 'WELCOME50', discount: '50% OFF', uses: 124, status: 'Active' },
    { code: 'BF2025', discount: '20% OFF', uses: 45, status: 'Expired' },
    { code: 'PARTNER_X', discount: '100% OFF', uses: 3, status: 'Active' },
];

const mockUsage = [
    { tenant: 'The Garden Bistro', tokens: '1.2M', cost: '$36.00', requestCount: 3421, margin: '82%' },
    { tenant: 'Blue Coffee Roasters', tokens: '450k', cost: '$13.50', requestCount: 1284, margin: '83%' },
    { tenant: 'Apex Fitness', tokens: '210k', cost: '$6.30', requestCount: 612, margin: '92%' },
    { tenant: 'Downtown Dental', tokens: '150k', cost: '$4.50', requestCount: 450, margin: '94%' },
    { tenant: 'Swift Logistics', tokens: '25k', cost: '$0.75', requestCount: 89, margin: '97%' },
];

export default function AdminPortal() {
    const [activeTab, setActiveTab] = useState('tenants');
    const [businesses, setBusinesses] = useState(mockBusinesses);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState('You are an empathetic customer support agent. Reply to reviews professionally and concisely.');

    // Marketing State
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Constants
    const TABS = [
        { id: 'tenants', label: 'Tenants' },
        { id: 'usage', label: 'API Usage & Costs' },
        { id: 'support', label: 'Support Tickets' },
        { id: 'marketing', label: 'Marketing & Comms' },
        { id: 'health', label: 'System Health' },
        { id: 'logs', label: 'Audit Logs' },
    ];

    const toggleStatus = (id: string) => {
        setBusinesses(prev => prev.map(b =>
            b.id === id ? { ...b, status: b.status === 'Active' ? 'Suspended' : 'Active' } : b
        ));
        if (selectedTenant && selectedTenant.id === id) {
            setSelectedTenant((prev: any) => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
        }
    };

    const handleUpdatePlan = (newPlan: string) => {
        if (!selectedTenant) return;
        setBusinesses(prev => prev.map(b => b.id === selectedTenant.id ? { ...b, plan: newPlan } : b));
        setSelectedTenant((prev: any) => ({ ...prev, plan: newPlan }));
    };

    const sendBroadcast = () => {
        setIsBroadcasting(true);
        setTimeout(() => {
            alert(`Broadcast Sent to ${businesses.length} users: "${broadcastMsg}"`);
            setIsBroadcasting(false);
            setBroadcastMsg('');
        }, 1500);
    };

    return (
        <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ padding: '4px 12px', background: 'var(--primary)', color: 'white', display: 'inline-block', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>SUPER ADMIN</span>
                        {maintenanceMode && <span style={{ padding: '4px 12px', background: 'var(--warning)', color: 'white', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>MAINTENANCE MODE</span>}
                    </div>
                    <h1>System Overview</h1>
                    <p>Global management of all businesses and reputation feeds.</p>
                </div>
                <Link href="/" className={styles.secondaryBtn}>Back to Main</Link>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? styles.primaryBtn : styles.secondaryBtn}
                        style={{ padding: '8px 20px', fontSize: '0.9rem', textTransform: 'capitalize' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* KPI Cards (Always Visible) */}
            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '40px' }}>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Total ARR</div>
                    <div className={styles.statValue}>$18.4k</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--success)', marginTop: '8px' }}>+12% vs last month</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Active Businesses</div>
                    <div className={styles.statValue}>{businesses.filter(b => b.status === 'Active').length}</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{businesses.filter(b => b.status !== 'Active').length} issues</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Est. API Cost</div>
                    <div className={styles.statValue} style={{ color: 'var(--warning)' }}>$61.05</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Month to Date</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <div className={styles.statLabel}>Avg. Sentiment</div>
                    <div className={styles.statValue}>88%</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Across all tenants</p>
                </div>
            </div>

            {/* --- TENANTS TAB --- */}
            {activeTab === 'tenants' && (
                <section className={`${styles.statCard} glass`} style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Business</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Plan / Billing</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Next Renewal</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Status</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {businesses.map((b) => (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 600 }}>{b.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.owner}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{
                                                width: 'fit-content',
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                                                background: b.plan === 'Enterprise' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                color: b.plan === 'Enterprise' ? 'var(--accent)' : 'var(--primary)'
                                            }}>
                                                {b.plan}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: b.billingStatus === 'Overdue' ? 'var(--error)' : 'var(--text-secondary)' }}>
                                                {b.billingStatus === 'Overdue' ? '⚠️ Payment Failed' : b.paymentMethod}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', fontSize: '0.9rem' }}>
                                        {b.renewalDate}
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600, color: b.status === 'Active' ? 'var(--success)' : 'var(--warning)' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                            {b.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <button
                                            onClick={() => setSelectedTenant(b)}
                                            className="gradient-text"
                                            style={{ fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                                        >
                                            MANAGE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* --- USAGE TAB --- */}
            {activeTab === 'usage' && (
                <section className={`${styles.statCard} glass`} style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>API Token Usage & Costs</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor per-tenant OpenAI usage to ensure plan profitability.</p>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Tenant</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Request Count</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Tokens Used</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Est. Cost</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Profit Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsage.map((u, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{u.tenant}</td>
                                    <td style={{ padding: '16px 24px' }}>{u.requestCount.toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px', fontFamily: 'monospace' }}>{u.tokens}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{u.cost}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>{u.margin}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* --- SUPPORT TAB --- */}
            {activeTab === 'support' && (
                <section className={`${styles.statCard} glass`} style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Priority</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Subject</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>User</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Date</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Status</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.875rem', fontWeight: 700 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTickets.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                            background: t.priority === 'High' ? 'var(--error)' : t.priority === 'Medium' ? 'var(--warning)' : 'var(--success)',
                                            color: 'white'
                                        }}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', fontWeight: 600 }}>{t.subject}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.user}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.date}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            fontSize: '0.85rem', fontWeight: 600,
                                            color: t.status === 'Open' ? 'var(--primary)' : t.status === 'Urgent' ? 'var(--error)' : 'var(--text-muted)'
                                        }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <button className="gradient-text" style={{ fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>REPLY</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* --- MARKETING TAB --- */}
            {activeTab === 'marketing' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Active Discount Codes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {mockCoupons.map(coupon => (
                                <div key={coupon.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px' }}>{coupon.code}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{coupon.uses} redemptions</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--success)' }}>{coupon.discount}</div>
                                        <div style={{ fontSize: '0.75rem', color: coupon.status === 'Active' ? 'var(--success)' : 'var(--text-muted)' }}>{coupon.status}</div>
                                    </div>
                                </div>
                            ))}
                            <button className={styles.secondaryBtn} style={{ marginTop: '16px' }}>+ Create New Coupon</button>
                        </div>
                    </section>

                    <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Global Announcement</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            Send a system-wide banner notification to all active tenant dashboards.
                        </p>
                        <textarea
                            value={broadcastMsg}
                            onChange={(e) => setBroadcastMsg(e.target.value)}
                            placeholder="e.g., Scheduled maintenance tonight at 2 AM UTC."
                            style={{
                                width: '100%', height: '120px', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--card-border)', background: 'white', resize: 'none',
                                fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '24px'
                            }}
                        />
                        <button
                            onClick={sendBroadcast}
                            className={styles.primaryBtn}
                            style={{ width: '100%' }}
                            disabled={isBroadcasting || !broadcastMsg}
                        >
                            {isBroadcasting ? 'Sending...' : '📢 Send Broadcast to All Users'}
                        </button>
                    </section>
                </div>
            )}

            {/* --- HEALTH TAB --- */}
            {activeTab === 'health' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Global AI Configuration</h3>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Model Version</label>
                            <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white' }}>
                                <option>GPT-4o (Recommended)</option>
                                <option>GPT-4 Turbo</option>
                                <option>GPT-3.5 Turbo (Legacy)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>System Prompt (Default)</label>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                style={{
                                    width: '100%', height: '120px', padding: '16px', borderRadius: '12px',
                                    border: '1px solid var(--card-border)', background: 'white', resize: 'none',
                                    fontSize: '0.9375rem', lineHeight: 1.5, fontFamily: 'monospace'
                                }}
                            />
                        </div>

                        <button className={styles.primaryBtn}>Save Configurations</button>
                    </section>

                    <section className={`${styles.statCard} glass`} style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Emergency Controls</h3>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--error)', marginBottom: '4px' }}>Maintenance Mode</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Disable all user logins and background jobs.</div>
                            </div>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                style={{
                                    padding: '8px 16px', background: maintenanceMode ? 'var(--error)' : 'white',
                                    color: maintenanceMode ? 'white' : 'var(--error)', border: '1px solid var(--error)',
                                    borderRadius: '8px', fontWeight: 600
                                }}
                            >
                                {maintenanceMode ? 'DISABLE' : 'ENABLE'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--error)', marginBottom: '4px' }}>Flush Redis Cache</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clear all session data and temporary store.</div>
                            </div>
                            <button
                                style={{
                                    padding: '8px 16px', background: 'white',
                                    color: 'var(--error)', border: '1px solid var(--error)',
                                    borderRadius: '8px', fontWeight: 600
                                }}
                            >
                                EXECUTE
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {/* --- LOGS TAB --- */}
            {activeTab === 'logs' && (
                <section className={`${styles.statCard} glass`}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {activityLog.map((log, i) => (
                            <div key={log.id} style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0',
                                borderBottom: i !== activityLog.length - 1 ? '1px solid var(--card-border)' : 'none'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                                }}>
                                    {log.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '2px' }}>{log.event}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{log.detail}</div>
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {log.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Modal Overlay for Tenant Details */}
            {selectedTenant && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass" style={{ width: '600px', background: 'var(--background)', borderRadius: '24px', padding: '32px', position: 'relative' }}>
                        <button
                            onClick={() => setSelectedTenant(null)}
                            style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '1.25rem', color: 'var(--text-muted)' }}
                        >✕</button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>{selectedTenant.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{selectedTenant.owner} • ID: {selectedTenant.id}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ padding: '20px', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Subscription Plan</h3>
                                <select
                                    value={selectedTenant.plan}
                                    onChange={(e) => handleUpdatePlan(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'white', marginBottom: '8px' }}
                                >
                                    <option value="Starter">Starter ($29/mo)</option>
                                    <option value="Professional">Professional ($79/mo)</option>
                                    <option value="Enterprise">Enterprise ($199/mo)</option>
                                </select>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next billing on: <b>{selectedTenant.renewalDate}</b></div>
                            </div>

                            <div style={{ padding: '20px', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Payment Method</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.25rem' }}>💳</span>
                                    <span style={{ fontWeight: 600 }}>{selectedTenant.paymentMethod}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: selectedTenant.billingStatus === 'Overdue' ? 'var(--error)' : 'var(--success)' }}>
                                    Status: <b>{selectedTenant.billingStatus}</b>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Dangerous Zone</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => toggleStatus(selectedTenant.id)}
                                    style={{
                                        padding: '12px', flex: 1, borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
                                        background: selectedTenant.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: selectedTenant.status === 'Active' ? 'var(--error)' : 'var(--success)',
                                    }}
                                >
                                    {selectedTenant.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                </button>
                                <button style={{ padding: '12px', flex: 1, borderRadius: '10px', border: '1px solid var(--card-border)', background: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                                    Reset Password
                                </button>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px' }}>Billing History</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px 0', borderBottom: '1px solid var(--card-border)' }}>
                                <span>Jan 01, 2026</span>
                                <span>{selectedTenant.lastPaymentAmount}</span>
                                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Invoice #00123</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px 0' }}>
                                <span>Dec 01, 2025</span>
                                <span>{selectedTenant.lastPaymentAmount}</span>
                                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Invoice #00098</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
