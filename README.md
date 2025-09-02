# Real Estate Backend (Express + MongoDB + JWT A/R Tokens)

This backend complements your React real-estate UI. It provides authentication (signup/login), protected routes, refresh-access-token (RAT) flow with HttpOnly cookies, properties, favorites, profiles, and basic chat.

## Quick start

```bash
cp .env.example .env
# edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

Default port: **4000**

## Auth model

- **Access Token**: short-lived JWT (default 15m), returned in JSON and can be used in `Authorization: Bearer <token>` header.
- **Refresh Token**: long-lived JWT (default 7d), issued as **HttpOnly cookie** `rtk`. Used at `/api/auth/refresh-token` to obtain a new access token. Logout clears the cookie.

## Endpoints

### Auth
- `POST /api/auth/register` — { name, email, password }
- `POST /api/auth/login` — { email, password }
- `POST /api/auth/refresh-token` — (uses HttpOnly cookie)
- `POST /api/auth/logout` — clears cookie

### Users
- `GET /api/users/me` — current profile (protected)
- `PATCH /api/users/me` — update profile (protected)
- `GET /api/users/:id` — public profile (limited fields)

### Properties
- `GET /api/properties` — list, supports filters: `?city=&type=&minPrice=&maxPrice=&beds=&baths=`
- `GET /api/properties/:id`
- `POST /api/properties` — create (protected)
- `PATCH /api/properties/:id` — update (owner only)
- `DELETE /api/properties/:id` — delete (owner only)

### Favorites
- `POST /api/users/me/favorites/:propertyId` — add
- `DELETE /api/users/me/favorites/:propertyId` — remove
- `GET /api/users/me/favorites` — list

### Chat (basic, optional for your UI)
- `POST /api/chats/:peerId` — open chat with a user (protected)
- `GET /api/chats` — my chats (protected)
- `GET /api/chats/:chatId/messages` — list messages (protected)
- `POST /api/chats/:chatId/messages` — send message (protected)

## Frontend wiring tips

- Set `CLIENT_ORIGIN` to your Vite dev URL (e.g., `http://localhost:5173`) or production domain.
- For protected pages, check access by hitting `/api/users/me` with `Authorization: Bearer <accessToken>`; if 401, use `/api/auth/refresh-token` to get a new one.
- Keep credentials cookies enabled when calling `refresh-token` (`fetch(..., { credentials: 'include' })`).

## Security

- HttpOnly cookie for refresh token; rotates on refresh.
- Rate limiting on auth and generic routes.
- Helmet for HTTP headers.
- Bcrypt password hashing.

---

MIT
