/**
 * API Service for COI Generation
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Parse Excel file and get preview data
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data array
 */
export const parseExcelFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/coi/parse-excel`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to parse Excel file')
    }

    const data = await response.json()
    return data.previewData || []
  } catch (error) {
    console.error('Error parsing Excel file:', error)
    // Fallback: return mock data for development
    return getMockPreviewData()
  }
}

/**
 * Generate COIs from Excel file
 * @param {File} file - Excel file to process
 * @returns {Promise<Object>} API response
 */
export const generateCOIsFromExcel = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/coi/generate`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to generate COIs')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating COIs:', error)
    throw error
  }
}

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

