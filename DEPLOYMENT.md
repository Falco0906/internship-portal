# Deployment Guide for Render

This guide will help you deploy the Internship Portal application to Render.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A MongoDB database (MongoDB Atlas recommended for free tier)
3. A Render account (free tier available)

## Step 1: Set up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for Render)
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/internship_portal`)

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub (make sure `render.yaml` is in the root)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and configure the service
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

### Option B: Manual Setup

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `internship-portal`
   - **Root Directory**: Leave empty (root of repo)
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd server && npm install && cd ../client && npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd server && npm start
     ```
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: Render sets this automatically (default: 10000)

## Step 3: Verify Deployment

1. Wait for the build to complete (usually 2-5 minutes)
2. Check the logs for "✅ MongoDB connected successfully"
3. Visit your Render URL (e.g., `https://internship-portal.onrender.com`)
4. Test the application:
   - Add an internship
   - View all internships
   - Edit an internship
   - Delete an internship

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/internship_portal` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check build logs for specific errors

### MongoDB Connection Error
- Verify your MongoDB Atlas IP whitelist includes Render's IPs
- Check that your connection string is correct
- Ensure database user credentials are correct

### API Not Working
- Verify `NODE_ENV=production` is set
- Check that the React build was created successfully
- Verify API routes are accessible at `/api/internships`

## Notes

- Free tier services on Render spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on service

