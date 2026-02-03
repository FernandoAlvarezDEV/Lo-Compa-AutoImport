// api.js - Conexión con el backend FastAPI

const API_URL = 'http://127.0.0.1:8000';

// Función para obtener todos los autos
async function obtenerAutos() {
    try {
        const response = await fetch(`${API_URL}/autos`);
        if (!response.ok) throw new Error('Error al obtener autos');
        const data = await response.json();
        return data.autos;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Función para buscar autos por marca o modelo
async function buscarAutos(termino) {
    try {
        const autos = await obtenerAutos();
        const terminoLower = termino.toLowerCase();
        
        return autos.filter(auto => 
            auto.marca.toLowerCase().includes(terminoLower) ||
            auto.modelo.toLowerCase().includes(terminoLower)
        );
    } catch (error) {
        console.error('Error al buscar:', error);
        return [];
    }
}

// Función para renderizar los autos en el DOM
function renderizarAutos(autos, contenedor) {
    if (autos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <p class="text-xl font-bold text-gray-400">No se encontraron vehículos</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = autos.map(auto => `
        <div class="vehicle-card bg-white dark:bg-[#242424] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-[#2a3a38] flex flex-col group"
             data-precio="${auto.precio}" data-marca="${auto.marca}" data-modelo="${auto.modelo}">
            <div class="relative aspect-[4/3] overflow-hidden">
                <div class="absolute top-3 left-3 z-10">
                    <span class="bg-dr-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                        ${auto.disponible ? 'Disponible' : 'Vendido'}
                    </span>
                </div>
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     src="${auto.imagen_url}" 
                     alt="${auto.marca} ${auto.modelo}"
                     onerror="this.src='https://via.placeholder.com/800x600?text=Imagen+No+Disponible'">
            </div>
            <div class="p-5 flex flex-col flex-1">
                <div class="mb-4">
                    <h3 class="font-bold text-lg leading-tight text-dr-blue dark:text-white">
                        ${auto.anio} ${auto.marca} ${auto.modelo}
                    </h3>
                    <p class="text-dr-red font-black text-xl mt-1">US$ ${auto.precio.toLocaleString()}</p>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-dr-blue/60 dark:text-gray-400">
                    <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">calendar_today</span>
                        <span class="text-[11px] font-bold">${auto.anio}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">directions_car</span>
                        <span class="text-[11px] font-bold uppercase">${auto.marca}</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-2">
                    <button class="h-10 rounded-lg bg-dr-red text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-dr-red/90 transition-all">
                        Consulta por WhatsApp
                    </button>
                    <button class="h-10 rounded-lg border-2 border-dr-blue/10 text-dr-blue dark:text-white text-[11px] font-black uppercase tracking-wider hover:bg-dr-blue hover:text-white transition-all">
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}