// js/components/absensi.js
const AbsensiComponent = {
    template() {
        return `
            <div x-data="absensiComponent" x-init="init" class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">Absensi Siswa</h2>
                        <p class="text-sm text-slate-500 mt-1">Rekapitulasi kehadiran siswa per kelas</p>
                    </div>
                    
                    <!-- Tombol Export -->
                    <div class="flex items-center space-x-3">
                        <button @click="exportRekap" 
                                class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-2">
                            <i class="fa-solid fa-download text-green-500"></i>
                            <span>Export Rekap</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <!-- Total Hadir -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Hadir</p>
                                <p class="text-2xl font-bold mt-1 text-green-600" x-text="stats.hadir || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                <i class="fa-solid fa-check-circle"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Sakit -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Sakit</p>
                                <p class="text-2xl font-bold mt-1 text-yellow-600" x-text="stats.sakit || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600">
                                <i class="fa-solid fa-face-frown"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Izin -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Izin</p>
                                <p class="text-2xl font-bold mt-1 text-blue-600" x-text="stats.izin || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-file-pen"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Alfa -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Alfa</p>
                                <p class="text-2xl font-bold mt-1 text-red-600" x-text="stats.alfa || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600">
                                <i class="fa-solid fa-times-circle"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Siswa -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-slate-500">Total Siswa</p>
                                <p class="text-2xl font-bold mt-1 text-indigo-600" x-text="stats.totalSiswa || 0"></p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Absensi -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Pilih Tanggal -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-regular fa-calendar mr-1 text-indigo-500"></i>
                                Tanggal
                            </label>
                            <input type="date" 
                                   x-model="form.tanggal"
                                   :max="today"
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                        </div>

                        <!-- Pilih Kelas -->
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                <i class="fa-solid fa-chalkboard mr-1 text-indigo-500"></i>
                                Kelas
                            </label>
                            <select x-model="form.id_kelas" 
                                    @change="loadSiswaByKelas"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">Pilih Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Tombol Aksi -->
                        <div class="flex items-end space-x-2">
                            <button @click="loadExistingAbsensi" 
                                    class="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center space-x-2">
                                <i class="fa-solid fa-rotate"></i>
                                <span>Load Data</span>
                            </button>
                            <button @click="setAllHadir" 
                                    class="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition">
                                Semua Hadir
                            </button>
                            <button x-show="form.id_kelas && form.tanggal && $store.user?.role === 'ADMIN'"
                                    @click="saveAbsensi"
                                    class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center space-x-2">
                                <i class="fa-solid fa-save"></i>
                                <span>Simpan</span>
                            </button>
                        </div>
                    </div>

                    <!-- Info Kelas -->
                    <template x-if="selectedKelas">
                        <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-slate-500">Kelas: <span class="font-semibold text-slate-700 dark:text-slate-300" x-text="selectedKelas.nama_kelas"></span></p>
                                    <p class="text-sm text-slate-500">Tahun Ajaran: <span class="font-semibold" x-text="selectedKelas.tahun_ajaran"></span></p>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-500">Jumlah Siswa: <span class="font-semibold text-indigo-600" x-text="siswaList.length"></span></p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Tabel Absensi -->
                <div x-show="siswaList.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <!-- Legend -->
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="text-sm font-medium">Status:</span>
                        <span class="flex items-center space-x-1"><span class="w-3 h-3 bg-green-500 rounded-full"></span><span class="text-sm">Hadir (H)</span></span>
                        <span class="flex items-center space-x-1"><span class="w-3 h-3 bg-yellow-500 rounded-full"></span><span class="text-sm">Sakit (S)</span></span>
                        <span class="flex items-center space-x-1"><span class="w-3 h-3 bg-blue-500 rounded-full"></span><span class="text-sm">Izin (I)</span></span>
                        <span class="flex items-center space-x-1"><span class="w-3 h-3 bg-red-500 rounded-full"></span><span class="text-sm">Alfa (A)</span></span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">No</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">NIS</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Nama Siswa</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Jenis Kelamin</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(siswa, index) in siswaList" :key="siswa.id_siswa">
                                    <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td class="px-4 py-3" x-text="index + 1"></td>
                                        <td class="px-4 py-3 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400" x-text="siswa.nis"></td>
                                        <td class="px-4 py-3 font-medium" x-text="siswa.nama"></td>
                                        <td class="px-4 py-3">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': siswa.jenis_kelamin === 'L',
                                                'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300': siswa.jenis_kelamin === 'P'
                                            }">
                                                <i :class="siswa.jenis_kelamin === 'L' ? 'fa-solid fa-mars' : 'fa-solid fa-venus'" class="mr-1"></i>
                                                <span x-text="siswa.jenis_kelamin === 'L' ? 'L' : 'P'"></span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center justify-center space-x-2">
                                                <!-- Status Buttons -->
                                                <button @click="setStatus(siswa.id_siswa, 'H')"
                                                        :class="{
                                                            'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2': absensiData[siswa.id_siswa]?.status === 'H',
                                                            'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400': absensiData[siswa.id_siswa]?.status !== 'H'
                                                        }"
                                                        class="w-8 h-8 rounded-lg transition font-semibold"
                                                        title="Hadir">
                                                    H
                                                </button>
                                                <button @click="setStatus(siswa.id_siswa, 'S')"
                                                        :class="{
                                                            'bg-yellow-600 text-white ring-2 ring-yellow-600 ring-offset-2': absensiData[siswa.id_siswa]?.status === 'S',
                                                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400': absensiData[siswa.id_siswa]?.status !== 'S'
                                                        }"
                                                        class="w-8 h-8 rounded-lg transition font-semibold"
                                                        title="Sakit">
                                                    S
                                                </button>
                                                <button @click="setStatus(siswa.id_siswa, 'I')"
                                                        :class="{
                                                            'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2': absensiData[siswa.id_siswa]?.status === 'I',
                                                            'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400': absensiData[siswa.id_siswa]?.status !== 'I'
                                                        }"
                                                        class="w-8 h-8 rounded-lg transition font-semibold"
                                                        title="Izin">
                                                    I
                                                </button>
                                                <button @click="setStatus(siswa.id_siswa, 'A')"
                                                        :class="{
                                                            'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2': absensiData[siswa.id_siswa]?.status === 'A',
                                                            'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400': absensiData[siswa.id_siswa]?.status !== 'A'
                                                        }"
                                                        class="w-8 h-8 rounded-lg transition font-semibold"
                                                        title="Alfa">
                                                    A
                                                </button>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <input type="text" 
                                                   x-model="absensiData[siswa.id_siswa].keterangan"
                                                   placeholder="Catatan (opsional)"
                                                   class="w-full px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 transition text-sm">
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Summary -->
                    <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div class="grid grid-cols-5 gap-4 text-center">
                            <div>
                                <p class="text-sm text-slate-500">Hadir</p>
                                <p class="text-xl font-bold text-green-600" x-text="summary.hadir"></p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500">Sakit</p>
                                <p class="text-xl font-bold text-yellow-600" x-text="summary.sakit"></p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500">Izin</p>
                                <p class="text-xl font-bold text-blue-600" x-text="summary.izin"></p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500">Alfa</p>
                                <p class="text-xl font-bold text-red-600" x-text="summary.alfa"></p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-500">Terisi</p>
                                <p class="text-xl font-bold text-indigo-600" x-text="summary.terisi + '/' + siswaList.length"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rekap Absensi -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-chart-simple text-indigo-500 mr-2"></i>
                        Rekapitulasi Absensi 7 Hari Terakhir
                    </h3>

                    <!-- Filter Rekap -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Kelas</label>
                            <select x-model="rekapFilter.kelas" 
                                    @change="loadRekap"
                                    class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                                <option value="">Semua Kelas</option>
                                <template x-for="kelas in kelasList" :key="kelas.id_kelas">
                                    <option :value="kelas.id_kelas" x-text="kelas.nama_kelas"></option>
                                </template>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Dari Tanggal</label>
                            <input type="date" x-model="rekapFilter.startDate" @change="loadRekap"
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Sampai Tanggal</label>
                            <input type="date" x-model="rekapFilter.endDate" @change="loadRekap"
                                   class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                        </div>
                    </div>

                    <!-- Tabel Rekap -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                    <th class="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Hadir</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Sakit</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Izin</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Alfa</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">Total</th>
                                    <th class="px-4 py-3 text-center text-sm font-semibold">% Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template x-for="(item, index) in rekapData" :key="index">
                                    <tr class="border-t border-slate-200 dark:border-slate-700">
                                        <td class="px-4 py-3" x-text="formatDate(item.tanggal)"></td>
                                        <td class="px-4 py-3" x-text="item.kelas"></td>
                                        <td class="px-4 py-3 text-center text-green-600 font-semibold" x-text="item.hadir"></td>
                                        <td class="px-4 py-3 text-center text-yellow-600 font-semibold" x-text="item.sakit"></td>
                                        <td class="px-4 py-3 text-center text-blue-600 font-semibold" x-text="item.izin"></td>
                                        <td class="px-4 py-3 text-center text-red-600 font-semibold" x-text="item.alfa"></td>
                                        <td class="px-4 py-3 text-center font-semibold" x-text="item.total"></td>
                                        <td class="px-4 py-3 text-center">
                                            <span :class="{
                                                'px-2 py-1 rounded-lg text-xs font-semibold': true,
                                                'bg-green-100 text-green-800': item.persentase >= 90,
                                                'bg-yellow-100 text-yellow-800': item.persentase >= 75 && item.persentase < 90,
                                                'bg-red-100 text-red-800': item.persentase < 75
                                            }" x-text="item.persentase + '%'"></span>
                                        </td>
                                    </tr>
                                </template>
                                <tr x-show="rekapData.length === 0">
                                    <td colspan="8" class="px-4 py-8 text-center text-slate-500">
                                        <i class="fa-solid fa-chart-line text-4xl mb-3 opacity-50"></i>
                                        <p>Belum ada data rekap</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Grafik Kehadiran -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-5 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fa-solid fa-chart-line text-indigo-500 mr-2"></i>
                        Grafik Kehadiran Bulan Ini
                    </h3>
                    
                    <div class="h-64 flex items-end justify-around">
                        <template x-for="(data, index) in chartData" :key="index">
                            <div class="flex flex-col items-center w-12">
                                <div class="w-full bg-green-100 dark:bg-green-900/30 rounded-t-lg relative group">
                                    <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                        Hadir: <span x-text="data.hadir"></span>
                                    </div>
                                    <div class="bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                                         :style="'height: ' + (data.hadir / data.total * 100) + 'px'"></div>
                                </div>
                                <span class="text-xs mt-2" x-text="data.tanggal"></span>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Modal Detail Absensi -->
                <div x-show="showDetailModal" 
                     x-transition
                     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                     @click.self="showDetailModal = false">
                    
                    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 py-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold">Detail Absensi</h3>
                            <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <i class="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <template x-if="selectedAbsensi">
                            <div class="space-y-6">
                                <!-- Info -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Tanggal</p>
                                        <p class="font-semibold" x-text="formatDate(selectedAbsensi.tanggal)"></p>
                                    </div>
                                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p class="text-sm text-slate-500">Kelas</p>
                                        <p class="font-semibold" x-text="selectedAbsensi.kelas"></p>
                                    </div>
                                </div>
                                
                                <!-- Daftar Siswa -->
                                <div>
                                    <h4 class="font-semibold mb-3">Daftar Kehadiran</h4>
                                    <div class="space-y-2 max-h-60 overflow-y-auto">
                                        <template x-for="siswa in selectedAbsensi.detail" :key="siswa.id_siswa">
                                            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <div>
                                                    <p class="font-medium" x-text="siswa.nama"></p>
                                                    <p class="text-xs text-slate-500" x-text="siswa.nis"></p>
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    <span :class="{
                                                        'px-3 py-1 rounded-full text-xs font-semibold': true,
                                                        'bg-green-100 text-green-800': siswa.status === 'H',
                                                        'bg-yellow-100 text-yellow-800': siswa.status === 'S',
                                                        'bg-blue-100 text-blue-800': siswa.status === 'I',
                                                        'bg-red-100 text-red-800': siswa.status === 'A'
                                                    }" x-text="getStatusLabel(siswa.status)"></span>
                                                    <span x-show="siswa.keterangan" class="text-xs text-slate-400" x-text="siswa.keterangan"></span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
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
            kelasList: [],
            siswaList: [],
            absensiList: [],
            
            // Form
            form: {
                tanggal: new Date().toISOString().split('T')[0],
                id_kelas: ''
            },
            
            // Absensi data
            absensiData: {},
            
            // Selected
            selectedKelas: null,
            selectedAbsensi: null,
            
            // Stats
            stats: {
                hadir: 0,
                sakit: 0,
                izin: 0,
                alfa: 0,
                totalSiswa: 0
            },
            
            // Summary
            summary: {
                hadir: 0,
                sakit: 0,
                izin: 0,
                alfa: 0,
                terisi: 0
            },
            
            // Rekap
            rekapFilter: {
                kelas: '',
                startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            },
            rekapData: [],
            
            // Chart
            chartData: [],
            
            // Modal
            showDetailModal: false,
            
            // Today
            today: new Date().toISOString().split('T')[0],

            // Init
            init() {
                console.log('✅ Absensi Component initialized');
                
                // Subscribe ke store
                Store.subscribe('kelas', (kelas) => {
                    this.kelasList = kelas || [];
                });
                
                // Load data
                this.loadData();
                this.loadRekap();
            },

            // Load data
            async loadData() {
                const app = document.querySelector('[x-data="app"]').__x.$data;
                
                try {
                    await Store.loadKelas();
                    await this.loadStats();
                } catch (error) {
                    console.error('Error loading data:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data');
                }
            },

            // Load stats
            async loadStats() {
                try {
                    const result = await api.get('getDashboard');
                    if (result.status === 'success') {
                        this.stats = {
                            hadir: result.data.absensiHariIni || 0,
                            sakit: 0,
                            izin: 0,
                            alfa: 0,
                            totalSiswa: result.data.totalSiswa || 0
                        };
                    }
                } catch (error) {
                    console.error('Error loading stats:', error);
                }
            },

            // Load siswa by kelas
            async loadSiswaByKelas() {
                if (!this.form.id_kelas) {
                    this.siswaList = [];
                    return;
                }
                
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data siswa...');
                
                try {
                    // Get kelas info
                    this.selectedKelas = this.kelasList.find(k => k.id_kelas === this.form.id_kelas);
                    
                    // Get siswa
                    const result = await api.get('getSiswaByKelas', { id_kelas: this.form.id_kelas });
                    
                    if (result.status === 'success') {
                        this.siswaList = result.data;
                        this.initAbsensiData();
                    }
                } catch (error) {
                    console.error('Error loading siswa:', error);
                    app.showToast('error', 'Gagal', 'Tidak dapat memuat data siswa');
                } finally {
                    app.hideLoading();
                }
            },

            // Initialize absensi data
            initAbsensiData() {
                this.absensiData = {};
                this.siswaList.forEach(siswa => {
                    this.absensiData[siswa.id_siswa] = {
                        status: 'H',
                        keterangan: ''
                    };
                });
                this.updateSummary();
            },

            // Load existing absensi
            async loadExistingAbsensi() {
                if (!this.form.tanggal || !this.form.id_kelas) {
                    alert('Pilih tanggal dan kelas terlebih dahulu');
                    return;
                }
                
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Memuat data absensi...');
                
                try {
                    const result = await api.get('getAbsensi', {
                        tanggal: this.form.tanggal,
                        id_kelas: this.form.id_kelas
                    });
                    
                    if (result.status === 'success' && result.data.length > 0) {
                        // Reset absensi data
                        this.absensiData = {};
                        
                        // Fill with existing data
                        result.data.forEach(a => {
                            this.absensiData[a.id_siswa] = {
                                status: a.status,
                                keterangan: a.keterangan || ''
                            };
                        });
                        
                        // Set default for missing siswa
                        this.siswaList.forEach(siswa => {
                            if (!this.absensiData[siswa.id_siswa]) {
                                this.absensiData[siswa.id_siswa] = {
                                    status: 'H',
                                    keterangan: ''
                                };
                            }
                        });
                        
                        app.showToast('success', 'Berhasil', 'Data absensi ditemukan');
                    } else {
                        this.initAbsensiData();
                        app.showToast('info', 'Info', 'Tidak ada data absensi sebelumnya');
                    }
                    
                    this.updateSummary();
                    
                } catch (error) {
                    console.error('Error loading absensi:', error);
                    app.showToast('error', 'Gagal', 'Gagal memuat data absensi');
                } finally {
                    app.hideLoading();
                }
            },

            // Set status for a student
            setStatus(id_siswa, status) {
                if (this.absensiData[id_siswa]) {
                    this.absensiData[id_siswa].status = status;
                    this.updateSummary();
                }
            },

            // Set all students to Hadir
            setAllHadir() {
                Object.keys(this.absensiData).forEach(id => {
                    this.absensiData[id].status = 'H';
                });
                this.updateSummary();
            },

            // Update summary
            updateSummary() {
                const counts = {
                    hadir: 0,
                    sakit: 0,
                    izin: 0,
                    alfa: 0,
                    terisi: 0
                };
                
                Object.values(this.absensiData).forEach(data => {
                    if (data.status === 'H') counts.hadir++;
                    else if (data.status === 'S') counts.sakit++;
                    else if (data.status === 'I') counts.izin++;
                    else if (data.status === 'A') counts.alfa++;
                    counts.terisi++;
                });
                
                this.summary = counts;
                
                // Update stats
                this.stats.hadir = counts.hadir;
                this.stats.sakit = counts.sakit;
                this.stats.izin = counts.izin;
                this.stats.alfa = counts.alfa;
            },

            // Save absensi
            async saveAbsensi() {
                if (!this.form.tanggal || !this.form.id_kelas) {
                    alert('Pilih tanggal dan kelas terlebih dahulu');
                    return;
                }
                
                if (this.siswaList.length === 0) {
                    alert('Tidak ada data siswa');
                    return;
                }
                
                const app = document.querySelector('[x-data="app"]').__x.$data;
                app.showLoading('Menyimpan absensi...');
                
                try {
                    // Prepare data
                    const absensiData = this.siswaList.map(s => ({
                        id_siswa: s.id_siswa,
                        status: this.absensiData[s.id_siswa]?.status || 'H',
                        keterangan: this.absensiData[s.id_siswa]?.keterangan || ''
                    }));
                    
                    const result = await api.post('saveAbsensiBatch', {
                        tanggal: this.form.tanggal,
                        id_kelas: this.form.id_kelas,
                        absensi: absensiData
                    });
                    
                    if (result.status === 'success') {
                        app.showToast('success', 'Berhasil', 'Absensi disimpan');
                        await this.loadStats();
                        await this.loadRekap();
                    } else {
                        app.showToast('error', 'Gagal', result.message);
                    }
                    
                } catch (error) {
                    console.error('Error saving absensi:', error);
                    app.showToast('error', 'Error', 'Gagal menyimpan absensi');
                } finally {
                    app.hideLoading();
                }
            },

            // Load rekap
            async loadRekap() {
                try {
                    // Get absensi for date range
                    const start = new Date(this.rekapFilter.startDate);
                    const end = new Date(this.rekapFilter.endDate);
                    const days = [];
                    
                    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                        days.push(d.toISOString().split('T')[0]);
                    }
                    
                    const rekap = [];
                    
                    for (const tanggal of days) {
                        const params = { tanggal };
                        if (this.rekapFilter.kelas) {
                            params.id_kelas = this.rekapFilter.kelas;
                        }
                        
                        const result = await api.get('getAbsensi', params);
                        
                        if (result.status === 'success' && result.data.length > 0) {
                            const hadir = result.data.filter(a => a.status === 'H').length;
                            const sakit = result.data.filter(a => a.status === 'S').length;
                            const izin = result.data.filter(a => a.status === 'I').length;
                            const alfa = result.data.filter(a => a.status === 'A').length;
                            const total = result.data.length;
                            const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;
                            
                            rekap.push({
                                tanggal,
                                kelas: this.rekapFilter.kelas ? 
                                    this.getNamaKelas(this.rekapFilter.kelas) : 
                                    'Semua Kelas',
                                hadir,
                                sakit,
                                izin,
                                alfa,
                                total,
                                persentase
                            });
                        }
                    }
                    
                    this.rekapData = rekap;
                    this.updateChart(rekap);
                    
                } catch (error) {
                    console.error('Error loading rekap:', error);
                }
            },

            // Update chart data
            updateChart(rekap) {
                this.chartData = rekap.slice(-7).map(item => ({
                    tanggal: this.formatDateShort(item.tanggal),
                    hadir: item.hadir,
                    total: item.total
                }));
            },

            // Export rekap
            exportRekap() {
                const data = this.rekapData.map(item => ({
                    'Tanggal': item.tanggal,
                    'Kelas': item.kelas,
                    'Hadir': item.hadir,
                    'Sakit': item.sakit,
                    'Izin': item.izin,
                    'Alfa': item.alfa,
                    'Total': item.total,
                    'Persentase': item.persentase + '%'
                }));
                
                const csv = this.convertToCSV(data);
                this.downloadCSV(csv, `rekap_absensi_${new Date().toISOString().split('T')[0]}.csv`);
            },

            // View detail
            viewDetail(item) {
                this.selectedAbsensi = item;
                this.showDetailModal = true;
            },

            // Helper methods
            getNamaKelas(id_kelas) {
                const kelas = this.kelasList.find(k => k.id_kelas === id_kelas);
                return kelas ? kelas.nama_kelas : '-';
            },

            getStatusLabel(status) {
                const labels = {
                    'H': 'Hadir',
                    'S': 'Sakit',
                    'I': 'Izin',
                    'A': 'Alfa'
                };
                return labels[status] || status;
            },

            formatDate(date) {
                if (!date) return '-';
                return new Date(date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            },

            formatDateShort(date) {
                if (!date) return '-';
                return new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short'
                });
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
window.AbsensiComponent = AbsensiComponent;

console.log('✅ Absensi Component loaded');