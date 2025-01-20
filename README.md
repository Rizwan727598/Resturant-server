# Foods API Backend

## Purpose

The Foods API Backend is designed to manage food items, user orders, and provide functionalities like top-item recommendations. It supports essential CRUD operations, robust error handling, and efficient data querying.

## Live URL

[Foods API Live Link](#) *(Replace with the actual live link after deployment)*

## Key Features

- Fetch all foods with optional search functionality.
- Retrieve a food item by its unique ID.
- Add new food items.
- Update food details.
- Retrieve top foods based on purchase counts.
- Save, fetch, and delete orders by user email.

## NPM Packages Used

- **express:** For building the server and handling routes.
- **dotenv:** For managing environment variables.
- **cors:** For enabling Cross-Origin Resource Sharing.
- **mongodb:** MongoDB client for connecting and querying the database.

## API Endpoints

### Food Routes
- **`GET /foods`**: Fetch all foods (searchable by name).
- **`GET /foods/:id`**: Fetch a food item by its unique ID.
- **`POST /foods`**: Add a new food item.
- **`PUT /foods/:id`**: Update details of an existing food item.
- **`GET /top-foods`**: Fetch top foods based on purchase counts.

### Order Routes
- **`POST /orders`**: Save a new order.
- **`GET /orders?email=<email>`**: Fetch orders for a specific user.
- **`DELETE /orders/:id`**: Delete an order by its unique ID.
