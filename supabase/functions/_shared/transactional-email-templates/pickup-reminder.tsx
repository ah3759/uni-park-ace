/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  vehicleInfo?: string
  pickupLocation?: string
  scheduledDate?: string
  scheduledTime?: string
  reminderType?: '24h' | '1h'
  dashboardUrl?: string
  siteName?: string
}

const PickupReminderEmail = ({
  customerName = 'there',
  vehicleInfo = 'your vehicle',
  pickupLocation = 'campus',
  scheduledDate = '',
  scheduledTime = '',
  reminderType = '24h',
  dashboardUrl = 'https://univale.app/customer-login',
  siteName = 'UNiVale',
}: Props) => {
  const headline = reminderType === '1h'
    ? '⏰ Your valet pickup is in 1 hour'
    : '📅 Reminder: valet pickup tomorrow'

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>{headline}</Text>
          <Text style={paragraph}>
            Hi {customerName}, this is a reminder for your scheduled UNiVale pickup.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>When</Text>
            <Text style={infoValue}>{scheduledDate} at {scheduledTime}</Text>
            <Text style={{ ...infoLabel, marginTop: '12px' }}>Where</Text>
            <Text style={infoValue}>{pickupLocation}</Text>
            <Text style={{ ...infoLabel, marginTop: '12px' }}>Vehicle</Text>
            <Text style={infoValue}>{vehicleInfo}</Text>
          </Section>
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={primaryButton} href={dashboardUrl}>
              View my booking
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>— The {siteName} Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f5f6f8', fontFamily: "'Inter', Arial, sans-serif", padding: '40px 0' }
const container = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '560px', margin: '0 auto' }
const heading = { color: 'hsl(222, 60%, 18%)', fontSize: '22px', fontWeight: '600' as const, marginBottom: '16px' }
const paragraph = { color: 'hsl(220, 9%, 30%)', fontSize: '15px', lineHeight: '24px', marginBottom: '12px' }
const infoBox = { backgroundColor: 'hsl(220, 20%, 97%)', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const infoLabel = { color: 'hsl(220, 9%, 45%)', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 4px 0' }
const infoValue = { color: 'hsl(222, 47%, 11%)', fontSize: '16px', fontWeight: '600' as const, margin: '0' }
const primaryButton = { backgroundColor: 'hsl(222, 60%, 18%)', color: '#ffffff', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: '500' as const, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: 'hsl(220, 13%, 87%)', margin: '24px 0' }
const footer = { color: 'hsl(220, 9%, 40%)', fontSize: '13px' }

export const template: TemplateEntry = {
  component: PickupReminderEmail,
  subject: (data: any) => data?.reminderType === '1h'
    ? `Your UNiVale pickup is in 1 hour ⏰`
    : `Reminder: your UNiVale pickup is tomorrow`,
  displayName: 'Pickup Reminder',
  previewData: {
    customerName: 'Jane',
    vehicleInfo: '2024 Toyota Camry (White)',
    pickupLocation: 'Gracie\'s Dining Hall',
    scheduledDate: 'Mon, Apr 21',
    scheduledTime: '3:30 PM',
    reminderType: '24h',
  },
}
