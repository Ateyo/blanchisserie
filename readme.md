# Blanchisserie – Laundry Orders Web Application

This repository contains a full-stack web application for managing laundry orders, built with:

- **Backend**: ASP.NET Core (.NET 8), Entity Framework Core, C#
- **Frontend**: Angular, PrimeNG, TypeScript
- **Database**: Microsoft SQL Server (Docker)
- **Containerization**: Docker & Docker Compose

---

## Features

- **User authentication** (JWT)
- **Order creation** (date, articles, identity, optional reason/comment)
- **Admin validation/refusal** of orders
- **Order tracking** for users and admins
- **Modern UI** with Angular & PrimeNG

```

user :
username : user.name 
password : user123

admin: admin.name
password : admin123
```

---

## Project Structure

```
blanchisserie/
├── docker-compose.yml          # Multi-container orchestration
├── laundryOrdersApi/           # .NET backend API
│   └── Dockerfile
├── laundryOrders/              # Angular frontend
│   └── Dockerfile
```

---

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed and running
- [Docker Compose](https://docs.docker.com/compose/) (v2 recommended)

---

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd blanchisserie
   ```

2. **Build and run all services**
   ```bash
   docker compose up --build
   ```
   This will:
   - Build and run the backend API on [http://localhost:5000](http://localhost:5000)
   - Build and serve the Angular frontend on [http://localhost:4200](http://localhost:4200)
   - Start a SQL Server database container

3. **Access the application**
   - **Frontend**: [http://localhost:4200](http://localhost:4200)
   - **API**: [http://localhost:5000](http://localhost:5000)

---

## Development Notes

- **Backend**: Source in `laundryOrdersApi/`, Dockerfile provided.
- **Frontend**: Source in `laundryOrders/`, Dockerfile provided.  
  The build output is copied to nginx for static serving.
- **Database**: SQL Server runs in a container. Connection string is configured for Docker networking.

---

## Troubleshooting

- If you see the nginx welcome page on `localhost:4200`, ensure the Angular build output is correctly copied in the frontend Dockerfile.
- For database connection issues, check that the API uses the service name `db` as the SQL Server host.
- To inspect containers:
  ```bash
  docker ps
  docker exec -it <container_name> sh
  ```

---

## Useful Commands

- **Stop all containers**:  
  ```bash
  docker compose down
  ```
- **Rebuild everything (no cache)**:  
  ```bash
  docker compose build --no-cache
  ```

---