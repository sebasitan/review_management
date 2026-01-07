export default function Footer() {
    return (
        <footer style={{ background: '#0f172a', color: 'white', padding: '80px 20px 40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>ReputaAI</div>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                        The #1 AI-powered reputation management platform for local businesses.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '24px' }}>Product</h4>
                    <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
                        <li><a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Integrations</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Changelog</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '24px' }}>Company</h4>
                    <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '24px' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
                        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '60px auto 0', paddingTop: '32px', borderTop: '1px solid #334155', textAlign: 'center', color: '#64748b' }}>
                &copy; 2026 ReputaAI Inc. All rights reserved.
            </div>
        </footer>
    );
}
