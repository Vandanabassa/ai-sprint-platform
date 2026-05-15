# How to Add JIRA Stories to Planning Board

## 🎯 Complete Step-by-Step Guide

### Method 1: Using Sample Stories (Easiest - No JIRA Required!)

#### Step 1: Load Sample Stories from JIRA Page
1. Open: **http://localhost:3000/jira.html**
2. Scroll down to the **"Import Stories"** section
3. Click the green button: **"🎯 Load Sample Stories"**
4. Wait 2-3 seconds for stories to load

#### Step 2: Verify Stories Loaded
You should see:
- ✅ **Import Results** section appears
- ✅ Summary shows: "10 stories imported"
- ✅ List of 10 stories displayed with cards
- ✅ Two buttons at the bottom:
  - **"💾 Export to JSON"**
  - **"📋 Send to Planning Board"**

#### Step 3: Send to Planning Board
1. Click the blue button: **"📋 Send to Planning Board"**
2. You'll be automatically redirected to: **http://localhost:3000/board.html**
3. Stories will appear in the **Backlog** column
4. ✅ Done! You can now drag stories to plan your sprint

### Method 2: Using Real JIRA (Requires JIRA Access)

#### Step 1: Configure JIRA Connection
1. Open: **http://localhost:3000/jira.html**
2. Fill in the connection form:
   - **JIRA URL**: `https://stg.jsw.ibm.com`
   - ✅ Check: **"Use Personal Access Token (PAT)"**
   - **Token**: Paste your PAT token
3. Click: **"🔌 Test Connection"**
4. Wait for success message

#### Step 2: Load Projects
1. Click: **"📂 Load Projects"**
2. Select your project from dropdown (e.g., **AIS**)

#### Step 3: Import Stories
1. (Optional) Enter JQL query to filter stories
2. Click: **"📥 Import Stories"**
3. Wait for stories to load

#### Step 4: Send to Planning Board
1. Review the imported stories
2. Click: **"📋 Send to Planning Board"**
3. Stories automatically transfer to board

### Method 3: Direct JSON Import to Board

#### Step 1: Prepare JSON File
Use the pre-formatted file: `board-import-format.json`

Or create your own following this format:
```json
[
  {
    "id": "STORY-1",
    "title": "Story title",
    "description": "Story description",
    "priority": "high",
    "assignee": "John Doe",
    "estimation": {
      "storyPoints": 5,
      "confidence": "medium"
    }
  }
]
```

#### Step 2: Import to Board
1. Open: **http://localhost:3000/board.html**
2. Look for **"Import Stories"** section (usually at the top or in a menu)
3. Paste your JSON
4. Click **"Import"** or **"Import Stories"**

## 🔍 Troubleshooting

### Issue: "Send to Planning Board" Button Not Visible

**Cause**: No stories have been imported yet

**Solution**:
1. Make sure you've completed Step 1 (Load Sample Stories or Import from JIRA)
2. Check that the "Import Results" section is visible
3. Verify stories are displayed in the list
4. Scroll down to find the buttons

### Issue: Button Exists But Nothing Happens

**Cause**: JavaScript error or localStorage issue

**Solution**:
1. Open browser console (Press F12)
2. Look for red error messages
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Refresh the page and try again

### Issue: Stories Don't Appear on Board

**Cause**: Board not reading from localStorage

**Solution**:
1. Check browser console for errors
2. Verify localStorage has data:
   - Press F12
   - Go to Application tab
   - Check Local Storage
   - Look for `jira_imported_stories`
3. Try importing directly using Method 3

### Issue: Can't Find Import Option on Board

**Cause**: Board UI might not have visible import section

**Solution**:
1. Look for buttons/menus at the top of the board
2. Check for "Import", "Add Stories", or similar options
3. Use Method 1 or 2 to transfer from JIRA page instead

## 📊 Visual Flow Diagram

```
JIRA Page (jira.html)
    ↓
[Load Sample Stories] or [Import from JIRA]
    ↓
Stories Displayed with Cards
    ↓
[📋 Send to Planning Board] Button Appears
    ↓
Click Button
    ↓
Automatic Redirect to board.html
    ↓
Stories Appear in Backlog Column
    ↓
Drag & Drop to Plan Sprint
```

## ✅ Quick Verification Checklist

Before clicking "Send to Planning Board":
- [ ] Stories are visible on JIRA page
- [ ] "Import Results" section is showing
- [ ] Story count is displayed (e.g., "10 stories imported")
- [ ] Story cards are rendered with details
- [ ] "Send to Planning Board" button is visible at bottom
- [ ] Button is not disabled/grayed out

## 🎯 Fastest Way (30 Seconds)

1. Go to: http://localhost:3000/jira.html
2. Click: **"🎯 Load Sample Stories"** (green button)
3. Wait 3 seconds
4. Scroll down
5. Click: **"📋 Send to Planning Board"** (blue button)
6. ✅ Done! Stories are now on the board

## 📝 Alternative: Manual Copy-Paste

If buttons don't work, you can manually copy stories:

1. On JIRA page, click: **"💾 Export to JSON"**
2. Save the JSON file
3. Open the file and copy the content
4. Go to: http://localhost:3000/board.html
5. Find import section and paste JSON
6. Click import

## 🆘 Still Having Issues?

### Check These:

1. **Server Running?**
   ```bash
   netstat -ano | findstr :3000
   ```
   Should show port 3000 is LISTENING

2. **Browser Console Errors?**
   - Press F12
   - Check Console tab
   - Look for red errors

3. **LocalStorage Working?**
   - Press F12
   - Go to Application → Local Storage
   - Check if data is being saved

4. **Correct URLs?**
   - JIRA page: http://localhost:3000/jira.html
   - Board page: http://localhost:3000/board.html

## 💡 Pro Tips

1. **Test with Sample Stories First**: Always test with sample stories before using real JIRA data
2. **Export Before Sending**: Click "Export to JSON" to keep a backup
3. **Check Story Format**: Ensure stories have all required fields
4. **Clear Cache**: If issues persist, clear browser cache
5. **Use Chrome/Edge**: Best compatibility with modern browsers

## 📚 Related Documentation

- `SAMPLE_STORIES_GUIDE.md` - How to use sample stories
- `BOARD_IMPORT_GUIDE.md` - Board JSON import format
- `JIRA_FIX_GUIDE.md` - JIRA integration troubleshooting

---

**Need more help?** Check the browser console (F12) for detailed error messages!