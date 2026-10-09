# NovaTech — tienda de tecnología

Sitio web de comercio electrónico para explorar productos de tecnología, armar una PC personalizada y administrar un carrito de compras. La interfaz está construida con React y TypeScript; el catálogo se consulta a un servidor independiente desarrollado con Python y Flask.

## Cómo se conectan el sitio y Flask

El frontend solicita el catálogo al iniciar y espera que la API Flask exponga:

```http
GET https://mini-backend-pm9f.onrender.com/api/products
```

La respuesta debe ser JSON con un arreglo `products`. Cada producto debe incluir un `id` con formato UUID y los datos usados por la tienda:

```json
{
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tarjeta gráfica",
      "category": "gpu",
      "price": 1299.9,
      "oldPrice": 1499.9,
      "badge": "Oferta",
      "icon": "fa-solid fa-microchip",
      "specs": "16 GB",
      "image": "https://mini-backend-pm9f.onrender.com/static/producto.jpg"
    }
  ]
}
```

`oldPrice` es opcional. El sitio muestra un estado de carga, los productos o un mensaje de error con opción para reintentar si la API no está disponible o responde con un error.

La dirección base predeterminada es `https://mini-backend-pm9f.onrender.com/api`. Puedes cambiarla creando `.env.local` en la raíz del frontend:

```dotenv
VITE_API_URL=https://mini-backend-pm9f.onrender.com/api
```

`VITE_API_URL` debe incluir el prefijo que precede a `/products`; por ejemplo, si vale `https://servidor.example/api`, el frontend consultará `https://servidor.example/api/products`. Reinicia Vite al cambiar esta variable. Si frontend y backend usan distintos orígenes, Flask debe permitir el origen del frontend mediante CORS.

> **Backend separado:** este repositorio contiene el frontend; no incluye el código Flask ni sus dependencias de Python. Inicia tu servidor Flask en otra terminal y asegúrate de que implemente el endpoint y el formato anteriores.

## Requisitos

- Node.js compatible con Vite 8.
- pnpm.
- El servidor Flask del backend, ejecutándose en la URL configurada.

## Iniciar en desarrollo

1. En una terminal, ve a la carpeta de este frontend e instala sus dependencias:

   ```powershell
   pnpm install
   ```

2. En otra terminal, inicia el backend Flask. Desde la carpeta del backend, instala las dependencias indicadas por ese proyecto (por ejemplo, con `python -m pip install -r requirements.txt`) y ejecuta su aplicación. Si su módulo de Flask se llama `app.py` y exporta una variable `app`, un comando habitual es:

   ```powershell
   python -m flask --app app run --host 127.0.0.1 --port 6072
   ```

   El nombre de módulo y la forma de iniciar Flask dependen del backend; ajusta `--app app` a la estructura de ese proyecto. La aplicación frontend usa por defecto el servidor publicado en `https://mini-backend-pm9f.onrender.com/api/products`; para apuntar a tu Flask local, establece `VITE_API_URL=http://127.0.0.1:6072/api` en `.env.local`.

3. En la terminal del frontend, inicia Vite:

   ```powershell
   pnpm dev
   ```

