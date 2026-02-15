// Contoh penggunaan di component
const app = document.querySelector('[x-data="app"]').__x.$data;

// Show loading
app.showLoading('Processing...');

// Show toast
app.showToast('success', 'Berhasil', 'Data disimpan');

// Check permission
if (app.can('delete')) {
    // Allow delete
}

// Format date
const formatted = app.formatDate('2024-01-15');