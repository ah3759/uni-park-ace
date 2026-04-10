/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  status?: string
  vehicleInfo?: string
  message?: string
  siteName?: string
  dashboardUrl?: string
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: '✅ Confirmed',
  in_progress: '🚗 In Progress',
  completed: '✅ Completed',
  cancelled: '❌ Cancelled',
  pending: '⏳ Pending',
}

const StatusUpdateEmail = ({
  customerName = 'Valued Customer',
  status = 'confirmed',
  vehicleInfo = 'your vehicle',
  message = '',
  siteName = 'UniVale',
  dashboardUrl = 'https://univale.lovable.app/customer-login',
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Request Update</Text>
        <Text style={paragraph}>
          Hey {customerName}, your valet request for {vehicleInfo} has been updated.
        </Text>
        <Section style={statusBox}>
          <Text style={statusText}>
            Status: {STATUS_LABELS[status] || status}
          </Text>
        </Section>
        {message && <Text style={paragraph}>{message}</Text>}
        <Button style={button} href={dashboardUrl}>
          View Dashboard
        </Button>
        <Hr style={hr} />
        <Text style={footer}>— The {siteName} Team</Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f6f8', fontFamily: "'Inter', Arial, sans-serif", padding: '40px 0' }
const container = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '560px', margin: '0 auto' }
const heading = { color: 'hsl(222, 60%, 18%)', fontSize: '22px', fontWeight: '600' as const, fontFamily: "'Space Grotesk', Arial, sans-serif", marginBottom: '16px' }
const paragraph = { color: 'hsl(220, 9%, 40%)', fontSize: '15px', lineHeight: '24px', marginBottom: '12px' }
const statusBox = { backgroundColor: 'hsl(220, 20%, 97%)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }
const statusText = { color: 'hsl(222, 47%, 11%)', fontSize: '16px', fontWeight: '600' as const, margin: '0' }
const button = { backgroundColor: 'hsl(222, 60%, 18%)', color: '#f1f5f9', borderRadius: '12px', padding: '12px 24px', fontSize: '15px', fontWeight: '500' as const, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: 'hsl(220, 13%, 87%)', margin: '24px 0' }
const footer = { color: 'hsl(220, 9%, 40%)', fontSize: '13px' }

export const template: TemplateEntry = {
  component: StatusUpdateEmail,
  subject: (data: any) => `Valet request ${data?.status || 'update'} — UniVale`,
  displayName: 'Status Update',
  previewData: {
    customerName: 'Jane Doe',
    status: 'confirmed',
    vehicleInfo: '2024 Toyota Camry (White)',
    message: 'Your vehicle has been confirmed for pickup at the Main Entrance.',
    siteName: 'UniVale',
  },
}
