// API Configuration
const API_BASE_URL = window.location.origin;

// DOM Elements
const sprintHistoryInput = document.getElementById('sprintHistoryInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadExampleBtn = document.getElementById('loadExampleBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const analyticsResults = document.getElementById('analyticsResults');

// Event Listeners
analyzeBtn.addEventListener('click', analyzeSprintHistory);
loadExampleBtn.addEventListener('click', loadExampleData);
clearDataBtn.addEventListener('click', clearData);

// Load Example Data
function loadExampleData() {
    const exampleData = [
        {
            sprint: 1,
            committedPoints: 28,
            completedPoints: 25,
            storiesCompleted: 12,
            storiesCarriedOver: 2,
            carryoverPoints: 3,
            date: "2024-01-15"
        },
        {
            sprint: 2,
            committedPoints: 30,
            completedPoints: 30,
            storiesCompleted: 15,
            storiesCarriedOver: 0,
            carryoverPoints: 0,
            date: "2024-01-29"
        },
        {
            sprint: 3,
            committedPoints: 32,
            completedPoints: 28,
            storiesCompleted: 14,
            storiesCarriedOver: 3,
            carryoverPoints: 4,
            date: "2024-02-12"
        },
        {
            sprint: 4,
            committedPoints: 30,
            completedPoints: 32,
            storiesCompleted: 16,
            storiesCarriedOver: 0,
            carryoverPoints: 0,
            date: "2024-02-26"
        },
        {
            sprint: 5,
            committedPoints: 35,
            completedPoints: 33,
            storiesCompleted: 17,
            storiesCarriedOver: 1,
            carryoverPoints: 2,
            date: "2024-03-11"
        },
        {
            sprint: 6,
            committedPoints: 33,
            completedPoints: 35,
            storiesCompleted: 18,
            storiesCarriedOver: 0,
            carryoverPoints: 0,
            date: "2024-03-25"
        }
    ];
    
    sprintHistoryInput.value = JSON.stringify(exampleData, null, 2);
}

// Clear Data
function clearData() {
    sprintHistoryInput.value = '';
    analyticsResults.style.display = 'none';
}

// Analyze Sprint History
async function analyzeSprintHistory() {
    const historyText = sprintHistoryInput.value.trim();
    
    if (!historyText) {
        alert('Please enter sprint history data');
        return;
    }
    
    let sprintHistory;
    try {
        sprintHistory = JSON.parse(historyText);
    } catch (error) {
        alert('Invalid JSON format. Please check your input.');
        return;
    }
    
    if (!Array.isArray(sprintHistory) || sprintHistory.length === 0) {
        alert('Sprint history must be a non-empty array');
        return;
    }
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
    
    try {
        // Get analytics overview
        const overviewResponse = await fetch(`${API_BASE_URL}/api/analytics/overview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sprintHistory })
        });
        
        if (!overviewResponse.ok) {
            throw new Error('Failed to get analytics overview');
        }
        
        const overviewData = await overviewResponse.json();
        
        // Get sprint metrics
        const metricsResponse = await fetch(`${API_BASE_URL}/api/analytics/sprint-metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sprintHistory })
        });
        
        if (!metricsResponse.ok) {
            throw new Error('Failed to get sprint metrics');
        }
        
        const metricsData = await metricsResponse.json();
        
        // Display results
        displayAnalytics(overviewData.analytics, metricsData.metrics);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze sprint history. Please try again.');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="btn-icon">📊</span> Analyze Sprint History';
    }
}

// Display Analytics
function displayAnalytics(analytics, metrics) {
    analyticsResults.style.display = 'block';
    analyticsResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Update overview metrics
    document.getElementById('avgVelocity').textContent = analytics.velocity.average;
    document.getElementById('avgAccuracy').textContent = analytics.commitment.accuracy;
    document.getElementById('successRate').textContent = analytics.performance.successRate;
    document.getElementById('avgThroughput').textContent = analytics.throughput.average;
    
    // Update velocity trend
    const trendElement = document.getElementById('velocityTrend');
    trendElement.textContent = analytics.velocity.trend.toUpperCase();
    trendElement.className = `metric-trend ${analytics.velocity.trend}`;
    
    // Update velocity statistics
    document.getElementById('maxVelocity').textContent = analytics.velocity.max + ' SP';
    document.getElementById('minVelocity').textContent = analytics.velocity.min + ' SP';
    document.getElementById('stdDeviation').textContent = analytics.velocity.standardDeviation;
    
    const predictabilityElement = document.getElementById('predictability');
    predictabilityElement.textContent = analytics.velocity.predictability.toUpperCase();
    predictabilityElement.className = 'stat-value ' + 
        (analytics.velocity.predictability === 'high' ? 'high' : 
         analytics.velocity.predictability === 'medium' ? 'medium' : 'low');
    
    document.getElementById('totalSprints').textContent = analytics.totalSprints;
    document.getElementById('successfulSprints').textContent = 
        `${analytics.performance.successfulSprints} / ${analytics.totalSprints}`;
    
    // Render charts
    renderVelocityChart(metrics);
    renderAccuracyChart(metrics);
    
    // Render metrics table
    renderMetricsTable(metrics);
    
    // Display recommendations
    displayRecommendations(analytics.recommendations);
}

