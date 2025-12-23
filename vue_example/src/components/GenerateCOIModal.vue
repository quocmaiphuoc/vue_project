<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const currentStep = ref('upload') // 'upload', 'preview', 'confirm'
const uploadedFile = ref(null)
const fileInputRef = ref(null)
const isDragging = ref(false)
const importedData = ref([])

// Sample data structure - replace with actual imported data
const tableData = ref([
  {
    association: 'Canadian Society...',
    insuredName: 'Emily Carter',
    insuredEmail: 'emily@gmail.com',
    insuredAddress: '123 Main St',
    insuredCity: 'Toronto',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Michael Brown',
    insuredEmail: 'michael.brown@gmail.com',
    insuredAddress: '456 Queen St',
    insuredCity: 'Vancouver',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Sophia Lee',
    insuredEmail: 'sophias@gmail.com',
    insuredAddress: '789 King St',
    insuredCity: 'Montreal',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Daniel Smith',
    insuredEmail: 'daniel@gmail.com',
    insuredAddress: '321 Market Ave',
    insuredCity: 'Calgary',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Olivia Martin',
    insuredEmail: 'olivia@gmail.com',
    insuredAddress: '654 Broadway',
    insuredCity: 'Ottawa',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Ethan Scott',
    insuredEmail: 'ethan@gmail.com',
    insuredAddress: '111 Elm St',
    insuredCity: 'Edmonton',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Grace Turner',
    insuredEmail: 'grace@gmail.com',
    insuredAddress: '222 Pine St',
    insuredCity: 'Winnipeg',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'William Evans',
    insuredEmail: 'william@gmail.com',
    insuredAddress: '333 Maple Rd',
    insuredCity: 'Halifax',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'Chloe Wilson',
    insuredEmail: 'chloe123@gmail.com',
    insuredAddress: '444 Oak St',
    insuredCity: 'Regina',
  },
  {
    association: 'Canadian Society...',
    insuredName: 'James Anderson',
    insuredEmail: 'james@gmail.com',
    insuredAddress: '555 Birch Ave',
    insuredCity: 'Quebec City',
  },
])

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const processFile = async (file) => {
  // Validate file type
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ]
  
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx|xlsm|csv)$/i)) {
    alert('Please upload a valid Excel file (XLS, XLSX, XLSM)')
    return
  }
  
  // Validate file size (20MB max)
  if (file.size > 20 * 1024 * 1024) {
    alert('File size exceeds 20MB limit')
    return
  }
  
  uploadedFile.value = file
  
  try {
    // Read the file
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
        
        // Process the data - assuming first row is headers
        if (jsonData.length > 1) {
          const headers = jsonData[0].map((h) => String(h).toLowerCase().replace(/\s+/g, ''))
          
          // Map headers to our data structure
          const processedData = jsonData.slice(1).map((row) => {
            const rowObj = {}
            headers.forEach((header, index) => {
              rowObj[header] = row[index] || ''
            })
            
            // Map to our expected structure
            return {
              association: rowObj.association || rowObj['associationname'] || 'Canadian Society...',
              insuredName: rowObj.insuredname || rowObj.name || rowObj['insured name'] || '',
              insuredEmail: rowObj.email || rowObj.insuredemail || rowObj['insured email'] || '',
              insuredAddress: rowObj.address || rowObj.insuredaddress || rowObj['insured address'] || '',
              insuredCity: rowObj.city || rowObj.insuredcity || rowObj['insured city'] || '',
            }
          }).filter((row) => row.insuredName) // Filter out empty rows
          
          importedData.value = processedData.length > 0 ? processedData : tableData.value
        } else {
          // Fallback to sample data if parsing fails
          importedData.value = tableData.value
        }
        
        currentStep.value = 'preview'
      } catch (error) {
        console.error('Error parsing Excel:', error)
        // Fallback to sample data
        importedData.value = tableData.value
        currentStep.value = 'preview'
      }
    }
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
    }
    
    reader.readAsArrayBuffer(file)
  } catch (error) {
    console.error('Error processing file:', error)
    alert('Error processing file. Please try again.')
  }
}

