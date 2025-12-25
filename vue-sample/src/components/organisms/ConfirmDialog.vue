<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container" @click.stop>
      <div v-if="showHeader" class="dialog-header">
        <button class="back-button" @click="handleCancel">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h3 class="header-title">{{ headerTitle }}</h3>
      </div>
      <div class="dialog-content">
        <div class="dialog-icon">
          <i :class="iconClass"></i>
        </div>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="handleCancel">{{ cancelText }}</button>
          <button :class="['btn-confirm', confirmButtonClass]" @click="handleConfirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Yes'
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  headerTitle: {
    type: String,
    default: 'Confirmation'
  },
  iconClass: {
    type: String,
    default: 'pi pi-exclamation-triangle'
  },
  confirmButtonClass: {
    type: String,
    default: 'btn-confirm-orange'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
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
  z-index: 1002;
}

.dialog-container {
  background-color: var(--color-core-white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 90%;
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
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E5E5;
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

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.dialog-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.dialog-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(247, 127, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-icon i {
  font-size: 32px;
  color: var(--color-core-bright-orange);
}

.dialog-message {
  font-size: 18px;
  color: #333333;
  text-align: center;
  margin: 0;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
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
  min-width: 100px;
}

.btn-cancel {
  background-color: #E5E5E5;
  color: #666666;
}

.btn-cancel:hover {
  background-color: #D5D5D5;
}

.btn-confirm-orange {
  background-color: var(--color-core-bright-orange);
  color: var(--color-core-white);
}

.btn-confirm-orange:hover {
  background-color: #E66F00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(247, 127, 0, 0.3);
}

.btn-confirm-blue {
  background-color: var(--color-core-dark-blue);
  color: var(--color-core-white);
}

.btn-confirm-blue:hover {
  background-color: #002838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 48, 73, 0.3);
}

.btn-confirm:active {
  transform: translateY(0);
}
</style>

