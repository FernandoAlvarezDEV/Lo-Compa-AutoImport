// inventory.js

document.addEventListener('DOMContentLoaded', () => {

    // ── Elementos ───────────────────────────────────────────────
    const vehicleTypeButtons = document.querySelectorAll('.vehicle-type-btn');
    const brandCheckboxes    = document.querySelectorAll('input[name="brand"]');
    const btnReset           = document.getElementById('btnResetFilters');

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

    // ── Funciones del slider ────────────────────────────────────
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

    thumbMin.addEventListener('mousedown', e => startDrag(e, true));
    thumbMax.addEventListener('mousedown', e => startDrag(e, false));

    updateSliderUI(); // inicial

    // ── Toggle tipos de vehículo ────────────────────────────────
    vehicleTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle entre activo e inactivo
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

    // ── Checkboxes marcas ───────────────────────────────────────
    brandCheckboxes.forEach(chk => {
        chk.addEventListener('change', applyFilters);
    });

    // ── Botón Reiniciar ─────────────────────────────────────────
    btnReset.addEventListener('click', () => {
        // 1. Quitar selección de TODOS los tipos de vehículo
        vehicleTypeButtons.forEach(btn => {
            btn.classList.remove('bg-dr-blue', 'text-white', 'shadow-sm');
            btn.classList.add('bg-gray-100', 'dark:bg-[#333]', 'text-dr-blue', 'dark:text-gray-300');
        });

        // 2. Desmarcar todas las marcas
        brandCheckboxes.forEach(chk => chk.checked = false);

        // 3. Resetear precio al rango completo
        currentMin = MIN_PRICE;
        currentMax = MAX_PRICE;
        updateSliderUI();

        // 4. Aplicar (actualizar vista)
        applyFilters();
    });


    // ── Función de filtrado (aún placeholder) ───────────────────
    function applyFilters() {
        const activeTypes = [];
        vehicleTypeButtons.forEach(btn => {
            if (btn.classList.contains('bg-dr-blue')) {
                activeTypes.push(btn.querySelector('span').textContent.trim().toLowerCase());
            }
        });

        const activeBrands = [];
        brandCheckboxes.forEach(chk => {
            if (chk.checked) {
                activeBrands.push(chk.nextElementSibling.textContent.trim());
            }
        });

        console.groupCollapsed('Filtros activos después de cambio');
        console.log('Tipos:', activeTypes);
        console.log('Marcas:', activeBrands);
        console.log('Precio:', currentMin, '–', currentMax);
        console.groupEnd();

        // Aquí pondrías el filtrado real de las tarjetas:
        /*
        document.querySelectorAll('.vehicle-card').forEach(card => {
            const tipo  = card.dataset.tipo?.toLowerCase()   || '';
            const marca = card.dataset.marca                 || '';
            const precio = Number(card.dataset.precio)       || 0;

            const matchTipo   = activeTypes.length === 0 || activeTypes.includes(tipo);
            const matchMarca  = activeBrands.length === 0 || activeBrands.includes(marca);
            const matchPrecio = precio >= currentMin && precio <= currentMax;

            card.style.display = (matchTipo && matchMarca && matchPrecio) ? '' : 'none';
        });
        */
    }

});