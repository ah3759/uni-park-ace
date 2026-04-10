/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  businessName?: string
  eventType?: string
  eventDate?: string
  siteName?: string
}

const InquiryConfirmationEmail = ({
  customerName = 'Valued Customer',
  businessName = '',
  eventType = 'event',
  eventDate = '',
  siteName = 'UniVale',
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Thanks for reaching out, {customerName}!</Text>
        <Text style={paragraph}>
          We've received your inquiry{businessName ? ` for ${businessName}` : ''} regarding valet service for your {eventType}{eventDate ? ` on ${eventDate}` : ''}.
        </Text>
        <Text style={paragraph}>
          Our team will review your request and get back to you within 24 hours with availability and pricing details.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          — The {siteName} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f6f8', fontFamily: "'Inter', Arial, sans-serif", padding: '40px 0' }
const container = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '560px', margin: '0 auto' }
const heading = { color: 'hsl(222, 60%, 18%)', fontSize: '22px', fontWeight: '600' as const, fontFamily: "'Space Grotesk', Arial, sans-serif", marginBottom: '16px' }
const paragraph = { color: 'hsl(220, 9%, 40%)', fontSize: '15px', lineHeight: '24px', marginBottom: '12px' }
const hr = { borderColor: 'hsl(220, 13%, 87%)', margin: '24px 0' }
const footer = { color: 'hsl(220, 9%, 40%)', fontSize: '13px' }

export const template: TemplateEntry = {
  component: InquiryConfirmationEmail,
  subject: 'We received your inquiry — UniVale',
  displayName: 'Inquiry Confirmation',
  previewData: {
    customerName: 'John Smith',
    businessName: 'Campus Events Co.',
    eventType: 'graduation ceremony',
    eventDate: 'June 15, 2026',
    siteName: 'UniVale',
  },
}
