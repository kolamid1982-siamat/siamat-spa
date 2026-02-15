// js/components/kelas.js
const KelasComponent = {
    // Template HTML
    template() {
        return `
            <div x-data="kelasComponent" x-init="init" class="space-y-6">
                <!-- Header dengan Tombol Tambah -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Manajemen Kelas</h2>
                    <button x-show="$store.user.role === 'ADMIN'" 
                            @click="openModal()"
                            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
                        <i class="fa-solid fa-plus"></i>
                        <span>Tambah Kelas</span>
                    </button>
                </div>

                <!-- Stats Kelas -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Kelas</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.totalKelas || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-chalkboard-user text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Tahun Ajaran Aktif</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.tahunAktif || '2024/2025'"></p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-calendar text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Siswa</p>
                                <p class="text-3xl font-bold mt-2" x-text="stats.totalSiswa || 0"></p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-users text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter dan Search -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                            <input type="text" 
                                   x-model="searchQuery"
                                   @input="filterKelas"
                                   placeholder="Cari kelas..."
                                   class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                        </div>
                        <div class="flex space-x-2">
                            <select x-model="filterTahun" 
                                    @change="filterKelas"
                                    class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Tahun</option>
                                <template x-for="tahun in tahunAjaran" :key="tahun">
                                    <option :value="tahun" x-text="tahun"></option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tabel Kelas -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">ID Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nama Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Tahun Ajaran</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Jumlah Siswa</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold" x-show="$store.user.role === 'ADMIN'">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in filteredKelas" :key="item.id_kelas">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="index + 1 + (currentPage - 1) * itemsPerPage"></td>
                                        <td class="px-4 py-3 font-mono text-sm" x-text="item.id_kelas"></td>
                                        <td class="px-4 py-3 font-medium" x-text="item.nama_kelas"></td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold" 
                                                  x-text="item.tahun_ajaran"></span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-xs font-semibold"
                                                  x-text="getJumlahSiswa(item.id_kelas)"></span>
                                        </td>
                                        <td class="px-4 py-3" x-show="$store.user.role === 'ADMIN'">
                                            <div class="flex space-x-2">
                                                <button @click="editKelas(item)" 
                                                        class="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                                                        title="Edit">
                                                    <i class="fa-solid fa-edit"></i>
                                                </button>
                                                <button @click="confirmDelete(item)" 
                                                        class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                        title="Hapus">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                                <button @click="viewDetail(item)" 
                                                        class="text-slate-600 hover:text-slate-800 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
                                                        title="Detail">
                                                    <i class="fa-solid fa-eye"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                
                                <!-- Empty State -->
                                <tr x-show="filteredKelas.length === 0">
                                    <td colspan="6" class="px-4 py-8 text-center text-slate-500">
                                        <i class="fa-solid fa-chalkboard-user text-4xl mb-3 opacity-50"></i>
                                        <p>Tidak ada data kelas</p>
                                        <p x-show="searchQuery || filterTahun" class="text-sm mt-2">Coba ubah filter pencarian</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredKelas.length > 0" class="mt-6 flex items-center justify-between">
                        <div class="text-sm text-slate-500">
                            Menampilkan <span x-text="((currentPage - 1) * itemsPerPage) + 1"></span> - 
                            <span x-text="Math.min(currentPage * itemsPerPage, filteredKelas.length)"></span> 
                            dari <span x-text="filteredKelas.length"></span> data
                        </div>
                        <div class="flex space-x-2">
                            <button @click="prevPage" 
                                    :disabled="currentPage === 1"
                                    :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                                    class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <span class="px-4 py-2 bg-indigo-600 text-white rounded-xl" x-text="currentPage"></span>
                            <button @click="nextPage" 
                                    :disabled="currentPage >= totalPages"
                                    :class="{'opacity-50 cursor-not-allowed': currentPage >= totalPages}"
                                    class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal Form Kelas -->
                <div x-show="showModal" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 transform scale-100"
                         x-transition:leave-end="opacity-0 transform scale-95">
                        
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="saveKelas">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-tag mr-1 text-indigo-500"></i>
                                        Nama Kelas
                                    </label>
                                    <input type="text" 
                                           x-model="form.nama_kelas" 
                                           required
                                           placeholder="Contoh: Matematika X IPA 1"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-calendar mr-1 text-indigo-500"></i>
                                        Tahun Ajaran
                                    </label>
                                    <input type="text" 
                                           x-model="form.tahun_ajaran" 
                                           required
                                           placeholder="2024/2025"
                                           pattern="\d{4}/\d{4}"
                                           title="Format: YYYY/YYYY (contoh: 2024/2025)"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                    <p class="text-xs text-slate-500 mt-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
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
                                    <i class="fa-solid fa-save mr-2"></i>
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Modal Detail Kelas -->
                <div x-show="showDetailModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                     @click.self="showDetailModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold">Detail Kelas</h3>
                            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="space-y-6">
                            <!-- Info Kelas -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-sm text-slate-500">ID Kelas</p>
                                    <p class="font-mono font-bold" x-text="selectedKelas?.id_kelas"></p>
                                </div>
                                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-sm text-slate-500">Nama Kelas</p>
                                    <p class="font-bold" x-text="selectedKelas?.nama_kelas"></p>
                                </div>
                                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-sm text-slate-500">Tahun Ajaran</p>
                                    <p class="font-bold" x-text="selectedKelas?.tahun_ajaran"></p>
                                </div>
                                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-sm text-slate-500">Jumlah Siswa</p>
                                    <p class="font-bold" x-text="getJumlahSiswa(selectedKelas?.id_kelas) || 0"></p>
                                </div>
                            </div>
                            
                            <!-- Daftar Siswa -->
                            <div>
                                <h4 class="font-semibold mb-3">Daftar Siswa</h4>
                                <div class="max-h-60 overflow-y-auto">
                                    <table class="w-full">
                                        <thead class="bg-slate-100 dark:bg-slate-700 sticky top-0">
                                            <tr>
                                                <th class="px-4 py-2 text-left text-sm">NIS</th>
                                                <th class="px-4 py-2 text-left text-sm">Nama</th>
                                                <th class="px-4 py-2 text-left text-sm">Jenis Kelamin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template x-for="siswa in daftarSiswa" :key="siswa.id_siswa">
                                                <tr class="border-t border-slate-200 dark:border-slate-700">
                                                    <td class="px-4 py-2 text-sm font-mono" x-text="siswa.nis"></td>
                                                    <td class="px-4 py-2" x-text="siswa.nama"></td>
                                                    <td class="px-4 py-2" x-text="siswa.jenis_kelamin"></td>
                                                </tr>
                                            </template>
                                            <tr x-show="daftarSiswa.length === 0">
                                                <td colspan="3" class="px-4 py-4 text-center text-slate-500">
                                                    Belum ada siswa di kelas ini
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Konfirmasi Hapus -->
                <div x-show="showDeleteModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                     @click.self="showDeleteModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fa-solid fa-exclamation-triangle text-3xl text-red-600"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Hapus Kelas</h3>
                            <p class="text-slate-500 mb-6">
                                Apakah Anda yakin ingin menghapus kelas <span class="font-semibold" x-text="selectedKelas?.nama_kelas"></span>?
                                <br>Tindakan ini tidak dapat dibatalkan.
                            </p>
                            
                            <div class="flex justify-center space-x-3">
                                <button type="button" 
                                        @click="showDeleteModal = false" 
                                        class="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button @click="deleteKelas" 
                                        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg">
                                    <i class="fa-solid fa-trash mr-2"></i>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Component logic
    component() {
        return {
            // Data
            kelasList: [],
            siswaList: [],
            filteredKelas: [],
            searchQuery: '',
            filterTahun: '',
            tahunAjaran: [],
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 1,
            
            // Stats
            stats: {
                totalKelas: 0,
                tahunAktif: '',
                totalSiswa: 0
            },
            
            // Modal states
            showModal: false,
            showDetailModal: false,
            showDeleteModal: false,
            modalTitle: 'Tambah Kelas',
            
            // Form
            form: {
                id_kelas: '',
                nama_kelas: '',
                tahun_ajaran: ''
            },
            
            // Selected data
            selectedKelas: null,
            daftarSiswa: [],
            
            // Store reference
            get $store() {
                return window.Store;
            },

            // Init
            init() {
                console.log('📚 Kelas Component initialized');
                
                // Subscribe ke store
                this.$store.subscribe('kelas', (kelas) => {
                    this.kelasList = kelas || [];
                    this.filterKelas();
                    this.updateStats();
                    this.extractTahunAjaran();
                });
                
                this.$store.subscribe('siswa', (siswa) => {
                    this.siswaList = siswa || [];
                    this.filterKelas();
                    this.updateStats();
                });
                
                // Load data
                this.loadData();
            },

            // Load data dari API
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data kelas...');
                
                try {
                    await Promise.all([
                        this.$store.loadKelas(),
                        this.$store.loadSiswa()
                    ]);
                    
                    app.showToast('success', 'Berhasil', 'Data kelas dimuat');
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data kelas');
                } finally {
                    app.hideLoading();
                }
            },

            // Filter kelas
            filterKelas() {
                let filtered = [...this.kelasList];
                
                // Filter by search query
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    filtered = filtered.filter(k => 
                        k.nama_kelas.toLowerCase().includes(query) ||
                        k.id_kelas.toLowerCase().includes(query)
                    );
                }
                
                // Filter by tahun ajaran
                if (this.filterTahun) {
                    filtered = filtered.filter(k => k.tahun_ajaran === this.filterTahun);
                }
                
                // Update filtered list
                this.filteredKelas = filtered;
                
                // Update pagination
                this.totalPages = Math.ceil(this.filteredKelas.length / this.itemsPerPage);
                if (this.currentPage > this.totalPages) {
                    this.currentPage = this.totalPages || 1;
                }
            },

            // Extract unique tahun ajaran
            extractTahunAjaran() {
                const tahunSet = new Set(this.kelasList.map(k => k.tahun_ajaran));
                this.tahunAjaran = Array.from(tahunSet).sort().reverse();
                
                // Set tahun aktif (tahun terbaru)
                if (this.tahunAjaran.length > 0) {
                    this.stats.tahunAktif = this.tahunAjaran[0];
                }
            },

            // Update stats
            updateStats() {
                this.stats = {
                    totalKelas: this.kelasList.length,
                    tahunAktif: this.stats.tahunAktif,
                    totalSiswa: this.siswaList.length
                };
            },

            // Get jumlah siswa per kelas
            getJumlahSiswa(id_kelas) {
                return this.siswaList.filter(s => s.id_kelas === id_kelas).length;
            },

            // Pagination methods
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
            openModal(kelas = null) {
                if (kelas) {
                    this.modalTitle = 'Edit Kelas';
                    this.form = { ...kelas };
                } else {
                    this.modalTitle = 'Tambah Kelas';
                    this.form = {
                        id_kelas: '',
                        nama_kelas: '',
                        tahun_ajaran: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)
                    };
                }
                this.showModal = true;
            },

            editKelas(kelas) {
                this.openModal(kelas);
            },

            viewDetail(kelas) {
                this.selectedKelas = kelas;
                this.daftarSiswa = this.siswaList.filter(s => s.id_kelas === kelas.id_kelas);
                this.showDetailModal = true;
            },

            confirmDelete(kelas) {
                this.selectedKelas = kelas;
                this.showDeleteModal = true;
            },

            // Save kelas
            async saveKelas() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    const result = await api.post('saveKelas', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Data kelas disimpan');
                        this.showModal = false;
                        await this.$store.loadKelas();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error saving kelas:', error);
                    app.showToast('error', 'Error', 'Gagal menyimpan data');
                } finally {
                    app.hideLoading();
                }
            },

            // Delete kelas
            async deleteKelas() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deleteKelas', { 
                        id_kelas: this.selectedKelas.id_kelas 
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Kelas dihapus');
                        this.showDeleteModal = false;
                        await this.$store.loadKelas();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error deleting kelas:', error);
                    app.showToast('error', 'Error', 'Gagal menghapus data');
                } finally {
                    app.hideLoading();
                }
            },

            // Export data
            exportData() {
                const data = this.filteredKelas.map(k => ({
                    'ID Kelas': k.id_kelas,
                    'Nama Kelas': k.nama_kelas,
                    'Tahun Ajaran': k.tahun_ajaran,
                    'Jumlah Siswa': this.getJumlahSiswa(k.id_kelas)
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `kelas_${new Date().toISOString().split('T')[0]}.csv`);
            },

            convertToCSV(data) {
                const header = Object.keys(data[0]).join(',');
                const rows = data.map(obj => Object.values(obj).join(','));
                return [header, ...rows].join('\n');
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
window.KelasComponent = KelasComponent;

console.log('✅ Kelas Component loaded');