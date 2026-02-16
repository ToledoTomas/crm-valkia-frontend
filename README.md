# Valkia CRM Frontend

Sistema de gestión de ventas y productos para pequeños negocios de indumentaria. Control de inventario, gestión de clientes, análisis de rentabilidad y toma de decisiones basada en datos.

## Características

- **Dashboard**: KPIs en tiempo real, gráficos de ventas y ganancias
- **Productos**: Gestión con variantes (color/talle), cálculo automático de ganancia y margen
- **Ventas**: Creación de órdenes con carrito, desconto automático de stock
- **Stock**: Control de inventario, alertas de stock bajo, historial de movimientos
- **Clientes**: Clasificación automática (Nuevo/Recurrente/VIP/Inactivo)
- **Reportes**: Análisis de rentabilidad y rotación de productos

## Tecnologías

- **Framework**: Next.js 15.5.4 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts
- **Autenticación**: JWT
- **API**: RESTful API NestJS backend

## Requisitos Previos

- Node.js 18+
- Backend Valkia corriendo en `http://localhost:3001`
- PostgreSQL database

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd crm-valkia/frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tu configuración

# Iniciar servidor de desarrollo
npm run dev
```

## Configuración

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Scripts Disponibles

```bash
npm run dev      # Iniciar en modo desarrollo (puerto 3000)
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (dashboard)/           # Rutas protegidas del dashboard
│   │   ├── dashboard/         # KPIs y gráficos
│   │   ├── ventas/           # Módulo de ventas
│   │   ├── productos/        # Gestión de productos
│   │   ├── stock/            # Control de inventario
│   │   ├── clientes/         # Gestión de clientes
│   │   ├── reportes/         # Análisis y reportes
│   │   └── configuracion/    # Configuración
│   ├── (components)/          # Componentes compartidos
│   │   └── Sidebar/          # Navegación lateral
│   ├── login/                # Página de login
│   └── page.tsx              # Redirección a login
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx     # Protección de rutas
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── api.ts                # Cliente API centralizado
│   └── utils.ts              # Utilidades
└── types/                    # Tipos TypeScript
    ├── product.ts
    ├── invoice.ts
    ├── customer.ts
    ├── stock.ts
    ├── dashboard.ts
    └── common.ts
```

## Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Backend valida y retorna JWT token
3. Token se almacena en localStorage
4. AuthGuard verifica token en rutas protegidas
5. Token se incluye en header `Authorization: Bearer <token>`

## Módulos

### Dashboard
- Ventas del día/mes
- Ganancia del mes
- Ticket promedio
- Producto más vendido
- Stock bajo
- Clientes nuevos
- Gráficos de tendencias (últimos 12 meses)

### Productos
- Crear productos con múltiples variantes
- Cada variante: color, talle, costo, precio, stock, stock mínimo
- Cálculo automático de ganancia y margen
- Búsqueda por nombre
- Estados: Activo/Inactivo

### Ventas
- Crear ventas con selección de cliente (opcional)
- Agregar productos al carrito
- Validación de stock disponible
- Cálculo de total, costo y ganancia
- Snapshots de precio/costo al momento de la venta
- Anulación de ventas con reversión de stock

### Stock
- Vista general de inventario
- Alertas de stock bajo (stock <= stock mínimo)
- Historial de movimientos por variante
- Ajustes manuales de stock

### Clientes
- Datos: nombre, teléfono, email, instagram, cumpleaños
- Clasificación automática:
  - **Nuevo**: 1 compra
  - **Recurrente**: 2-5 compras
  - **VIP**: 6+ compras
  - **Inactivo**: 90+ días sin comprar
- Total gastado y ticket promedio
- Historial de compras

### Reportes
- Rentabilidad por producto
- Rentabilidad por categoría
- Productos sin rotación (30+ días)
- Top clientes por gasto
- Ventas por rango de fechas

## API Endpoints

Todos los endpoints requieren autenticación JWT excepto `/auth/login` y `/auth/register`.

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /auth/profile` - Perfil del usuario

