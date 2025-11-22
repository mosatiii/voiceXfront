# Deploy VoiceX Frontend to Railway

This guide will help you deploy the VoiceX frontend to Railway.

## 📋 Prerequisites

- Railway account (https://railway.app)
- Railway CLI installed (optional but recommended)
- Your backend API already deployed on Railway

## 🚀 Deployment Steps

### Option 1: Using Railway Dashboard (Recommended)

1. **Go to your Railway project**
   - Visit https://railway.app/dashboard
   - Select your existing VoiceX project

2. **Add a new service**
   - Click "+ New" button
   - Select "GitHub Repo" or "Empty Service"

3. **Connect your repository**
   - If you have the code in GitHub:
     - Select your repository
     - Select the `voicex-frontend` directory as the root
   - If deploying from local:
     - Use Railway CLI (see Option 2 below)

4. **Configure Environment Variables**
   
   Go to the service settings and add these variables:
   
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_WS_URL=https://your-backend.railway.app
   ```
   
   Replace `your-backend.railway.app` with your actual backend URL from Railway.

5. **Configure Build Settings** (if needed)
   
   Railway should auto-detect the build process, but you can verify:
   - Build Command: `npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - Install Command: `npm ci`

6. **Deploy**
   - Railway will automatically build and deploy
   - Wait for the build to complete (~2-3 minutes)

7. **Get your frontend URL**
   - Click on "Settings" → "Networking"
   - Click "Generate Domain" to get a public URL
   - Your app will be available at: `https://your-frontend.railway.app`

---

### Option 2: Using Railway CLI

1. **Install Railway CLI** (if not already installed)
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Navigate to the frontend directory**
   ```bash
   cd /Users/issa/Desktop/voiceXFront/voicex-frontend
   ```

4. **Link to your existing project**
   ```bash
   railway link
   ```
   
   Select your existing VoiceX project from the list.

5. **Create a new service for frontend**
   ```bash
   railway service create voicex-frontend
   ```

6. **Set environment variables**
   ```bash
   railway variables set VITE_API_URL=https://your-backend.railway.app/api
   railway variables set VITE_WS_URL=https://your-backend.railway.app
   ```
   
   Replace with your actual backend URL.

7. **Deploy**
   ```bash
   railway up
   ```

8. **Get your domain**
   ```bash
   railway domain
   ```

---

## 🔧 Configuration Files Included

The following files have been created for Railway deployment:

- **`railway.json`** - Railway configuration
- **`nixpacks.toml`** - Build configuration using Node.js 20
- **`Procfile`** - Process configuration (backup)
- **`vite.config.ts`** - Updated with preview server config

---

## 📝 Important Notes

### 1. Environment Variables
Make sure to set these in Railway dashboard:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `VITE_API_URL` | `https://voicex-backend.railway.app/api` | Your backend API URL |
| `VITE_WS_URL` | `https://voicex-backend.railway.app` | Your WebSocket URL |

⚠️ **Important**: Environment variables starting with `VITE_` are embedded at build time, so if you change them, you must redeploy!

### 2. CORS Configuration
Make sure your backend allows requests from your Railway frontend domain. Update your backend CORS settings:

```typescript
// Backend CORS config
cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.railway.app'  // Add this
  ],
  credentials: true
})
```

### 3. WebSocket Configuration
Ensure your backend WebSocket server accepts connections from the Railway domain:

```typescript
// Backend Socket.io config
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://your-frontend.railway.app'  // Add this
    ],
    credentials: true
  }
});
```

---

## 🔍 Troubleshooting

### Build fails
- Check that Node.js 20 is being used (should be automatic with nixpacks.toml)
- Verify all dependencies are in package.json
- Check build logs in Railway dashboard

### App loads but can't connect to backend
- Verify `VITE_API_URL` is correct in Railway environment variables
- Check backend CORS configuration allows your frontend domain
- Ensure backend is running and accessible

### WebSocket connection fails
- Verify `VITE_WS_URL` is correct
- Check backend Socket.io CORS configuration
- Ensure backend WebSocket endpoint is accessible

### Need to update environment variables
1. Go to Railway dashboard
2. Select your frontend service
3. Go to "Variables" tab
4. Update the variables
5. Click "Redeploy" (environment variables require rebuild)

---

## 🎉 Success!

Once deployed, your VoiceX frontend will be live at:
- **Frontend URL**: `https://your-frontend.railway.app`
- **Backend API**: `https://your-backend.railway.app/api`

Test the full flow:
1. Visit your frontend URL
2. Register a new account
3. Login
4. Test phone number search and rental
5. Send messages
6. Make calls

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

Need help? Check the Railway logs in the dashboard for detailed error messages.