const handleBrowse = () => {
  fileInputRef.value?.click()
}

const handleBack = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'upload'
  } else if (currentStep.value === 'confirm') {
    currentStep.value = 'preview'
  }
}

const handlePreviewPDF = (rowData) => {
  // Open PDF preview modal
  console.log('Preview PDF for:', rowData)
}

const handleCancel = () => {
  currentStep.value = 'upload'
  uploadedFile.value = null
  importedData.value = []
  emit('cancel')
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'confirm'
  } else if (currentStep.value === 'confirm') {
    emit('confirm', importedData.value)
    handleCancel()
  }
}

const closeDialog = () => {
  handleCancel()
}

const totalRecords = computed(() => importedData.value.length)
</script>

<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :draggable="false"
    :style="{ width: '90vw', maxWidth: '1200px' }"
    @update:visible="(val) => emit('update:visible', val)"
    @hide="closeDialog"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <button
            v-if="currentStep !== 'upload'"
            @click="handleBack"
            class="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <i class="pi pi-arrow-left text-gray-600" />
          </button>
          <h3 class="text-lg font-semibold text-gray-900 m-0">
            Generate New COI(s)
          </h3>
          <span v-if="currentStep === 'preview'" class="text-sm text-gray-500">Data preview</span>
        </div>
        <button
          @click="closeDialog"
          class="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <i class="pi pi-times text-gray-600" />
        </button>
      </div>
    </template>

    <!-- Upload Step -->
    <div v-if="currentStep === 'upload'" class="py-4">
      <h4 class="text-md font-semibold text-gray-900 mb-4">Upload Data</h4>
      
      <div
        :class="[
          'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
        ]"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept=".xls,.xlsx,.xlsm,.csv"
          class="hidden"
          @change="handleFileSelect"
        />
        
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="pi pi-cloud-upload text-blue-600 text-2xl" />
          </div>
          
          <div>
            <p class="text-gray-700 mb-2">
              Drop your file here or
              <button
                @click="handleBrowse"
                class="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Browse
              </button>
            </p>
            <p class="text-sm text-gray-500">
              Max file size: 20MB<br />
              Supported file formats: XLS, XLSX, XLSM
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="uploadedFile" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex items-center gap-2">
          <i class="pi pi-check-circle text-green-600" />
          <span class="text-sm text-green-800">
            File uploaded: {{ uploadedFile.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Preview Step -->
    <div v-if="currentStep === 'preview'" class="py-4">
      <div class="overflow-x-auto">
        <DataTable
          :value="importedData"
          :paginator="true"
          :rows="10"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          class="p-datatable-sm"
        >
          <Column field="association" header="Association" />
          <Column field="insuredName" header="Insured Name" />
          <Column field="insuredEmail" header="Insured Email" />
          <Column field="insuredAddress" header="Insured Address" />
          <Column field="insuredCity" header="Insured City" />
          <Column header="Action">
            <template #body="slotProps">
              <Button
                label="Preview PDF"
                icon="pi pi-eye"
                severity="secondary"
                outlined
                size="small"
                @click="handlePreviewPDF(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Confirm Step -->
    <div v-if="currentStep === 'confirm'" class="py-4">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-orange-500 text-xl" />
          </div>
        </div>
        <div>
          <p class="text-gray-700 text-lg">
            Are you sure to issue {{ totalRecords.toLocaleString() }} COIs?
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          @click="handleCancel"
        />
        <Button
          v-if="currentStep === 'preview'"
          label="Confirm to Issue"
          @click="handleConfirm"
        />
        <Button
          v-if="currentStep === 'confirm'"
          label="Confirm"
          severity="danger"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable) {
  font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}
</style>

