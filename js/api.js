// js/api.js
class Api {
    constructor() {
        this.baseUrl = CONFIG.WEB_APP_URL;
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    // GET request
    async get(action, params = {}) {
        const cacheKey = `${action}_${JSON.stringify(params)}`;
        
        // Cek pending request
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }
        
        try {
            const url = new URL(this.baseUrl);
            url.searchParams.append('action', action);
            
            // Add user role
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role) {
                url.searchParams.append('role', user.role);
            }
            
            // Add other params
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });
            
            console.log(`🔍 GET ${action}:`, url.toString());
            
            // Buat promise request
            const requestPromise = (async () => {
                const response = await fetch(url.toString(), {
                    method: 'GET',
                    redirect: 'follow'
                });
                
                const text = await response.text();
                
                // Cek apakah response JSON
                try {
                    const json = JSON.parse(text);
                    console.log(`✅ ${action} response:`, json);
                    
                    // Cache sukses response
                    if (json.status === 'success') {
                        this.cache.set(cacheKey, {
                            data: json,
                            timestamp: Date.now()
                        });
                    }
                    
                    return json;
                } catch (e) {
                    console.error(`❌ ${action} bukan JSON:`, text.substring(0, 200));
                    throw new Error('Response bukan JSON');
                }
            })();
            
            // Simpan pending request
            this.pendingRequests.set(cacheKey, requestPromise);
            
            // Hapus dari pending setelah selesai
            requestPromise.finally(() => {
                this.pendingRequests.delete(cacheKey);
            });
            
            return requestPromise;
            
        } catch (error) {
            console.error(`❌ GET Error (${action}):`, error);
            
            // Coba ambil dari cache jika offline/error
            if (this.cache.has(cacheKey)) {
                console.log('📦 Mengambil dari cache:', cacheKey);
                return this.cache.get(cacheKey).data;
            }
            
            throw error;
        }
    }

    // POST request
    async post(action, data = {}) {
        try {
            const url = new URL(this.baseUrl);
            url.searchParams.append('action', action);
            
            // Add user role
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role) {
                data.role = user.role;
            }
            
            console.log(`🔍 POST ${action}:`, url.toString());
            console.log('📦 Data:', data);
            
            const response = await fetch(url.toString(), {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(data)
            });
            
            const text = await response.text();
            console.log(`📦 ${action} response:`, text.substring(0, 200));
            
            try {
                const json = JSON.parse(text);
                
                // Invalidate cache untuk action terkait
                this.invalidateCache(action);
                
                return json;
            } catch (e) {
                console.error(`❌ ${action} bukan JSON:`, text);
                throw new Error('Response bukan JSON: ' + text.substring(0, 100));
            }
            
        } catch (error) {
            console.error(`❌ POST Error (${action}):`, error);
            throw error;
        }
    }

    // Upload file (jika diperlukan)
    async upload(action, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('action', action);
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role) {
            formData.append('role', user.role);
        }
        
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('❌ Upload Error:', error);
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Invalidate cache untuk action tertentu
    invalidateCache(action) {
        const prefix = action.split('_')[0]; // getKelas -> get, saveKelas -> save
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
                console.log(`🗑️ Cache invalidated: ${key}`);
            }
        }
    }

    // Get cached data
    getCached(action, params = {}) {
        const cacheKey = `${action}_${JSON.stringify(params)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < 5 * 60 * 1000) { // 5 menit
            return cached.data;
        }
        
        return null;
    }
}

// Export
window.api = new Api();
console.log('✅ API Ready');