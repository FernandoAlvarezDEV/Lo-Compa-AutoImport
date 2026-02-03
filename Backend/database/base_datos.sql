-- ══════════════════════════════════════════════════════════
-- BASE DE DATOS: LoCompaAutoImport
-- Sistema de Inventario de Vehículos
-- ══════════════════════════════════════════════════════════

DROP DATABASE IF EXISTS LoCompaAutoImport;
CREATE DATABASE LoCompaAutoImport 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE LoCompaAutoImport;

-- ══════════════════════════════════════════════════════════
-- TABLA: vehiculos
-- Inventario principal de vehículos
-- ══════════════════════════════════════════════════════════

CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    color VARCHAR(30),
    precio DECIMAL(12,2) NOT NULL,
    kilometraje INT DEFAULT 0,
    transmision ENUM('Manual', 'Automatica', 'CVT') DEFAULT 'Automatica',
    combustible ENUM('Gasolina', 'Diesel', 'Hibrido', 'Electrico') DEFAULT 'Gasolina',
    tipo_vehiculo ENUM('Sedan', 'SUV', 'Camioneta', 'Deportivo', 'Convertible', 'Hatchback'),
    vin VARCHAR(17) UNIQUE,
    placa VARCHAR(20) UNIQUE,
    disponible BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    imagen VARCHAR(255), -- Nombre del archivo de imagen principal
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_marca (marca),
    INDEX idx_disponible (disponible),
    INDEX idx_precio (precio),
    INDEX idx_destacado (destacado),
    INDEX idx_tipo (tipo_vehiculo)
) ENGINE=InnoDB;

-- ══════════════════════════════════════════════════════════
-- TABLA: imagenes_vehiculos
-- Múltiples imágenes por vehículo (galería)
-- ══════════════════════════════════════════════════════════

CREATE TABLE imagenes_vehiculos (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_vehiculo) 
        REFERENCES vehiculos(id) 
        ON DELETE CASCADE,
    
    INDEX idx_vehiculo (id_vehiculo),
    INDEX idx_principal (es_principal)
) ENGINE=InnoDB;

-- ══════════════════════════════════════════════════════════
-- DATOS DE EJEMPLO
-- ══════════════════════════════════════════════════════════

-- Insertar el Corvette que ya tienes
INSERT INTO vehiculos (
    marca, 
    modelo, 
    anio, 
    color, 
    precio, 
    kilometraje,
    transmision,
    combustible,
    tipo_vehiculo,
    disponible, 
    destacado,
    descripcion,
    imagen
) VALUES (
    'Chevrolet',
    'Corvette Stingray 3LT',
    2023,
    'Blanco',
    90000.00,
    0,
    'Automatica',
    'Gasolina',
    'Deportivo',
    TRUE,
    TRUE,
    'Chevrolet Corvette Stingray 3LT 2023 en excelente condición. Motor V8, transmisión automática de 8 velocidades.',
    '2023 Chevrolet Corvette Stingray 3LT.jpg'
);

-- Insertar algunos vehículos adicionales de ejemplo
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion) VALUES
('Toyota', 'Prado VX', 2024, 'Gris Metálico', 95000.00, 0, 'Automatica', 'Diesel', 'SUV', TRUE, TRUE, 'Toyota Prado VX 2024, 0 kilómetros, equipamiento completo.'),
('Toyota', 'Hilux GR-Sport', 2024, 'Negro', 66000.00, 0, 'Automatica', 'Diesel', 'Camioneta', TRUE, FALSE, 'Toyota Hilux GR-Sport 2024, versión deportiva con todas las comodidades.'),
('Toyota', 'Camry XSE V6', 2024, 'Rojo', 45000.00, 0, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, 'Toyota Camry XSE V6 2024, elegancia y potencia en un sedan premium.'),
('Lexus', 'RX 350 Luxury', 2023, 'Blanco Perla', 64500.00, 12000, 'Automatica', 'Gasolina', 'SUV', TRUE, TRUE, 'Lexus RX 350 Luxury 2023 con solo 12,000 km. Como nuevo.'),
('Honda', 'CR-V Touring', 2021, 'Azul Profundo', 32900.00, 38000, 'Automatica', 'Hibrido', 'SUV', TRUE, FALSE, 'Honda CR-V Touring 2021, versión híbrida, excelente condición.');

-- ══════════════════════════════════════════════════════════
-- VISTAS ÚTILES
-- ══════════════════════════════════════════════════════════

-- Vista de vehículos disponibles con su imagen
CREATE VIEW vehiculos_disponibles AS
SELECT 
    id,
    marca,
    modelo,
    anio,
    color,
    precio,
    kilometraje,
    transmision,
    combustible,
    tipo_vehiculo,
    destacado,
    imagen,
    CONCAT('http://127.0.0.1:8000/imagenes/', imagen) AS imagen_url,
    fecha_ingreso
FROM vehiculos
WHERE disponible = TRUE
ORDER BY fecha_ingreso DESC;

-- Vista de vehículos destacados
CREATE VIEW vehiculos_destacados AS
SELECT 
    id,
    marca,
    modelo,
    anio,
    precio,
    imagen,
    CONCAT('http://127.0.0.1:8000/imagenes/', imagen) AS imagen_url
FROM vehiculos
WHERE disponible = TRUE AND destacado = TRUE
ORDER BY fecha_ingreso DESC
LIMIT 6;

-- ══════════════════════════════════════════════════════════
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ══════════════════════════════════════════════════════════

DELIMITER //

-- Buscar vehículos por criterios
CREATE PROCEDURE buscar_vehiculos(
    IN p_marca VARCHAR(50),
    IN p_precio_min DECIMAL(12,2),
    IN p_precio_max DECIMAL(12,2),
    IN p_tipo VARCHAR(20)
)
BEGIN
    SELECT 
        id,
        marca,
        modelo,
        anio,
        precio,
        tipo_vehiculo,
        imagen,
        CONCAT('http://127.0.0.1:8000/imagenes/', imagen) AS imagen_url
    FROM vehiculos
    WHERE disponible = TRUE
        AND (p_marca IS NULL OR marca = p_marca)
        AND (p_precio_min IS NULL OR precio >= p_precio_min)
        AND (p_precio_max IS NULL OR precio <= p_precio_max)
        AND (p_tipo IS NULL OR tipo_vehiculo = p_tipo)
    ORDER BY fecha_ingreso DESC;
END //

-- Marcar vehículo como vendido
CREATE PROCEDURE marcar_vendido(
    IN p_id_vehiculo INT
)
BEGIN
    UPDATE vehiculos
    SET disponible = FALSE
    WHERE id = p_id_vehiculo;
END //

DELIMITER ;