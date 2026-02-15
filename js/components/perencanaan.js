// js/components/perencanaan.js
const PerencanaanComponent = {
    template() {
        return `
            <div x-data="perencanaanComponent" x-init="init" class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Perencanaan Pembelajaran</h2>
                        <p class="text-sm text-slate-500 mt-1">Kelola CP, ATP, dan RPP Matematika</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <!-- Tombol Import -->
                        <button @click="openImportModal" 
                                class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-2">
                            <i class="fa-solid fa-file-import text-indigo-500"></i>
                            <span>Import</span>
                        </button>
                        
                        <!-- Tombol Tambah -->
                        <button x-show="$store.user?.role === 'ADMIN'" 
                                @click="openModal()"
                                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
                            <i class="fa-solid fa-plus"></i>
                            <span>Tambah Dokumen</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Total CP -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total CP</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalCP || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-bullseye"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total ATP -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total ATP</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalATP || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-road"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total RPP -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total RPP</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.totalRPP || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-file-lines"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Kelas -->
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
                                   placeholder="Cari berdasarkan judul, deskripsi..."
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                        </div>

                        <!-- Filter Jenis -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-tag mr-1 text-indigo-500"></i>
                                Jenis Dokumen
                            </label>
                            <select x-model="filterJenis" 
                                    @change="filterPerencanaan"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Jenis</option>
                                <option value="CP">CP (Capaian Pembelajaran)</option>
                                <option value="ATP">ATP (Alur Tujuan Pembelajaran)</option>
                                <option value="RPP">RPP (Rencana Pelaksanaan Pembelajaran)</option>
                            </select>
                        </div>

                        <!-- Filter Kelas -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-filter mr-1 text-indigo-500"></i>
                                Kelas
                            </label>
                            <select x-model="filterKelas" 
                                    @change="filterPerencanaan"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <!-- Quick Filter Buttons -->
                    <div class="mt-4 flex flex-wrap gap-2">
                        <button @click="quickFilter('all')" 
                                :class="{'bg-indigo-600 text-white': quickFilterActive === 'all'}"
                                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                            Semua
                        </button>
                        <button @click="quickFilter('CP')" 
                                :class="{'bg-blue-600 text-white': quickFilterActive === 'CP'}"
                                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                            <i class="fa-solid fa-bullseye mr-1"></i>CP
                        </button>
                        <button @click="quickFilter('ATP')" 
                                :class="{'bg-green-600 text-white': quickFilterActive === 'ATP'}"
                                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                            <i class="fa-solid fa-road mr-1"></i>ATP
                        </button>
                        <button @click="quickFilter('RPP')" 
                                :class="{'bg-purple-600 text-white': quickFilterActive === 'RPP'}"
                                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
                            <i class="fa-solid fa-file-lines mr-1"></i>RPP
                        </button>
                    </div>
                </div>

                <!-- Tabel Perencanaan -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Judul</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold" x-show="$store.user?.role === 'ADMIN'">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in paginatedPerencanaan" :key="item.id_dokumen">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="startIndex + index + 1"></td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-3 py-1 rounded-full text-xs font-semibold': true,
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': item.jenis === 'CP',
                                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': item.jenis === 'ATP',
                                                'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': item.jenis === 'RPP'
                                            }">
                                                <i :class="{
                                                    'fa-solid fa-bullseye': item.jenis === 'CP',
                                                    'fa-solid fa-road': item.jenis === 'ATP',
                                                    'fa-solid fa-file-lines': item.jenis === 'RPP'
                                                }" class="mr-1"></i>
                                                <span x-text="item.jenis"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div>
                                                <p class="font-medium" x-text="item.judul"></p>
                                                <p class="text-xs text-slate-500 mt-1" x-text="item.deskripsi ? item.deskripsi.substring(0, 50) + '...' : ''"></p>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs" 
                                                  x-text="getNamaKelas(item.kelas)"></span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center space-x-1 text-sm">
                                                <i class="fa-regular fa-calendar text-slate-400"></i>
                                                <span x-text="formatDate(item.tanggal)"></span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': isRecent(item.tanggal),
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': !isRecent(item.tanggal)
                                            }">
                                                <i :class="isRecent(item.tanggal) ? 'fa-solid fa-circle-check' : 'fa-regular fa-clock'" class="mr-1"></i>
                                                <span x-text="isRecent(item.tanggal) ? 'Terbaru' : 'Arsip'"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3" x-show="$store.user?.role === 'ADMIN'">
                                            <div class="flex space-x-2">
                                                <button @click="editPerencanaan(item)" 
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
                                                <button @click="downloadDokumen(item)" 
                                                        class="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                                        title="Download">
                                                    <i class="fa-solid fa-download"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <!-- Empty State -->
                                <tr x-show="filteredPerencanaan.length === 0">
                                    <td colspan="7" class="px-4 py-12 text-center text-slate-500">
                                        <i class="fa-solid fa-file-circle-exclamation text-5xl mb-3 opacity-50"></i>
                                        <p class="text-lg font-medium">Tidak ada dokumen</p>
                                        <p class="text-sm mt-2">Coba ubah filter atau tambah dokumen baru</p>
                                        <button x-show="$store.user?.role === 'ADMIN'"
                                                @click="openModal()" 
                                                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition inline-flex items-center space-x-2">
                                            <i class="fa-solid fa-plus"></i>
                                            <span>Tambah Dokumen</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredPerencanaan.length > 0" class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="text-sm text-slate-500">
                            Menampilkan <span class="font-semibold" x-text="startIndex + 1"></span> - 
                            <span class="font-semibold" x-text="Math.min(endIndex, filteredPerencanaan.length)"></span> 
                            dari <span class="font-semibold" x-text="filteredPerencanaan.length"></span> dokumen
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <button @click="prevPage" 
                                    :disabled="currentPage === 1"
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
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
                                    class="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Timeline View -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-timeline text-indigo-500 mr-2"></i>
                        Timeline Perencanaan
                    </h3>
                    
                    <div class="relative">
                        <!-- Timeline Line -->
                        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
                        
                        <!-- Timeline Items -->
                        <div class="space-y-4">
                            <template x-for="item in timelineData" :key="item.id_dokumen">
                                <div class="relative pl-12">
                                    <!-- Timeline Dot -->
                                    <div :class="{
                                        'absolute left-3 w-4 h-4 rounded-full border-4 -translate-x-1/2 mt-1.5': true,
                                        'border-blue-500 bg-blue-100': item.jenis === 'CP',
                                        'border-green-500 bg-green-100': item.jenis === 'ATP',
                                        'border-purple-500 bg-purple-100': item.jenis === 'RPP'
                                    }"></div>
                                    
                                    <!-- Content -->
                                    <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <span :class="{
                                                    'text-xs font-semibold px-2 py-1 rounded-full': true,
                                                    'bg-blue-100 text-blue-800': item.jenis === 'CP',
                                                    'bg-green-100 text-green-800': item.jenis === 'ATP',
                                                    'bg-purple-100 text-purple-800': item.jenis === 'RPP'
                                                }" x-text="item.jenis"></span>
                                                <h4 class="font-semibold mt-2" x-text="item.judul"></h4>
                                                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1" x-text="item.deskripsi"></p>
                                                <div class="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                                                    <span>
                                                        <i class="fa-regular fa-calendar mr-1"></i>
                                                        <span x-text="formatDate(item.tanggal)"></span>
                                                    </span>
                                                    <span>
                                                        <i class="fa-solid fa-chalkboard mr-1"></i>
                                                        <span x-text="getNamaKelas(item.kelas)"></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Modal Form Perencanaan -->
                <div x-show="showModal" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         @click.stop>
                        
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="savePerencanaan">
                            <div class="space-y-4">
                                <!-- Jenis Dokumen -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-tag mr-1 text-indigo-500"></i>
                                        Jenis Dokumen <span class="text-red-500">*</span>
                                    </label>
                                    <div class="grid grid-cols-3 gap-3">
                                        <label class="relative">
                                            <input type="radio" x-model="form.jenis" value="CP" class="sr-only">
                                            <div :class="{
                                                'border-2 p-4 rounded-xl text-center cursor-pointer transition': true,
                                                'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20': form.jenis === 'CP',
                                                'border-slate-300 dark:border-slate-600 hover:border-indigo-400': form.jenis !== 'CP'
                                            }">
                                                <i class="fa-solid fa-bullseye text-2xl text-blue-600 mb-2"></i>
                                                <p class="font-semibold">CP</p>
                                                <p class="text-xs text-slate-500">Capaian Pembelajaran</p>
                                            </div>
                                        </label>
                                        
                                        <label class="relative">
                                            <input type="radio" x-model="form.jenis" value="ATP" class="sr-only">
                                            <div :class="{
                                                'border-2 p-4 rounded-xl text-center cursor-pointer transition': true,
                                                'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20': form.jenis === 'ATP',
                                                'border-slate-300 dark:border-slate-600 hover:border-indigo-400': form.jenis !== 'ATP'
                                            }">
                                                <i class="fa-solid fa-road text-2xl text-green-600 mb-2"></i>
                                                <p class="font-semibold">ATP</p>
                                                <p class="text-xs text-slate-500">Alur Tujuan Pembelajaran</p>
                                            </div>
                                        </label>
                                        
                                        <label class="relative">
                                            <input type="radio" x-model="form.jenis" value="RPP" class="sr-only">
                                            <div :class="{
                                                'border-2 p-4 rounded-xl text-center cursor-pointer transition': true,
                                                'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20': form.jenis === 'RPP',
                                                'border-slate-300 dark:border-slate-600 hover:border-indigo-400': form.jenis !== 'RPP'
                                            }">
                                                <i class="fa-solid fa-file-lines text-2xl text-purple-600 mb-2"></i>
                                                <p class="font-semibold">RPP</p>
                                                <p class="text-xs text-slate-500">Rencana Pelaksanaan</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                <!-- Judul -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-heading mr-1 text-indigo-500"></i>
                                        Judul Dokumen <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.judul" 
                                           required
                                           placeholder="Contoh: Capaian Pembelajaran Matematika Fase E"
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
                                
                                <!-- Deskripsi -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-align-left mr-1 text-indigo-500"></i>
                                        Deskripsi
                                    </label>
                                    <textarea x-model="form.deskripsi" 
                                              rows="4"
                                              placeholder="Deskripsi lengkap dokumen..."
                                              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition"></textarea>
                                </div>
                                
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
                                
                                <!-- File Upload -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-file-pdf mr-1 text-indigo-500"></i>
                                        File Dokumen
                                    </label>
                                    <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-indigo-500 transition cursor-pointer"
                                         @click="$refs.fileInput.click()"
                                         @dragover.prevent
                                         @drop.prevent="handleFileDrop">
                                        <input type="file" 
                                               x-ref="fileInput"
                                               @change="handleFileSelect"
                                               accept=".pdf,.doc,.docx,.xls,.xlsx"
                                               class="hidden">
                                        <template x-if="!form.file">
                                            <>
                                                <i class="fa-solid fa-cloud-upload-alt text-4xl text-slate-400 mb-3"></i>
                                                <p class="text-slate-600 dark:text-slate-400">Klik atau drag file ke sini</p>
                                                <p class="text-xs text-slate-400 mt-2">PDF, DOC, XLS (Max 10MB)</p>
                                            </>
                                        </template>
                                        <template x-if="form.file">
                                            <div class="flex items-center justify-center space-x-2">
                                                <i class="fa-solid fa-file-pdf text-2xl text-red-500"></i>
                                                <span class="font-medium" x-text="form.file.name"></span>
                                                <button @click.stop="form.file = null" class="text-red-500 hover:text-red-700">
                                                    <i class="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                
                                <!-- Tags -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-tags mr-1 text-indigo-500"></i>
                                        Tags
                                    </label>
                                    <div class="flex flex-wrap gap-2 mb-2">
                                        <template x-for="(tag, index) in form.tags" :key="index">
                                            <span class="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                                                <span x-text="tag"></span>
                                                <button @click="removeTag(index)" type="button" class="ml-2 hover:text-indigo-600">
                                                    <i class="fa-solid fa-times"></i>
                                                </button>
                                            </span>
                                        </template>
                                    </div>
                                    <div class="flex space-x-2">
                                        <input type="text" 
                                               x-model="newTag"
                                               @keyup.enter="addTag"
                                               placeholder="Tambah tag..."
                                               class="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                        <button @click="addTag" type="button" 
                                                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
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

                <!-- Modal Detail Perencanaan -->
                <div x-show="showDetailModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showDetailModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold">Detail Dokumen</h3>
                            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedDokumen">
                            <div class="space-y-6">
                                <!-- Header Info -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-4">
                                        <div :class="{
                                            'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl': true,
                                            'bg-blue-600': selectedDokumen.jenis === 'CP',
                                            'bg-green-600': selectedDokumen.jenis === 'ATP',
                                            'bg-purple-600': selectedDokumen.jenis === 'RPP'
                                        }">
                                            <i :class="{
                                                'fa-solid fa-bullseye': selectedDokumen.jenis === 'CP',
                                                'fa-solid fa-road': selectedDokumen.jenis === 'ATP',
                                                'fa-solid fa-file-lines': selectedDokumen.jenis === 'RPP'
                                            }"></i>
                                        </div>
                                        <div>
                                            <span :class="{
                                                'px-3 py-1 rounded-full text-sm font-semibold': true,
                                                'bg-blue-100 text-blue-800': selectedDokumen.jenis === 'CP',
                                                'bg-green-100 text-green-800': selectedDokumen.jenis === 'ATP',
                                                'bg-purple-100 text-purple-800': selectedDokumen.jenis === 'RPP'
                                            }" x-text="selectedDokumen.jenis"></span>
                                            <h4 class="text-2xl font-bold mt-2" x-text="selectedDokumen.judul"></h4>
                                        </div>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button @click="downloadDokumen(selectedDokumen)" 
                                                class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center space-x-2">
                                            <i class="fa-solid fa-download"></i>
                                            <span>Download</span>
                                        </button>
                                        <button x-show="$store.user?.role === 'ADMIN'"
                                                @click="editFromDetail" 
                                                class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center space-x-2">
                                            <i class="fa-solid fa-edit"></i>
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Info Grid -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">ID Dokumen</p>
                                        <p class="font-mono font-semibold" x-text="selectedDokumen.id_dokumen"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Kelas</p>
                                        <p class="font-semibold" x-text="getNamaKelas(selectedDokumen.kelas)"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Tanggal</p>
                                        <p class="font-semibold" x-text="formatDate(selectedDokumen.tanggal)"></p>
                                    </div>
                                </div>
                                
                                <!-- Deskripsi -->
                                <div>
                                    <h5 class="font-semibold mb-2">Deskripsi</h5>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl whitespace-pre-wrap" 
                                         x-text="selectedDokumen.deskripsi || 'Tidak ada deskripsi'"></div>
                                </div>
                                
                                <!-- Tags -->
                                <div x-show="selectedDokumen.tags?.length">
                                    <h5 class="font-semibold mb-2">Tags</h5>
                                    <div class="flex flex-wrap gap-2">
                                        <template x-for="tag in selectedDokumen.tags" :key="tag">
                                            <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                                                <i class="fa-solid fa-tag mr-1"></i>
                                                <span x-text="tag"></span>
                                            </span>
                                        </template>
                                    </div>
                                </div>
                                
                                <!-- File Preview -->
                                <div x-show="selectedDokumen.file_url">
                                    <h5 class="font-semibold mb-2">File Dokumen</h5>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <iframe :src="selectedDokumen.file_url" class="w-full h-96 rounded-xl"></iframe>
                                    </div>
                                </div>
                                
                                <!-- Metadata -->
                                <div class="text-xs text-slate-400 border-t pt-4">
                                    <p>Dibuat: <span x-text="selectedDokumen.created_at || '-'"></span></p>
                                    <p>Diupdate: <span x-text="selectedDokumen.updated_at || '-'"></span></p>
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
                                <i class="fa-solid fa-triangle-exclamation text-3xl text-red-600"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Hapus Dokumen</h3>
                            <p class="text-slate-500 mb-2">
                                Apakah Anda yakin ingin menghapus dokumen:
                            </p>
                            <p class="font-semibold text-lg mb-1" x-text="selectedDokumen?.judul"></p>
                            <p class="text-sm text-slate-400 mb-6" x-text="selectedDokumen?.jenis"></p>
                            
                            <div class="flex justify-center space-x-3">
                                <button type="button" 
                                        @click="showDeleteModal = false" 
                                        class="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button @click="deletePerencanaan" 
                                        class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg flex items-center space-x-2">
                                    <i class="fa-solid fa-trash"></i>
                                    <span>Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Import -->
                <div x-show="showImportModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showImportModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold">Import Dokumen</h3>
                            <button @click="showImportModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Template Download -->
                            <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <p class="text-sm mb-2">Download template Excel:</p>
                                <div class="flex space-x-2">
                                    <a href="#" @click.prevent="downloadTemplate('cp')" 
                                       class="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-2">
                                        <i class="fa-solid fa-download"></i>
                                        <span>Template CP</span>
                                    </a>
                                    <a href="#" @click.prevent="downloadTemplate('atp')" 
                                       class="text-green-600 hover:text-green-800 text-sm flex items-center space-x-2">
                                        <i class="fa-solid fa-download"></i>
                                        <span>ATP</span>
                                    </a>
                                    <a href="#" @click.prevent="downloadTemplate('rpp')" 
                                       class="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-2">
                                        <i class="fa-solid fa-download"></i>
                                        <span>RPP</span>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- File Upload -->
                            <div>
                                <label class="block text-sm font-medium mb-2">
                                    Pilih file Excel
                                </label>
                                <input type="file" 
                                       @change="handleImportFile" 
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
                            
                            <!-- Import Result -->
                            <div x-show="importResult" class="p-4 bg-green-100 text-green-800 rounded-xl text-sm">
                                <p class="font-semibold">Import Selesai!</p>
                                <p>Berhasil: <span x-text="importResult?.success || 0"></span></p>
                                <p>Gagal: <span x-text="importResult?.failed || 0"></span></p>
                            </div>
                            
                            <!-- Import Actions -->
                            <div class="flex justify-end space-x-3 pt-4">
                                <button type="button" 
                                        @click="showImportModal = false" 
                                        class="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                                    Tutup
                                </button>
                                <button @click="importDokumen" 
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
            perencanaanList: [],
            kelasList: [],
            filteredPerencanaan: [],
            
            // Filters
            searchQuery: '',
            filterJenis: '',
            filterKelas: '',
            quickFilterActive: 'all',
            searchTimeout: null,
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            
            // Stats
            stats: {
                totalCP: 0,
                totalATP: 0,
                totalRPP: 0,
                totalKelas: 0
            },
            
            // Timeline
            timelineData: [],
            
            // Modal states
            showModal: false,
            showDetailModal: false,
            showDeleteModal: false,
            showImportModal: false,
            modalTitle: 'Tambah Dokumen',
            
            // Form
            form: {
                id_dokumen: '',
                jenis: 'CP',
                judul: '',
                kelas: '',
                deskripsi: '',
                tanggal: new Date().toISOString().split('T')[0],
                file: null,
                tags: []
            },
            newTag: '',
            
            // Selected data
            selectedDokumen: null,
            
            // Import
            importFile: null,
            importProgress: 0,
            importResult: null,
            
            // Computed
            get startIndex() {
                return (this.currentPage - 1) * this.itemsPerPage;
            },
            
            get endIndex() {
                return this.startIndex + this.itemsPerPage;
            },
            
            get paginatedPerencanaan() {
                return this.filteredPerencanaan.slice(this.startIndex, this.endIndex);
            },
            
            get totalPages() {
                return Math.ceil(this.filteredPerencanaan.length / this.itemsPerPage);
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
                console.log('📝 Perencanaan Component initialized');
                
                // Subscribe ke store
                Store.subscribe('perencanaan', (data) => {
                    this.perencanaanList = data || [];
                    this.filterPerencanaan();
                    this.updateStats();
                    this.updateTimeline();
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
                app.showLoading('Memuat data perencanaan...');
                
                try {
                    await Promise.all([
                        Store.loadKelas(),
                        Store.loadPerencanaan()
                    ]);
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data');
                } finally {
                    app.hideLoading();
                }
            },

            // Filter methods
            filterPerencanaan() {
                let filtered = [...this.perencanaanList];
                
                // Filter by search
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    filtered = filtered.filter(p => 
                        p.judul?.toLowerCase().includes(query) ||
                        p.deskripsi?.toLowerCase().includes(query) ||
                        p.jenis?.toLowerCase().includes(query)
                    );
                }
                
                // Filter by jenis
                if (this.filterJenis) {
                    filtered = filtered.filter(p => p.jenis === this.filterJenis);
                }
                
                // Filter by kelas
                if (this.filterKelas) {
                    filtered = filtered.filter(p => p.kelas === this.filterKelas);
                }
                
                this.filteredPerencanaan = filtered;
                this.currentPage = 1;
            },

            debounceFilter() {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.filterPerencanaan();
                }, 300);
            },

            quickFilter(jenis) {
                this.quickFilterActive = jenis;
                if (jenis === 'all') {
                    this.filterJenis = '';
                } else {
                    this.filterJenis = jenis;
                }
                this.filterPerencanaan();
            },

            // Stats
            updateStats() {
                this.stats = {
                    totalCP: this.perencanaanList.filter(p => p.jenis === 'CP').length,
                    totalATP: this.perencanaanList.filter(p => p.jenis === 'ATP').length,
                    totalRPP: this.perencanaanList.filter(p => p.jenis === 'RPP').length,
                    totalKelas: new Set(this.perencanaanList.map(p => p.kelas)).size
                };
            },

            // Timeline
            updateTimeline() {
                this.timelineData = [...this.perencanaanList]
                    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                    .slice(0, 10);
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

            isRecent(date) {
                if (!date) return false;
                const docDate = new Date(date);
                const now = new Date();
                const diffTime = Math.abs(now - docDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
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

            // Modal methods
            openModal(dokumen = null) {
                if (dokumen) {
                    this.modalTitle = 'Edit Dokumen';
                    this.form = { 
                        ...dokumen,
                        tags: dokumen.tags || []
                    };
                } else {
                    this.modalTitle = 'Tambah Dokumen';
                    this.form = {
                        id_dokumen: '',
                        jenis: 'CP',
                        judul: '',
                        kelas: '',
                        deskripsi: '',
                        tanggal: new Date().toISOString().split('T')[0],
                        file: null,
                        tags: []
                    };
                }
                this.showModal = true;
            },

            editPerencanaan(dokumen) {
                this.openModal(dokumen);
            },

            editFromDetail() {
                this.showDetailModal = false;
                this.openModal(this.selectedDokumen);
            },

            viewDetail(dokumen) {
                this.selectedDokumen = dokumen;
                this.showDetailModal = true;
            },

            confirmDelete(dokumen) {
                this.selectedDokumen = dokumen;
                this.showDeleteModal = true;
            },

            // Tags
            addTag() {
                if (this.newTag && !this.form.tags.includes(this.newTag)) {
                    this.form.tags.push(this.newTag);
                    this.newTag = '';
                }
            },

            removeTag(index) {
                this.form.tags.splice(index, 1);
            },

            // File handling
            handleFileSelect(event) {
                this.form.file = event.target.files[0];
            },

            handleFileDrop(event) {
                this.form.file = event.dataTransfer.files[0];
            },

            // Save
            async savePerencanaan() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    // Jika ada file, upload dulu
                    if (this.form.file) {
                        // Implement file upload if needed
                        // const uploadResult = await api.upload('uploadDokumen', this.form.file);
                        // this.form.file_url = uploadResult.url;
                    }
                    
                    const result = await api.post('savePerencanaan', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Dokumen disimpan');
                        this.showModal = false;
                        await Store.loadPerencanaan();
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
            async deletePerencanaan() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deletePerencanaan', { 
                        id_dokumen: this.selectedDokumen.id_dokumen 
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Dokumen dihapus');
                        this.showDeleteModal = false;
                        await Store.loadPerencanaan();
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

            // Download
            downloadDokumen(dokumen) {
                // Implement download logic
                alert('Fitur download akan segera hadir');
            },

            // Import methods
            openImportModal() {
                this.showImportModal = true;
                this.importResult = null;
                this.importProgress = 0;
            },

            downloadTemplate(jenis) {
                let headers, example;
                
                if (jenis === 'cp') {
                    headers = ['Judul', 'Kelas', 'Deskripsi', 'Tanggal', 'Tags'];
                    example = ['CP Matematika Fase E', 'KLS001', 'Capaian Pembelajaran Matematika', '2024-01-01', 'matematika,fase e'];
                } else if (jenis === 'atp') {
                    headers = ['Judul', 'Kelas', 'Deskripsi', 'Tanggal', 'Tags'];
                    example = ['ATP Matematika Semester 1', 'KLS001', 'Alur Tujuan Pembelajaran', '2024-01-01', 'atp,semester 1'];
                } else {
                    headers = ['Judul', 'Kelas', 'Deskripsi', 'Tanggal', 'Tags'];
                    example = ['RPP Limit Fungsi', 'KLS001', 'RPP Pertemuan 1-3', '2024-01-01', 'limit fungsi,rpp'];
                }
                
                const csv = [headers.join(','), example.join(',')].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `template_${jenis}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            },

            handleImportFile(event) {
                this.importFile = event.target.files[0];
            },

            async importDokumen() {
                if (!this.importFile) {
                    alert('Pilih file terlebih dahulu');
                    return;
                }

                const app = document.querySelector('[x-data="app"]').__x.$data;
                
                try {
                    const text = await this.importFile.text();
                    const rows = text.split('\n');
                    const headers = rows[0].split(',');
                    
                    let success = 0;
                    let failed = 0;
                    
                    for (let i = 1; i < rows.length; i++) {
                        if (!rows[i].trim()) continue;
                        
                        const values = rows[i].split(',');
                        const data = {
                            jenis: this.quickFilterActive !== 'all' ? this.quickFilterActive : 'CP',
                            tags: []
                        };
                        
                        headers.forEach((header, index) => {
                            const value = values[index]?.trim() || '';
                            if (header === 'Tags') {
                                data.tags = value.split(' ').filter(t => t);
                            } else if (header === 'Kelas') {
                                const kelas = this.kelasList.find(k => 
                                    k.nama_kelas.toLowerCase() === value.toLowerCase()
                                );
                                data.kelas = kelas?.id_kelas || '';
                            } else {
                                data[header.toLowerCase()] = value;
                            }
                        });
                        
                        if (data.judul && data.kelas) {
                            try {
                                const result = await api.post('savePerencanaan', data);
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
                        
                        this.importProgress = Math.round((i / (rows.length - 1)) * 100);
                    }
                    
                    this.importResult = { success, failed };
                    app.showToast('success', 'Import Selesai', `${success} berhasil, ${failed} gagal`);
                    
                    setTimeout(() => {
                        this.showImportModal = false;
                        this.importProgress = 0;
                        Store.loadPerencanaan();
                    }, 2000);
                    
                } catch (error) {
                    console.error('Import error:', error);
                    app.showToast('error', 'Gagal', 'Error membaca file');
                }
            },

            // Export
            exportData() {
                const data = this.filteredPerencanaan.map(p => ({
                    'Jenis': p.jenis,
                    'Judul': p.judul,
                    'Kelas': this.getNamaKelas(p.kelas),
                    'Deskripsi': p.deskripsi,
                    'Tanggal': p.tanggal,
                    'Tags': p.tags?.join(', ') || ''
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `perencanaan_${new Date().toISOString().split('T')[0]}.csv`);
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
window.PerencanaanComponent = PerencanaanComponent;

console.log('✅ Perencanaan Component loaded');