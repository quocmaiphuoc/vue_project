<script setup>
import { computed, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'
import Message from 'primevue/message'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

const uploadState = reactive({
  excelName: '',
  rows: [],
  error: '',
  loading: false
})

const fileUploadRef = ref(null)
const fileInputRef = ref(null)

// Pagination state
const first = ref(0)
const rowsPerPage = ref(20)

const triggerFileSelect = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  } else if (fileUploadRef.value) {
    fileUploadRef.value.choose()
  }
}

const handleFileInputChange = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    await loadExcelFile(file)
  }
  // Reset input so same file can be selected again
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const readExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    
    reader.onload = (event) => {
      try {
        let rows
        
        if (isCSV) {
          // Handle CSV files using XLSX library
          const text = event.target.result
          try {
            // Try parsing CSV with XLSX
            const workbook = XLSX.read(text, { 
              type: 'string',
              FS: ',',
              RS: '\n',
              raw: false
            })
            
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              reject(new Error('No data found in CSV file'))
              return
            }
            
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            rows = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              defval: '',
              blankrows: false
            })
          } catch (csvError) {
            // Fallback: simple CSV parsing
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
            if (lines.length === 0) {
              reject(new Error('CSV file is empty'))
              return
            }
            rows = lines.map(line => {
              // Handle quoted CSV values
              const result = []
              let current = ''
              let inQuotes = false
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i]
                const nextChar = line[i + 1]
                
                if (char === '"') {
                  if (inQuotes && nextChar === '"') {
                    current += '"'
                    i++ // Skip next quote
                  } else {
                    inQuotes = !inQuotes
                  }
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim())
                  current = ''
                } else {
                  current += char
                }
              }
              result.push(current.trim())
              return result
            })
            
            // Ensure rows is valid
            if (!rows || rows.length === 0) {
              reject(new Error('Failed to parse CSV file'))
              return
            }
          }
        } else {
          // Handle Excel files (.xlsx, .xls)
          const data = event.target.result
          const arrayBuffer = new Uint8Array(data)
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            reject(new Error('No sheets found in the Excel file'))
            return
          }
          
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: '',
            blankrows: false
          })
        }
        
        if (!rows || rows.length === 0) {
          reject(new Error('No data found in the file'))
          return
        }
        
        resolve(rows)
      } catch (err) {
        reject(new Error(`Error reading file: ${err.message || err}`))
      }
    }
    
    reader.onerror = (err) => {
      reject(new Error(`File reading error: ${err.message || 'Unknown error'}`))
    }
    
    // Read CSV as text, Excel files as array buffer
    if (isCSV) {
      reader.readAsText(file, 'UTF-8')
    } else {
      reader.readAsArrayBuffer(file)
    }
  })

const loadExcelFile = async (file) => {
  uploadState.error = ''
  uploadState.loading = true
  
  if (!file) {
    uploadState.loading = false
    return
  }
  
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'text/csv',
    'text/plain'
  ]
  
  const isExcel = allowed.includes(file.type) || /\.(xlsx|xls|csv)$/i.test(file.name)
  
  if (!isExcel) {
    uploadState.error = 'Please upload an Excel (.xlsx/.xls) or CSV file.'
    uploadState.loading = false
    return
  }

  try {
    const rows = await readExcel(file)
    
    if (!rows || rows.length === 0) {
      uploadState.error = 'The file appears to be empty or contains no data.'
      uploadState.rows = []
      uploadState.excelName = ''
      uploadState.loading = false
      return
    }
    
    // Store all rows but limit preview display
    uploadState.rows = rows
    uploadState.excelName = file.name
    uploadState.error = ''
  } catch (error) {
    uploadState.error = error?.message || 'Unable to read file. Please ensure it is a valid Excel or CSV file.'
    uploadState.rows = []
    uploadState.excelName = ''
  } finally {
    uploadState.loading = false
  }
}

const onExcelUpload = async (event) => {
  const files = event.files || []
  if (files.length > 0) {
    const file = files[0]
    await loadExcelFile(file)
  }
}

const onExcelClear = () => {
  uploadState.excelName = ''
  uploadState.rows = []
  uploadState.error = ''
  uploadState.loading = false
  first.value = 0 // Reset pagination
  if (fileUploadRef.value) {
    fileUploadRef.value.clear()
  }
}

