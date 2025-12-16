<script setup>
import { ref } from 'vue'
import Message from 'primevue/message'
import Button from 'primevue/button'

const pdfUrl = ref('')
const pdfName = ref('')
const error = ref('')
const fileUploadRef = ref(null)
const fileInputRef = ref(null)
const loading = ref(false)

const triggerFileSelect = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  } else if (fileUploadRef.value) {
    fileUploadRef.value.choose()
  }
}

const handleFileInputChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    onPdfUpload({ files: [file] })
  }
  // Reset input so same file can be selected again
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const onPdfUpload = (event) => {
  loading.value = true
  error.value = ''
  
  const files = event.files || []
  if (files.length === 0) {
    loading.value = false
    return
  }
  
  const file = files[0]
  if (!file) {
    loading.value = false
    return
  }
  
  // Check file type - handle both MIME type and file extension
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
  if (!isPdf) {
    error.value = 'Please select a PDF file to preview.'
    loading.value = false
    return
  }
  
  try {
    if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = URL.createObjectURL(file)
    pdfName.value = file.name
    error.value = ''
  } catch (err) {
    error.value = 'Error loading PDF file: ' + (err.message || 'Unknown error')
  } finally {
    loading.value = false
  }
}

const onPdfClear = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
  pdfUrl.value = ''
  pdfName.value = ''
  error.value = ''
  loading.value = false
  if (fileUploadRef.value) {
    fileUploadRef.value.clear()
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>

<template>
  <div class="card-space">
    <Card class="w-full pdf-card">
      <template #title>
        <div class="flex align-items-center gap-3">
          <i class="pi pi-file-pdf text-primary text-xl"></i>
          <div>
            <p class="eyebrow">Preview</p>
            <span class="text-2xl font-semibold">PDF file</span>
          </div>
        </div>
      </template>

      <template #subtitle>
        Select a PDF to view it inline.

      <div class="grid mt-2" style="row-gap: 1rem">
        <div class="col-12 md:col-12 flex flex-column gap-3">
          <!-- Upload Button Section -->
          <div class="upload-section">
            <div class="flex gap-2 align-items-center flex-wrap mb-3">
              <!-- PrimeVue Button -->
              <Button
                icon="pi pi-upload"
                label="Upload PDF File"
                :loading="loading"
                :disabled="loading"
                @click="triggerFileSelect"
                class="upload-button p-button-lg"
                severity="primary"
              />
              <!-- Hidden File Input -->
              <input
                ref="fileInputRef"
                type="file"
                accept="application/pdf,.pdf"
                style="display: none"
                @change="handleFileInputChange"
              />
              <!-- Clear Button -->
              <Button
                v-if="pdfName"
                icon="pi pi-times"
                label="Clear"
                severity="secondary"
                outlined
                @click="onPdfClear"
              />
            </div>
          </div>


          <div v-if="pdfName" class="flex align-items-center gap-2 text-600">
            <i class="pi pi-file text-900"></i>
            <span>Loaded: <strong>{{ pdfName }}</strong></span>
          </div>

          <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

          <div v-if="pdfUrl" class="pdf-frame">
            <embed :src="pdfUrl" type="application/pdf" />
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

.pdf-card {
  border: 1px solid #e4e9f2;
  border-radius: 16px;
}

.pdf-frame {
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a0a;
  min-height: 320px;
  border: 1px solid var(--surface-border);
}

.pdf-frame embed {
  width: 100%;
  height: 480px;
  border: none;
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
</style>
