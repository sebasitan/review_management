import styles from "./landing.module.css";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', padding: '100px 20px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Ready to transform your reputation?</h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Join 500+ businesses using AI to get more 5-star reviews and grow closer to their customers.
        </p>
        <button style={{
          padding: '16px 40px', background: 'white', color: 'var(--primary)',
          borderRadius: '100px', fontWeight: 700, fontSize: '1.125rem', border: 'none', cursor: 'pointer',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
        }}>
          Start Your Free Trial
        </button>
      </div>
      <Footer />
    </div>
  );
}
