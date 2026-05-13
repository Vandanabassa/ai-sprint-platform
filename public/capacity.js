// API Configuration
const API_BASE_URL = window.location.origin;

// State
let teamMembers = [];
let plannedLeave = [];
let memberIdCounter = 1;
let leaveIdCounter = 1;

// DOM Elements
const sprintDurationInput = document.getElementById('sprintDuration');
const focusFactorInput = document.getElementById('focusFactor');
const workingHoursPerDayInput = document.getElementById('workingHoursPerDay');
const bufferPercentageInput = document.getElementById('bufferPercentage');
const holidaysInput = document.getElementById('holidays');
const teamMembersDiv = document.getElementById('teamMembers');
const plannedLeaveDiv = document.getElementById('plannedLeave');
const addMemberBtn = document.getElementById('addMemberBtn');
const addLeaveBtn = document.getElementById('addLeaveBtn');
const calculateCapacityBtn = document.getElementById('calculateCapacityBtn');
const capacityResultsDiv = document.getElementById('capacityResults');
const sprintStoriesInput = document.getElementById('sprintStories');
const planSprintBtn = document.getElementById('planSprintBtn');
const sprintPlanResultsDiv = document.getElementById('sprintPlanResults');
const velocityHistoryInput = document.getElementById('velocityHistory');
const analyzeVelocityBtn = document.getElementById('analyzeVelocityBtn');
const velocityResultsDiv = document.getElementById('velocityResults');

// Event Listeners
addMemberBtn.addEventListener('click', addTeamMember);
addLeaveBtn.addEventListener('click', addPlannedLeave);
calculateCapacityBtn.addEventListener('click', calculateCapacity);
planSprintBtn.addEventListener('click', planSprint);
analyzeVelocityBtn.addEventListener('click', analyzeVelocity);

// Initialize with default team members
function initializeDefaultTeam() {
    addTeamMember('Alice Johnson', 'Developer', 1.0, 4);
    addTeamMember('Bob Smith', 'Developer', 1.0, 4);
    addTeamMember('Carol Davis', 'QA Engineer', 0.8, 5);
}

// Add team member
function addTeamMember(name = '', role = 'Developer', availability = 1.0, hoursPerPoint = 4) {
    const memberId = memberIdCounter++;
    const member = {
        id: memberId,
        name: name || `Team Member ${memberId}`,
        role,
        availability,
        hoursPerPoint
    };
    
    teamMembers.push(member);
    renderTeamMembers();
}

// Remove team member
function removeTeamMember(memberId) {
    teamMembers = teamMembers.filter(m => m.id !== memberId);
    renderTeamMembers();
}

// Render team members
function renderTeamMembers() {
    teamMembersDiv.innerHTML = '';
    
    teamMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member-card';
        memberCard.innerHTML = `
            <div class="member-header">
                <div class="member-title">👤 ${member.name}</div>
                <button class="remove-btn" onclick="removeTeamMember(${member.id})">Remove</button>
            </div>
            <div class="member-fields">
                <div class="config-item">
                    <label>Name</label>
                    <input type="text" value="${member.name}" 
                           onchange="updateMember(${member.id}, 'name', this.value)">
                </div>
                <div class="config-item">
                    <label>Role</label>
                    <input type="text" value="${member.role}" 
                           onchange="updateMember(${member.id}, 'role', this.value)">
                </div>
                <div class="config-item">
                    <label>Availability (0-1)</label>
                    <input type="number" value="${member.availability}" step="0.1" min="0" max="1"
                           onchange="updateMember(${member.id}, 'availability', parseFloat(this.value))">
                    <small>${Math.round(member.availability * 100)}% available</small>
                </div>
                <div class="config-item">
                    <label>Hours per Story Point</label>
                    <input type="number" value="${member.hoursPerPoint}" min="1" max="20"
                           onchange="updateMember(${member.id}, 'hoursPerPoint', parseInt(this.value))">
                </div>
            </div>
        `;
        teamMembersDiv.appendChild(memberCard);
    });
}

// Update team member
function updateMember(memberId, field, value) {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
        member[field] = value;
        renderTeamMembers();
    }
}

