// AWS configuration for Amplify, Cognito, IoT Core
// This will be configured when backend is ready
import logger from '../utils/logger'

export const awsConfig = {
  // AWS Cognito Configuration
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
    mandatorySignIn: true,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },

  // AWS IoT Core Configuration  
  IoT: {
    endpoint: process.env.REACT_APP_IOT_ENDPOINT || '',
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || ''
  },

  // API Gateway Configuration
  API: {
    endpoints: [
      {
        name: 'PotentialAPI',
        endpoint: process.env.REACT_APP_API_URL || 'https://api.potential.com',
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
      }
    ]
  },

  // WebSocket Configuration for real-time data
  WebSocket: {
    url: process.env.REACT_APP_WS_URL || 'wss://ws.potential.com'
  }
}

// Initialize AWS Amplify when backend is ready
export const initializeAWS = () => {
  // TODO: Configure AWS Amplify
  // import { Amplify } from 'aws-amplify'
  // Amplify.configure(awsConfig)
  logger.debug('AWS configuration ready for initialization', {
    service: 'aws_config',
    status: 'ready',
    hasApiUrl: !!process.env.REACT_APP_API_URL
  })
}

export default awsConfig
