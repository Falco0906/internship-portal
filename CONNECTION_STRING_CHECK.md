# MongoDB Connection String Format Check

## ✅ Correct Format

Your connection string should look exactly like this:

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Example:
```
mongodb+srv://newuser:MyPassword123@cluster0.ywhat8q.mongodb.net/internship_portal?retryWrites=true&w=majority
```

## ✅ Important Points

1. **Protocol**: Must start with `mongodb+srv://`
2. **Username**: Your new MongoDB user's username
3. **Password**: Your new MongoDB user's password
4. **Cluster**: Your cluster address (e.g., `cluster0.ywhat8q.mongodb.net`)
5. **Database**: Database name (e.g., `internship_portal`)
6. **Parameters**: `?retryWrites=true&w=majority` (recommended)

## ⚠️ Common Mistakes

### ❌ Wrong: Password with special characters not URL-encoded
```
mongodb+srv://user:pass@word@cluster.mongodb.net/db
```
**Problem**: The `@` in password breaks the connection string

### ✅ Right: URL-encode special characters
```
mongodb+srv://user:pass%40word@cluster.mongodb.net/db
```

### Special Character Encoding:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`
- ` ` (space) → `%20`

## 🔍 Verify in Render

1. Go to Render Dashboard → Your Service → **Environment** tab
2. Find `MONGODB_URI` variable
3. Click to view/edit (it will show `****` for password)
4. Make sure:
   - ✅ No spaces before or after
   - ✅ Entire string on one line
   - ✅ Includes database name
   - ✅ Includes query parameters

## 🧪 Test Connection

After setting the connection string:

1. **Save** the environment variable in Render
2. Render will **auto-redeploy**
3. Check **Logs** tab for:
   - ✅ `MongoDB connected successfully` = Good!
   - ❌ `MongoDB connection error` = Check format

4. Test API endpoint:
   ```
   https://your-app.onrender.com/api/health
   ```
   Should return: `{"status":"ok","mongodb":"connected"}`

## 📝 Checklist

- [ ] New MongoDB user created in Atlas → Database Access
- [ ] User has **Read and write** permissions (or Atlas admin)
- [ ] Connection string uses new username and password
- [ ] Password is URL-encoded if it contains special characters
- [ ] Database name is included (`internship_portal`)
- [ ] Connection string set in Render → Environment tab
- [ ] No spaces or line breaks in connection string
- [ ] Network Access allows `0.0.0.0/0` or Render IPs
- [ ] Service redeployed after setting environment variable

