<template>
  <div class="coi-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Certificate of Insurance</h1>
      <button class="generate-coi-button" @click="handleGenerateCOI">
        <i class="pi pi-plus"></i>
        <span>Generate COI</span>
      </button>
    </div>
    <div class="dashboard-content">
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Issue Date</label>
          <div class="date-range">
            <input 
              type="date" 
              v-model="filters.startDate" 
              class="date-input"
            />
            <i class="pi pi-arrow-right date-arrow"></i>
            <input 
              type="date" 
              v-model="filters.endDate" 
              class="date-input"
            />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">COI Status</label>
          <select v-model="filters.coiStatus" class="filter-select">
            <option value="all">All</option>
            <option value="generating">Generating</option>
            <option value="issued">Issued</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Insured Name</label>
          <div class="search-container">
            <select v-model="filters.insuredName" class="filter-select">
              <option value="all">All</option>
            </select>
            <div class="search-box">
              <i class="pi pi-search search-icon"></i>
              <input 
                type="text" 
                v-model="filters.search" 
                placeholder="Search..."
                class="search-input"
                @keyup.enter="handleSearch"
              />
            </div>
            <button class="search-button" @click="handleSearch" :disabled="isSearching">
              <i class="pi pi-search"></i>
              <span v-if="!isSearching">Search</span>
              <span v-else>Searching...</span>
            </button>
          </div>
        </div>
      </div>

      <div class="table-container">
        <DataTable 
          :value="paginatedData" 
          stripedRows
          showGridlines
          tableStyle="min-width: 50rem"
          class="coi-datatable"
          :paginator="false"
        >
          <Column field="no" header="No." style="width: 60px"></Column>
          <Column field="association" header="Association"></Column>
          <Column field="insuredName" header="Insured Name"></Column>
          <Column field="coiNo" header="COI No."></Column>
          <Column field="policyPeriod" header="Policy Period"></Column>
          <Column field="status" header="COI Status">
            <template #body="slotProps">
              <span 
                :class="['status-badge', slotProps.data.status === 'Generating' ? 'status-generating' : 'status-issued']"
              >
                <span v-if="slotProps.data.status === 'Issued'" class="status-dot"></span>
                {{ slotProps.data.status }}
              </span>
            </template>
          </Column>
          <Column field="issueDate" header="Issue Date"></Column>
          <Column field="coiLink" header="COI Link">
            <template #body="slotProps">
              <a 
                href="#" 
                class="link-text" 
                @click.prevent="handleViewPDF(slotProps.data)"
              >
                Link
              </a>
            </template>
          </Column>
          <Column field="emailSubject" header="Email Subject">
            <template #body="slotProps">
              <span class="email-subject">{{ slotProps.data.emailSubject }}</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="pagination-wrapper">
        <Paginator
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :first="first"
          @page="onPage"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 20, 50]"
          class="coi-paginator"
        >
          <template #rowsPerPageDropdownIcon>
            <i class="pi pi-chevron-down"></i>
          </template>
        </Paginator>
      </div>
    </div>
    
    <PreviewPDFDialog 
      :show="showPreviewPDFDialog" 
      :pdf-data="selectedPDFData"
      :pdf-url="selectedPDFUrl"
      @close="handlePreviewPDFClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import { searchCOIs } from '../api/api.js'
import PreviewPDFDialog from './organisms/PreviewPDFDialog.vue'

const showGenerateCOIDialog = inject('showGenerateCOIDialog', null)

const first = ref(0)
const rowsPerPage = ref(10)
const isSearching = ref(false)
const showPreviewPDFDialog = ref(false)
const selectedPDFData = ref(null)
const selectedPDFUrl = ref(null)

const handleGenerateCOI = () => {
  if (showGenerateCOIDialog) {
    showGenerateCOIDialog()
  }
}

const handleSearch = async () => {
  try {
    isSearching.value = true
    
    const searchParams = {
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
      coiStatus: filters.value.coiStatus,
      insuredName: filters.value.insuredName,
      search: filters.value.search
    }
    
    const results = await searchCOIs(searchParams)
    
    // Update table data with search results
    if (results && results.items && Array.isArray(results.items)) {
      tableData.value = results.items
      
      // Update pagination info if needed
      // You can use results.totalCount, results.pageNumber, etc. for server-side pagination
    }
    
    // Reset pagination to first page
    first.value = 0
  } catch (error) {
    console.error('Error searching COIs:', error)
    alert(error.message || 'Failed to search COIs. Please try again.')
  } finally {
    isSearching.value = false
  }
}

const filters = ref({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  coiStatus: 'all',
  insuredName: 'all',
  search: ''
})

