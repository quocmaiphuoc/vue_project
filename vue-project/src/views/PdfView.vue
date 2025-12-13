<script setup>
import { ref } from 'vue'

const pdfUrl = ref('')
const pdfName = ref('')
const error = ref('')

const onPdfChange = (event) => {
  const [file] = event.target.files || []
  if (!file) return
  if (file.type !== 'application/pdf') {
    error.value = 'Please select a PDF file to preview.'
    return
  }
  error.value = ''
  if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value)
  pdfUrl.value = URL.createObjectURL(file)
  pdfName.value = file.name
}
</script>

<template>
  <section class="card card--single">
    <header class="card__header">
      <div class="logo logo--pdf">PDF</div>
      <div>
        <p class="eyebrow">Preview</p>
        <h1>PDF file</h1>
        <p class="lead">Select a PDF to view it inline.</p>
      </div>
    </header>

    <label class="browse">
      <input type="file" accept="application/pdf" @change="onPdfChange" />
      <span>Select PDF</span>
    </label>
    <p v-if="pdfName" class="muted">Loaded: <strong>{{ pdfName }}</strong></p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="pdfUrl" class="pdf-frame">
      <embed :src="pdfUrl" type="application/pdf" />
    </div>
  </section>
</template>
