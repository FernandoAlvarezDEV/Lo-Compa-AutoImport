// Selección de elementos del DOM
const priceSlider = document.getElementById('price-slider');
const priceDisplay = document.getElementById('price-display');

/**
 * Función para formatear el precio a formato USD amigable
 * Convierte 185000 -> USD $185k (o $185,000 si prefieres)
 */
const formatCurrency = (value) => {
    // Formato abreviado "k" para que quepa bien en el diseño
    if (value >= 1000) {
        return `USD $${(value / 1000).toFixed(0)}k`;
    }
    return `USD $${value}`;
};

// Escuchar el evento de movimiento del slider
priceSlider.addEventListener('input', (event) => {
    const currentValue = event.target.value;
    
    // Actualizar el texto en pantalla
    priceDisplay.textContent = formatCurrency(currentValue);
    
    // Log para depuración (opcional)
    console.log(`Filtrando autos hasta: ${currentValue} USD`);
});

// Inicializar el valor al cargar la página
priceDisplay.textContent = formatCurrency(priceSlider.value);