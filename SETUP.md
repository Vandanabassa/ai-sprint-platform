# Setup Guide - AI Story Point Estimator

## Prerequisites Installation

### 1. Install Node.js

The application requires Node.js (v14 or higher) which includes npm (Node Package Manager).

**Download Node.js:**
- Visit: https://nodejs.org/
- Download the LTS (Long Term Support) version
- Run the installer and follow the installation wizard
- Restart your terminal/command prompt after installation

**Verify Installation:**
```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd c:/Users/VandanaBassa/Desktop/ai-sprint-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (web server)
- cors (cross-origin resource sharing)
- dotenv (environment variables)
- natural (NLP library)
- compromise (text analysis)
- axios (HTTP client)

### Step 3: Create Environment File

```bash
copy .env.example .env
```

Or manually create a `.env` file with:
```
PORT=3000
NODE_ENV=development
```

### Step 4: Start the Application

**Production Mode:**
```bash
npm start
```

**Development Mode (with auto-restart):**
```bash
npm run dev
```

### Step 5: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Testing the Application

### Test Single Story Estimation

1. Open the web interface at http://localhost:3000
2. Enter a user story in the text area
3. Click "Estimate Story Points"
4. Review the results

### Test with Example Stories

Click on the quick example buttons:
- **Simple Bug Fix** - Should estimate 1-2 points
- **Feature Addition** - Should estimate 3-5 points
- **Complex Integration** - Should estimate 8-13 points

### Test Batch Estimation

1. Scroll to the "Batch Estimation" section
2. Copy the content from `test-examples.json`
3. Paste into the batch text area
4. Click "Estimate Batch"
5. Review the summary and individual estimates

### Test API Endpoints

**Using curl (if available):**

```bash
# Single estimation
curl -X POST http://localhost:3000/api/estimate ^
  -H "Content-Type: application/json" ^
  -d "{\"userStory\": \"As a user, I want to login with OAuth\"}"

# Health check
curl http://localhost:3000/api/health
```

**Using PowerShell:**

```powershell
# Single estimation
$body = @{
    userStory = "As a user, I want to login with OAuth"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/estimate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Health check
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

## Troubleshooting

### Issue: "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify with `node --version`

### Issue: Port 3000 already in use

**Solution:** Change the port in `.env` file
```
PORT=3001
```

### Issue: Module not found errors

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Issue: Cannot access from other devices

**Solution:** The server binds to localhost by default. To allow external access, modify `server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Development Tips

### Watch for File Changes

Use nodemon for automatic server restart:
```bash
npm run dev
```

### View Server Logs

The server logs all requests and errors to the console. Keep the terminal open to monitor activity.

### Modify Complexity Keywords

Edit `server.js` to customize the complexity indicators:
```javascript
const complexityIndicators = {
  high: ['your', 'keywords', 'here'],
  medium: ['your', 'keywords', 'here'],
  low: ['your', 'keywords', 'here']
};
```

### Adjust Story Point Mapping

Modify the scoring thresholds in the `estimateStoryPoints` function in `server.js`.

## Next Steps

1. ✅ Install Node.js
2. ✅ Run `npm install`
3. ✅ Create `.env` file
4. ✅ Start the server with `npm start`
5. ✅ Open http://localhost:3000
6. ✅ Test with example stories
7. ✅ Try batch estimation
8. ✅ Explore the API endpoints

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the port is not in use
4. Review the troubleshooting section above

Happy estimating! 🚀