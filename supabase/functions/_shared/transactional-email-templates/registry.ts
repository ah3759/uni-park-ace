import type { ComponentType } from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {}

// Import and register templates below
import { template as inquiryConfirmation } from './inquiry-confirmation.tsx'
TEMPLATES['inquiry-confirmation'] = inquiryConfirmation

import { template as statusUpdate } from './status-update.tsx'
TEMPLATES['status-update'] = statusUpdate

import { template as valetNotification } from './valet-notification.tsx'
TEMPLATES['valet-notification'] = valetNotification
