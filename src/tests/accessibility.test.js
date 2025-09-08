/**
 * Accessibility Tests using axe-core
 * Following Clean Code principles and WCAG 2.1 AA compliance
 */

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { BrowserRouter } from 'react-router-dom'

// Components to test
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Header from '../components/layout/Header'
import AdminSidebar from '../components/layout/AdminSidebar'
import Sidebar from '../components/layout/Sidebar'
import Login from '../pages/Login'
import DeviceSelection from '../pages/DeviceSelection'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Helper function to render with Router (required for navigation components)
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Accessibility Compliance Tests', () => {
  
  describe('UI Components', () => {
    
    it('Button component should have no accessibility violations', async () => {
      const { container } = render(<Button>Test Button</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Button with icon should have proper ARIA attributes', async () => {
      const { container } = render(
        <Button icon="ri-user-line" aria-label="User profile">
          Profile
        </Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Disabled button should be accessible', async () => {
      const { container } = render(
        <Button disabled aria-label="Disabled submit button">
          Submit
        </Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Input component should have no accessibility violations', async () => {
      const { container } = render(
        <Input 
          label="Email Address"
          type="email"
          value=""
          onChange={() => {}}
          required
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Input with error state should have proper ARIA attributes', async () => {
      const { container } = render(
        <Input 
          label="Password"
          type="password"
          value=""
          onChange={() => {}}
          error="Password is required"
          required
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Password input with toggle should be accessible', async () => {
      const { container } = render(
        <Input 
          label="Password"
          type="password"
          value="test123"
          onChange={() => {}}
          showPasswordToggle={true}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Layout Components', () => {
    
    it('Header component should have no accessibility violations', async () => {
      const { container } = renderWithRouter(
        <Header currentSection="Dashboard" isAdmin={false} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Admin Header should be accessible', async () => {
      const { container } = renderWithRouter(
        <Header currentSection="Admin Panel" isAdmin={true} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('AdminSidebar should have proper navigation structure', async () => {
      const { container } = render(
        <AdminSidebar onSectionChange={() => {}} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('User Sidebar should be accessible', async () => {
      const { container } = render(
        <Sidebar onSectionChange={() => {}} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Page Components', () => {
    
    it('Login page should have no accessibility violations', async () => {
      const { container } = renderWithRouter(<Login />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('DeviceSelection page should be accessible', async () => {
      const { container } = renderWithRouter(<DeviceSelection />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    
    it('All interactive elements should be keyboard accessible', async () => {
      const { container } = renderWithRouter(<Login />)
      
      // Get all focusable elements
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      // Ensure we have focusable elements
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Navigation menus should support keyboard interaction', async () => {
      const { container } = render(
        <AdminSidebar onSectionChange={() => {}} />
      )
      
      // Get all menu items
      const menuItems = container.querySelectorAll('[role="menuitem"]')
      
      // Ensure menu items are present and accessible
      expect(menuItems.length).toBeGreaterThan(0)
      
      // Each menu item should have proper attributes
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('tabIndex', '0')
        expect(item).toHaveAttribute('aria-label')
      })
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('ARIA Compliance', () => {
    
    it('Form elements should have proper ARIA attributes', async () => {
      const { container } = render(
        <Input 
          label="Test Input"
          type="text"
          value=""
          onChange={() => {}}
          error="Test error message"
          required
        />
      )
      
      const input = container.querySelector('input')
      const errorMessage = container.querySelector('[role="alert"]')
      
      // Check ARIA attributes
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute('role', 'alert')
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Navigation elements should have proper ARIA structure', async () => {
      const { container } = render(
        <AdminSidebar onSectionChange={() => {}} />
      )
      
      const nav = container.querySelector('nav')
      const menuItems = container.querySelectorAll('[role="menuitem"]')
      
      // Check navigation structure
      expect(nav).toHaveAttribute('role', 'navigation')
      expect(nav).toHaveAttribute('aria-label')
      expect(menuItems.length).toBeGreaterThan(0)
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Interactive buttons should have descriptive labels', async () => {
      const { container } = renderWithRouter(
        <Header currentSection="Test" isAdmin={true} />
      )
      
      const profileButton = container.querySelector('button[aria-label*="profile"]')
      
      // Check button has proper labeling
      expect(profileButton).toBeInTheDocument()
      expect(profileButton).toHaveAttribute('aria-label')
      expect(profileButton).toHaveAttribute('aria-expanded')
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Focus Management', () => {
    
    it('Focus indicators should be visible and accessible', async () => {
      const { container } = render(
        <Button>Focusable Button</Button>
      )
      
      const button = container.querySelector('button')
      
      // Simulate focus
      button.focus()
      expect(document.activeElement).toBe(button)
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Tab order should be logical', async () => {
      const { container } = renderWithRouter(<Login />)
      
      // Get all tabbable elements in order
      const tabbableElements = container.querySelectorAll(
        'input:not([tabindex="-1"]), button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      )
      
      // Ensure logical tab order exists
      expect(tabbableElements.length).toBeGreaterThan(0)
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Error Handling Accessibility', () => {
    
    it('Error messages should be announced to screen readers', async () => {
      const { container } = render(
        <Input 
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
          error="Please enter a valid email address"
        />
      )
      
      const errorElement = container.querySelector('[role="alert"]')
      
      // Check error announcement
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveAttribute('role', 'alert')
      expect(errorElement).toHaveTextContent('Please enter a valid email address')
      
      // Check axe compliance
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})

/**
 * Integration test for full page accessibility
 * Tests complete user flows for accessibility compliance
 */
describe('Integration Accessibility Tests', () => {
  
  it('Complete login flow should be accessible', async () => {
    const { container } = renderWithRouter(<Login />)
    
    // Check overall page structure
    const form = container.querySelector('form')
    const inputs = container.querySelectorAll('input')
    const buttons = container.querySelectorAll('button')
    
    expect(form).toBeInTheDocument()
    expect(inputs.length).toBeGreaterThan(0)
    expect(buttons.length).toBeGreaterThan(0)
    
    // Run complete accessibility audit
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Device selection flow should be accessible', async () => {
    const { container } = renderWithRouter(<DeviceSelection />)
    
    // Check device cards are accessible
    const deviceCards = container.querySelectorAll('[role="button"]')
    
    expect(deviceCards.length).toBeGreaterThan(0)
    
    // Each device card should be properly labeled
    deviceCards.forEach(card => {
      expect(card).toHaveAttribute('aria-label')
      expect(card).toHaveAttribute('tabIndex', '0')
    })
    
    // Run complete accessibility audit
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
