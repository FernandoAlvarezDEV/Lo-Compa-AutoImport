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


const TipoMarcas = {
  "SUV": [
    "Toyota",
    "Lexus",
    "Honda",
    "Mercedes-Benz",
    "Hyundai",
    "Ford"
  ],
  "Sedan": [
    "Toyota",
    "Mercedes-Benz",
    "BMW",
    "Honda",
    "Lexus",
    "Hyundai"
  ],
  "Deportivo": [
    "Chevrolet",
    "Porsche",
    "Audi"
  ],
  "Camioneta": [
    "Toyota",
    "Ford",
    "Ram",
    "Chevrolet"
  ],
  "Convertible": [
    "BMW",
    "Ford",
    "Mercedes-Benz",
    "Mazda",
    "Porsche"
  ]
};

const ModelosPorMarca = {
  "Chevrolet": {
    "Deportivo": ["Corvette Stingray 3LT"],
    "Camioneta": ["Silverado 1500 High Country"]
  },
  "Toyota": {
    "SUV": ["Prado VX", "4Runner TRD Pro"],
    "Camioneta": ["Hilux GR-Sport"],
    "Sedan": ["Camry XSE V6"]
  },
  "Lexus": {
    "SUV": ["RX 350 Luxury", "LX 600 F Sport"],
    "Sedan": ["ES 350 F Sport"]
  },
  "Honda": {
    "SUV": ["CR-V Touring"],
    "Sedan": ["Accord Touring 2.0T"]
  },
  "Porsche": {
    "Deportivo": ["911 Carrera S"],
    "Convertible": ["718 Boxster S"]
  },
  "Audi": {
    "Deportivo": ["R8 Spyder V10 Performance"]
  },
  "Mercedes-Benz": {
    "SUV": ["GLE 53 AMG Coupe"],
    "Sedan": ["C 300 AMG Line"],
    "Convertible": ["E 450 Cabriolet"]
  },
  "Hyundai": {
    "SUV": ["Santa Fe Calligraphy"],
    "Sedan": ["Sonata N Line"]
  },
  "Ford": {
    "SUV": ["Explorer ST"],
    "Camioneta": ["F-150 Raptor", "Ranger Wildtrak"],
    "Deportivo": ["Mustang GT Premium"],
    "Convertible": ["Mustang GT Premium"] // Asumiendo que Mustang puede ser convertible
  },
  "BMW": {
    "Sedan": ["330i M Sport"],
    "Convertible": ["M440i Convertible"]
  },
  "Ram": {
    "Camioneta": ["1500 Limited Longhorn"]
  },
  "Mazda": {
    "Convertible": ["MX-5 Miata RF"]
  }
};

// Selección de elementos del filtro
const selectMarca = document.getElementById('MarcasDeCarros');
const selectTipo = document.getElementById('TiposDeCarros');
const selectModelo = document.getElementById('ModelosDeCarros');

// Marcas originales para mantener el orden
const marcasOriginales = [
  { value: "toyota", label: "Toyota" },
  { value: "ford", label: "Ford" },
  { value: "mercedes-benz", label: "Mercedes-Benz" },
  { value: "lexus", label: "Lexus" },
  { value: "hyundai", label: "Hyundai" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "porsche", label: "Porsche" },
  { value: "bmw", label: "BMW" },
  { value: "audi", label: "Audi" },
  { value: "honda", label: "Honda" },
  { value: "mazda", label: "Mazda" },
  { value: "ram", label: "Ram" }
];

// Función para actualizar opciones de marca basado en tipo seleccionado
function actualizarMarcas(tipo) {
  // Limpiar opciones actuales
  selectMarca.innerHTML = '';

  // Siempre agregar "Seleccionar Marca"
  const opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.textContent = 'Seleccionar Marca';
  selectMarca.appendChild(opcionDefault);

  // Si tipo es vacío (Cualquier Tipo), mostrar todas las marcas
  if (!tipo) {
    marcasOriginales.forEach(marcaObj => {
      const opcion = document.createElement('option');
      opcion.value = marcaObj.value;
      opcion.textContent = marcaObj.label;
      selectMarca.appendChild(opcion);
    });
    return;
  }

  // Normalizar tipo a capitalizado para matching (sedan -> Sedan)
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  const marcasDisponibles = TipoMarcas[tipoCapitalizado] || [];

  // Agregar solo marcas disponibles, respetando orden original
  marcasOriginales.forEach(marcaObj => {
    if (marcasDisponibles.includes(marcaObj.label)) {
      const opcion = document.createElement('option');
      opcion.value = marcaObj.value;
      opcion.textContent = marcaObj.label;
      selectMarca.appendChild(opcion);
    }
  });

  // Si no hay marcas, mostrar mensaje
  if (marcasDisponibles.length === 0) {
    const opcionNone = document.createElement('option');
    opcionNone.value = '';
    opcionNone.textContent = 'No hay marcas disponibles';
    opcionNone.disabled = true;
    selectMarca.appendChild(opcionNone);
  }

  // Resetear modelos al cambiar tipo
  actualizarModelos('', tipo);
}