// Add planned leave
function addPlannedLeave(memberName = '', days = 0) {
    const leaveId = leaveIdCounter++;
    const leave = {
        id: leaveId,
        memberName: memberName || '',
        days: days || 0
    };
    
    plannedLeave.push(leave);
    renderPlannedLeave();
}

// Remove planned leave
function removePlannedLeave(leaveId) {
    plannedLeave = plannedLeave.filter(l => l.id !== leaveId);
    renderPlannedLeave();
}

// Render planned leave
function renderPlannedLeave() {
    plannedLeaveDiv.innerHTML = '';
    
    plannedLeave.forEach(leave => {
        const leaveCard = document.createElement('div');
        leaveCard.className = 'leave-card';
        leaveCard.innerHTML = `
            <div class="leave-header">
                <div class="member-title">🏖️ Planned Leave</div>
                <button class="remove-btn" onclick="removePlannedLeave(${leave.id})">Remove</button>
            </div>
            <div class="leave-fields">
                <div class="config-item">
                    <label>Team Member Name</label>
                    <input type="text" value="${leave.memberName}" 
                           onchange="updateLeave(${leave.id}, 'memberName', this.value)"
                           placeholder="Enter member name">
                </div>
                <div class="config-item">
                    <label>Days</label>
                    <input type="number" value="${leave.days}" min="0" max="30"
                           onchange="updateLeave(${leave.id}, 'days', parseInt(this.value))">
                </div>
            </div>
        `;
        plannedLeaveDiv.appendChild(leaveCard);
    });
}

// Update planned leave
function updateLeave(leaveId, field, value) {
    const leave = plannedLeave.find(l => l.id === leaveId);
    if (leave) {
        leave[field] = value;
        renderPlannedLeave();
    }
}

// Calculate capacity
async function calculateCapacity() {
    if (teamMembers.length === 0) {
        alert('Please add at least one team member');
        return;
    }
    
    const sprintDuration = parseInt(sprintDurationInput.value);
    const focusFactor = parseFloat(focusFactorInput.value) / 100;
    const workingHoursPerDay = parseInt(workingHoursPerDayInput.value);
    const holidays = parseInt(holidaysInput.value);
    
    const requestData = {
        teamMembers: teamMembers.map(m => ({
            id: m.id,
            name: m.name,
            role: m.role,
            availability: m.availability,
            hoursPerPoint: m.hoursPerPoint
        })),
        sprintDuration,
        holidays: Array(holidays).fill(null),
        plannedLeave: plannedLeave.map(l => ({
            memberName: l.memberName,
            days: l.days
        })),
        focusFactor,
        workingHoursPerDay
    };
    
    calculateCapacityBtn.disabled = true;
    calculateCapacityBtn.innerHTML = '<span class="btn-icon">⏳</span> Calculating...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/capacity/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to calculate capacity');
        }
        
        const data = await response.json();
        displayCapacityResults(data.capacity);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate capacity. Please try again.');
    } finally {
        calculateCapacityBtn.disabled = false;
        calculateCapacityBtn.innerHTML = '<span class="btn-icon">🧮</span> Calculate Sprint Capacity';
    }
}

// Display capacity results
function displayCapacityResults(capacity) {
    capacityResultsDiv.style.display = 'block';
    capacityResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    document.getElementById('totalCapacity').textContent = capacity.totalCapacity;
    document.getElementById('totalHours').textContent = capacity.totalHours;
    document.getElementById('teamSize').textContent = capacity.teamSize;
    document.getElementById('avgCapacity').textContent = capacity.averageCapacityPerMember;
    
    // Display member capacities table
    const tableDiv = document.getElementById('memberCapacitiesTable');
    tableDiv.innerHTML = `
        <table class="capacity-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Availability</th>
                    <th>Working Days</th>
                    <th>Effective Hours</th>
                    <th>Capacity (SP)</th>
                </tr>
            </thead>
            <tbody>
                ${capacity.memberCapacities.map(m => `
                    <tr>
                        <td><strong>${m.name}</strong></td>
                        <td>${m.role}</td>
                        <td>${m.availability}%</td>
                        <td>${m.workingDays}</td>
                        <td>${m.effectiveHours}h</td>
                        <td><strong>${m.capacity} SP</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Display recommendations
    displayInsights(capacity.recommendations, 'capacityRecommendations');
}

