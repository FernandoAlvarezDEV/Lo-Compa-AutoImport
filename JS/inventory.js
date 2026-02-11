// inventory.js - Versión completa con API, filtros y sincronización desde Landing Page

// ══════════════════════════════════════════════════════════
// FUNCIÓN HELPER: Normalizar texto (quitar tildes)
// ══════════════════════════════════════════════════════════
function normalizar(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener('DOMContentLoaded', async () => {

    // ══════════════════════════════════════════════════════════
    // VARIABLES Y ELEMENTOS DEL DOM
    // ══════════════════════════════════════════════════════════
    
    const contenedorAutos = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.xl\\:grid-cols-3');
    let todosLosAutos = [];
    
    const vehicleTypeButtons = document.querySelectorAll('.vehicle-type-btn');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const btnReset = document.getElementById('btnResetFilters');
    const selectOrden = document.getElementById('orderSelect');
    
    const sliderTrack = document.querySelector('.price-slider-track');
    const thumbMin = document.querySelector('.price-thumb-min');
    const thumbMax = document.querySelector('.price-thumb-max');
    const valueMin = document.getElementById('price-min');
    const valueMax = document.getElementById('price-max');
    
    const MIN_PRICE = 33000;
    const MAX_PRICE = 185000;
    let currentMin = MIN_PRICE;
    let currentMax = MAX_PRICE;

    // ══════════════════════════════════════════════════════════
    // PARTE 1: CARGAR AUTOS DESDE LA API
    // ══════════════════════════════════════════════════════════
    
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
        
        // Leer parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const terminoBusqueda = urlParams.get('buscar');
        const tipoURL = urlParams.get('tipo');
        const marcaURL = urlParams.get('marca');
        const modeloURL = urlParams.get('modelo');
        const precioMaxURL = urlParams.get('precio_max');
        
        // Cargar autos
        if (terminoBusqueda) {
            todosLosAutos = await buscarAutos(terminoBusqueda);
            const titulo = document.querySelector('h1');
            if (titulo) {
                titulo.innerHTML = `Resultados para: <span class="text-dr-red italic">"${terminoBusqueda}"</span>`;
            }
        } else {
            todosLosAutos = await obtenerAutos();
        }
        
        // ══════════════════════════════════════════════════════════
        // APLICAR FILTROS DE LA URL (desde Landing Page)
        // ══════════════════════════════════════════════════════════
        
        console.log('📋 Parámetros de la URL:', {
            tipo: tipoURL,
            marca: marcaURL,
            modelo: modeloURL,
            precio_max: precioMaxURL
        });
        
        // 1. Activar filtro de TIPO (sedan, suv, camioneta, deportivo, convertible)
        if (tipoURL) {
            const tipoNormalizado = normalizar(tipoURL);
            console.log('🔍 Buscando tipo:', tipoNormalizado);
            
            vehicleTypeButtons.forEach(btn => {
                const tipoBtn = normalizar(btn.querySelector('span').textContent.trim());
                console.log('  Comparando con botón:', tipoBtn);
                
                if (tipoBtn === tipoNormalizado) {
                    btn.classList.remove('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
                    btn.classList.add('bg-dr-blue', 'text-white', 'shadow-sm');
                    console.log('  ✅ Tipo activado:', tipoBtn);
                }
            });
        }
        
        // 2. Activar filtro de MARCA (toyota, chevrolet, ford, etc.)
        if (marcaURL) {
            const marcaNormalizada = normalizar(marcaURL);
            console.log('🔍 Buscando marca:', marcaNormalizada);
            
            brandCheckboxes.forEach(chk => {
                const marcaCheckbox = normalizar(chk.nextElementSibling.textContent.trim());
                console.log('  Comparando con checkbox:', marcaCheckbox);
                
                if (marcaCheckbox === marcaNormalizada) {
                    chk.checked = true;
                    console.log('  ✅ Marca activada:', marcaCheckbox);
                }
            });
        }
        
        // 3. Ajustar PRECIO MÁXIMO
        if (precioMaxURL) {
            const precio = parseInt(precioMaxURL);
            if (!isNaN(precio) && precio >= MIN_PRICE && precio <= MAX_PRICE) {
                currentMax = precio;
                updateSliderUI();
                console.log('✅ Precio máximo ajustado:', currentMax);
            }
        }
        
        // Aplicar filtros y renderizar
        applyFilters();
    }

    // ══════════════════════════════════════════════════════════
    // FUNCIONES DEL SLIDER DE PRECIO
    // ══════════════════════════════════════════════════════════
    
    function updateSliderUI() {
        if (!sliderTrack || !thumbMin || !thumbMax) return;
        
        const range = MAX_PRICE - MIN_PRICE;
        const left = ((currentMin - MIN_PRICE) / range) * 100;
        const right = ((currentMax - MIN_PRICE) / range) * 100;

        sliderTrack.style.left = left + '%';
        sliderTrack.style.right = (100 - right) + '%';

        thumbMin.style.left = left + '%';
        thumbMax.style.left = right + '%';

        if (valueMin) valueMin.textContent = '$' + currentMin.toLocaleString('en-US');
        if (valueMax) valueMax.textContent = '$' + currentMax.toLocaleString('en-US');
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
        const up = () => {
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
    // EVENTOS DE FILTROS INTERACTIVOS
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

    // Checkboxes de marcas
    brandCheckboxes.forEach(chk => {
        chk.addEventListener('change', applyFilters);
    });

    // Botón Reiniciar filtros
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            // Quitar selección de tipos
            vehicleTypeButtons.forEach(btn => {
                btn.classList.remove('bg-dr-blue', 'text-white', 'shadow-sm');
                btn.classList.add('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
            });

            // Desmarcar marcas
            brandCheckboxes.forEach(chk => chk.checked = false);

            // Resetear precio
            currentMin = MIN_PRICE;
            currentMax = MAX_PRICE;
            updateSliderUI();

            // Resetear ordenamiento
            if (selectOrden) selectOrden.value = 'recent';

            applyFilters();
        });
    }

    // Select de ordenamiento
    if (selectOrden) {
        selectOrden.addEventListener('change', applyFilters);
    }

    // ══════════════════════════════════════════════════════════
    // FUNCIÓN PRINCIPAL DE FILTRADO
    // ══════════════════════════════════════════════════════════
    
    function applyFilters() {
        // Obtener filtros activos (normalizados sin tildes)
        const activeTypes = [];
        vehicleTypeButtons.forEach(btn => {
            if (btn.classList.contains('bg-dr-blue')) {
                activeTypes.push(normalizar(btn.querySelector('span').textContent.trim()));
            }
        });

        const activeBrands = [];
        brandCheckboxes.forEach(chk => {
            if (chk.checked) {
                activeBrands.push(normalizar(chk.nextElementSibling.textContent.trim()));
            }
        });

        // Filtrar autos
        let autosFiltrados = todosLosAutos.filter(auto => {
            // Filtro por tipo de vehículo (comparación normalizada)
            const matchTipo = activeTypes.length === 0 || 
                            activeTypes.includes(normalizar(auto.tipo_vehiculo));
            
            // Filtro por marca (comparación normalizada)
            const matchMarca = activeBrands.length === 0 || 
                            activeBrands.includes(normalizar(auto.marca));
            
            // Filtro por precio
            const matchPrecio = auto.precio >= currentMin && auto.precio <= currentMax;

            return matchTipo && matchMarca && matchPrecio;
        });

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

        console.groupCollapsed('🔍 Filtros activos');
        console.log('Tipos:', activeTypes);
        console.log('Marcas:', activeBrands);
        console.log('Precio:', `$${currentMin.toLocaleString()} – $${currentMax.toLocaleString()}`);
        console.log('Autos filtrados:', autosFiltrados.length, 'de', todosLosAutos.length);
        console.groupEnd();

        // Renderizar
        renderizarAutosConFiltros(autosFiltrados);
    }

    // ══════════════════════════════════════════════════════════
    // FUNCIÓN DE RENDERIZADO
    // ══════════════════════════════════════════════════════════
    
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
                         alt="${auto.marca} ${auto.modelo}"
                         onerror="this.src='https://via.placeholder.com/800x600?text=Imagen+No+Disponible'">
                </div>
                <div class="p-5 flex flex-col flex-1">
                    <div class="mb-4">
                        <h3 class="font-bold text-lg leading-tight text-dr-blue dark:text-white">
                            ${auto.marca} ${auto.modelo}
                        </h3>
                        <p class="text-dr-red font-black text-xl mt-1">US$ ${auto.precio.toLocaleString()}</p>
                    </div>
                    <div class="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-dr-blue/60 dark:text-gray-400">
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">speed</span>
                            <span class="text-[11px] font-bold">${auto.kilometraje || 0} km</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">local_gas_station</span>
                            <span class="text-[11px] font-bold uppercase">${auto.combustible || 'Gasolina'}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">settings</span>
                            <span class="text-[11px] font-bold uppercase">${auto.transmision || 'Auto'}</span>
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