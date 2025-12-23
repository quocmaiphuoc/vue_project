<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-container" @click.stop>
      <div class="dialog-content">
        <div class="dialog-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <p class="dialog-message">Are you sure to log out of the system?</p>
        <div class="dialog-actions">
          <button class="btn-no" @click="handleCancel">No</button>
          <button class="btn-yes" @click="handleConfirm">Yes</button>
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
  z-index: 1000;
}

.dialog-container {
  background-color: var(--color-core-white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 400px;
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
  justify-content: center;
}

.btn-no,
.btn-yes {
  padding: 10px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.btn-no {
  background-color: #E5E5E5;
  color: #666666;
}

.btn-no:hover {
  background-color: #D5D5D5;
}

.btn-yes {
  background-color: var(--color-core-bright-orange);
  color: var(--color-core-white);
}

.btn-yes:hover {
  background-color: #E66F00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(247, 127, 0, 0.3);
}

.btn-yes:active {
  transform: translateY(0);
}
</style>

