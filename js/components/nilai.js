// js/components/nilai.js
const NilaiComponent = {
    template() {
        return `
            <div x-data="nilaiComponent" x-init="init" class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Manajemen Nilai</h2>
                        <p class="text-sm text-slate-500 mt-1">Input dan rekap nilai formatif & sumatif</p>
                    </div>
                    
                    <!-- Tombol Aksi -->
                    <div class="flex items-center space-x-3">
                        <button @click="openImportModal" 
                                class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-2">
                            <i class="fa-solid fa-file-import text-indigo-500"></i>
                            <span>Import</span>
                        </button>
                        <button @click="exportData" 
                                class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-2">
                            <i class="fa-solid fa-download text-green-500"></i>
                            <span>Export</span>
                        </button>
                        <button x-show="$store.user?.role === 'ADMIN'" 
                                @click="openModal()"
                                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
                            <i class="fa-solid fa-plus"></i>
                            <span>Tambah Nilai</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Rata-rata Formatif</p>
                                <p class="text-2xl font-bold mt-1 text-blue-600" x-text="stats.rataFormatif || '0'"></p>
                            </div>
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-pen"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Rata-rata Sumatif</p>
                                <p class="text-2xl font-bold mt-1 text-purple-600" x-text="stats.rataSumatif || '0'"></p>
                            </div>
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-star"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Nilai</p>
                                <p class="text-2xl font-bold mt-1 text-indigo-600" x-text="stats.totalNilai || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-calculator"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Siswa Dinilai</p>
                                <p class="text-2xl font-bold mt-1 text-green-600" x-text="stats.siswaDinilai || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Pilih Kelas -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-chalkboard mr-1 text-indigo-500"></i>
                                Kelas
                            </label>
                            <select x-model="filterKelas" 
                                    @change="loadSiswaByKelas"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Pilih Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Pilih Siswa -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-user mr-1 text-indigo-500"></i>
                                Siswa
                            </label>
                            <select x-model="filterSiswa" 
                                    @change="loadNilai"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Siswa</option>
                                <template x-for="siswa in siswaList" :key="siswa.id_siswa">
                                    <option :value="siswa.id_siswa" x-text="siswa.nama"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Filter Jenis -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-tag mr-1 text-indigo-500"></i>
                                Jenis Nilai
                            </label>
                            <select x-model="filterJenis" 
                                    @change="filterNilai"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Jenis</option>
                                <option value="formatif">Formatif</option>
                                <option value="sumatif">Sumatif</option>
                            </select>
                        </div>

                        <!-- Tombol Hitung -->
                        <div class="flex items-end">
                            <button @click="hitungNilaiAkhir" 
                                    :disabled="!filterSiswa || !filterKelas"
                                    class="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                                <i class="fa-solid fa-calculator"></i>
                                <span>Hitung Nilai Akhir</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tabel Nilai -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">NIS</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nilai</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Bobot</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold" x-show="$store.user?.role === 'ADMIN'">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in paginatedNilai" :key="item.id_nilai">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="startIndex + index + 1"></td>
                                        <td class="px-4 py-3 font-mono text-sm" x-text="getNisSiswa(item.id_siswa)"></td>
                                        <td class="px-4 py-3 font-medium" x-text="getNamaSiswa(item.id_siswa)"></td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs"
                                                  x-text="getNamaKelas(item.id_kelas)"></span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-blue-100 text-blue-800': item.jenis === 'formatif',
                                                'bg-purple-100 text-purple-800': item.jenis === 'sumatif'
                                            }">
                                                <i :class="item.jenis === 'formatif' ? 'fa-solid fa-pen' : 'fa-solid fa-star'" class="mr-1"></i>
                                                <span x-text="item.jenis === 'formatif' ? 'Formatif' : 'Sumatif'"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="text-lg font-bold" :class="{
                                                'text-green-600': item.nilai >= 85,
                                                'text-blue-600': item.nilai >= 70 && item.nilai < 85,
                                                'text-yellow-600': item.nilai >= 55 && item.nilai < 70,
                                                'text-red-600': item.nilai < 55
                                            }" x-text="item.nilai"></span>
                                        </td>
                                        <td class="px-4 py-3" x-text="item.bobot"></td>
                                        <td class="px-4 py-3" x-show="$store.user?.role === 'ADMIN'">
                                            <div class="flex space-x-2">
                                                <button @click="editNilai(item)" 
                                                        class="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition">
                                                    <i class="fa-solid fa-edit"></i>
                                                </button>
                                                <button @click="confirmDelete(item)" 
                                                        class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <!-- Empty State -->
                                <tr x-show="filteredNilai.length === 0">
                                    <td colspan="8" class="px-4 py-12 text-center text-slate-500">
                                        <i class="fa-solid fa-star text-5xl mb-3 opacity-50"></i>
                                        <p class="text-lg font-medium">Tidak ada data nilai</p>
                                        <p class="text-sm mt-2">Pilih kelas dan siswa atau tambah nilai baru</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredNilai.length > 0" class="mt-6 flex justify-between items-center">
                        <div class="text-sm text-slate-500" x-text="paginationInfo"></div>
                        <div class="flex space-x-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <span class="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl" x-text="currentPage"></span>
                            <button @click="nextPage" :disabled="currentPage >= totalPages"
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Hasil Nilai Akhir -->
                <div x-show="hasilAkhir" class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-star mr-2"></i>
                        Hasil Perhitungan Nilai Akhir
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
                            <p class="text-sm opacity-80">Rata-rata Formatif</p>
                            <p class="text-3xl font-bold mt-2" x-text="hasilAkhir?.rata_formatif || '0'"></p>
                        </div>
                        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
                            <p class="text-sm opacity-80">Rata-rata Sumatif</p>
                            <p class="text-3xl font-bold mt-2" x-text="hasilAkhir?.rata_sumatif || '0'"></p>
                        </div>
                        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
                            <p class="text-sm opacity-80">Nilai Akhir</p>
                            <p class="text-4xl font-bold mt-2" x-text="hasilAkhir?.nilai_akhir || '0'"></p>
                        </div>
                    </div>
                    
                    <div class="mt-4 text-sm opacity-80">
                        <i class="fa-solid fa-circle-info mr-1"></i>
                        Rumus: (Formatif × 0.4) + (Sumatif × 0.6)
                    </div>
                </div>

                <!-- Grafik Nilai -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-chart-line text-indigo-500 mr-2"></i>
                        Distribusi Nilai
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Grafik Batang -->
                        <div>
                            <h4 class="text-sm font-medium mb-3">Perolehan Nilai</h4>
                            <div class="space-y-3">
                                <template x-for="range in ['90-100', '80-89', '70-79', '60-69', '<60']" :key="range">
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span x-text="range"></span>
                                            <span class="font-semibold" x-text="chartData[range] || 0 + ' siswa'"></span>
                                        </div>
                                        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div class="bg-indigo-600 h-2 rounded-full" 
                                                 :style="'width: ' + ((chartData[range] || 0) / chartData.total * 100) + '%'"></div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        
                        <!-- Statistik -->
                        <div>
                            <h4 class="text-sm font-medium mb-3">Statistik Nilai</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-xs text-slate-500">Nilai Tertinggi</p>
                                    <p class="text-xl font-bold text-green-600" x-text="stats.max || '0'"></p>
                                </div>
                                <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-xs text-slate-500">Nilai Terendah</p>
                                    <p class="text-xl font-bold text-red-600" x-text="stats.min || '0'"></p>
                                </div>
                                <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-xs text-slate-500">Rata-rata</p>
                                    <p class="text-xl font-bold text-blue-600" x-text="stats.rata || '0'"></p>
                                </div>
                                <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-xs text-slate-500">Total Nilai</p>
                                    <p class="text-xl font-bold text-purple-600" x-text="stats.totalNilai || '0'"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Form Nilai -->
                <div x-show="showModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="saveNilai">
                            <div class="space-y-4">
                                <!-- Kelas -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">Kelas</label>
                                    <select x-model="form.id_kelas" @change="loadSiswaByKelasModal" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                        <option value="">Pilih Kelas</option>
                                        <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                            <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                        </template>
                                    </select>
                                </div>
                                
                                <!-- Siswa -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">Siswa</label>
                                    <select x-model="form.id_siswa" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                        <option value="">Pilih Siswa</option>
                                        <template x-for="siswa in siswaListModal" :key="siswa.id_siswa">
                                            <option :value="siswa.id_siswa" x-text="siswa.nama + ' (' + siswa.nis + ')'"></option>
                                        </template>
                                    </select>
                                </div>
                                
                                <!-- Jenis Nilai -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">Jenis</label>
                                    <select x-model="form.jenis" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                        <option value="formatif">Formatif</option>
                                        <option value="sumatif">Sumatif</option>
                                    </select>
                                </div>
                                
                                <!-- Nilai -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">Nilai (0-100)</label>
                                    <input type="number" 
                                           x-model="form.nilai" 
                                           required
                                           min="0"
                                           max="100"
                                           step="0.01"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                </div>
                                
                                <!-- Bobot -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">Bobot</label>
                                    <input type="number" 
                                           x-model="form.bobot" 
                                           required
                                           min="1"
                                           value="1"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                </div>
                            </div>
                            
                            <div class="flex justify-end space-x-3 mt-6">
                                <button type="button" 
                                        @click="showModal = false" 
                                        class="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button type="submit" 
                                        class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    component() {
        return {
            // Data
            nilaiList: [],
            kelasList: [],
            siswaList: [],
            siswaListModal: [],
            filteredNilai: [],
            
            // Filters
            filterKelas: '',
            filterSiswa: '',
            filterJenis: '',
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            
            // Stats
            stats: {
                rataFormatif: 0,
                rataSumatif: 0,
                totalNilai: 0,
                siswaDinilai: 0,
                max: 0,
                min: 0,
                rata: 0
            },
            
            // Chart
            chartData: {
                '90-100': 0,
                '80-89': 0,
                '70-79': 0,
                '60-69': 0,
                '<60': 0,
                total: 0
            },
            
            // Modal
            showModal: false,
            showImportModal: false,
            modalTitle: 'Tambah Nilai',
            
            // Form
            form: {
                id_nilai: '',
                id_siswa: '',
                id_kelas: '',
                jenis: 'formatif',
                nilai: '',
                bobot: 1
            },
            
            // Selected
            selectedNilai: null,
            hasilAkhir: null,
            
            // Import
            importFile: null,
            
            // Computed
            get startIndex() {
                return (this.currentPage - 1) * this.itemsPerPage;
            },
            
            get endIndex() {
                return this.startIndex + this.itemsPerPage;
            },
            
            get paginatedNilai() {
                return this.filteredNilai.slice(this.startIndex, this.endIndex);
            },
            
            get totalPages() {
                return Math.ceil(this.filteredNilai.length / this.itemsPerPage);
            },
            
            get paginationInfo() {
                const start = this.startIndex + 1;
                const end = Math.min(this.endIndex, this.filteredNilai.length);
                return `Menampilkan ${start} - ${end} dari ${this.filteredNilai.length} nilai`;
            },

            // Init
            init() {
                console.log('⭐ Nilai Component initialized');
                
                // Subscribe ke store
                Store.subscribe('nilai', (data) => {
                    this.nilaiList = data || [];
                    this.filterNilai();
                    this.updateStats();
                    this.updateChart();
                });
                
                Store.subscribe('kelas', (kelas) => {
                    this.kelasList = kelas || [];
                });
                
                Store.subscribe('siswa', (siswa) => {
                    this.siswaList = siswa || [];
                });
                
                // Load data
                this.loadData();
            },

            // Load data
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data nilai...');
                
                try {
                    await Promise.all([
                        Store.loadKelas(),
                        Store.loadSiswa(),
                        Store.loadNilai()
                    ]);
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data');
                } finally {
                    app.hideLoading();
                }
            },

            // Filter methods
            filterNilai() {
                let filtered = [...this.nilaiList];
                
                if (this.filterKelas) {
                    filtered = filtered.filter(n => n.id_kelas === this.filterKelas);
                }
                
                if (this.filterSiswa) {
                    filtered = filtered.filter(n => n.id_siswa === this.filterSiswa);
                }
                
                if (this.filterJenis) {
                    filtered = filtered.filter(n => n.jenis === this.filterJenis);
                }
                
                this.filteredNilai = filtered;
                this.currentPage = 1;
            },

            // Load siswa by kelas
            async loadSiswaByKelas() {
                if (!this.filterKelas) {
                    this.siswaList = [];
                    return;
                }
                
                try {
                    const result = await api.get('getSiswaByKelas', { id_kelas: this.filterKelas });
                    if (result.status === 'success') {
                        this.siswaList = result.data;
                    }
                } catch (error) {
                    console.error('Error loading siswa:', error);
                }
            },

            loadSiswaByKelasModal() {
                if (!this.form.id_kelas) {
                    this.siswaListModal = [];
                    return;
                }
                this.siswaListModal = this.siswaList.filter(s => s.id_kelas === this.form.id_kelas);
            },

            // Update stats
            updateStats() {
                const formatif = this.nilaiList.filter(n => n.jenis === 'formatif').map(n => parseFloat(n.nilai));
                const sumatif = this.nilaiList.filter(n => n.jenis === 'sumatif').map(n => parseFloat(n.nilai));
                const semuaNilai = this.nilaiList.map(n => parseFloat(n.nilai));
                
                this.stats = {
                    rataFormatif: (formatif.reduce((a, b) => a + b, 0) / formatif.length || 0).toFixed(2),
                    rataSumatif: (sumatif.reduce((a, b) => a + b, 0) / sumatif.length || 0).toFixed(2),
                    totalNilai: this.nilaiList.length,
                    siswaDinilai: new Set(this.nilaiList.map(n => n.id_siswa)).size,
                    max: Math.max(...semuaNilai, 0),
                    min: Math.min(...semuaNilai, 0),
                    rata: (semuaNilai.reduce((a, b) => a + b, 0) / semuaNilai.length || 0).toFixed(2)
                };
            },

            // Update chart
            updateChart() {
                const counts = {
                    '90-100': 0,
                    '80-89': 0,
                    '70-79': 0,
                    '60-69': 0,
                    '<60': 0
                };
                
                this.nilaiList.forEach(n => {
                    const nilai = parseFloat(n.nilai);
                    if (nilai >= 90) counts['90-100']++;
                    else if (nilai >= 80) counts['80-89']++;
                    else if (nilai >= 70) counts['70-79']++;
                    else if (nilai >= 60) counts['60-69']++;
                    else counts['<60']++;
                });
                
                this.chartData = {
                    ...counts,
                    total: this.nilaiList.length
                };
            },

            // Hitung nilai akhir
            async hitungNilaiAkhir() {
                if (!this.filterSiswa || !this.filterKelas) {
                    alert('Pilih siswa dan kelas terlebih dahulu');
                    return;
                }
                
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghitung...');
                
                try {
                    const result = await api.get('hitungNilaiAkhir', {
                        id_siswa: this.filterSiswa,
                        id_kelas: this.filterKelas
                    });
                    
                    if (result.status === 'success') {
                        this.hasilAkhir = result.data;
                        app.showToast('success', 'Berhasil', 'Nilai akhir dihitung');
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error calculating:', error);
                    app.showToast('error', 'Error', 'Gagal menghitung nilai akhir');
                } finally {
                    app.hideLoading();
                }
            },

            // Helper methods
            getNamaKelas(id_kelas) {
                const kelas = this.kelasList.find(k => k.id_kelas === id_kelas);
                return kelas ? kelas.nama_kelas : '-';
            },

            getNamaSiswa(id_siswa) {
                const siswa = this.siswaList.find(s => s.id_siswa === id_siswa);
                return siswa ? siswa.nama : '-';
            },

            getNisSiswa(id_siswa) {
                const siswa = this.siswaList.find(s => s.id_siswa === id_siswa);
                return siswa ? siswa.nis : '-';
            },

            // Pagination
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                }
            },

            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },

            // Modal methods
            openModal(nilai = null) {
                if (nilai) {
                    this.modalTitle = 'Edit Nilai';
                    this.form = { ...nilai };
                    this.form.id_kelas = nilai.id_kelas;
                    this.loadSiswaByKelasModal();
                } else {
                    this.modalTitle = 'Tambah Nilai';
                    this.form = {
                        id_nilai: '',
                        id_siswa: '',
                        id_kelas: '',
                        jenis: 'formatif',
                        nilai: '',
                        bobot: 1
                    };
                }
                this.showModal = true;
            },

            editNilai(nilai) {
                this.openModal(nilai);
            },

            confirmDelete(nilai) {
                if (confirm('Yakin ingin menghapus nilai ini?')) {
                    this.deleteNilai(nilai);
                }
            },

            // Save
            async saveNilai() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    const result = await api.post('saveNilai', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Nilai disimpan');
                        this.showModal = false;
                        await Store.loadNilai();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error saving:', error);
                    app.showToast('error', 'Error', 'Gagal menyimpan data');
                } finally {
                    app.hideLoading();
                }
            },

            // Delete
            async deleteNilai(nilai) {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deleteNilai', { id_nilai: nilai.id_nilai });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Nilai dihapus');
                        await Store.loadNilai();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error deleting:', error);
                    app.showToast('error', 'Error', 'Gagal menghapus data');
                } finally {
                    app.hideLoading();
                }
            },

            // Export
            exportData() {
                const data = this.filteredNilai.map(n => ({
                    'NIS': this.getNisSiswa(n.id_siswa),
                    'Nama': this.getNamaSiswa(n.id_siswa),
                    'Kelas': this.getNamaKelas(n.id_kelas),
                    'Jenis': n.jenis === 'formatif' ? 'Formatif' : 'Sumatif',
                    'Nilai': n.nilai,
                    'Bobot': n.bobot
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `nilai_${new Date().toISOString().split('T')[0]}.csv`);
            },

            convertToCSV(data) {
                if (data.length === 0) return '';
                const headers = Object.keys(data[0]);
                const rows = data.map(obj => 
                    headers.map(header => JSON.stringify(obj[header] || '')).join(',')
                );
                return [headers.join(','), ...rows].join('\n');
            },

            downloadCSV(csv, filename) {
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        };
    }
};

// Register component
window.NilaiComponent = NilaiComponent;

console.log('✅ Nilai Component loaded');