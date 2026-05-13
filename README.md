# 🤖 AI Sprint Platform

A comprehensive agile planning platform powered by AI and Natural Language Processing, featuring story point estimation, sprint capacity planning, and success prediction.

## ✨ Features

### 📊 Story Point Estimator
- **Instant Estimation**: Get story point estimates in seconds using advanced NLP analysis
- **Comprehensive Analysis**:
  - Complexity scoring based on technical keywords
  - Technical debt detection
  - Uncertainty identification
  - Entity extraction (nouns and verbs)
  - Sentence complexity analysis
- **Confidence Levels**: High, medium, or low confidence ratings for each estimate
- **Actionable Insights**: Receive recommendations and warnings based on story content
- **Batch Processing**: Estimate multiple stories at once via JSON input

### 📈 Sprint Capacity Calculator
- **Team Capacity Planning**: Calculate sprint capacity based on team size, availability, and working hours
- **Automated Sprint Planning**: Automatically assign stories to sprints based on capacity
- **Velocity Tracking**: Analyze team velocity trends over multiple sprints
- **Holiday & Leave Management**: Account for holidays and planned leave in capacity calculations
- **Focus Factor**: Adjust for meetings, interruptions, and non-development work
- **Individual Capacity Tracking**: Monitor capacity for each team member
- **Smart Recommendations**: Get insights on sprint planning and capacity utilization

### 🎯 Sprint Success Predictor (NEW!)
- **Probability-Based Risk Assessment**: Predict sprint success likelihood with 0-100% probability
- **Multi-Factor Analysis**: Evaluates 5 key risk categories:
  - Capacity vs Commitment (30% weight)
  - Team Velocity Consistency (25% weight)
  - Story Complexity & Uncertainty (20% weight)
  - Team Availability (15% weight)
  - Dependencies & Blockers (10% weight)
- **Visual Analytics**: Animated probability gauge with color-coded risk levels
- **Risk Factor Identification**: Detailed breakdown of risks with severity ratings
- **Actionable Recommendations**: Specific action items to improve sprint success
- **Historical Analysis**: Leverage past sprint data for better predictions
- **Strength Recognition**: Highlights positive team indicators

### 🎨 User Interface
- **Beautiful UI**: Modern, responsive interface with gradient design
- **Triple Navigation**: Easy switching between Story Estimator, Capacity Calculator, and Success Predictor
- **Real-time Calculations**: Instant feedback on all operations
- **Interactive Charts**: Visual velocity trends, capacity breakdowns, and probability gauges

### 🌐 RESTful API
- **Easy Integration**: RESTful API for all features
- **Comprehensive Endpoints**: Story estimation, capacity calculation, sprint planning, velocity analysis, and success prediction

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-sprint-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

### Story Point Estimator (index.html)

1. **Single Story Estimation**:
   - Enter your user story in the text area
   - Click "Estimate Story Points"
   - View detailed analysis and recommendations

2. **Quick Examples**:
   - Click on example buttons to load pre-defined stories
   - Modify as needed and estimate

3. **Batch Estimation**:
   - Scroll to the "Batch Estimation" section
   - Enter stories in JSON format
   - Click "Estimate Batch" to process multiple stories

### Sprint Capacity Calculator (capacity.html)

1. **Configure Team**:
   - Add team members with their roles and availability
   - Set sprint duration, focus factor, and working hours
   - Add holidays and planned leave

2. **Calculate Capacity**:
   - Click "Calculate Sprint Capacity"
   - View total capacity and individual member capacities
   - Review recommendations

3. **Plan Sprint**:
   - Enter stories in JSON format
   - Click "Plan Sprint"
   - View committed stories and backlog
   - See utilization rate and recommendations

4. **Analyze Velocity**:
   - Enter sprint history in JSON format
   - Click "Analyze Velocity"
   - View velocity trends and predictability
   - Get recommendations for improvement

### API Endpoints

#### Estimate Single Story

```bash
POST /api/estimate
Content-Type: application/json

{
  "userStory": "As a user, I want to integrate OAuth authentication..."
}
```

**Response:**
```json
{
  "success": true,
  "estimation": {
    "storyPoints": 5,
    "confidence": "medium",
    "totalScore": 18,
    "breakdown": {
      "complexity": 6,
      "technicalDebt": 0,
      "uncertainty": 0,
      "length": 3,
      "sentenceComplexity": 2,
      "entityScore": 4
    },
    "insights": [...],
    "analysis": {
      "wordCount": 25,
      "sentenceCount": 2,
      "avgWordsPerSentence": 12.5,
      "keyEntities": {
        "nouns": ["user", "OAuth", "authentication"],
        "verbs": ["integrate", "want"]
      }
    }
  }
}
```