// Plan sprint
async function planSprint() {
    if (teamMembers.length === 0) {
        alert('Please add team members and calculate capacity first');
        return;
    }
    
    const storiesText = sprintStoriesInput.value.trim();
    if (!storiesText) {
        alert('Please enter stories in JSON format');
        return;
    }
    
    let stories;
    try {
        stories = JSON.parse(storiesText);
    } catch (error) {
        alert('Invalid JSON format. Please check your input.');
        return;
    }
    
    const sprintDuration = parseInt(sprintDurationInput.value);
    const focusFactor = parseFloat(focusFactorInput.value) / 100;
    const workingHoursPerDay = parseInt(workingHoursPerDayInput.value);
    const holidays = parseInt(holidaysInput.value);
    const bufferPercentage = parseFloat(bufferPercentageInput.value) / 100;
    
    const requestData = {
        teamMembers: teamMembers.map(m => ({
            id: m.id,
            name: m.name,
            role: m.role,
            availability: m.availability,
            hoursPerPoint: m.hoursPerPoint
        })),
        sprintDuration,
        stories,
        holidays: Array(holidays).fill(null),
        plannedLeave: plannedLeave.map(l => ({
            memberName: l.memberName,
            days: l.days
        })),
        focusFactor,
        workingHoursPerDay,
        bufferPercentage
    };
    
    planSprintBtn.disabled = true;
    planSprintBtn.innerHTML = '<span class="btn-icon">⏳</span> Planning...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/capacity/plan-sprint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to plan sprint');
        }
        
        const data = await response.json();
        displaySprintPlan(data);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to plan sprint. Please try again.');
    } finally {
        planSprintBtn.disabled = false;
        planSprintBtn.innerHTML = '<span class="btn-icon">📋</span> Plan Sprint';
    }
}

// Display sprint plan
function displaySprintPlan(data) {
    sprintPlanResultsDiv.style.display = 'block';
    sprintPlanResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    const { capacity, sprintPlan, bufferPercentage, availableCapacity } = data;
    
    sprintPlanResultsDiv.innerHTML = `
        <h3>Sprint Plan Summary</h3>
        <div class="plan-summary">
            <div class="plan-summary-item">
                <div class="plan-summary-label">Total Capacity</div>
                <div class="plan-summary-value">${capacity.totalCapacity}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Available (${Math.round(bufferPercentage * 100)}% buffer)</div>
                <div class="plan-summary-value">${availableCapacity}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Committed</div>
                <div class="plan-summary-value">${sprintPlan.committedPoints}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Utilization</div>
                <div class="plan-summary-value">${sprintPlan.utilizationRate}%</div>
            </div>
        </div>
        
        <div class="stories-section">
            <h3>✅ Committed Stories (${sprintPlan.committedStories})</h3>
            <div class="stories-grid">
                ${sprintPlan.committed.map(story => `
                    <div class="story-card committed">
                        <div class="story-header">
                            <span class="story-id">${story.id}</span>
                            <span class="story-points-badge">${story.estimation.storyPoints} SP</span>
                        </div>
                        <div class="story-title">${story.title}</div>
                        <div class="story-meta">
                            <span class="priority-badge ${story.priority}">${story.priority}</span>
                            <span class="confidence-badge ${story.estimation.confidence}">${story.estimation.confidence} confidence</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${sprintPlan.backlog.length > 0 ? `
            <div class="stories-section">
                <h3>📋 Backlog (${sprintPlan.backlogStories})</h3>
                <div class="stories-grid">
                    ${sprintPlan.backlog.map(story => `
                        <div class="story-card backlog">
                            <div class="story-header">
                                <span class="story-id">${story.id}</span>
                                <span class="story-points-badge">${story.estimation.storyPoints} SP</span>
                            </div>
                            <div class="story-title">${story.title}</div>
                            <div class="story-meta">
                                <span class="priority-badge ${story.priority}">${story.priority}</span>
                                <span class="confidence-badge ${story.estimation.confidence}">${story.estimation.confidence} confidence</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    // Display recommendations
    const recommendationsDiv = document.createElement('div');
    recommendationsDiv.className = 'insights-section';
    displayInsights(sprintPlan.recommendations, recommendationsDiv);
    sprintPlanResultsDiv.appendChild(recommendationsDiv);
}

// Analyze velocity
async function analyzeVelocity() {
    const historyText = velocityHistoryInput.value.trim();
    if (!historyText) {
        alert('Please enter sprint history in JSON format');
        return;
    }
    
    let sprintHistory;
    try {
        sprintHistory = JSON.parse(historyText);
    } catch (error) {
        alert('Invalid JSON format. Please check your input.');
        return;
    }
    
    analyzeVelocityBtn.disabled = true;
    analyzeVelocityBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/capacity/velocity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sprintHistory })
        });
        
        if (!response.ok) {
            throw new Error('Failed to analyze velocity');
        }
        
        const data = await response.json();
        displayVelocityAnalysis(data.velocityAnalysis);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze velocity. Please try again.');
    } finally {
        analyzeVelocityBtn.disabled = false;
        analyzeVelocityBtn.innerHTML = '<span class="btn-icon">📈</span> Analyze Velocity';
    }
}

