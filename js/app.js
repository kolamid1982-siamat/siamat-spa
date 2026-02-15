// js/app.js - VERSI LENGKAP DENGAN SEMUA STATE
function app() {
    return {
        // ====================================================
        // STATE - SEMUA PROPERTY HARUS DIDEFINISIKAN DI SINI!
        // ====================================================
        
        // Authentication
        isAuthenticated: false,
        user: null,
        
        // UI State
        loading: false,
        loadingMessage: 'Loading...',
        darkMode: localStorage.getItem('darkMode') === 'true',
        sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
        
        // Page State - INI YANG PALING PENTING!
        currentPage: 'dashboard',
        pageTitle: 'Dashboard',
        currentContent: '',  // <-- Property untuk konten dinamis
        
        // Login Form
        loginForm: {
            username: '',
            password: ''
        },
        
        // Toast Notification
        toast: {
            show: false,
            type: 'info',
            title: '',
            message: '',
            duration: 3000
        },
        
        // Menu Items
        menuItems: [],
        
        // Date
        currentDate: new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),

        // ====================================================
        // METHODS
        // ====================================================
        
        init() {
            console.log('🚀 SiAMAT SPA initializing...');
            
            // Check authentication
            this.checkAuth();
            
            // Apply dark mode
            this.applyDarkMode();
            
            // Load menu items
            this.loadMenuItems();
            
            // Set current content
            this.loadDashboard();
            
            console.log('✅ App initialized with state:', {
                isAuthenticated: this.isAuthenticated,
                user: this.user,
                currentPage: this.currentPage,
                currentContentLength: this.currentContent?.length
            });
        },

        checkAuth() {
            this.user = auth.getUser();
            this.isAuthenticated = auth.isAuthenticated();
            
            if (!this.isAuthenticated) {
                console.log('🔒 Not authenticated');
                return;
            }
            
            console.log('🔓 Authenticated as:', this.user?.nama);
        },

        applyDarkMode() {
            if (this.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },

        loadMenuItems() {
            if (this.user) {
                this.menuItems = [
                    { id: 'dashboard', name: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
                    { id: 'kelas', name: 'Kelas', icon: 'fa-solid fa-chalkboard-user' },
                    { id: 'siswa', name: 'Siswa', icon: 'fa-solid fa-users' },
                    { id: 'perencanaan', name: 'Perencanaan', icon: 'fa-solid fa-file-alt' },
                    { id: 'absensi', name: 'Absensi', icon: 'fa-solid fa-calendar-check' },
                    { id: 'jurnal', name: 'Jurnal', icon: 'fa-solid fa-book-open' },
                    { id: 'nilai', name: 'Nilai', icon: 'fa-solid fa-star' }
                ];
                
                // Add users menu for admin
                if (this.user.role === 'ADMIN') {
                    this.menuItems.push({ id: 'users', name: 'Users', icon: 'fa-solid fa-user-cog' });
                }
            }
        },

        loadDashboard() {
            console.log('📊 Loading dashboard...');
            
            if (window.DashboardComponent) {
                // Set content dari template dashboard
                this.currentContent = DashboardComponent.template();
                console.log('✅ Dashboard template loaded, length:', this.currentContent.length);
                
                // Initialize component
                this.$nextTick(() => {
                    if (DashboardComponent.component) {
                        const data = DashboardComponent.component();
                        if (data.init) {
                            data.init();
                        }
                    }
                });
            } else {
                console.error('❌ DashboardComponent tidak ditemukan!');
                this.currentContent = `
                    <div class="flex flex-col items-center justify-center min-h-[400px] p-6">
                        <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                        <h2 class="text-2xl font-bold mb-2">Error: Component Tidak Ditemukan</h2>
                        <p class="text-slate-500 mb-4">DashboardComponent tidak terdaftar. Periksa urutan script di index.html</p>
                        <button onclick="location.reload()" 
                                class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                            Reload Halaman
                        </button>
                    </div>
                `;
            }
        },

        navigate(page) {
            console.log('📍 Navigating to:', page);
            this.currentPage = page;
            
            // Update page title
            const menuItem = this.menuItems.find(item => item.id === page);
            this.pageTitle = menuItem ? menuItem.name : 'Dashboard';
            
            // Load component sesuai page
            this.loadComponent(page);
        },

        loadComponent(page) {
            // Mapping page ke component
            const componentMap = {
                dashboard: 'DashboardComponent',
                kelas: 'KelasComponent',
                siswa: 'SiswaComponent',
                perencanaan: 'PerencanaanComponent',
                absensi: 'AbsensiComponent',
                jurnal: 'JurnalComponent',
                nilai: 'NilaiComponent',
                users: 'UsersComponent'
            };
            
            const componentName = componentMap[page];
            const component = window[componentName];
            
            if (component) {
                this.currentContent = component.template();
                
                this.$nextTick(() => {
                    if (component.component) {
                        const data = component.component();
                        if (data.init) {
                            data.init();
                        }
                    }
                });
            } else {
                console.error(`❌ Component ${componentName} tidak ditemukan!`);
                this.currentContent = `<div class="p-6 text-red-500">Error: ${componentName} tidak ditemukan</div>`;
            }
        },

        logout() {
            auth.logout();
            window.location.href = 'login.html';
        },

        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            this.applyDarkMode();
        },

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
        },

        showLoading(message = 'Loading...') {
            this.loading = true;
            this.loadingMessage = message;
        },

        hideLoading() {
            this.loading = false;
        }
    };
}

window.app = app;
console.log('✅ App.js fixed and loaded');
