# Inventory Manager

A full-stack inventory management web application. Users register and log in, then manage their own products, see stock levels in a chart, and review a log of every change they made.

- **Backend:** Java 17, Spring Boot, Spring Security (JWT), Spring Data JPA
- **Database:** MySQL (works with XAMPP / phpMyAdmin)
- **Frontend:** React (Vite), React Router, Axios
- The frontend and backend are separate projects that communicate through a REST API.

## Features

**Required**
- User registration and login
- Full CRUD for products (create, read, update, delete)
- MySQL database
- RESTful API
- Separate frontend and backend
- Git history with small, descriptive commits

**Bonus**
- **JWT authentication:** every product and log endpoint needs a valid token
- **Search, filter and sorting:** search by name, filter by category, sort by date, name, price or quantity
- **Application logging:** SLF4J logs for create, update and delete actions
- **Change log:** records what changed, the old and new value, who changed it and when, with filters by product, action and date
- **Stock chart:** bar or line chart of the quantity left per item, with a legend, a quantity axis, click-to-hide and a reset button
- **Responsive, clean UI:** a side menu that can be hidden, a 5-row scrolling table, and a low-stock badge for items under 5
- **Data separation:** each user can only see and change their own products and logs
- **Validation and clean errors:** invalid input is rejected with clear messages
- Passwords are hashed with BCrypt and are never stored in plain text

## Project structure

```
inventory-app/
├── backend/                     Spring Boot REST API
│   └── src/main/java/com/example/inventory/
│       ├── controller/          REST endpoints (auth, products, logs)
│       ├── service/             business logic and audit logging
│       ├── repository/          Spring Data JPA repositories
│       ├── entity/              JPA entities (User, Product, AuditLog)
│       ├── dto/                 request/response objects with validation
│       ├── security/            JWT service, JWT filter, security config
│       └── exception/           global error handler
└── frontend/                    React app (Vite)
    └── src/
        ├── pages/               Login, Register, Products, ProductForm, Logs
        ├── components/          Layout (side menu), StockChart, ProtectedRoute
        ├── api.js               Axios instance that adds the JWT to requests
        └── AuthContext.jsx      login state shared across the app
```

## Prerequisites

- JDK 17
- Node.js 20 or newer (with npm)
- MySQL (for example XAMPP, which includes phpMyAdmin)

## How to run

### 1. Database

Start MySQL, then create an empty database named `inventory_db` (for example in phpMyAdmin). The tables are created automatically the first time the backend runs.

The default connection in `backend/src/main/resources/application.properties` is:

```
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=
```

Change the username or password there if your MySQL is set up differently.

### 2. Backend (http://localhost:8080)

```
cd backend
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # macOS / Linux
```

You can also open the `backend` folder in IntelliJ IDEA and run `InventoryApplication`.

### 3. Frontend (http://localhost:5173)

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173, register an account, and start adding products.

## API overview

All endpoints except `/api/auth/**` need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account and receive a token |
| POST | `/api/auth/login` | Log in and receive a token |
| GET | `/api/products` | List your products. Optional: `search`, `category`, `sortBy` (`name`, `price`, `quantity`, `category`, `createdAt`), `direction` (`asc`, `desc`) |
| GET | `/api/products/{id}` | Get one of your products |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |
| GET | `/api/logs` | Your latest 200 changes, newest first |

Example request body for creating a product:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "description": "14 inch office laptop",
  "quantity": 10,
  "price": 2999.90
}
```

Typical status codes: `200` OK, `201` created, `204` deleted, `400` invalid input, `401` wrong login, `403` missing or invalid token, `404` product not found.

## How authentication works

1. The user registers or logs in, and the server returns a signed JWT.
2. The React app stores the token and the Axios instance adds it to every request.
3. A Spring Security filter validates the token on each request and identifies the user.
4. Products and logs are always filtered by the logged-in user, so users never see each other's data.

## Notes and limitations

- The JWT secret is in `application.properties` to keep local setup simple. A real deployment should load it from an environment variable.
- The token is stored in the browser's `localStorage`. This is simple, but a production app might prefer secure, HTTP-only cookies.
- The category list is enforced in the frontend only. The API accepts any text.
- `spring.jpa.hibernate.ddl-auto=update` creates the tables automatically. A production app would use migrations (for example Flyway).
- Image upload is not included.

## Possible future improvements

- Image upload for products
- Admin role with an overview of all users
- Pagination for large product lists
- Automated tests and Docker setup

## 🎥 Video Presentation

A complete video presentation and demonstration of the Inventory Management System, showcasing the application's features, functionality, and implementation.

### 📺 Watch the Project Demonstration

[![Inventory Management System Video Presentation](https://img.youtube.com/vi/4PzkmHnI3n4/hqdefault.jpg)](https://youtu.be/4PzkmHnI3n4)
- Please put the higher quality resolution for the best experience
  
**▶️ [Click Here to Watch the Full Video Presentation](https://youtu.be/4PzkmHnI3n4)**

## Author

Built by ImranHairol1 for the Neurogine full-stack assignment.
