/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  vehicleInfo?: string
  pickupLocation?: string
  pickupUrl?: string
  dashboardUrl?: string
  siteName?: string
}

const PickupReadyEmail = ({
  customerName = 'there',
  vehicleInfo = 'your vehicle',
  pickupLocation = 'campus',
  pickupUrl = 'https://univale.app',
  dashboardUrl = 'https://univale.app/customer-login',
  siteName = 'UNiVale',
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>🚗 Your car is safely parked</Text>
        <Text style={paragraph}>
          Hi {customerName}, our valet team has parked {vehicleInfo} for you.
        </Text>
        <Section style={infoBox}>
          <Text style={infoLabel}>Drop-off location</Text>
          <Text style={infoValue}>{pickupLocation}</Text>
        </Section>
        <Text style={paragraph}>
          When you're ready to head back to your car, just tap the button below
          and we'll start bringing it to you. No call or text needed.
        </Text>
        <Section style={{ textAlign: 'center' as const, margin: '28px 0' }}>
          <Button style={primaryButton} href={pickupUrl}>
            Request my car back
          </Button>
        </Section>
        <Text style={smallText}>
          Have an account? You can also request pickup anytime from your{' '}
          <a href={dashboardUrl} style={link}>customer dashboard</a>.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>— The {siteName} Team</Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f6f8', fontFamily: "'Inter', Arial, sans-serif", padding: '40px 0' }
const container = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '560px', margin: '0 auto' }
const heading = { color: 'hsl(222, 60%, 18%)', fontSize: '22px', fontWeight: '600' as const, marginBottom: '16px' }
const paragraph = { color: 'hsl(220, 9%, 30%)', fontSize: '15px', lineHeight: '24px', marginBottom: '12px' }
const infoBox = { backgroundColor: 'hsl(180, 50%, 95%)', borderLeft: '4px solid hsl(180, 60%, 40%)', borderRadius: '6px', padding: '16px', margin: '20px 0' }
const infoLabel = { color: 'hsl(220, 9%, 45%)', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 4px 0' }
const infoValue = { color: 'hsl(222, 47%, 11%)', fontSize: '16px', fontWeight: '600' as const, margin: '0' }
const primaryButton = { backgroundColor: 'hsl(180, 60%, 40%)', color: '#ffffff', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: '600' as const, textDecoration: 'none', display: 'inline-block' }
const smallText = { color: 'hsl(220, 9%, 45%)', fontSize: '13px', lineHeight: '20px', marginTop: '16px' }
const link = { color: 'hsl(180, 60%, 40%)', textDecoration: 'underline' }
const hr = { borderColor: 'hsl(220, 13%, 87%)', margin: '24px 0' }
const footer = { color: 'hsl(220, 9%, 40%)', fontSize: '13px' }

export const template: TemplateEntry = {
  component: PickupReadyEmail,
  subject: () => `Your car is parked — request pickup whenever you're ready 🚗`,
  displayName: 'Pickup Ready',
  previewData: {
    customerName: 'Jane',
    vehicleInfo: '2024 Toyota Camry (White)',
    pickupLocation: 'Gracie\'s Dining Hall',
    pickupUrl: 'https://univale.app/pickup/abc123',
    dashboardUrl: 'https://univale.app/customer-login',
    siteName: 'UNiVale',
  },
}
