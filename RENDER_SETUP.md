# Render Deployment - MongoDB Setup Guide

## ⚠️ Important: Render Doesn't Use .env Files

The `.env` file in your `server/` folder is **only for local development**. Render uses environment variables set in the dashboard.

## Step-by-Step: Setting MongoDB URI in Render

### 1. Get Your MongoDB Connection String

Your MongoDB URI should look like:
```
mongodb+srv://admin:jGnCscQ8UPp97hPz@cluster0.ywhat8q.mongodb.net/internship_portal?retryWrites=true&w=majority
```

### 2. Set Environment Variable in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **internship-portal** service
3. Go to **Environment** tab (in the left sidebar)
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Paste your MongoDB connection string
6. Click **Save Changes**
7. Render will automatically redeploy

### 3. Verify MongoDB Atlas Network Access

Make sure MongoDB Atlas allows connections from anywhere:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (or add `0.0.0.0/0`)
5. Click **Confirm**

### 4. Check Deployment Logs

After redeploying, check the logs:

1. In Render dashboard, go to **Logs** tab
2. Look for:
   - ✅ `MongoDB connected successfully` = Good!
   - ❌ `MongoDB connection error` = Check your connection string

### 5. Test the Connection

Visit: `https://your-app.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "mongodb": "connected"
}
```

## Troubleshooting

### Error: "MongoDB connection error"

**Possible causes:**
1. ❌ Environment variable not set in Render dashboard
2. ❌ MongoDB Atlas IP whitelist doesn't include Render's IPs
3. ❌ Incorrect connection string format
4. ❌ Database user credentials are wrong

**Solution:**
- Double-check the `MONGODB_URI` in Render Environment tab
- Verify MongoDB Atlas Network Access settings
- Test connection string format

### Error: "Database connection not available"

**Solution:**
- Wait a few seconds after deployment (MongoDB connection takes time)
- Check Render logs for connection errors
- Verify `MONGODB_URI` is set correctly

## Quick Checklist

- [ ] MongoDB URI set in Render Environment tab (not just in .env file)
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0` or Render's IPs
- [ ] Service redeployed after setting environment variable
- [ ] Logs show "MongoDB connected successfully"
- [ ] `/api/health` endpoint returns `mongodb: "connected"`

