/* 
   BASE DE DATOS: LoCompaAutoImport
 */

CREATE DATABASE LoCompaAutoImport;
GO

USE LoCompaAutoImport;
GO

/*  TABLA USUARIOS  */
CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

/*  TABLA CLIENTES  */
CREATE TABLE clientes (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(200),
    fecha_registro DATETIME DEFAULT GETDATE()
);

/*  TABLA VEHICULOS  */
CREATE TABLE vehiculos (
    id_vehiculo INT IDENTITY(1,1) PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    color VARCHAR(30),
    precio DECIMAL(12,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    descripcion TEXT,
    fecha_ingreso DATETIME DEFAULT GETDATE()
);

/*  TABLA IMAGENES VEHICULOS  */
CREATE TABLE imagenes_vehiculos (
    id_imagen INT IDENTITY(1,1) PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL
);

ALTER TABLE imagenes_vehiculos
ADD CONSTRAINT fk_imagen_vehiculo
FOREIGN KEY (id_vehiculo)
REFERENCES vehiculos(id_vehiculo);

/*  TABLA VENTAS  */
CREATE TABLE ventas (
    id_venta INT IDENTITY(1,1) PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_venta DATETIME DEFAULT GETDATE(),
    monto_total DECIMAL(12,2) NOT NULL
);

ALTER TABLE ventas
ADD CONSTRAINT fk_venta_cliente
FOREIGN KEY (id_cliente)
REFERENCES clientes(id_cliente);

ALTER TABLE ventas
ADD CONSTRAINT fk_venta_vehiculo
FOREIGN KEY (id_vehiculo)
REFERENCES vehiculos(id_vehiculo);

/*  TABLA PAGOS  */
CREATE TABLE pagos (
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_venta INT NOT NULL,
    tipo_pago VARCHAR(30),
    monto DECIMAL(12,2) NOT NULL,
    fecha_pago DATETIME DEFAULT GETDATE()
);

ALTER TABLE pagos
ADD CONSTRAINT fk_pago_venta
FOREIGN KEY (id_venta)
REFERENCES ventas(id_venta);
