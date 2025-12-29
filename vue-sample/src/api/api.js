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
 * @param {string} params.batchId - Batch ID to filter by
 * @returns {Promise<Object>} Object with items array and pagination info
 */
export const searchCOIs = async (params) => {
  // Use mock data if mock data is enabled
  if (USE_MOCK_DATA) {
    console.log('Using mock data for development - simulating COI search')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get mock preview data and convert to search response format
    const mockPreviewData = getMockPreviewData()
    const mockItems = mockPreviewData.map((item, index) => ({
      id: `coi-${params.batchId || 'default'}-${index + 1}`,
      requestNumber: `REQ-${String(index + 1).padStart(4, '0')}`,
      uploadBatchId: params.batchId || `batch-${Date.now()}`,
      memberId: `member-${index + 1}`,
      memberCode: `M${String(index + 1).padStart(3, '0')}`,
      memberName: item.insuredName,
      rowNumber: index + 1,
      purpose: 'Professional Liability Insurance',
      requestDate: new Date().toISOString(),
      status: index < 2 ? 0 : 1, // First 2 are Generating (0), rest are Issued (1)
      statusName: index < 2 ? 'Generating' : 'Issued',
      processedDate: index < 2 ? null : new Date().toISOString(),
      certificateId: index < 2 ? null : `cert-${index + 1}`,
      certificateNumber: index < 2 ? null : `COI-${String(index + 1).padStart(3, '0')}`,
      pdfUrl: index < 2 ? null : `https://example.com/pdfs/coi-${index + 1}.pdf`,
      validationErrors: null,
      errorMessage: null,
      isUpdate: false,
      association: item.association,
      insuredName: item.insuredName,
      insuredEmail: item.insuredEmail,
      insuredAddress: item.insuredAddress,
      insuredCity: item.insuredCity,
      insuredProvince: item.insuredProvince || '',
      insuredPostalCode: item.insuredPostalCode || '',
      policyNumber: `POL-${String(index + 1).padStart(6, '0')}`,
      certificateOfInsuranceNo: index < 2 ? null : `COI-${String(index + 1).padStart(3, '0')}`,
      policyPeriodFrom: '2025-01-01T00:00:00Z',
      policyPeriodTo: '2025-12-31T23:59:59Z',
      cost: 1250.00,
      professionalLiabilityCoverage: '$10,000,000',
      vicariousLiability: '$10,000,000',
      personalInjuryCoverage: '$5,000,000',
      disciplinaryProceedingsExpensesCoverage: '$2,000,000',
      crisisManagementExpenses: '$5,000,000',
      preClaimExpenses: '$1,000,000',
      coverageSectionAggregationLimitOfLiability: '$10,000,000',
      generalTermsAndConditionsPolicyAggregateLimitOfLiability: '$10,000,000'
    }))
    
    // Filter mock data based on search params
    let filteredItems = mockItems
    
    // If batchId is provided, use it to filter (all items should have matching uploadBatchId)
    if (params.batchId) {
      filteredItems = filteredItems.filter(item => item.uploadBatchId === params.batchId)
    }
    
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
    if (params.batchId) queryParams.append('batchId', params.batchId)

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
 * Upload and parse Excel file
 * Sends file to API for parsing and validation
 * @param {File} file - Excel file to upload
 * @returns {Promise<Object>} API response with parsed data
 */
export const uploadExcelFile = async (file) => {
  // Use mock data if mock data is enabled
  if (USE_MOCK_DATA) {
    console.log('Using mock data for development - simulating file upload')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock batch data
    const mockBatchId = `batch-${Date.now()}`
    const mockFileName = file?.name || 'sample-data.xlsx'
    const mockData = getMockPreviewData()
    
    return {
      isSuccess: true,
      isFailure: false,
      statusCode: 200,
      value: {
        id: mockBatchId,
        batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
        fileName: mockFileName,
        fileUrl: `https://example.com/files/${mockFileName}`,
        totalRecords: mockData.length,
        successCount: mockData.length,
        failedCount: 0,
        batchType: 0,
        status: 1,
        statusName: 'Completed',
        uploadedBy: 'System User',
        uploadedAt: new Date().toISOString(),
        processingStartedAt: new Date().toISOString(),
        processingCompletedAt: new Date().toISOString(),
        errorMessage: null,
        processingSummary: `Successfully processed ${mockData.length} records`,
        parsedData: mockData
      }
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${API_BASE_URL}/coi/upload`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, browser will set it with boundary for FormData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to upload file: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    
    // Handle API response structure
    if (responseData.isFailure || !responseData.isSuccess) {
      const errorMessage = responseData.error?.description || 'Failed to upload file'
      const error = new Error(errorMessage)
      error.statusCode = responseData.statusCode || responseData.error?.statusCode
      throw error
    }
    
    return responseData
  } catch (error) {
    // If it's a network error, provide helpful message
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      const networkError = new Error('Unable to connect to the server. Please make sure the API server is running.')
      networkError.isNetworkError = true
      throw networkError
    }
    
    console.error('Error uploading file:', error)
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
      isSuccess: true,
      isFailure: false,
      statusCode: 200,
      value: {
        id: 'mock-id-123',
        batchNumber: 'BATCH-001',
        fileName: file?.name || 'mock-file.xlsx',
        fileUrl: '',
        totalRecords: getMockPreviewData().length,
        successCount: getMockPreviewData().length,
        failedCount: 0,
        batchType: 0,
        status: 1,
        statusName: 'Completed',
        uploadedBy: 'System',
        uploadedAt: new Date().toISOString(),
        processingStartedAt: new Date().toISOString(),
        processingCompletedAt: new Date().toISOString(),
        errorMessage: null,
        processingSummary: `Successfully processed ${getMockPreviewData().length} records`
      }
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${API_BASE_URL}/coi/generate`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, browser will set it with boundary for FormData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to generate COIs: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    
    // Handle API response structure
    if (responseData.isFailure || !responseData.isSuccess) {
      const errorMessage = responseData.error?.description || 'Failed to generate COIs'
      const error = new Error(errorMessage)
      error.statusCode = responseData.statusCode || responseData.error?.statusCode
      throw error
    }
    
    return responseData
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


