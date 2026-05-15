// API Configuration
const API_BASE_URL = window.location.origin;

// Board State
let boardState = {
    backlog: [],
    sprint: [],
    inProgress: [],
    done: []
};

// DOM Elements
const addStoryBtn = document.getElementById('addStoryBtn');
const estimateAllBtn = document.getElementById('estimateAllBtn');
const clearBoardBtn = document.getElementById('clearBoardBtn');
const loadExampleBtn = document.getElementById('loadExampleBtn');
const exportBoardBtn = document.getElementById('exportBoardBtn');
const importBoardBtn = document.getElementById('importBoardBtn');

const addStoryModal = document.getElementById('addStoryModal');
const importModal = document.getElementById('importModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeImportModalBtn = document.getElementById('closeImportModalBtn');
const cancelStoryBtn = document.getElementById('cancelStoryBtn');
const saveStoryBtn = document.getElementById('saveStoryBtn');
const cancelImportBtn = document.getElementById('cancelImportBtn');
const confirmImportBtn = document.getElementById('confirmImportBtn');

// Column elements
const columns = {
    backlog: document.getElementById('backlogColumn'),
    sprint: document.getElementById('sprintColumn'),
    inProgress: document.getElementById('inProgressColumn'),
    done: document.getElementById('doneColumn')
};

// Event Listeners
addStoryBtn.addEventListener('click', openAddStoryModal);
estimateAllBtn.addEventListener('click', estimateAllStories);
clearBoardBtn.addEventListener('click', clearBoard);
loadExampleBtn.addEventListener('click', loadExampleStories);
exportBoardBtn.addEventListener('click', exportBoard);
importBoardBtn.addEventListener('click', openImportModal);

closeModalBtn.addEventListener('click', closeAddStoryModal);
closeImportModalBtn.addEventListener('click', closeImportModalDialog);
cancelStoryBtn.addEventListener('click', closeAddStoryModal);
saveStoryBtn.addEventListener('click', saveStory);
cancelImportBtn.addEventListener('click', closeImportModalDialog);
confirmImportBtn.addEventListener('click', importBoard);

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === addStoryModal) closeAddStoryModal();
    if (e.target === importModal) closeImportModalDialog();
});

// Initialize drag and drop for all columns
Object.values(columns).forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragleave', handleDragLeave);
});

// Open Add Story Modal
function openAddStoryModal() {
    addStoryModal.classList.add('active');
    document.getElementById('storyId').value = '';
    document.getElementById('storyTitle').value = '';
    document.getElementById('storyDescription').value = '';
    document.getElementById('storyPriority').value = 'medium';
    document.getElementById('storyPoints').value = '';
    document.getElementById('storyAssignee').value = '';
}

// Close Add Story Modal
function closeAddStoryModal() {
    addStoryModal.classList.remove('active');
}

// Open Import Modal
function openImportModal() {
    importModal.classList.add('active');
    document.getElementById('importData').value = '';
}

// Close Import Modal
function closeImportModalDialog() {
    importModal.classList.remove('active');
}

