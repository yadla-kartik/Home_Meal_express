# Backend Deployment Guide

## Recommended stack

- Backend hosting: Render or Railway
- Database: MongoDB Atlas
- Media storage: Cloudinary
- Email: Gmail App Password or SMTP provider

## Before deploy

1. Push the latest code to GitHub.
2. Make sure your frontend production URL is final.
3. Create a MongoDB Atlas database if you are not already using one.
4. Create a Cloudinary account and copy:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Required environment variables

Use these on the hosting platform:

```env
NODE_ENV=production
PORT=10000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=https://your-frontend-domain.com
COOKIE_SECURE=true

IRCTC_API_KEY=your_irctc_api_key_here
IRCTC_SIGNING_SECRET=your_irctc_signing_secret_here
MSG91_AUTH_KEY=your_msg91_auth_key_here

MAIL_FROM_NAME=Home Meal Express
MAIL_FROM_EMAIL=your_sender_email@gmail.com
MAIL_USER=your_sender_email@gmail.com
MAIL_APP_PASSWORD=your_generated_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Render setup

1. Go to Render.
2. Click `New +`.
3. Choose `Web Service`.
4. Connect your GitHub repo.
5. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add the environment variables listed above.
7. Deploy.

## Railway setup

1. Create a new project in Railway.
2. Deploy from GitHub repo.
3. Set the service root to `backend` if needed.
4. Add all backend environment variables.
5. Railway will detect Node automatically.

## After deploy

1. Open:
   - `https://your-backend-domain/api/health`
2. Update frontend env:
   - `VITE_API_URL=https://your-backend-domain/api`
   - `VITE_SOCKET_URL=https://your-backend-domain`
   - `VITE_BACKEND_URL=https://your-backend-domain`
3. Rebuild and redeploy frontend.

## Notes

- Cookies are configured for production cross-site usage.
- Cloudinary is now used for chef and delivery image uploads.
- Local `/uploads` folder is no longer required for new production uploads.
