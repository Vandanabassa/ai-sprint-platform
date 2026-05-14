# Jira Integration Guide

## Overview

This integration script allows you to connect your AI Sprint Platform with IBM Jira to automatically estimate story points for your user stories.

## Prerequisites

1. **AI Sprint Platform Running**: Make sure the AI Sprint Platform server is running on `http://localhost:3000`
   ```bash
   npm start
   ```

2. **Jira Access**: You need:
   - Your IBM Jira username (email)
   - Jira API Token or password
   - Access to the AIS project

## How to Get Jira API Token

1. Log in to your IBM Jira account: https://stg.jsw.ibm.com
2. Click on your profile icon (top right)
3. Go to "Account Settings" or "Profile"
4. Navigate to "Security" → "API Tokens"
5. Click "Create API Token"
6. Give it a name (e.g., "AI Sprint Platform")
7. Copy the token (you won't be able to see it again!)

## Running the Integration Script

### Option 1: Using Node.js directly

```bash
cd ai-sprint-platform
node jira-integration.js
```

### Option 2: Make it executable (Linux/Mac)

```bash
chmod +x jira-integration.js
./jira-integration.js
```

### Option 3: Using npm (if added to package.json)

```bash
npm run jira-sync
```

## Usage

When you run the script, you'll be prompted for:

1. **Username**: Your IBM email address
2. **API Token/Password**: Your Jira API token (input is hidden)
3. **Operation Mode**: Choose from:
   - **Option 1**: Fetch unestimated stories and estimate them
   - **Option 2**: Fetch all stories from a specific sprint
   - **Option 3**: Estimate a specific story by ID

### Example Workflow

```
=================================================
   Jira Integration for AI Sprint Platform
=================================================

Please enter your Jira credentials:

Username (email): your.email@ibm.com
API Token/Password: ********

Select an option:
1. Fetch unestimated stories and estimate them
2. Fetch all stories from a sprint
3. Estimate specific story by ID

Enter option (1-3): 1

Fetching stories from Jira...

Found 5 stories.

=================================================

📋 AIS-123: Implement user authentication
Current Story Points: Not set
Estimating...
✅ Estimated Story Points: 5
   Confidence: medium
   Complexity Score: 18
-------------------------------------------------

📋 AIS-124: Fix login button alignment
Current Story Points: Not set
Estimating...
✅ Estimated Story Points: 1
   Confidence: high
   Complexity Score: 4
-------------------------------------------------

...

=================================================
Estimation Summary:
=================================================

AIS-123: N/A → 5 (medium confidence)
AIS-124: N/A → 1 (high confidence)

Do you want to update story points in Jira? (yes/no): yes

Enter story point field ID (default: customfield_10016): 

Updating Jira...

✅ Updated AIS-123 with 5 story points
✅ Updated AIS-124 with 1 story points

Do you want to export results to JSON? (yes/no): yes

✅ Results exported to jira-estimation-1234567890.json

=================================================
Integration complete!
=================================================
```

## Features

### 1. Fetch Unestimated Stories
- Automatically finds all stories in the AIS project without story points
- Excludes completed stories
- Estimates each story using AI

### 2. Sprint-Based Estimation
- Fetch stories from a specific sprint by name
- Or fetch stories from the current active sprint
- Useful for sprint planning sessions

### 3. Single Story Estimation
- Estimate a specific story by providing its key (e.g., AIS-123)
- Useful for ad-hoc estimations

### 4. Update Jira
- Optionally update story points back to Jira
- Prompts for confirmation before updating
- Shows success/failure for each update

### 5. Export Results
- Export estimation results to JSON file
- Includes all estimation details and confidence levels
- Useful for record-keeping and analysis

## Configuration

### Jira URL
Default: `https://stg.jsw.ibm.com`

To change, edit the script:
```javascript
const JIRA_BASE_URL = 'https://your-jira-instance.com';
```

### Project Key
Default: `AIS`

To change, edit the script:
```javascript
const PROJECT_KEY = 'YOUR_PROJECT_KEY';
```

### Story Point Field
Default: `customfield_10016`

If your Jira uses a different field for story points, you'll be prompted to enter it when updating Jira.

To find your story point field ID:
1. Go to Jira
2. Open any story
3. Right-click on the Story Points field
4. Inspect element
5. Look for `customfield_xxxxx` in the HTML

## Troubleshooting

### Error: "Cannot connect to AI Sprint Platform"
**Solution**: Make sure the AI Sprint Platform server is running:
```bash
npm start
```

### Error: "Authentication failed"
**Solution**: 
- Verify your username and API token are correct
- Make sure you're using an API token, not your password
- Check if your account has access to the AIS project

### Error: "Story point field not found"
**Solution**: 
- Find the correct custom field ID for story points in your Jira
- When prompted, enter the correct field ID (e.g., `customfield_12345`)

### Error: "No stories found"
**Solution**: 
- Check if there are stories matching your criteria in Jira
- Verify the JQL query is correct
- Make sure you have permission to view the stories

### Error: "Failed to update story"
**Solution**: 
- Check if you have permission to edit stories in Jira
- Verify the story point field ID is correct
- Make sure the story is not locked or in a restricted status

## Advanced Usage

### Custom JQL Queries

You can modify the script to use custom JQL queries. Edit the `jql` variable in the script:

```javascript
// Example: Fetch high-priority unestimated stories
jql = `project = AIS AND priority = High AND "Story Points" is EMPTY AND status != Done`;

// Example: Fetch stories assigned to you
jql = `project = AIS AND assignee = currentUser() AND "Story Points" is EMPTY`;

// Example: Fetch stories from last week
jql = `project = AIS AND created >= -7d AND "Story Points" is EMPTY`;
```

### Batch Processing

For large numbers of stories, the script processes them sequentially. You can modify the delay between requests if needed:

```javascript
// Add delay between API calls
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
```

## Security Notes

- **Never commit your API token** to version control
- The script prompts for credentials each time (no storage)
- API tokens are transmitted securely over HTTPS
- Consider using environment variables for automation

## Integration with CI/CD

You can automate the integration in your CI/CD pipeline:

```bash
# Example: Estimate all unestimated stories in current sprint
echo -e "username@ibm.com\nYOUR_API_TOKEN\n1\n\nno\nno" | node jira-integration.js
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Jira API documentation
3. Contact your Jira administrator for access issues
4. Open an issue in the AI Sprint Platform repository

---

**Happy Estimating! 🚀**