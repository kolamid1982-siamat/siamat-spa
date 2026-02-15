// js/components/siswa.js
const SiswaComponent = {
    template() {
        return `
            <div x-data="siswaComponent" x-init="init" class="space-y-6">
                <!-- Header dengan Tombol Tambah -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Manajemen Siswa</h2>
                        <p class="text-sm text-slate-500 mt-1">Kelola data siswa per kelas</p>
                    </div>
                    <button x-show="$store.user?.role === 'ADMIN'" 
                            @click="openModal()"
                            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>Tambah Siswa</span>
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Siswa</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalSiswa || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Laki-laki</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.lakiLaki || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-mars"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Perempuan</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.perempuan || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600">
                                <i class="fa-solid fa-venus"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Kelas</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalKelas || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-chalkboard"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter dan Search Card -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Search -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-search mr-1 text-indigo-500"></i>
                                Pencarian
                            </label>
                            <div class="relative">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                <input type="text" 
                                       x-model="searchQuery"
                                       @input="debounceFilter"
                                       placeholder="Cari berdasarkan nama, NIS, atau kelas..."
                                       class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                            </div>
                        </div>

                        <!-- Filter Kelas -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-filter mr-1 text-indigo-500"></i>
                                Filter Kelas
                            </label>
                            <select x-model="filterKelas" 
                                    @change="filterSiswa"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Filter Jenis Kelamin -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-venus-mars mr-1 text-indigo-500"></i>
                                Jenis Kelamin
                            </label>
                            <select x-model="filterJenisKelamin" 
                                    @change="filterSiswa"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    <!-- Active Filters -->
                    <div x-show="activeFilters.length > 0" class="mt-4 flex flex-wrap gap-2">
                        <template x-for="filter in activeFilters" :key="filter.label">
                            <span class="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                                <span x-text="filter.label"></span>
                                <button @click="removeFilter(filter)" class="ml-2 hover:text-indigo-600">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </span>
                        </template>
                        <button @click="clearAllFilters" class="text-sm text-slate-500 hover:text-slate-700">
                            Hapus semua
                        </button>
                    </div>
                </div>

                <!-- Tabel Siswa -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">NIS</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Jenis Kelamin</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold" x-show="$store.user?.role === 'ADMIN'">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in paginatedSiswa" :key="item.id_siswa">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="startIndex + index + 1"></td>
                                        <td class="px-4 py-3 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400" x-text="item.nis"></td>
                                        <td class="px-4 py-3 font-medium" x-text="item.nama"></td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold"
                                                  x-text="getNamaKelas(item.id_kelas)"></span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': item.jenis_kelamin === 'L',
                                                'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300': item.jenis_kelamin === 'P'
                                            }">
                                                <i :class="item.jenis_kelamin === 'L' ? 'fa-solid fa-mars' : 'fa-solid fa-venus'" class="mr-1"></i>
                                                <span x-text="item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-xs font-semibold">
                                                <i class="fa-solid fa-circle text-xs mr-1"></i>
                                                Aktif
                                            </span>
                                        </td>
                                        <td class="px-4 py-3" x-show="$store.user?.role === 'ADMIN'">
                                            <div class="flex space-x-2">
                                                <button @click="editSiswa(item)" 
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
                                <tr x-show="filteredSiswa.length === 0">
                                    <td colspan="7" class="px-4 py-12 text-center text-slate-500">
                                        <i class="fa-solid fa-users-slash text-5xl mb-3 opacity-50"></i>
                                        <p class="text-lg font-medium">Tidak ada data siswa</p>
                                        <p class="text-sm mt-2">Coba ubah filter pencarian atau tambah siswa baru</p>
                                        <button x-show="$store.user?.role === 'ADMIN'"
                                                @click="openModal()" 
                                                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition inline-flex items-center space-x-2">
                                            <i class="fa-solid fa-plus"></i>
                                            <span>Tambah Siswa</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredSiswa.length > 0" class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="text-sm text-slate-500">
                            Menampilkan <span class="font-semibold" x-text="startIndex + 1"></span> - 
                            <span class="font-semibold" x-text="Math.min(endIndex, filteredSiswa.length)"></span> 
                            dari <span class="font-semibold" x-text="filteredSiswa.length"></span> data
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <button @click="prevPage" 
                                    :disabled="currentPage === 1"
                                    :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                                    class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            
                            <template x-for="page in pageNumbers" :key="page">
                                <button @click="goToPage(page)" 
                                        :class="{
                                            'bg-indigo-600 text-white': currentPage === page,
                                            'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700': currentPage !== page
                                        }"
                                        class="w-10 h-10 rounded-xl transition">
                                    <span x-text="page"></span>
                                </button>
                            </template>
                            
                            <button @click="nextPage" 
                                    :disabled="currentPage >= totalPages"
                                    :class="{'opacity-50 cursor-not-allowed': currentPage >= totalPages}"
                                    class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <!-- Items per page -->
                        <select x-model="itemsPerPage" @change="updateItemsPerPage" 
                                class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                            <option value="5">5 per halaman</option>
                            <option value="10">10 per halaman</option>
                            <option value="25">25 per halaman</option>
                            <option value="50">50 per halaman</option>
                        </select>
                    </div>
                </div>

                <!-- Modal Form Siswa -->
                <div x-show="showModal" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 transform scale-100"
                         x-transition:leave-end="opacity-0 transform scale-95"
                         @click.stop>
                        
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="saveSiswa">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- NIS -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-id-card mr-1 text-indigo-500"></i>
                                        NIS <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.nis" 
                                           required
                                           maxlength="10"
                                           placeholder="Contoh: 2024001"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Nama Lengkap -->
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-user mr-1 text-indigo-500"></i>
                                        Nama Lengkap <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.nama" 
                                           required
                                           placeholder="Contoh: Ahmad Fauzi"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Kelas -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-chalkboard mr-1 text-indigo-500"></i>
                                        Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <select x-model="form.id_kelas" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                        <option value="">Pilih Kelas</option>
                                        <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                            <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                        </template>
                                    </select>
                                </div>
                                
                                <!-- Jenis Kelamin -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-venus-mars mr-1 text-indigo-500"></i>
                                        Jenis Kelamin <span class="text-red-500">*</span>
                                    </label>
                                    <div class="flex space-x-4">
                                        <label class="flex items-center space-x-2">
                                            <input type="radio" x-model="form.jenis_kelamin" value="L" class="text-indigo-600 focus:ring-indigo-500">
                                            <span>Laki-laki</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="radio" x-model="form.jenis_kelamin" value="P" class="text-indigo-600 focus:ring-indigo-500">
                                            <span>Perempuan</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <!-- Tempat Lahir -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-location-dot mr-1 text-indigo-500"></i>
                                        Tempat Lahir
                                    </label>
                                    <input type="text" 
                                           x-model="form.tempat_lahir" 
                                           placeholder="Contoh: Jakarta"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Tanggal Lahir -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-calendar mr-1 text-indigo-500"></i>
                                        Tanggal Lahir
                                    </label>
                                    <input type="date" 
                                           x-model="form.tanggal_lahir" 
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Alamat -->
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-home mr-1 text-indigo-500"></i>
                                        Alamat
                                    </label>
                                    <textarea x-model="form.alamat" 
                                              rows="3"
                                              placeholder="Alamat lengkap"
                                              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition"></textarea>
                                </div>
                                
                                <!-- No Telepon -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-phone mr-1 text-indigo-500"></i>
                                        No Telepon
                                    </label>
                                    <input type="tel" 
                                           x-model="form.no_telp" 
                                           placeholder="Contoh: 081234567890"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Email -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-envelope mr-1 text-indigo-500"></i>
                                        Email
                                    </label>
                                    <input type="email" 
                                           x-model="form.email" 
                                           placeholder="contoh@email.com"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Nama Ayah -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-user-tie mr-1 text-indigo-500"></i>
                                        Nama Ayah
                                    </label>
                                    <input type="text" 
                                           x-model="form.nama_ayah" 
                                           placeholder="Nama ayah"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Nama Ibu -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-user-tie mr-1 text-indigo-500"></i>
                                        Nama Ibu
                                    </label>
                                    <input type="text" 
                                           x-model="form.nama_ibu" 
                                           placeholder="Nama ibu"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" 
                                        @click="showModal = false" 
                                        class="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button type="submit" 
                                        class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center space-x-2">
                                    <i class="fa-solid fa-save"></i>
                                    <span>Simpan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Modal Detail Siswa -->
                <div x-show="showDetailModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showDetailModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold">Detail Siswa</h3>
                            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedSiswa">
                            <div class="space-y-6">
                                <!-- Profile Header -->
                                <div class="flex items-center space-x-4">
                                    <div class="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                                        <span x-text="selectedSiswa.nama?.charAt(0).toUpperCase()"></span>
                                    </div>
                                    <div>
                                        <h4 class="text-2xl font-bold" x-text="selectedSiswa.nama"></h4>
                                        <p class="text-slate-500">NIS: <span class="font-mono font-semibold" x-text="selectedSiswa.nis"></span></p>
                                    </div>
                                </div>
                                
                                <!-- Info Grid -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">ID Siswa</p>
                                        <p class="font-mono font-semibold" x-text="selectedSiswa.id_siswa"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Kelas</p>
                                        <p class="font-semibold" x-text="getNamaKelas(selectedSiswa.id_kelas)"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Jenis Kelamin</p>
                                        <p class="font-semibold" x-text="selectedSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Tempat, Tanggal Lahir</p>
                                        <p class="font-semibold" x-text="(selectedSiswa.tempat_lahir || '-') + ', ' + (selectedSiswa.tanggal_lahir || '-')"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Alamat</p>
                                        <p class="font-semibold" x-text="selectedSiswa.alamat || '-'"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">No Telepon</p>
                                        <p class="font-semibold" x-text="selectedSiswa.no_telp || '-'"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Email</p>
                                        <p class="font-semibold" x-text="selectedSiswa.email || '-'"></p>
                                    </div>
                                </div>
                                
                                <!-- Orang Tua -->
                                <div>
                                    <h5 class="font-semibold mb-3">Data Orang Tua</h5>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                            <p class="text-sm text-slate-500">Nama Ayah</p>
                                            <p class="font-semibold" x-text="selectedSiswa.nama_ayah || '-'"></p>
                                        </div>
                                        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                            <p class="text-sm text-slate-500">Nama Ibu</p>
                                            <p class="font-semibold" x-text="selectedSiswa.nama_ibu || '-'"></p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Export Actions -->
                                <div class="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button @click="exportPDF(selectedSiswa)" 
                                            class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center space-x-2">
                                        <i class="fa-solid fa-file-pdf"></i>
                                        <span>Export PDF</span>
                                    </button>
                                    <button @click="exportCard(selectedSiswa)" 
                                            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center space-x-2">
                                        <i class="fa-solid fa-id-card"></i>
                                        <span>Kartu Siswa</span>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Modal Konfirmasi Hapus -->
                <div x-show="showDeleteModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showDeleteModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fa-solid fa-exclamation-triangle text-3xl text-red-600"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Hapus Siswa</h3>
                            <p class="text-slate-500 mb-2">
                                Apakah Anda yakin ingin menghapus siswa:
                            </p>
                            <p class="font-semibold text-lg mb-1" x-text="selectedSiswa?.nama"></p>
                            <p class="text-sm text-slate-400 mb-6" x-text="'NIS: ' + selectedSiswa?.nis"></p>
                            
                            <p class="text-sm text-red-500 mb-6">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                Tindakan ini akan menghapus semua data terkait (absensi, nilai, dll)
                            </p>
                            
                            <div class="flex justify-center space-x-3">
                                <button type="button" 
                                        @click="showDeleteModal = false" 
                                        class="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button @click="deleteSiswa" 
                                        class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg flex items-center space-x-2">
                                    <i class="fa-solid fa-trash"></i>
                                    <span>Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Import Excel -->
                <div x-show="showImportModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showImportModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold">Import Siswa dari Excel</h3>
                            <button @click="showImportModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Template Download -->
                            <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <p class="text-sm mb-2">Download template Excel:</p>
                                <a href="#" @click.prevent="downloadTemplate" 
                                   class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-2">
                                    <i class="fa-solid fa-download"></i>
                                    <span>template_siswa.xlsx</span>
                                </a>
                            </div>
                            
                            <!-- File Upload -->
                            <div>
                                <label class="block text-sm font-medium mb-2">
                                    Pilih file Excel
                                </label>
                                <input type="file" 
                                       @change="handleFileUpload" 
                                       accept=".xlsx, .xls, .csv"
                                       class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700">
                            </div>
                            
                            <!-- Progress -->
                            <div x-show="importProgress > 0" class="space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span>Importing...</span>
                                    <span x-text="importProgress + '%'"></span>
                                </div>
                                <div class="w-full bg-slate-200 rounded-full h-2">
                                    <div class="bg-indigo-600 h-2 rounded-full" :style="'width: ' + importProgress + '%'"></div>
                                </div>
                            </div>
                            
                            <!-- Import Actions -->
                            <div class="flex justify-end space-x-3 pt-4">
                                <button type="button" 
                                        @click="showImportModal = false" 
                                        class="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                                    Tutup
                                </button>
                                <button @click="importSiswa" 
                                        class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                                    Import
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    component() {
        return {
            // Data
            siswaList: [],
            kelasList: [],
            filteredSiswa: [],
            
            // Filters
            searchQuery: '',
            filterKelas: '',
            filterJenisKelamin: '',
            searchTimeout: null,
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            
            // Stats
            stats: {
                totalSiswa: 0,
                lakiLaki: 0,
                perempuan: 0,
                totalKelas: 0
            },
            
            // Modal states
            showModal: false,
            showDetailModal: false,
            showDeleteModal: false,
            showImportModal: false,
            modalTitle: 'Tambah Siswa',
            
            // Form
            form: {
                id_siswa: '',
                nis: '',
                nama: '',
                id_kelas: '',
                jenis_kelamin: 'L',
                tempat_lahir: '',
                tanggal_lahir: '',
                alamat: '',
                no_telp: '',
                email: '',
                nama_ayah: '',
                nama_ibu: ''
            },
            
            // Selected data
            selectedSiswa: null,
            
            // Import
            importProgress: 0,
            importFile: null,
            
            // Active filters
            activeFilters: [],
            
            // Computed properties
            get startIndex() {
                return (this.currentPage - 1) * this.itemsPerPage;
            },
            
            get endIndex() {
                return this.startIndex + this.itemsPerPage;
            },
            
            get paginatedSiswa() {
                return this.filteredSiswa.slice(this.startIndex, this.endIndex);
            },
            
            get totalPages() {
                return Math.ceil(this.filteredSiswa.length / this.itemsPerPage);
            },
            
            get pageNumbers() {
                const pages = [];
                const maxVisible = 5;
                let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
                let end = Math.min(this.totalPages, start + maxVisible - 1);
                
                if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                }
                
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
                return pages;
            },

            // Init
            init() {
                console.log('📚 Siswa Component initialized');
                
                // Subscribe ke store
                Store.subscribe('siswa', (siswa) => {
                    this.siswaList = siswa || [];
                    this.filterSiswa();
                    this.updateStats();
                });
                
                Store.subscribe('kelas', (kelas) => {
                    this.kelasList = kelas || [];
                });
                
                // Load data
                this.loadData();
            },

            // Load data dari API
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data siswa...');
                
                try {
                    await Promise.all([
                        Store.loadKelas(),
                        Store.loadSiswa()
                    ]);
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data siswa');
                } finally {
                    app.hideLoading();
                }
            },

            // Filter siswa
            filterSiswa() {
                let filtered = [...this.siswaList];
                
                // Filter by search query
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    filtered = filtered.filter(s => 
                        s.nama?.toLowerCase().includes(query) ||
                        s.nis?.toLowerCase().includes(query) ||
                        this.getNamaKelas(s.id_kelas)?.toLowerCase().includes(query)
                    );
                }
                
                // Filter by kelas
                if (this.filterKelas) {
                    filtered = filtered.filter(s => s.id_kelas === this.filterKelas);
                }
                
                // Filter by jenis kelamin
                if (this.filterJenisKelamin) {
                    filtered = filtered.filter(s => s.jenis_kelamin === this.filterJenisKelamin);
                }
                
                this.filteredSiswa = filtered;
                this.updateActiveFilters();
                
                // Reset to first page
                this.currentPage = 1;
            },

            // Debounce filter
            debounceFilter() {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.filterSiswa();
                }, 300);
            },

            // Update active filters
            updateActiveFilters() {
                this.activeFilters = [];
                
                if (this.searchQuery) {
                    this.activeFilters.push({
                        type: 'search',
                        label: `Pencarian: "${this.searchQuery}"`
                    });
                }
                
                if (this.filterKelas) {
                    const kelas = this.kelasList.find(k => k.id_kelas === this.filterKelas);
                    if (kelas) {
                        this.activeFilters.push({
                            type: 'kelas',
                            label: `Kelas: ${kelas.nama_kelas}`
                        });
                    }
                }
                
                if (this.filterJenisKelamin) {
                    this.activeFilters.push({
                        type: 'jenis_kelamin',
                        label: `JK: ${this.filterJenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}`
                    });
                }
            },

            // Remove filter
            removeFilter(filter) {
                if (filter.type === 'search') {
                    this.searchQuery = '';
                } else if (filter.type === 'kelas') {
                    this.filterKelas = '';
                } else if (filter.type === 'jenis_kelamin') {
                    this.filterJenisKelamin = '';
                }
                this.filterSiswa();
            },

            // Clear all filters
            clearAllFilters() {
                this.searchQuery = '';
                this.filterKelas = '';
                this.filterJenisKelamin = '';
                this.filterSiswa();
            },

            // Update stats
            updateStats() {
                this.stats = {
                    totalSiswa: this.siswaList.length,
                    lakiLaki: this.siswaList.filter(s => s.jenis_kelamin === 'L').length,
                    perempuan: this.siswaList.filter(s => s.jenis_kelamin === 'P').length,
                    totalKelas: new Set(this.siswaList.map(s => s.id_kelas)).size
                };
            },

            // Get nama kelas
            getNamaKelas(id_kelas) {
                const kelas = this.kelasList.find(k => k.id_kelas === id_kelas);
                return kelas ? kelas.nama_kelas : '-';
            },

            // Pagination methods
            goToPage(page) {
                if (page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                }
            },

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

            updateItemsPerPage() {
                this.currentPage = 1;
            },

            // Modal methods
            openModal(siswa = null) {
                if (siswa) {
                    this.modalTitle = 'Edit Siswa';
                    this.form = { ...siswa };
                } else {
                    this.modalTitle = 'Tambah Siswa';
                    this.form = {
                        id_siswa: '',
                        nis: '',
                        nama: '',
                        id_kelas: '',
                        jenis_kelamin: 'L',
                        tempat_lahir: '',
                        tanggal_lahir: '',
                        alamat: '',
                        no_telp: '',
                        email: '',
                        nama_ayah: '',
                        nama_ibu: ''
                    };
                }
                this.showModal = true;
            },

            editSiswa(siswa) {
                this.openModal(siswa);
            },

            viewDetail(siswa) {
                this.selectedSiswa = siswa;
                this.showDetailModal = true;
            },

            confirmDelete(siswa) {
                this.selectedSiswa = siswa;
                this.showDeleteModal = true;
            },

            // Save siswa
            async saveSiswa() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    const result = await api.post('saveSiswa', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Data siswa disimpan');
                        this.showModal = false;
                        await Store.loadSiswa();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error saving siswa:', error);
                    app.showToast('error', 'Error', 'Gagal menyimpan data');
                } finally {
                    app.hideLoading();
                }
            },

            // Delete siswa
            async deleteSiswa() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deleteSiswa', { 
                        id_siswa: this.selectedSiswa.id_siswa 
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Siswa dihapus');
                        this.showDeleteModal = false;
                        await Store.loadSiswa();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error deleting siswa:', error);
                    app.showToast('error', 'Error', 'Gagal menghapus data');
                } finally {
                    app.hideLoading();
                }
            },

            // Import methods
            openImportModal() {
                this.showImportModal = true;
            },

            downloadTemplate() {
                // Buat template CSV
                const headers = ['NIS', 'Nama', 'Kelas', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'No Telp', 'Email', 'Nama Ayah', 'Nama Ibu'];
                const example = ['2024001', 'Ahmad Fauzi', 'KLS001', 'L', 'Jakarta', '2008-01-01', 'Jl. Contoh No. 1', '081234567890', 'ahmad@email.com', 'Budi', 'Siti'];
                
                const csv = [headers.join(','), example.join(',')].join('\n');
                
                // Download
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template_siswa.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            },

            handleFileUpload(event) {
                this.importFile = event.target.files[0];
            },

            async importSiswa() {
                if (!this.importFile) {
                    alert('Pilih file terlebih dahulu');
                    return;
                }

                const app = document.querySelector('[x-data="app"]').__x.$data;
                
                try {
                    // Baca file CSV
                    const text = await this.importFile.text();
                    const rows = text.split('\n');
                    const headers = rows[0].split(',');
                    
                    let success = 0;
                    let failed = 0;
                    
                    for (let i = 1; i < rows.length; i++) {
                        if (!rows[i].trim()) continue;
                        
                        const values = rows[i].split(',');
                        const data = {};
                        
                        headers.forEach((header, index) => {
                            data[header.trim()] = values[index]?.trim() || '';
                        });
                        
                        // Validasi minimal
                        if (data.NIS && data.Nama) {
                            try {
                                // Cari id_kelas berdasarkan nama kelas
                                const kelas = this.kelasList.find(k => 
                                    k.nama_kelas.toLowerCase() === data.Kelas?.toLowerCase()
                                );
                                
                                const siswaData = {
                                    nis: data.NIS,
                                    nama: data.Nama,
                                    id_kelas: kelas?.id_kelas || '',
                                    jenis_kelamin: data['Jenis Kelamin'] || 'L',
                                    tempat_lahir: data['Tempat Lahir'] || '',
                                    tanggal_lahir: data['Tanggal Lahir'] || '',
                                    alamat: data.Alamat || '',
                                    no_telp: data['No Telp'] || '',
                                    email: data.Email || '',
                                    nama_ayah: data['Nama Ayah'] || '',
                                    nama_ibu: data['Nama Ibu'] || ''
                                };
                                
                                const result = await api.post('saveSiswa', siswaData);
                                if (result.status === 'success') {
                                    success++;
                                } else {
                                    failed++;
                                }
                            } catch (e) {
                                failed++;
                            }
                        } else {
                            failed++;
                        }
                        
                        // Update progress
                        this.importProgress = Math.round((i / (rows.length - 1)) * 100);
                    }
                    
                    app.showToast('success', 'Import Selesai', `${success} berhasil, ${failed} gagal`);
                    this.showImportModal = false;
                    this.importProgress = 0;
                    await Store.loadSiswa();
                    
                } catch (error) {
                    console.error('Import error:', error);
                    app.showToast('error', 'Gagal', 'Error membaca file');
                }
            },

            // Export methods
            exportData() {
                const data = this.filteredSiswa.map(s => ({
                    'NIS': s.nis,
                    'Nama': s.nama,
                    'Kelas': this.getNamaKelas(s.id_kelas),
                    'Jenis Kelamin': s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                    'Tempat Lahir': s.tempat_lahir || '-',
                    'Tanggal Lahir': s.tanggal_lahir || '-',
                    'Alamat': s.alamat || '-',
                    'No Telp': s.no_telp || '-',
                    'Email': s.email || '-'
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `siswa_${new Date().toISOString().split('T')[0]}.csv`);
            },

            exportPDF(siswa) {
                // Untuk implementasi PDF, bisa menggunakan library seperti jsPDF
                alert('Fitur PDF akan segera hadir');
            },

            exportCard(siswa) {
                // Untuk implementasi kartu siswa
                alert('Fitur kartu siswa akan segera hadir');
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
window.SiswaComponent = SiswaComponent;

console.log('✅ Siswa Component loaded');