// BUscador.js - Funcionalidad del buscador

document.addEventListener('DOMContentLoaded', function() {
    const buscadorGlobal = document.getElementById('globalSearch');
    
    if (buscadorGlobal) {
        // Evento cuando presionas Enter en el buscador
        buscadorGlobal.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                const termino = this.value.trim();
                
                if (termino === '') {
                    alert('Por favor ingresa un término de búsqueda');
                    return;
                }
                
                // Redirigir a la página de inventario con el término de búsqueda
                window.location.href = `Inventory Page.html?buscar=${encodeURIComponent(termino)}`;
            }
        });
        
        // También puedes agregar un botón de búsqueda
        const botonBuscar = buscadorGlobal.nextElementSibling;
        if (botonBuscar && botonBuscar.classList.contains('material-symbols-outlined')) {
            botonBuscar.style.cursor = 'pointer';
            botonBuscar.addEventListener('click', function() {
                const termino = buscadorGlobal.value.trim();
                if (termino) {
                    window.location.href = `Inventory Page.html?buscar=${encodeURIComponent(termino)}`;
                }
            });
        }
    }
});