# ERDEN MEDIA on Vercel + MongoDB Atlas

The project is prepared for a Vercel deployment with a serverless Express/tRPC API and MongoDB Atlas persistence for public inquiries.

## Required Vercel environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `MONGODB_URI` | Server | MongoDB Atlas connection string; never expose it as a `VITE_` variable. |
| `MONGODB_DB_NAME` | Server | MongoDB database name. Defaults to `erden_media` if omitted. |
| `JWT_SECRET` | Server | Session signing secret. |
| `VITE_APP_ID` | Production | Manus OAuth application identifier, if private workspace login remains enabled. |
| `OAUTH_SERVER_URL` | Production | Manus OAuth backend URL. |
| `VITE_OAUTH_PORTAL_URL` | Production | Manus OAuth portal URL. |
| `OWNER_OPEN_ID` | Server | Owner identity for admin access. |
| `OWNER_NAME` | Server | Owner display name. |

Copy the remaining `VITE_*`, Forge, and analytics variables from the Manus project environment if the corresponding features are used.

## MongoDB Atlas setup

Create an Atlas Free Tier cluster, create a database user, create a database named `erden_media`, and allow the Vercel deployment to connect through Atlas Network Access. Use the Atlas driver URI as `MONGODB_URI`; do not commit it to the repository.

## Vercel setup

Import the project into Vercel from a Git repository or deploy the project directory with the Vercel CLI. The included `vercel.json` routes `/api/*` to `api/index.ts` and all public routes to the React entry point. The `build:vercel` script builds the client to `dist/public` and bundles the serverless API.

## Data behavior

When `MONGODB_URI` is present, public inquiry creation and the authenticated inquiry inbox use MongoDB collections. The collection is named `publicInquiries`. Existing MySQL/Drizzle helpers remain available as a compatibility fallback for the Manus-hosted environment while the Vercel deployment is moved to Atlas.

## Important deployment note

The private workspace still depends on the Manus OAuth environment. If the public website is deployed to Vercel without the Manus OAuth values, the public pages can work, but `/desk` and `/inquiries` will not be usable until authentication is configured for the deployment.
