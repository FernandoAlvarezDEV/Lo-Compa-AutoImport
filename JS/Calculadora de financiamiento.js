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



    // Instituciones financieras
    const instituciones = [
        {
            name: 'Banco Promerica',
            tasa: 15.9,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/Proamerica.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Móvil/App, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '60 meses',
                plazoMaxUsados: '48 meses',
                levantamientoOposicion: 'RD$ 1,200',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '85%',
                porcFinanciadoUsados: '80%',
                antiguedadMaxUsados: '10 años',
                frecuenciaRevisionTasa: 'Bianual',
                ingresoMinimo: 'RD$ 25,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Motor Crédito',
            tasa: 16.95,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/Motor Credito.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'Sí',
                penalidadSaldoAnticipado: 'Sí',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Sucursales, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '60 meses',
                plazoMaxUsados: '60 meses',
                levantamientoOposicion: 'RD$ 1,500',
                requierePolizaVida: 'No',
                porcFinanciadoNuevos: '85%',
                porcFinanciadoUsados: '80%',
                antiguedadMaxUsados: '12 años',
                frecuenciaRevisionTasa: 'Anual',
                ingresoMinimo: 'RD$ 20,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Banco BACC',
            tasa: 19.0,
            maxPrestar: 80,
            plazoMax: 60,
            gastos: 'Incluidos',
            fija: true,
            logo: '../Fotos Bancos/BACC.png',
            info: {
                pagosExtraordinarios: 'No',
                gastosCierre: 'Incluidos',
                gastosLegales: 'Incluidos',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '60 meses',
                plazoMaxUsados: '48 meses',
                levantamientoOposicion: 'RD$ 1,000',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '80%',
                porcFinanciadoUsados: '75%',
                antiguedadMaxUsados: '8 años',
                frecuenciaRevisionTasa: 'Semestral',
                ingresoMinimo: 'RD$ 30,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Scotiabank',
            tasa: 12.3,
            maxPrestar: 100,
            plazoMax: 84,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/ScotiaBank.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Móvil/App, Transferencia Bancaria, Sucursales',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '84 meses',
                plazoMaxUsados: '72 meses',
                levantamientoOposicion: 'RD$ 1,800',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '100%',
                porcFinanciadoUsados: '90%',
                antiguedadMaxUsados: '15 años',
                frecuenciaRevisionTasa: 'Bianual',
                ingresoMinimo: 'RD$ 35,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Banco Popular',
            tasa: 12.75,
            maxPrestar: 90,
            plazoMax: 84,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/banco popular.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Móvil/App, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '84 meses',
                plazoMaxUsados: '60 meses',
                levantamientoOposicion: 'RD$ 1,300',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '85%',
                porcFinanciadoUsados: '80%',
                antiguedadMaxUsados: '15 años',
                frecuenciaRevisionTasa: 'Bianual',
                ingresoMinimo: 'RD$ 30,000',
                actualizacion: '2026-04-12'
            }
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
            logo: '../Fotos Bancos/APAP.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Incluidos',
                gastosLegales: 'Incluidos',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Móvil/App, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '72 meses',
                plazoMaxUsados: '60 meses',
                levantamientoOposicion: 'RD$ 1,100',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '80%',
                porcFinanciadoUsados: '75%',
                antiguedadMaxUsados: '12 años',
                frecuenciaRevisionTasa: 'Semestral',
                ingresoMinimo: 'RD$ 28,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Banco BHD',
            tasa: 14.0,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/BHD.jpg',
            maxAge: 5,
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Móvil/App, Transferencia Bancaria, Sucursales',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '60 meses',
                plazoMaxUsados: '48 meses',
                levantamientoOposicion: 'RD$ 1,400',
                requierePolizaVida: 'Sí',
                porcFinanciadoNuevos: '85%',
                porcFinanciadoUsados: '80%',
                antiguedadMaxUsados: '5 años',
                frecuenciaRevisionTasa: 'Bianual',
                ingresoMinimo: 'RD$ 32,000',
                actualizacion: '2026-04-12'
            }
        },
        {
            name: 'Banco Lafise',
            tasa: 14.0,
            maxPrestar: 85,
            plazoMax: 60,
            gastos: 'Si',
            fija: true,
            logo: '../Fotos Bancos/LAFISE.png',
            info: {
                pagosExtraordinarios: 'Sí',
                gastosCierre: 'Sí',
                gastosLegales: 'Sí',
                penalidadAbonoCap: 'No',
                penalidadSaldoAnticipado: 'No',
                financiamientoPolizaSeguro: 'Sí',
                redesDePago: 'Internet Banking, Transferencia Bancaria',
                financiaNuevos: 'Sí',
                financiaUsados: 'Sí',
                plazoMaxNuevos: '60 meses',
                plazoMaxUsados: '48 meses',
                levantamientoOposicion: 'RD$ 1,250',
                requierePolizaVida: 'No',
                porcFinanciadoNuevos: '85%',
                porcFinanciadoUsados: '80%',
                antiguedadMaxUsados: '10 años',
                frecuenciaRevisionTasa: 'Anual',
                ingresoMinimo: 'RD$ 25,000',
                actualizacion: '2026-04-12'
            }
        }
    ];

    // ─── Límite máximo razonable para los campos (RD$ 99,999,999) ───
    const MAX_INPUT_VALUE = 99_999_999;

    // ─── Parsear: elimina comas (separadores de miles) y devuelve número ───
    function parsearMonto(str) {
        if (!str) return 0;
        const limpio = str.replace(/,/g, '').trim();
        const num = parseFloat(limpio);
        return isNaN(num) ? 0 : Math.min(num, MAX_INPUT_VALUE);
    }

    // ─── Formatear número con comas de miles (sin decimales para RD$) ───
    function formatearMonto(num) {
        if (isNaN(num) || num === 0) return '';
        return Math.floor(num).toLocaleString('en-US'); // 1,250,000
    }

    // ─── Aplicar máscara a un input: solo dígitos, con comas automáticas ───
    function aplicarMascaraInput(input) {
        input.addEventListener('keydown', (e) => {
            // Permitir: teclas de control, flechas, Tab, Retroceso, Delete
            const permitidas = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
            if (permitidas.includes(e.key)) return;
            // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (e.ctrlKey || e.metaKey) return;
            // Bloquear cualquier carácter que no sea dígito
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
                return;
            }
            // Bloquear si ya llegó al máximo de dígitos (9 dígitos = 999,999,999)
            const rawVal = input.value.replace(/,/g, '');
            if (rawVal.length >= 9) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', () => {
            const cursor = input.selectionStart;
            const prevLen = input.value.length;

            // Limpiar y parsear
            const raw = input.value.replace(/[^0-9]/g, '');
            const num = Math.min(parseInt(raw || '0', 10), MAX_INPUT_VALUE);

            // Reformatear con comas
            const formatted = num > 0 ? num.toLocaleString('en-US') : '';
            input.value = formatted;

            // Restaurar posición del cursor ajustada por comas añadidas/quitadas
            const newLen = input.value.length;
            const newCursor = cursor + (newLen - prevLen);
            input.setSelectionRange(newCursor, newCursor);
        });

        // Al perder foco: asegurar formato limpio
        input.addEventListener('blur', () => {
            const num = parsearMonto(input.value);
            input.value = num > 0 ? formatearMonto(num) : '';
        });

        // Al ganar foco: seleccionar todo para facilitar edición
        input.addEventListener('focus', () => {
            setTimeout(() => input.select(), 0);
        });
    }

    // Aplicar máscara a los dos inputs de dinero
    aplicarMascaraInput(inputInicial);
    aplicarMascaraInput(inputMonto);

    // Función para calcular el pago mensual (fórmula PMT estándar)
    // Asume tasa NOMINAL anual convertible mensualmente (TNA)
    function calculatePMT(pv, r, n) {
        if (r === 0) return pv / n;
        if (n <= 0 || isNaN(n)) return 0;
        if (pv <= 0) return 0;
        return pv * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    // Actualizar porcentajes y préstamo calculado
    function updatePorcentajes() {
        const ini   = parsearMonto(inputInicial.value);
        const precio = parsearMonto(inputMonto.value);
        const prestamo = precio - ini;
        const spanPrestamo = document.getElementById('spanPrestamo');

        if (precio > 0) {
            // Inicial = X% del precio total
            spanPorcInicial.innerText = `(${Math.round(ini / precio * 100)}%)`;
            // Préstamo = restante % del precio total
            const porcPrestamo = prestamo > 0 ? Math.round(prestamo / precio * 100) : 0;
            spanPorcMonto.innerText = `(${porcPrestamo}%)`;
        } else {
            spanPorcInicial.innerText = '(0%)';
            spanPorcMonto.innerText = '(0%)';
        }

        // Mostrar monto del préstamo calculado
        if (spanPrestamo) {
            if (prestamo > 0) {
                spanPrestamo.textContent = `RD$ ${prestamo.toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                spanPrestamo.style.color = '';
            } else if (ini > 0 && precio > 0 && prestamo <= 0) {
                spanPrestamo.textContent = '⚠ Inicial ≥ Precio Total';
                spanPrestamo.style.color = '#CE1126';
            } else {
                spanPrestamo.textContent = 'RD$ 0';
                spanPrestamo.style.color = '';
            }
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
        const anioActual = new Date().getFullYear(); // ✅ Siempre usa el año real
        const anio = parseInt(selectAnio.value) || anioActual;
        const age = anioActual - anio;
        const inicial = parsearMonto(inputInicial.value);
        const monto   = parsearMonto(inputMonto.value);
        const plazo   = parseInt(selectPlazo.value);

        // ── Validaciones ──
        if (isNaN(plazo) || plazo <= 0) {
            alert('Seleccione un plazo válido.');
            return;
        }
        if (monto <= 0) {
            Toastify({
                text: "Ingrese un monto a financiar válido (mayor que 0).",
                duration: 3500, close: true, gravity: "top", position: "right",
                style: { background: "#ff5f6d", borderRadius: "10px" }
            }).showToast();
            return;
        }
        if (inicial < 0) {
            Toastify({
                text: "El pago inicial no puede ser negativo.",
                duration: 3500, close: true, gravity: "top", position: "right",
                style: { background: "#ff5f6d", borderRadius: "10px" }
            }).showToast();
            return;
        }
        // Advertencia si el inicial supera el total (error de entrada)
        // ── Nuevo modelo: monto = precio total, prestamo real = monto - inicial ──
        const precioTotal = monto;           // el campo "Precio Total del Vehículo"
        const prestamo    = monto - inicial; // monto real a financiar

        // Validación: el préstamo debe ser positivo
        if (prestamo <= 0) {
            Toastify({
                text: `El pago inicial (RD$ ${inicial.toLocaleString('es-DO')}) es mayor o igual al precio del vehículo. Revise los montos.`,
                duration: 4500, close: true, gravity: "top", position: "right",
                style: { background: "#ff5f6d", borderRadius: "10px" }
            }).showToast();
            return;
        }

        // % del precio total que se financia (para comparar con límite del banco)
        const percentFinanced = (prestamo / precioTotal) * 100;

        let eligibleInst = instituciones.filter(inst => {
            const maxPrestar = tipo === 'nuevo' ? (inst.maxPrestarNew || inst.maxPrestar) : (inst.maxPrestarUsed || inst.maxPrestar);
            const plazoMax = tipo === 'nuevo' ? (inst.plazoMaxNew || inst.plazoMax) : (inst.plazoMaxUsed || inst.plazoMax);
            if (tipo === 'usado' && inst.maxAge && age > inst.maxAge) return false;
            return percentFinanced <= maxPrestar && plazo <= plazoMax;
        });

        // ✅ PMT usa el monto REAL a financiar (precio - inicial)
        eligibleInst = eligibleInst.map(inst => {
            const monthlyRate = inst.tasa / 100 / 12;
            const cuota = calculatePMT(prestamo, monthlyRate, plazo);
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
            const i = inst.info || {};

            // Build the info panel HTML
            const infoPanelHTML = inst.info ? `
            <div class="info-panel" style="display:none; overflow:hidden; transition: all 0.3s ease;">
                <div style="border-top: 1px solid #e5e7eb; margin-top: 1rem; padding-top: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1.5rem; font-size: 0.85rem;">
                        <div><span style="color:#64748b;">Pagos extraordinarios:</span> <strong>${i.pagosExtraordinarios || '-'}</strong></div>
                        <div><span style="color:#64748b;">Financia vehículos nuevos:</span> <strong>${i.financiaNuevos || '-'}</strong></div>
                        <div><span style="color:#64748b;">% Financiado nuevos:</span> <strong>${i.porcFinanciadoNuevos || '-'}</strong></div>
                        <div><span style="color:#64748b;">Gastos cierre:</span> <strong>${i.gastosCierre || '-'}</strong></div>
                        <div><span style="color:#64748b;">Financia vehículos usados:</span> <strong>${i.financiaUsados || '-'}</strong></div>
                        <div><span style="color:#64748b;">% Financiado usados:</span> <strong>${i.porcFinanciadoUsados || '-'}</strong></div>
                        <div><span style="color:#64748b;">Gastos legales:</span> <strong>${i.gastosLegales || '-'}</strong></div>
                        <div><span style="color:#64748b;">Plazo máximo nuevos:</span> <strong>${i.plazoMaxNuevos || '-'}</strong></div>
                        <div><span style="color:#64748b;">Antigüedad máx. usados:</span> <strong>${i.antiguedadMaxUsados || '-'}</strong></div>
                        <div><span style="color:#64748b;">Penalidad abono capital:</span> <strong>${i.penalidadAbonoCap || '-'}</strong></div>
                        <div><span style="color:#64748b;">Plazo máximo usados:</span> <strong>${i.plazoMaxUsados || '-'}</strong></div>
                        <div><span style="color:#64748b;">Frecuencia revisión tasa:</span> <strong>${i.frecuenciaRevisionTasa || '-'}</strong></div>
                        <div><span style="color:#64748b;">Penalidad saldo anticipado:</span> <strong>${i.penalidadSaldoAnticipado || '-'}</strong></div>
                        <div><span style="color:#64748b;">Levantamiento Oposición:</span> <strong>${i.levantamientoOposicion || '-'}</strong></div>
                        <div><span style="color:#64748b;">Ingresos Mínimos:</span> <strong>${i.ingresoMinimo || '-'}</strong></div>
                        <div><span style="color:#64748b;">Financiamiento Póliza Seguro:</span> <strong>${i.financiamientoPolizaSeguro || '-'}</strong></div>
                        <div><span style="color:#64748b;">Requiere Póliza Seguro de Vida:</span> <strong>${i.requierePolizaVida || '-'}</strong></div>
                    </div>
                    <div style="margin-top: 0.75rem; font-size: 0.85rem;">
                        <span style="color:#64748b;">Redes de Pago:</span> <strong>${i.redesDePago || '-'}</strong>
                    </div>
                    <div style="margin-top: 0.75rem; font-size: 0.75rem; color: #94a3b8;">
                        Información actualizada el ${i.actualizacion || '-'}
                    </div>
                    <button class="btn-cerrar-info" style="margin-top: 0.75rem; background: #CE1126; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">Cerrar/ocultar detalle</button>
                </div>
            </div>` : '';

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
                    <button class="btn-aplicar flex-1 bg-dr-red hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-base">send</span> Aplicar en Línea
                    </button>
                    <button class="btn-info px-6 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        <span style="display:flex; align-items:center; gap:0.3rem;">
                            <span class="material-symbols-outlined" style="font-size:1.1rem;">info</span> Info
                        </span>
                    </button>
                    <button class="btn-comparar px-5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 py-3 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-all flex items-center gap-1.5">
                        <span class="material-symbols-outlined" style="font-size:1.1rem;">compare_arrows</span>
                        <span class="btn-comparar-text">Comparar</span>
                    </button>
                </div>
                ${infoPanelHTML}
            `;

            // Wire up Info button toggle
            const btnInfo = card.querySelector('.btn-info');
            const infoPanel = card.querySelector('.info-panel');
            const btnCerrar = card.querySelector('.btn-cerrar-info');

            if (btnInfo && infoPanel) {
                btnInfo.addEventListener('click', () => {
                    const isHidden = infoPanel.style.display === 'none';
                    infoPanel.style.display = isHidden ? 'block' : 'none';
                    btnInfo.style.background = isHidden ? '#dbeafe' : '';
                    btnInfo.style.color = isHidden ? '#1d4ed8' : '';
                });
            }

            if (btnCerrar && infoPanel) {
                btnCerrar.addEventListener('click', () => {
                    infoPanel.style.display = 'none';
                    if (btnInfo) {
                        btnInfo.style.background = '';
                        btnInfo.style.color = '';
                    }
                });
            }

            // Wire up "Comparar" button
            const btnComparar = card.querySelector('.btn-comparar');
            if (btnComparar) {
                btnComparar.addEventListener('click', () => {
                    toggleComparacion(inst, btnComparar);
                });
            }

            // Wire up "Aplicar en Línea" button
            const btnAplicar = card.querySelector('.btn-aplicar');
            if (btnAplicar) {
                btnAplicar.addEventListener('click', () => {
                    const solicitudData = {
                        tipo, anio,
                        inicial:     inicial,
                        precioTotal: monto,        // precio total del vehículo
                        monto:       prestamo,     // monto real a financiar (precio - inicial)
                        plazo,
                        tasa:     inst.tasa,
                        cuota:    inst.cuota,
                        bankName: inst.name,
                        bankLogo: inst.logo || '',
                        info:     inst.info || {}
                    };
                    localStorage.setItem('solicitudFinanciamiento', JSON.stringify(solicitudData));
                    window.location.href = 'Solicitar Financiamiento.html';
                });
            }

            listaFinancieras.appendChild(card);
        });

        // Reset comparison when results are recalculated
        comparacionActual = [];
        actualizarBarraComparacion();
    });

    // ═══════════════════════════════════════════════════════════════
    // SISTEMA DE COMPARACIÓN
    // ═══════════════════════════════════════════════════════════════
    let comparacionActual = [];
    const MAX_COMPARAR = 3;

    function toggleComparacion(inst, btn) {
        const idx = comparacionActual.findIndex(i => i.name === inst.name);
        if (idx >= 0) {
            // Ya está → quitar
            comparacionActual.splice(idx, 1);
            btn.classList.remove('bg-blue-600', 'text-white', 'dark:bg-blue-600');
            btn.classList.add('bg-blue-100', 'dark:bg-blue-900/40', 'text-blue-800', 'dark:text-blue-300');
            btn.querySelector('.btn-comparar-text').textContent = 'Comparar';
        } else {
            if (comparacionActual.length >= MAX_COMPARAR) {
                Toastify({
                    text: `Máximo ${MAX_COMPARAR} entidades para comparar. Quita una primero.`,
                    duration: 3000, close: true, gravity: "top", position: "right",
                    style: { background: "#f59e0b", borderRadius: "10px" }
                }).showToast();
                return;
            }
            comparacionActual.push(inst);
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-blue-100', 'dark:bg-blue-900/40', 'text-blue-800', 'dark:text-blue-300');
            btn.querySelector('.btn-comparar-text').textContent = '✓ Agregado';
        }
        actualizarBarraComparacion();
    }

    function actualizarBarraComparacion() {
        let barra = document.getElementById('barra-comparacion');
        if (!barra) {
            barra = document.createElement('div');
            barra.id = 'barra-comparacion';
            barra.style.cssText = `
                position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
                background: #003876; color: white;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
                transition: transform 0.3s ease;
                transform: translateY(100%);
                padding: 1rem 2rem;
                display: flex; align-items: center; justify-content: space-between; gap: 1rem;
                flex-wrap: wrap;
            `;
            document.body.appendChild(barra);
        }

        if (comparacionActual.length < 2) {
            barra.style.transform = 'translateY(100%)';
            return;
        }

        barra.style.transform = 'translateY(0)';
        barra.innerHTML = `
            <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap; flex:1;">
                <span style="font-size:0.8rem; opacity:0.8; white-space:nowrap;">
                    <strong>${comparacionActual.length}</strong> bancos seleccionados:
                </span>
                ${comparacionActual.map(i => `
                    <div style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.15); padding:0.4rem 0.8rem; border-radius:999px; font-size:0.82rem; font-weight:600;">
                        ${i.name}
                        <span style="font-size:0.75rem; opacity:0.8;">RD$ ${Number(i.cuota).toLocaleString('es-DO',{minimumFractionDigits:0,maximumFractionDigits:0})}/mes</span>
                    </div>
                `).join('')}
            </div>
            <div style="display:flex; gap:0.75rem;">
                <button id="btn-limpiar-comp" style="padding:0.5rem 1.2rem; border-radius:8px; font-size:0.82rem; font-weight:700; background:rgba(255,255,255,0.15); color:white; border:none; cursor:pointer;">
                    Limpiar
                </button>
                <button id="btn-ver-comparacion" style="padding:0.6rem 1.5rem; border-radius:8px; font-size:0.85rem; font-weight:800; background:#CE1126; color:white; border:none; cursor:pointer; display:flex; align-items:center; gap:0.4rem;">
                    <span class="material-symbols-outlined" style="font-size:1rem;">compare_arrows</span>
                    Comparar Ahora
                </button>
            </div>
        `;

        document.getElementById('btn-limpiar-comp').addEventListener('click', () => {
            comparacionActual = [];
            // Reset all buttons
            document.querySelectorAll('.btn-comparar').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-blue-100', 'dark:bg-blue-900/40', 'text-blue-800', 'dark:text-blue-300');
                b.querySelector('.btn-comparar-text').textContent = 'Comparar';
            });
            actualizarBarraComparacion();
        });

        document.getElementById('btn-ver-comparacion').addEventListener('click', () => {
            abrirModalComparacion();
        });
    }

    function abrirModalComparacion() {
        // Remove old modal if exists
        const old = document.getElementById('modal-comparacion');
        if (old) old.remove();

        const insts = comparacionActual;
        const isDark = document.documentElement.classList.contains('dark');

        // Build rows
        const filas = [
            { label: 'Cuota Mensual',               key: i => `<strong style="color:#CE1126; font-size:1.2rem;">RD$ ${Number(i.cuota).toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>` },
            { label: 'Tasa Efectiva Anual',          key: i => `<strong>${i.tasa.toFixed(2)}%</strong>` },
            { label: 'Máximo a Prestar',             key: i => `${i.maxPrestar || i.maxPrestarNew || '—'}%` },
            { label: 'Plazo Máximo',                 key: i => `${i.plazoMax || i.plazoMaxNew || '—'} meses` },
            { label: 'Gastos Legales',               key: i => i.gastos || '—' },
            { label: 'Tasa Fija',                    key: i => i.fija ? 'Sí' : 'No' },
            { label: '% Financiado Nuevos',          key: i => i.info?.porcFinanciadoNuevos || '—' },
            { label: '% Financiado Usados',          key: i => i.info?.porcFinanciadoUsados || '—' },
            { label: 'Plazo Máx. Nuevos',            key: i => i.info?.plazoMaxNuevos || '—' },
            { label: 'Plazo Máx. Usados',            key: i => i.info?.plazoMaxUsados || '—' },
            { label: 'Antigüedad Máx. Usados',       key: i => i.info?.antiguedadMaxUsados || '—' },
            { label: 'Pagos Extraordinarios',        key: i => i.info?.pagosExtraordinarios || '—' },
            { label: 'Penalidad Abono Capital',      key: i => i.info?.penalidadAbonoCap || '—' },
            { label: 'Penalidad Saldo Anticipado',   key: i => i.info?.penalidadSaldoAnticipado || '—' },
            { label: 'Levantamiento Oposición',      key: i => i.info?.levantamientoOposicion || '—' },
            { label: 'Requiere Póliza de Vida',      key: i => i.info?.requierePolizaVida || '—' },
            { label: 'Financ. Póliza Seguro',        key: i => i.info?.financiamientoPolizaSeguro || '—' },
            { label: 'Frecuencia Revisión Tasa',     key: i => i.info?.frecuenciaRevisionTasa || '—' },
            { label: 'Ingresos Mínimos',             key: i => i.info?.ingresoMinimo || '—' },
            { label: 'Redes de Pago',                key: i => i.info?.redesDePago || '—' },
        ];

        const colWidth = `${Math.floor(70 / insts.length)}%`;
        const bgCard  = isDark ? '#1e293b' : '#ffffff';
        const bgModal = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)';
        const bgRow1  = isDark ? '#0f172a'  : '#f8fafc';
        const textMain = isDark ? '#f1f5f9' : '#0f172a';
        const textSub  = isDark ? '#94a3b8' : '#64748b';
        const borderC  = isDark ? '#334155' : '#e2e8f0';

        // Find lowest tasa for highlighting
        const minTasaComp = Math.min(...insts.map(i => i.tasa));

        const modal = document.createElement('div');
        modal.id = 'modal-comparacion';
        modal.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            background:${bgModal};
            display:flex; align-items:center; justify-content:center;
            padding:1rem; backdrop-filter:blur(4px);
        `;

        modal.innerHTML = `
        <div style="background:${bgCard}; border-radius:16px; width:100%; max-width:900px;
                    max-height:90vh; overflow-y:auto; box-shadow:0 25px 60px rgba(0,0,0,0.4);
                    color:${textMain}; position:relative;">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#003876,#0055b3); color:white; padding:1.25rem 1.5rem;
                        border-radius:16px 16px 0 0; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    <span class="material-symbols-outlined">compare_arrows</span>
                    <span style="font-size:1.1rem; font-weight:800;">Comparación de Entidades Financieras</span>
                </div>
                <button id="btn-cerrar-modal-comp" style="background:rgba(255,255,255,0.2); border:none; color:white;
                    width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:1.1rem;
                    display:flex; align-items:center; justify-content:center;">✕</button>
            </div>

            <!-- Bank header row -->
            <div style="display:grid; grid-template-columns:30% ${insts.map(() => colWidth).join(' ')};
                        border-bottom:2px solid ${borderC}; padding:1rem 1.5rem; gap:1rem; align-items:center;">
                <div style="font-size:0.75rem; color:${textSub}; font-weight:700; text-transform:uppercase;">Entidad</div>
                ${insts.map(i => `
                    <div style="text-align:center;">
                        ${i.logo ? `<img src="${i.logo}" alt="${i.name}" style="height:36px; object-fit:contain; display:block; margin:0 auto 0.4rem;">` : ''}
                        <div style="font-weight:800; font-size:0.9rem; ${i.tasa === minTasaComp ? 'color:#16a34a;' : ''}">
                            ${i.name}
                            ${i.tasa === minTasaComp ? '<br><span style="font-size:0.7rem; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:999px;">✓ Mejor Tasa</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Data rows -->
            ${filas.map((fila, idx) => `
                <div style="display:grid;
                    grid-template-columns:30% ${insts.map(() => colWidth).join(' ')};
                    padding:0.6rem 1.5rem; gap:1rem; align-items:center;
                    background:${idx % 2 === 0 ? bgRow1 : bgCard};
                    border-bottom:1px solid ${borderC};">
                    <div style="font-size:0.8rem; color:${textSub}; font-weight:600;">${fila.label}</div>
                    ${insts.map(i => `
                        <div style="text-align:center; font-size:0.85rem;">${fila.key(i)}</div>
                    `).join('')}
                </div>
            `).join('')}

            <!-- Action row -->
            <div style="display:grid; grid-template-columns:30% ${insts.map(() => colWidth).join(' ')};
                        padding:1rem 1.5rem; gap:1rem; border-top:2px solid ${borderC}; margin-top:0.25rem;">
                <div></div>
                ${insts.map(i => `
                    <div style="text-align:center;">
                        <button class="btn-aplicar-modal"
                            data-inst="${encodeURIComponent(JSON.stringify({name:i.name,tasa:i.tasa,cuota:i.cuota,logo:i.logo||'',info:i.info||{}}))}"
                            style="width:100%; background:#CE1126; color:white; border:none;
                            padding:0.6rem; border-radius:8px; font-weight:700; font-size:0.8rem;
                            cursor:pointer; transition:background 0.2s;">
                            Aplicar en Línea
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>`;

        document.body.appendChild(modal);

        // Close modal
        document.getElementById('btn-cerrar-modal-comp').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

        // Aplicar desde modal
        modal.querySelectorAll('.btn-aplicar-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const instData = JSON.parse(decodeURIComponent(btn.dataset.inst));
                const solicitudData = {
                    tipo, anio,
                    inicial:     inicial,
                    precioTotal: monto,
                    monto:       prestamo,
                    plazo,
                    tasa: instData.tasa, cuota: instData.cuota,
                    bankName: instData.name, bankLogo: instData.logo, info: instData.info
                };
                localStorage.setItem('solicitudFinanciamiento', JSON.stringify(solicitudData));
                window.location.href = 'Solicitar Financiamiento.html';
            });
        });
    }


    // ═══════════════════════════════════════════════════════════════
    // PRELLENAR DESDE LANDING/INVENTORY (ejecutado al final, cuando
    // todas las funciones e instituciones ya están definidas)
    // ═══════════════════════════════════════════════════════════════
    const dataString = localStorage.getItem('financiamientoData');
    if (dataString) {
        try {
            const data = JSON.parse(dataString);
            const precioUSD  = data.precio     || 0;
            const porcInicial = data.porcInicial || 20;
            const meses      = data.meses       || 36;
            const auto       = data.auto        || { anio: new Date().getFullYear() };

            // Limpiar localStorage
            localStorage.removeItem('financiamientoData');

            // Determinar tipo: usado si año < año actual
            const anioActual = new Date().getFullYear();
            const esUsado = auto.anio < anioActual;
            if (esUsado) {
                btnUsado.click();
                // Solo setear el año si está disponible en el select
                if (selectAnio.querySelector(`option[value="${auto.anio}"]`)) {
                    selectAnio.value = auto.anio.toString();
                }
            } else {
                btnNuevo.click();
            }

            // Calcular valores en RD$ — nuevo modelo:
            // inputMonto = precio total, inputInicial = pago inicial
            const precioTotalRD = Math.round(precioUSD * TASA_DOLAR);
            const inicialRD     = Math.round(precioUSD * (porcInicial / 100) * TASA_DOLAR);

            // Prellenar inputs
            inputInicial.value = inicialRD.toLocaleString('es-DO');
            inputMonto.value   = precioTotalRD.toLocaleString('es-DO'); // precio total

            // Prellenar plazo solo si existe esa opción en el select
            if (selectPlazo.querySelector(`option[value="${meses}"]`)) {
                selectPlazo.value = meses.toString();
            }

            // Actualizar porcentajes y disparar cálculo
            updatePorcentajes();
            btnActualizar.click();

        } catch (e) {
            console.error('Error al leer datos de financiamiento:', e);
            localStorage.removeItem('financiamientoData');
        }
    }

});