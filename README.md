# CRUD API

This a simple server that handles basic REST API operations `create`, `read`, `update`,
`delete`.

## 🚀 Local Setup

1. **Clone repository**

   ```bash
   git clone https://github.com/1Arseniy/crud-API.git
   ```

2. **Go to folder** `crud-API`

   ```bash
   cd crud-API
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

5. **Launch development mode**

   ```bash
   npm run start:dev
   ```

6. **Launch production mode**

   ```bash
   npm run start:prod
   ```

7. **Launch with clustering**

   ```bash
   npm run start:multi
   ```

## Example Test Scenarios

1. `GET /api/users` → returns an empty array
2. `POST /api/users` → creates a new user
3. `GET /api/users/{id}` → returns created user
4. `PUT /api/users/{id}` → updates user data
5. `DELETE /api/users/{id}` → deletes user
6. `GET /api/users/{id}` → returns 404 after deletion

---

#### User object (JSON)

**All fields are required** =>
{<br/>
&emsp;id: `uuid v4 string`<br/>
&emsp;username: `string`,<br/>
&emsp;age: `number` > 0,<br/>
&emsp;hobbies: `string[]`<br/>
}

## 📜 Available Scripts

| Command              | Action                          |
| -------------------- | ------------------------------- |
| `npm run start:dev`  | Starts local development server |
| `npm run start:prod` | Creates production-ready build  |
| `npm run test`       | Runs Vitest tests               |
| `build`              | To build a bundle               |

---