4. Abre [http://localhost:5475/mini-ecomerce-games/](http://localhost:5475/mini-ecomerce-games/).

Vite usa el puerto `5475` y está configurado con `strictPort`: si ya está ocupado, libera ese puerto o cambia `server.port` en `vite.config.ts`. La dirección de la API se configura por separado con `VITE_API_URL`.

## Publicar en GitHub Pages

El workflow [deploy.yml](./.github/workflows/deploy.yml) compila y publica el sitio en GitHub Pages cuando hay un `push` a `main`; también se puede ejecutar manualmente desde **Actions → Deploy React + Vite to GitHub Pages → Run workflow**. Configura la base `/mini-ecomerce-games/` y publica una página fallback para que las rutas de detalle de producto sigan cargando al actualizarlas. La dirección del sitio será:

<https://joshua-franco.github.io/mini-ecomerce-games/>

Para habilitar el despliegue:

1. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente de publicación.
2. El workflow usa por defecto `https://mini-backend-pm9f.onrender.com/api`. Si necesitas otro backend, en **Settings → Secrets and variables → Actions → Variables** crea o actualiza la variable de repositorio `VITE_API_URL` con su URL base, incluido el prefijo `/api`.
3. Verifica que el backend permita solicitudes CORS desde `https://joshua-franco.github.io` y que `https://mini-backend-pm9f.onrender.com/api/products` responda públicamente por HTTPS.
4. Envía cambios a `main` o ejecuta manualmente el workflow. La variable `VITE_API_URL` se incorpora durante la compilación; si la cambias, vuelve a ejecutar el workflow para publicar una compilación nueva.

GitHub Pages solo aloja el frontend; el backend Flask se despliega y mantiene por separado. En desarrollo, el frontend también usa el backend publicado de forma predeterminada; define `VITE_API_URL=http://127.0.0.1:6072/api` en `.env.local` si deseas conectarlo a una instancia local.

## Funcionalidades

- Portada promocional y catálogo obtenido del backend.
- Búsqueda y filtros por categoría (laptops, tarjetas gráficas, procesadores, monitores, almacenamiento y periféricos).
- Vista de detalle del producto; los enlaces usan la ruta `/producto/<uuid>`.
- Carrito persistido en el navegador, con cantidades, eliminación de artículos y totales que muestran el IGV incluido.
- Configurador local de PC con cuatro grupos de componentes.
- Registro e inicio de sesión de demostración guardados en el navegador.
- Flujo de compra de demostración: no envía pedidos ni procesa pagos en Flask.

El catálogo es la única función que actualmente consulta la API. El carrito y las cuentas se almacenan en `localStorage`; el configurador usa opciones locales. La autenticación es solo de demostración y no debe usarse como autenticación real. Los botones de seguimiento y pago tampoco están conectados a servicios del backend.

## Librerías de `package.json`

### Dependencias de la aplicación

| Paquete | Uso |
| --- | --- |
| `react`, `react-dom` | Interfaz basada en componentes y montaje en el navegador. |
| `@tailwindcss/vite`, `tailwindcss` | Integración de Tailwind CSS con Vite y estilos de la interfaz. |
| `zustand` | Estado global del carrito y persistencia en el navegador. |
| `uuid` | Validación de UUID para identificadores y rutas de productos. |
| `axios` | Cliente HTTP declarado como dependencia, pero la consulta actual al catálogo usa `fetch` nativo. |
| `@tanstack/react-query` | Herramientas de consulta/caché declaradas como dependencia; actualmente no se usan en el código de la aplicación. |

### Herramientas de desarrollo

| Paquete | Uso |
| --- | --- |
| `vite`, `@vitejs/plugin-react` | Servidor de desarrollo, compilación e integración de React. |
| `typescript` | Tipado y verificación del proyecto. |
| `oxlint` | Análisis estático y lint. |
| `@types/react`, `@types/react-dom`, `@types/node` | Definiciones de tipos usadas durante el desarrollo. |

Las fuentes Plus Jakarta Sans y Space Grotesk, y los iconos Font Awesome, se cargan desde CDN en `index.html`; necesitan conexión a Internet para mostrarse.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo de Vite en el puerto `5475`. |
| `pnpm build` | Verifica los proyectos TypeScript y genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación de `dist/` en el puerto `5475`. Ejecuta antes `pnpm build`. |
| `pnpm lint` | Ejecuta Oxlint. |

## Estructura principal

```text
src/
  api/products.ts       Consulta y valida la respuesta del catálogo.
  components/           Catálogo, cabecera, carrito, cuenta y configurador.
  data/                 Tipos del catálogo y opciones locales del configurador.
  store/useCartStore.ts Estado y persistencia del carrito.
  utils/                Formato de moneda y rutas de productos.
  App.tsx               Composición de la página y flujos de interacción.
  main.tsx              Punto de entrada de React.
```
