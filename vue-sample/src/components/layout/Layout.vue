<template>
  <div class="layout-container">
    <Sidebar @show-logout-dialog="showLogoutDialogHandler" />
    <div class="main-wrapper">
      <Navbar 
        :user-name="userName" 
        @show-logout-dialog="showLogoutDialogHandler"
      />
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
    <LogoutDialog 
      :show="showLogoutDialog" 
      @confirm="handleLogoutConfirm" 
      @cancel="handleLogoutCancel" 
    />
    <GenerateCOIDialog 
      :show="showGenerateCOIDialog" 
      :loading="isLoading"
      @close="handleGenerateCOIClose"
      @upload="handleGenerateCOIUpload"
      @upload-success="handleGenerateCOIUploadSuccess"
      @upload-error="handleGenerateCOIUploadError"
    />
    <ReviewDataDialog 
      :show="showReviewDataDialog" 
      :preview-data="previewData"
      :batch-id="uploadBatchId"
      :loading="isLoading"
      @close="handleReviewDataClose"
      @back="handleReviewDataBack"
      @preview-pdf="handlePreviewPDF"
      @confirm="handleReviewDataConfirm"
      @show-cancel-confirm="showCancelConfirmDialogHandler"
      @show-confirm-dialog="showConfirmIssueDialogHandler"
    />
    <PreviewPDFDialog 
      :show="showPreviewPDFDialog" 
      :pdf-data="selectedPDFData"
      @close="handlePreviewPDFClose"
    />
    <ConfirmDialog
      :show="showCancelConfirmDialog"
      message="Are you sure to cancel the COI generation?"
      cancel-text="No"
      confirm-text="Yes"
      @confirm="handleCancelConfirm"
      @cancel="handleCancelCancel"
    />
    <ConfirmDialog
      :show="showConfirmIssueDialog"
      :message="confirmIssueMessage"
      cancel-text="Cancel"
      confirm-text="Confirm"
      :show-header="true"
      header-title="Confirmation"
      confirm-button-class="btn-confirm-blue"
      @confirm="handleConfirmIssueConfirm"
      @cancel="handleConfirmIssueCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import LogoutDialog from '../organisms/LogoutDialog.vue'
import GenerateCOIDialog from '../organisms/GenerateCOIDialog.vue'
import ReviewDataDialog from '../organisms/ReviewDataDialog.vue'
import PreviewPDFDialog from '../organisms/PreviewPDFDialog.vue'
import ConfirmDialog from '../organisms/ConfirmDialog.vue'
import { generateCOIsFromExcel } from '../../api/api.js'
import { parseExcelFile } from '../../utils/excelParser.js'

const props = defineProps({
  userName: {
    type: String,
    default: 'User'
  }
})

const emit = defineEmits(['logout'])

const showLogoutDialog = ref(false)
const showGenerateCOIDialog = ref(false)
const showReviewDataDialog = ref(false)
const showPreviewPDFDialog = ref(false)
const showCancelConfirmDialog = ref(false)
const showConfirmIssueDialog = ref(false)
const previewData = ref([])
const selectedPDFData = ref(null)
const uploadedExcelFile = ref(null)
const uploadBatchId = ref(null)
const isLoading = ref(false)

const showLogoutDialogHandler = () => {
  showLogoutDialog.value = true
}

const showGenerateCOIDialogHandler = () => {
  showGenerateCOIDialog.value = true
}

// Provide the handler for child components to use
provide('showGenerateCOIDialog', showGenerateCOIDialogHandler)

const handleLogoutConfirm = () => {
  showLogoutDialog.value = false
  emit('logout')
}

const handleLogoutCancel = () => {
  showLogoutDialog.value = false
}

const handleGenerateCOIClose = () => {
  showGenerateCOIDialog.value = false
}

