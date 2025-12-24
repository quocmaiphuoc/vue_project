/**
 * Excel Parser Utility
 * Parses Excel files in the frontend
 */
import * as XLSX from 'xlsx'

/**
 * Parse Excel file and extract data
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data array
 */
export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Skip header row and map to object format
        const headers = jsonData[0] || []
        const rows = jsonData.slice(1)
        
        // Map rows to objects based on headers
        const mappedData = rows
          .filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== '')) // Filter empty rows
          .map((row, rowIndex) => {
            const rowObj = {}
            headers.forEach((header, index) => {
              if (header) {
                // Normalize header names to match expected format
                const normalizedHeader = normalizeHeader(header)
                const cellValue = row[index]
                rowObj[normalizedHeader] = cellValue !== null && cellValue !== undefined ? String(cellValue).trim() : ''
              }
            })
            
            // Ensure required fields have default values if missing
            if (!rowObj.association && rowObj.insuredName) {
              rowObj.association = 'Canadian Society of Respiratory Therapists'
            }
            if (!rowObj.insuredEmail) {
              rowObj.insuredEmail = ''
            }
            if (!rowObj.insuredAddress) {
              rowObj.insuredAddress = ''
            }
            if (!rowObj.insuredCity) {
              rowObj.insuredCity = ''
            }
            
            return rowObj
          })
          .filter(row => {
            // Filter out rows where required fields are empty
            return row.insuredName || row.association
          })
        
        resolve(mappedData)
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        reject(new Error('Failed to parse Excel file. Please check the file format.'))
      }
    }

    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error.message))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Normalize header names to match expected format
 * @param {string} header - Original header name
 * @returns {string} Normalized header name
 */
const normalizeHeader = (header) => {
  if (!header) return ''
  
  const headerLower = header.toLowerCase().trim()
  
  // Map common variations to expected field names
  const headerMap = {
    'association': 'association',
    'assoc': 'association',
    'org': 'association',
    'organization': 'association',
    'company': 'association',
    
    'insured name': 'insuredName',
    'name': 'insuredName',
    'full name': 'insuredName',
    'insured': 'insuredName',
    
    'insured email': 'insuredEmail',
    'email': 'insuredEmail',
    'e-mail': 'insuredEmail',
    'email address': 'insuredEmail',
    
    'insured address': 'insuredAddress',
    'address': 'insuredAddress',
    'street address': 'insuredAddress',
    'street': 'insuredAddress',
    
    'insured city': 'insuredCity',
    'city': 'insuredCity',
  }
  
  return headerMap[headerLower] || headerLower.replace(/\s+/g, '')
}

