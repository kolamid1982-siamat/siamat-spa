// js/components/users.js
const UsersComponent = {
    template() {
        return `
            <div x-data="usersComponent" x-init="init" class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Manajemen Users</h2>
                        <p class="text-sm text-slate-500 mt-1">Kelola hak akses pengguna sistem</p>
                    </div>
                    
                    <!-- Tombol Aksi -->
                    <div class="flex items-center space-x-3">
                        <button @click="exportData" 
                                class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-2">
                            <i class="fa-solid fa-download text-green-500"></i>
                            <span>Export</span>
                        </button>
                        <button @click="openModal()"
                                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
                            <i class="fa-solid fa-user-plus"></i>
                            <span>Tambah User</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Total Users -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Users</p>
                                <p class="text-2xl font-bold mt-1" x-text="stats.total || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Admin -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Admin</p>
                                <p class="text-2xl font-bold mt-1 text-purple-600" x-text="stats.admin || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-crown"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Tamu -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Tamu</p>
                                <p class="text-2xl font-bold mt-1 text-green-600" x-text="stats.tamu || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-user"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Aktif -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Aktif</p>
                                <p class="text-2xl font-bold mt-1 text-blue-600" x-text="stats.aktif || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Search -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-search mr-1 text-indigo-500"></i>
                                Pencarian
                            </label>
                            <input type="text" 
                                   x-model="searchQuery"
                                   @input="debounceFilter"
                                   placeholder="Cari berdasarkan nama atau username..."
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                        </div>

                        <!-- Filter Role -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-filter mr-1 text-indigo-500"></i>
                                Role
                            </label>
                            <select x-model="filterRole" 
                                    @change="filterUsers"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Semua Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="TAMU">Tamu</option>
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

                <!-- Tabel Users -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Username</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Role</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Terakhir Login</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in paginatedUsers" :key="item.id">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="startIndex + index + 1"></td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center space-x-3">
                                                <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                    <span x-text="item.nama?.charAt(0).toUpperCase()"></span>
                                                </div>
                                                <span class="font-medium" x-text="item.nama"></span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 font-mono text-sm" x-text="item.username"></td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-3 py-1 rounded-full text-xs font-semibold': true,
                                                'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': item.role === 'ADMIN',
                                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': item.role === 'TAMU'
                                            }">
                                                <i :class="item.role === 'ADMIN' ? 'fa-solid fa-crown' : 'fa-solid fa-user'" class="mr-1"></i>
                                                <span x-text="item.role"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-green-100 text-green-800': item.status === 'aktif',
                                                'bg-red-100 text-red-800': item.status === 'nonaktif'
                                            }">
                                                <i :class="item.status === 'aktif' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-stop'" class="mr-1"></i>
                                                <span x-text="item.status || 'aktif'"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm text-slate-500" x-text="item.last_login || '-'"></td>
                                        <td class="px-4 py-3">
                                            <div class="flex space-x-2">
                                                <button @click="editUser(item)" 
                                                        class="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                                                        title="Edit">
                                                    <i class="fa-solid fa-edit"></i>
                                                </button>
                                                <button @click="confirmResetPassword(item)" 
                                                        class="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
                                                        title="Reset Password">
                                                    <i class="fa-solid fa-key"></i>
                                                </button>
                                                <button @click="confirmToggleStatus(item)" 
                                                        class="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                        title="Ubah Status">
                                                    <i :class="item.status === 'aktif' ? 'fa-solid fa-ban' : 'fa-solid fa-check-circle'"></i>
                                                </button>
                                                <button @click="viewActivity(item)" 
                                                        class="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                                        title="Lihat Aktivitas">
                                                    <i class="fa-solid fa-chart-line"></i>
                                                </button>
                                                <button @click="confirmDelete(item)" 
                                                        class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                        title="Hapus">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <!-- Empty State -->
                                <tr x-show="filteredUsers.length === 0">
                                    <td colspan="7" class="px-4 py-12 text-center text-slate-500">
                                        <i class="fa-solid fa-users-slash text-5xl mb-3 opacity-50"></i>
                                        <p class="text-lg font-medium">Tidak ada data user</p>
                                        <p class="text-sm mt-2">Coba ubah filter atau tambah user baru</p>
                                        <button @click="openModal()" 
                                                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition inline-flex items-center space-x-2">
                                            <i class="fa-solid fa-plus"></i>
                                            <span>Tambah User</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div x-show="filteredUsers.length > 0" class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

                <!-- Modal Form User -->
                <div x-show="showModal" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         @click.stop>
                        
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold" x-text="modalTitle"></h3>
                            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form @submit.prevent="saveUser">
                            <div class="space-y-4">
                                <!-- Nama Lengkap -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-user mr-1 text-indigo-500"></i>
                                        Nama Lengkap <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.nama" 
                                           required
                                           placeholder="Contoh: John Doe"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                </div>
                                
                                <!-- Username -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-at mr-1 text-indigo-500"></i>
                                        Username <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" 
                                           x-model="form.username" 
                                           @input="validateUsernameField"
                                           required
                                           placeholder="Contoh: johndoe"
                                           class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                    <p x-show="usernameError" class="text-xs text-red-500 mt-1" x-text="usernameError"></p>
                                </div>
                                
                                <!-- Password -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-lock mr-1 text-indigo-500"></i>
                                        Password <span x-show="!form.id" class="text-red-500">*</span>
                                        <span x-show="form.id" class="text-xs text-slate-500 ml-2">(Kosongkan jika tidak diubah)</span>
                                    </label>
                                    <div class="relative">
                                        <input :type="showPassword ? 'text' : 'password'" 
                                               x-model="form.password"
                                               :required="!form.id"
                                               class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition pr-10">
                                        <button type="button" 
                                                @click="showPassword = !showPassword"
                                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-500">
                                            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                                        </button>
                                    </div>
                                    <button type="button" 
                                            @click="generateRandomPassword"
                                            class="text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                                        <i class="fa-solid fa-rotate"></i> Generate Password
                                    </button>
                                </div>
                                
                                <!-- Role -->
                                <div>
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-tag mr-1 text-indigo-500"></i>
                                        Role <span class="text-red-500">*</span>
                                    </label>
                                    <select x-model="form.role" required
                                            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                        <option value="ADMIN">Admin</option>
                                        <option value="TAMU">Tamu</option>
                                    </select>
                                </div>
                                
                                <!-- Status -->
                                <div x-show="form.id">
                                    <label class="block text-sm font-medium mb-2">
                                        <i class="fa-solid fa-circle-check mr-1 text-indigo-500"></i>
                                        Status
                                    </label>
                                    <div class="flex space-x-4">
                                        <label class="flex items-center space-x-2">
                                            <input type="radio" x-model="form.status" value="aktif" class="text-indigo-600">
                                            <span>Aktif</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="radio" x-model="form.status" value="nonaktif" class="text-red-600">
                                            <span>Nonaktif</span>
                                        </label>
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

                <!-- Modal Reset Password -->
                <div x-show="showResetModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showResetModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold">Reset Password</h3>
                            <button @click="showResetModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedUser">
                            <div class="space-y-4">
                                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <p class="text-sm text-slate-500">User</p>
                                    <p class="font-semibold" x-text="selectedUser.nama"></p>
                                    <p class="text-sm text-slate-500 mt-1" x-text="selectedUser.username"></p>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Password Baru</label>
                                    <div class="relative">
                                        <input type="text" 
                                               x-model="newPassword"
                                               readonly
                                               class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 font-mono">
                                        <button @click="copyPassword" 
                                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800">
                                            <i class="fa-regular fa-copy"></i>
                                        </button>
                                    </div>
                                    <p class="text-xs text-slate-500 mt-2">Password telah digenerate otomatis</p>
                                </div>
                                
                                <div class="flex space-x-2">
                                    <button @click="generateNewPassword" 
                                            class="flex-1 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                                        <i class="fa-solid fa-rotate"></i> Generate Ulang
                                    </button>
                                    <button @click="copyPassword" 
                                            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                                        <i class="fa-regular fa-copy"></i> Salin
                                    </button>
                                </div>
                                
                                <div class="flex justify-end space-x-3 pt-4">
                                    <button type="button" 
                                            @click="showResetModal = false" 
                                            class="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                                        Tutup
                                    </button>
                                    <button @click="resetPassword" 
                                            class="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition">
                                        Reset Password
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
                                <i class="fa-solid fa-user-slash text-3xl text-red-600"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2">Hapus User</h3>
                            <p class="text-slate-500 mb-2">
                                Apakah Anda yakin ingin menghapus user:
                            </p>
                            <p class="font-semibold text-lg mb-1" x-text="selectedUser?.nama"></p>
                            <p class="text-sm text-slate-400 mb-6" x-text="selectedUser?.username"></p>
                            
                            <p class="text-xs text-red-500 mb-4">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                Tindakan ini tidak dapat dibatalkan!
                            </p>
                            
                            <div class="flex justify-center space-x-3">
                                <button type="button" 
                                        @click="showDeleteModal = false" 
                                        class="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    Batal
                                </button>
                                <button @click="deleteUser" 
                                        class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg flex items-center space-x-2">
                                    <i class="fa-solid fa-trash"></i>
                                    <span>Hapus</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Aktivitas User -->
                <div x-show="showActivityModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showActivityModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold">Aktivitas User</h3>
                            <button @click="showActivityModal = false" class="text-slate-400 hover:text-slate-600">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedUser">
                            <div class="space-y-4">
                                <!-- Info User -->
                                <div class="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <div class="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                        <span x-text="selectedUser.nama?.charAt(0).toUpperCase()"></span>
                                    </div>
                                    <div>
                                        <h4 class="font-bold" x-text="selectedUser.nama"></h4>
                                        <p class="text-sm text-slate-500" x-text="selectedUser.username"></p>
                                    </div>
                                </div>
                                
                                <!-- Statistik -->
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
                                        <p class="text-2xl font-bold text-indigo-600" x-text="selectedUser.activity?.loginCount || 0"></p>
                                        <p class="text-xs text-slate-500">Total Login</p>
                                    </div>
                                    <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
                                        <p class="text-2xl font-bold text-green-600" x-text="formatDate(selectedUser.last_login) || '-'"></p>
                                        <p class="text-xs text-slate-500">Terakhir Login</p>
                                    </div>
                                    <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
                                        <p class="text-2xl font-bold text-purple-600" x-text="selectedUser.activity?.ipAddress || '-'"></p>
                                        <p class="text-xs text-slate-500">IP Address</p>
                                    </div>
                                </div>
                                
                                <!-- Riwayat Login -->
                                <div>
                                    <h5 class="font-semibold mb-3">Riwayat Login</h5>
                                    <div class="space-y-2 max-h-60 overflow-y-auto">
                                        <template x-for="(log, index) in selectedUser.activity?.logs || []" :key="index">
                                            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <div class="flex items-center space-x-3">
                                                    <i class="fa-solid fa-circle-check text-green-500"></i>
                                                    <span x-text="log.waktu"></span>
                                                </div>
                                                <span class="text-sm text-slate-500" x-text="log.ip"></span>
                                            </div>
                                        </template>
                                        <p x-show="!selectedUser.activity?.logs?.length" class="text-center text-slate-500 py-4">
                                            Belum ada riwayat login
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- Export Aktivitas -->
                                <div class="flex justify-end pt-4">
                                    <button @click="exportActivity" 
                                            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                                        <i class="fa-solid fa-download mr-2"></i>
                                        Export Aktivitas
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        `;
    },

    component() {
        return {
            // Data
            usersList: [],
            filteredUsers: [],
            
            // Filters
            searchQuery: '',
            filterRole: '',
            searchTimeout: null,
            activeFilters: [],
            
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
            
            // Stats
            stats: {
                total: 0,
                admin: 0,
                tamu: 0,
                aktif: 0
            },
            
            // Modal states
            showModal: false,
            showResetModal: false,
            showDeleteModal: false,
            showActivityModal: false,
            modalTitle: 'Tambah User',
            
            // Form
            form: {
                id: '',
                nama: '',
                username: '',
                password: '',
                role: 'TAMU',
                status: 'aktif'
            },
            showPassword: false,
            usernameError: '',
            
            // Selected
            selectedUser: null,
            newPassword: '',
            
            // Computed
            get startIndex() {
                return (this.currentPage - 1) * this.itemsPerPage;
            },
            
            get endIndex() {
                return this.startIndex + this.itemsPerPage;
            },
            
            get paginatedUsers() {
                return this.filteredUsers.slice(this.startIndex, this.endIndex);
            },
            
            get totalPages() {
                return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
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
                const end = Math.min(this.endIndex, this.filteredUsers.length);
                return `Menampilkan ${start} - ${end} dari ${this.filteredUsers.length} user`;
            },

            // Init
            init() {
                console.log('👥 Users Component initialized');
                
                // Subscribe ke store
                Store.subscribe('users', (users) => {
                    this.usersList = users || [];
                    this.filterUsers();
                    this.updateStats();
                });
                
                // Load data
                this.loadData();
            },

            // Load data
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data users...');
                
                try {
                    await this.loadUsers();
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data users');
                } finally {
                    app.hideLoading();
                }
            },

            async loadUsers() {
                const result = await api.get('getUsers');
                if (result.status === 'success') {
                    // Tambah data dummy untuk demo
                    this.usersList = result.data.map(u => ({
                        ...u,
                        status: u.status || 'aktif',
                        last_login: u.last_login || this.getRandomDate(),
                        activity: {
                            loginCount: Math.floor(Math.random() * 50) + 10,
                            ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
                            logs: this.generateLoginLogs()
                        }
                    }));
                    this.filterUsers();
                    this.updateStats();
                }
            },

            getRandomDate() {
                const dates = [
                    '2024-01-15 08:30',
                    '2024-01-14 17:20',
                    '2024-01-14 08:15',
                    '2024-01-13 09:00',
                    '2024-01-12 10:30'
                ];
                return dates[Math.floor(Math.random() * dates.length)];
            },

            generateLoginLogs() {
                const logs = [];
                const count = Math.floor(Math.random() * 5) + 3;
                for (let i = 0; i < count; i++) {
                    logs.push({
                        waktu: this.getRandomDate(),
                        ip: '192.168.1.' + Math.floor(Math.random() * 255)
                    });
                }
                return logs.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
            },

            // Filter methods
            filterUsers() {
                let filtered = [...this.usersList];
                
                // Filter by search
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    filtered = filtered.filter(u => 
                        u.nama?.toLowerCase().includes(query) ||
                        u.username?.toLowerCase().includes(query)
                    );
                }
                
                // Filter by role
                if (this.filterRole) {
                    filtered = filtered.filter(u => u.role === this.filterRole);
                }
                
                this.filteredUsers = filtered;
                this.updateActiveFilters();
                this.currentPage = 1;
            },

            debounceFilter() {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.filterUsers();
                }, 300);
            },

            updateActiveFilters() {
                this.activeFilters = [];
                
                if (this.searchQuery) {
                    this.activeFilters.push({
                        type: 'search',
                        label: `Pencarian: "${this.searchQuery}"`
                    });
                }
                
                if (this.filterRole) {
                    this.activeFilters.push({
                        type: 'role',
                        label: `Role: ${this.filterRole}`
                    });
                }
            },

            removeFilter(filter) {
                if (filter.type === 'search') {
                    this.searchQuery = '';
                } else if (filter.type === 'role') {
                    this.filterRole = '';
                }
                this.filterUsers();
            },

            clearAllFilters() {
                this.searchQuery = '';
                this.filterRole = '';
                this.filterUsers();
            },

            // Update stats
            updateStats() {
                this.stats = {
                    total: this.usersList.length,
                    admin: this.usersList.filter(u => u.role === 'ADMIN').length,
                    tamu: this.usersList.filter(u => u.role === 'TAMU').length,
                    aktif: this.usersList.filter(u => u.status === 'aktif').length
                };
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
            openModal(user = null) {
                if (user) {
                    this.modalTitle = 'Edit User';
                    this.form = { 
                        ...user,
                        password: '' // Jangan tampilkan password
                    };
                } else {
                    this.modalTitle = 'Tambah User';
                    this.form = {
                        id: '',
                        nama: '',
                        username: '',
                        password: this.generatePassword(8),
                        role: 'TAMU',
                        status: 'aktif'
                    };
                }
                this.usernameError = '';
                this.showModal = true;
            },

            editUser(user) {
                this.openModal(user);
            },

            confirmResetPassword(user) {
                this.selectedUser = user;
                this.generateNewPassword();
                this.showResetModal = true;
            },

            confirmToggleStatus(user) {
                this.selectedUser = user;
                const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
                if (confirm(`Ubah status ${user.nama} menjadi ${newStatus}?`)) {
                    this.toggleUserStatus(user, newStatus);
                }
            },

            confirmDelete(user) {
                this.selectedUser = user;
                this.showDeleteModal = true;
            },

            viewActivity(user) {
                this.selectedUser = user;
                this.showActivityModal = true;
            },

            // Form validation
            validateUsernameField() {
                if (!this.form.username) {
                    this.usernameError = 'Username harus diisi';
                    return false;
                }
                
                if (!this.validateUsername(this.form.username)) {
                    this.usernameError = 'Username hanya boleh huruf, angka, dan underscore';
                    return false;
                }
                
                if (!this.checkUsernameAvailability(this.form.username)) {
                    this.usernameError = 'Username sudah digunakan';
                    return false;
                }
                
                this.usernameError = '';
                return true;
            },

            validateUsername(username) {
                const regex = /^[a-zA-Z0-9_]+$/;
                return regex.test(username);
            },

            checkUsernameAvailability(username) {
                // Cek apakah username sudah digunakan (kecuali user sendiri)
                return !this.usersList.some(u => 
                    u.username.toLowerCase() === username.toLowerCase() && 
                    u.id !== this.form.id
                );
            },

            // Password functions
            generatePassword(length = 8) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
                let password = '';
                for (let i = 0; i < length; i++) {
                    password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return password;
            },

            generateRandomPassword() {
                this.form.password = this.generatePassword(8);
            },

            generateNewPassword() {
                this.newPassword = this.generatePassword(8);
            },

            copyPassword() {
                navigator.clipboard.writeText(this.newPassword).then(() => {
                    alert('Password berhasil disalin ke clipboard');
                });
            },

            // User operations
            async saveUser() {
                // Validasi
                if (!this.validateUsernameField()) {
                    return;
                }
                
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan...');
                
                try {
                    const result = await api.post('saveUser', this.form);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'User disimpan');
                        this.showModal = false;
                        await this.loadUsers();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error saving user:', error);
                    app.showToast('error', 'Error', 'Gagal menyimpan user');
                } finally {
                    app.hideLoading();
                }
            },

            async resetPassword() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Mereset password...');
                
                try {
                    // Update user dengan password baru
                    const userData = {
                        id: this.selectedUser.id,
                        nama: this.selectedUser.nama,
                        username: this.selectedUser.username,
                        password: this.newPassword,
                        role: this.selectedUser.role,
                        status: this.selectedUser.status
                    };
                    
                    const result = await api.post('saveUser', userData);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Password berhasil direset');
                        this.showResetModal = false;
                        
                        // Tampilkan password di alert untuk disalin
                        setTimeout(() => {
                            alert(`Password baru untuk ${this.selectedUser.nama}:\n\n${this.newPassword}\n\nSilakan simpan password ini.`);
                        }, 500);
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error resetting password:', error);
                    app.showToast('error', 'Error', 'Gagal mereset password');
                } finally {
                    app.hideLoading();
                }
            },

            async toggleUserStatus(user, newStatus) {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Mengubah status...');
                
                try {
                    const userData = {
                        id: user.id,
                        nama: user.nama,
                        username: user.username,
                        role: user.role,
                        status: newStatus
                        // Password tidak disertakan agar tidak berubah
                    };
                    
                    const result = await api.post('saveUser', userData);
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', `Status user diubah menjadi ${newStatus}`);
                        await this.loadUsers();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error toggling user status:', error);
                    app.showToast('error', 'Error', 'Gagal mengubah status');
                } finally {
                    app.hideLoading();
                }
            },

            async deleteUser() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menghapus...');
                
                try {
                    const result = await api.post('deleteUser', { 
                        id: this.selectedUser.id 
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'User dihapus');
                        this.showDeleteModal = false;
                        await this.loadUsers();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    app.showToast('error', 'Error', 'Gagal menghapus user');
                } finally {
                    app.hideLoading();
                }
            },

            // Export functions
            exportData() {
                const data = this.filteredUsers.map(u => ({
                    'Nama': u.nama,
                    'Username': u.username,
                    'Role': u.role,
                    'Status': u.status || 'aktif',
                    'Terakhir Login': u.last_login || '-',
                    'Total Login': u.activity?.loginCount || 0
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `users_${new Date().toISOString().split('T')[0]}.csv`);
            },

            exportActivity() {
                if (!this.selectedUser) return;
                
                const data = (this.selectedUser.activity?.logs || []).map(log => ({
                    'Waktu': log.waktu,
                    'IP Address': log.ip
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `aktivitas_${this.selectedUser.username}_${new Date().toISOString().split('T')[0]}.csv`);
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
            },

            // Helper functions
            formatDate(date) {
                if (!date) return '-';
                return date;
            }
        };
    }
};

// Register component
window.UsersComponent = UsersComponent;

console.log('✅ Users Component loaded');