### Productos
- `GET /products` - Listar productos
- `GET /products/search?name=...` - Buscar por nombre
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `POST /products/:id/variants` - Agregar variante
- `PATCH /products/variants/:id` - Actualizar variante
- `DELETE /products/variants/:id` - Eliminar variante

### Ventas (Invoices)
- `GET /invoice` - Listar ventas
- `GET /invoice/:id` - Obtener venta
- `POST /invoice` - Crear venta
- `DELETE /invoice/:id` - Anular venta (revierte stock)

### Clientes
- `GET /customer` - Listar clientes
- `GET /customer/search?name=...` - Buscar por nombre
- `GET /customer/:id` - Obtener cliente
- `POST /customer` - Crear cliente
- `PATCH /customer/:id` - Actualizar cliente
- `DELETE /customer/:id` - Eliminar cliente (soft delete)

### Stock
- `GET /stock` - Listar stock
- `GET /stock/low` - Stock bajo
- `GET /stock/movements/:variantId` - Movimientos
- `POST /stock/adjust` - Ajustar stock

### Dashboard
- `GET /dashboard/kpis` - KPIs del dashboard
- `GET /dashboard/sales-by-month` - Ventas por mes
- `GET /dashboard/profit-by-month` - Ganancia por mes
- `GET /dashboard/top-products` - Top productos

### Reportes
- `GET /reports/profitability/products` - Rentabilidad por producto
- `GET /reports/profitability/categories` - Rentabilidad por categoría
- `GET /reports/products/no-rotation` - Sin rotación
- `GET /reports/customers/top-spenders` - Top clientes
- `GET /reports/sales?from=...&to=...` - Ventas por período

## Modelo de Datos

### Producto
```typescript
{
  id: number
  name: string
  category: string
  description?: string
  active: boolean
  variants: ProductVariant[]
}
```

### Variante de Producto
```typescript
{
  id: number
  productId: number
  color: string
  size: string
  cost: number
  price: number
  stock: number
  minStock: number
  // Calculado:
  ganancia: number  // price - cost
  margen: number    // (ganancia / price) * 100
}
```

### Venta (Invoice)
```typescript
{
  id: number
  customerId?: number
  total: number
  totalCost: number
  totalProfit: number
  items: InvoiceItem[]
  createdAt: string
}
```

### Item de Venta
```typescript
{
  id: number
  productVariantId: number
  quantity: number
  priceAtSale: number  // Snapshot
  costAtSale: number   // Snapshot
}
```

### Cliente
```typescript
{
  id: number
  name: string
  phone?: string
  email?: string
  instagram?: string
  birthday?: string
  // Calculado:
  totalSpent: number
  lastPurchase?: string
  orderCount: number
  classification: 'NUEVO' | 'RECURRENTE' | 'VIP' | 'INACTIVO'
}
```

## Seguridad

- JWT tokens para autenticación
- Tokens almacenados en localStorage
- AuthGuard protege rutas del dashboard
- Header Authorization en todas las peticiones API
- Manejo de errores 401 (redirección a login)

## Desarrollo

### Agregar un nuevo componente shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

### Agregar un nuevo módulo

1. Crear directorio en `src/app/(dashboard)/<modulo>/`
2. Crear `api/index.ts` con las llamadas al backend
3. Crear `page.tsx` con la UI del módulo
4. Agregar ruta al Sidebar

### Convenciones de código

- TypeScript estricto
- Componentes funcionales con hooks
- Uso de React Query/SWR para data fetching (opcional)
- Manejo de errores con try/catch
- Toast notifications para feedback
- Formato de moneda: `es-AR` con `ARS`
- Fechas: ISO 8601 del backend, formato local en UI

## Licencia

Proyecto privado - Valkia

## Soporte

Para reportar issues o solicitar features, contactar al equipo de desarrollo.
