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
        
        // Ocultar loading
        ocultarLoading();
        
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
            badges += `<span class="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">0 KM</span>`;
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
    
    calcularFinanciamiento(auto);
    
    // ═══════════════════════════════════════════
    // BOTÓN WHATSAPP
    // ═══════════════════════════════════════════
    
    const botonesWhatsapp = document.querySelectorAll('a[href*="wa.me"]');
    botonesWhatsapp.forEach(boton => {
        const mensaje = `Hola! Estoy interesado en el ${auto.marca} ${auto.modelo} ${auto.anio} por USD$ ${auto.precio.toLocaleString()}`;
        boton.href = `https://wa.me/18297534583?text=${encodeURIComponent(mensaje)}`;
    });
}

async function calcularFinanciamiento(auto) {
    const precio = auto.precio;
    const slider = document.getElementById('range-inicial');
    const cuotaRDElement = document.getElementById('cuota-mensual');
    const cuotaUSDElement = document.getElementById('cuota-usd');
    const valorInicialUSD = document.getElementById('valor-inicial-usd');
    const botonesPlazo = document.querySelectorAll('.btn-plazo');
    const botonWhatsapp = document.getElementById('btn-whatsapp');
    const botonFinanciamiento = document.getElementById('btn-financiamiento');
    
    if (!slider || !cuotaRDElement) return;

    let mesesSeleccionados = 48; // Valor por defecto
    let TASA_DOLAR = 58.50; // Fallback en caso de error en la API
    const TASA_INTERES_ANUAL = 0.12; // 12%

    // Obtener tasa de cambio dinámica desde API
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data.rates && data.rates.DOP) {
            TASA_DOLAR = data.rates.DOP;
        }
    } catch (error) {
        console.error('Error al obtener tasa de cambio:', error);
        // Usar fallback
    }

    function actualizarCalculos() {
        const porcInicial = parseFloat(slider.value);
        const montoInicialUSD = precio * (porcInicial / 100);
        const montoFinanciado = precio - montoInicialUSD;
        
        // Mostrar valor del inicial en USD
        valorInicialUSD.textContent = `USD$ ${Math.round(montoInicialUSD).toLocaleString()}`;
        
        // Fórmula de amortización
        const tasaMensual = TASA_INTERES_ANUAL / 12;
        const cuotaUSD = montoFinanciado * (tasaMensual * Math.pow(1 + tasaMensual, mesesSeleccionados)) / 
                        (Math.pow(1 + tasaMensual, mesesSeleccionados) - 1);
        
        const cuotaRD = cuotaUSD * TASA_DOLAR;

        // Renderizar resultados
        cuotaRDElement.textContent = `RD$ ${Math.round(cuotaRD).toLocaleString()}`;
        cuotaUSDElement.textContent = `USD$ ${Math.round(cuotaUSD).toLocaleString()}`;
        
        const label = document.getElementById('label-inicial');
        if (label) label.textContent = `Pago Inicial (${porcInicial}%)`;

        // Actualizar mensaje de WhatsApp para consulta de financiamiento
        if (botonWhatsapp) {
            const mensaje = `Hola! Estoy interesado en financiar el ${auto.marca} ${auto.modelo} ${auto.anio}. Detalles: Pago inicial ${porcInicial}% (USD$ ${Math.round(montoInicialUSD).toLocaleString()}), Plazo ${mesesSeleccionados} meses, Cuota estimada RD$ ${Math.round(cuotaRD).toLocaleString()} (USD$ ${Math.round(cuotaUSD).toLocaleString()})`;
            botonWhatsapp.href = `https://wa.me/18297534583?text=${encodeURIComponent(mensaje)}`;
        }
    }

    // Eventos para el Slider
    slider.addEventListener('input', actualizarCalculos);

    // Eventos para los botones de Plazo
    botonesPlazo.forEach(btn => {
        btn.addEventListener('click', () => {
            // Estética de botones
            botonesPlazo.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                b.classList.add('border-primary/10');
            });
            btn.classList.add('bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('border-primary/10');

            // Actualizar lógica
            mesesSeleccionados = parseInt(btn.dataset.meses);
            actualizarCalculos();
        });
    });

    // Evento para botón de financiamiento (guardar datos y redirigir)
    if (botonFinanciamiento) {
        botonFinanciamiento.addEventListener('click', (e) => {
            e.preventDefault();
            const porcInicial = parseFloat(slider.value);
            localStorage.setItem('financiamientoData', JSON.stringify({
                precio: precio,
                porcInicial: porcInicial,
                meses: mesesSeleccionados,
                auto: {
                    marca: auto.marca,
                    modelo: auto.modelo,
                    anio: auto.anio
                }
            }));
            window.location.href = 'Financiamiento.html';
        });
    }

    // Inicializar cálculos
    actualizarCalculos();
}

function mostrarLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
        loading.innerHTML = '<div class="text-center"><p class="text-xl font-bold">Cargando detalles del vehículo...</p></div>';
    }
    const autoContent = document.getElementById('auto-content');
    if (autoContent) autoContent.classList.add('hidden');
}

function ocultarLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
    const autoContent = document.getElementById('auto-content');
    if (autoContent) autoContent.classList.remove('hidden');
}

function mostrarError(mensaje) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.innerHTML = `
            <div class="text-center text-red-500">
                <span class="material-symbols-outlined text-6xl">error</span>
                <p class="text-xl font-bold">${mensaje}</p>
                <a href="Inventory Page.html" class="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">Volver al Inventario</a>
            </div>
        `;
    }
}