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
    />
    <ReviewDataDialog 
      :show="showReviewDataDialog" 
      :preview-data="previewData"
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
    
    // Parse Excel file in frontend and get preview data
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

const handleReviewDataClose = () => {
  showReviewDataDialog.value = false
  previewData.value = []
  uploadedExcelFile.value = null
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

  const coiCount = previewData.value.length

  try {
    isLoading.value = true
    
    // Call API to generate COIs from Excel file
    const response = await generateCOIsFromExcel(uploadedExcelFile.value)
    
    console.log('COIs generated successfully:', response)
    
    // Close dialogs and reset state
    showConfirmIssueDialog.value = false
    showReviewDataDialog.value = false
    previewData.value = []
    uploadedExcelFile.value = null
    
    // Show success message (you can replace this with a toast notification)
    const successCount = response?.count || coiCount
    alert(`Successfully generated ${successCount} COI(s)!`)
    
    // Optionally refresh the COI list or navigate
    // You might want to emit an event to refresh the CertificateOfInsurance component
    
  } catch (error) {
    console.error('Error generating COIs:', error)
    const errorMessage = error.isNetworkError
      ? 'Unable to connect to the server. Please make sure the API server is running at http://localhost:3000/api'
      : error.message || 'Failed to generate COIs. Please try again.'
    alert(errorMessage)
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

