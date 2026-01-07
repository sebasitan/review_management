'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';

interface AutomationRule {
    id: string;
    name: string;
    trigger: string;
    condition: string;
    action: string;
    isActive: boolean;
}

const initialRules: AutomationRule[] = [
    {
        id: '1',
        name: 'Auto-Reply 5 Star Reviews',
        trigger: 'New Review',
        condition: 'Rating equals 5 Stars',
        action: 'Post "Thank You" AI Response',
        isActive: true,
    },
    {
        id: '2',
        name: 'Alert on Negative Feedback',
        trigger: 'New Review',
        condition: 'Rating is below 3 Stars',
        action: 'Send Email Alert to Manager',
        isActive: true,
    },
    {
        id: '3',
        name: 'Weekend Response Delay',
        trigger: 'Review Received',
        condition: 'Day is Sat or Sun',
        action: 'Queue Response for Monday',
        isActive: false,
    }
];

export default function AutomationPage() {
    const [rules, setRules] = useState<AutomationRule[]>(initialRules);
    const [isCreating, setIsCreating] = useState(false);

    const toggleRule = (id: string) => {
        setRules(current =>
            current.map(rule =>
                rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
            )
        );
    };

    const deleteRule = (id: string) => {
        if (confirm('Are you sure you want to delete this automation?')) {
            setRules(current => current.filter(rule => rule.id !== id));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button
                    onClick={() => setIsCreating(true)}
                    className={styles.primaryBtn}
                >
                    + Create New Workflow
                </button>
            </div>

            <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                {rules.map((rule) => (
                    <div key={rule.id} className={`${styles.statCard} glass`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            {/* Icon based on status */}
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: rule.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                color: rule.isActive ? 'var(--success)' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                {rule.isActive ? '⚡' : '💤'}
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: rule.isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {rule.name}
                                </h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 500 }}>IF</span>
                                    {rule.trigger} + {rule.condition}
                                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 500 }}>THEN</span>
                                    {rule.action}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input
                                    type="checkbox"
                                    checked={rule.isActive}
                                    onChange={() => toggleRule(rule.id)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: rule.isActive ? 'var(--success)' : '#ccc',
                                    borderRadius: '34px',
                                    transition: '0.4s'
                                }}></span>
                                <span style={{
                                    position: 'absolute', content: '""', height: '18px', width: '18px',
                                    left: rule.isActive ? '26px' : '4px',
                                    bottom: '4px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    transition: '0.4s'
                                }}></span>
                            </label>

                            <button
                                onClick={() => deleteRule(rule.id)}
                                className={styles.secondaryBtn}
                                style={{ padding: '8px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                                🗑️
                            </button>
                        </div>

                    </div>
                ))}

                {rules.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🤖</div>
                        <h3>No active workflows</h3>
                        <p>Create automation rules to save time managing your reviews.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                    <div className="glass" style={{ width: '500px', background: 'var(--background)', borderRadius: '24px', padding: '32px', position: 'relative' }}>
                        <h2 style={{ marginBottom: '24px' }}>Create Workflow</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Rule Name</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Auto-Reply to Positive Reviews"
                                    id="ruleName"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Trigger & Condition</label>
                                <select id="ruleCondition" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white' }}>
                                    <option value="Rating equals 5 Stars">Rating equals 5 Stars</option>
                                    <option value="Rating is below 3 Stars">Rating is below 3 Stars</option>
                                    <option value="Review contains keywords">Review contains keywords</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Action</label>
                                <select id="ruleAction" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'white' }}>
                                    <option value="Post AI Response">Post AI Response</option>
                                    <option value="Send Email Alert">Send Email Alert</option>
                                    <option value="Flag for Review">Flag for Review</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsCreating(false)}
                                className={styles.secondaryBtn}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const name = (document.getElementById('ruleName') as HTMLInputElement).value;
                                    const condition = (document.getElementById('ruleCondition') as HTMLSelectElement).value;
                                    const action = (document.getElementById('ruleAction') as HTMLSelectElement).value;

                                    if (!name) return;

                                    setRules([...rules, {
                                        id: Date.now().toString(),
                                        name,
                                        trigger: 'New Review',
                                        condition,
                                        action,
                                        isActive: true
                                    }]);
                                    setIsCreating(false);
                                }}
                                className={styles.primaryBtn}
                                style={{ flex: 1 }}
                            >
                                Create Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
