// API Configuration
const API_BASE_URL = window.location.origin;

// DOM Elements
const sprintCapacityInput = document.getElementById('sprintCapacity');
const committedPointsInput = document.getElementById('committedPoints');
const dependenciesInput = document.getElementById('dependencies');
const blockersInput = document.getElementById('blockers');
const sprintStoriesInput = document.getElementById('sprintStories');
const teamSizeInput = document.getElementById('teamSize');
const averageAvailabilityInput = document.getElementById('averageAvailability');
const experienceLevelInput = document.getElementById('experienceLevel');
const historicalDataInput = document.getElementById('historicalData');
const analyzePredictionBtn = document.getElementById('analyzePredictionBtn');
const predictionResultsDiv = document.getElementById('predictionResults');

// Event Listeners
analyzePredictionBtn.addEventListener('click', analyzePrediction);

// Initialize with example data
function initializeExampleData() {
    const exampleStories = [
        {
            id: "STORY-1",
            title: "User Authentication System",
            storyPoints: 5,
            confidence: "high",
            priority: "high"
        },
        {
            id: "STORY-2",
            title: "Database Migration",
            storyPoints: 8,
            confidence: "low",
            priority: "medium"
        },
        {
            id: "STORY-3",
            title: "UI Dashboard Updates",
            storyPoints: 3,
            confidence: "high",
            priority: "low"
        },
        {
            id: "STORY-4",
            title: "API Integration",
            storyPoints: 5,
            confidence: "medium",
            priority: "high"
        },
        {
            id: "STORY-5",
            title: "Bug Fixes",
            storyPoints: 2,
            confidence: "high",
            priority: "medium"
        }
    ];

    const exampleHistory = [
        { sprint: 1, committedPoints: 28, completedPoints: 25 },
        { sprint: 2, committedPoints: 30, completedPoints: 30 },
        { sprint: 3, committedPoints: 32, completedPoints: 28 },
        { sprint: 4, committedPoints: 30, completedPoints: 32 },
        { sprint: 5, committedPoints: 35, completedPoints: 33 }
    ];

    sprintStoriesInput.value = JSON.stringify(exampleStories, null, 2);
    historicalDataInput.value = JSON.stringify(exampleHistory, null, 2);
}

// Analyze prediction
async function analyzePrediction() {
    const capacity = parseInt(sprintCapacityInput.value);
    const committedPoints = parseInt(committedPointsInput.value);
    const dependencies = parseInt(dependenciesInput.value);
    const blockers = parseInt(blockersInput.value);

    // Parse stories
    let stories = [];
    const storiesText = sprintStoriesInput.value.trim();
    if (storiesText) {
        try {
            stories = JSON.parse(storiesText);
        } catch (error) {
            alert('Invalid JSON format for stories. Please check your input.');
            return;
        }
    }

    // Parse historical data
    let historicalData = [];
    const historyText = historicalDataInput.value.trim();
    if (historyText) {
        try {
            historicalData = JSON.parse(historyText);
        } catch (error) {
            alert('Invalid JSON format for historical data. Please check your input.');
            return;
        }
    }

    const requestData = {
        sprintData: {
            capacity,
            committedPoints,
            dependencies,
            blockers,
            stories
        },
        teamMetrics: {
            teamSize: parseInt(teamSizeInput.value),
            averageAvailability: parseInt(averageAvailabilityInput.value),
            experienceLevel: experienceLevelInput.value
        },
        historicalData
    };

    analyzePredictionBtn.disabled = true;
    analyzePredictionBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/predictor/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to analyze sprint prediction');
        }

        const data = await response.json();
        displayPredictionResults(data.prediction);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to analyze sprint prediction. Please try again.');
    } finally {
        analyzePredictionBtn.disabled = false;
        analyzePredictionBtn.innerHTML = '<span class="btn-icon">🎯</span> Analyze Sprint Success Probability';
    }
}

