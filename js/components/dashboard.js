// js/components/dashboard.js
const DashboardComponent = {
    template() {
        return `
            <div x-data="dashboardComponent" x-init="init" class="space-y-6">
                <!-- Welcome Section -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <h2 class="text-2xl font-bold mb-2">Selamat Datang, <span x-text="$store.user?.nama"></span>!</h2>
                    <p class="opacity-90">Ringkasan aktivitas SiAMAT hari ini</p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total Siswa -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Siswa</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.totalSiswa || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-users text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Kelas -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Kelas</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.totalKelas || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-chalkboard-user text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Absensi Hari Ini -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Absensi Hari Ini</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.absensiHariIni || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-calendar-check text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Nilai -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Nilai</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.nilaiTerbaru || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600">
                                <i class="fa-solid fa-star text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts & Tables -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Jurnal Terbaru -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold">
                                <i class="fa-solid fa-book-open text-indigo-500 mr-2"></i>
                                Jurnal Terbaru
                            </h3>
                            <a href="#" @click.prevent="$store.navigate('jurnal')" class="text-sm text-indigo-600 hover:text-indigo-800">
                                Lihat Semua <i class="fa-solid fa-arrow-right ml-1"></i>
                            </a>
                        </div>
                        
                        <div class="space-y-3">
                            <template x-for="jurnal in stats.jurnalTerbaru || []" :key="jurnal.tanggal">
                                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                                            <i class="fa-solid fa-feather text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="font-medium" x-text="jurnal.materi"></p>
                                            <p class="text-xs text-slate-500" x-text="jurnal.kelas + ' • ' + jurnal.tanggal"></p>
                                        </div>
                                    </div>
                                    <span class="text-xs text-slate-400" x-text="jurnal.catatan?.substring(0, 20) + '...'"></span>
                                </div>
                            </template>
                            
                            <div x-show="!stats.jurnalTerbaru?.length" class="text-center py-8 text-slate-500">
                                <i class="fa-solid fa-book-open text-3xl mb-2 opacity-50"></i>
                                <p>Belum ada jurnal</p>
                            </div>
                        </div>
                    </div>

                    <!-- Statistik Kelas -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold">
                                <i class="fa-solid fa-chart-pie text-indigo-500 mr-2"></i>
                                Statistik Kelas
                            </h3>
                            <a href="#" @click.prevent="$store.navigate('kelas')" class="text-sm text-indigo-600 hover:text-indigo-800">
                                Lihat Semua <i class="fa-solid fa-arrow-right ml-1"></i>
                            </a>
                        </div>

                        <div class="space-y-4">
                            <template x-for="kelas in topKelas" :key="kelas.id_kelas">
                                <div>
                                    <div class="flex items-center justify-between text-sm mb-1">
                                        <span x-text="kelas.nama_kelas"></span>
                                        <span class="font-semibold" x-text="kelas.jumlah_siswa + ' siswa'"></span>
                                    </div>
                                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div class="bg-indigo-600 h-2 rounded-full" 
                                             :style="'width: ' + (kelas.jumlah_siswa / maxSiswa * 100) + '%'"></div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button @click="$store.navigate('absensi')" 
                            class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition group">
                        <i class="fa-solid fa-calendar-check text-2xl text-indigo-500 group-hover:scale-110 transition"></i>
                        <p class="text-sm mt-2">Absensi Cepat</p>
                    </button>
                    
                    <button @click="$store.navigate('nilai')" 
                            class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition group">
                        <i class="fa-solid fa-star text-2xl text-yellow-500 group-hover:scale-110 transition"></i>
                        <p class="text-sm mt-2">Input Nilai</p>
                    </button>
                    
                    <button @click="$store.navigate('jurnal')" 
                            class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition group">
                        <i class="fa-solid fa-book-open text-2xl text-green-500 group-hover:scale-110 transition"></i>
                        <p class="text-sm mt-2">Tulis Jurnal</p>
                    </button>
                    
                    <button @click="$store.navigate('siswa')" 
                            class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition group">
                        <i class="fa-solid fa-user-plus text-2xl text-purple-500 group-hover:scale-110 transition"></i>
                        <p class="text-sm mt-2">Tambah Siswa</p>
                    </button>
                </div>
            </div>
        `;
    },

    component() {
        return {
            stats: {},
            kelasList: [],
            topKelas: [],
            maxSiswa: 0,

            init() {
                this.loadData();
                
                // Auto refresh setiap 30 detik
                this.interval = setInterval(() => this.loadData(), 30000);
            },

            destroy() {
                if (this.interval) clearInterval(this.interval);
            },

            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                
                try {
                    const result = await api.get('getDashboard');
                    
                    if (result.status === 'success') {
                        this.stats = result.data;
                        await this.loadKelasStats();
                    }
                } catch (error) {
                    console.error('Error loading dashboard:', error);
                }
            },

            async loadKelasStats() {
                try {
                    const result = await api.get('getKelas');
                    
                    if (result.status === 'success') {
                        this.kelasList = result.data;
                        
                        // Hitung jumlah siswa per kelas
                        const siswaResult = await api.get('getSiswa');
                        const siswaList = siswaResult.data || [];
                        
                        this.topKelas = this.kelasList.map(k => ({
                            ...k,
                            jumlah_siswa: siswaList.filter(s => s.id_kelas === k.id_kelas).length
                        })).sort((a, b) => b.jumlah_siswa - a.jumlah_siswa).slice(0, 5);
                        
                        this.maxSiswa = Math.max(...this.topKelas.map(k => k.jumlah_siswa), 1);
                    }
                } catch (error) {
                    console.error('Error loading kelas stats:', error);
                }
            }
        };
    }
};

window.DashboardComponent = DashboardComponent;
console.log('✅ Dashboard Component loaded');