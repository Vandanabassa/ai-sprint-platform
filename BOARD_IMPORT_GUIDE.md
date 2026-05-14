# Planning Board - JSON Import Guide

## 📋 Correct JSON Format for Board Import

The Planning Board expects a **simplified JSON format** without all the JIRA metadata. Here's the correct format:

### ✅ Correct Format

```json
[
  {
    "id": "AIS-101",
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

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique story identifier (e.g., "AIS-101") |
| `title` | string | ✅ Yes | Story title/summary |
| `description` | string | ✅ Yes | Detailed story description |
| `priority` | string | ✅ Yes | Priority: "high", "medium", or "low" |
| `assignee` | string | ❌ No | Person assigned to the story |
| `estimation` | object | ✅ Yes | Estimation details |
| `estimation.storyPoints` | number | ✅ Yes | Story points (1, 2, 3, 5, 8, 13, etc.) |
| `estimation.confidence` | string | ✅ Yes | Confidence: "high", "medium", or "low" |

### Optional Fields (Ignored by Board)

These fields from JIRA export are **not needed** for board import:
- ❌ `status` - Board manages its own status
- ❌ `labels` - Not used in board
- ❌ `created` - Not displayed
- ❌ `updated` - Not displayed
- ❌ `jiraUrl` - Not used
- ❌ `estimation.breakdown` - Too detailed
- ❌ `estimation.insights` - Not displayed
- ❌ `estimation.analysis` - Not displayed

## 🔄 Converting JIRA Export to Board Format

If you exported stories from JIRA with full details, you need to simplify them:

### Before (JIRA Export - Too Much Data):
```json
{
  "id": "AIS-101",
  "title": "Story title",
  "description": "Description",
  "priority": "high",
  "status": "To Do",
  "assignee": "John",
  "storyPoints": 5,
  "labels": ["tag1", "tag2"],
  "created": "2026-05-10T08:30:00.000Z",
  "updated": "2026-05-12T14:20:00.000Z",
  "jiraUrl": "https://...",
  "estimation": {
    "storyPoints": 5,
    "confidence": "medium",
    "totalScore": 16,
    "breakdown": { ... },
    "insights": [ ... ],
    "analysis": { ... }
  }
}
```

### After (Board Format - Clean):
```json
{
  "id": "AIS-101",
  "title": "Story title",
  "description": "Description",
  "priority": "high",
  "assignee": "John",
  "estimation": {
    "storyPoints": 5,
    "confidence": "medium"
  }
}
```

## 📁 Ready-to-Use Files

### Option 1: Use Pre-formatted File
We've created `board-import-format.json` with the correct format:
```bash
# This file is ready to import directly into the Planning Board
board-import-format.json
```

### Option 2: Use Sample Stories
The sample JIRA stories can be converted:
```bash
# Original JIRA format (needs conversion)
sample-jira-stories.json

# Board-ready format
board-import-format.json
```

## 🚀 How to Import

### Step 1: Prepare Your JSON
1. Use `board-import-format.json` as a template
2. Or copy the format above
3. Ensure all required fields are present

### Step 2: Import to Board
1. Go to: http://localhost:3000/board.html
2. Look for the **"Import Stories"** section
3. Paste your JSON in the text area
4. Click **"Import Stories"** button

### Step 3: Verify Import
- Stories should appear in the "Backlog" column
- Check that story points are displayed
- Verify priority badges are correct

## 🛠️ Conversion Tool (Manual)

If you have JIRA export data, here's how to convert it:

### JavaScript Conversion Function:
```javascript
function convertJiraToBoard(jiraStories) {
  return jiraStories.map(story => ({
    id: story.id,
    title: story.title,
    description: story.description,
    priority: story.priority,
    assignee: story.assignee || '',
    estimation: {
      storyPoints: story.estimation?.storyPoints || story.storyPoints || 0,
      confidence: story.estimation?.confidence || 'medium'
    }
  }));
}

// Usage:
const jiraData = [ /* your JIRA export */ ];
const boardData = convertJiraToBoard(jiraData);
console.log(JSON.stringify(boardData, null, 2));
```

### Python Conversion Script:
```python
import json

