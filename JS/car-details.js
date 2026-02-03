// car-details.js - Cargar detalles del vehículo desde la API

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del auto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const autoId = urlParams.get('id');
    
    if (!autoId) {
        mostrarError('No se especificó un vehículo');
        return;
    }
    
    // Cargar los datos del auto
    await cargarDetallesAuto(autoId);
});

async function cargarDetallesAuto(id) {
    try {
        // Mostrar loading
        mostrarLoading();
        
        // Hacer petición a la API
        const response = await fetch(`http://127.0.0.1:8000/autos/${id}`);
        
        if (!response.ok) {
            throw new Error('Auto no encontrado');
        }
        
        const auto = await response.json();
        
        // Renderizar los datos en la página
        renderizarDetalles(auto);
        
    } catch (error) {
        console.error('Error al cargar auto:', error);
        mostrarError('No se pudo cargar la información del vehículo');
    }
}

function renderizarDetalles(auto) {
    // ═══════════════════════════════════════════
    // TÍTULO Y PRECIO
    // ═══════════════════════════════════════════
    
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = `${auto.anio} ${auto.marca} ${auto.modelo}`;
    }
    
    const precio = document.querySelector('h2.text-dr-red');
    if (precio) {
        precio.textContent = `USD$ ${auto.precio.toLocaleString()}`;
    }
    
    // Actualizar título de la página
    document.title = `${auto.marca} ${auto.modelo} | Lo Compa AutoImport`;
    
    // ═══════════════════════════════════════════
    // IMAGEN PRINCIPAL
    // ═══════════════════════════════════════════
    
    const imagenPrincipal = document.querySelector('.aspect-video.w-full');
    if (imagenPrincipal && auto.imagen_url) {
        imagenPrincipal.style.backgroundImage = `url('${auto.imagen_url}')`;
    }
    
    // ═══════════════════════════════════════════
    // MINIATURAS (por ahora solo mostrar la principal)
    // ═══════════════════════════════════════════
    
    const contenedorMiniaturas = document.querySelector('.flex.gap-4.overflow-x-auto');
    if (contenedorMiniaturas && auto.imagen_url) {
        contenedorMiniaturas.innerHTML = `
            <div class="min-w-[160px] aspect-video rounded-lg bg-cover bg-center border-2 border-primary-blue" 
                 style="background-image: url('${auto.imagen_url}');"></div>
        `;
    }
    
    // ═══════════════════════════════════════════
    // SUBTÍTULO (Combustible • Transmisión)
    // ═══════════════════════════════════════════
    
    const subtitulo = document.querySelector('.text-lg.opacity-70');
    if (subtitulo) {
        const combustible = auto.combustible || 'Gasolina';
        const transmision = auto.transmision || 'Automática';
        subtitulo.textContent = `${combustible} • ${transmision}`;
    }
    
    // ═══════════════════════════════════════════
    // BADGES (0KM, Disponible, etc.)
    // ═══════════════════════════════════════════
    
    const contenedorBadges = document.querySelector('.flex.flex-wrap.gap-3');
    if (contenedorBadges) {
        let badges = '';
        
        if (auto.kilometraje === 0) {
            badges += `<span class="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">0KM MILEAGE</span>`;
        }
        
        if (auto.disponible) {
            badges += `<span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Disponible</span>`;
        }
        
        if (auto.destacado) {
            badges += `<span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Destacado</span>`;
        }
        
        contenedorBadges.innerHTML = badges;
    }
    
    // ═══════════════════════════════════════════
    // ESPECIFICACIONES TÉCNICAS
    // ═══════════════════════════════════════════
    
    const especificaciones = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-x-12');
    if (especificaciones) {
        especificaciones.innerHTML = `
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Año</span>
                <span class="font-semibold">${auto.anio}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Marca</span>
                <span class="font-semibold">${auto.marca}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Modelo</span>
                <span class="font-semibold">${auto.modelo}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Transmisión</span>
                <span class="font-semibold">${auto.transmision || 'Automática'}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Combustible</span>
                <span class="font-semibold">${auto.combustible || 'Gasolina'}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Kilometraje</span>
                <span class="font-semibold">${auto.kilometraje ? auto.kilometraje.toLocaleString() + ' km' : '0 km'}</span>
            </div>
            ${auto.color ? `
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Color</span>
                <span class="font-semibold">${auto.color}</span>
            </div>
            ` : ''}
            ${auto.tipo_vehiculo ? `
            <div class="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span class="opacity-60">Tipo</span>
                <span class="font-semibold">${auto.tipo_vehiculo}</span>
            </div>
            ` : ''}
        `;
    }
    
    // ═══════════════════════════════════════════
    // DESCRIPCIÓN (si existe)
    // ═══════════════════════════════════════════
    
    if (auto.descripcion) {
        // Buscar el contenedor de especificaciones y agregar descripción después
        const contenedorEspecs = especificaciones?.parentElement;
        if (contenedorEspecs) {
            const divDescripcion = document.createElement('div');
            divDescripcion.className = 'bg-white dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mt-8';
            divDescripcion.innerHTML = `
                <div class="bg-primary-blue p-6 text-white flex items-center gap-2">
                    <span class="material-symbols-outlined">description</span>
                    <h3 class="text-xl font-bold">Descripción</h3>
                </div>
                <div class="p-8">
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${auto.descripcion}</p>
                </div>
            `;
            contenedorEspecs.parentElement.insertBefore(divDescripcion, contenedorEspecs.nextSibling);
        }
    }
    
    // ═══════════════════════════════════════════
    // CALCULADORA DE FINANCIAMIENTO
    // ═══════════════════════════════════════════
    
    calcularFinanciamiento(auto.precio);
    
    // ═══════════════════════════════════════════
    // BOTÓN WHATSAPP
    // ═══════════════════════════════════════════
    
    const botonWhatsapp = document.querySelector('a[href*="wa.me"]');
    if (botonWhatsapp) {
        const mensaje = `Hola! Estoy interesado en el ${auto.marca} ${auto.modelo} ${auto.anio} por USD$ ${auto.precio.toLocaleString()}`;
        botonWhatsapp.href = `https://wa.me/18297534583?text=${encodeURIComponent(mensaje)}`;
    }
}

