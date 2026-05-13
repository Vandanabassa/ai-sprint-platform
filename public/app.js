// API Configuration
const API_BASE_URL = window.location.origin;

// Example stories
const examples = {
    simple: "Fix typo in the login button text. The button currently says 'Sing In' instead of 'Sign In'.",
    medium: "As a user, I want to add items to my shopping cart so that I can purchase multiple products at once. The cart should display item count and total price.",
    complex: "Implement OAuth 2.0 authentication integration with Google and Microsoft providers. This includes setting up secure token management, implementing refresh token rotation, adding user profile synchronization, and ensuring GDPR compliance with proper data encryption and audit logging."
};

// DOM Elements
const userStoryInput = document.getElementById('userStory');
const estimateBtn = document.getElementById('estimateBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('results');
const exampleButtons = document.querySelectorAll('.example-btn');
const batchStoriesInput = document.getElementById('batchStories');
const batchEstimateBtn = document.getElementById('batchEstimateBtn');
const batchResultsDiv = document.getElementById('batchResults');

// Event Listeners
estimateBtn.addEventListener('click', estimateStory);
clearBtn.addEventListener('click', clearForm);
userStoryInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        estimateStory();
    }
});

exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const exampleType = btn.dataset.example;
        userStoryInput.value = examples[exampleType];
        userStoryInput.focus();
    });
});

batchEstimateBtn.addEventListener('click', estimateBatch);

// Main estimation function
async function estimateStory() {
    const userStory = userStoryInput.value.trim();
    
    if (!userStory) {
        showError('Please enter a user story');
        return;
    }
    
    // Disable button and show loading state
    estimateBtn.disabled = true;
    estimateBtn.innerHTML = '<span class="btn-icon">⏳</span> Estimating...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/estimate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userStory })
        });
        
        if (!response.ok) {
            throw new Error('Failed to estimate story points');
        }
        
        const data = await response.json();
        displayResults(data.estimation);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to estimate story points. Please try again.');
    } finally {
        // Re-enable button
        estimateBtn.disabled = false;
        estimateBtn.innerHTML = '<span class="btn-icon">📊</span> Estimate Story Points';
    }
}

// Display estimation results
function displayResults(estimation) {
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Display story points
    document.getElementById('storyPoints').textContent = estimation.storyPoints;
    
    // Display confidence badge
    const confidenceBadge = document.getElementById('confidence');
    confidenceBadge.textContent = `${estimation.confidence} confidence`;
    confidenceBadge.style.background = getConfidenceColor(estimation.confidence);
    
    // Display breakdown
    displayBreakdown(estimation.breakdown, estimation.totalScore);
    
    // Display text analysis
    displayTextAnalysis(estimation.analysis);
    
    // Display entities
    displayEntities(estimation.analysis.keyEntities);
    
    // Display insights
    displayInsights(estimation.insights);
}

// Display score breakdown
function displayBreakdown(breakdown, totalScore) {
    const breakdownDiv = document.getElementById('breakdown');
    breakdownDiv.innerHTML = '';
    
    const items = [
        { label: 'Complexity', value: breakdown.complexity },
        { label: 'Technical Debt', value: breakdown.technicalDebt },
        { label: 'Uncertainty', value: breakdown.uncertainty },
        { label: 'Length', value: breakdown.length },
        { label: 'Sentence Complexity', value: breakdown.sentenceComplexity },
        { label: 'Entity Score', value: breakdown.entityScore }
    ];
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'breakdown-item';
        itemDiv.innerHTML = `
            <span class="breakdown-label">${item.label}</span>
            <span class="breakdown-value">${item.value}</span>
        `;
        breakdownDiv.appendChild(itemDiv);
    });
    
    document.getElementById('totalScore').textContent = totalScore;
}

// Display text analysis
function displayTextAnalysis(analysis) {
    const analysisDiv = document.getElementById('textAnalysis');
    analysisDiv.innerHTML = '';
    
    const items = [
        { label: 'Word Count', value: analysis.wordCount },
        { label: 'Sentences', value: analysis.sentenceCount },
        { label: 'Avg Words/Sentence', value: analysis.avgWordsPerSentence }
    ];
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'analysis-item';
        itemDiv.innerHTML = `
            <span>${item.label}</span>
            <strong>${item.value}</strong>
        `;
        analysisDiv.appendChild(itemDiv);
    });
}