const columnCount = computed(() => {
  if (!uploadState.rows || uploadState.rows.length === 0) return 0
  const headerLen = uploadState.rows[0]?.length || 0
  const bodyMax = uploadState.rows.slice(1).reduce((max, row) => {
    return Math.max(max, Array.isArray(row) ? row.length : 0)
  }, 0)
  return Math.max(headerLen, bodyMax, 1)
})

const columns = computed(() => {
  const count = columnCount.value
  if (count === 0) return []
  
  return Array.from({ length: count }, (_, index) => {
    const headerValue = uploadState.rows[0]?.[index]
    return {
      field: `c${index}`,
      header: headerValue !== undefined && headerValue !== null && headerValue !== '' 
        ? String(headerValue) 
        : `Column ${index + 1}`
    }
  })
})

const tableRows = computed(() => {
  if (!uploadState.rows || uploadState.rows.length <= 1) return []
  
  return uploadState.rows.slice(1).map((row, rowIndex) => {
    const obj = { _rowIndex: rowIndex }
    columns.value.forEach((col, index) => {
      const value = Array.isArray(row) ? (row[index] ?? '') : ''
      obj[col.field] = value !== null && value !== undefined ? String(value) : ''
    })
    return obj
  })
})

const totalRows = computed(() => {
  return tableRows.value.length
})

const displayRows = computed(() => {
  const start = first.value
  const end = start + rowsPerPage.value
  return tableRows.value.slice(start, end)
})

const currentPageRange = computed(() => {
  if (totalRows.value === 0) return { start: 0, end: 0 }
  const start = first.value + 1
  const end = Math.min(first.value + rowsPerPage.value, totalRows.value)
  return { start, end }
})

const tableScrollHeight = computed(() => {
  // Calculate height: viewport height minus fixed elements
  // Header (70px) + Card title/subtitle (~150px) + Upload section (~100px) + File info (~50px) + Pagination (~70px) + Margins (~60px) = ~500px
  // Minimum height: 400px, Maximum: calc(100vh - 500px)
  return 'calc(100vh - 500px)'
})

const onPageChange = (event) => {
  first.value = event.first
  rowsPerPage.value = event.rows
}
</script>

<template>
  <div class="card-space">
    <Card class="w-full data-card">
      <template #title>
        <div class="flex align-items-center gap-3">
          <i class="pi pi-upload text-primary text-xl"></i>
          <div>
            <p class="eyebrow">Data import</p>
            <span class="text-2xl font-semibold">Upload Excel & preview</span>
          </div>
        </div>
      </template>

      <template #subtitle>
        Drag-and-drop (or browse) an Excel/CSV file to preview data in the table.
      </template>
      <template #content>
      <div class="grid mt-2 excel-content" style="row-gap: 1rem">
        <div class="col-12 md:col-12 flex flex-column gap-3">
          <!-- Upload Button Section -->
          <div class="upload-section">
            <div class="flex gap-2 align-items-center flex-wrap mb-3">
              <!-- PrimeVue Button -->
              <Button
                icon="pi pi-upload"
                label="Upload Excel/CSV File"
                :loading="uploadState.loading"
                :disabled="uploadState.loading"
                @click="triggerFileSelect"
                class="upload-button p-button-lg"
                severity="primary"
              />
              <!-- Hidden File Input -->
              <input
                ref="fileInputRef"
                type="file"
                accept=".xlsx,.xls,.csv"
                style="display: none"
                @change="handleFileInputChange"
              />
              <!-- Clear Button -->
              <Button
                v-if="uploadState.excelName"
                icon="pi pi-times"
                label="Clear"
                severity="secondary"
                outlined
                @click="onExcelClear"
              />
            </div>
          </div>

          <div v-if="uploadState.loading" class="flex align-items-center gap-2 text-600">
            <i class="pi pi-spin pi-spinner text-primary"></i>
            <span>Loading file...</span>
          </div>

          <div class="flex align-items-center gap-2 text-600" v-if="uploadState.excelName && !uploadState.loading">
            <i class="pi pi-file-excel text-green-600"></i>
            <span>
              Loaded: <strong>{{ uploadState.excelName }}</strong>
              <span v-if="totalRows > 0"> · {{ totalRows }} row{{ totalRows !== 1 ? 's' : '' }} total</span>
              <span v-if="totalRows > 0"> (showing {{ currentPageRange.start }}-{{ currentPageRange.end }} of {{ totalRows }})</span>
            </span>
          </div>

          <Message v-if="uploadState.error" severity="error" :closable="false">
            {{ uploadState.error }}
          </Message>

          <div v-if="displayRows.length > 0 && !uploadState.loading" class="table-wrapper">
            <DataTable
              :value="displayRows"
              class="p-datatable-sm excel-table"
              scrollable
              :scrollHeight="tableScrollHeight"
              stripedRows
              showGridlines
              responsiveLayout="scroll"
              :paginator="false"
            >
              <Column 
                v-for="col in columns" 
                :key="col.field" 
                :field="col.field" 
                :header="col.header"
                :sortable="true"
                :style="{ minWidth: '120px', maxWidth: '300px' }"
              >
                <template #body="{ data }">
                  <span class="cell-content" :title="data[col.field] || ''">
                    {{ data[col.field] || '' }}
                  </span>
                </template>
              </Column>
            </DataTable>
            
            <!-- Pagination -->
            <Paginator
              :first="first"
              :rows="rowsPerPage"
              :totalRecords="totalRows"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              @page="onPageChange"
              class="table-paginator"
            />
          </div>

          <div v-if="!uploadState.loading && !uploadState.error && uploadState.excelName && displayRows.length === 0" 
               class="flex align-items-center gap-2 text-600 p-3 border-1 surface-border border-round">
            <i class="pi pi-info-circle text-primary"></i>
            <span>No data rows found in the file.</span>
          </div>
        </div>
      </div>
    </template>
    </Card>
  </div>
