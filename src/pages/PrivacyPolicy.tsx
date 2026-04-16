import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 16, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>UniVale ("we," "our," or "us") operates the campus valet parking service at Rochester Institute of Technology. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website (univale.app) and services.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We collect the following personal information when you submit a valet request:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Vehicle details (make, model, color, license plate, and state)</li>
              <li>Pickup location on campus</li>
              <li>Special instructions related to your vehicle</li>
            </ul>
            <p>We may also automatically collect technical data such as browser type, IP address, and usage analytics via Google Analytics (GA4).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and fulfill your valet parking requests</li>
              <li>To send transactional SMS notifications about your vehicle status</li>
              <li>To send transactional email confirmations and updates</li>
              <li>To communicate with you regarding your service requests</li>
              <li>To improve our website and services</li>
              <li>To process payments through our third-party payment processor (Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. SMS Communications</h2>
            <p>By submitting a valet request with your phone number, you consent to receive transactional SMS messages from UniVale regarding the status of your parked vehicle. These messages are one-way, informational only, and are not marketing communications. Message and data rates may apply. You will only receive SMS messages related to active valet requests you have submitted.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Service providers:</strong> Third-party services that help us operate (e.g., Stripe for payments, Twilio for SMS, Resend for email)</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Data Security</h2>
            <p>We implement industry-standard security measures including encrypted data transmission (HTTPS), row-level security on our database, and role-based access controls to protect your personal information. However, no method of electronic transmission or storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Data Retention</h2>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You may request deletion of your data by contacting us.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from email communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">9. Cookies & Analytics</h2>
            <p>We use Google Analytics (GA4) to understand how visitors interact with our website. This may involve cookies and similar tracking technologies. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us at:</p>
            <p className="font-medium">hello@univale.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