const handleGenerateCOIUpload = async (file) => {
  try {
    isLoading.value = true
    uploadedExcelFile.value = file
    
    // Parse Excel file in frontend and get preview data (fallback if API doesn't provide parsed data)
    const parsedData = await parseExcelFile(file)
    
    // If parsing succeeds, we have valid data
    previewData.value = parsedData
    
    showGenerateCOIDialog.value = false
    showReviewDataDialog.value = true
  } catch (error) {
    console.error('Error parsing Excel file:', error)
    const errorMessage = error.message || 'Failed to parse Excel file. Please check the file format and try again.'
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleGenerateCOIUploadSuccess = (data) => {
  // Handle successful upload from API
  const { file, response } = data
  
  // Store the uploaded file
  uploadedExcelFile.value = file
  
  // Store batch ID from upload response
  uploadBatchId.value = response.value?.id || response.value?.batchNumber || null
  
  // Use parsed data from API response if available, otherwise parse locally
  if (response.value?.parsedData && Array.isArray(response.value.parsedData)) {
    previewData.value = response.value.parsedData
  } else {
    // Fallback to local parsing
    parseExcelFile(file).then(parsedData => {
      previewData.value = parsedData
    }).catch(error => {
      console.error('Error parsing Excel file locally:', error)
      alert('Failed to parse Excel file. Please check the file format and try again.')
      return
    })
  }
  
  // Close upload dialog and show review dialog
  showGenerateCOIDialog.value = false
  showReviewDataDialog.value = true
}

const handleGenerateCOIUploadError = async (errorData) => {
  // Handle error - could be string (old format) or object (new format)
  const errorMessage = typeof errorData === 'string' ? errorData : errorData.errorMessage
  const file = typeof errorData === 'object' ? errorData.file : null
  const shouldParseLocally = typeof errorData === 'object' ? errorData.shouldParseLocally : false
  
  console.error('Upload error:', errorMessage)
  
  // If API failed but we have a file, try to parse it locally
  if (shouldParseLocally && file) {
    try {
      isLoading.value = true
      
      // Parse Excel file locally
      const parsedData = await parseExcelFile(file)
      
      // Store the uploaded file for later use
      uploadedExcelFile.value = file
      uploadBatchId.value = null // No batch ID since API failed
      
      // Set preview data
      previewData.value = parsedData
      
      // Show warning message
      alert(`API upload failed: ${errorMessage}\n\nFile parsed locally. You can review the data, but batch processing may not be available.`)
      
      // Close upload dialog and show review dialog
      showGenerateCOIDialog.value = false
      showReviewDataDialog.value = true
    } catch (parseError) {
      console.error('Error parsing Excel file locally:', parseError)
      alert(`Failed to upload file and parse locally:\n${errorMessage}\n\nParse error: ${parseError.message || 'Invalid file format'}`)
    } finally {
      isLoading.value = false
    }
  } else {
    // If we can't parse locally, just show error
    alert(errorMessage)
  }
}

const handleReviewDataClose = () => {
  showReviewDataDialog.value = false
  previewData.value = []
  uploadedExcelFile.value = null
  uploadBatchId.value = null
}

const handleReviewDataBack = () => {
  showReviewDataDialog.value = false
  showGenerateCOIDialog.value = true
}

const handlePreviewPDF = (row) => {
  selectedPDFData.value = row
  showPreviewPDFDialog.value = true
}

const handlePreviewPDFClose = () => {
  showPreviewPDFDialog.value = false
  selectedPDFData.value = null
}

const showCancelConfirmDialogHandler = () => {
  showCancelConfirmDialog.value = true
}

const handleCancelConfirm = () => {
  showCancelConfirmDialog.value = false
  showReviewDataDialog.value = false
  previewData.value = []
  uploadedExcelFile.value = null
}

const handleCancelCancel = () => {
  showCancelConfirmDialog.value = false
}

const showConfirmIssueDialogHandler = () => {
  showConfirmIssueDialog.value = true
}

const handleConfirmIssueConfirm = async () => {
  if (!uploadedExcelFile.value) {
    alert('No file found. Please upload the file again.')
    return
  }

  try {
    isLoading.value = true
    
    // Call API to generate COIs from Excel file
    const response = await generateCOIsFromExcel(uploadedExcelFile.value)
    
    // Check if upload was successful
    if (response.isSuccess && !response.isFailure) {
      console.log('COIs generated successfully:', response)
      
      // Get success information from response
      const value = response.value || {}
      const successCount = value.successCount || 0
      const totalRecords = value.totalRecords || 0
      const failedCount = value.failedCount || 0
      const batchNumber = value.batchNumber || ''
      
      // Close dialogs and reset state only on success
      showConfirmIssueDialog.value = false
      showReviewDataDialog.value = false
      showGenerateCOIDialog.value = false
      previewData.value = []
      uploadedExcelFile.value = null
      uploadBatchId.value = null
      
      // Show success message with details
      let successMessage = `Successfully uploaded batch ${batchNumber ? `(${batchNumber})` : ''}!\n\n`
      successMessage += `Total Records: ${totalRecords}\n`
      successMessage += `Success: ${successCount}\n`
      if (failedCount > 0) {
        successMessage += `Failed: ${failedCount}\n`
      }
      successMessage += `\nStatus: ${value.statusName || 'Completed'}`
      
      alert(successMessage)
      
      // Optionally refresh the COI list or navigate
      // You might want to emit an event to refresh the CertificateOfInsurance component
    } else {
      // Handle failure case
      const errorMessage = response.error?.description || 'Failed to generate COIs'
      throw new Error(errorMessage)
    }
    
  } catch (error) {
    console.error('Error generating COIs:', error)
    const errorMessage = error.isNetworkError
      ? 'Unable to connect to the server. Please make sure the API server is running.'
      : error.message || 'Failed to generate COIs. Please try again.'
    alert(errorMessage)
    // Don't close dialogs on error - let user try again
  } finally {
    isLoading.value = false
  }
}

const handleConfirmIssueCancel = () => {
  showConfirmIssueDialog.value = false
}

const confirmIssueMessage = computed(() => {
  const count = previewData.value.length.toLocaleString()
  return `Are you sure to issue ${count} COI${previewData.value.length !== 1 ? 's' : ''}?`
})
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #4A4A4A;
  overflow: hidden;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-core-white);
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>

