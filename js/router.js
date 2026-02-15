// js/router.js
const Router = {
    // Daftar routes
    routes: {
        dashboard: {
            title: 'Dashboard',
            component: 'DashboardComponent',
            icon: 'fa-solid fa-chart-pie',
            requiresAuth: true
        },
        kelas: {
            title: 'Kelas',
            component: 'KelasComponent',
            icon: 'fa-solid fa-chalkboard-user',
            requiresAuth: true
        },
        siswa: {
            title: 'Siswa',
            component: 'SiswaComponent',
            icon: 'fa-solid fa-users',
            requiresAuth: true
        },
        perencanaan: {
            title: 'Perencanaan',
            component: 'PerencanaanComponent',
            icon: 'fa-solid fa-file-alt',
            requiresAuth: true
        },
        absensi: {
            title: 'Absensi',
            component: 'AbsensiComponent',
            icon: 'fa-solid fa-calendar-check',
            requiresAuth: true
        },
        jurnal: {
            title: 'Jurnal',
            component: 'JurnalComponent',
            icon: 'fa-solid fa-book-open',
            requiresAuth: true
        },
        nilai: {
            title: 'Nilai',
            component: 'NilaiComponent',
            icon: 'fa-solid fa-star',
            requiresAuth: true
        },
        users: {
            title: 'Users',
            component: 'UsersComponent',
            icon: 'fa-solid fa-user-cog',
            requiresAuth: true,
            role: 'ADMIN'
        },
        profile: {
            title: 'Profil',
            component: 'ProfileComponent',
            icon: 'fa-solid fa-user',
            requiresAuth: true
        },
        settings: {
            title: 'Pengaturan',
            component: 'SettingsComponent',
            icon: 'fa-solid fa-cog',
            requiresAuth: true,
            role: 'ADMIN'
        }
    },

    // History stack
    history: [],

    // Current route
    currentRoute: null,

    // Init router
    init() {
        // Handle initial route
        const route = this.getCurrentRoute();
        this.navigate(route);
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const route = this.getCurrentRoute();
            this.navigate(route, { replace: true });
        });
        
        console.log('✅ Router initialized');
    },

    // Navigasi ke halaman
    navigate(route, params = {}, options = {}) {
        // Cek apakah route valid
        if (!this.isValidRoute(route)) {
            console.error(`❌ Route tidak valid: ${route}`);
            route = 'dashboard';
        }
        
        // Cek role
        const routeConfig = this.getRouteConfig(route);
        const user = auth.getUser();
        
        if (routeConfig.requiresAuth && !auth.isAuthenticated()) {
            console.log('🔒 Redirect to login');
            window.location.href = 'login.html';
            return;
        }
        
        if (routeConfig.role && (!user || user.role !== routeConfig.role)) {
            console.log('🚫 Unauthorized access to:', route);
            route = 'dashboard';
        }
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('page', route);
        
        // Add params to URL
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        
        // Push to history
        if (!options.replace) {
            window.history.pushState({ route, params }, '', url);
            this.history.push({ route, params });
        } else {
            window.history.replaceState({ route, params }, '', url);
        }
        
        // Update current route
        this.currentRoute = { route, params };
        
        // Trigger event
        window.dispatchEvent(new CustomEvent('routechange', { 
            detail: { route, params } 
        }));
        
        console.log(`📍 Navigated to: ${route}`, params);
    },

    // Replace current route (tanpa nambah history)
    replace(route, params = {}) {
        this.navigate(route, params, { replace: true });
    },

    // Go back
    back() {
        if (this.history.length > 1) {
            this.history.pop(); // Remove current
            const previous = this.history[this.history.length - 1];
            this.navigate(previous.route, previous.params, { replace: true });
        } else {
            this.navigate('dashboard');
        }
    },

    // Get current route dari URL
    getCurrentRoute() {
        const url = new URL(window.location);
        return url.searchParams.get('page') || 'dashboard';
    },

    // Get params dari URL
    getParams() {
        const url = new URL(window.location);
        const params = {};
        url.searchParams.forEach((value, key) => {
            if (key !== 'page') {
                params[key] = value;
            }
        });
        return params;
    },

    // Cek apakah route valid
    isValidRoute(route) {
        return this.routes.hasOwnProperty(route);
    },

    // Dapatkan konfigurasi route
    getRouteConfig(route) {
        return this.routes[route] || this.routes.dashboard;
    },

    // Dapatkan menu items berdasarkan role
    getMenuItems(role) {
        return Object.entries(this.routes)
            .filter(([_, config]) => {
                if (!config.requiresAuth) return true;
                if (config.role && config.role !== role) return false;
                return true;
            })
            .map(([id, config]) => ({
                id,
                name: config.title,
                icon: config.icon
            }));
    },

    // Generate link
    link(route, params = {}) {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('page', route);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        return url.toString();
    },

    // Get current full URL
    getCurrentUrl() {
        return window.location.href;
    },

    // Get route title
    getTitle(route) {
        return this.getRouteConfig(route).title;
    },

    // Check if route is active
    isActive(route) {
        return this.currentRoute?.route === route;
    }
};

// Export
window.Router = Router;

// Auto init after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});

console.log('✅ Router Ready');