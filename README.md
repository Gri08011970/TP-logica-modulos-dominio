# Grupo 8 – UTN CUDI – Tienda (SPA + API)
### Diplomatura Desarrollo Web I – 2025

**Resumen:** Proyecto full-stack con frontend SPA (Vite + React) y backend API (Node + Express).  
La **persistencia principal es MongoDB Atlas** vía Mongoose.  
Se mantiene un **modo alternativo con JSON** solo para práctica/offline.

---

## 🚀 Demo en producción

Proyecto desplegado en **Railway** (Backend + Frontend integrados) usando **MongoDB Atlas** como base de datos principal (`USE_MONGO=true`).

- **App completa (Frontend + API en Railway)**  
  👉 http://tp-logica-modulos-dominio-production.up.railway.app/

- **API base (producción)**  
  👉 `https://tp-logica-modulos-dominio-production.up.railway.app/api`

---

## 🧱 Tecnologías principales

**Frontend**

- Vite + React
- React Router
- Tailwind CSS (estilos utilitarios)
- LocalStorage (persistencia del carrito)

**Backend**

- Node.js + Express
- MongoDB Atlas + Mongoose
- BcryptJS (hash de contraseñas)
- JSON Web Tokens (JWT)
- Dotenv (variables de entorno)
- Nodemon (entorno de desarrollo)

**Infraestructura**

- Railway (deploy de frontend + backend en un mismo servicio)
- MongoDB Atlas (base de datos en la nube)

---

## 🔑 Credenciales de Acceso de Prueba

### 👨‍💻 Administrador por defecto

| Campo | Valor |
| :--- | :--- |
| **Email** | `admin@tienda.com` |
| **Password** | `utn123`  |

### 👩‍💻 Usuario Común de Prueba

| Campo | Valor |
| :--- | :--- |
| **Email** | `grisel@gmail.com` |
| **Password** | `gri123` |
---
## 🧩 Estructura del Proyecto

Estructura principal siguiendo la separación **frontend (SPA)** y **backend (API)**:

🌳 Estructura del Proyecto

```.
├── backend/
│ ├── docs/
│ ├── logs/
│ ├── node_modules/
│ └── src/
│     ├── order/
│     │   ├── handlers/
│     │   │   └── order.handlers.mjs
│     │   ├── models/
│     │   │   └── order.model.mjs
│     │   ├── repositories/
│     │   ├── routes/
│     │   │   └── order.routes.mjs
│     │   └── validations/
│     ├── product/
│     │   ├── handlers/
│     │   │   └── product.handlers.mjs
│     │   ├── models/
│     │   │   └── product.model.mjs
│     │   ├── repositories/
│     │   │   └── product.repositories.mjs
│     │   ├── routes/
│     │   │   └── product.routes.mjs
│     │   └── validations/
│     │       └── product.validation.mjs
│     ├── shared/
│     │   ├── constants/
│     │   ├── middlewares/
│     │   ├── utils/
│     │   │   ├── formatPagination.mjs
│     │   │   ├── logger.mjs
│     │   │   └── validatedId.mjs
│     │   ├── auth.mjs
│     │   └── validation.mjs
│     ├── user/
│     │   ├── handlers/
│     │   │   └── user.handlers.mjs
│     │   ├── models/
│     │   │   └── user.model.mjs
│     │   ├── repositories/
│     │   ├── routes/
│     │   │   └── user.routes.mjs
│     │   └── validations/
│     ├── db.mjs
│     └── index.mjs
├── public/
│ ├── images/
│ │ ├── hombre/
│ │ ├── mujer/
│ │ └── unisex/
│ ├── favicon-32.png
│ ├── favicon-64.png
│ 
│ ├── logo.svg
│ ├── logo_gif_gear_128.png
│ ├── logo_gif_wordmark_indigo.png
│ └── _redirects
├── scripts/
│ └── migrate-from-json.mjs
└── src/
    ├── assets/
    │   └── react.svg
    ├── components/
    │   ├── Footer.jsx
    │   ├── NavBar.jsx
    │   ├── Pagination.jsx
    │   └── ProductCard.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   └── CartContext.jsx
    ├── hooks/
    │   ├── UseAuth.js
    │   └── useFetch.js
    ├── pages/
    │   ├── AdminOrdersPage.jsx
    │   ├── AdminProductsPage.jsx
    │   ├── CartPage.jsx
    │   ├── CategoriesPage.jsx
    │   ├── CategoryDetailPage.jsx
    │   ├── HomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── ProductDetailPage.jsx
    │   ├── RegisterPage.jsx
    │   └── SignUpPage.jsx
    ├── services/
    │   ├── api.js
    │   ├── auth.js
    │   ├── imageUrl.js
    │   ├── orders.js
    │   ├── products.js
    │   └── profile.js
    ├── styles/
    │   └── index.css
    ├── App.jsx
    └── main.jsx
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .nvmrc
├── db.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```
**⚙️ Configuración de entorno** 
Backend – .env (local)
Mongo es el modo principal → definir MONGO_URL y dejar USE_MONGO=true.