// Función para actualizar opciones de modelo basado en marca y tipo seleccionados
function actualizarModelos(marca, tipo) {
  // Limpiar opciones actuales
  selectModelo.innerHTML = '';

  // Siempre agregar "Cualquier Modelo"
  const opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.textContent = 'Cualquier Modelo';
  selectModelo.appendChild(opcionDefault);

  // Si no hay marca seleccionada, no mostrar modelos
  if (!marca) return;

  // Normalizar marca a capitalizada (toyota -> Toyota)
  const marcaCapitalizada = marca.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');

  const modelosDisponibles = ModelosPorMarca[marcaCapitalizada] || {};

  let modelosToShow = [];

  if (!tipo || tipo === '') {
    // Si tipo es "Cualquier", mostrar todos los modelos de la marca (flat de todos los tipos)
    modelosToShow = [...new Set(Object.values(modelosDisponibles).flat())];
  } else {
    // Normalizar tipo a capitalizado (sedan -> Sedan)
    const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    modelosToShow = modelosDisponibles[tipoCapitalizado] || [];
  }

  // Agregar modelos disponibles
  modelosToShow.forEach(modelo => {
    const opcion = document.createElement('option');
    opcion.value = modelo.toLowerCase().replace(/\s+/g, '-'); // Normalizar value como en el HTML original
    opcion.textContent = modelo;
    selectModelo.appendChild(opcion);
  });

  // Si no hay modelos, mostrar mensaje
  if (modelosToShow.length === 0) {
    const opcionNone = document.createElement('option');
    opcionNone.value = '';
    opcionNone.textContent = 'No hay modelos disponibles';
    opcionNone.disabled = true;
    selectModelo.appendChild(opcionNone);
  }
}

// Evento de cambio en select de Tipo
selectTipo.addEventListener('change', (event) => {
  const tipoSeleccionado = event.target.value;
  actualizarMarcas(tipoSeleccionado);
  
  // Actualizar modelos basado en la marca actual (si hay) y nuevo tipo
  const marcaActual = selectMarca.value;
  if (marcaActual) {
    actualizarModelos(marcaActual, tipoSeleccionado);
  }
});

// Evento de cambio en select de Marca
selectMarca.addEventListener('change', (event) => {
  const marcaSeleccionada = event.target.value;
  const tipoActual = selectTipo.value;
  actualizarModelos(marcaSeleccionada, tipoActual);
});

// Inicializar con todas las marcas y modelos vacíos
actualizarMarcas('');

// === BOTÓN FILTRAR ===
const btnFiltrar = document.getElementById('btnFiltrarAutos');

btnFiltrar.addEventListener('click', () => {
    const tipo   = selectTipo.value;     // sedan, suv, camioneta, etc.
    const marca  = selectMarca.value;    // toyota, bmw, etc.
    const modelo = selectModelo.value;
    const precioMax = priceSlider.value;

    const params = new URLSearchParams();

    if (tipo && tipo !== 'Cualquier Tipo') params.append('tipo', tipo);
    if (marca && marca !== 'Seleccionar Marca') params.append('marca', marca);
    if (modelo && modelo !== 'Cualquier Modelo') params.append('modelo', modelo);
    if (precioMax && parseInt(precioMax) < parseInt(priceSlider.max)) {
        params.append('precio_max', precioMax);
    }

    // Redirigir a Inventory Page con los filtros
    const url = params.toString() 
        ? `Inventory Page.html?${params.toString()}` 
        : 'Inventory Page.html';

    window.location.href = url;
});