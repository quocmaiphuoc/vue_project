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
 * Format date to YYYY-MM-DD
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

/**
 * Format date range for policy period
 * @param {string|Date} fromDate - Start date
 * @param {string|Date} toDate - End date
 * @returns {string} Formatted date range
 */
const formatPolicyPeriod = (fromDate, toDate) => {
  const from = formatDate(fromDate)
  const to = formatDate(toDate)
  if (!from && !to) return ''
  if (!from) return `to ${to}`
  if (!to) return `${from} to`
  return `${from} to ${to}`
}

/**
 * Map API response item to table format
 * @param {Object} item - API response item
 * @param {number} index - Item index
 * @returns {Object} Mapped item
 */
const mapCOIItem = (item, index) => {
  return {
    no: index + 1,
    id: item.id,
    association: item.association || '',
    insuredName: item.insuredName || '',
    coiNo: item.certificateOfInsuranceNo || item.certificateNumber || '',
    policyPeriod: formatPolicyPeriod(item.policyPeriodFrom, item.policyPeriodTo),
    status: item.statusName || '',
    issueDate: formatDate(item.requestDate || item.processedDate),
    emailSubject: `COI_${item.insuredName || ''}_${item.certificateOfInsuranceNo || item.certificateNumber || ''}...`,
    // Keep all original fields for reference
    ...item
  }
}

/**
 * Search COIs with filters
 * @param {Object} params - Search parameters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 * @param {string} params.coiStatus - COI status filter
 * @param {string} params.insuredName - Insured name filter
 * @param {string} params.search - Search text
 * @returns {Promise<Object>} Object with items array and pagination info
 */
export const searchCOIs = async (params) => {
  // Use mock data if mock data is enabled
  if (USE_MOCK_DATA) {
    console.log('Using mock data for development - simulating COI search')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data matching the API response structure
    const mockItems = [
      { 
        id: '1', 
        association: 'ABC Corp', 
        insuredName: 'Emily Carter', 
        certificateOfInsuranceNo: 'COI-001', 
        policyPeriodFrom: '2025-01-01', 
        policyPeriodTo: '2025-12-31', 
        statusName: 'Generating', 
        requestDate: '2025-01-15' 
      },
      { 
        id: '2', 
        association: 'XYZ Inc', 
        insuredName: 'John Smith', 
        certificateOfInsuranceNo: 'COI-002', 
        policyPeriodFrom: '2025-01-01', 
        policyPeriodTo: '2025-12-31', 
        statusName: 'Issued', 
        requestDate: '2025-01-14' 
      },
      { 
        id: '3', 
        association: 'DEF Ltd', 
        insuredName: 'Sarah Johnson', 
        certificateOfInsuranceNo: 'COI-003', 
        policyPeriodFrom: '2025-01-01', 
        policyPeriodTo: '2025-12-31', 
        statusName: 'Issued', 
        requestDate: '2025-01-13' 
      },
    ]
    
    // Filter mock data based on search params
    let filteredItems = mockItems
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredItems = filteredItems.filter(item => 
        (item.insuredName && item.insuredName.toLowerCase().includes(searchLower)) ||
        (item.association && item.association.toLowerCase().includes(searchLower)) ||
        (item.certificateOfInsuranceNo && item.certificateOfInsuranceNo.toLowerCase().includes(searchLower))
      )
    }
    if (params.coiStatus && params.coiStatus !== 'all') {
      filteredItems = filteredItems.filter(item => 
        item.statusName && item.statusName.toLowerCase() === params.coiStatus.toLowerCase()
      )
    }
    if (params.insuredName && params.insuredName !== 'all') {
      filteredItems = filteredItems.filter(item => item.insuredName === params.insuredName)
    }
    
    // Map to table format
    const mappedItems = filteredItems.map((item, index) => mapCOIItem(item, index))
    
    return {
      items: mappedItems,
      pageNumber: 0,
      pageSize: 10,
      totalCount: mappedItems.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false
    }
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.coiStatus && params.coiStatus !== 'all') queryParams.append('coiStatus', params.coiStatus)
    if (params.insuredName && params.insuredName !== 'all') queryParams.append('insuredName', params.insuredName)
    if (params.search) queryParams.append('search', params.search)

    const url = `${API_BASE_URL}/coi/search?${queryParams.toString()}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to search COIs: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    
    // Handle API response structure
    if (responseData.isFailure || !responseData.isSuccess) {
      const errorMessage = responseData.error?.description || 'Failed to search COIs'
      throw new Error(errorMessage)
    }
    
    // Map items to table format
    const items = (responseData.value?.items || []).map((item, index) => mapCOIItem(item, index))
    
    return {
      items,
      pageNumber: responseData.value?.pageNumber || 0,
      pageSize: responseData.value?.pageSize || 0,
      totalCount: responseData.value?.totalCount || 0,
      totalPages: responseData.value?.totalPages || 0,
      hasPreviousPage: responseData.value?.hasPreviousPage || false,
      hasNextPage: responseData.value?.hasNextPage || false
    }
  } catch (error) {
    // If it's a network error, provide helpful message
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      const networkError = new Error('Unable to connect to the server. Please make sure the API server is running.')
      networkError.isNetworkError = true
      throw networkError
    }
    
    console.error('Error searching COIs:', error)
    throw error
  }
}

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


