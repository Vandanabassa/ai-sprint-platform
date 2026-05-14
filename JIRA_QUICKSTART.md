# Jira Integration - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Jira API Token

1. Go to: https://stg.jsw.ibm.com
2. Click your profile icon → Account Settings
3. Security → API Tokens → Create API Token
4. Name it "AI Sprint Platform" and copy the token
5. **Save it somewhere safe!** (You won't see it again)

### Step 2: Start the AI Sprint Platform

Open a terminal and run:
```bash
cd ai-sprint-platform
npm start
```

Keep this terminal open! The server must be running.

### Step 3: Run the Jira Integration

**Option A - Double-click the batch file:**
- Double-click `run-jira-integration.bat`

**Option B - Use command line:**
```bash
# Open a NEW terminal (keep the server running in the first one)
cd ai-sprint-platform
node jira-integration.js
```

### Step 4: Follow the Prompts

```
Username (email): your.email@ibm.com
API Token/Password: [paste your token]

Select an option:
1. Fetch unestimated stories and estimate them
2. Fetch all stories from a sprint
3. Estimate specific story by ID

Enter option (1-3): 1
```

### Step 5: Review and Update

- Review the estimated story points
- Choose whether to update Jira
- Optionally export results to JSON

## 📋 Common Use Cases

### Use Case 1: Estimate All Unestimated Stories
```
Option: 1
Result: Finds all stories without story points and estimates them
```

### Use Case 2: Estimate Current Sprint Stories
```
Option: 2
Sprint name: [leave empty for current sprint]
Result: Estimates all stories in the active sprint
```

### Use Case 3: Estimate a Specific Story
```
Option: 3
Issue key: AIS-123
Result: Estimates just that one story
```

## ⚙️ Configuration

Your Jira details are already configured:
- **Jira URL**: https://stg.jsw.ibm.com
- **Project**: AIS
- **Story Point Field**: customfield_10016 (default)

If your story point field is different, you'll be asked to provide it when updating Jira.

## 🔍 Finding Your Story Point Field ID

If the default field doesn't work:

1. Open any story in Jira
2. Right-click on "Story Points" field
3. Select "Inspect" or "Inspect Element"
4. Look for `customfield_xxxxx` in the HTML
5. Use that ID when prompted

## 🎯 Tips

1. **Always keep the AI Sprint Platform server running** (npm start)
2. **Use API tokens, not passwords** for better security
3. **Test with one story first** (Option 3) before batch processing
4. **Export results to JSON** for record-keeping
5. **Review estimates before updating Jira** - you can always say "no"

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to AI Sprint Platform" | Make sure `npm start` is running in another terminal |
| "Authentication failed" | Check your username and API token |
| "No stories found" | Verify you have access to the AIS project |
| "Failed to update story" | Check the story point field ID |

## 📚 Full Documentation

For detailed information, see:
- `JIRA_INTEGRATION.md` - Complete integration guide
- `README.md` - AI Sprint Platform documentation

## 🎉 You're Ready!

That's it! You can now:
- ✅ Fetch stories from Jira
- ✅ Estimate them using AI
- ✅ Update story points back to Jira
- ✅ Export results for analysis

Happy estimating! 🚀