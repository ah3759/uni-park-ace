import { useState } from "react";
import { Mail, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactInquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Store in business_inquiries table as a general inquiry
    const { error } = await supabase.from("business_inquiries").insert({
      business_name: "General Inquiry",
      contact_name: form.name.trim(),
      contact_email: form.email.trim(),
      contact_phone: "N/A",
      event_type: form.subject,
      event_date: new Date().toISOString().split("T")[0],
      expected_guests: 0,
      venue_location: "N/A",
      additional_details: form.message.trim(),
    });

    if (!error) {
      // Send confirmation email
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "inquiry-confirmation",
            recipientEmail: form.email.trim(),
            templateData: {
              customerName: form.name.trim(),
              businessName: "",
              eventType: form.subject === "general" ? "general inquiry" : form.subject,
              siteName: "UniVale",
            },
          },
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email", emailErr);
      }
    }

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left side — info */}
            <div className="md:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <MessageSquare className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Get in Touch</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Have a <span className="text-gradient">Question?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether it's about our valet services, pricing, partnerships, or anything else — drop us a message and we'll respond within 24 hours.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-secondary" />
                  <span>support@univale.app</span>
                </div>
              </div>
            </div>

            {/* Right side — form */}
            <Card className="md:col-span-3 glass-card border-border/50">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Your Name *</Label>
                      <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="John Smith"
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        maxLength={255}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Subject *</Label>
                    <Select value={form.subject} onValueChange={(v) => update("subject", v)}>
                      <SelectTrigger><SelectValue placeholder="What's this about?" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="pricing">Pricing & Plans</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="event">Event Valet Service</SelectItem>
                        <SelectItem value="support">Support / Issue</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us what you need..."
                      rows={4}
                      maxLength={2000}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInquiry;
