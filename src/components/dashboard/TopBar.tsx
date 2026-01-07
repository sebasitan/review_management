'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/dashboard/dashboard.module.css';

const mockNotifications = [
    { id: 1, title: 'New 5-star Review', desc: 'Alice Brown left a review on Google.', time: '2m ago', read: false, type: 'review' },
    { id: 2, title: 'AI Response Posted', desc: 'Auto-reply sent to Mike Ross.', time: '1h ago', read: true, type: 'ai' },
    { id: 3, title: 'Daily Summary', desc: 'You gained 4 new reviews yesterday.', time: '12h ago', read: true, type: 'system' },
    { id: 4, title: 'Subscription Renewed', desc: 'Pro plan renewed successfully.', time: '1d ago', read: true, type: 'billing' },
];

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);
    const notifRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifs(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get Title based on pathname
    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Overview';
        if (pathname.includes('/reviews')) return 'Review Management';
        if (pathname.includes('/requests')) return 'Campaigns';
        if (pathname.includes('/analytics')) return 'Analytics';
        if (pathname.includes('/competitors')) return 'Competitors';
        if (pathname.includes('/widgets')) return 'Widget Studio';
        if (pathname.includes('/marketing')) return 'Marketing Hub';
        if (pathname.includes('/help')) return 'Help Center';
        if (pathname.includes('/settings')) return 'Settings';
        return 'Dashboard';
    };

    return (
        <div className={styles.topBar}>
            {/* Mobile Menu Button */}
            <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
                ☰
            </button>

            {/* Dynamic Breadcrumb / Title */}
            <h2 className={styles.topBarTitle}>{getPageTitle()}</h2>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>

                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        onClick={() => { setShowNotifs(!showNotifs); setUnreadCount(0); }}
                        style={{ position: 'relative', background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px',
                                background: 'var(--error)', borderRadius: '50%', border: '2px solid white'
                            }}></span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="glass" style={{
                            position: 'absolute', top: '100%', right: '0', marginTop: '12px', width: '320px',
                            padding: '0', borderRadius: '16px', background: 'var(--card-bg)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100
                        }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', fontWeight: 700 }}>
                                Notifications
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {mockNotifications.map(n => (
                                    <div key={n.id} style={{
                                        padding: '16px', borderBottom: '1px solid var(--card-border)',
                                        background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                Mark all as read
                            </div>
                        </div>
                    )}
                </div>

                {/* User Avatar (Mini) */}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                    JW
                </div>
            </div>
        </div>
    );
}
