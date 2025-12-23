<script setup>
import { ref } from 'vue'

const issueDateFrom = ref('2025-01-01')
const issueDateTo = ref('2025-01-31')
const coiStatus = ref('All')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(20)

const certificates = ref([
  {
    id: 1,
    association: 'Canadian So...',
    insuredName: 'Emily Carter',
    coiNo: 'COI-0001',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Generating',
    issueDate: '',
    coiLink: '',
    emailSubject: 'COI_Emily Carter_COI-...'
  },
  {
    id: 2,
    association: 'Canadian So...',
    insuredName: 'Michael Brown',
    coiNo: 'COI-0002',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Michael Brown_C...'
  },
  {
    id: 3,
    association: 'Canadian So...',
    insuredName: 'Sophia Lee',
    coiNo: 'COI-0003',
    policyPeriod: '01/01/2025-06/30/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Sophia Lee_COI-...'
  },
  {
    id: 4,
    association: 'Canadian So...',
    insuredName: 'Daniel Smith',
    coiNo: 'COI-0004',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Daniel Smith_COI-...'
  },
  {
    id: 5,
    association: 'Canadian So...',
    insuredName: 'Olivia Martin',
    coiNo: 'COI-0005',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Olivia Martin_COI-...'
  },
  {
    id: 6,
    association: 'Canadian So...',
    insuredName: 'Ethan Scott',
    coiNo: 'COI-0006',
    policyPeriod: '01/01/2025-06/30/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Ethan Scott_COI-...'
  },
  {
    id: 7,
    association: 'Canadian So...',
    insuredName: 'Grace Turner',
    coiNo: 'COI-0007',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Grace Turner_COI-...'
  },
  {
    id: 8,
    association: 'Canadian So...',
    insuredName: 'William Evans',
    coiNo: 'COI-0008',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_William Evans_COI-...'
  },
  {
    id: 9,
    association: 'Canadian So...',
    insuredName: 'Chloe Wilson',
    coiNo: 'COI-0009',
    policyPeriod: '01/01/2025-06/30/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_Chloe Wilson_COI-...'
  },
  {
    id: 10,
    association: 'Canadian So...',
    insuredName: 'James Anderson',
    coiNo: 'COI-0010',
    policyPeriod: '01/01/2025-12/31/2025',
    coiStatus: 'Issued',
    issueDate: '01/01/2025',
    coiLink: 'Link',
    emailSubject: 'COI_James Anderson_COI-...'
  }
])
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-white p-6">
    <!-- Page Title -->
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Certificate of Insurance</h1>

    <!-- Filters -->
    <div class="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
      <!-- Issue Date -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Issue Date:</label>
        <div class="flex items-center space-x-1">
          <input
            v-model="issueDateFrom"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="pi pi-arrow-right text-gray-400 text-xs" />
          <div class="relative">
            <input
              v-model="issueDateTo"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            />
            <i class="pi pi-calendar absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- COI Status -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">COI Status:</label>
        <select
          v-model="coiStatus"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Issued</option>
          <option>Generating</option>
        </select>
      </div>

      <!-- Search -->
      <div class="flex-1 max-w-md">
        <div class="flex items-center space-x-2">
          <select
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option>Insured Name</option>
            <option>COI No.</option>
            <option>Association</option>
          </select>
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-base text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Association</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COI No.</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Period</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COI Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COI Link</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Subject</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="cert in certificates" :key="cert.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.id }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.association }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.insuredName }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.coiNo }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.policyPeriod }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                :class="[
                  cert.coiStatus === 'Issued'
                    ? 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'
                    : 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
                ]"
              >
                <i
                  v-if="cert.coiStatus === 'Issued'"
                  class="pi pi-circle-fill text-green-600 text-[6px] mr-1"
                />
                {{ cert.coiStatus }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.issueDate }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <a
                v-if="cert.coiLink"
                href="#"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ cert.coiLink }}
              </a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ cert.emailSubject }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-end mt-6 space-x-2">
      <button
        :disabled="currentPage === 1"
        class="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        &lt;
      </button>
      <button
        v-for="page in [1, 2, 3]"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-2 text-sm border border-gray-300 rounded-md',
          currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50',
        ]"
      >
        {{ page }}
      </button>
      <span class="px-2 text-sm text-gray-500">...</span>
      <button
        @click="currentPage = totalPages"
        :class="[
          'px-3 py-2 text-sm border border-gray-300 rounded-md',
          currentPage === totalPages ? 'bg-blue-600 text-white' : 'hover:bg-gray-50',
        ]"
      >
        {{ totalPages }}
      </button>
      <button
        :disabled="currentPage === totalPages"
        class="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        &gt;
      </button>
      <span class="ml-4 text-sm text-gray-500">{{ itemsPerPage }}/page</span>
    </div>
  </div>
</template>

