// js/auth.js
class Auth {
    constructor() {
        this.user = null;
        this.listeners = [];
        this.loadUser();
    }

    // Load user dari localStorage
    loadUser() {
        try {
            const userJson = localStorage.getItem('user');
            this.user = userJson ? JSON.parse(userJson) : null;
            console.log('✅ Auth loaded, user:', this.user);
        } catch (e) {
            console.error('❌ Error loading user:', e);
            this.user = null;
        }
    }

    // Cek apakah sudah login
    isAuthenticated() {
        return this.user !== null;
    }

    // Get user data
    getUser() {
        return this.user;
    }

    // Get token (untuk future use)
    getToken() {
        return this.user ? this.user.token || null : null;
    }

    // Login
    async login(username, password) {
        console.log('🔍 Login attempt:', username);
        
        try {
            const result = await api.post('login', { username, password });
            
            if (result.status === 'success') {
                this.user = result.data;
                localStorage.setItem('user', JSON.stringify(result.data));
                this.notifyListeners();
                console.log('✅ Login success:', this.user);
            } else {
                console.error('❌ Login failed:', result.message);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                status: 'error',
                message: error.message || 'Gagal login'
            };
        }
    }

    // Logout
    logout() {
        this.user = null;
        localStorage.removeItem('user');
        api.clearCache(); // Clear API cache
        this.notifyListeners();
        console.log('✅ Logout');
        
        // Redirect ke login
        window.location.href = 'login.html';
    }

    // Cek role
    hasRole(requiredRole) {
        if (!this.user) return false;
        if (requiredRole === 'ADMIN' && this.user.role !== 'ADMIN') return false;
        return true;
    }

    // Cek permission spesifik
    can(permission) {
        if (!this.user) return false;
        
        const permissions = {
            ADMIN: ['create', 'read', 'update', 'delete', 'manage_users'],
            TAMU: ['read']
        };
        
        const userPermissions = permissions[this.user.role] || [];
        return userPermissions.includes(permission);
    }

    // Subscribe ke perubahan auth
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    // Notify listeners
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.user));
    }

    // Refresh user data
    async refreshUser() {
        if (!this.user) return null;
        
        try {
            // Implement jika perlu refresh data user dari server
            // const result = await api.get('getUser', { id: this.user.id });
            // if (result.status === 'success') {
            //     this.user = result.data;
            //     localStorage.setItem('user', JSON.stringify(this.user));
            // }
            return this.user;
        } catch (error) {
            console.error('❌ Refresh user error:', error);
            return null;
        }
    }
}

// Export
window.auth = new Auth();

// Auto refresh token jika ada (untuk future use)
setInterval(() => {
    if (auth.isAuthenticated()) {
        auth.refreshUser();
    }
}, 30 * 60 * 1000); // 30 menit

console.log('✅ Auth Ready');