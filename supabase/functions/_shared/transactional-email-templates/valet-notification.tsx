/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  vehicleInfo?: string
  pickupLocation?: string
  scheduledDate?: string
  scheduledTime?: string
  specialInstructions?: string
  siteName?: string
}

const ValetNotificationEmail = ({
  customerName = 'Customer',
  customerEmail = '',
  customerPhone = '',
  vehicleInfo = '',
  pickupLocation = '',
  scheduledDate = '',
  scheduledTime = '',
  specialInstructions = '',
  siteName = 'UniVale',
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>🚗 New Valet Request</Text>
        <Text style={paragraph}>A new valet request has been submitted.</Text>
        <Section style={detailsBox}>
          <Text style={detailRow}><strong>Customer:</strong> {customerName}</Text>
          {customerEmail && <Text style={detailRow}><strong>Email:</strong> {customerEmail}</Text>}
          {customerPhone && <Text style={detailRow}><strong>Phone:</strong> {customerPhone}</Text>}
          {vehicleInfo && <Text style={detailRow}><strong>Vehicle:</strong> {vehicleInfo}</Text>}
          {pickupLocation && <Text style={detailRow}><strong>Location:</strong> {pickupLocation}</Text>}
          {scheduledDate && <Text style={detailRow}><strong>Date:</strong> {scheduledDate}</Text>}
          {scheduledTime && <Text style={detailRow}><strong>Time:</strong> {scheduledTime}</Text>}
          {specialInstructions && <Text style={detailRow}><strong>Notes:</strong> {specialInstructions}</Text>}
        </Section>
        <Hr style={hr} />
        <Text style={footer}>— {siteName} System</Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f6f8', fontFamily: "'Inter', Arial, sans-serif", padding: '40px 0' }
const container = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '560px', margin: '0 auto' }
const heading = { color: 'hsl(222, 60%, 18%)', fontSize: '22px', fontWeight: '600' as const, fontFamily: "'Space Grotesk', Arial, sans-serif", marginBottom: '16px' }
const paragraph = { color: 'hsl(220, 9%, 40%)', fontSize: '15px', lineHeight: '24px', marginBottom: '12px' }
const detailsBox = { backgroundColor: 'hsl(220, 20%, 97%)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }
const detailRow = { color: 'hsl(222, 47%, 11%)', fontSize: '14px', lineHeight: '22px', margin: '4px 0' }
const hr = { borderColor: 'hsl(220, 13%, 87%)', margin: '24px 0' }
const footer = { color: 'hsl(220, 9%, 40%)', fontSize: '13px' }

export const template: TemplateEntry = {
  component: ValetNotificationEmail,
  subject: 'New valet request received — UniVale',
  displayName: 'Valet Notification (Admin)',
  previewData: {
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 123-4567',
    vehicleInfo: '2024 Honda Civic (Silver)',
    pickupLocation: 'Main Entrance',
    scheduledDate: 'April 15, 2026',
    scheduledTime: '2:00 PM',
    specialInstructions: 'Please handle with care',
    siteName: 'UniVale',
  },
}