// Save Story
async function saveStory() {
    const title = document.getElementById('storyTitle').value.trim();
    if (!title) {
        alert('Please enter a story title');
        return;
    }

    const story = {
        id: document.getElementById('storyId').value.trim() || `STORY-${Date.now()}`,
        title,
        description: document.getElementById('storyDescription').value.trim(),
        priority: document.getElementById('storyPriority').value,
        assignee: document.getElementById('storyAssignee').value.trim()
    };

    const manualPoints = document.getElementById('storyPoints').value;
    
    if (manualPoints) {
        // Use manual story points
        story.estimation = {
            storyPoints: parseInt(manualPoints),
            confidence: 'manual'
        };
        addStoryToBoard(story, 'backlog');
        closeAddStoryModal();
    } else if (story.description) {
        // Auto-estimate using API
        try {
            const response = await fetch(`${API_BASE_URL}/api/estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userStory: story.description })
            });

            if (response.ok) {
                const data = await response.json();
                story.estimation = data.estimation;
                addStoryToBoard(story, 'backlog');
                closeAddStoryModal();
            } else {
                throw new Error('Estimation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to estimate story. Adding without estimation.');
            story.estimation = { storyPoints: 0, confidence: 'unknown' };
            addStoryToBoard(story, 'backlog');
            closeAddStoryModal();
        }
    } else {
        // No description and no manual points
        story.estimation = { storyPoints: 0, confidence: 'unknown' };
        addStoryToBoard(story, 'backlog');
        closeAddStoryModal();
    }
}

// Add Story to Board
function addStoryToBoard(story, column) {
    boardState[column].push(story);
    renderBoard();
    updateStats();
}

// Remove Story from Board
function removeStory(storyId, column) {
    if (confirm('Are you sure you want to delete this story?')) {
        boardState[column] = boardState[column].filter(s => s.id !== storyId);
        renderBoard();
        updateStats();
    }
}

// Edit Story
function editStory(storyId, column) {
    const story = boardState[column].find(s => s.id === storyId);
    if (!story) return;

    document.getElementById('storyId').value = story.id;
    document.getElementById('storyTitle').value = story.title;
    document.getElementById('storyDescription').value = story.description || '';
    document.getElementById('storyPriority').value = story.priority;
    document.getElementById('storyPoints').value = story.estimation?.storyPoints || '';
    document.getElementById('storyAssignee').value = story.assignee || '';

    // Remove the story temporarily
    boardState[column] = boardState[column].filter(s => s.id !== storyId);
    
    openAddStoryModal();
}

// Render Board
function renderBoard() {
    Object.keys(columns).forEach(columnName => {
        const column = columns[columnName];
        const stories = boardState[columnName];
        
        // Clear column
        column.innerHTML = '';
        
        if (stories.length === 0) {
            // Show empty state
            const emptyState = createEmptyState(columnName);
            column.appendChild(emptyState);
        } else {
            // Render stories
            stories.forEach(story => {
                const storyCard = createStoryCard(story, columnName);
                column.appendChild(storyCard);
            });
        }
        
        // Update column count
        const countElement = document.getElementById(`${columnName}ColumnCount`);
        if (countElement) {
            countElement.textContent = stories.length;
        }
    });
}

// Create Empty State
function createEmptyState(columnName) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const icons = {
        backlog: '📝',
        sprint: '🚀',
        inProgress: '💻',
        done: '🎉'
    };
    
    const messages = {
        backlog: 'No stories in backlog',
        sprint: 'No stories in sprint',
        inProgress: 'No stories in progress',
        done: 'No completed stories'
    };
    
    const hints = {
        backlog: 'Add stories or drag them here',
        sprint: 'Drag stories here to plan sprint',
        inProgress: 'Drag stories here when started',
        done: 'Drag stories here when complete'
    };
    
    emptyState.innerHTML = `
        <div class="empty-icon">${icons[columnName]}</div>
        <p>${messages[columnName]}</p>
        <p class="empty-hint">${hints[columnName]}</p>
    `;
    
    return emptyState;
}

// Create Story Card
function createStoryCard(story, column) {
    const card = document.createElement('div');
    card.className = `story-card priority-${story.priority}`;
    card.draggable = true;
    card.dataset.storyId = story.id;
    card.dataset.column = column;
    
    // Add drag event listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    const points = story.estimation?.storyPoints || 0;
    const confidence = story.estimation?.confidence || 'unknown';
    
    card.innerHTML = `
        <div class="story-header">
            <span class="story-id">${story.id}</span>
            <div class="story-actions">
                <button class="story-action-btn" onclick="editStory('${story.id}', '${column}')" title="Edit">✏️</button>
                <button class="story-action-btn" onclick="removeStory('${story.id}', '${column}')" title="Delete">🗑️</button>
            </div>
        </div>
        <div class="story-title">${story.title}</div>
        ${story.description ? `<div class="story-description">${story.description}</div>` : ''}
        <div class="story-footer">
            <div class="story-meta">
                <span class="story-points">${points} SP</span>
                <span class="story-priority ${story.priority}">${story.priority}</span>
                ${confidence !== 'manual' && confidence !== 'unknown' ? `<span class="story-confidence ${confidence}">${confidence}</span>` : ''}
            </div>
            ${story.assignee ? `<div class="story-assignee">👤 ${story.assignee}</div>` : ''}
        </div>
    `;
    
    return card;
}

// Drag and Drop Handlers
let draggedElement = null;
let sourceColumn = null;

function handleDragStart(e) {
    draggedElement = e.target;
    sourceColumn = e.target.dataset.column;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    
    // Remove drag-over class from all columns
    Object.values(columns).forEach(col => {
        col.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
    
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedElement) {
        const storyId = draggedElement.dataset.storyId;
        const targetColumn = e.currentTarget.dataset.column;
        
        if (sourceColumn !== targetColumn) {
            moveStory(storyId, sourceColumn, targetColumn);
        }
    }
    
    return false;
}

// Move Story Between Columns
function moveStory(storyId, fromColumn, toColumn) {
    const storyIndex = boardState[fromColumn].findIndex(s => s.id === storyId);
    if (storyIndex === -1) return;
    
    const story = boardState[fromColumn][storyIndex];
    boardState[fromColumn].splice(storyIndex, 1);
    boardState[toColumn].push(story);
    
    renderBoard();
    updateStats();
}

// Update Stats
function updateStats() {
    document.getElementById('backlogCount').textContent = boardState.backlog.length;
    document.getElementById('sprintCount').textContent = boardState.sprint.length;
    document.getElementById('inProgressCount').textContent = boardState.inProgress.length;
    document.getElementById('doneCount').textContent = boardState.done.length;
    
    const sprintPoints = boardState.sprint.reduce((sum, s) => sum + (s.estimation?.storyPoints || 0), 0);
    const donePoints = boardState.done.reduce((sum, s) => sum + (s.estimation?.storyPoints || 0), 0);
    
    document.getElementById('sprintPoints').textContent = sprintPoints;
    document.getElementById('donePoints').textContent = donePoints;
}

// Estimate All Stories
async function estimateAllStories() {
    const allStories = [...boardState.backlog, ...boardState.sprint, ...boardState.inProgress, ...boardState.done];
    const storiesToEstimate = allStories.filter(s => s.description && (!s.estimation || s.estimation.storyPoints === 0));
    
    if (storiesToEstimate.length === 0) {
        alert('No stories need estimation');
        return;
    }
    
    estimateAllBtn.disabled = true;
    estimateAllBtn.innerHTML = '<span class="btn-icon">⏳</span> Estimating...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/board/estimate-stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stories: storiesToEstimate })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update stories with estimations
            data.stories.forEach(estimatedStory => {
                Object.keys(boardState).forEach(column => {
                    const story = boardState[column].find(s => s.id === estimatedStory.id);
                    if (story && estimatedStory.estimation) {
                        story.estimation = estimatedStory.estimation;
                    }
                });
            });
            
            renderBoard();
            updateStats();
            alert(`Successfully estimated ${data.stories.length} stories!`);
        } else {
            throw new Error('Estimation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to estimate stories. Please try again.');
    } finally {
        estimateAllBtn.disabled = false;
        estimateAllBtn.innerHTML = '<span class="btn-icon">🤖</span> Auto-Estimate All';
    }
}

// Clear Board
function clearBoard() {
    if (confirm('Are you sure you want to clear the entire board? This cannot be undone.')) {
        boardState = {
            backlog: [],
            sprint: [],
            inProgress: [],
            done: []
        };
        renderBoard();
        updateStats();
    }
}

// Load Example Stories
function loadExampleStories() {
    const examples = [
        {
            id: 'STORY-101',
            title: 'User Authentication System',
            description: 'As a user, I want to securely log in using OAuth so that my account is protected',
            priority: 'high',
            assignee: 'Alice Johnson'
        },
        {
            id: 'STORY-102',
            title: 'Dashboard Analytics',
            description: 'As a manager, I want to view team performance metrics on a dashboard',
            priority: 'high',
            assignee: 'Bob Smith'
        },
        {
            id: 'STORY-103',
            title: 'Email Notifications',
            description: 'As a user, I want to receive email notifications for important updates',
            priority: 'medium',
            assignee: ''
        },
        {
            id: 'STORY-104',
            title: 'Dark Mode Support',
            description: 'As a user, I want to toggle dark mode for better viewing at night',
            priority: 'low',
            assignee: 'Carol Davis'
        },
        {
            id: 'STORY-105',
            title: 'Bug: Button Alignment',
            description: 'Fix the alignment issue with submit buttons on mobile devices',
            priority: 'medium',
            assignee: ''
        }
    ];
    
    boardState.backlog = examples.map(story => ({
        ...story,
        estimation: { storyPoints: 0, confidence: 'unknown' }
    }));
    
    renderBoard();
    updateStats();
    alert('Example stories loaded! Click "Auto-Estimate All" to estimate them.');
}

// Export Board
function exportBoard() {
    const dataStr = JSON.stringify(boardState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sprint-board-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import Board
function importBoard() {
    const importData = document.getElementById('importData').value.trim();
    
    if (!importData) {
        alert('Please paste JSON data to import');
        return;
    }
    
    try {
        const imported = JSON.parse(importData);
        
        // Validate structure
        if (!imported.backlog || !imported.sprint || !imported.inProgress || !imported.done) {
            throw new Error('Invalid board structure');
        }
        
        boardState = imported;
        renderBoard();
        updateStats();
        closeImportModalDialog();
        alert('Board imported successfully!');
    } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import board. Please check the JSON format.');
    }
}

// Make functions globally accessible
window.removeStory = removeStory;
window.editStory = editStory;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sprint Planning Board initialized');
    
    // Check if stories were imported from JIRA
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('import') === 'jira') {
        const jiraStories = localStorage.getItem('jira_imported_stories');
        if (jiraStories) {
            try {
                const stories = JSON.parse(jiraStories);
                // Add stories to backlog
                boardState.backlog = stories.map(story => ({
                    id: story.id,
                    title: story.title,
                    description: story.description,
                    priority: story.priority || 'medium',
                    assignee: story.assignee || '',
                    estimation: story.estimation || {
                        storyPoints: 0,
                        confidence: 'unknown'
                    }
                }));
                // Clear the localStorage item
                localStorage.removeItem('jira_imported_stories');
                console.log(`Imported ${stories.length} stories from JIRA`);
                alert(`Successfully imported ${stories.length} stories from JIRA!`);
            } catch (error) {
                console.error('Error importing JIRA stories:', error);
                alert('Failed to import stories from JIRA. Please try again.');
            }
        }
    }
    
    renderBoard();
    updateStats();
});

// Made with Bob