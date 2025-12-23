<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleClose">
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-left">
          <button class="back-button" @click="handleClose">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2 class="dialog-title">Preview PDF</h2>
        </div>
        <div class="header-right">
          <div class="zoom-controls">
            <button class="zoom-btn" @click="zoomOut">
              <i class="pi pi-search-minus"></i>
            </button>
            <span class="zoom-level">{{ zoomLevel }}%</span>
            <button class="zoom-btn" @click="zoomIn">
              <i class="pi pi-search-plus"></i>
            </button>
          </div>
          <button class="close-button" @click="handleClose">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
      
      <div class="dialog-body">
        <div class="pdf-preview-container" :style="{ transform: `scale(${zoomLevel / 100})` }">
          <div class="pdf-content">
            <div class="pdf-header">
              <div class="pdf-logo-section">
                <div class="pdf-logo">
                  <span class="pdf-logo-text">bms</span>
                  <span class="pdf-logo-dot"></span>
                </div>
              </div>
              <h1 class="pdf-title">PROFESSIONAL LIABILITY INSURANCE CERTIFICATE</h1>
            </div>
            
            <div class="pdf-section">
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Named Insured:</strong>
                  <span>{{ pdfData?.insuredName || 'Emily Carter' }}</span>
                </div>
              </div>
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Association:</strong>
                  <span>{{ pdfData?.association || 'Canadian Society of Respiratory Therapists' }}</span>
                </div>
              </div>
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Policy Period:</strong>
                  <span>01/01/2025 - 12/31/2025</span>
                </div>
              </div>
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Professional Services:</strong>
                  <span>Respiratory Therapist</span>
                </div>
              </div>
            </div>
            
            <div class="pdf-section">
              <h3 class="pdf-section-title">Individual Professional Liability (Claims Made Basis)</h3>
              
              <table class="pdf-table">
                <thead>
                  <tr>
                    <th>Coverage</th>
                    <th>Form</th>
                    <th>Deductible</th>
                    <th>Limit of Liability Each Claim</th>
                    <th>Limit of Liability Aggregate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Professional Liability</td>
                    <td>Claims Made</td>
                    <td>$0</td>
                    <td>$10,000,000</td>
                    <td>$10,000,000</td>
                  </tr>
                  <tr>
                    <td>Vicarious liability</td>
                    <td>Claims Made</td>
                    <td>$0</td>
                    <td>$10,000,000</td>
                    <td>$10,000,000</td>
                  </tr>
                  <tr>
                    <td>Crisis Management</td>
                    <td>Claims Made</td>
                    <td>$0</td>
                    <td>$5,000,000</td>
                    <td>$5,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="pdf-section">
              <h3 class="pdf-section-title">General Terms and Conditions</h3>
              <p class="pdf-text">This certificate is issued as a matter of information only and confers no rights upon the certificate holder.</p>
            </div>
            
            <div class="pdf-section">
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Coverage Territory:</strong>
                  <span>Worldwide</span>
                </div>
              </div>
              <div class="pdf-info-row">
                <div class="pdf-info-item">
                  <strong>Estimated Reporting Period:</strong>
                  <span>12 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  pdfData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const zoomLevel = ref(100)

const zoomIn = () => {
  if (zoomLevel.value < 200) {
    zoomLevel.value += 10
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 50) {
    zoomLevel.value -= 10
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.dialog-container {
  background-color: var(--color-core-white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  width: 1200px;
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
  padding: 16px 24px;
  background-color: var(--color-core-dark-blue);
  border-radius: 12px 12px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button,
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
  color: var(--color-core-white);
  transition: all 0.2s;
}

.back-button:hover,
.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-button i,
.close-button i {
  font-size: 18px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-core-white);
  margin: 0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-core-white);
  transition: all 0.2s;
}

.zoom-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.zoom-btn i {
  font-size: 16px;
}

.zoom-level {
  color: var(--color-core-white);
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  background-color: #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pdf-preview-container {
  width: 100%;
  max-width: 800px;
  transform-origin: top center;
  transition: transform 0.2s;
}

.pdf-content {
  background-color: var(--color-core-white);
  padding: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.pdf-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #E5E5E5;
}

.pdf-logo-section {
  margin-bottom: 16px;
}

.pdf-logo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pdf-logo-text {
  color: #333333;
  font-size: 24px;
  font-weight: 600;
}

.pdf-logo-dot {
  width: 10px;
  height: 10px;
  background-color: var(--color-core-bright-orange);
  border-radius: 50%;
  display: inline-block;
}

.pdf-title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin: 16px 0 0 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pdf-section {
  margin-bottom: 24px;
}

.pdf-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
}

.pdf-info-row {
  margin-bottom: 12px;
}

.pdf-info-item {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
}

.pdf-info-item strong {
  font-weight: 600;
  margin-right: 8px;
}

.pdf-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 12px;
}

.pdf-table th,
.pdf-table td {
  padding: 8px;
  text-align: left;
  border: 1px solid #E5E5E5;
}

.pdf-table th {
  background-color: #F8F8F8;
  font-weight: 600;
  color: #333333;
}

.pdf-table td {
  color: #666666;
}

.pdf-text {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin: 0;
}
</style>