def convert_jira_to_board(jira_stories):
    board_stories = []
    for story in jira_stories:
        board_story = {
            "id": story["id"],
            "title": story["title"],
            "description": story["description"],
            "priority": story["priority"],
            "assignee": story.get("assignee", ""),
            "estimation": {
                "storyPoints": story.get("estimation", {}).get("storyPoints", story.get("storyPoints", 0)),
                "confidence": story.get("estimation", {}).get("confidence", "medium")
            }
        }
        board_stories.append(board_story)
    return board_stories

# Usage:
with open('sample-jira-stories.json', 'r') as f:
    jira_data = json.load(f)
    
board_data = convert_jira_to_board(jira_data['stories'])

with open('board-import-format.json', 'w') as f:
    json.dump(board_data, f, indent=2)
```

## 📊 Example: Complete Import File

Here's a complete example with 3 stories:

```json
[
  {
    "id": "PROJ-1",
    "title": "Implement user login",
    "description": "Create login page with email and password authentication",
    "priority": "high",
    "assignee": "Alice",
    "estimation": {
      "storyPoints": 5,
      "confidence": "high"
    }
  },
  {
    "id": "PROJ-2",
    "title": "Fix CSS bug",
    "description": "Button alignment issue on mobile",
    "priority": "low",
    "assignee": "Bob",
    "estimation": {
      "storyPoints": 1,
      "confidence": "high"
    }
  },
  {
    "id": "PROJ-3",
    "title": "Add dark mode",
    "description": "Implement dark theme toggle in settings",
    "priority": "medium",
    "assignee": "Charlie",
    "estimation": {
      "storyPoints": 3,
      "confidence": "medium"
    }
  }
]
```

## ⚠️ Common Errors

### Error: "Invalid JSON format"
**Cause**: JSON syntax error
**Solution**: 
- Use a JSON validator (jsonlint.com)
- Check for missing commas, brackets, or quotes
- Ensure proper escaping of special characters

### Error: "Missing required field"
**Cause**: Required field is missing
**Solution**: 
- Ensure all required fields are present
- Check field names match exactly (case-sensitive)
- Verify estimation object has both storyPoints and confidence

### Error: "Invalid priority value"
**Cause**: Priority is not "high", "medium", or "low"
**Solution**: 
- Use only: "high", "medium", or "low"
- Check for typos or extra spaces
- Ensure lowercase

### Stories Don't Appear
**Cause**: Import succeeded but stories not visible
**Solution**: 
- Refresh the page
- Check browser console for errors (F12)
- Verify JSON was actually imported (check localStorage)

## 🎯 Quick Start

### Fastest Way to Test:
1. Copy `board-import-format.json` content
2. Go to http://localhost:3000/board.html
3. Paste in import area
4. Click "Import Stories"
5. Done! ✅

### For Your Own Stories:
1. Start with the template above
2. Replace with your story details
3. Keep the same structure
4. Import and test

## 📚 Related Files

- `board-import-format.json` - Ready-to-use board format
- `sample-jira-stories.json` - Full JIRA export format
- `board.html` - Planning board page
- `board.js` - Board JavaScript logic

## 💡 Tips

1. **Start Small**: Test with 1-2 stories first
2. **Validate JSON**: Use online JSON validators
3. **Keep It Simple**: Only include required fields
4. **Use Templates**: Copy from `board-import-format.json`
5. **Check Console**: Press F12 to see any errors

## ✅ Validation Checklist

Before importing, verify:
- [ ] Valid JSON syntax (no syntax errors)
- [ ] Array of objects (starts with `[` and ends with `]`)
- [ ] Each story has `id`, `title`, `description`, `priority`
- [ ] Each story has `estimation` object
- [ ] `estimation` has `storyPoints` (number) and `confidence` (string)
- [ ] Priority is "high", "medium", or "low"
- [ ] Story points are positive numbers
- [ ] No extra fields that might cause issues

---

**Need Help?** Check the browser console (F12) for detailed error messages!