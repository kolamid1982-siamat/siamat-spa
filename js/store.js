// js/store.js
const Store = {
    // State
    state: {
        user: null,
        kelas: [],
        siswa: [],
        perencanaan: [],
        absensi: [],
        jurnal: [],
        nilai: [],
        stats: {},
        settings: {
            darkMode: localStorage.getItem('darkMode') === 'true',
            sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
            itemsPerPage: CONFIG.ITEMS_PER_PAGE || 10
        },
        loading: false,
        errors: []
    },

    // Listeners
    listeners: new Map(),

    // Init store
    init() {
        // Load dari localStorage
        this.loadFromStorage();
        
        // Subscribe ke auth changes
        auth.subscribe((user) => {
            this.set('user', user);
        });
        
        // Set user awal
        this.set('user', auth.getUser());
        
        console.log('✅ Store initialized');
    },

    // Load dari localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('siamat_store');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Jangan timpa settings
                this.state.settings = {
                    ...this.state.settings,
                    ...parsed.settings
                };
            }
        } catch (e) {
            console.error('❌ Error loading store:', e);
        }
    },

    // Save ke localStorage
    saveToStorage() {
        try {
            const toSave = {
                settings: this.state.settings
            };
            localStorage.setItem('siamat_store', JSON.stringify(toSave));
        } catch (e) {
            console.error('❌ Error saving store:', e);
        }
    },

    // Get state
    get(key) {
        return this.state[key];
    },

    // Set state
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        this.notify(key, value, oldValue);
        
        // Save settings if changed
        if (key === 'settings') {
            this.saveToStorage();
        }
    },

    // Update state dengan function
    update(key, updater) {
        const oldValue = this.state[key];
        const newValue = typeof updater === 'function' 
            ? updater(oldValue) 
            : updater;
        
        this.state[key] = newValue;
        this.notify(key, newValue, oldValue);
        
        if (key === 'settings') {
            this.saveToStorage();
        }
    },

    // Multiple update
    setMultiple(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            const oldValue = this.state[key];
            this.state[key] = value;
            this.notify(key, value, oldValue);
        });
        
        if (updates.settings) {
            this.saveToStorage();
        }
    },

    // Subscribe ke perubahan
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners.get(key)?.delete(callback);
        };
    },

    // Subscribe ke multiple keys
    subscribeMany(keys, callback) {
        const unsubscribes = keys.map(key => this.subscribe(key, callback));
        return () => unsubscribes.forEach(unsub => unsub());
    },

    // Notify listeners
    notify(key, newValue, oldValue) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (e) {
                    console.error(`❌ Error in store listener for ${key}:`, e);
                }
            });
        }
    },

    // Clear store
    clear() {
        this.state = {
            ...this.state,
            user: null,
            kelas: [],
            siswa: [],
            perencanaan: [],
            absensi: [],
            jurnal: [],
            nilai: [],
            stats: {},
            errors: []
        };
        this.listeners.clear();
        this.saveToStorage();
    },

    // ================================================
    // DATA LOADING METHODS
    // ================================================

    async loadKelas(force = false) {
        if (!force && this.state.kelas.length > 0) return this.state.kelas;
        
        try {
            const result = await api.get('getKelas');
            if (result.status === 'success') {
                this.set('kelas', result.data);
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadKelas', error);
            throw error;
        }
    },

    async loadSiswa(filterKelas = '', force = false) {
        const cacheKey = filterKelas ? `siswa_${filterKelas}` : 'siswa_all';
        
        try {
            const params = filterKelas ? { id_kelas: filterKelas } : {};
            const result = await api.get('getSiswa', params);
            
            if (result.status === 'success') {
                if (!filterKelas) {
                    this.set('siswa', result.data);
                }
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadSiswa', error);
            throw error;
        }
    },

    async loadPerencanaan(jenis = '', force = false) {
        try {
            const params = jenis ? { jenis } : {};
            const result = await api.get('getPerencanaan', params);
            
            if (result.status === 'success') {
                if (!jenis) {
                    this.set('perencanaan', result.data);
                }
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadPerencanaan', error);
            throw error;
        }
    },

    async loadAbsensi(tanggal = '', id_kelas = '') {
        try {
            const params = {};
            if (tanggal) params.tanggal = tanggal;
            if (id_kelas) params.id_kelas = id_kelas;
            
            const result = await api.get('getAbsensi', params);
            
            if (result.status === 'success') {
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadAbsensi', error);
            throw error;
        }
    },

    async loadJurnal(kelas = '', force = false) {
        try {
            const params = kelas ? { kelas } : {};
            const result = await api.get('getJurnal', params);
            
            if (result.status === 'success') {
                if (!kelas) {
                    this.set('jurnal', result.data);
                }
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadJurnal', error);
            throw error;
        }
    },

    async loadNilai(id_kelas = '', id_siswa = '') {
        try {
            const params = {};
            if (id_kelas) params.id_kelas = id_kelas;
            if (id_siswa) params.id_siswa = id_siswa;
            
            const result = await api.get('getNilai', params);
            
            if (result.status === 'success') {
                if (!id_kelas && !id_siswa) {
                    this.set('nilai', result.data);
                }
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadNilai', error);
            throw error;
        }
    },

    async loadDashboard() {
        try {
            const result = await api.get('getDashboard');
            
            if (result.status === 'success') {
                this.set('stats', result.data);
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            this.addError('loadDashboard', error);
            throw error;
        }
    },

    // ================================================
    // HELPER METHODS
    // ================================================

    // Get kelas by ID
    getKelasById(id_kelas) {
        return this.state.kelas.find(k => k.id_kelas === id_kelas);
    },

    // Get siswa by ID
    getSiswaById(id_siswa) {
        return this.state.siswa.find(s => s.id_siswa === id_siswa);
    },

    // Get nama kelas
    getNamaKelas(id_kelas) {
        const kelas = this.getKelasById(id_kelas);
        return kelas ? kelas.nama_kelas : '-';
    },

    // Get nama siswa
    getNamaSiswa(id_siswa) {
        const siswa = this.getSiswaById(id_siswa);
        return siswa ? siswa.nama : '-';
    },

    // Get siswa by kelas
    getSiswaByKelas(id_kelas) {
        return this.state.siswa.filter(s => s.id_kelas === id_kelas);
    },

    // Get statistik kelas
    getKelasStats() {
        return this.state.kelas.map(k => ({
            ...k,
            jumlah_siswa: this.getSiswaByKelas(k.id_kelas).length
        }));
    },

    // Error handling
    addError(source, error) {
        const errorLog = {
            source,
            message: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };
        
        this.state.errors = [errorLog, ...this.state.errors].slice(0, 50);
        console.error(`❌ Store error [${source}]:`, error);
    },

    clearErrors() {
        this.set('errors', []);
    },

    // Loading state
    setLoading(loading) {
        this.set('loading', loading);
    },

    // Navigation helper
    navigate(page, params = {}) {
        if (window.Router) {
            window.Router.navigate(page, params);
        }
    },

    // Dark mode
    toggleDarkMode() {
        const settings = { ...this.state.settings };
        settings.darkMode = !settings.darkMode;
        this.set('settings', settings);
        
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    // Sidebar
    toggleSidebar() {
        const settings = { ...this.state.settings };
        settings.sidebarCollapsed = !settings.sidebarCollapsed;
        this.set('settings', settings);
    }
};

// Export
window.Store = Store;

// Register dengan Alpine jika ada
if (window.Alpine) {
    document.addEventListener('alpine:init', () => {
        Alpine.store('store', window.Store);
    });
}

// Init store
Store.init();

console.log('✅ Store Ready');