// Display velocity analysis
function displayVelocityAnalysis(analysis) {
    velocityResultsDiv.style.display = 'block';
    velocityResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    const trendIcon = analysis.trend === 'increasing' ? '📈' : 
                     analysis.trend === 'decreasing' ? '📉' : '➡️';
    
    velocityResultsDiv.innerHTML = `
        <h3>Velocity Analysis</h3>
        <div class="velocity-summary">
            <div class="plan-summary-item">
                <div class="plan-summary-label">Average Velocity</div>
                <div class="plan-summary-value">${analysis.average}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Max Velocity</div>
                <div class="plan-summary-value">${analysis.max}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Min Velocity</div>
                <div class="plan-summary-value">${analysis.min}</div>
            </div>
            <div class="plan-summary-item">
                <div class="plan-summary-label">Std Deviation</div>
                <div class="plan-summary-value">${analysis.standardDeviation}</div>
            </div>
        </div>
        
        <div class="velocity-chart">
            <h4>Velocity Trend</h4>
            <div style="margin-bottom: 1rem;">
                <span class="trend-indicator ${analysis.trend}">
                    ${trendIcon} ${analysis.trend.toUpperCase()}
                </span>
                <span class="predictability-indicator ${analysis.predictability}" style="margin-left: 1rem;">
                    ${analysis.predictability.toUpperCase()} Predictability
                </span>
            </div>
            <div class="chart-bars">
                ${analysis.velocityData.map((velocity, index) => {
                    const height = (velocity / analysis.max) * 100;
                    return `
                        <div class="chart-bar" style="height: ${height}%">
                            <div class="chart-bar-value">${velocity}</div>
                            <div class="chart-bar-label">Sprint ${index + 1}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Display recommendations
    const recommendationsDiv = document.createElement('div');
    recommendationsDiv.className = 'insights-section';
    displayInsights(analysis.recommendations, recommendationsDiv);
    velocityResultsDiv.appendChild(recommendationsDiv);
}

// Display insights
function displayInsights(insights, containerId) {
    const container = typeof containerId === 'string' 
        ? document.getElementById(containerId) 
        : containerId;
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (insights && insights.length > 0) {
        const title = document.createElement('h3');
        title.textContent = '💡 Recommendations';
        container.appendChild(title);
        
        insights.forEach(insight => {
            const insightDiv = document.createElement('div');
            insightDiv.className = `insight ${insight.type}`;
            
            const icon = insight.type === 'warning' ? '⚠️' : 
                        insight.type === 'info' ? 'ℹ️' : 
                        insight.type === 'success' ? '✅' : '💡';
            
            insightDiv.innerHTML = `
                <div class="insight-icon">${icon}</div>
                <div class="insight-content">
                    <div class="insight-type">${insight.type}</div>
                    <div>${insight.message}</div>
                </div>
            `;
            container.appendChild(insightDiv);
        });
    }
}

// Make functions globally accessible
window.removeTeamMember = removeTeamMember;
window.updateMember = updateMember;
window.removePlannedLeave = removePlannedLeave;
window.updateLeave = updateLeave;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sprint Capacity Calculator initialized');
    initializeDefaultTeam();
});

// Made with Bob