# Puerto interno de la API
PORT=4001

# Activar MongoDB
USE_MONGO=true

# Cadena de conexión a MongoDB Atlas
MONGO_URL=mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxxx.mongodb.net/NOMBRE_DB?retryWrites=true&w=majority

# Origen permitido para CORS (frontend)
FRONT_ORIGIN=http://localhost:5173

# JWT
JWT_SECRET=un-secreto-bien-largo-y-seguro
JWT_EXPIRES_IN=1d

# Admin por defecto
ADMIN_EMAIL=admin@tienda.com

# Logs
LOG_ENABLED=true
MORGAN_FORMAT=dev
LOG_TO_FILE=false
Frontend – .env (local)

VITE_API_URL=http://localhost:4001/api
Variables en producción (Railway)
En Railway se usan las mismas claves, apuntando a producción. Ejemplo:


USE_MONGO=true
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>/<nombreDB>?retryWrites=true&w=majority
FRONT_ORIGIN=http://tp-logica-modulos-dominio-production.up.railway.app/
CORS_ORIGIN=http://tp-logica-modulos-dominio-production.up.railway.app/
VITE_API_URL=http://tp-logica-modulos-dominio-production.up.railway.app/api
JWT_SECRET=dev-super-secret
ADMIN_EMAIL=admin@tienda.com
LOG_ENABLED=true
MORGAN_FORMAT=dev
LOG_TO_FILE=false


***Estado típico del deploy:***

MongoDB conectado
API escuchando en http://localhost:8080/api (USE_MONGO=true)


**🏃‍♀️ Puesta en marcha (local)**
Clonar el repo:

git clone https://github.com/Gri08011970/TP-logica-modulos-dominio.git
cd TP-logica-modulos-dominio
Instalar dependencias:


npm install
Crear .env a partir de .env.example y completar:

MONGO_URL

JWT_SECRET

etc.

Ejecutar el entorno de desarrollo (API + frontend al mismo tiempo):


npm run dev
Se levanta:

Frontend: http://localhost:5173

API: http://localhost:4001/api


*** Migración de datos desde db.json → Mongo***
La API puede levantar datos desde Mongo o desde db.json.
En este proyecto, Mongo Atlas es el modo principal.

Simulación (no escribe):


npm run migrate:json:dry
Migración real:


npm run migrate:json
Esto crea/actualiza las colecciones users, products, orders en la base tp_grupal_utn.

---

**🔌 Endpoints principales de la API**

GET /api/products
Listado paginado de productos, con filtros por category, subcategory y name.

GET /api/products/:id
Detalle de producto.

POST /api/products (solo admin)
Alta de producto.

PUT /api/products/:id (solo admin)
Modificación de producto.

DELETE /api/products/:id (solo admin)
Baja lógica / eliminación.

POST /api/orders
Creación de una orden a partir del carrito.

GET /api/orders (solo admin)
Listado de órdenes.

POST /api/auth/login
Login de usuario administrador.

POST /api/auth/register
Registro de nuevos usuarios.

GET /api/images/...
Servido estático de imágenes desde /public/images.


---

## 🧩 Funcionalidades implementadas

### Catálogo de productos
### Paginación en Home y Categorías.

### Filtro por categoría (Mujer / Hombre / Unisex).

 (jeans, remeras, bermudas, vestidos, etc.).

 Vista de detalles con descripción, precio e imagen grande.

### Carrito de compras
Agregar / quitar productos.

Modificar cantidades.

Cálculo de subtotal y total.

Persistencia en localStorage.

### ABMC de productos (Admin)
Alta, baja, modificación y consulta de productos.

Validaciones básicas en el formulario (campos obligatorios).

