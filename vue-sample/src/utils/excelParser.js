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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
        
        // Get headers from first row
        const headers = (jsonData[0] || []).map(header => {
          // Clean header: convert to string, trim, and handle empty values
          if (header === null || header === undefined) return ''
          return String(header).trim()
        }).filter(header => header !== '') // Remove empty headers
        
        // Check if we have headers
        if (headers.length === 0) {
          throw new Error('No headers found in Excel file. Please ensure the first row contains column names.')
        }
        
        // Check if worksheet is empty
        if (jsonData.length <= 1) {
          throw new Error('No data rows found in Excel file. Please ensure the file contains data rows below the header row.')
        }
        
        // Get data rows (skip header row)
        const rows = jsonData.slice(1)
        
        // Map rows to objects based on headers, keeping original header names
        const mappedData = rows
          .map((row, rowIndex) => {
            // Check if row has any data
            const hasData = row && row.length > 0 && row.some((cell, cellIndex) => {
              // Check if this cell index corresponds to a valid header
              if (cellIndex >= headers.length) return false
              const value = cell !== null && cell !== undefined ? String(cell).trim() : ''
              return value !== ''
            })
            
            if (!hasData) return null
            
            const rowObj = {}
            headers.forEach((header, index) => {
              const cellValue = row[index]
              // Keep original header name, don't normalize
              rowObj[header] = cellValue !== null && cellValue !== undefined ? String(cellValue).trim() : ''
            })
            
            return rowObj
          })
          .filter(row => row !== null) // Remove null rows (empty rows)
        
        // Check if we have any valid data after filtering
        if (mappedData.length === 0) {
          throw new Error('No valid data rows found in Excel file. Please ensure the file contains data rows with at least one non-empty cell.')
        }
        
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