</template>

<style scoped>
.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  color: var(--text-color-secondary);
}

.data-card {
  border: 1px solid #e4e9f2;
  border-radius: 16px;
}

.table-wrapper {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: visible;
}

.excel-table {
  width: 100%;
  flex: 1;
  min-height: 0;
}

.excel-content {
  max-height: calc(100vh - 200px);
  overflow-x: hidden;
  overflow-y: visible;
  width: 100%;
  max-width: 100%;
}

.excel-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.excel-table :global(.p-datatable-wrapper) {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  max-height: calc(100vh - 500px);
  width: 100%;
  max-width: 100%;
}

.excel-table :global(.p-datatable-scrollable-wrapper) {
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
}

.excel-table :global(.p-datatable-scrollable-header) {
  overflow-x: hidden;
  overflow-y: hidden;
}

.excel-table :global(.p-datatable-scrollable-body) {
  overflow-y: auto !important;
  overflow-x: auto !important;
  width: 100%;
}

.excel-table :global(.p-datatable-scrollable-body-table) {
  width: auto;
  min-width: 100%;
  table-layout: auto;
}

.excel-table :global(.p-datatable-scrollable-header-table),
.excel-table :global(.p-datatable-scrollable-footer-table) {
  width: auto;
  min-width: 100%;
  table-layout: auto;
}

.excel-table :global(.p-datatable-thead) {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface-0);
}

.excel-table :global(.p-datatable-thead > tr > th) {
  background: var(--surface-50);
  font-weight: 600;
  border-bottom: 2px solid var(--surface-border);
  padding: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 11;
  white-space: nowrap;
  min-width: 120px;
}

.excel-table :global(.p-datatable-tbody > tr > td) {
  padding: 0.75rem;
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
  position: relative;
  min-width: 120px;
}

.cell-content {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.excel-table :global(.p-datatable-tbody > tr:hover) {
  background: var(--surface-100);
}

.table-paginator {
  border-top: 1px solid var(--surface-border);
  padding-top: 1rem;
  background: transparent;
}

.upload-section {
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
  border: 1px dashed var(--surface-border);
}

.upload-button {
  min-width: 220px;
  font-weight: 600;
}

.file-upload-component {
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .excel-table :global(.p-datatable-wrapper) {
    max-height: calc(100vh - 550px);
    min-height: 300px;
  }
  
  .excel-content {
    max-height: calc(100vh - 250px);
  }
}

@media (min-height: 900px) {
  .excel-table :global(.p-datatable-wrapper) {
    max-height: calc(100vh - 450px);
  }
}
</style>

