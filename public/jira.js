// API Configuration
const API_BASE_URL = window.location.origin;

// Storage keys
const STORAGE_KEYS = {
    JIRA_URL: 'jira_url',
    JIRA_EMAIL: 'jira_email',
    JIRA_API_TOKEN: 'jira_api_token',
    USE_PAT: 'use_pat'
};

// State
let importedStories = [];

// DOM Elements
const jiraUrlInput = document.getElementById('jiraUrl');
const jiraEmailInput = document.getElementById('jiraEmail');
const jiraApiTokenInput = document.getElementById('jiraApiToken');
const usePATCheckbox = document.getElementById('usePAT');
const emailGroup = document.getElementById('emailGroup');
const patHelp = document.getElementById('patHelp');
const apiHelp = document.getElementById('apiHelp');
const testConnectionBtn = document.getElementById('testConnectionBtn');
const saveCredentialsBtn = document.getElementById('saveCredentialsBtn');
const connectionStatus = document.getElementById('connectionStatus');
const importSection = document.getElementById('importSection');
const projectSelect = document.getElementById('projectSelect');
const jqlQueryInput = document.getElementById('jqlQuery');
const loadProjectsBtn = document.getElementById('loadProjectsBtn');
const importStoriesBtn = document.getElementById('importStoriesBtn');
const importResults = document.getElementById('importResults');
const exportToJsonBtn = document.getElementById('exportToJsonBtn');
const sendToBoardBtn = document.getElementById('sendToBoardBtn');

// Event Listeners
testConnectionBtn.addEventListener('click', testConnection);
saveCredentialsBtn.addEventListener('click', saveCredentials);
loadProjectsBtn.addEventListener('click', loadProjects);
importStoriesBtn.addEventListener('click', importStories);
exportToJsonBtn.addEventListener('click', exportToJson);
sendToBoardBtn.addEventListener('click', sendToBoard);
projectSelect.addEventListener('change', () => {
    importStoriesBtn.disabled = !projectSelect.value;
});

// Handle PAT checkbox toggle
usePATCheckbox.addEventListener('change', () => {
    const usePAT = usePATCheckbox.checked;
    if (usePAT) {
        emailGroup.style.opacity = '0.5';
        jiraEmailInput.required = false;
        patHelp.style.display = 'block';
        apiHelp.style.display = 'none';
    } else {
        emailGroup.style.opacity = '1';
        jiraEmailInput.required = true;
        patHelp.style.display = 'none';
        apiHelp.style.display = 'block';
    }
});

// Load saved credentials
function loadSavedCredentials() {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.JIRA_URL);
    const savedEmail = localStorage.getItem(STORAGE_KEYS.JIRA_EMAIL);
    const savedToken = localStorage.getItem(STORAGE_KEYS.JIRA_API_TOKEN);
    const savedUsePAT = localStorage.getItem(STORAGE_KEYS.USE_PAT) === 'true';
    
    if (savedUrl) jiraUrlInput.value = savedUrl;
    if (savedEmail) jiraEmailInput.value = savedEmail;
    if (savedToken) jiraApiTokenInput.value = savedToken;
    if (savedUsePAT) {
        usePATCheckbox.checked = true;
        usePATCheckbox.dispatchEvent(new Event('change'));
    }
    
    if (savedUrl && savedToken) {
        showStatus('info', 'Saved Credentials Loaded', 'Your previously saved JIRA credentials have been loaded.');
        importSection.style.display = 'block';
    }
}

