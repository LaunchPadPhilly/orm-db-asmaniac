import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  // Try dotenv first
  const result = config({ path: envPath })
  
  // If dotenv didn't load anything, manually parse (handles quoted values better)
  if (!process.env.DATABASE_URL) {
    try {
      const envFile = readFileSync(envPath, 'utf-8')
      envFile.split('\n').forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine || trimmedLine.startsWith('#')) return
        
        const match = trimmedLine.match(/^([^=:#\s]+)\s*=\s*(.*)$/)
        if (match) {
          const key = match[1].trim()
          let value = match[2].trim()
          
          // Remove surrounding quotes
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          
          if (key && value) {
            process.env[key] = value
          }
        }
      })
    } catch (error) {
      console.warn('⚠️  Error manually parsing .env.local:', error.message)
    }
  }
} else {
  console.warn('⚠️  .env.local file not found at:', envPath)
}

// Verify DATABASE_URL was loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found!')
  console.error('   Make sure .env.local exists in the project root with:')
  console.error('   DATABASE_URL="postgresql://..."')
  throw new Error('DATABASE_URL environment variable is required for tests')
}

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}))
