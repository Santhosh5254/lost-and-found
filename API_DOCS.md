# Lost & Found API Documentation

## Base URL
`/api`

---

## Auth

### `POST /api/auth/register`
Registers a new user.
* **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
* **Response (201):** `{ "_id", "name", "email", "role", "token" }`

### `POST /api/auth/login`
Logs in an existing user.
* **Body:** `{ "email": "john@example.com", "password": "password100" }`
* **Response (200):** `{ "_id", "name", "email", "role", "token" }`

---

## Items

### `GET /api/items`
Gets all items with filtering, search, and pagination.
* **Query Params:**
    * `pageNumber` (Number): The page to retrieve.
    * `keyword` (String): Search by item title.
    * `category` (String): Filter by `lost` or `found`.
    * `location` (String): Search by location.
* **Response (200):** `{ items: [...], page: 1, pages: 5 }`

### `POST /api/items`
Creates a new item. **Requires 'multipart/form-data' header.**
* **Access:** Private (User must be logged in)
* **Form Data:** `title`, `description`, `category`, `date`, `location`, `contactName`, `contactEmail`, `image` (File)
* **Response (201):** `{ ...itemObject }`

### `GET /api/items/:id`
Gets a single item by its ID.
* **Access:** Public
* **Response (200):** `{ ...itemObject }`

### `PUT /api/items/:id`
Updates an item.
* **Access:** Private (User must own the item or be an Admin)
* **Body:** `{ "title": "...", "status": "claimed", ... }`
* **Response (200):** `{ ...updatedItemObject }`

### `DELETE /api/items/:id`
Deletes an item.
* **Access:** Private (User must own the item or be an Admin)
* **Response (200):** `{ message: "Item removed" }`