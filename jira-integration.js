#!/usr/bin/env node

/**
 * Jira Integration Script for AI Sprint Platform
 * 
 * This script allows you to:
 * 1. Fetch stories from Jira
 * 2. Estimate them using the AI Sprint Platform
 * 3. Optionally update story points back to Jira
 */

const axios = require('axios');
const readline = require('readline');

// Configuration
const JIRA_BASE_URL = 'https://stg.jsw.ibm.com';
const PROJECT_KEY = 'AIS';
const AI_ESTIMATOR_URL = 'http://localhost:3000/api/estimate';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Utility function to prompt for password (hidden input)
function promptPassword(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    stdin.on('data', function(char) {
      char = char.toString('utf8');
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          password = password.slice(0, -1);
          stdout.clearLine();
          stdout.cursorTo(0);
          stdout.write(question + '*'.repeat(password.length));
          break;
        default:
          password += char;
          stdout.write('*');
          break;
      }
    });
  });
}

// Fetch stories from Jira
async function fetchJiraStories(username, apiToken, jql) {
  try {
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    
    const response = await axios({
      method: 'GET',
      url: `${JIRA_BASE_URL}/rest/api/2/search`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      params: {
        jql: jql,
        maxResults: 50,
        fields: 'summary,description,issuetype,status,customfield_10016' // customfield_10016 is often Story Points
      }
    });

    return response.data.issues;
  } catch (error) {
    console.error('Error fetching Jira stories:', error.response?.data || error.message);
    throw error;
  }
}

// Estimate story using AI Sprint Platform
async function estimateStory(userStory) {
  try {
    const response = await axios.post(AI_ESTIMATOR_URL, {
      userStory: userStory
    });
    return response.data.estimation;
  } catch (error) {
    console.error('Error estimating story:', error.message);
    return null;
  }
}

// Update story points in Jira
async function updateJiraStoryPoints(username, apiToken, issueKey, storyPoints, storyPointField) {
  try {
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    
    const updateData = {
      fields: {}
    };
    updateData.fields[storyPointField] = storyPoints;

    await axios({
      method: 'PUT',
      url: `${JIRA_BASE_URL}/rest/api/2/issue/${issueKey}`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      data: updateData
    });

    return true;
  } catch (error) {
    console.error(`Error updating ${issueKey}:`, error.response?.data || error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('   Jira Integration for AI Sprint Platform');
  console.log('=================================================\n');

  try {
    // Get credentials
    console.log('Please enter your Jira credentials:\n');
    const username = await prompt('Username (email): ');
    const apiToken = await promptPassword('API Token/Password: ');
    
    console.log('\n\nSelect an option:');
    console.log('1. Fetch unestimated stories and estimate them');
    console.log('2. Fetch all stories from a sprint');
    console.log('3. Estimate specific story by ID');
    
    const option = await prompt('\nEnter option (1-3): ');
    
    let jql = '';
    
    switch(option) {
      case '1':
        // Fetch unestimated stories
        jql = `project = ${PROJECT_KEY} AND type = Story AND "Story Points" is EMPTY AND status != Done ORDER BY created DESC`;
        break;
      case '2':
        const sprintName = await prompt('Enter sprint name (or leave empty for current sprint): ');
        if (sprintName) {
          jql = `project = ${PROJECT_KEY} AND sprint = "${sprintName}" AND type = Story ORDER BY created DESC`;
        } else {
          jql = `project = ${PROJECT_KEY} AND sprint in openSprints() AND type = Story ORDER BY created DESC`;
        }
        break;
      case '3':
        const issueKey = await prompt('Enter issue key (e.g., AIS-123): ');
        jql = `key = ${issueKey}`;
        break;
      default:
        console.log('Invalid option');
        rl.close();
        return;
    }

    console.log('\nFetching stories from Jira...\n');
    const stories = await fetchJiraStories(username, apiToken, jql);
    
    if (stories.length === 0) {
      console.log('No stories found matching the criteria.');
      rl.close();
      return;
    }

    console.log(`Found ${stories.length} stories.\n`);
    console.log('=================================================\n');

    const results = [];

    for (const issue of stories) {
      const key = issue.key;
      const summary = issue.fields.summary;
      const description = issue.fields.description || '';
      const currentStoryPoints = issue.fields.customfield_10016;

      console.log(`\n📋 ${key}: ${summary}`);
      console.log(`Current Story Points: ${currentStoryPoints || 'Not set'}`);

      // Create user story text for estimation
      const userStory = `${summary}\n\n${description}`;
      
      console.log('Estimating...');
      const estimation = await estimateStory(userStory);

      if (estimation) {
        console.log(`✅ Estimated Story Points: ${estimation.storyPoints}`);
        console.log(`   Confidence: ${estimation.confidence}`);
        console.log(`   Complexity Score: ${estimation.totalScore}`);
        
        results.push({
          key,
          summary,
          currentPoints: currentStoryPoints,
          estimatedPoints: estimation.storyPoints,
          confidence: estimation.confidence,
          estimation: estimation
        });
      } else {
        console.log('❌ Failed to estimate');
      }
      
      console.log('-------------------------------------------------');
    }

    // Ask if user wants to update Jira
    console.log('\n\n=================================================');
    console.log('Estimation Summary:');
    console.log('=================================================\n');
    
    results.forEach(result => {
      console.log(`${result.key}: ${result.currentPoints || 'N/A'} → ${result.estimatedPoints} (${result.confidence} confidence)`);
    });

    const updateJira = await prompt('\n\nDo you want to update story points in Jira? (yes/no): ');
    
    if (updateJira.toLowerCase() === 'yes' || updateJira.toLowerCase() === 'y') {
      const storyPointField = await prompt('Enter story point field ID (default: customfield_10016): ') || 'customfield_10016';
      
      console.log('\nUpdating Jira...\n');
      
      for (const result of results) {
        const success = await updateJiraStoryPoints(username, apiToken, result.key, result.estimatedPoints, storyPointField);
        if (success) {
          console.log(`✅ Updated ${result.key} with ${result.estimatedPoints} story points`);
        } else {
          console.log(`❌ Failed to update ${result.key}`);
        }
      }
    }

    // Export results to JSON
    const exportResults = await prompt('\nDo you want to export results to JSON? (yes/no): ');
    
    if (exportResults.toLowerCase() === 'yes' || exportResults.toLowerCase() === 'y') {
      const fs = require('fs');
      const filename = `jira-estimation-${Date.now()}.json`;
      fs.writeFileSync(filename, JSON.stringify(results, null, 2));
      console.log(`\n✅ Results exported to ${filename}`);
    }

    console.log('\n=================================================');
    console.log('Integration complete!');
    console.log('=================================================\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
main();

// Made with Bob
