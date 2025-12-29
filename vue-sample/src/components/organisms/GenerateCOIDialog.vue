<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleClose">
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-left">
          <button class="back-button" @click="handleClose">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2 class="dialog-title">Generate New COI(s)</h2>
        </div>
        <button class="close-button" @click="handleClose">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="dialog-body">
        <h3 class="dialog-subtitle">Upload Data</h3>
        
        <div 
          class="upload-area"
          :class="{ 'drag-over': isDragOver }"
          @drop="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".xls,.xlsx,.xlsm"
            @change="handleFileSelect"
            class="file-input"
          />
          <div class="upload-content">
            <i class="pi pi-cloud-upload upload-icon"></i>
            <p class="upload-text">Drop your file here or Browse</p>
          </div>
        </div>
        
        <div v-if="selectedFile" class="selected-file">
          <i class="pi pi-file-excel file-icon"></i>
          <span class="file-name">{{ selectedFile.name }}</span>
          <button class="remove-file" @click="removeFile">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="upload-info">
          <p class="info-text">Max file size: 20MB</p>
          <p class="info-text">Supported file formats: XLS, XLSX, XLSM</p>
        </div>
        
        <div class="dialog-actions">
          <button class="btn-cancel" @click="handleClose" :disabled="isUploading">Cancel</button>
          <button 
            class="btn-upload" 
            @click="handleUpload"
            :disabled="!selectedFile || isUploading"
          >
            <span v-if="isUploading" class="upload-loading">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Uploading...</span>
            </span>
            <span v-else>Upload</span>
          </button>
        </div>
        
        <!-- Spinner overlay -->
        <div v-if="isUploading" class="spinner-overlay">
          <div class="spinner-container">
            <i class="pi pi-spin pi-spinner spinner-icon"></i>
            <p class="spinner-text">Uploading file...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadExcelFile } from '../../api/api.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'upload', 'upload-success', 'upload-error'])

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragOver = ref(false)
const isUploading = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  const maxSize = 20 * 1024 * 1024 // 20MB
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12'
  ]
  const allowedExtensions = ['.xls', '.xlsx', '.xlsm']
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  
  if (file.size > maxSize) {
    alert('File size exceeds 20MB limit')
    return
  }
  
  if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
    alert('Please upload a valid Excel file (XLS, XLSX, XLSM)')
    return
  }
  
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleClose = () => {
  emit('close')
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    return
  }

  try {
    isUploading.value = true
    
    // Call API to upload and parse the file
    const response = await uploadExcelFile(selectedFile.value)
    
    // Check if upload was successful
    if (response.isSuccess && !response.isFailure) {
      // Emit success event with response data
      emit('upload-success', {
        file: selectedFile.value,
        response: response
      })
      
      // Also emit the original upload event for backward compatibility
      emit('upload', selectedFile.value)
      
      // Clear selected file
      removeFile()
    } else {
      // Handle failure - but still try to parse locally
      const errorMessage = response.error?.description || 'Failed to upload file'
      emit('upload-error', {
        errorMessage: errorMessage,
        file: selectedFile.value,
        shouldParseLocally: true
      })
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error.isNetworkError
      ? 'Unable to connect to the server. Please make sure the API server is running.'
      : error.message || 'Failed to upload file. Please try again.'
    
    // Even if API fails, try to parse file locally and show data
    emit('upload-error', {
      errorMessage: errorMessage,
      file: selectedFile.value,
      shouldParseLocally: true
    })
    
    // Don't show alert here, let parent handle it and parse locally
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-container {
  background-color: var(--color-core-white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
  position: relative;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #E5E5E5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #666666;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #F5F5F5;
  color: #333333;
}

.back-button i {
  font-size: 18px;
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #666666;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #F5F5F5;
  color: #333333;
}

.close-button i {
  font-size: 20px;
}

.dialog-body {
  padding: 32px;
}

.dialog-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 24px 0;
}

.upload-area {
  border: 2px dashed var(--color-ext-light-blue);
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #F8F9FA;
  margin-bottom: 16px;
}

.upload-area:hover {
  border-color: var(--color-core-dark-blue);
  background-color: #F0F4F8;
}

.upload-area.drag-over {
  border-color: var(--color-core-bright-orange);
  background-color: rgba(247, 127, 0, 0.05);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 48px;
  color: var(--color-ext-light-blue);
}

.upload-text {
  font-size: 16px;
  color: #666666;
  margin: 0;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #F8F9FA;
  border-radius: 8px;
  margin-bottom: 16px;
}

.file-icon {
  font-size: 24px;
  color: #2E7D32;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.remove-file {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #666666;
  transition: all 0.2s;
}

.remove-file:hover {
  background-color: #E5E5E5;
  color: #333333;
}

.upload-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-text {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E5E5E5;
}

.btn-cancel,
.btn-upload {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #E5E5E5;
  color: #666666;
}

.btn-cancel:hover {
  background-color: #D5D5D5;
}

.btn-upload {
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
}

.btn-upload:hover:not(:disabled) {
  background-color: #002838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 48, 73, 0.3);
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-upload:active:not(:disabled) {
  transform: translateY(0);
}

.btn-upload:disabled:hover {
  transform: none;
  box-shadow: none;
}

.upload-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-loading i {
  font-size: 16px;
}

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-icon {
  font-size: 48px;
  color: var(--color-core-dark-blue);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner-text {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0;
}
</style>

