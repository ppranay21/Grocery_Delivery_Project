# FreshCart Deployment

This project has two deployable apps:

- `grocery-backend`: Spring Boot API
- `grocery-frontend`: Vite React frontend

## 1. Deploy Backend

Recommended platform: Render Web Service using the backend Dockerfile.

Render settings:

- Root directory: `grocery-backend`
- Environment: Docker
- Dockerfile path: `Dockerfile`
- Health check path: `/api/health`

Required environment variables:

```text
DB_URL=jdbc:mysql://<host>:<port>/<database>?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=<mysql-user>
DB_PASSWORD=<mysql-password>
JWT_SECRET=<long-base64-secret>
FRONTEND_URL=https://<your-vercel-app>.vercel.app
```

Notes:

- The backend reads `PORT` automatically from the host platform.
- Use a real MySQL database for production. The `dev` H2 profile is only for local testing.
- After deployment, test: `https://<your-backend-url>/api/health`

## 2. Deploy Frontend

### Option A: Netlify

Netlify settings:

- Base directory: `grocery-frontend`
- Build command: `npm run build`
- Publish directory: `grocery-frontend/dist`

Required environment variable:

```text
VITE_API_BASE_URL=https://<your-backend-url>/api
```

The frontend includes `grocery-frontend/netlify.toml` for React Router refresh support.

### Option B: Vercel

Vercel settings:

- Root directory: `grocery-frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Required environment variable:

```text
VITE_API_BASE_URL=https://<your-backend-url>/api
```

After adding or changing `VITE_API_BASE_URL`, redeploy the frontend because Vite bakes this value into the production bundle.

## Can both apps deploy on Netlify?

Not easily for this project. Netlify is excellent for the Vite React frontend, but this backend is a Spring Boot server that needs a long-running Java process. Netlify Functions are for serverless functions, not this Spring Boot app. Use Render for the backend and Netlify for the frontend.

## 3. Update Backend CORS

After Vercel gives you the frontend URL, set this on the backend:

```text
FRONTEND_URL=https://<your-vercel-app>.vercel.app
```

Then redeploy or restart the backend.

## 4. Verification

Check these URLs after both deployments finish:

```text
https://<your-backend-url>/api/health
https://<your-backend-url>/api/products
https://<your-vercel-app>.vercel.app
```

Login demo accounts:

```text
Admin: admin@gmail.com / admin123
Customer: user@gmail.com / 123456
```
