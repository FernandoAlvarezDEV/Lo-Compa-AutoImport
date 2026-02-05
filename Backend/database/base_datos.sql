-- ══════════════════════════════════════════════════════════
-- PROYECTO: LoCompaAutoImport
-- DESCRIPCIÓN: Creación de Base de Datos e Inventario de 27 Vehículos
-- ══════════════════════════════════════════════════════════

SET NAMES utf8mb4;
DROP DATABASE IF EXISTS LoCompaAutoImport;
CREATE DATABASE LoCompaAutoImport 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Línea crucial para evitar el error "No database selected"
USE LoCompaAutoImport;

-- ══════════════════════════════════════════════════════════
-- 1. ESTRUCTURA DE TABLAS
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
    imagen VARCHAR(255), 
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_marca (marca),
    INDEX idx_disponible (disponible),
    INDEX idx_precio (precio),
    INDEX idx_destacado (destacado)
) ENGINE=InnoDB;

CREATE TABLE imagenes_vehiculos (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ══════════════════════════════════════════════════════════
-- 2. INSERCIÓN DE DATOS (LISTADO COMPLETO DE 27)
-- ══════════════════════════════════════════════════════════

-- DEPORTIVOS (3)
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion, imagen) VALUES
('Chevrolet', 'Corvette Stingray 3LT', 2023, 'Blanco', 90000.00, 0, 'Automatica', 'Gasolina', 'Deportivo', TRUE, TRUE, 'Motor V8, 495 HP. Edición 3LT.', '2023_chevrolet_corvette.jpg'),
('Porsche', '911 Carrera S', 2022, 'GT Silver Metallic', 160000.00, 5000, 'Automatica', 'Gasolina', 'Deportivo', TRUE, TRUE, '3.0 Twin-Turbo Flat-6, 443 HP.', '2022_porsche_911.jpg'),
('Audi', 'R8 Spyder V10 Performance', 2021, 'Kemora Gray Metallic', 185000.00, 8000, 'Automatica', 'Gasolina', 'Deportivo', TRUE, TRUE, '602 HP, AWD. Motor V10 FSI.', '2021_audi_r8.jpg');

-- SUV (8)
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion, imagen) VALUES
('Toyota', 'Prado VX', 2024, 'Gris Metálico', 95000.00, 0, 'Automatica', 'Diesel', 'SUV', TRUE, TRUE, 'Toyota Prado VX 2024, 0 kilómetros.', '2024_toyota_prado.jpg'),
('Lexus', 'RX 350 Luxury', 2023, 'Blanco Perla', 64500.00, 12000, 'Automatica', 'Gasolina', 'SUV', TRUE, TRUE, 'Lexus RX 350 Luxury 2023, como nuevo.', '2023_lexus_rx350.jpg'),
('Honda', 'CR-V Touring', 2021, 'Azul Profundo', 32900.00, 38000, 'Automatica', 'Hibrido', 'SUV', TRUE, FALSE, 'Honda CR-V Touring 2021, versión híbrida.', '2021_honda_crv.jpg'),
('Lexus', 'LX 600 F Sport', 2023, 'Manganese Luster', 150000.00, 2000, 'Automatica', 'Gasolina', 'SUV', TRUE, TRUE, '3.5L Twin-Turbo V6 con 409 HP.', '2023_lexus_lx600.jpg'),
('Mercedes-Benz', 'GLE 53 AMG Coupe', 2022, 'Obsidian Black Metallic', 115000.00, 15000, 'Automatica', 'Gasolina', 'SUV', TRUE, FALSE, 'Híbrido ligero con 429 HP.', '2022_mercedes_gle53.jpg'),
('Toyota', '4Runner TRD Pro', 2022, 'Lime Rush', 70000.00, 25000, 'Automatica', 'Gasolina', 'SUV', TRUE, FALSE, 'Especial para Off-Road con suspensión TRD.', '2022_toyota_4runner_trd.jpg'),
('Hyundai', 'Santa Fe Calligraphy', 2023, 'Glacier White', 50000.00, 0, 'Automatica', 'Gasolina', 'SUV', TRUE, FALSE, 'Motor 2.5L Turbo, AWD.', '2023_hyundai_santa_fe.jpg'),
('Ford', 'Explorer ST', 2021, 'Rapid Red Metallic', 55000.00, 30000, 'Automatica', 'Gasolina', 'SUV', TRUE, FALSE, 'Motor 3.0L EcoBoost V6 con 400 HP.', '2021_ford_explorer_st.jpg');