// Test Connection
async function testConnection() {
    const jiraUrl = jiraUrlInput.value.trim();
    const email = jiraEmailInput.value.trim();
    const apiToken = jiraApiTokenInput.value.trim();
    const usePAT = usePATCheckbox.checked;
    
    if (!jiraUrl || !apiToken) {
        showStatus('error', 'Missing Information', 'Please fill in JIRA URL and token.');
        return;
    }
    
    if (!usePAT && !email) {
        showStatus('error', 'Missing Email', 'Email is required when not using PAT.');
        return;
    }
    
    testConnectionBtn.disabled = true;
    testConnectionBtn.innerHTML = '<span class="btn-icon">⏳</span> Testing...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/jira/test-connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jiraUrl, email, apiToken, usePAT })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showStatus('success', 'Connection Successful!',
                `Connected as ${data.user.displayName} using ${data.authMethod} authentication`);
            importSection.style.display = 'block';
        } else {
            throw new Error(data.message || 'Connection failed');
        }
    } catch (error) {
        console.error('Connection error:', error);
        showStatus('error', 'Connection Failed',
            error.message || 'Unable to connect to JIRA. Please check your credentials and try again.');
    } finally {
        testConnectionBtn.disabled = false;
        testConnectionBtn.innerHTML = '<span class="btn-icon">🔌</span> Test Connection';
    }
}

// Save Credentials
function saveCredentials() {
    const jiraUrl = jiraUrlInput.value.trim();
    const email = jiraEmailInput.value.trim();
    const apiToken = jiraApiTokenInput.value.trim();
    const usePAT = usePATCheckbox.checked;
    
    if (!jiraUrl || !apiToken) {
        showStatus('error', 'Missing Information', 'Please fill in JIRA URL and token.');
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.JIRA_URL, jiraUrl);
    localStorage.setItem(STORAGE_KEYS.JIRA_EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.JIRA_API_TOKEN, apiToken);
    localStorage.setItem(STORAGE_KEYS.USE_PAT, usePAT.toString());
    
    showStatus('success', 'Credentials Saved',
        'Your JIRA credentials have been saved locally in your browser.');
}

// Load Projects
async function loadProjects() {
    const jiraUrl = jiraUrlInput.value.trim();
    const email = jiraEmailInput.value.trim();
    const apiToken = jiraApiTokenInput.value.trim();
    const usePAT = usePATCheckbox.checked;
    
    if (!jiraUrl || !apiToken) {
        showStatus('error', 'Missing Credentials', 'Please configure your JIRA connection first.');
        return;
    }
    
    loadProjectsBtn.disabled = true;
    loadProjectsBtn.innerHTML = '<span class="btn-icon">⏳</span> Loading...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/jira/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jiraUrl, email, apiToken, usePAT })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            populateProjects(data.projects);
            showStatus('success', 'Projects Loaded',
                `Found ${data.projects.length} projects in your JIRA instance.`);
        } else {
            throw new Error(data.message || 'Failed to load projects');
        }
    } catch (error) {
        console.error('Load projects error:', error);
        showStatus('error', 'Failed to Load Projects',
            error.message || 'Unable to fetch projects from JIRA. Please check your connection.');
    } finally {
        loadProjectsBtn.disabled = false;
        loadProjectsBtn.innerHTML = '<span class="btn-icon">📂</span> Load Projects';
    }
}

// Populate Projects Dropdown
function populateProjects(projects) {
    projectSelect.innerHTML = '<option value="">Select a project...</option>';
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.key;
        option.textContent = `${project.name} (${project.key})`;
        projectSelect.appendChild(option);
    });
}

// Import Stories
async function importStories() {
    const jiraUrl = jiraUrlInput.value.trim();
    const email = jiraEmailInput.value.trim();
    const apiToken = jiraApiTokenInput.value.trim();
    const projectKey = projectSelect.value;
    const jql = jqlQueryInput.value.trim();
    
    if (!projectKey) {
        alert('Please select a project');
        return;
    }
    
    importStoriesBtn.disabled = true;
    importStoriesBtn.innerHTML = '<span class="btn-icon">⏳</span> Importing...';
    
    showLoading('Importing stories from JIRA...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/jira/import-stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jiraUrl, email, apiToken, projectKey, jql })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            importedStories = data.stories;
            displayImportResults(data);
            showStatus('success', 'Import Successful', 
                `Imported ${data.imported} stories from JIRA.`);
        } else {
            throw new Error(data.message || 'Import failed');
        }
    } catch (error) {
        console.error('Import error:', error);
        showStatus('error', 'Import Failed', 
            'Unable to import stories from JIRA. Please try again.');
    } finally {
        hideLoading();
        importStoriesBtn.disabled = false;
        importStoriesBtn.innerHTML = '<span class="btn-icon">📥</span> Import Stories';
    }
}

