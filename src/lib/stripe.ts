import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27' as any,
        appInfo: {
            name: 'ReputaAI',
            version: '0.1.0',
        },
    })
    : null as any;