-- SEDAN (6)
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion, imagen) VALUES
('Toyota', 'Camry XSE V6', 2024, 'Rojo', 45000.00, 0, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, 'Potencia y elegancia premium.', '2024_toyota_camry.jpg'),
('Mercedes-Benz', 'C 300 AMG Line', 2023, 'Selenite Grey Metallic', 65000.00, 0, 'Automatica', 'Gasolina', 'Sedan', TRUE, TRUE, 'Motor 2.0L Turbo con Mild Hybrid.', '2023_mercedes_c300.jpg'),
('BMW', '330i M Sport', 2022, 'Portimao Blue Metallic', 52000.00, 10000, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, 'Paquete M deportivo, tecnología alemana.', '2022_bmw_330i.jpg'),
('Honda', 'Accord Touring 2.0T', 2022, 'Platinum White Pearl', 37000.00, 15000, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, 'Motor potente de 252 HP.', '2022_honda_accord.jpg'),
('Lexus', 'ES 350 F Sport', 2021, 'Ultra White', 48000.00, 18000, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, 'Motor V6 de 302 HP, suavidad extrema.', '2021_lexus_es350.jpg'),
('Hyundai', 'Sonata N Line', 2023, 'Hampton Gray', 35000.00, 5000, 'Automatica', 'Gasolina', 'Sedan', TRUE, FALSE, '290 HP, transmisión N-DCT de 8 vel.', '2023_hyundai_sonata.jpg');

-- CAMIONETAS (5)
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion, imagen) VALUES
('Toyota', 'Hilux GR-Sport', 2024, 'Negro', 66000.00, 0, 'Automatica', 'Diesel', 'Camioneta', TRUE, FALSE, 'Versión deportiva GR-Sport 2024.', '2024_toyota_hilux.jpg'),
('Ford', 'F-150 Raptor', 2023, 'Code Orange Metallic', 125000.00, 5000, 'Automatica', 'Gasolina', 'Camioneta', TRUE, TRUE, 'Motor High-Output V6 con 450 HP.', '2023_ford_raptor.jpg'),
('Ram', '1500 Limited Longhorn', 2022, 'Ivory White', 80000.00, 12000, 'Automatica', 'Gasolina', 'Camioneta', TRUE, FALSE, 'Interior de cuero premium, motor HEMI V8.', '2022_ram_1500.jpg'),
('Chevrolet', 'Silverado 1500 High Country', 2021, 'Northsky Blue Metallic', 70000.00, 20000, 'Automatica', 'Gasolina', 'Camioneta', TRUE, FALSE, 'Motor 6.2L V8, edición High Country.', '2021_chevrolet_silverado.jpg'),
('Ford', 'Ranger Wildtrak', 2023, 'Cyber Orange', 55000.00, 0, 'Automatica', 'Diesel', 'Camioneta', TRUE, FALSE, 'Motor 2.0L Bi-Turbo Diesel.', '2023_ford_ranger.jpg');

-- CONVERTIBLES (5)
INSERT INTO vehiculos (marca, modelo, anio, color, precio, kilometraje, transmision, combustible, tipo_vehiculo, disponible, destacado, descripcion, imagen) VALUES
('BMW', 'M440i Convertible', 2024, 'San Remo Green', 75000.00, 0, 'Automatica', 'Gasolina', 'Convertible', TRUE, TRUE, 'Motor Inline-6 de 382 HP.', '2024_bmw_m440i.jpg'),
('Ford', 'Mustang GT Premium', 2022, 'Atlas Blue Metallic', 55000.00, 12000, 'Automatica', 'Gasolina', 'Convertible', TRUE, FALSE, 'Motor Coyote V8 5.0L con 450 HP.', '2022_ford_mustang.jpg'),
('Mercedes-Benz', 'E 450 Cabriolet', 2021, 'Rubellite Red', 70000.00, 15000, 'Automatica', 'Gasolina', 'Convertible', TRUE, FALSE, 'Elegancia con motor Híbrido EQ Boost.', '2021_mercedes_e450.jpg'),
('Mazda', 'MX-5 Miata RF', 2021, 'Soul Red Crystal', 33000.00, 10000, 'Manual', 'Gasolina', 'Convertible', TRUE, FALSE, 'Transmisión manual de 6 velocidades.', '2021_mazda_mx5.jpg'),
('Porsche', '718 Boxster S', 2020, 'Miami Blue', 78000.00, 20000, 'Automatica', 'Gasolina', 'Convertible', TRUE, TRUE, 'Motor central Turbo Flat-4 con 350 HP.', '2020_porsche_718.jpg');

-- ══════════════════════════════════════════════════════════
-- 3. VISTAS Y VERIFICACIÓN
-- ══════════════════════════════════════════════════════════

CREATE VIEW vehiculos_disponibles AS
SELECT id, marca, modelo, anio, precio, imagen,
       CONCAT('http://127.0.0.1:8000/imagenes/', imagen) AS imagen_url
FROM vehiculos WHERE disponible = TRUE;

-- Verificación final de conteo
SELECT 'EXITO' as Status, COUNT(*) as Total_Vehiculos, 27 as Esperados FROM vehiculos;