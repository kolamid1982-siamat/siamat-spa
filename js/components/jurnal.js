// js/components/jurnal.js
const JurnalComponent = {
    template() {
        return `
            <div x-data="jurnalComponent" x-init="init" class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Jurnal Mengajar</h2>
                        <p class="text-sm text-slate-500 mt-1">Catatan kegiatan pembelajaran harian</p>
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
                            <span>Tambah Jurnal</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Jurnal</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.total || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-book-open"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Minggu Ini</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.thisWeek || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-calendar-week"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Bulan Ini</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.thisMonth || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-calendar"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Kelas</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalKelas || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600">
                                <i class="fa-solid fa-chalkboard"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Search -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-search mr-1 text-indigo-500"></i>
                                Pencarian
                            </label>
                            <input type="text" 
                                   x-model="searchQuery"
                                   @input="debounceFilter"
                                   placeholder="Cari materi, catatan..."
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                        </div>

                        <!-- Filter Kelas -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-filter mr-1 text-indigo-500"></i>
                                Kelas
                            </label>
                            <select x-model="filterKelas" 
                                    @change="filterJurnal"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Filter Tanggal -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-regular fa-calendar mr-1 text-indigo-500"></i>
                                Periode
                            </label>
                            <select x-model="filterPeriode" 
                                    @change="filterJurnal"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="all">Semua Waktu</option>
                                <option value="today">Hari Ini</option>
                                <option value="week">Minggu Ini</option>
                                <option value="month">Bulan Ini</option>
                                <option value="custom">Kustom</option>
                            </select>
                        </div>
                    </div>

                    <!-- Custom Date Range -->
                    <div x-show="filterPeriode === 'custom'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Dari Tanggal</label>
                            <input type="date" x-model="startDate" @change="filterJurnal"
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Sampai Tanggal</label>
                            <input type="date" x-model="endDate" @change="filterJurnal"
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                        </div>
                    </div>
                </div>

                <!-- Tabel Jurnal -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Materi</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Catatan</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Dokumen</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold" x-show="$store.user?.role === 'ADMIN'">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in paginatedJurnal" :key="item.id_jurnal">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="startIndex + index + 1"></td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center space-x-2">
                                                <i class="fa-regular fa-calendar text-slate-400"></i>
                                                <span x-text="formatDate(item.tanggal)"></span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold"
                                                  x-text="getNamaKelas(item.kelas)"></span>
                                        </td>
                                        <td class="px-4 py-3 font-medium" x-text="item.materi"></td>
                                        <td class="px-4 py-3">
                                            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2" x-text="item.catatan || '-'"></p>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <div x-show="item.dokumen" class="flex justify-center space-x-2">
                                                <a :href="item.dokumen" target="_blank" 
                                                   class="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded-lg transition"
                                                   title="Lihat Dokumen">
                                                    <i class="fa-solid fa-file-pdf text-lg"></i>
                                                </a>
                                            </div>
                                            <span x-show="!item.dokumen" class="text-slate-400">-</span>
                                        </td>
                                        <td class="px-4 py-3" x-show="$store.user?.role === 'ADMIN'">
                                            <div class="flex space-x-2">
                                                <button @click="editJurnal(item)" 
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
                                <tr x-show="filteredJurnal.length === 0">
                                    <td colspan="7" class="px-4 py-12 text-center text-slate-500">
                                        <i class="fa-solid fa-book-open text-5xl mb-3 opacity-50"></i>
                                        <p class="text-lg font-medium">Tidak ada jurnal</p>
                                        <p class="text-sm mt-2">Coba ubah filter atau tambah jurnal baru</p>
                                        <button x-show="$store.user?.role === 'ADMIN'"
                                                @click="openModal()" 
                                                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition inline-flex items-center space-x-2">
                                            <i class="fa-solid fa-plus"></i>
                                            <span>Tambah Jurnal</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredJurnal.length > 0" class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="text-sm text-slate-500" x-text="paginationInfo"></div>
                        
                        <div class="flex items-center space-x-2">
                            <button @click="prevPage" 
                                    :disabled="currentPage === 1"
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
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
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <select x-model="itemsPerPage" @change="updateItemsPerPage" 
                                class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                            <option value="5">5 per halaman</option>
                            <option value="10">10 per halaman</option>
                            <option value="25">25 per halaman</option>
                            <option value="50">50 per halaman</option>
                        </select>
                    </div>
                </div>

                <!-- Calendar View -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-calendar-alt text-indigo-500 mr-2"></i>
                        Kalender Jurnal
                    </h3>
                    
                    <div class="grid grid-cols-7 gap-1 text-center">
                        <!-- Day headers -->
                        <template x-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="day">
                            <div class="text-sm font-semibold py-2" x-text="day"></div>
                        </template>
                        
                        <!-- Calendar days -->
                        <template x-for="week in calendarWeeks" :key="week">
                            <template x-for="day in week" :key="day.date">
                                <div @click="selectDate(day.date)"
                                     class="p-2 rounded-lg cursor-pointer transition relative"
                                     :class="{
                                        'bg-indigo-100 dark:bg-indigo-900/30': day.hasJurnal,
                                        'hover:bg-slate-100 dark:hover:bg-slate-700': !day.hasJurnal,
                                        'text-slate-400': !day.isCurrentMonth
                                     }">
                                    <span x-text="day.day"></span>
                                    <span x-show="day.hasJurnal" 
                                          class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>

                <!-- Modal Form Jurnal -->
                <div x-show="showModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="saveJurnal">
                            <div class="space-y-4">
                                <!-- Tanggal -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-regular fa-calendar mr-1 text-indigo-500"></i>
                                        Tanggal <span class="text-red-500">*</span>
                                    </label>
                                    <input type="date" 
                                           x-model="form.tanggal" 
                                           required
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Kelas -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-chalkboard mr-1 text-indigo-500"></i>
                                        Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <select x-model="form.kelas" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                        <option value="">Pilih Kelas</option>
                                        <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                            <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                        </template>
                                    </select>
                                </div>
                                
                                <!-- Materi -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-heading mr-1 text-indigo-500"></i>
                                        Materi Pembelajaran <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.materi" 
                                           required
                                           placeholder="Contoh: Limit Fungsi Trigonometri"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Catatan -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-pen mr-1 text-indigo-500"></i>
                                        Catatan Pembelajaran
                                    </label>
                                    <textarea x-model="form.catatan" 
                                              rows="4"
                                              placeholder="Deskripsi kegiatan pembelajaran, kendala, dan catatan penting lainnya..."
                                              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition"></textarea>
                                </div>
                                
                                <!-- Upload Dokumen -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-paperclip mr-1 text-indigo-500"></i>
                                        Lampiran Dokumen
                                    </label>
                                    <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-indigo-500 transition cursor-pointer"
                                         @click="$refs.fileInput.click()"
                                         @dragover.prevent
                                         @drop.prevent="handleFileDrop">
                                        <input type="file" 
                                               x-ref="fileInput"
                                               @change="handleFileSelect"
                                               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                               class="hidden">
                                        <template x-if="!form.file">
                                            <>
                                                <i class="fa-solid fa-cloud-upload-alt text-4xl text-slate-400 mb-3"></i>
                                                <p class="text-slate-600 dark:text-slate-400">Klik atau drag file ke sini</p>
                                                <p class="text-xs text-slate-400 mt-2">PDF, DOC, JPG (Max 10MB)</p>
                                            </>
                                        </template>
                                        <template x-if="form.file">
                                            <div class="flex items-center justify-center space-x-2">
                                                <i class="fa-solid fa-file text-2xl text-indigo-500"></i>
                                                <span class="font-medium" x-text="form.file.name"></span>
                                                <button @click.stop="form.file = null" class="text-red-500 hover:text-red-700">
                                                    <i class="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                
                                <!-- Tujuan Pembelajaran -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-bullseye mr-1 text-indigo-500"></i>
                                        Tujuan Pembelajaran
                                    </label>
                                    <textarea x-model="form.tujuan" 
                                              rows="3"
                                              placeholder="Tujuan pembelajaran yang ingin dicapai..."
                                              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition"></textarea>
                                </div>
                                
                                <!-- Metode Pembelajaran -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-chalkboard-user mr-1 text-indigo-500"></i>
                                        Metode Pembelajaran
                                    </label>
                                    <select x-model="form.metode" 
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                        <option value="">Pilih Metode</option>
                                        <option value="ceramah">Ceramah</option>
                                        <option value="diskusi">Diskusi Kelompok</option>
                                        <option value="praktikum">Praktikum</option>
                                        <option value="presentasi">Presentasi</option>
                                        <option value="problem-based">Problem Based Learning</option>
                                        <option value="project-based">Project Based Learning</option>
                                        <option value="cooperative">Cooperative Learning</option>
                                    </select>
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

                <!-- Modal Detail Jurnal -->
                <div x-show="showDetailModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showDetailModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold">Detail Jurnal</h3>
                            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedJurnal">
                            <div class="space-y-6">
                                <!-- Header Info -->
                                <div class="flex items-center space-x-4">
                                    <div class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                                        <i class="fa-solid fa-book-open"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-2xl font-bold" x-text="selectedJurnal.materi"></h4>
                                        <div class="flex items-center space-x-4 mt-2 text-slate-500">
                                            <span><i class="fa-regular fa-calendar mr-1"></i><span x-text="formatDate(selectedJurnal.tanggal)"></span></span>
                                            <span><i class="fa-solid fa-chalkboard mr-1"></i><span x-text="getNamaKelas(selectedJurnal.kelas)"></span></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Info Grid -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">ID Jurnal</p>
                                        <p class="font-mono font-semibold" x-text="selectedJurnal.id_jurnal"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Metode</p>
                                        <p class="font-semibold capitalize" x-text="selectedJurnal.metode || '-'"></p>
                                    </div>
                                </div>
                                
                                <!-- Tujuan Pembelajaran -->
                                <div x-show="selectedJurnal.tujuan">
                                    <h5 class="font-semibold mb-2">Tujuan Pembelajaran</h5>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl whitespace-pre-wrap" 
                                         x-text="selectedJurnal.tujuan"></div>
                                </div>
                                
                                <!-- Catatan -->
                                <div>
                                    <h5 class="font-semibold mb-2">Catatan Pembelajaran</h5>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl whitespace-pre-wrap" 
                                         x-text="selectedJurnal.catatan || 'Tidak ada catatan'"></div>
                                </div>
                                
                                <!-- Dokumen -->
                                <div x-show="selectedJurnal.dokumen">
                                    <h5 class="font-semibold mb-2">Dokumen Lampiran</h5>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <a :href="selectedJurnal.dokumen" target="_blank" 
                                           class="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2">
                                            <i class="fa-solid fa-file-pdf text-2xl"></i>
                                            <span>Lihat Dokumen</span>
                                        </a>
                                    </div>
                                </div>
                                
                                <!-- Metadata -->
                                <div class="text-xs text-slate-400 border-t pt-4">
                                    <p>Dibuat: <span x-text="selectedJurnal.created_at || '-'"></span></p>
                                    <p>Diupdate: <span x-text="selectedJurnal.updated_at || '-'"></span></p>
                                </div>
                                
                                <!-- Actions -->
                                <div x-show="$store.user?.role === 'ADMIN'" class="flex justify-end space-x-3 pt-4 border-t">
                                    <button @click="editFromDetail" 
                                            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center space-x-2">
                                        <i class="fa-solid fa-edit"></i>
                                        <span>Edit</span>
                                    </button>
                                    <button @click="printJurnal" 
                                            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center space-x-2">
                                        <i class="fa-solid fa-print"></i>
                                        <span>Print</span>
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
                                <i class="fa-solid fa-trash-can text-3xl text-red-600"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Hapus Jurnal</h3>
                            <p class="text-slate-500 mb-2">
                                Apakah Anda yakin ingin menghapus jurnal:
                            </p>
                            <p class="font-semibold text-lg mb-1" x-text="selectedJurnal?.materi"></p>
                            <p class="text-sm text-slate-400 mb-6" x-text="formatDate(selectedJurnal?.tanggal)"></p>
                            
                            <div class="flex justify-center space-x-3">
                                <button type="button" 
                                        @click="showDeleteModal = false" 
                                        class="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button @click="deleteJurnal" 
                                        class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg flex items-center space-x-2">
                                    <i class="fa-solid fa-trash"></i>
                                    <span>Hapus</span>
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
            jurnalList: [],
            kelasList: [],
            filteredJurnal: [],
            
            // Filters
            searchQuery: '',
            filterKelas: '',
            filterPeriode: 'all',
            startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            searchTimeout: null,
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            
            // Stats
            stats: {
                total: 0,
                thisWeek: 0,
                thisMonth: 0,
                totalKelas: 0
            },
            
            // Calendar
            calendarWeeks: [],
            selectedDate: null,
            
            // Modal states
            showModal: false,
            showDetailModal: false,
            showDeleteModal: false,
            showImportModal: false,
            modalTitle: 'Tambah Jurnal',
            
            // Form
            form: {
                id_jurnal: '',
                tanggal: new Date().toISOString().split('T')[0],
                kelas: '',
                materi: '',
                catatan: '',
                tujuan: '',
                metode: '',
                file: null
            },
            
            // Selected data
            selectedJurnal: null,
            
            // Import
            importFile: null,
            importProgress: 0,
            
            // Computed
            get startIndex() {
                return (this.currentPage - 1) * this.itemsPerPage;
            },
            
            get endIndex() {
                return this.startIndex + this.itemsPerPage;
            },
            
            get paginatedJurnal() {
                return this.filteredJurnal.slice(this.startIndex, this.endIndex);
            },
            
            get totalPages() {
                return Math.ceil(this.filteredJurnal.length / this.itemsPerPage);
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
            
            get paginationInfo() {
                const start = this.startIndex + 1;
                const end = Math.min(this.endIndex, this.filteredJurnal.length);
                return `Menampilkan ${start} - ${end} dari ${this.filteredJurnal.length} jurnal`;
            },

            // Init
            init() {
                console.log('📖 Jurnal Component initialized');
                
                // Subscribe ke store
                Store.subscribe('jurnal', (data) => {
                    this.jurnalList = data || [];
                    this.filterJurnal();
                    this.updateStats();
                    this.generateCalendar();
                });
                
                Store.subscribe('kelas', (kelas) => {
                    this.kelasList = kelas || [];
                });
                
                // Load data
                this.loadData();
            },

            // Load data
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data jurnal...');
                
                try {
                    await Promise.all([
                        Store.loadKelas(),
                        Store.loadJurnal()
                    ]);
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data');
                } finally {
                    app.hideLoading();
                }
            },

            // Filter methods
            filterJurnal() {
                let filtered = [...this.jurnalList];
                
                // Filter by search
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    filtered = filtered.filter(j => 
                        j.materi?.toLowerCase().includes(query) ||
                        j.catatan?.toLowerCase().includes(query) ||
                        j.tujuan?.toLowerCase().includes(query)
                    );
                }
                
                // Filter by kelas
                if (this.filterKelas) {
                    filtered = filtered.filter(j => j.kelas === this.filterKelas);
                }
                
                // Filter by periode
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
                
                if (this.filterPeriode === 'today') {
                    filtered = filtered.filter(j => j.tanggal === today);
                } else if (this.filterPeriode === 'week') {
                    filtered = filtered.filter(j => j.tanggal >= weekAgo);
                } else if (this.filterPeriode === 'month') {
                    filtered = filtered.filter(j => j.tanggal >= monthAgo);
                } else if (this.filterPeriode === 'custom' && this.startDate && this.endDate) {
                    filtered = filtered.filter(j => 
                        j.tanggal >= this.startDate && j.tanggal <= this.endDate
                    );
                }
                
                // Sort by date desc
                filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                
                this.filteredJurnal = filtered;
                this.currentPage = 1;
            },

            debounceFilter() {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.filterJurnal();
                }, 300);
            },

            // Update stats
            updateStats() {
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
                
                this.stats = {
                    total: this.jurnalList.length,
                    thisWeek: this.jurnalList.filter(j => j.tanggal >= weekAgo).length,
                    thisMonth: this.jurnalList.filter(j => j.tanggal >= monthAgo).length,
                    totalKelas: new Set(this.jurnalList.map(j => j.kelas)).size
                };
            },

            // Calendar methods
            generateCalendar() {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth();
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                
                const startDate = new Date(firstDay);
                startDate.setDate(firstDay.getDate() - firstDay.getDay());
                
                const weeks = [];
                let week = [];
                
                for (let d = new Date(startDate); d <= lastDay || week.length > 0; d.setDate(d.getDate() + 1)) {
                    if (week.length === 7) {
                        weeks.push(week);
                        week = [];
                    }
                    
                    const dateStr = d.toISOString().split('T')[0];
                    const hasJurnal = this.jurnalList.some(j => j.tanggal === dateStr);
                    const isCurrentMonth = d.getMonth() === month;
                    
                    week.push({
                        date: dateStr,
                        day: d.getDate(),
                        hasJurnal,
                        isCurrentMonth
                    });
                }
                
                if (week.length > 0) {
                    weeks.push(week);
                }
                
                this.calendarWeeks = weeks;
            },

            selectDate(date) {
                this.selectedDate = date;
                this.filterPeriode = 'custom';
                this.startDate = date;
                this.endDate = date;
                this.filterJurnal();
            },

            // Helper methods
            getNamaKelas(id_kelas) {
                const kelas = this.kelasList.find(k => k.id_kelas === id_kelas);
                return kelas ? kelas.nama_kelas : '-';
            },

            formatDate(date) {
                if (!date) return '-';
                return new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            },

            // Pagination
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
            openModal(jurnal = null) {
                if (jurnal) {
                    this.modalTitle = 'Edit Jurnal';
                    this.form = { ...jurnal };
                } else {
                    this.modalTitle = 'Tambah Jurnal';
                    this.form = {
                        id_jurnal: '',
                        tanggal: new Date().toISOString().split('T')[0],
                        kelas: '',
                        materi: '',
                        catatan: '',
                        tujuan: '',
                        metode: '',
                        file: null
                    };
                }
                this.showModal = true;
            },

            editJurnal(jurnal) {
                this.openModal(jurnal);
            },

            editFromDetail() {
                this.showDetailModal = false;
                this.openModal(this.selectedJurnal);
            },

            viewDetail(jurnal) {
                this.selectedJurnal = jurnal;
                this.showDetailModal = true;
            },

            confirmDelete(jurnal) {
                this.selectedJurnal = jurnal;
                this.showDeleteModal = true;
            },

            // File handling
            handleFileSelect(event) {
                this.form.file = event.target.files[0];
            },

            handleFileDrop(event) {
                this.form.file = event.dataTransfer.files[0];
            },

            // Save
            async saveJurnal() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    const result = await api.post('saveJurnal', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Jurnal disimpan');
                        this.showModal = false;
                        await Store.loadJurnal();
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
            async deleteJurnal() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deleteJurnal', { 
                        id_jurnal: this.selectedJurnal.id_jurnal 
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Jurnal dihapus');
                        this.showDeleteModal = false;
                        await Store.loadJurnal();
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

            // Print
            printJurnal() {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Jurnal - ${this.selectedJurnal.materi}</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 40px; }
                                h1 { color: #4f46e5; }
                                .info { margin: 20px 0; }
                                .label { font-weight: bold; color: #666; }
                            </style>
                        </head>
                        <body>
                            <h1>Jurnal Pembelajaran</h1>
                            <div class="info">
                                <p><span class="label">Tanggal:</span> ${this.formatDate(this.selectedJurnal.tanggal)}</p>
                                <p><span class="label">Kelas:</span> ${this.getNamaKelas(this.selectedJurnal.kelas)}</p>
                                <p><span class="label">Materi:</span> ${this.selectedJurnal.materi}</p>
                                <p><span class="label">Tujuan:</span> ${this.selectedJurnal.tujuan || '-'}</p>
                                <p><span class="label">Metode:</span> ${this.selectedJurnal.metode || '-'}</p>
                                <p><span class="label">Catatan:</span> ${this.selectedJurnal.catatan || '-'}</p>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            },

            // Export
            exportData() {
                const data = this.filteredJurnal.map(j => ({
                    'Tanggal': j.tanggal,
                    'Kelas': this.getNamaKelas(j.kelas),
                    'Materi': j.materi,
                    'Tujuan': j.tujuan || '',
                    'Metode': j.metode || '',
                    'Catatan': j.catatan || ''
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `jurnal_${new Date().toISOString().split('T')[0]}.csv`);
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
window.JurnalComponent = JurnalComponent;

console.log('✅ Jurnal Component loaded');