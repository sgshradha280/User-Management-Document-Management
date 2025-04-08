# 📦 NestJS Backend – User & Document Management

This project is a backend service built with **NestJS** for managing **user authentication**, **document workflows**, and **data ingestion processes**. It is designed to work as part of a microservices architecture with a Python-based ingestion service.

---

## 🎯 Purpose

Create a robust and scalable backend system using **NestJS** to handle:

- Secure user management with role-based access
- Document CRUD operations and uploads
- Triggers and monitoring for external ingestion processes

---

## 🔑 Key Features & APIs

### 1. **Authentication APIs**
- **Register** – Create new user accounts
- **Login / Logout** – Session management
- **Role Handling** – Support for roles: `admin`, `editor`, `viewer`

### 2. **User Management APIs**
- Admin-only endpoints for:
  - Listing all users
  - Updating roles and permissions
  - Deleting or disabling accounts

### 3. **Document Management APIs**
- Full **CRUD** operations for documents
- **Upload support** for files
- Access restrictions based on user roles

---

## 🧰 Tech Stack

| Tool               | Purpose                              |
|--------------------|--------------------------------------|
| **NestJS**         | Backend framework (TypeScript)       |
| **TypeScript**     | Static typing                        |
| **PostgreSQL**     | Relational database (recommended)    |
| **JWT**            | Auth token handling                  |
| **Role Guards**    | Access control via decorators        |
| **Microservices**  | Communicates with Python backend     |

---
## Getting Started
## Prerequisites:
- Node.js 18+
- PostgreSQL
- (Optional) Docker

----

# Setup:

## Install dependencies
```
npm install
```

## update type orm in app.module.ts
```
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'mydb1.cluster-cj4660e4wc1r.eu-north-1.rds.amazonaws.com'',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'docmanager',
      entities: [User, Document],
      synchronize: true,
    }),
 ```
## Run the app
```
npm run start
```

-------
# server endpoint 
## http://13.60.84.139:3000


# Deployment:
## Used PM2 or GitHub Actions for deployment (github action will be done atumatically when code is pushed to main)


# Queries example

## auth register
 ```
curl --request POST \
  --url http://localhost:3000/auth/register \
  --header 'content-type: application/json' \
  --data '{
  "email": "sam@example.com",
  "password": "sam@1234"
}'

```


## auth register 
```
curl --request POST \
  --url http://13.60.84.139:3000/auth/register \
  --header 'content-type: application/json' \
  --data '{
  "email": "sam@example.com",
  "password": "sam@1234"
}'

```

## auth login
```
curl --request POST \
  --url http://13.60.84.139:3000/auth/login \
  --header 'content-type: application/json' \
  --data '{
  "email": "sam@example.com",
  "password": "sam@1234"
}'
```

## create document

```

curl --request POST \
  --url http://13.60.84.139:3000/documents \
  --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbnlhQGV4YW1wbGUuY29tIiwic3ViIjoxLCJyb2xlIjoidmlld2VyIiwiaWF0IjoxNzQ0MDQxNjY1LCJleHAiOjE3NDQwNDUyNjV9.3GLeTeBu4MW_9YLvhr8m_hW0hL3aOgWjdgTMc_leGFs' \
  --header 'content-type: application/json' \
  --data '{
  "title": "My second Document",
  "content": "This is sample content",
  "filePath": "abc"
}'

```

## upload document

```

curl -X POST http://13.60.84.139:3000/documents/upload \
  -header "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..." \
  -file "file=@/Users/shradha/Desktop/test.pdf"


```
## update role

```
curl --request POST \
  --url http://http/13.60.84.139:3000/users/update-role \
  --header 'authorization: Bearer ADMIN_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
  "userId": 1,
  "role": "admin"
}'
```

## get all document

```
curl --request GET \
  --url http://13.60.84.139:3000/documents \
  --header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbUBleGFtcGxlLmNvbSIsInN1YiI6Mywicm9sZSI6InZpZXdlciIsImlhdCI6MTc0NDEwNDY1MiwiZXhwIjoxNzQ0MTA4MjUyfQ.2bltYg7v5hTN14Id7mKMU571tcYtc1DTtUMIdgtYqRk' \
  --header 'content-type: application/json'
```


 



    
