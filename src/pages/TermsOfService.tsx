import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 16, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using UniVale's website (univale.app) and valet parking services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>UniVale provides campus valet parking services at Rochester Institute of Technology. Our services include vehicle pickup, parking, and return at designated campus locations. Service availability is subject to operational hours, staffing, and campus policies.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. Eligibility</h2>
            <p>You must be at least 18 years old and possess a valid driver's license to use our valet services. By submitting a valet request, you represent that you are the vehicle owner or have authorization from the owner to use our service.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate vehicle and contact information</li>
              <li>Ensure your vehicle is in safe, operable condition</li>
              <li>Remove all valuables from your vehicle before handoff</li>
              <li>Be present at the designated pickup location at the scheduled time</li>
              <li>Comply with all applicable campus parking regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Service Plans & Payment</h2>
            <p>UniVale offers the following service options:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Pay-Per-Use:</strong> $8 per valet session</li>
              <li><strong>Monthly Plan:</strong> $99/month for unlimited valet service</li>
              <li><strong>Semester Plan:</strong> $399/semester for unlimited valet service</li>
            </ul>
            <p>Payments are processed securely through Stripe. All fees are non-refundable unless otherwise stated. We reserve the right to modify pricing with reasonable notice.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Vehicle Inspection</h2>
            <p>Our staff may photograph your vehicle upon receipt for documentation purposes. These photos serve as a record of your vehicle's condition at the time of handoff and are stored securely.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Liability</h2>
            <p>UniVale exercises reasonable care in handling your vehicle. However:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We are not responsible for loss or damage to personal items left in vehicles</li>
              <li>We are not liable for pre-existing vehicle damage documented during inspection</li>
              <li>Our liability for any vehicle damage is limited to the cost of reasonable repair</li>
              <li>We are not responsible for delays caused by circumstances beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">8. SMS & Email Communications</h2>
            <p>By using our services, you consent to receiving transactional SMS and email communications related to your valet requests. These include status updates, confirmations, and service-related notifications. You may unsubscribe from email communications at any time via the unsubscribe link in our emails.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">9. Cancellations</h2>
            <p>You may cancel a valet request before a valet attendant has been assigned. Once an attendant is en route, cancellation fees may apply. Subscription plans may be cancelled through your account dashboard.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">10. Prohibited Conduct</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Misrepresenting vehicle ownership or identity</li>
              <li>Using the service for illegal activities</li>
              <li>Interfering with or abusing our staff or systems</li>
              <li>Submitting false or fraudulent requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">11. Modifications</h2>
            <p>We reserve the right to modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">12. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">13. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="font-medium">hello@univale.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