// Display Import Results
function displayImportResults(data) {
    importResults.style.display = 'block';
    importResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Update summary
    document.getElementById('totalFound').textContent = data.total;
    document.getElementById('totalImported').textContent = data.imported;
    
    const withPoints = data.stories.filter(s => s.storyPoints > 0 && !s.estimation).length;
    const autoEstimated = data.stories.filter(s => s.estimation).length;
    
    document.getElementById('withPoints').textContent = withPoints;
    document.getElementById('autoEstimated').textContent = autoEstimated;
    
    // Display stories
    const storiesList = document.getElementById('storiesList');
    storiesList.innerHTML = '';
    
    if (data.stories.length === 0) {
        storiesList.innerHTML = `
            <div class="empty-stories">
                <div class="empty-icon">📭</div>
                <div class="empty-message">No stories found</div>
                <div class="empty-hint">Try adjusting your JQL query or select a different project</div>
            </div>
        `;
        return;
    }
    
    data.stories.forEach((story, index) => {
        const storyCard = createStoryCard(story, index);
        storiesList.appendChild(storyCard);
    });
}

// Create Story Card
function createStoryCard(story, index) {
    const card = document.createElement('div');
    card.className = 'jira-story-card';
    card.style.setProperty('--index', index);
    
    const isAutoEstimated = !!story.estimation;
    
    card.innerHTML = `
        <div class="story-card-header">
            <span class="story-key">${story.id}</span>
            <a href="${story.jiraUrl}" target="_blank" class="story-link">View in JIRA →</a>
        </div>
        <div class="story-card-title">${story.title}</div>
        ${story.description ? `<div class="story-card-description">${story.description}</div>` : ''}
        <div class="story-card-meta">
            <span class="meta-badge points">${story.storyPoints} SP</span>
            <span class="meta-badge priority ${story.priority}">${story.priority}</span>
            <span class="meta-badge status">${story.status}</span>
            ${isAutoEstimated ? '<span class="meta-badge auto-estimated">🤖 Auto-estimated</span>' : ''}
            ${story.assignee ? `<span class="meta-assignee">👤 ${story.assignee}</span>` : ''}
        </div>
    `;
    
    return card;
}

// Export to JSON
function exportToJson() {
    if (importedStories.length === 0) {
        alert('No stories to export');
        return;
    }
    
    const dataStr = JSON.stringify(importedStories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jira-stories-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Send to Board
function sendToBoard() {
    if (importedStories.length === 0) {
        alert('No stories to send');
        return;
    }
    
    // Transform stories to board format
    const boardStories = importedStories.map(story => ({
        id: story.id,
        title: story.title,
        description: story.description,
        priority: story.priority,
        assignee: story.assignee,
        estimation: story.estimation || {
            storyPoints: story.storyPoints,
            confidence: 'manual'
        }
    }));
    
    // Save to localStorage for board to pick up
    localStorage.setItem('jira_imported_stories', JSON.stringify(boardStories));
    
    // Redirect to board
    window.location.href = 'board.html?import=jira';
}

// Show Status
function showStatus(type, title, message) {
    connectionStatus.style.display = 'flex';
    connectionStatus.className = `connection-status ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    connectionStatus.innerHTML = `
        <div class="status-icon">${icons[type]}</div>
        <div class="status-content">
            <div class="status-title">${title}</div>
            <div>${message}</div>
        </div>
    `;
}

// Loading Overlay
function showLoading(message) {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('JIRA Integration initialized');
    loadSavedCredentials();
});

// Made with Bob