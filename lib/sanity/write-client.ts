import { createClient } from 'next-sanity'

// Write-capable client — requires SANITY_API_WRITE_TOKEN (Editor or higher)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-05-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})
