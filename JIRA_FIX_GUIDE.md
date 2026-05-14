# JIRA Integration Fix - Complete Guide

## 🔧 What Was Fixed

The JIRA integration was not working because the `/api/jira/import-stories` endpoint didn't support **Personal Access Token (PAT)** authentication, which is required for IBM JIRA.

### Changes Made:

1. **server.js** - Updated `/api/jira/import-stories` endpoint:
   - Added `usePAT` parameter support
   - Implemented Bearer token authentication for PAT
   - Added fallback to API v2 if v3 fails
   - Made email optional when using PAT

2. **public/jira.js** - Updated frontend:
   - Added `usePAT` parameter to import request
   - Now passes the PAT checkbox state to the backend

3. **restart-server.bat** - Created restart script:
   - Automatically stops existing server
   - Waits for port to be released
   - Starts new server instance

## 🚀 How to Use JIRA Integration

### Step 1: Get Your Personal Access Token

1. Go to: https://stg.jsw.ibm.com
2. Click your profile icon → **Account Settings**
3. Navigate to **Security** → **Personal Access Tokens**
4. Click **"Create token"**
5. Name it: `AI Sprint Platform`
6. Copy the token immediately (you won't see it again!)

### Step 2: Configure Connection

1. Open: http://localhost:3000/jira.html
2. Fill in the form:
   - **JIRA URL**: `https://stg.jsw.ibm.com`
   - **✅ Check**: "Use Personal Access Token (PAT)"
   - **Email**: Leave empty (not needed for PAT)
   - **Token**: Paste your Personal Access Token
3. Click **"Test Connection"**
4. If successful, click **"Save Credentials"** (optional)

### Step 3: Import Stories

1. Click **"Load Projects"**
2. Select your project (e.g., **AIS**)
3. (Optional) Enter a JQL query to filter stories
4. Click **"Import Stories"**
5. Stories will be imported and auto-estimated!

### Step 4: Use Imported Stories

- **Export to JSON**: Save stories for later use
- **Send to Planning Board**: Use stories in sprint planning

## 🔍 Troubleshooting

### Error: "Authentication failed"
**Solution**: 
- Verify your token hasn't expired
- Make sure the PAT checkbox is checked
- Try creating a new token

### Error: "Failed to fetch projects"
**Solution**:
- Check your network connection
- Verify you have access to the JIRA project
- Ensure the JIRA URL is correct

### Error: "No stories found"
**Solution**:
- Check if the project has stories
- Try a different JQL query
- Verify you have permission to view stories

### Server Not Responding
**Solution**:
- Run `restart-server.bat` to restart the server
- Or manually: Stop server (Ctrl+C) and run `npm start`

## 📝 Technical Details

### Authentication Methods Supported

| Method | IBM JIRA | JIRA Cloud | Usage |
|--------|----------|------------|-------|
| **PAT (Bearer)** | ✅ Required | ❌ Not available | `Authorization: Bearer <token>` |
| **API Token (Basic)** | ❌ Not supported | ✅ Recommended | `Authorization: Basic <base64>` |

### API Endpoints Used

1. **Test Connection**: `/rest/api/2/myself` or `/rest/api/3/myself`
2. **Load Projects**: `/rest/api/2/project` or `/rest/api/3/project`
3. **Import Stories**: `/rest/api/2/search` or `/rest/api/3/search`

### Auto-Estimation

Stories without story points are automatically estimated using AI:
- Analyzes story description
- Calculates complexity score
- Assigns Fibonacci story points (1, 2, 3, 5, 8, 13)
- Provides confidence level (high, medium, low)

## 🎯 Quick Commands

### Restart Server
```bash
# Windows
restart-server.bat

# Or manually
npm start
```

### Pull Latest Code
```bash
git pull origin main
npm install
```

### Check Server Status
```bash
netstat -ano | findstr :3000
```

### Stop Server (if needed)
```bash
# Find PID first
netstat -ano | findstr :3000

# Then kill it (replace <PID> with actual number)
taskkill /F /PID <PID>
```

## 📚 Related Documentation

- **JIRA_QUICKSTART.md** - Quick start guide
- **IBM_JIRA_SETUP.md** - Detailed IBM JIRA setup
- **JIRA_INTEGRATION.md** - Complete integration guide
- **README.md** - Main platform documentation

## ✅ Verification Checklist

- [x] Server restarted with latest code
- [x] PAT authentication working
- [x] Test connection successful
- [x] Projects loading correctly
- [x] Stories importing successfully
- [x] Auto-estimation working
- [x] Export to JSON working
- [x] Send to Planning Board working

## 🎉 Success!

Your JIRA integration is now fully functional with IBM JIRA's Personal Access Token authentication!

---

**Last Updated**: 2026-05-14  
**Version**: 1.1.0  
**Status**: ✅ Fixed and Tested