const tableData = ref([
  { no: 1, association: 'ABC Corp', insuredName: 'Emily Carter', coiNo: 'COI-001', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Generating', issueDate: '2025-01-15', emailSubject: 'COI_Emily Carter_COI-001...' },
  { no: 2, association: 'XYZ Inc', insuredName: 'John Smith', coiNo: 'COI-002', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-14', emailSubject: 'COI_John Smith_COI-002...' },
  { no: 3, association: 'DEF Ltd', insuredName: 'Sarah Johnson', coiNo: 'COI-003', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-13', emailSubject: 'COI_Sarah Johnson_COI-003...' },
  { no: 4, association: 'GHI Corp', insuredName: 'Michael Brown', coiNo: 'COI-004', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-12', emailSubject: 'COI_Michael Brown_COI-004...' },
  { no: 5, association: 'JKL Inc', insuredName: 'Lisa Davis', coiNo: 'COI-005', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-11', emailSubject: 'COI_Lisa Davis_COI-005...' },
  { no: 6, association: 'MNO Ltd', insuredName: 'David Wilson', coiNo: 'COI-006', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-10', emailSubject: 'COI_David Wilson_COI-006...' },
  { no: 7, association: 'PQR Corp', insuredName: 'Jennifer Martinez', coiNo: 'COI-007', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-09', emailSubject: 'COI_Jennifer Martinez_COI-007...' },
  { no: 8, association: 'STU Inc', insuredName: 'Robert Taylor', coiNo: 'COI-008', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-08', emailSubject: 'COI_Robert Taylor_COI-008...' },
  { no: 9, association: 'VWX Ltd', insuredName: 'Amanda Anderson', coiNo: 'COI-009', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-07', emailSubject: 'COI_Amanda Anderson_COI-009...' },
  { no: 10, association: 'YZA Corp', insuredName: 'Christopher Lee', coiNo: 'COI-010', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-06', emailSubject: 'COI_Christopher Lee_COI-010...' },
  { no: 11, association: 'ABC Corp', insuredName: 'Emily Carter', coiNo: 'COI-011', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-05', emailSubject: 'COI_Emily Carter_COI-011...' },
  { no: 12, association: 'XYZ Inc', insuredName: 'John Smith', coiNo: 'COI-012', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-04', emailSubject: 'COI_John Smith_COI-012...' },
  { no: 13, association: 'DEF Ltd', insuredName: 'Sarah Johnson', coiNo: 'COI-013', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-03', emailSubject: 'COI_Sarah Johnson_COI-013...' },
  { no: 14, association: 'GHI Corp', insuredName: 'Michael Brown', coiNo: 'COI-014', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-02', emailSubject: 'COI_Michael Brown_COI-014...' },
  { no: 15, association: 'JKL Inc', insuredName: 'Lisa Davis', coiNo: 'COI-015', policyPeriod: '2025-01-01 to 2025-12-31', status: 'Issued', issueDate: '2025-01-01', emailSubject: 'COI_Lisa Davis_COI-015...' },
])

const totalRecords = computed(() => tableData.value.length)

const paginatedData = computed(() => {
  const start = first.value
  const end = start + rowsPerPage.value
  return tableData.value.slice(start, end)
})

const onPage = (event) => {
  first.value = event.first
  rowsPerPage.value = event.rows
}

const handleViewPDF = (row) => {
  selectedPDFData.value = row
  selectedPDFUrl.value = row.pdfUrl || null
  showPreviewPDFDialog.value = true
}

const handlePreviewPDFClose = () => {
  showPreviewPDFDialog.value = false
  selectedPDFData.value = null
  selectedPDFUrl.value = null
}
</script>

<style scoped>
.coi-dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #E5E5E5;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin: 0;
}

.generate-coi-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-coi-button:hover {
  background-color: #002838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 48, 73, 0.3);
}

.generate-coi-button:active {
  transform: translateY(0);
}

.generate-coi-button i {
  font-size: 16px;
}

.dashboard-content {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.filters-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}

.date-arrow {
  color: #666666;
  font-size: 14px;
}

.calendar-icon {
  color: #666666;
  font-size: 18px;
  cursor: pointer;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background-color: var(--color-core-white);
  min-width: 150px;
}

.search-container {
  display: flex;
  gap: 8px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #666666;
  font-size: 16px;
}

.search-input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  min-width: 200px;
}

.search-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  background-color: #002838;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 48, 73, 0.3);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-button i {
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 24px;
}

:deep(.p-datatable) {
  border: 1px solid #E5E5E5;
  border-radius: 8px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #F8F8F8;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  border-bottom: 2px solid #E5E5E5;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  font-size: 14px;
  color: #333333;
  border-bottom: 1px solid #E5E5E5;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #F8F8F8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.status-generating {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status-issued {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #2E7D32;
  border-radius: 50%;
  display: inline-block;
}

.link-text {
  color: #1976D2;
  text-decoration: none;
  font-weight: 500;
}

.link-text:hover {
  text-decoration: underline;
}

.email-subject {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

:deep(.coi-paginator) {
  background-color: transparent;
  border: none;
  padding: 0;
}

:deep(.coi-paginator .p-paginator-pages .p-paginator-page) {
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  margin: 0 2px;
}

:deep(.coi-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
}

:deep(.coi-paginator .p-paginator-first),
:deep(.coi-paginator .p-paginator-prev),
:deep(.coi-paginator .p-paginator-next),
:deep(.coi-paginator .p-paginator-last) {
  width: 32px;
  height: 32px;
  border: 1px solid #DDD;
  border-radius: 6px;
  margin: 0 2px;
}

:deep(.coi-paginator .p-paginator-first:hover),
:deep(.coi-paginator .p-paginator-prev:hover),
:deep(.coi-paginator .p-paginator-next:hover),
:deep(.coi-paginator .p-paginator-last:hover) {
  background-color: #F5F5F5;
}

:deep(.coi-paginator .p-paginator-first.p-disabled),
:deep(.coi-paginator .p-paginator-prev.p-disabled),
:deep(.coi-paginator .p-paginator-next.p-disabled),
:deep(.coi-paginator .p-paginator-last.p-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.coi-paginator .p-dropdown) {
  border: 1px solid #DDD;
  border-radius: 6px;
  height: 32px;
  margin-left: 8px;
}

:deep(.coi-paginator .p-dropdown .p-dropdown-label) {
  padding: 6px 12px;
  font-size: 14px;
  color: #333333;
}

:deep(.coi-paginator .p-dropdown-panel) {
  border: 1px solid #DDD;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