// Display key entities
function displayEntities(entities) {
    const entitiesDiv = document.getElementById('entities');
    entitiesDiv.innerHTML = '';
    
    // Display nouns
    if (entities.nouns && entities.nouns.length > 0) {
        const nounsDiv = document.createElement('div');
        nounsDiv.className = 'entity-group';
        nounsDiv.innerHTML = `
            <div class="entity-type">Nouns (Objects/Concepts)</div>
            <div class="entity-tags">
                ${entities.nouns.map(noun => `<span class="entity-tag">${noun}</span>`).join('')}
            </div>
        `;
        entitiesDiv.appendChild(nounsDiv);
    }
    
    // Display verbs
    if (entities.verbs && entities.verbs.length > 0) {
        const verbsDiv = document.createElement('div');
        verbsDiv.className = 'entity-group';
        verbsDiv.innerHTML = `
            <div class="entity-type">Verbs (Actions)</div>
            <div class="entity-tags">
                ${entities.verbs.map(verb => `<span class="entity-tag">${verb}</span>`).join('')}
            </div>
        `;
        entitiesDiv.appendChild(verbsDiv);
    }
    
    if (entities.nouns.length === 0 && entities.verbs.length === 0) {
        entitiesDiv.innerHTML = '<p style="color: var(--text-secondary);">No key entities detected</p>';
    }
}

// Display insights
function displayInsights(insights) {
    const insightsDiv = document.getElementById('insights');
    insightsDiv.innerHTML = '';
    
    if (insights && insights.length > 0) {
        const title = document.createElement('h3');
        title.textContent = '💡 Insights & Recommendations';
        insightsDiv.appendChild(title);
        
        insights.forEach(insight => {
            const insightDiv = document.createElement('div');
            insightDiv.className = `insight ${insight.type}`;
            
            const icon = getInsightIcon(insight.type);
            
            insightDiv.innerHTML = `
                <div class="insight-icon">${icon}</div>
                <div class="insight-content">
                    <div class="insight-type">${insight.type}</div>
                    <div>${insight.message}</div>
                </div>
            `;
            insightsDiv.appendChild(insightDiv);
        });
    }
}

// Batch estimation
async function estimateBatch() {
    const storiesText = batchStoriesInput.value.trim();
    
    if (!storiesText) {
        showError('Please enter stories in JSON format');
        return;
    }
    
    let stories;
    try {
        stories = JSON.parse(storiesText);
    } catch (error) {
        showError('Invalid JSON format. Please check your input.');
        return;
    }
    
    if (!Array.isArray(stories) || stories.length === 0) {
        showError('Please provide an array of stories');
        return;
    }
    
    // Disable button and show loading state
    batchEstimateBtn.disabled = true;
    batchEstimateBtn.innerHTML = '<span class="btn-icon">⏳</span> Estimating...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/estimate-batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stories })
        });
        
        if (!response.ok) {
            throw new Error('Failed to estimate stories');
        }
        
        const data = await response.json();
        displayBatchResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to estimate stories. Please try again.');
    } finally {
        // Re-enable button
        batchEstimateBtn.disabled = false;
        batchEstimateBtn.innerHTML = '<span class="btn-icon">📊</span> Estimate Batch';
    }
}

// Display batch results
function displayBatchResults(data) {
    batchResultsDiv.style.display = 'block';
    batchResultsDiv.innerHTML = '';
    
    // Display summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'batch-summary';
    summaryDiv.innerHTML = `
        <div class="summary-item">
            <div class="summary-label">Total Stories</div>
            <div class="summary-value">${data.summary.totalStories}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Total Points</div>
            <div class="summary-value">${data.summary.totalPoints}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Average Points</div>
            <div class="summary-value">${data.summary.averagePoints}</div>
        </div>
    `;
    batchResultsDiv.appendChild(summaryDiv);
    
    // Display individual stories
    data.estimations.forEach(story => {
        const storyDiv = document.createElement('div');
        storyDiv.className = 'batch-story';
        storyDiv.innerHTML = `
            <div class="batch-story-header">
                <span class="batch-story-id">${story.id}</span>
                <span class="batch-story-points">${story.estimation.storyPoints} pts</span>
            </div>
            <div class="batch-story-title">${story.title}</div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                Confidence: ${story.estimation.confidence} | 
                Total Score: ${story.estimation.totalScore}
            </div>
        `;
        batchResultsDiv.appendChild(storyDiv);
    });
    
    batchResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Helper functions
function getConfidenceColor(confidence) {
    switch (confidence) {
        case 'high':
            return 'rgba(16, 185, 129, 0.3)';
        case 'medium':
            return 'rgba(245, 158, 11, 0.3)';
        case 'low':
            return 'rgba(239, 68, 68, 0.3)';
        default:
            return 'rgba(255, 255, 255, 0.2)';
    }
}

function getInsightIcon(type) {
    switch (type) {
        case 'warning':
            return '⚠️';
        case 'info':
            return 'ℹ️';
        case 'suggestion':
            return '💡';
        default:
            return '📌';
    }
}

function showError(message) {
    alert(message);
}

function clearForm() {
    userStoryInput.value = '';
    resultsSection.style.display = 'none';
    userStoryInput.focus();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Story Point Estimator initialized');
    userStoryInput.focus();
});

// Made with Bob