#### Estimate Multiple Stories

```bash
POST /api/estimate-batch
Content-Type: application/json

{
  "stories": [
    {
      "id": "STORY-1",
      "title": "User Authentication",
      "description": "Implement OAuth login"
    },
    {
      "id": "STORY-2",
      "title": "Bug Fix",
      "description": "Fix button alignment"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "estimations": [...],
  "summary": {
    "totalStories": 2,
    "totalPoints": 8,
    "averagePoints": 4
  }
}
```

#### Health Check

```bash
GET /api/health

#### Calculate Sprint Capacity

```bash
POST /api/capacity/calculate
Content-Type: application/json

{
  "teamMembers": [
    {
      "id": 1,
      "name": "Alice",
      "role": "Developer",
      "availability": 1.0,
      "hoursPerPoint": 4
    }
  ],
  "sprintDuration": 10,
  "holidays": [],
  "plannedLeave": [],
  "focusFactor": 0.7,
  "workingHoursPerDay": 8
}
```

#### Plan Sprint

```bash
POST /api/capacity/plan-sprint
Content-Type: application/json

{
  "teamMembers": [...],
  "sprintDuration": 10,
  "stories": [...],
  "focusFactor": 0.7,
  "bufferPercentage": 0.2
}
```

#### Analyze Velocity

```bash
POST /api/capacity/velocity
Content-Type: application/json

{
  "sprintHistory": [
    { "sprint": 1, "completedPoints": 25 },
    { "sprint": 2, "completedPoints": 30 }
  ]
}
```

For complete API documentation, see [API.md](API.md).
```

## 🧠 How It Works

The AI Story Point Estimator uses multiple NLP techniques to analyze user stories:

1. **Tokenization**: Breaks down text into individual words
2. **Keyword Analysis**: Identifies complexity indicators (high, medium, low)
3. **Technical Debt Detection**: Flags legacy code and refactoring needs
4. **Uncertainty Detection**: Identifies unclear requirements
5. **Entity Extraction**: Extracts key nouns (objects) and verbs (actions)
6. **Sentence Complexity**: Analyzes sentence structure and length
7. **Scoring Algorithm**: Combines all factors into a Fibonacci story point estimate

### Complexity Indicators

**High Complexity** (3 points each):
- complex, integration, migration, refactor, architecture
- security, performance, optimization, algorithm
- database, api, authentication, authorization, encryption, scalability

**Medium Complexity** (2 points each):
- update, modify, enhance, improve, add
- implement, create, develop, design, test, validate, configure

**Low Complexity** (1 point each):
- fix, bug, typo, text, label, color
- style, css, ui, button, link, simple

### Story Point Mapping

| Total Score | Story Points | Confidence |
|-------------|--------------|------------|
| 0-5         | 1            | High       |
| 6-10        | 2            | High       |
| 11-15       | 3            | Medium     |
| 16-20       | 5            | Medium     |
| 21-25       | 8            | Low        |
| 26+         | 13           | Low        |

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restarts on file changes.

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
ai-sprint-platform/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── app.js          # Frontend JavaScript
├── server.js           # Express server & NLP logic
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## 🔧 Configuration

Edit `.env` file to customize:

```env
PORT=3000                    # Server port
NODE_ENV=development         # Environment
API_VERSION=1.0.0           # API version
```

## 🎯 Use Cases

- **Sprint Planning**: Quickly estimate stories during planning sessions
- **Backlog Refinement**: Pre-estimate stories before refinement meetings
- **Capacity Planning**: Calculate team velocity and sprint capacity
- **Story Writing**: Get feedback on story complexity while writing
- **Training**: Help new team members understand estimation factors

## 🚧 Future Enhancements

- [ ] Machine learning model training on historical data
- [ ] Integration with Jira, Azure DevOps, GitHub Issues
- [ ] Team-specific calibration and customization
- [ ] Historical estimation accuracy tracking
- [ ] Multi-language support
- [ ] Export reports to PDF/CSV
- [ ] Real-time collaboration features
- [ ] OpenAI GPT integration for enhanced analysis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Natural](https://github.com/NaturalNode/natural) - NLP library for Node.js
- Uses [Compromise](https://github.com/spencermountain/compromise) for text analysis
- Inspired by agile estimation best practices

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for Agile Teams**