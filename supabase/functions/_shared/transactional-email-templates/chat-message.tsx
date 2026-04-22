import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  recipientName?: string
  senderName?: string
  preview?: string
  vehicle?: string
  siteName?: string
}

const ChatMessageEmail = ({ recipientName, senderName, preview, vehicle, siteName = 'UNiVale' }: Props) => (
  <Html>
    <Head />
    <Preview>{`New message from ${senderName ?? 'UNiVale'}`}</Preview>
    <Body style={body}>
      <Container style={container}>
        <Heading style={h1}>New message{vehicle ? ` about your ${vehicle}` : ''}</Heading>
        <Text style={text}>Hi {recipientName ?? 'there'},</Text>
        <Text style={text}>
          <strong>{senderName ?? 'UNiVale'}</strong> sent you a new message:
        </Text>
        <Section style={quote}>
          <Text style={quoteText}>{preview}</Text>
        </Section>
        <Text style={text}>
          Open your dashboard to reply: <Link href="https://univale.app/customer-dashboard">univale.app/customer-dashboard</Link>
        </Text>
        <Text style={footer}>{siteName} — RIT Campus Valet</Text>
      </Container>
    </Body>
  </Html>
)

const body = { backgroundColor: '#f6f9fc', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { backgroundColor: '#fff', margin: '40px auto', padding: '32px', borderRadius: '12px', maxWidth: '560px' }
const h1 = { color: '#0a2540', fontSize: '20px', margin: '0 0 16px' }
const text = { color: '#374151', fontSize: '15px', lineHeight: '24px' }
const quote = { backgroundColor: '#f3f4f6', borderLeft: '3px solid #0d9488', padding: '12px 16px', margin: '16px 0', borderRadius: '6px' }
const quoteText = { color: '#111827', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' as const }
const footer = { color: '#6b7280', fontSize: '12px', marginTop: '24px' }

export const template: TemplateEntry = {
  component: ChatMessageEmail,
  subject: (d: Props) => `New message from ${d.senderName ?? 'UNiVale'}`,
  displayName: 'Chat Message Notification',
  previewData: {
    recipientName: 'Alex',
    senderName: 'UNiVale Team',
    preview: 'Your car is ready whenever you are!',
    vehicle: 'Toyota Camry (ABC123)',
    siteName: 'UNiVale',
  },
}