<script setup>
import { computed, reactive, ref } from 'vue'
import * as XLSX from 'xlsx'

const uploadState = reactive({
  excelName: '',
  rows: [],
  error: ''
})

const dropActive = ref(false)

const readExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: ''
        })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (err) => reject(err)
    reader.readAsArrayBuffer(file)
  })

const loadExcelFile = async (file) => {
  uploadState.error = ''
  if (!file) return
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
  const isExcel = allowed.includes(file.type) || /\.(xlsx|xls|csv)$/i.test(file.name)
  if (!isExcel) {
    uploadState.error = 'Please upload an Excel (.xlsx/.xls) or CSV file.'
    return
  }

  try {
    const rows = await readExcel(file)
    uploadState.rows = rows.slice(0, 21) // preview first 20 rows
    uploadState.excelName = file.name
  } catch (error) {
    uploadState.error = error?.message || 'Unable to read file'
    uploadState.rows = []
    uploadState.excelName = ''
  }
}

const onFileChange = (event) => {
  const [file] = event.target.files || []
  if (file) {
    loadExcelFile(file)
  }
}

const onDragOver = (event) => {
  event.preventDefault()
  dropActive.value = true
}

const onDragLeave = () => {
  dropActive.value = false
}

const onDrop = (event) => {
  event.preventDefault()
  dropActive.value = false
  const [file] = event.dataTransfer.files || []
  if (file) {
    loadExcelFile(file)
  }
}

const previewHeaders = computed(() => uploadState.rows[0] ?? [])
const previewRows = computed(() => uploadState.rows.slice(1))
</script>

<template>
  <section class="card card--single">
    <header class="card__header">
      <div class="logo logo--secondary">XL</div>
      <div>
        <p class="eyebrow">Data import</p>
        <h1>Upload Excel & preview</h1>
        <p class="lead">Drag-and-drop or browse to load spreadsheet data.</p>
      </div>
    </header>

    <div
      class="dropzone"
      :class="{ 'dropzone--active': dropActive }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div>
        <p class="drop-title">Drag an Excel/CSV file here</p>
        <p class="muted">or</p>
        <label class="browse">
          <input type="file" accept=".xlsx,.xls,.csv" @change="onFileChange" />
          <span>Browse files</span>
        </label>
      </div>
    </div>

    <p v-if="uploadState.excelName" class="muted">
      Loaded: <strong>{{ uploadState.excelName }}</strong>
      <span v-if="previewRows.length"> · showing {{ previewRows.length }} rows</span>
    </p>
    <p v-if="uploadState.error" class="error">{{ uploadState.error }}</p>

    <div v-if="previewRows.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in previewHeaders" :key="index">
              {{ header || `Column ${index + 1}` }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rIndex) in previewRows" :key="rIndex">
            <td v-for="(cell, cIndex) in row" :key="cIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
