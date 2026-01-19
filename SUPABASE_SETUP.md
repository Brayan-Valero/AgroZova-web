# Guía de Configuración de Supabase - Gosén AgroZova

Esta guía te ayudará a configurar Supabase para el proyecto Gosén AgroZova SAS.

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Click en "New Project"
4. Completa los datos:
   - **Nombre**: Gosen-AgroZova
   - **Database Password**: (Guarda esta contraseña segura)
   - **Región**: South America (São Paulo) - La más cercana a Colombia
5. Click en "Create new project"
6. Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Obtener Credenciales

1. Ve a **Settings** (ícono de engranaje en el sidebar)
2. Click en **API**
3. Copia los siguientes valores:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: La API key que empieza con `eyJ...`

## Paso 3: Configurar Variables de Entorno

1. En tu proyecto local, crea el archivo `.env.local` en la raíz:

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

2. Reemplaza los valores con tus credenciales reales
3. **NUNCA** subas este archivo a Git (ya está en .gitignore)

## Paso 4: Ejecutar el Script SQL

1. En Supabase, ve al **SQL Editor** (ícono de base de datos en sidebar)
2. Click en "New query"
3. Abre el archivo `supabase-schema.sql` de tu proyecto local
4. Copia **TODO** el contenido y pégalo en el editor
5. Click en "Run" o presiona `Ctrl + Enter`
6. Verifica que no haya errores

## Paso 5: Verificar las Tablas

1. Ve a **Table Editor** en el sidebar
2. Deberías ver todas las tablas creadas:
   - producciones_pollos
   - gastos_pollos
   - ingresos_pollos
   - lotes_gallinas
   - gastos_gallinas
   - ventas_gallinas
   - inventario_vacas
   - gastos_vacas
   - produccion_leche

## Paso 6: Configurar Autenticación

1. Ve a **Authentication** > **Providers**
2. Asegúrate que **Email** esté habilitado
3. En **Email Templates**, puedes personalizar:
   - Confirmation email
   - Magic link email
   - Reset password email

### Configuración Recomendada:

**Settings** > **Auth** > **Email Auth**:
- ✅ Enable email confirmations: **Deshabilitado** (para desarrollo)
- ✅ Secure email change: **Habilitado**
- ✅ Secure password change: **Habilitado**

**Para producción**, habilitar email confirmation.

## Paso 7: Verificar RLS (Row Level Security)

1. Ve a **Authentication** > **Policies**
2. Selecciona cada tabla
3. Verifica que las políticas estén activas:
   - "Users can view own XXX"
   - "Users can insert own XXX"
   - "Users can update own XXX"
   - "Users can delete own XXX"

## Paso 8: Probar la Conexión

1. Inicia tu aplicación:
```bash
npm run dev
```

2. Abre http://localhost:3000
3. Intenta registrarte con un email de prueba
4. Deberías poder:
   - Crear una cuenta
   - Hacer login
   - Ver el dashboard

## Paso 9: Insertar Datos de Prueba (Opcional)

Ejecuta este SQL para crear datos de ejemplo:

```sql
-- Insertar una producción de pollos de prueba
-- Reemplaza 'USER_ID_AQUI' con el ID de tu usuario de auth.users
INSERT INTO producciones_pollos (
  user_id,
  nombre,
  galpon,
  cantidad_inicial,
  cantidad_actual,
  fecha_inicio,
  estado
) VALUES (
  'USER_ID_AQUI',
  'Lote A-24 - Galpón Norte',
  'Galpón Norte',
  500,
  500,
  CURRENT_DATE,
  'activo'
);
```

Para obtener tu USER_ID:
1. Haz login en la app
2. En Supabase, ve a **Authentication** > **Users**
3. Copia el UUID de tu usuario

## Paso 10: Configurar para Producción

Cuando vayas a producción:

1. **Habilitar email confirmation** en Auth settings
2. **Configurar dominio personalizado** en Settings > API
3. **Actualizar RLS policies** si necesitas reglas más complejas
4. **Configurar backups** en Settings > Database
5. **Añadir variable de entorno en Netlify**:
   - `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de usar el **anon public** key, no el service_role

### Error: "Row Level Security policy violation"
- Verifica que el usuario esté autenticado
- Revisa que las políticas RLS estén activas
- Confirma que user_id coincide con auth.uid()

### No puedo hacer login
- Verifica que la tabla auth.users tenga el usuario
- Revisa la consola del navegador para errores
- Confirma que la URL y API key sean correctas

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¿Necesitas ayuda?** Contacta a soporte@gosena.com
