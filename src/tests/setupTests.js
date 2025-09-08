/**
 * Jest Setup for Accessibility Testing
 */

import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
})

// Mock environment variables for tests
process.env.REACT_APP_API_URL = 'http://localhost:3001'
process.env.NODE_ENV = 'test'

// Global test utilities
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock intersection observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Console error handler for cleaner test output
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global cleanup
afterEach(() => {
  // Clean up any DOM changes
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})
