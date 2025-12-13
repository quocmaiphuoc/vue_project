<template>
  <div class="layout">
    <nav class="tabs">
      <RouterLink to="/login" class="tab" active-class="active">Login</RouterLink>
      <RouterLink to="/excel" class="tab" active-class="active">Upload Excel</RouterLink>
      <RouterLink to="/pdf" class="tab" active-class="active">Preview PDF</RouterLink>
    </nav>

    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
:global(body) {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: radial-gradient(circle at 20% 20%, #f0f5ff, #f8fafc);
  color: #0f172a;
  margin: 0;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.content {
  width: min(1100px, 100%);
  display: flex;
  justify-content: center;
}

.tabs {
  display: inline-flex;
  gap: 8px;
  background: #e2e8f0;
  padding: 6px;
  border-radius: 14px;
  width: fit-content;
}

.tab {
  text-decoration: none;
  background: transparent;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  color: #1f2937;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.tab.active {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  padding: 24px;
  display: grid;
  gap: 20px;
}

.card--single {
  max-width: 960px;
  width: 100%;
}

.card__header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2b6cb0, #1a4fa3);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo--secondary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.logo--pdf {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  color: #475569;
}

h1 {
  margin: 4px 0;
  font-size: 28px;
}

h2 {
  margin: 4px 0;
}

.lead {
  margin: 0;
  color: #475569;
}

.status {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.muted {
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button,
.browse span {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease, opacity 0.1s ease;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

button:hover:enabled,
.browse span:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(37, 99, 235, 0.28);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
  box-shadow: none;
}

.secondary:hover:enabled {
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.1);
}

.error {
  color: #b91c1c;
  margin: 0;
  padding: 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecdd3;
}

.helper {
  font-size: 14px;
  color: #475569;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 12px;
  border-radius: 12px;
}

.helper p {
  margin: 0;
}

.dropzone {
  border: 2px dashed #94a3b8;
  border-radius: 14px;
  padding: 28px;
  text-align: center;
  background: #f8fafc;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.dropzone--active {
  border-color: #2563eb;
  background: #eef2ff;
}

.drop-title {
  font-weight: 700;
  margin: 0 0 6px;
}

.browse input[type='file'] {
  display: none;
}

.table-wrap {
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 360px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

tr:last-child td {
  border-bottom: none;
}

.pdf-frame {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  min-height: 320px;
  background: #0f172a0a;
}

.pdf-frame embed {
  width: 100%;
  height: 480px;
  border: none;
}
</style>