Integración directa con MongoDB (tp_grupal_utn.products).

Previsualización de la imagen según la ruta relativa guardada.

### Órdenes
Simulación de compra → se genera una orden en MongoDB.

Visualización y cambio de estado de órdenes desde el panel de administración.

Posibilidad de compra manual desde el admin 

Autenticación
Login de administrador con JWT.

Protección de rutas de administración.

Asociación de órdenes al usuario logueado.


---

## 📷 Evidencias del funcionamiento (con MongoDB)

### 01. Sesión de usuario y admin
![01-conSesion](docs/capturas/01-consesion.png)
![01-conSesionAdmin](docs/capturas/01-consesionadmin.png)

### 01c. Home
![01-home](docs/capturas/01-home.png)

### 02. Registro y login
![02-formRegistro](docs/capturas/02-formregistro.png)
![02-rta201LoginInmediato](docs/capturas/02-rta201logininmediato.png)

### 03. Productos por categoría
![03-ProductosCategoriaHombre](docs/capturas/03-productoscategoriahombre.png)
![03-ProductosCategoriaMujer](docs/capturas/03-productoscategoriamujer.png)
![03-ProductosCategoriaUnisex](docs/capturas/03-productoscategoriaunisex.png)

### 04. Alta/Edición y eliminación
![04-alertaEliminar](docs/capturas/04-alertaeliminar.png)
![04-formAutoCompletadoParaEditar](docs/capturas/04-formautocompletadoparaeditar.png)
![04-formProductos-Listado-Crear](docs/capturas/04-formproductos-listado-crear.png)

### 05. Validaciones en creación de producto
![05-crearProductoCamposObligatorios](docs/capturas/05-crearproductocamposobligatorios.png)

### 06. Edición confirmada
![06-editarProducto-200Red](docs/capturas/06-editarproducto-200red.png)
![06-editarProductoRespuesta200Red](docs/capturas/06-editarproductorespuesta200red.png)

### 07. Eliminación reflejada en listado
![07-desaparicionProductoDelListado](docs/capturas/07-desaparicionproductodellistado.png)
![07-productoEliminadoRespuestaRed](docs/capturas/07-productoeliminadorespuestared.png)
![07-productoEliminarBermudaGabardinaHombre](docs/capturas/07-productoeliminarbermudagabardinahombre.png)

### 08. Carrito
![08-carrito](docs/capturas/08-carrito.png)
![08-productoAgregadoCarrito](docs/capturas/08-productoagregadocarrito.png)

### 09. Checkout
![09-checkout](docs/capturas/09-checkout.png)
![09-comprafinalizada](docs/capturas/09-comprafinalizada.png)

### 10. Compras (listado)
![10-comprasListado](docs/capturas/10-compraslistado.png)

### 11. Cambios de estado
![11-cambioestadoDesplegable](docs/capturas/11-cambioestadodesplegable.png)
![11-Red200](docs/capturas/11-red200.png)

### 12. Compra manual
![12-compraManualRed201](docs/capturas/12-compramanualred201.png)
![12-modalCompraManual](docs/capturas/12-modalcompramanual.png)

### 13. MongoDB conectado (modo principal)
![13-MongoDBconectado](docs/capturas/13-mongodbconectado.png)

### 14. MongoDB mostrar usuario
![14-MongoDBmuestraUsuario](docs/capturas/14-mongodb.png)

### 15. MongoDB mostrar producto
![15-MongoDBmuestraProducto](docs/capturas/15-mongodbproducto.png)

### 16. MongoDB mostrar compra
![16-MongoDBmuestraCompra](docs/capturas/16-mongodbcompra.png)
---



***✅ Conclusiones***

Este proyecto:

Centraliza la lógica de negocio en una API REST con módulos bien separados.

Mantiene la cohesión entre capas (frontend, backend, dominio) y reduce el acoplamiento.

Permite un despliegue cercano a un caso real de producción usando Railway + MongoDB Atlas.

Estandariza el manejo de rutas de imágenes con un endpoint /api/images/... y una utilidad getImageUrl en el frontend.

***👥 Créditos / Integrantes***

Grupo 8 – UTN 2025

Axel Chamorro

Magalí Izaurralde

Diego Farías

Daniela Ávalos

Mauro Britez

Leandro Pinazo

Griselda Molina

Profesor: Axel Leonardi