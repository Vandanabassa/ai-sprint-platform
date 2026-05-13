# Sprint Success Predictor

## Overview
The Sprint Success Predictor is a probability-based risk assessment tool that analyzes sprint data, team metrics, and historical performance to predict the likelihood of sprint success.

## Features

### 1. **Success Probability Calculation**
- Visual gauge showing success probability (0-100%)
- Color-coded risk levels (Low/Medium/High)
- Real-time risk score calculation

### 2. **Multi-Factor Risk Analysis**
The predictor evaluates five key risk categories:

#### Capacity vs Commitment (30% weight)
- Analyzes capacity utilization
- Flags over-commitment issues
- Optimal range: 70-85% utilization

#### Team Velocity Consistency (25% weight)
- Calculates coefficient of variation
- Identifies velocity patterns
- Requires 3+ historical sprints for analysis

#### Story Complexity & Uncertainty (20% weight)
- Evaluates large stories (8+ points)
- Assesses confidence levels
- Flags high-risk stories

#### Team Availability & Dependencies (15% weight)
- Monitors team availability percentage
- Tracks planned leave impact
- Optimal availability: 85%+

#### Dependencies & Blockers (10% weight)
- Counts external dependencies
- Tracks active blockers
- Flags coordination risks

### 3. **Actionable Recommendations**
- Critical alerts for high-risk sprints
- Specific action items for each risk factor
- Leverages team strengths

### 4. **Visual Analytics**
- Animated probability gauge
- Color-coded metrics cards
- Risk factor severity indicators
- Strength highlights

## How to Use

### Basic Usage
1. Navigate to the Success Predictor page
2. Enter sprint data:
   - Sprint capacity (story points)
   - Committed points
   - Dependencies and blockers
   - Stories breakdown (JSON format)
3. Add team metrics:
   - Team size
   - Average availability
   - Experience level
4. (Optional) Add historical velocity data
5. Click "Analyze Sprint Success Probability"

### Input Format

#### Stories JSON Format
```json
[
  {
    "id": "STORY-1",
    "title": "Feature name",
    "storyPoints": 5,
    "confidence": "high",
    "priority": "high"
  }
]
```

**Fields:**
- `id`: Story identifier
- `title`: Story description
- `storyPoints`: Estimated points (1, 2, 3, 5, 8, 13)
- `confidence`: Estimation confidence (high/medium/low)
- `priority`: Story priority (high/medium/low)

#### Historical Data JSON Format
```json
[
  {
    "sprint": 1,
    "committedPoints": 28,
    "completedPoints": 25
  }
]
```

**Fields:**
- `sprint`: Sprint number
- `committedPoints`: Points committed at sprint start
- `completedPoints`: Points actually completed

## API Endpoint

### POST `/api/predictor/analyze`

**Request Body:**
```json
{
  "sprintData": {
    "capacity": 30,
    "committedPoints": 28,
    "dependencies": 2,
    "blockers": 0,
    "stories": [...]
  },
  "teamMetrics": {
    "teamSize": 5,
    "averageAvailability": 85,
    "experienceLevel": "mid"
  },
  "historicalData": [...]
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "successProbability": 75,
    "riskScore": 25,
    "riskLevel": "Low Risk",
    "riskColor": "green",
    "riskFactors": [...],
    "strengths": [...],
    "recommendations": [...],
    "metrics": {
      "capacityUtilization": 93,
      "teamAvailability": 85,
      "complexityRatio": 40,
      "dependencies": 2,
      "blockers": 0
    }
  }
}
```

## Risk Levels

### Low Risk (0-34 points)
- ✅ Success probability: 66-100%
- 🟢 Green indicator
- Sprint is well-positioned for success

### Medium Risk (35-59 points)
- ⚠️ Success probability: 41-65%
- 🟠 Orange indicator
- Monitor closely and address risks proactively

### High Risk (60+ points)
- 🚨 Success probability: 0-40%
- 🔴 Red indicator
- Immediate intervention required

## Best Practices

1. **Regular Updates**: Run predictions at sprint planning and mid-sprint
2. **Historical Data**: Maintain 5+ sprints of history for accurate predictions
3. **Act on Recommendations**: Address high-impact risk factors first
4. **Team Collaboration**: Share predictions with the team for transparency
5. **Continuous Improvement**: Track prediction accuracy and adjust planning

## Example Scenarios

### Scenario 1: Over-Committed Sprint
- **Input**: 30 SP capacity, 35 SP committed
- **Result**: High risk (85% probability of failure)
- **Recommendation**: Reduce scope by 5-8 story points

### Scenario 2: Optimal Sprint
- **Input**: 30 SP capacity, 25 SP committed, consistent velocity
- **Result**: Low risk (85% probability of success)
- **Recommendation**: Maintain current practices

### Scenario 3: High Complexity
- **Input**: Multiple 8+ point stories, low confidence
- **Result**: Medium risk (60% probability of success)
- **Recommendation**: Break down large stories

## Integration with Other Tools

The Sprint Success Predictor integrates seamlessly with:
- **Story Estimator**: Use estimated story points as input
- **Capacity Calculator**: Import calculated capacity values
- **Velocity Tracker**: Leverage historical velocity data

## Troubleshooting

### Low Prediction Accuracy
- Add more historical sprint data (5+ sprints recommended)
- Ensure story estimates are accurate
- Update team availability regularly

### Missing Risk Factors
- Verify all input fields are filled
- Check JSON format for stories and history
- Ensure numerical values are within valid ranges

## Future Enhancements
- Machine learning-based predictions
- Integration with JIRA/Azure DevOps
- Team-specific calibration
- Sprint retrospective insights
- Automated alerts and notifications

---

**Made with ❤️ by Bob**