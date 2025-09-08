import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useFormValidation from '../hooks/useFormValidation'
import { ValidationError } from '../utils/validation-errors'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock component for testing useFormValidation hook
const TestFormComponent = ({ validationRules, onSubmit }) => {
  const {
    values,
    errors,
    isSubmitting,
    updateFieldValue,
    handleFormSubmit
  } = useFormValidation({
    initialValues: { email: '', password: '' },
    validationRules,
    onSubmit
  })

  return (
    <form onSubmit={handleFormSubmit}>
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => updateFieldValue('email', e.target.value)}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        value={values.password}
        onChange={(e) => updateFieldValue('password', e.target.value)}
        error={errors.password}
        showPasswordToggle
        required
      />
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

describe('Enhanced Input Component', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Input
        label="Email Address"
        type="email"
        value=""
        onChange={() => {}}
        placeholder="Enter your email"
        required
      />
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('should have proper ARIA attributes', () => {
    render(
      <Input
        label="Email Address"
        type="email"
        value=""
        onChange={() => {}}
        error="Email is required"
        helperText="Please enter a valid email address"
        required
      />
    )

    const input = screen.getByLabelText(/email address/i)
    
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(input).toHaveAttribute('required')
    
    // Check error message has proper role
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('password toggle should be accessible', async () => {
    const user = userEvent.setup()
    
    render(
      <Input
        label="Password"
        type="password"
        value=""
        onChange={() => {}}
        showPasswordToggle
      />
    )

    const toggleButton = screen.getByLabelText(/show password/i)
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')
    expect(toggleButton).toHaveAttribute('tabindex', '0')

    await user.click(toggleButton)
    
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText(/hide password/i)).toBeInTheDocument()
  })

  test('should handle disabled state properly', () => {
    render(
      <Input
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
        disabled
        showPasswordToggle
      />
    )

    const input = screen.getByLabelText(/email/i)
    const toggleButton = screen.getByRole('button')
    
    expect(input).toBeDisabled()
    expect(toggleButton).toBeDisabled()
    expect(toggleButton).toHaveAttribute('tabindex', '-1')
  })

  test('should generate unique IDs for accessibility', () => {
    render(
      <div>
        <Input label="Email 1" type="email" value="" onChange={() => {}} />
        <Input label="Email 2" type="email" value="" onChange={() => {}} />
      </div>
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0].id).not.toBe(inputs[1].id)
    expect(inputs[0].id).toBeTruthy()
    expect(inputs[1].id).toBeTruthy()
  })
})

describe('Enhanced Button Component', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Button variant="primary" size="md">
        Click me
      </Button>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('should have proper ARIA attributes when disabled', () => {
    render(
      <Button disabled ariaLabel="Save document">
        Save
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('aria-label', 'Save document')
    expect(button).toBeDisabled()
  })

  test('should handle loading state with accessibility', () => {
    render(
      <Button loading>
        Submit
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toBeDisabled()
    
    // Spinner should be aria-hidden
    const spinner = button.querySelector('[aria-hidden="true"]')
    expect(spinner).toBeInTheDocument()
  })

  test('should support different variants', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost']
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Button variant={variant}>
          {variant} button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
      
      unmount()
    })
  })

  test('should handle async onPress with pending state', async () => {
    const mockOnPress = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(
      <Button onPress={mockOnPress}>
        Submit
      </Button>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Button should be disabled during pending
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
    
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})

describe('Form Validation Hook', () => {
  test('should validate required fields', async () => {
    const validationRules = {
      email: (value) => {
        if (!value) throw new ValidationError('email', 'Email is required')
      }
    }
    
    const mockSubmit = jest.fn()
    
    render(
      <TestFormComponent 
        validationRules={validationRules}
        onSubmit={mockSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
    
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  test('should handle real-time validation with debouncing', async () => {
    const validationRules = {
      email: (value) => {
        if (value && !value.includes('@')) {
          throw new ValidationError('email', 'Invalid email format')
        }
      }
    }
    
    render(
      <TestFormComponent 
        validationRules={validationRules}
        onSubmit={() => {}}
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    
    // Type invalid email
    await userEvent.type(emailInput, 'invalid-email')
    
    // Wait for debounced validation
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  test('should submit form with valid data', async () => {
    const validationRules = {
      email: (value) => {
        if (!value) throw new ValidationError('email', 'Email is required')
        if (!value.includes('@')) throw new ValidationError('email', 'Invalid email')
      },
      password: (value) => {
        if (!value) throw new ValidationError('password', 'Password is required')
      }
    }
    
    const mockSubmit = jest.fn()
    
    render(
      <TestFormComponent 
        validationRules={validationRules}
        onSubmit={mockSubmit}
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})

describe('Custom Error Classes', () => {
  test('ValidationError should have proper structure', () => {
    const error = new ValidationError('email', 'Email is required', 'invalid@')
    
    expect(error.name).toBe('ValidationError')
    expect(error.message).toBe('Email is required')
    expect(error.field).toBe('email')
    expect(error.value).toBe('invalid@')
    expect(error.timestamp).toBeTruthy()
    
    const json = error.toJSON()
    expect(json).toEqual({
      name: 'ValidationError',
      message: 'Email is required',
      field: 'email',
      value: 'invalid@',
      timestamp: error.timestamp
    })
  })
})

describe('Integration Tests', () => {
  test('form should work end-to-end with enhanced components', async () => {
    const validationRules = {
      email: (value) => {
        if (!value) throw new ValidationError('email', 'Email is required')
        if (!value.includes('@')) throw new ValidationError('email', 'Invalid email')
      },
      password: (value) => {
        if (!value) throw new ValidationError('password', 'Password is required')
        if (value.length < 6) throw new ValidationError('password', 'Password too short')
      }
    }
    
    const mockSubmit = jest.fn()
    
    const { container } = render(
      <TestFormComponent 
        validationRules={validationRules}
        onSubmit={mockSubmit}
      />
    )

    // Test accessibility
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Test form interaction
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const passwordToggle = screen.getByLabelText(/show password/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    // Test password toggle
    await userEvent.click(passwordToggle)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Test form submission with valid data
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})
