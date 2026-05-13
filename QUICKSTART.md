# 🚀 Quick Start Guide

## ⚠️ Node.js Required

The application requires Node.js to run. Follow these steps to get started:

## Step 1: Install Node.js

### Windows Installation:

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Click the **LTS (Long Term Support)** version button (recommended)
   - The download should start automatically

2. **Run the Installer:**
   - Open the downloaded `.msi` file
   - Follow the installation wizard
   - ✅ Accept the license agreement
   - ✅ Keep default installation path
   - ✅ **IMPORTANT:** Check "Automatically install necessary tools" if prompted
   - Click "Install"

3. **Verify Installation:**
   - Open a **NEW** PowerShell or Command Prompt window
   - Type: `node --version`
   - You should see something like: `v20.x.x`
   - Type: `npm --version`
   - You should see something like: `10.x.x`

   **Note:** You MUST open a new terminal window after installation!

## Step 2: Install Project Dependencies

Open PowerShell or Command Prompt in the project directory and run:

```powershell
npm install
```

This will install:
- express (web server)
- cors (cross-origin support)
- dotenv (environment variables)
- natural (NLP library)
- compromise (text analysis)
- axios (HTTP client)

Wait for the installation to complete (may take 1-2 minutes).

## Step 3: Create Environment File

Run this command:

```powershell
copy .env.example .env
```

Or manually create a `.env` file with this content:
```
PORT=3000
NODE_ENV=development
```

## Step 4: Start the Application

```powershell
npm start
```

You should see:
```
🚀 AI Story Point Estimator running on port 3000
📊 API endpoint: http://localhost:3000/api/estimate
```

## Step 5: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## 🎉 You're Ready!

Try these features:
1. Click the **"Simple Bug Fix"** example button
2. Click **"Estimate Story Points"**
3. Review the detailed analysis
4. Try the other examples
5. Enter your own user stories

## 📝 Testing the Application

### Test with Examples:

1. **Simple Story (1-2 points):**
   ```
   Fix typo in login button text
   ```

2. **Medium Story (3-5 points):**
   ```
   As a user, I want to add items to my shopping cart so that I can purchase multiple products at once
   ```

3. **Complex Story (8-13 points):**
   ```
   Implement OAuth 2.0 authentication with Google and Microsoft, including token management, refresh rotation, and GDPR compliance
   ```

### Test Batch Estimation:

1. Scroll to "Batch Estimation" section
2. Copy content from `test-examples.json`
3. Paste into the text area
4. Click "Estimate Batch"
5. View summary and individual estimates

## 🔧 Troubleshooting

### "node is not recognized"
- **Solution:** Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- **Restart your terminal** after installation
- Open a NEW PowerShell/Command Prompt window

### "npm is not recognized"
- **Solution:** Same as above - Node.js includes npm
- Restart terminal after Node.js installation

### Port 3000 already in use
- **Solution:** Change port in `.env` file:
  ```
  PORT=3001
  ```
- Or stop the application using port 3000

### Module not found errors
- **Solution:** Dependencies not installed
- Run: `npm install`
- Wait for completion

### Cannot access from browser
- **Solution:** Make sure server is running
- Check terminal for error messages
- Verify URL: http://localhost:3000

## 🎯 What to Do After Installation

1. ✅ Test single story estimation
2. ✅ Try all three example buttons
3. ✅ Test batch estimation with test-examples.json
4. ✅ Read README.md for full features
5. ✅ Check API.md for API integration
6. ✅ Customize complexity keywords in server.js

## 📚 Additional Resources

- **Full Documentation:** README.md
- **Setup Guide:** SETUP.md
- **API Reference:** API.md
- **Test Data:** test-examples.json

## 💡 Tips

- Use **Ctrl+Enter** in the text area to quickly estimate
- Click **Clear** button to reset the form
- Watch the console for server logs
- Try different story complexities to see how scoring works

## 🆘 Need Help?

If you encounter issues:
1. Check that Node.js is installed: `node --version`
2. Verify dependencies are installed: check `node_modules` folder exists
3. Look for error messages in the terminal
4. Review SETUP.md for detailed troubleshooting

---

**Ready to estimate? Install Node.js and run `npm start`!** 🚀