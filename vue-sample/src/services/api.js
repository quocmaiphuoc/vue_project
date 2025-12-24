/**
 * API Service for COI Generation
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://webhook.site'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false

/**
 * Mock preview data for development/testing
 * @returns {Array} Mock data array
 */
const getMockPreviewData = () => {
  return [
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Emily Carter', insuredEmail: 'emily@gmail.com', insuredAddress: '123 Main St', insuredCity: 'Toronto' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Michael Brown', insuredEmail: 'michael.brown@gmail.com', insuredAddress: '456 Queen St', insuredCity: 'Vancouver' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Sophia Lee', insuredEmail: 'sophias@gmail.com', insuredAddress: '789 King St', insuredCity: 'Montreal' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Daniel Smith', insuredEmail: 'daniel.smith@gmail.com', insuredAddress: '321 Oak Ave', insuredCity: 'Calgary' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Olivia Martin', insuredEmail: 'olivia.martin@gmail.com', insuredAddress: '654 Pine St', insuredCity: 'Ottawa' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Ethan Scott', insuredEmail: 'ethan.scott@gmail.com', insuredAddress: '987 Elm St', insuredCity: 'Edmonton' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Grace Turner', insuredEmail: 'grace.turner@gmail.com', insuredAddress: '147 Maple Ave', insuredCity: 'Winnipeg' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'William Evans', insuredEmail: 'william.evans@gmail.com', insuredAddress: '258 Cedar St', insuredCity: 'Halifax' },
    { association: 'Canadian Society of Respiratory Therapists', insuredName: 'Chloe Wilson', insuredEmail: 'chloe.wilson@gmail.com', insuredAddress: '369 Birch Ave', insuredCity: 'Regina' },
  ]
}

/**
 * Note: Excel parsing is now done in the frontend using excelParser.js
 * This function is kept for backward compatibility but parsing happens in Layout.vue
 */

/**
 * Generate COIs from Excel file
 * Sends file to API, API processes it and generates COIs
 * @param {File} file - Excel file to process
 * @returns {Promise<Object>} API response with generation results
 */
export const generateCOIsFromExcel = async (file) => {
  // Use mock success if mock data is enabled
  if (USE_MOCK_DATA) {
    console.log('Using mock data for development - simulating COI generation')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      success: true,
      message: 'COIs generated successfully',
      count: getMockPreviewData().length
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`https://webhook.site`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, browser will set it with boundary for FormData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to generate COIs: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    // If it's a network error, provide helpful message
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      const networkError = new Error('Unable to connect to the server. Please make sure the API server is running.')
      networkError.isNetworkError = true
      throw networkError
    }
    
    console.error('Error generating COIs:', error)
    throw error
  }
}


