class ValidationError extends Error {
  constructor(field, message, value = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.value = value
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      value: this.value,
      timestamp: this.timestamp
    }
  }
}

class FormSubmissionError extends Error {
  constructor(message, errors = {}, submissionData = null) {
    super(message)
    this.name = 'FormSubmissionError'
    this.errors = errors
    this.submissionData = submissionData
    this.timestamp = new Date().toISOString()
  }

  hasFieldError(fieldName) {
    return fieldName in this.errors
  }

  getFieldError(fieldName) {
    return this.errors[fieldName] || null
  }

  getAllErrors() {
    return this.errors
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
      submissionData: this.submissionData,
      timestamp: this.timestamp
    }
  }
}

class NetworkValidationError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message)
    this.name = 'NetworkValidationError'
    this.statusCode = statusCode
    this.response = response
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      response: this.response,
      timestamp: this.timestamp
    }
  }
}

export { ValidationError, FormSubmissionError, NetworkValidationError }
