# Gosén AgroZova SAS - Sistema de Gestión Agropecuaria

Sistema web completo para la gestión profesional de actividades agropecuarias, desarrollado con React, Vite, Tailwind CSS y Supabase.

## 🚀 Características

- **Autenticación Segura**: Login/registro con Supabase Auth
- **Módulo Pollos de Engorde**: Gestión completa de producciones, gastos e ingresos
- **Módulo Gallinas de Postura**: Control de lotes, ventas de huevos (cartón/unidad)
- **Módulo Vacas Lecheras**: Inventario de ganado y producción láctea
- **Contabilidad General**: Consolidación financiera de todos los módulos
- **Dashboard Dinámico**: Resumen en tiempo real de ingresos, gastos y balance
- **Diseño Mobile-First**: Optimizado para dispositivos móviles
- **Dark Mode**: Soporte para modo oscuro
- **Row Level Security (RLS)**: Cada usuario solo accede a sus datos

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite 5
- **Estilos**: Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL + Auth)
- **Enrutamiento**: React Router v6
- **Iconos**: Material Symbols
- **Fuente**: Manrope

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd AgroZova\ web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu-supabase-url
VITE_SUPABASE_ANON_KEY=tu-supabase-anon-key
```

4. **Configurar base de datos en Supabase**

Ejecutar los scripts SQL proporcionados en `/supabase-schema.sql` para crear las tablas necesarias y configurar Row Level Security.

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── ProtectedRoute.jsx
│   ├── context/         # Contextos de React
│   │   └── AuthContext.jsx
│   ├── pages/           # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PollosEngorde.jsx
│   │   ├── GallinasPosura.jsx
│   │   ├── VacasLecheras.jsx
│   │   └── ContabilidadGeneral.jsx
│   ├── services/        # Servicios de Supabase
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   ├── pollos.js
│   │   ├── gallinas.js
│   │   └── vacas.js
│   ├── utils/           # Utilidades
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── front/               # HTML estático de referencia
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── netlify.toml
```

## 🗄️ Esquema de Base de Datos

### Producciones de Pollos
- `producciones_pollos`: Lotes de pollos de engorde
- `gastos_pollos`: Gastos por producción
- `ingresos_pollos`: Ingresos por venta de pollos

### Gallinas de Postura
- `lotes_gallinas`: Lotes de gallinas ponedoras
- `gastos_gallinas`: Gastos por lote
- `ventas_gallinas`: Ventas de huevos

### Vacas Lecheras
- `inventario_vacas`: Inventario de vacas
- `gastos_vacas`: Gastos por vaca
- `produccion_leche`: Registro de producción láctea

## 🚢 Deploy a Netlify

1. **Build de producción**
```bash
npm run build
```

2. **Conectar repositorio a Netlify**
   - Ir a [Netlify](https://app.netlify.com/)
   - Conectar repositorio de GitHub
   - Configurar variables de entorno (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

3. **Deploy automático**

Netlify detectará automáticamente la configuración de `netlify.toml` y realizará el deploy.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run preview` - Preview del build de producción

## 🔒 Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) activado en todas las tablas
- Variables de entorno para credenciales sensibles
- Rutas protegidas con ProtectedRoute component

## 🎨 Paleta de Colores

- **Primary**: `#37ec13` (Verde brillante)
- **Background Light**: `#f6f8f6`
- **Background Dark**: `#132210`
- **Accent Gold**: `#FFD700`

## 📱 Responsive Design

El diseño es **Mobile First** y se adapta perfectamente a:
- Smartphones
- Tablets
- Desktop

## 🤝 Contribuir

Este es un proyecto privado de Gosén AgroZova SAS.

## 📄 Licencia

© 2024 Gosén AgroZova SAS. Todos los derechos reservados.

## 🆘 Soporte

Para soporte técnico, contactar a: soporte@gosena.com