// Render Velocity Chart
function renderVelocityChart(metrics) {
    const canvas = document.getElementById('velocityChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Get data
    const sprints = metrics.map(m => `Sprint ${m.sprint}`);
    const committed = metrics.map(m => m.committedPoints);
    const completed = metrics.map(m => m.completedPoints);
    
    const maxValue = Math.max(...committed, ...completed);
    const yScale = chartHeight / maxValue;
    const xStep = chartWidth / (metrics.length - 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = Math.round(maxValue - (maxValue / 5) * i);
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 10, y + 4);
    }
    
    // Draw committed line
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    committed.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = padding + chartHeight - (value * yScale);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw committed points
    committed.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = padding + chartHeight - (value * yScale);
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw completed line
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 3;
    ctx.beginPath();
    completed.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = padding + chartHeight - (value * yScale);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw completed points
    completed.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = padding + chartHeight - (value * yScale);
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    sprints.forEach((label, index) => {
        const x = padding + xStep * index;
        ctx.fillText(label, x, canvas.height - padding + 20);
    });
}

// Render Accuracy Chart
function renderAccuracyChart(metrics) {
    const canvas = document.getElementById('accuracyChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Get data
    const sprints = metrics.map(m => `S${m.sprint}`);
    const accuracies = metrics.map(m => m.accuracy);
    
    const barWidth = chartWidth / metrics.length * 0.7;
    const barSpacing = chartWidth / metrics.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = 100 - (100 / 5) * i;
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(value + '%', padding - 10, y + 4);
    }
    
    // Draw reference lines
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const excellentY = padding + chartHeight * 0.05; // 95%
    ctx.beginPath();
    ctx.moveTo(padding, excellentY);
    ctx.lineTo(canvas.width - padding, excellentY);
    ctx.stroke();
    
    ctx.strokeStyle = '#f39c12';
    const goodY = padding + chartHeight * 0.2; // 80%
    ctx.beginPath();
    ctx.moveTo(padding, goodY);
    ctx.lineTo(canvas.width - padding, goodY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw bars
    accuracies.forEach((accuracy, index) => {
        const x = padding + barSpacing * index + (barSpacing - barWidth) / 2;
        const barHeight = (accuracy / 100) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        // Determine color based on accuracy
        let color;
        if (accuracy >= 95) {
            color = '#27ae60';
        } else if (accuracy >= 80) {
            color = '#f39c12';
        } else {
            color = '#e74c3c';
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(accuracy + '%', x + barWidth / 2, y - 5);
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    sprints.forEach((label, index) => {
        const x = padding + barSpacing * index + barSpacing / 2;
        ctx.fillText(label, x, canvas.height - padding + 20);
    });
}

// Render Metrics Table
function renderMetricsTable(metrics) {
    const tbody = document.getElementById('metricsTableBody');
    tbody.innerHTML = '';
    
    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Sprint ${metric.sprint}</strong></td>
            <td>${metric.committedPoints} SP</td>
            <td>${metric.completedPoints} SP</td>
            <td>${metric.accuracy}%</td>
            <td>${metric.storiesCompleted}</td>
            <td>${metric.carryoverPoints} SP (${metric.storiesCarriedOver} stories)</td>
            <td><span class="status-badge ${metric.success ? 'success' : 'failed'}">
                ${metric.success ? '✅ Success' : '❌ Failed'}
            </span></td>
        `;
        tbody.appendChild(row);
    });
}

// Display Recommendations
function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    recommendations.forEach(rec => {
        const recDiv = document.createElement('div');
        recDiv.className = `insight ${rec.type}`;
        
        const icon = rec.type === 'critical' ? '🚨' :
                    rec.type === 'warning' ? '⚠️' :
                    rec.type === 'success' ? '✅' :
                    rec.type === 'info' ? 'ℹ️' : '💡';
        
        recDiv.innerHTML = `
            <div class="insight-icon">${icon}</div>
            <div class="insight-content">
                <div class="insight-type">${rec.category}</div>
                <div>${rec.message}</div>
            </div>
        `;
        recommendationsList.appendChild(recDiv);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Historical Analytics Dashboard initialized');
});

// Made with Bob