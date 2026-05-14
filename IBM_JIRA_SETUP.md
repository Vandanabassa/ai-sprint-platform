# IBM JIRA Integration Setup Guide

## 🔑 Personal Access Token (PAT) Authentication

IBM's JIRA instance has **Basic Authentication disabled**, so you must use **Personal Access Tokens (PAT)** instead.

## 📋 Step-by-Step Setup

### Step 1: Create Personal Access Token in IBM JIRA

1. **Log in to IBM JIRA**
   - Go to: https://stg.jsw.ibm.com
   - Log in with your IBM credentials

2. **Navigate to Personal Access Tokens**
   - Click on your **profile icon** (top-right corner)
   - Select **"Profile"** or **"Account Settings"**
   - Look for **"Personal Access Tokens"** in the menu
   - Or go directly to: https://stg.jsw.ibm.com/secure/ViewProfile.jspa

3. **Create New Token**
   - Click **"Create token"** or **"Generate new token"**
   - Give it a name: `AI Sprint Platform`
   - Set expiration (optional, or leave as default)
   - Click **"Create"**

4. **Copy the Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately!
   - You won't be able to see it again
   - Save it securely (password manager recommended)

### Step 2: Configure AI Sprint Platform

1. **Open the JIRA Integration Page**
   - Go to: http://localhost:3000/jira.html
   - Or click "JIRA" in the navigation menu

2. **Fill in the Connection Form**
   - **JIRA URL**: `https://stg.jsw.ibm.com`
   - **Check the box**: ✅ "Use Personal Access Token (PAT)"
   - **Email**: Leave empty (not needed for PAT)
   - **Token**: Paste your Personal Access Token

3. **Test Connection**
   - Click **"Test Connection"**
   - You should see: "Connection Successful!"
   - If it fails, double-check your token

4. **Save Credentials** (Optional)
   - Click **"Save Credentials"**
   - Your credentials will be stored in browser localStorage
   - They're never sent to our servers

### Step 3: Import Stories

1. **Load Projects**
   - Click **"Load Projects"**
   - Select your project (e.g., **AIS**)

2. **Import Stories**
   - Choose stories to import
   - Click **"Import Selected Stories"**
   - Stories will be automatically estimated!

## 🔧 Troubleshooting

### Error: "Basic Authentication has been disabled"
**Solution**: Make sure you checked the "Use Personal Access Token (PAT)" checkbox

### Error: "Authentication failed"
**Possible causes**:
1. Token expired - Create a new token
2. Token copied incorrectly - Check for extra spaces
3. Wrong JIRA URL - Use `https://stg.jsw.ibm.com`

### Error: "Failed to fetch projects"
**Possible causes**:
1. Token doesn't have required permissions
2. You don't have access to the project
3. Network/firewall issues

### Can't find Personal Access Tokens option
**Solution**: 
- Your JIRA admin might need to enable it
- Contact IBM IT Support
- Alternative: Ask your admin to create a token for you

## 📝 Important Notes

### Security
- ✅ Tokens are stored locally in your browser only
- ✅ Never share your token with anyone
- ✅ Tokens can be revoked anytime from JIRA
- ✅ Use different tokens for different applications

### Token Management
- **Expiration**: Set appropriate expiration dates
- **Revocation**: Revoke tokens you're not using
- **Rotation**: Regularly rotate tokens for security
- **Naming**: Use descriptive names to track usage

### Permissions
Your token inherits your JIRA permissions:
- Can only access projects you have access to
- Can only perform actions you're allowed to do
- Read-only integration (won't modify JIRA data)

## 🆚 PAT vs API Token vs Basic Auth

| Method | IBM JIRA | JIRA Cloud | Security |
|--------|----------|------------|----------|
| **Personal Access Token (PAT)** | ✅ Required | ❌ Not available | 🔒 High |
| **API Token** | ❌ Not supported | ✅ Recommended | 🔒 High |
| **Basic Auth (Password)** | ❌ Disabled | ❌ Deprecated | ⚠️ Low |

## 🎯 Quick Reference

### IBM JIRA URLs
- **Main**: https://stg.jsw.ibm.com
- **Profile**: https://stg.jsw.ibm.com/secure/ViewProfile.jspa
- **Project AIS**: https://stg.jsw.ibm.com/projects/AIS

### Form Settings
```
JIRA URL: https://stg.jsw.ibm.com
Use PAT: ✅ CHECKED
Email: (leave empty)
Token: [Your Personal Access Token]
```

## 📞 Support

### IBM IT Support
- For token creation issues
- For permission problems
- For JIRA access questions

### Application Issues
- Check browser console (F12) for errors
- Verify token hasn't expired
- Try creating a new token

## ✅ Success Checklist

- [ ] Created Personal Access Token in IBM JIRA
- [ ] Copied and saved token securely
- [ ] Opened http://localhost:3000/jira.html
- [ ] Entered JIRA URL: https://stg.jsw.ibm.com
- [ ] Checked "Use Personal Access Token (PAT)" box
- [ ] Pasted token in the token field
- [ ] Clicked "Test Connection" - Success!
- [ ] Clicked "Load Projects" - Projects loaded!
- [ ] Selected AIS project
- [ ] Imported stories successfully

---

**You're all set! Happy estimating! 🚀**