// Display prediction results
function displayPredictionResults(prediction) {
    predictionResultsDiv.style.display = 'block';
    predictionResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Update probability gauge
    updateProbabilityGauge(prediction.successProbability, prediction.riskColor);

    // Update risk level badge
    const riskBadge = document.getElementById('riskLevelBadge');
    riskBadge.textContent = prediction.riskLevel;
    riskBadge.className = 'risk-level-badge ' + prediction.riskColor;

    // Update metrics
    document.getElementById('capacityUtilization').textContent = prediction.metrics.capacityUtilization + '%';
    document.getElementById('teamAvailabilityMetric').textContent = prediction.metrics.teamAvailability + '%';
    document.getElementById('complexityRatio').textContent = prediction.metrics.complexityRatio + '%';
    document.getElementById('dependenciesMetric').textContent = prediction.metrics.dependencies + (prediction.metrics.blockers > 0 ? ` (${prediction.metrics.blockers} blockers)` : '');

    // Display risk factors
    displayRiskFactors(prediction.riskFactors);

    // Display strengths
    displayStrengths(prediction.strengths);

    // Display recommendations
    displayRecommendations(prediction.recommendations);
}

// Update probability gauge
function updateProbabilityGauge(probability, riskColor) {
    const probabilityValue = document.getElementById('probabilityValue');
    const gaugeProgress = document.getElementById('gaugeProgress');

    // Animate probability value
    animateValue(probabilityValue, 0, probability, 1500);

    // Update gauge color based on risk
    const colors = {
        green: '#27ae60',
        orange: '#f39c12',
        red: '#e74c3c'
    };
    const color = colors[riskColor] || colors.green;
    gaugeProgress.style.stroke = color;

    // Calculate stroke-dashoffset (251.2 is the total path length)
    const totalLength = 251.2;
    const offset = totalLength - (totalLength * probability / 100);

    // Animate gauge
    setTimeout(() => {
        gaugeProgress.style.strokeDashoffset = offset;
    }, 100);
}

// Animate number value
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + '%';
    }, 16);
}

// Display risk factors
function displayRiskFactors(riskFactors) {
    const riskSection = document.getElementById('riskFactorsSection');
    const riskList = document.getElementById('riskFactorsList');

    if (riskFactors.length === 0) {
        riskSection.style.display = 'none';
        return;
    }

    riskSection.style.display = 'block';
    riskList.innerHTML = '';

    riskFactors.forEach(risk => {
        const riskItem = document.createElement('div');
        riskItem.className = `risk-item ${risk.severity}`;
        riskItem.innerHTML = `
            <div class="risk-header">
                <span class="risk-category">${risk.category}</span>
                <span class="risk-severity ${risk.severity}">${risk.severity}</span>
            </div>
            <div class="risk-message">${risk.message}</div>
            <div class="risk-impact">Impact: ${risk.impact} points</div>
        `;
        riskList.appendChild(riskItem);
    });
}

// Display strengths
function displayStrengths(strengths) {
    const strengthsSection = document.getElementById('strengthsSection');
    const strengthsList = document.getElementById('strengthsList');

    if (strengths.length === 0) {
        strengthsSection.style.display = 'none';
        return;
    }

    strengthsSection.style.display = 'block';
    strengthsList.innerHTML = '';

    strengths.forEach(strength => {
        const strengthItem = document.createElement('div');
        strengthItem.className = 'strength-item';
        strengthItem.innerHTML = `
            <div class="strength-category">${strength.category}</div>
            <div class="strength-message">${strength.message}</div>
        `;
        strengthsList.appendChild(strengthItem);
    });
}

// Display recommendations
function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    recommendations.forEach(rec => {
        const recDiv = document.createElement('div');
        recDiv.className = `insight ${rec.type}`;

        const icon = rec.type === 'critical' ? '🚨' :
                    rec.type === 'warning' ? '⚠️' :
                    rec.type === 'action' ? '🎯' :
                    rec.type === 'success' ? '✅' :
                    rec.type === 'info' ? 'ℹ️' : '💡';

        recDiv.innerHTML = `
            <div class="insight-icon">${icon}</div>
            <div class="insight-content">
                <div class="insight-type">${rec.type}</div>
                <div>${rec.message}</div>
            </div>
        `;
        recommendationsList.appendChild(recDiv);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sprint Success Predictor initialized');
    initializeExampleData();
});

// Made with Bob