function calcularFinanciamiento(precio) {
    const slider = document.querySelector('input[type="range"]');
    const cuotaElement = document.querySelector('.text-2xl.font-bold.text-primary-blue');
    
    if (!slider || !cuotaElement) return;
    
    // Configurar slider
    slider.min = 10;
    slider.max = 50;
    slider.value = 20;
    
    function actualizarCuota() {
        const inicial = parseFloat(slider.value);
        const montoFinanciado = precio * (1 - inicial / 100);
        const tasaAnual = 0.12; // 12% anual
        const plazoMeses = 60; // 5 años
        const tasaMensual = tasaAnual / 12;
        
        // Fórmula de cuota mensual
        const cuota = montoFinanciado * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
                     (Math.pow(1 + tasaMensual, plazoMeses) - 1);
        
        // Convertir a pesos dominicanos (aprox 58 DOP por USD)
        const cuotaRD = cuota * 58;
        
        cuotaElement.textContent = `RD$ ${Math.round(cuotaRD).toLocaleString()}`;
        
        // Actualizar label del slider
        const label = slider.previousElementSibling;
        if (label) {
            label.textContent = `Pago Inicial (${inicial}%)`;
        }
    }
    
    slider.addEventListener('input', actualizarCuota);
    actualizarCuota();
}

function mostrarLoading() {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="flex justify-center items-center py-20">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-blue mx-auto mb-4"></div>
                    <p class="text-lg font-bold text-gray-600 dark:text-gray-400">Cargando vehículo...</p>
                </div>
            </div>
        `;
    }
}

function mostrarError(mensaje) {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="flex justify-center items-center py-20">
                <div class="text-center">
                    <span class="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <p class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-4">${mensaje}</p>
                    <a href="Inventory Page.html" class="inline-block bg-primary-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90">
                        Volver al Inventario
                    </a>
                </div>
            </div>
        `;
    }
}