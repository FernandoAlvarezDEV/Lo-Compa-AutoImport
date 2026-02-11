// Calculadora de financiamiento.js

document.addEventListener('DOMContentLoaded', async () => {
    const btnNuevo = document.getElementById('btnNuevo');
    const btnUsado = document.getElementById('btnUsado');
    const containerAnio = document.getElementById('containerAnio');
    const inputInicial = document.getElementById('inputInicial');
    const inputMonto = document.getElementById('inputMonto');
    const spanPorcInicial = document.getElementById('spanPorcInicial');
    const spanPorcMonto = document.getElementById('spanPorcMonto');
    const selectPlazo = document.getElementById('selectPlazo');
    const selectAnio = document.getElementById('selectAnio');
    const btnActualizar = document.getElementById('btnActualizar');
    const listaFinancieras = document.getElementById('listaFinancieras');
    const notaCalculo = document.getElementById('notaCalculo');
    const numEntidades = document.getElementById('numEntidades');
    const minTasa = document.getElementById('minTasa');
    const maxTasa = document.getElementById('maxTasa');

    // === NUEVO CÓDIGO: Leer datos de localStorage y prellenar ===
    let TASA_DOLAR = 58.50; // Fallback si falla la API
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data.rates && data.rates.DOP) {
            TASA_DOLAR = data.rates.DOP;
        }
    } catch (error) {
        console.error('Error al obtener tasa de cambio:', error);
        Toastify({
            text: "Error al obtener tasa de cambio. Usando valor aproximado.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ff5f6d",
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
            }
        }).showToast();
    }

    const dataString = localStorage.getItem('financiamientoData');
    if (dataString) {
        const data = JSON.parse(dataString);
        const precioUSD = data.precio || 0;
        const porcInicial = data.porcInicial || 20;
        const meses = data.meses || 36; // Default a 36 si no hay
        const auto = data.auto || { anio: 2026 }; // Default a nuevo

        // Limpiar localStorage
        localStorage.removeItem('financiamientoData');

        // Determinar tipo: usado si año < 2026
        const esUsado = auto.anio < 2026;
        if (esUsado) {
            btnUsado.click(); // Simula clic para seleccionar "Usado"
            selectAnio.value = auto.anio.toString(); // Prellena el año
        } else {
            btnNuevo.click(); // Simula clic para "Nuevo"
        }

        // Calcular valores en RD$
        const inicialRD = Math.round(precioUSD * (porcInicial / 100) * TASA_DOLAR);
        const montoRD = Math.round(precioUSD * (1 - porcInicial / 100) * TASA_DOLAR);

        // Prellenar inputs (formateados con comas)
        inputInicial.value = inicialRD.toLocaleString('es-DO');
        inputMonto.value = montoRD.toLocaleString('es-DO');

        // Prellenar plazo
        selectPlazo.value = meses.toString();

        // Actualizar porcentajes
        updatePorcentajes();

        // Trigger cálculo automático
        btnActualizar.click();
    }
    // === FIN DEL NUEVO CÓDIGO ===

    // Instituciones financieras
    const instituciones = [
        {
            name: 'Banco Promerica',
            tasa: 15.9,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/Proamerica.png' // Asume que tienes el logo en el directorio
        },
        {
            name: 'Motor Crédito',
            tasa: 16.95,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/Motor Credito.png'
        },
        {
            name: 'Banco BACC',
            tasa: 19.0,
            maxPrestar: 80,
            plazoMax: 60,
            gastos: 'Incluidos',
            fija: true,
            logo: '../Fotos Bancos/BACC.png'
        },
        {
            name: 'Scotiabank',
            tasa: 12.3,
            maxPrestar: 100,
            plazoMax: 84,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/ScotiaBank.png'
        },
        {
            name: 'Banco Popular',
            tasa: 12.75,
            maxPrestar: 90,
            plazoMax: 84,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/banco popular.png'
        },
        {
            name: 'APAP',
            tasa: 14.5,
            maxPrestarNew: 80,
            maxPrestarUsed: 75,
            plazoMaxNew: 72,
            plazoMaxUsed: 60,
            gastos: 'Incluidos',
            fija: true,
            logo: '../Fotos Bancos/APAP.png'
        },
        {
            name: 'Banco BHD',
            tasa: 14.0,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/BHD.jpg',
            maxAge: 5
        },
        {
            name: '../Banco Lafise',
            tasa: 14.0,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/LAFISE.png'
        }
    ];

    // Función para calcular el pago mensual
    function calculatePMT(pv, r, n) {
        if (r === 0) return pv / n;
        const monthlyRate = r;
        return pv * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    // Actualizar porcentajes
    function updatePorcentajes() {
        let ini = parseFloat(inputInicial.value.replace(/,/g, '')) || 0;
        let mon = parseFloat(inputMonto.value.replace(/,/g, '')) || 0;
        let total = ini + mon;
        if (total > 0) {
            spanPorcInicial.innerText = `(${Math.round(ini / total * 100)}%)`;
            spanPorcMonto.innerText = `(${Math.round(mon / total * 100)}%)`;
        } else {
            spanPorcInicial.innerText = '(0%)';
            spanPorcMonto.innerText = '(0%)';
        }
    }

    // Toggle tipo de vehículo
    btnNuevo.addEventListener('click', () => {
        btnNuevo.classList.add('bg-white', 'dark:bg-slate-700', 'shadow-sm');
        btnNuevo.classList.remove('text-slate-500');
        btnUsado.classList.remove('bg-white', 'dark:bg-slate-700', 'shadow-sm');
        btnUsado.classList.add('text-slate-500');
        containerAnio.style.display = 'none';
    });

    btnUsado.addEventListener('click', () => {
        btnUsado.classList.add('bg-white', 'dark:bg-slate-700', 'shadow-sm');
        btnUsado.classList.remove('text-slate-500');
        btnNuevo.classList.remove('bg-white', 'dark:bg-slate-700', 'shadow-sm');
        btnNuevo.classList.add('text-slate-500');
        containerAnio.style.display = 'block';
    });

    // Eventos para actualizar porcentajes
    inputInicial.addEventListener('input', updatePorcentajes);
    inputMonto.addEventListener('input', updatePorcentajes);

    // Calcular
    btnActualizar.addEventListener('click', () => {
        const tipo = containerAnio.style.display === 'block' ? 'usado' : 'nuevo';
        const anio = parseInt(selectAnio.value) || 2026;
        const age = 2026 - anio;
        const inicial = parseFloat(inputInicial.value.replace(/[,.]/g, '')) || 0;
        const monto = parseFloat(inputMonto.value.replace(/[,.]/g, '')) || 0;
        const plazo = parseInt(selectPlazo.value);

        if (monto <= 0) {
            alert('Ingrese un monto a financiar válido.');
            return;
        } if (inicial >= (inicial + monto)) {
            Toastify({
                text: "Monto a financiar no válido",
                duration: 3000,          // Se cierra automáticamente en 3 segundos
                close: true,             // Muestra un botón 'X' para cerrar
                gravity: "top",          // "top" o "bottom"
                position: "right",       // "left", "center" o "right"
                stopOnFocus: true,       // Evita que se cierre si el usuario pasa el mouse por encima
                style: {
                    background: "#ff5f6d", // Un color rojizo para indicar error
                    borderRadius: "10px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
                },
                onClick: function(){}    // Callback después de hacer click
            }).showToast();
            return; 
        }


        const percentFinanced = (monto / (monto + inicial)) * 100;

        let eligibleInst = instituciones.filter(inst => {
            const maxPrestar = tipo === 'nuevo' ? (inst.maxPrestarNew || inst.maxPrestar) : (inst.maxPrestarUsed || inst.maxPrestar);
            const plazoMax = tipo === 'nuevo' ? (inst.plazoMaxNew || inst.plazoMax) : (inst.plazoMaxUsed || inst.plazoMax);
            if (tipo === 'usado' && inst.maxAge && age > inst.maxAge) return false;
            return percentFinanced <= maxPrestar && plazo <= plazoMax;
        });

        // Calcular cuotas y ordenar por tasa ascendente (mejor tasa primero)
        eligibleInst = eligibleInst.map(inst => {
            const monthlyRate = inst.tasa / 100 / 12;
            const cuota = calculatePMT(monto, monthlyRate, plazo);
            return { ...inst, cuota };
        }).sort((a, b) => a.tasa - b.tasa);

        const num = eligibleInst.length;
        if (num > 0) {
            const minT = Math.min(...eligibleInst.map(i => i.tasa)).toFixed(2);
            const maxT = Math.max(...eligibleInst.map(i => i.tasa)).toFixed(2);
            numEntidades.innerText = `${num} entidades`;
            minTasa.innerText = `${minT}%`;
            maxTasa.innerText = `${maxT}%`;
            notaCalculo.style.display = 'block';
        } else {
            numEntidades.innerText = '0 entidades';
            minTasa.innerText = '--';
            maxTasa.innerText = '--';
            notaCalculo.style.display = 'none';
            listaFinancieras.innerHTML = '<p class="text-center text-slate-500">No hay entidades disponibles para estos parámetros.</p>';
            return;
        }

        listaFinancieras.innerHTML = '';
        const lowestTasa = Math.min(...eligibleInst.map(i => i.tasa));

        eligibleInst.forEach(inst => {
            const maxP = tipo === 'nuevo' ? (inst.maxPrestarNew || inst.maxPrestar) : (inst.maxPrestarUsed || inst.maxPrestar);
            const plazoM = tipo === 'nuevo' ? (inst.plazoMaxNew || inst.plazoMax) : (inst.plazoMaxUsed || inst.plazoMax);
            const isBest = inst.tasa === lowestTasa;
            const nameClass = isBest ? 'text-green-600' : '';
            const card = document.createElement('div');
            card.classList.add('bg-white', 'dark:bg-slate-900', 'rounded-xl', 'shadow-sm', 'border', 'border-slate-200', 'dark:border-slate-800', 'p-6');
            card.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        ${inst.logo ? `<img src="${inst.logo}" alt="${inst.name}" class="h-10 w-auto">` : ''}
                        <h3 class="text-xl font-bold ${nameClass}">${inst.name}${isBest ? ' <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Mejor Tasa</span>' : ''}</h3>
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Tasa ${inst.tasa.toFixed(2)}% EA</span>
                </div>
                <div class="text-right">
                    <p class="text-sm text-slate-500 uppercase">Cuota Mensual</p>
                    <p class="text-3xl font-bold text-blue-600">RD$ ${inst.cuota.toLocaleString('es-DO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6 text-sm">
                    <div>
                        <p class="text-slate-500">Máximo a prestar:</p>
                        <p class="font-medium">${maxP}%</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Gastos legales:</p>
                        <p class="font-medium">${inst.gastos}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Plazo máximo:</p>
                        <p class="font-medium">${plazoM} meses</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Tasa fija:</p>
                        <p class="font-medium">${inst.fija ? 'Sí' : 'No'}</p>
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button class="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium">Aplicar en Línea</button>
                    <button class="px-6 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium">Info</button>
                    <button class="px-6 bg-blue-100 text-blue-800 py-3 rounded-lg font-medium">Comparar</button>
                </div>
            `;
            listaFinancieras.appendChild(card);
        });
    });
});