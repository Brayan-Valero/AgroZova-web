-- ===========================================
-- GOSÉN AGROZOVA SAS - DATABASE SCHEMA
-- ===========================================
-- Este script crea todas las tablas necesarias
-- y configura Row Level Security (RLS)
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- MÓDULO: POLLOS DE ENGORDE
-- ===========================================

-- Tabla: Producciones de Pollos
CREATE TABLE IF NOT EXISTS producciones_pollos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  galpon VARCHAR(100),
  cantidad_inicial INTEGER NOT NULL CHECK (cantidad_inicial > 0),
  cantidad_actual INTEGER,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Gastos de Pollos
CREATE TABLE IF NOT EXISTS gastos_pollos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produccion_id UUID REFERENCES producciones_pollos(id) ON DELETE CASCADE NOT NULL,
  concepto VARCHAR(255) NOT NULL,
  monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
  fecha DATE NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Ingresos de Pollos
CREATE TABLE IF NOT EXISTS ingresos_pollos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produccion_id UUID REFERENCES producciones_pollos(id) ON DELETE CASCADE NOT NULL,
  kilos_vendidos DECIMAL(10,2) NOT NULL CHECK (kilos_vendidos > 0),
  precio_por_kilo DECIMAL(10,2) NOT NULL CHECK (precio_por_kilo > 0),
  monto_total DECIMAL(12,2) NOT NULL CHECK (monto_total >= 0),
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- MÓDULO: GALLINAS DE POSTURA
-- ===========================================

