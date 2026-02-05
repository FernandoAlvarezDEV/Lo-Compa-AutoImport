// inventory.js - Versión completa con API y filtros

document.addEventListener('DOMContentLoaded', async () => {

    // ══════════════════════════════════════════════════════════
    // PARTE 1: CARGAR AUTOS DESDE LA API
    // ══════════════════════════════════════════════════════════
    
    const contenedorAutos = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.xl\\:grid-cols-3');
    let todosLosAutos = []; // Guardamos todos los autos aquí
    
    if (contenedorAutos) {
        // Mostrar loading
        contenedorAutos.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-dr-red mx-auto mb-4"></div>
                    <p class="text-lg font-bold text-gray-600 dark:text-gray-400">Cargando vehículos...</p>
                </div>
            </div>
        `;
        
        // Obtener el término de búsqueda de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const terminoBusqueda = urlParams.get('buscar');
        
        if (terminoBusqueda) {
            // Si hay búsqueda, filtrar
            todosLosAutos = await buscarAutos(terminoBusqueda);
            
            // Actualizar el título
            const titulo = document.querySelector('h1');
            if (titulo) {
                titulo.innerHTML = `Resultados para: <span class="text-dr-red italic">"${terminoBusqueda}"</span>`;
            }
        } else {
            // Si no hay búsqueda, mostrar todos
            todosLosAutos = await obtenerAutos();
        }
        
        // Renderizar los autos inicialmente
        renderizarAutosConFiltros(todosLosAutos);
    }

    // ══════════════════════════════════════════════════════════
    // PARTE 2: ELEMENTOS DE FILTROS
    // ══════════════════════════════════════════════════════════
    
    const vehicleTypeButtons = document.querySelectorAll('.vehicle-type-btn');
    const brandCheckboxes    = document.querySelectorAll('input[name="brand"]');
    const btnReset           = document.getElementById('btnResetFilters');
    const selectOrden        = document.getElementById('orderSelect');

    // Slider
    const sliderTrack   = document.querySelector('.price-slider-track');
    const thumbMin      = document.querySelector('.price-thumb-min');
    const thumbMax      = document.querySelector('.price-thumb-max');
    const valueMin      = document.getElementById('price-min');
    const valueMax      = document.getElementById('price-max');

    const MIN_PRICE = 33000;
    const MAX_PRICE = 185000;
    let currentMin = MIN_PRICE;
    let currentMax = MAX_PRICE;


    // ══════════════════════════════════════════════════════════
    // FUNCIONES DEL SLIDER
    // ══════════════════════════════════════════════════════════
    
    function updateSliderUI() {
        const range = MAX_PRICE - MIN_PRICE;
        const left  = ((currentMin - MIN_PRICE) / range) * 100;
        const right = ((currentMax - MIN_PRICE) / range) * 100;

        sliderTrack.style.left  = left + '%';
        sliderTrack.style.right = (100 - right) + '%';

        thumbMin.style.left = left + '%';
        thumbMax.style.left = right + '%';

        valueMin.textContent = '$' + currentMin.toLocaleString('en-US');
        valueMax.textContent = '$' + currentMax.toLocaleString('en-US');
    }

    function onMouseMove(e, isMin) {
        const rect = sliderTrack.parentElement.getBoundingClientRect();
        let pos = ((e.clientX - rect.left) / rect.width) * 100;
        pos = Math.max(0, Math.min(100, pos));

        const newValue = Math.round(MIN_PRICE + (pos / 100) * (MAX_PRICE - MIN_PRICE));

        if (isMin) {
            if (newValue < currentMax - 1000) currentMin = newValue;
        } else {
            if (newValue > currentMin + 1000) currentMax = newValue;
        }

        updateSliderUI();
        applyFilters();
    }

    function startDrag(e, isMin) {
        e.preventDefault();
        const move = ev => onMouseMove(ev, isMin);
        const up   = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }

    if (thumbMin && thumbMax) {
        thumbMin.addEventListener('mousedown', e => startDrag(e, true));
        thumbMax.addEventListener('mousedown', e => startDrag(e, false));
        updateSliderUI();
    }

    // ══════════════════════════════════════════════════════════
    // EVENTOS DE FILTROS
    // ══════════════════════════════════════════════════════════
    
    // Toggle tipos de vehículo
    vehicleTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('bg-dr-blue');

            if (isActive) {
                btn.classList.remove('bg-dr-blue', 'text-white', 'shadow-sm');
                btn.classList.add('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
            } else {
                btn.classList.remove('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
                btn.classList.add('bg-dr-blue', 'text-white', 'shadow-sm');
            }

            applyFilters();
        });
    });

    // Checkboxes marcas
    brandCheckboxes.forEach(chk => {
        chk.addEventListener('change', applyFilters);
    });

    // Botón Reiniciar
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            // 1. Quitar selección de tipos de vehículo
            vehicleTypeButtons.forEach(btn => {
                btn.classList.remove('bg-dr-blue', 'text-white', 'shadow-sm');
                btn.classList.add('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
            });

            // 2. Desmarcar marcas
            brandCheckboxes.forEach(chk => chk.checked = false);

            // 3. Resetear precio
            currentMin = MIN_PRICE;
            currentMax = MAX_PRICE;
            updateSliderUI();

            // 4. Resetear ordenamiento
            if (selectOrden) selectOrden.value = 'recent';

            // 5. Aplicar
            applyFilters();
        });
    }

    // Ordenar
    if (selectOrden) {
        selectOrden.addEventListener('change', applyFilters);
    }

    // ══════════════════════════════════════════════════════════
    // FUNCIÓN PRINCIPAL DE FILTRADO Y RENDERIZADO
    // ══════════════════════════════════════════════════════════
    
    function applyFilters() {
        // Obtener filtros activos
        const activeTypes = [];
        vehicleTypeButtons.forEach(btn => {
            if (btn.classList.contains('bg-dr-blue')) {
                activeTypes.push(btn.querySelector('span').textContent.trim().toLowerCase());
            }
        });

        const activeBrands = [];
        brandCheckboxes.forEach(chk => {
            if (chk.checked) {
                activeBrands.push(chk.nextElementSibling.textContent.trim().toLowerCase());
            }
        });

        // Filtrar autos
// Filtrar autos
            let autosFiltrados = todosLosAutos.filter(auto => {
                // Filtro por tipo de vehículo
                const matchTipo = activeTypes.length === 0 || 
                                activeTypes.includes(auto.tipo_vehiculo?.toLowerCase());
                
                // Filtro por marca
                const matchMarca = activeBrands.length === 0 || 
                                activeBrands.includes(auto.marca.toLowerCase());
                
                // Filtro por precio
                const matchPrecio = auto.precio >= currentMin && auto.precio <= currentMax;

                return matchTipo && matchMarca && matchPrecio; // ✅ Ahora incluye tipo
            }); // && matchTipo si tienes tipo

        // Ordenar
        if (selectOrden) {
            switch(selectOrden.value) {
                case 'price-asc':
                    autosFiltrados.sort((a, b) => a.precio - b.precio);
                    break;
                case 'price-desc':
                    autosFiltrados.sort((a, b) => b.precio - a.precio);
                    break;
                case 'recent':
                    autosFiltrados.sort((a, b) => b.id - a.id);
                    break;
            }
        }

        console.groupCollapsed('Filtros activos');
        console.log('Tipos:', activeTypes);
        console.log('Marcas:', activeBrands);
        console.log('Precio:', currentMin, '–', currentMax);
        console.log('Autos filtrados:', autosFiltrados.length);
        console.groupEnd();

        // Renderizar
        renderizarAutosConFiltros(autosFiltrados);
    }

    // ══════════════════════════════════════════════════════════
    // FUNCIÓN DE RENDERIZADO
    // ══════════════════════════════════════════════════════════
// En la parte donde renderizas cada auto, cambia los botones "Detalles" así:

function renderizarAutosConFiltros(autos) {
    if (!contenedorAutos) return;

    if (autos.length === 0) {
        contenedorAutos.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <p class="text-xl font-bold text-gray-400 dark:text-gray-500">No se encontraron vehículos</p>
                <p class="text-sm text-gray-400 dark:text-gray-600 mt-2">Intenta ajustar los filtros</p>
            </div>
        `;
        return;
    }

    contenedorAutos.innerHTML = autos.map(auto => `
        <div class="vehicle-card bg-white dark:bg-[#242424] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-[#2a3a38] flex flex-col group"
             data-precio="${auto.precio}" 
             data-marca="${auto.marca.toLowerCase()}" 
             data-modelo="${auto.modelo.toLowerCase()}"
             data-id="${auto.id}">
            <div class="relative aspect-[4/3] overflow-hidden cursor-pointer" onclick="window.location.href='Car Details Page.html?id=${auto.id}'">
                <div class="absolute top-3 left-3 z-10">
                    <span class="bg-${auto.disponible ? 'dr-red' : 'gray-400'} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                        ${auto.disponible ? 'Disponible' : 'Vendido'}
                    </span>
                </div>
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     src="${auto.imagen_url}" 
                     alt="${auto.modelo}"
                     onerror="this.src='https://via.placeholder.com/800x600?text=Imagen+No+Disponible'">
            </div>
            <div class="p-5 flex flex-col flex-1">
                <div class="mb-4">
                    <h3 class="font-bold text-lg leading-tight text-dr-blue dark:text-white">
                        ${auto.modelo}
                    </h3>
                    <p class="text-dr-red font-black text-xl mt-1">US$ ${auto.precio.toLocaleString()}</p>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-dr-blue/60 dark:text-gray-400">

                    <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">calendar_today</span>
                        <span class="text-[11px] font-bold">${auto.tipo_vehiculo}</span>
                    </div>

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
                    <a href="https://wa.me/18297534583?text=${encodeURIComponent(`Hola! Interesado en ${auto.marca} ${auto.modelo} ${auto.anio}`)}" 
                       class="h-10 rounded-lg bg-dr-red text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-dr-red/90 transition-all">
                        Consulta por WhatsApp
                    </a>
                    <button onclick="window.location.href='Car Details Page.html?id=${auto.id}'" 
                            class="h-10 rounded-lg border-2 border-dr-blue/10 text-dr-blue dark:text-white text-[11px] font-black uppercase tracking-wider hover:bg-dr-blue hover:text-white transition-all">
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
});