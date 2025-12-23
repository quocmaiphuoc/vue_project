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
      @close="handleGenerateCOIClose"
      @upload="handleGenerateCOIUpload"
    />
    <ReviewDataDialog 
      :show="showReviewDataDialog" 
      :preview-data="previewData"
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
import LogoutDialog from './LogoutDialog.vue'
import GenerateCOIDialog from './GenerateCOIDialog.vue'
import ReviewDataDialog from './ReviewDataDialog.vue'
import PreviewPDFDialog from './PreviewPDFDialog.vue'
import ConfirmDialog from './ConfirmDialog.vue'

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

const handleGenerateCOIUpload = (file) => {
  console.log('File uploaded:', file)
  // Simulate parsing Excel file and getting preview data
  // In a real app, you would parse the Excel file here
  previewData.value = [
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
  showGenerateCOIDialog.value = false
  showReviewDataDialog.value = true
}

const handleReviewDataClose = () => {
  showReviewDataDialog.value = false
  previewData.value = []
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
}

const handleCancelCancel = () => {
  showCancelConfirmDialog.value = false
}

const showConfirmIssueDialogHandler = () => {
  showConfirmIssueDialog.value = true
}

const handleConfirmIssueConfirm = () => {
  console.log('Confirming to issue COIs:', previewData.value)
  // Handle the confirmation logic here
  showConfirmIssueDialog.value = false
  showReviewDataDialog.value = false
  previewData.value = []
  // You might want to show a success message or refresh the data
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