-- Tabla: Lotes de Gallinas
CREATE TABLE IF NOT EXISTS lotes_gallinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  raza VARCHAR(100),
  poblacion_inicial INTEGER NOT NULL CHECK (poblacion_inicial > 0),
  poblacion_actual INTEGER,
  fecha_inicio DATE NOT NULL,
  edad_semanas INTEGER CHECK (edad_semanas >= 0),
  porcentaje_produccion DECIMAL(5,2) CHECK (porcentaje_produccion >= 0 AND porcentaje_produccion <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Gastos de Gallinas
CREATE TABLE IF NOT EXISTS gastos_gallinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lote_id UUID REFERENCES lotes_gallinas(id) ON DELETE CASCADE NOT NULL,
  concepto VARCHAR(255) NOT NULL,
  monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
  fecha DATE NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Ventas de Huevos
CREATE TABLE IF NOT EXISTS ventas_gallinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lote_id UUID REFERENCES lotes_gallinas(id) ON DELETE CASCADE NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL CHECK (unidad_medida IN ('carton', 'unidad')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0),
  monto_total DECIMAL(12,2) NOT NULL CHECK (monto_total >= 0),
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- MÓDULO: VACAS LECHERAS
-- ===========================================

-- Tabla: Inventario de Vacas
CREATE TABLE IF NOT EXISTS inventario_vacas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE,
  estado VARCHAR(50) DEFAULT 'produccion' CHECK (estado IN ('produccion', 'seca', 'enferma', 'vendida')),
  fecha_nacimiento DATE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Gastos de Vacas
CREATE TABLE IF NOT EXISTS gastos_vacas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vaca_id UUID REFERENCES inventario_vacas(id) ON DELETE CASCADE NOT NULL,
  concepto VARCHAR(255) NOT NULL,
  monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
  fecha DATE NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Producción de Leche
CREATE TABLE IF NOT EXISTS produccion_leche (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vaca_id UUID REFERENCES inventario_vacas(id) ON DELETE CASCADE NOT NULL,
  litros DECIMAL(10,2) NOT NULL CHECK (litros > 0),
  precio_por_litro DECIMAL(10,2),
  monto_total DECIMAL(12,2),
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ===========================================

CREATE INDEX idx_producciones_pollos_user ON producciones_pollos(user_id);
CREATE INDEX idx_producciones_pollos_estado ON producciones_pollos(estado);
CREATE INDEX idx_gastos_pollos_produccion ON gastos_pollos(produccion_id);
CREATE INDEX idx_ingresos_pollos_produccion ON ingresos_pollos(produccion_id);

CREATE INDEX idx_lotes_gallinas_user ON lotes_gallinas(user_id);
CREATE INDEX idx_gastos_gallinas_lote ON gastos_gallinas(lote_id);
CREATE INDEX idx_ventas_gallinas_lote ON ventas_gallinas(lote_id);

CREATE INDEX idx_inventario_vacas_user ON inventario_vacas(user_id);
CREATE INDEX idx_inventario_vacas_estado ON inventario_vacas(estado);
CREATE INDEX idx_gastos_vacas_vaca ON gastos_vacas(vaca_id);
CREATE INDEX idx_produccion_leche_vaca ON produccion_leche(vaca_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- PRODUCCIONES DE POLLOS
ALTER TABLE producciones_pollos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own productions"
  ON producciones_pollos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own productions"
  ON producciones_pollos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own productions"
  ON producciones_pollos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own productions"
  ON producciones_pollos FOR DELETE
  USING (auth.uid() = user_id);

-- GASTOS DE POLLOS
ALTER TABLE gastos_pollos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gastos of own productions"
  ON gastos_pollos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = gastos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert gastos to own productions"
  ON gastos_pollos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = gastos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gastos from own productions"
  ON gastos_pollos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = gastos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

-- INGRESOS DE POLLOS
ALTER TABLE ingresos_pollos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ingresos of own productions"
  ON ingresos_pollos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = ingresos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ingresos to own productions"
  ON ingresos_pollos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = ingresos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ingresos from own productions"
  ON ingresos_pollos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM producciones_pollos
      WHERE producciones_pollos.id = ingresos_pollos.produccion_id
      AND producciones_pollos.user_id = auth.uid()
    )
  );

-- LOTES DE GALLINAS
ALTER TABLE lotes_gallinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lotes"
  ON lotes_gallinas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lotes"
  ON lotes_gallinas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lotes"
  ON lotes_gallinas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lotes"
  ON lotes_gallinas FOR DELETE
  USING (auth.uid() = user_id);

-- GASTOS DE GALLINAS
ALTER TABLE gastos_gallinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gastos of own lotes"
  ON gastos_gallinas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = gastos_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert gastos to own lotes"
  ON gastos_gallinas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = gastos_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gastos from own lotes"
  ON gastos_gallinas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = gastos_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

-- VENTAS DE GALLINAS
ALTER TABLE ventas_gallinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ventas of own lotes"
  ON ventas_gallinas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = ventas_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ventas to own lotes"
  ON ventas_gallinas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = ventas_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ventas from own lotes"
  ON ventas_gallinas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lotes_gallinas
      WHERE lotes_gallinas.id = ventas_gallinas.lote_id
      AND lotes_gallinas.user_id = auth.uid()
    )
  );

-- INVENTARIO DE VACAS
ALTER TABLE inventario_vacas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vacas"
  ON inventario_vacas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vacas"
  ON inventario_vacas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vacas"
  ON inventario_vacas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vacas"
  ON inventario_vacas FOR DELETE
  USING (auth.uid() = user_id);

-- GASTOS DE VACAS
ALTER TABLE gastos_vacas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gastos of own vacas"
  ON gastos_vacas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = gastos_vacas.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert gastos to own vacas"
  ON gastos_vacas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = gastos_vacas.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gastos from own vacas"
  ON gastos_vacas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = gastos_vacas.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

-- PRODUCCIÓN DE LECHE
ALTER TABLE produccion_leche ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view produccion of own vacas"
  ON produccion_leche FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = produccion_leche.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert produccion to own vacas"
  ON produccion_leche FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = produccion_leche.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete produccion from own vacas"
  ON produccion_leche FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM inventario_vacas
      WHERE inventario_vacas.id = produccion_leche.vaca_id
      AND inventario_vacas.user_id = auth.uid()
    )
  );

-- ===========================================
-- FUNCIONES ÚTILES
-- ===========================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_producciones_pollos_updated_at
  BEFORE UPDATE ON producciones_pollos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lotes_gallinas_updated_at
  BEFORE UPDATE ON lotes_gallinas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_vacas_updated_at
  BEFORE UPDATE ON inventario_vacas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
