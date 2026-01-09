'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from '@/app/dashboard/dashboard.module.css';

const mockNotifications = [
    { id: 1, title: 'New 5-star Review', desc: 'Alice Brown left a review on Google.', time: '2m ago', read: false, type: 'review' },
    { id: 2, title: 'AI Response Posted', desc: 'Auto-reply sent to Mike Ross.', time: '1h ago', read: true, type: 'ai' },
    { id: 3, title: 'Daily Summary', desc: 'You gained 4 new reviews yesterday.', time: '12h ago', read: true, type: 'system' },
    { id: 4, title: 'Subscription Renewed', desc: 'Pro plan renewed successfully.', time: '1d ago', read: true, type: 'billing' },
];

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const { data: session } = useSession();
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showBusinessMenu, setShowBusinessMenu] = useState(false);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const businessMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifs(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) {
                setShowBusinessMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await fetch('/api/businesses');
                const data = await res.json();
                setBusinesses(data);

                const bId = searchParams.get('businessId');
                if (bId) {
                    const selected = data.find((b: any) => b.id === bId);
                    if (selected) setSelectedBusiness(selected);
                    else if (data.length > 0) setSelectedBusiness(data[0]);
                } else if (data.length > 0) {
                    setSelectedBusiness(data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch businesses", err);
            }
        };

        if (session) {
            fetchBusinesses();
        }
    }, [session, searchParams]);

    const handleBusinessSelect = (business: any) => {
        setSelectedBusiness(business);
        setShowBusinessMenu(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set('businessId', business.id);
        router.push(`${pathname}?${params.toString()}`);
    };

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

    const getInitials = (path: string | null | undefined) => {
        if (!path) return '??';
        return path.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className={styles.topBar}>
            {/* Mobile Menu Button */}
            <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
                ☰
            </button>

            {/* Dynamic Breadcrumb / Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 className={styles.topBarTitle}>{getPageTitle()}</h2>

                {selectedBusiness && (
                    <div style={{ position: 'relative' }} ref={businessMenuRef}>
                        <button
                            onClick={() => setShowBusinessMenu(!showBusinessMenu)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
                                border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 12px',
                                borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            🏢 {selectedBusiness.name} ▾
                        </button>

                        {showBusinessMenu && (
                            <div className="glass" style={{
                                position: 'absolute', top: '100%', left: '0', marginTop: '8px', width: '240px',
                                padding: '8px', borderRadius: '16px', background: 'var(--card-bg)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 100
                            }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px 12px' }}>SWITCH PLACE</p>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {businesses.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleBusinessSelect(b)}
                                            style={{
                                                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px',
                                                fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
                                                background: b.id === selectedBusiness.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                color: b.id === selectedBusiness.id ? 'var(--primary)' : 'var(--text-primary)'
                                            }}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '8px', paddingTop: '8px' }}>
                                    <button
                                        onClick={() => router.push('/onboarding')}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px',
                                            fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        ➕ Add New Place
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>

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

                {/* User Profile */}
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <div style={{ textAlign: 'right', display: 'none' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{session?.user?.name || 'User'}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</p>
                        </div>
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="User"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--card-border)' }}
                            />
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                {getInitials(session?.user?.name)}
                            </div>
                        )}
                    </button>

                    {showUserMenu && (
                        <div className="glass" style={{
                            position: 'absolute', top: '100%', right: '0', marginTop: '12px', width: '200px',
                            padding: '8px', borderRadius: '16px', background: 'var(--card-bg)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 100
                        }}>
                            <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', marginBottom: '8px' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session?.user?.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.email}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', color: 'var(--error)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                🚪 Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
