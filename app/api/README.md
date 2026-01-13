# API Documentation

---

## Table of Contents
1. [Staff Endpoints](#staff-endpoints)  
2. [RBAC / Role Endpoints](#rbac--role-endpoints)  
3. [Authentication](#authentication)  
4. [Blog Endpoints](#blog-endpoints)  

---

## Staff Endpoints

### 1. Create Staff Member
- **Endpoint:** `/api/staff/create`  
- **Method:** `POST`  
- **Roles Allowed:** `executive`, `superadmin`, `manager`  

**Request Body Example:**
```json
{
  "names": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123",
  "role": "manager",
  "phone": "+250788123456"
}
```

**Response (201 Created):**
```json
{
  "staff": {
    "acknowledged": true,
    "insertedId": "68da404ed773e221047e5b7a"
  },
  "message": "New Staff Member Created"
}
```

**Errors:**  
- `401 Unauthorized` – Missing or invalid token  
- `403 Forbidden` – Insufficient role  

---

### 2. Self Update
- **Endpoint:** `/api/staff/self/:id/`  
- **Method:** `PATCH`  
- **Roles Allowed:** `*` (any authenticated user)  

**Request Body Example:**  
```json
{
  "names": "Updated Name",
  "phone": "+250788000000"
}
```

**Response:** Updated staff member object.

---

### 3. Update Password
- **Endpoint:** `/api/staff/self/password/:id`  
- **Method:** `PATCH`  
- **Roles Allowed:** `executive, superadmin`  

**Request Body Example:**  
```json
{
  "password": "NewPass456"
}
```
**Respponse**

```json
{
  "message": "Password updated successfully"
}
```

---

### 4. Query Users
- **Endpoint:** `/api/staff?role=executive&isActive=true`  
- **Method:** `GET`  
- **Roles Allowed:** `executive`, `superadmin`, `manager` 
- **Authorization**: Bearer `<accessToken>`

**Response:** Array of user objects.

---

### 5. Get Staff Member by ID
- **Endpoint:** `/api/staff/:id`  
- **Method:** `GET`  
- **Roles Allowed:** Based on your RBAC settings  
- **Authorization**: Bearer `<accessToken>`

**Response**: user object

---

### 6. Refresh Token
- **Endpoint:** `/api/refresh`  
- **Method:** `POST`  
- **Roles Allowed:** `*`  

***Request Body***
```json
{
  "refreshToken":".............."
}
```
***Response***
```json
{
  "accessToken": "..............."
}
```
---

## RBAC / Role Endpoints

### 7. Create Role
- **Endpoint:** `/api/rbac/roles`  
- **Method:** `POST`  
- **Roles Allowed:** `executive`, `superadmin`  
**Request Body**

```json
{
  "name":"role name",
  "description":"role description"
}
```
**Response**
- status: 201
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "createdAt": "2025-09-29T08:47:43.696Z",
  "updatedAt": "2025-09-29T08:47:43.696Z",
  "_id": "68da47b0d773e221047e5b7d"
}
```
- errors
```json
{
  "error": "string"
}
```
---

### 8. Delete User Role
- **Endpoint:** `/api/rbac/users/:id/roles`  
- **Method:** `DELETE`  
- **Roles Allowed:** `executive`, `superadmin`  

---

### 9. Get All Roles
- **Endpoint:** `/api/rbac/roles`  
- **Method:** `GET`  
- **Roles Allowed:** Any authenticated user  

**Request Header:**  
```http
Authorization: Bearer <your_JWT_token>
```

**Response (200 OK):**
```json
[
  {
    "_id": "68d95babd773e221047e5b75",
    "id": "8a9f3315-0518-4ada-b609-b00d733a0977",
    "name": "manager1",
    "description": "This is the manager role",
    "createdAt": "2025-09-28T16:00:42.807Z",
    "updatedAt": "2025-09-28T16:00:42.807Z"
  }
]
```

**Errors:**  
- `401 Unauthorized` – Missing token  
- `403 Forbidden` – Insufficient role  

---

### 10. Get Role by ID
- **Endpoint:** `/api/rbac/roles/:roleid`  
- **Method:** `GET`  
- **Roles Allowed:** Authenticated users  
- **Response**: Role object
---

### 11. Update Role
- **Endpoint:** `/api/rbac/roles/:roleid`  
- **Method:** `PATCH`  
- **Roles Allowed:** `executive`, `superadmin`  

---

### 12. Delete Role
- **Endpoint:** `/api/rbac/roles/:roleid`  
- **Method:** `DELETE`  
- **Roles Allowed:** `executive`, `superadmin`  

---

### 13. Assign Role to User
- **Endpoint:** `/api/rbac/roles/:roleid/users`  
- **Method:** `POST`  
- **Roles Allowed:** `executive`, `superadmin`  

---

## Authentication

### 14. Login
- **Endpoint:** `/api/auth/login`  
- **Method:** `POST`  

**Request Body Example:**  
```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

**Response:**  
```json
{
  "accessToken": "<jwt_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

---

## Blog Endpoints

### 15. Search Blog Posts
- **Endpoint:** `/api/blog/search`  
- **Method:** `GET`  
- **Query Parameters:** `q`, `author`, `tags`, `page`, `limit`  
- **Example URL:**  
```
/api/blog/search?q=security&author=Alice&tags=cyber,python&page=1&limit=5
```

---

### 16. Create Blog Post
- **Endpoint:** `/api/blogposts/`  
- **Method:** `POST`  
- **Roles Allowed:** `superadmin`, `executive`, `cto`  
**Request Body**

```json
{
  "title":"Visiting",
  "excerpt":"String",
  "content":"Blog Content",
  "author":"ITBienvenu",
  "tags":["bienvenu","mwimule","gashema","cst"],
  "slug":"Materialization",
  "readTime":5,
  "thumbnailUrl":"https://thumbanail.com"
}
```

**Response**

```json
{
  "blog": {
    "acknowledged": true,
    "insertedId": "68da504cd773e221047e5b80"
  },
  "message": "Blog Created"
}
```
---

### 17. Get All Blog Posts
- **Endpoint:** `/api/blogposts/`  
- **Method:** `GET`  
- **Roles Allowed:** `*`  
- **Response**: List Blog Post Object
---

### 18. Get Single Blog Post
- **Endpoint:** `/api/blogposts/:slug/`  
- **Method:** `GET`  
- **Roles Allowed:** `*`  

---

### 19. Update Blog Post
- **Endpoint:** `/api/blogposts/:slug`  
- **Method:** `PATCH`  
- **Roles Allowed:** `superadmin`, `executive`, `cto`
- **Request**: Blog post Object, Optional Fields
- **Response**: Blog post Object 

---

### 20. Delete Blog Post
- **Endpoint:** `/api/blogposts/:slug`  
- **Method:** `DELETE`  
- **Roles Allowed:** `executive`, `superadmin`  


## NewsLetter Endpoints
### 21. NewsLetter Subscribers
- **Endpoint**: `/api/newsletter`
- **Method**: `GET`
- **Roles Allowed**: `superadmin`, `executive`, `cto`

**Response**

```json
{
  "success": true,
  "subscribers": [
    {
      "_id": "68d68981bb8738ec06454f55",
      "email": "user@mail.com",
      "subscribeAt": "2025-09-26T12:39:28.508Z",
      "source": "website"
    }
  ]
}
```
---

### 22. User Subscribing to newsletter
- **Endpoint**: `/api/newsletter`
- **Method**: `POST`

**Request Bost**

```json
{
  "email":"user@mail.com"
}
```

**Response**
```json
{
  "message": "Successfully subscribed to newsletter"
}
```
**Note**: Here after user subscribes he will get this message to email:
```

Sybella System <sysbellaemail@mail.com>


Thanks for subscribing to Sybella Systems newsletter.

Company:

Phone: +254 715 410 009

You can also contact us on support email info@sybellasystems.com
```

## Contacts Endpoint

### 23. User Sending Message
- **Endpoint**: `/api/contact`
- **Method**: `POST`

**Request Body**

```json
{
    "name": "Contact name",
    "email": "contactemail@gmail.com",
    "message": "message my friend",
    "company": "Company",
    "phone": "Phone" // Optional
}
```

**Response**
```json
{
  "success": true,
  "message": "Contact Saved"
}
```

**Note**: Here also contact will get message to his email

### 24. Get All Contact Messages
- **Endpoint**: `/api/contact`
- **Method**: `GET`
**Required roles**: `executive`, `superadmin`, `cto`

**Response**
```json
{
  "success": true,
  "contacts": [
    {
      "_id": "68d66004bb8738ec06454f52",
      "name": "Bienvenu",
      "email": "bienvenu@gmail.com",
      "message": "Hello my friend",
      "company": "ITBienvenu",
      "phone": "",
      "createdAt": "2025-09-26T09:42:28.700Z"
    }
  ]
}    
```

**Notice**: All Endpoints Require Authorization Bearer `<accessToken>`