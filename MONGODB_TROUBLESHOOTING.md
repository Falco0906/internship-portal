# MongoDB Connection Troubleshooting

## Error: `tlsv1 alert internal error` / `ReplicaSetNoPrimary`

This error typically indicates:
1. **Network Access Issue** - MongoDB Atlas is blocking the connection
2. **Connection String Issue** - Incorrect format or credentials
3. **SSL/TLS Configuration** - TLS handshake failing

## Step-by-Step Fix

### 1. Verify MongoDB Atlas Network Access

**CRITICAL**: MongoDB Atlas must allow connections from Render's IP addresses.

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Check your IP whitelist:
   - **Option A (Recommended for testing)**: Add `0.0.0.0/0` to allow all IPs
   - **Option B**: Add Render's specific IP ranges (check Render docs)
4. Click **Confirm** if you made changes
5. Wait 1-2 minutes for changes to propagate

### 2. Verify Connection String Format

Your connection string should be:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Important points:**
- ✅ Use `mongodb+srv://` (not `mongodb://`)
- ✅ Username and password should be URL-encoded if they contain special characters
- ✅ Database name should be included
- ✅ `retryWrites=true&w=majority` parameters are recommended

### 3. Verify Database User Credentials

1. Go to MongoDB Atlas → **Database Access**
2. Check that your user exists and has proper permissions
3. If needed, create a new database user:
   - Username: `admin` (or your preferred username)
   - Password: (strong password)
   - Database User Privileges: **Atlas admin** or **Read and write to any database**

### 4. Test Connection String

Try connecting with MongoDB Compass or MongoDB Shell:
- Download [MongoDB Compass](https://www.mongodb.com/products/compass)
- Paste your connection string
- Click **Connect**
- If it works in Compass but not in Render, it's a Render-specific issue

### 5. Check Render Environment Variable

1. Go to Render Dashboard → Your Service → **Environment**
2. Verify `MONGODB_URI` is set correctly
3. **Important**: The value should be the FULL connection string, including:
   - Protocol (`mongodb+srv://`)
   - Username and password
   - Cluster address
   - Database name
   - Query parameters

### 6. Verify Connection String in Render Logs

Check Render logs - it should show:
```
Connection string: mongodb+srv://admin:****@cluster0.ywhat8q.mongodb.net/internship_portal?retryWrites=true&w=majority
```

If you see a different format, the environment variable might not be set correctly.

### 7. Common Issues and Solutions

#### Issue: Connection string has spaces or line breaks
**Solution**: Remove all spaces and ensure it's on a single line

#### Issue: Password contains special characters
**Solution**: URL-encode special characters:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

#### Issue: Database name missing
**Solution**: Add database name to connection string:
```
mongodb+srv://user:pass@cluster.mongodb.net/internship_portal
```

#### Issue: Cluster is paused (Free Tier)
**Solution**: 
- Go to MongoDB Atlas → Clusters
- If cluster shows "Paused", click **Resume**
- Wait for cluster to resume (2-3 minutes)

### 8. Alternative: Use Standard Connection String

If `mongodb+srv://` continues to fail, try the standard format (requires IP whitelist):

1. Get connection string from Atlas → Connect → Connect your application
2. Choose **Standard connection string** instead of **Connection string (SRV)**
3. Format: `mongodb://username:password@host1:port1,host2:port2/database?replicaSet=replicaSetName&ssl=true`

## Still Not Working?

1. **Check Render Logs** for specific error messages
2. **Test connection locally** with the same connection string
3. **Create a new database user** in MongoDB Atlas and try again
4. **Verify cluster is running** (not paused)
5. **Check MongoDB Atlas Status Page** for service issues

## Quick Checklist

- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0` or Render IPs
- [ ] Connection string uses `mongodb+srv://` format
- [ ] Database name is included in connection string
- [ ] Database user exists and has correct permissions
- [ ] Cluster is running (not paused)
- [ ] `MONGODB_URI` is set in Render Environment tab
- [ ] Connection string has no spaces or line breaks
- [ ] Password is URL-encoded if it contains special characters

