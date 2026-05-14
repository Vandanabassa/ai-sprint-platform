# Sample JIRA Stories - Quick Start Guide

## 🎯 What's New?

You can now test the JIRA integration without connecting to an actual JIRA instance! We've added a **"Load Sample Stories"** button that loads 10 pre-configured sample stories with automatic AI estimation.

## 🚀 How to Use

### Step 1: Open JIRA Integration Page
Navigate to: **http://localhost:3000/jira.html**

### Step 2: Load Sample Stories
1. Scroll down to the **"Import Stories"** section
2. Click the green **"🎯 Load Sample Stories"** button
3. Wait a few seconds while stories are loaded and estimated

### Step 3: View Results
You'll see:
- **10 sample stories** from project "AIS"
- **Auto-estimated story points** for each story
- **Priority levels** (High, Medium, Low)
- **Status** (To Do, In Progress)
- **Assignees** and **Labels**

### Step 4: Use the Stories
You can now:
- ✅ **Export to JSON** - Save stories for later use
- ✅ **Send to Planning Board** - Use stories in sprint planning
- ✅ **Review Estimations** - See how AI estimates different story types

## 📊 Sample Stories Included

| Story ID | Title | Type | Priority |
|----------|-------|------|----------|
| AIS-101 | OAuth 2.0 Authentication | Complex Feature | High |
| AIS-102 | Fix Button Alignment | Simple Bug | Low |
| AIS-103 | Database Migration | Complex Migration | High |
| AIS-104 | Dark Mode Toggle | Medium Feature | Medium |
| AIS-105 | Real-time Notifications | Complex Feature | Medium |
| AIS-106 | API Performance Optimization | Performance | High |
| AIS-107 | User Onboarding Tutorial | UX Feature | Medium |
| AIS-108 | Memory Leak Fix | Critical Bug | High |
| AIS-109 | PDF Export | Feature | Medium |
| AIS-110 | Two-Factor Authentication | Security Feature | High |

## 🤖 AI Estimation Examples

The sample stories demonstrate different estimation scenarios:

### High Complexity (8-13 points)
- **AIS-101**: OAuth integration with multiple providers
- **AIS-103**: Database migration with zero downtime
- **AIS-110**: Two-factor authentication implementation

### Medium Complexity (3-5 points)
- **AIS-104**: Dark mode toggle
- **AIS-105**: WebSocket notifications
- **AIS-107**: User onboarding tutorial

### Low Complexity (1-2 points)
- **AIS-102**: CSS button alignment fix

## 💡 Use Cases

### 1. Testing the Platform
- Try out all features without JIRA credentials
- See how AI estimation works
- Test export and planning board integration

### 2. Demo/Presentation
- Show the platform to stakeholders
- Demonstrate AI estimation capabilities
- Present sprint planning features

### 3. Training
- Train team members on the platform
- Practice sprint planning
- Learn estimation techniques

### 4. Development
- Test new features
- Debug issues
- Validate changes

## 🔄 Switching to Real JIRA

When you're ready to use real JIRA:

1. **Configure Connection**:
   - Enter your JIRA URL
   - Check "Use Personal Access Token (PAT)" for IBM JIRA
   - Enter your credentials
   - Click "Test Connection"

2. **Load Real Projects**:
   - Click "Load Projects"
   - Select your project
   - Click "Import Stories"

3. **Compare**:
   - Compare AI estimations with your team's estimates
   - Adjust and refine as needed

## 📝 Sample Stories File

The sample stories are stored in: `sample-jira-stories.json`

You can:
- ✏️ Edit the file to add your own sample stories
- 📋 Copy the format for your own stories
- 🔄 Modify priorities, descriptions, and assignees

### File Format:
```json
{
  "project": "AIS",
  "projectName": "AI Sprint Platform",
  "stories": [
    {
      "id": "AIS-XXX",
      "title": "Story title",
      "description": "Detailed description",
      "priority": "high|medium|low",
      "status": "To Do|In Progress|Done",
      "assignee": "Name",
      "storyPoints": 0,
      "labels": ["tag1", "tag2"],
      "jiraUrl": "https://..."
    }
  ]
}
```

## 🎨 Features Demonstrated

### ✅ Auto-Estimation
- Stories without points get AI estimates
- Confidence levels shown
- Detailed analysis provided

### ✅ Story Cards
- Visual story representation
- Priority badges
- Status indicators
- Assignee information

### ✅ Export Options
- JSON export for backup
- Planning board integration
- Easy data portability

### ✅ Summary Statistics
- Total stories found
- Stories imported
- Stories with points
- Auto-estimated count

## 🔧 Troubleshooting

### Button Not Appearing?
- Clear browser cache (Ctrl+F5)
- Restart the server: `restart-server.bat`
- Check console for errors (F12)

### Stories Not Loading?
- Verify `sample-jira-stories.json` exists
- Check server logs for errors
- Ensure server is running on port 3000

### Estimations Not Showing?
- Stories are estimated automatically
- Check the "Auto-Estimated" count in summary
- Look for 🤖 badge on story cards

## 📚 Next Steps

1. ✅ Try loading sample stories
2. ✅ Review AI estimations
3. ✅ Export to JSON
4. ✅ Send to Planning Board
5. ✅ Configure real JIRA connection
6. ✅ Import your actual stories

## 🎉 Benefits

- **No JIRA Setup Required** - Start using immediately
- **Learn by Example** - See real-world story patterns
- **Safe Testing** - No risk to production data
- **Quick Demos** - Show features instantly
- **Training Tool** - Perfect for onboarding

---

**Ready to try it?** Click the **"🎯 Load Sample Stories"** button and explore! 🚀