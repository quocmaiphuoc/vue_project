<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleClose">
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-left">
          <button class="back-button" @click="handleBack">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2 class="dialog-title">Generate New COI(s)</h2>
        </div>
        <button class="close-button" @click="handleClose">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="dialog-body">
        <div class="section-header">
          <i class="pi pi-table section-icon"></i>
          <h3 class="dialog-subtitle">Data preview</h3>
        </div>
        
        <div class="table-container">
          <table class="data-table" v-if="displayData.length > 0 || isLoadingData">
            <thead>
              <tr>
                <th>Association</th>
                <th>Insured Name</th>
                <th>Insured Email</th>
                <th>Insured Address</th>
                <th>Insured City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingData">
                <td colspan="6" class="loading-cell">
                  <div class="loading-spinner">
                    <i class="pi pi-spin pi-spinner"></i>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="displayData.length === 0">
                <td colspan="6" class="no-data-cell">
                  <p>No data to display</p>
                </td>
              </tr>
              <tr v-else v-for="(row, index) in displayData" :key="index">
                <td>{{ row.association || '' }}</td>
                <td>{{ row.insuredName || '' }}</td>
                <td>{{ row.insuredEmail || '' }}</td>
                <td>{{ row.insuredAddress || '' }}</td>
                <td>{{ row.insuredCity || '' }}</td>
                <td>
                  <button class="preview-btn" @click="handlePreviewPDF(row)">
                    <i class="pi pi-eye"></i>
                    Preview PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="dialog-actions">
          <button class="btn-cancel" @click="handleClose" :disabled="loading">Cancel</button>
          <button class="btn-confirm" @click="handleConfirm" :disabled="loading">
            <span v-if="loading">Processing...</span>
            <span v-else>Confirm to Issue</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { searchCOIs } from '../../api/api.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  previewData: {
    type: Array,
    default: () => []
  },
  batchId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'back', 'preview-pdf', 'confirm', 'show-cancel-confirm', 'show-confirm-dialog'])

const tableData = ref([])
const isLoadingData = ref(false)

// Display data - use tableData if available, otherwise use previewData
const displayData = computed(() => {
  return tableData.value.length > 0 ? tableData.value : props.previewData
})

// Watch for dialog show and batchId changes to fetch data
watch([() => props.show, () => props.batchId], async ([show, batchId]) => {
  if (show && batchId) {
    await fetchBatchData(batchId)
  } else if (show && !batchId && props.previewData.length > 0) {
    // Fallback to previewData if no batchId
    tableData.value = props.previewData
  } else if (!show) {
    // Clear data when dialog closes
    tableData.value = []
  }
}, { immediate: true })

/**
 * Format date to YYYY-MM-DD
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

/**
 * Format date range for policy period
 * @param {string|Date} fromDate - Start date
 * @param {string|Date} toDate - End date
 * @returns {string} Formatted date range
 */
const formatPolicyPeriod = (fromDate, toDate) => {
  const from = formatDate(fromDate)
  const to = formatDate(toDate)
  if (!from && !to) return ''
  if (!from) return `to ${to}`
  if (!to) return `${from} to`
  return `${from} to ${to}`
}

/**
 * Map API response item to table format (same as CertificateOfInsurance.vue)
 * @param {Object} item - API response item
 * @param {number} index - Item index
 * @returns {Object} Mapped item
 */
const mapCOIItem = (item, index) => {
  return {
    no: index + 1,
    id: item.id,
    association: item.association || '',
    insuredName: item.insuredName || '',
    coiNo: item.certificateOfInsuranceNo || item.certificateNumber || '',
    policyPeriod: formatPolicyPeriod(item.policyPeriodFrom, item.policyPeriodTo),
    status: item.statusName || '',
    issueDate: formatDate(item.requestDate || item.processedDate),
    emailSubject: `COI_${item.insuredName || ''}_${item.certificateOfInsuranceNo || item.certificateNumber || ''}...`,
    // Keep all original fields for reference
    ...item
  }
}

// Fetch data from API using batchId (same pattern as CertificateOfInsurance.vue)
const fetchBatchData = async (batchId) => {
  try {
    isLoadingData.value = true
    
    const searchParams = {
      batchId: batchId
    }
    
    const results = await searchCOIs(searchParams)
    
    if (results && results.items && Array.isArray(results.items)) {
      // Map items using the same mapping function as CertificateOfInsurance
      tableData.value = results.items
    } else {
      // Fallback to previewData if API doesn't return data
      tableData.value = props.previewData
    }
  } catch (error) {
    console.error('Error fetching batch data:', error)
    // Fallback to previewData on error
    tableData.value = props.previewData
  } finally {
    isLoadingData.value = false
  }
}

const handleClose = () => {
  emit('show-cancel-confirm')
}

const handleBack = () => {
  emit('back')
}

const handlePreviewPDF = (row) => {
  emit('preview-pdf', row)
}

const handleConfirm = () => {
  emit('show-confirm-dialog')
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
  max-width: 1200px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.section-icon {
  font-size: 20px;
  color: #666666;
}

.dialog-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 24px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #F8F8F8;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  border-bottom: 2px solid #E5E5E5;
}

.data-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #333333;
  border-bottom: 1px solid #E5E5E5;
}

.data-table tbody tr:hover {
  background-color: #F8F8F8;
}

.loading-cell,
.no-data-cell {
  padding: 40px;
  text-align: center;
  color: #666666;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner i {
  font-size: 20px;
  color: var(--color-core-dark-blue);
}

.loading-spinner span {
  font-size: 14px;
}

.no-data-cell p {
  margin: 0;
  font-size: 16px;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #1976D2;
  color: var(--color-core-white);
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-btn:hover {
  background-color: #1565C0;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.preview-btn i {
  font-size: 14px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #E5E5E5;
}

.btn-cancel,
.btn-confirm {
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

.btn-confirm {
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
}

.btn-confirm:hover {
  background-color: #002838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 48, 73, 0.3);
}

.btn-confirm:active {
  transform: translateY(0);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm:disabled:hover {
  transform: none;
  box-shadow: none;
}
</style>

