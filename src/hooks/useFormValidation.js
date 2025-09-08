import { useState, useCallback, useEffect, useRef } from 'react'
import { ValidationError, FormSubmissionError } from '../utils/validation-errors'

const createInitialFormState = (initialValues = {}) => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true,
  submitCount: 0
})

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(fieldName, `${fieldName} is required`, value)
  }
  return true
}

const validateMinLength = (value, minLength, fieldName) => {
  if (typeof value === 'string' && value.length < minLength) {
    throw new ValidationError(
      fieldName, 
      `${fieldName} must be at least ${minLength} characters long`,
      value
    )
  }
  return true
}

const validateEmail = (email, fieldName = 'Email') => {
  validateRequired(email, fieldName)
  
  if (!validateEmailFormat(email)) {
    throw new ValidationError(fieldName, 'Please enter a valid email address', email)
  }
  return true
}

const validatePassword = (password, fieldName = 'Password', minLength = 8) => {
  validateRequired(password, fieldName)
  validateMinLength(password, minLength, fieldName)
  return true
}

const useFormValidation = (validationConfig = {}) => {
  const {
    initialValues = {},
    validationRules = {},
    onSubmit,
    debounceMs = 300
  } = validationConfig

  const [formState, setFormState] = useState(createInitialFormState(initialValues))
  const debounceTimeoutRef = useRef(null)

  const validateSingleField = useCallback((fieldName, value) => {
    try {
      const rule = validationRules[fieldName]
      if (rule && typeof rule === 'function') {
        rule(value, fieldName)
      }
      return null
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.message
      }
      return 'Invalid value'
    }
  }, [validationRules])

  const validateAllFields = useCallback((values) => {
    const errors = {}
    
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName]
      const error = validateSingleField(fieldName, value)
      if (error) {
        errors[fieldName] = error
      }
    })
    
    return errors
  }, [validationRules, validateSingleField])

  const updateFieldValue = useCallback((fieldName, value) => {
    setFormState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [fieldName]: value
      },
      touched: {
        ...prevState.touched,
        [fieldName]: true
      }
    }))

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const error = validateSingleField(fieldName, value)
      setFormState(prevState => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          [fieldName]: error
        },
        isValid: !error && Object.keys(prevState.errors).length === 0
      }))
    }, debounceMs)
  }, [validateSingleField, debounceMs])

  const clearFieldError = useCallback((fieldName) => {
    setFormState(prevState => {
      const newErrors = { ...prevState.errors }
      delete newErrors[fieldName]
      
      return {
        ...prevState,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      }
    })
  }, [])

  const setFieldError = useCallback((fieldName, errorMessage) => {
    setFormState(prevState => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [fieldName]: errorMessage
      },
      isValid: false
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState(createInitialFormState(initialValues))
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
  }, [initialValues])

  const handleFormSubmit = useCallback(async (event) => {
    event.preventDefault()
    
    setFormState(prevState => ({
      ...prevState,
      isSubmitting: true,
      submitCount: prevState.submitCount + 1
    }))

    try {
      const errors = validateAllFields(formState.values)
      
      if (Object.keys(errors).length > 0) {
        throw new FormSubmissionError('Form validation failed', errors, formState.values)
      }

      if (onSubmit) {
        await onSubmit(formState.values)
      }

      setFormState(prevState => ({
        ...prevState,
        isSubmitting: false,
        errors: {},
        isValid: true
      }))

    } catch (error) {
      if (error instanceof FormSubmissionError) {
        setFormState(prevState => ({
          ...prevState,
          isSubmitting: false,
          errors: error.getAllErrors(),
          isValid: false
        }))
      } else {
        setFormState(prevState => ({
          ...prevState,
          isSubmitting: false,
          errors: { general: error.message || 'Submission failed' },
          isValid: false
        }))
      }
      throw error
    }
  }, [formState.values, validateAllFields, onSubmit])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    submitCount: formState.submitCount,
    
    updateFieldValue,
    clearFieldError,
    setFieldError,
    resetForm,
    handleFormSubmit,
    
    // Validation utilities
    validateEmail,
    validatePassword,
    validateRequired,
    validateMinLength
  }
}

export default useFormValidation
