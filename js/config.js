// js/config.js
const CONFIG = {
    // GANTI dengan URL Apps Script ANDA (hasil deploy terbaru)
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxaJqSnCjGId6suLjVOtfQHwJG0PIB2BTGRKMKWnQC7ApN2a9ZhOk4h6RYF8566Z1h12g/exec',
    
    VERSION: '1.0.0',
    DARK_MODE: false,
    
    // App Settings
    APP_NAME: 'SiAMAT',
    APP_FULL_NAME: 'Sistem Administrasi Matematika Terpadu',
    APP_TAGLINE: 'Solusi Administrasi Matematika Akurat & Terintegrasi',
    
    // Pagination Settings
    ITEMS_PER_PAGE: 10,
    
    // Status Absensi
    STATUS_ABSENSI: {
        H: 'Hadir',
        S: 'Sakit',
        I: 'Izin',
        A: 'Alfa'
    },
    
    // Jenis Nilai
    JENIS_NILAI: {
        formatif: 'Formatif',
        sumatif: 'Sumatif'
    },
    
    // Role
    ROLE: {
        ADMIN: 'ADMIN',
        TAMU: 'TAMU'
    }
};

// Export ke window
window.CONFIG = CONFIG;

// Log untuk debugging
console.log('✅ Config loaded:', {
    url: CONFIG.WEB_APP_URL,
    version: CONFIG.VERSION,
    app: CONFIG.APP_NAME
});