const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const natural = require('natural');
const compromise = require('compromise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// NLP Setup
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Complexity keywords and their weights
const complexityIndicators = {
  high: ['complex', 'integration', 'migration', 'refactor', 'architecture', 'security', 'performance', 'optimization', 'algorithm', 'database', 'api', 'authentication', 'authorization', 'encryption', 'scalability'],
  medium: ['update', 'modify', 'enhance', 'improve', 'add', 'implement', 'create', 'develop', 'design', 'test', 'validate', 'configure'],
  low: ['fix', 'bug', 'typo', 'text', 'label', 'color', 'style', 'css', 'ui', 'button', 'link', 'simple']
};

// Technical debt indicators
const technicalDebtKeywords = ['legacy', 'deprecated', 'workaround', 'hack', 'technical debt', 'refactor', 'cleanup'];

// Uncertainty indicators
const uncertaintyKeywords = ['maybe', 'possibly', 'unclear', 'investigate', 'research', 'explore', 'tbd', 'unknown'];

// Story point estimation function
function estimateStoryPoints(userStory) {
  const text = userStory.toLowerCase();
  const tokens = tokenizer.tokenize(text);
  const doc = compromise(userStory);
  
  // Initialize scores
  let complexityScore = 0;
  let technicalDebtScore = 0;
  let uncertaintyScore = 0;
  let lengthScore = 0;
  
  // 1. Complexity Analysis
  complexityIndicators.high.forEach(keyword => {
    if (text.includes(keyword)) complexityScore += 3;
  });
  
  complexityIndicators.medium.forEach(keyword => {
    if (text.includes(keyword)) complexityScore += 2;
  });
  
  complexityIndicators.low.forEach(keyword => {
    if (text.includes(keyword)) complexityScore += 1;
  });
  
  // 2. Technical Debt Analysis
  technicalDebtKeywords.forEach(keyword => {
    if (text.includes(keyword)) technicalDebtScore += 2;
  });
  
  // 3. Uncertainty Analysis
  uncertaintyKeywords.forEach(keyword => {
    if (text.includes(keyword)) uncertaintyScore += 2;
  });
  
  // 4. Length and Detail Analysis
  const wordCount = tokens.length;
  if (wordCount < 10) lengthScore = 1;
  else if (wordCount < 30) lengthScore = 2;
  else if (wordCount < 50) lengthScore = 3;
  else lengthScore = 5;
  
  // 5. Sentence Complexity
  const sentences = doc.sentences().out('array');
  const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
  const sentenceComplexity = avgWordsPerSentence > 15 ? 2 : 1;
  
  // 6. Entity Analysis (nouns, verbs indicate scope)
  const nouns = doc.nouns().out('array');
  const verbs = doc.verbs().out('array');
  const entityScore = Math.min(Math.floor((nouns.length + verbs.length) / 3), 5);
  
  // Calculate total score
  const totalScore = complexityScore + technicalDebtScore + uncertaintyScore + 
                     lengthScore + sentenceComplexity + entityScore;
  
  // Map score to Fibonacci story points
  let storyPoints;
  let confidence;
  
  if (totalScore <= 5) {
    storyPoints = 1;
    confidence = 'high';
  } else if (totalScore <= 10) {
    storyPoints = 2;
    confidence = 'high';
  } else if (totalScore <= 15) {
    storyPoints = 3;
    confidence = 'medium';
  } else if (totalScore <= 20) {
    storyPoints = 5;
    confidence = 'medium';
  } else if (totalScore <= 25) {
    storyPoints = 8;
    confidence = 'low';
  } else {
    storyPoints = 13;
    confidence = 'low';
  }
  
  // Generate insights
  const insights = generateInsights(text, complexityScore, technicalDebtScore, 
                                   uncertaintyScore, wordCount, nouns, verbs);
  
  return {
    storyPoints,
    confidence,
    totalScore,
    breakdown: {
      complexity: complexityScore,
      technicalDebt: technicalDebtScore,
      uncertainty: uncertaintyScore,
      length: lengthScore,
      sentenceComplexity,
      entityScore
    },
    insights,
    analysis: {
      wordCount,
      sentenceCount: sentences.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      keyEntities: {
        nouns: nouns.slice(0, 5),
        verbs: verbs.slice(0, 5)
      }
    }
  };
}

// Generate insights based on analysis
function generateInsights(text, complexityScore, technicalDebtScore, uncertaintyScore, wordCount, nouns, verbs) {
  const insights = [];
  
  if (complexityScore > 10) {
    insights.push({
      type: 'warning',
      message: 'High complexity detected. Consider breaking down into smaller stories.'
    });
  }
  
  if (technicalDebtScore > 4) {
    insights.push({
      type: 'info',
      message: 'Technical debt indicators found. May require additional refactoring time.'
    });
  }
  
  if (uncertaintyScore > 4) {
    insights.push({
      type: 'warning',
      message: 'High uncertainty detected. Consider research spike or refinement session.'
    });
  }
  
  if (wordCount < 10) {
    insights.push({
      type: 'suggestion',
      message: 'Story description is brief. Adding more details may improve estimation accuracy.'
    });
  }
  
  if (nouns.length > 10) {
    insights.push({
      type: 'info',
      message: 'Multiple entities detected. Story may involve several components or systems.'
    });
  }
  
  if (verbs.length > 8) {
    insights.push({
      type: 'info',
      message: 'Multiple actions detected. Story may require several implementation steps.'
    });
  }
  
  // Check for integration keywords
  if (text.includes('integrate') || text.includes('integration')) {
    insights.push({
      type: 'warning',
      message: 'Integration work detected. Consider dependencies and testing requirements.'
    });
  }
  
  // Check for UI/UX work
  if (text.includes('ui') || text.includes('ux') || text.includes('design') || text.includes('interface')) {
    insights.push({
      type: 'info',
      message: 'UI/UX work detected. Consider design review and user testing time.'
    });
  }
  
  return insights;
}

// API Routes
app.post('/api/estimate', (req, res) => {
  try {
    const { userStory } = req.body;
    
    if (!userStory || userStory.trim().length === 0) {
      return res.status(400).json({ 
        error: 'User story is required' 
      });
    }
    
    const estimation = estimateStoryPoints(userStory);
    
    res.json({
      success: true,
      estimation
    });
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ 
      error: 'Failed to estimate story points',
      message: error.message 
    });
  }
});

// Batch estimation endpoint
app.post('/api/estimate-batch', (req, res) => {
  try {
    const { stories } = req.body;
    
    if (!Array.isArray(stories) || stories.length === 0) {
      return res.status(400).json({
        error: 'Stories array is required'
      });
    }
    
    const estimations = stories.map((story, index) => ({
      id: story.id || index,
      title: story.title || `Story ${index + 1}`,
      estimation: estimateStoryPoints(story.description || story.userStory || '')
    }));
    
    res.json({
      success: true,
      estimations,
      summary: {
        totalStories: estimations.length,
        totalPoints: estimations.reduce((sum, e) => sum + e.estimation.storyPoints, 0),
        averagePoints: Math.round(estimations.reduce((sum, e) => sum + e.estimation.storyPoints, 0) / estimations.length * 10) / 10
      }
    });
  } catch (error) {
    console.error('Batch estimation error:', error);
    res.status(500).json({
      error: 'Failed to estimate story points',
      message: error.message
    });
  }
});

// Sprint Capacity Calculator endpoints

// Calculate sprint capacity
app.post('/api/capacity/calculate', (req, res) => {
  try {
    const { 
      teamMembers, 
      sprintDuration, 
      holidays = [], 
      plannedLeave = [],
      focusFactor = 0.7,
      workingHoursPerDay = 8
    } = req.body;
    
    if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      return res.status(400).json({ 
        error: 'Team members array is required' 
      });
    }
    
    if (!sprintDuration || sprintDuration <= 0) {
      return res.status(400).json({ 
        error: 'Valid sprint duration is required' 
      });
    }
    
    const capacity = calculateSprintCapacity({
      teamMembers,
      sprintDuration,
      holidays,
      plannedLeave,
      focusFactor,
      workingHoursPerDay
    });
    
    res.json({
      success: true,
      capacity
    });
  } catch (error) {
    console.error('Capacity calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate sprint capacity',
      message: error.message 
    });
  }
});

// Calculate sprint planning with stories
app.post('/api/capacity/plan-sprint', (req, res) => {
  try {
    const { 
      teamMembers, 
      sprintDuration, 
      stories,
      holidays = [], 
      plannedLeave = [],
      focusFactor = 0.7,
      workingHoursPerDay = 8,
      bufferPercentage = 0.2
    } = req.body;
    
    if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      return res.status(400).json({ 
        error: 'Team members array is required' 
      });
    }
    
    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return res.status(400).json({ 
        error: 'Stories array is required' 
      });
    }
    
    // Calculate capacity
    const capacity = calculateSprintCapacity({
      teamMembers,
      sprintDuration,
      holidays,
      plannedLeave,
      focusFactor,
      workingHoursPerDay
    });
    
    // Estimate all stories
    const estimatedStories = stories.map((story, index) => ({
      id: story.id || `STORY-${index + 1}`,
      title: story.title || `Story ${index + 1}`,
      description: story.description || story.userStory || '',
      estimation: estimateStoryPoints(story.description || story.userStory || ''),
      priority: story.priority || 'medium',
      assignee: story.assignee || null
    }));
    
    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    estimatedStories.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.estimation.storyPoints - a.estimation.storyPoints;
    });
    
    // Plan sprint with buffer
    const availableCapacity = capacity.totalCapacity * (1 - bufferPercentage);
    const sprintPlan = planSprint(estimatedStories, availableCapacity, capacity);
    
    res.json({
      success: true,
      capacity,
      sprintPlan,
      bufferPercentage,
      availableCapacity: Math.round(availableCapacity * 10) / 10
    });
  } catch (error) {
    console.error('Sprint planning error:', error);
    res.status(500).json({ 
      error: 'Failed to plan sprint',
      message: error.message 
    });
  }
});

// Get team velocity history
app.post('/api/capacity/velocity', (req, res) => {
  try {
    const { sprintHistory } = req.body;
    
    if (!sprintHistory || !Array.isArray(sprintHistory) || sprintHistory.length === 0) {
      return res.status(400).json({ 
        error: 'Sprint history array is required' 
      });
    }
    
    const velocityAnalysis = analyzeVelocity(sprintHistory);
    
    res.json({
      success: true,
      velocityAnalysis
    });
  } catch (error) {
    console.error('Velocity analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze velocity',
      message: error.message 
    });
  }
});

// Sprint Success Predictor endpoint
app.post('/api/predictor/analyze', (req, res) => {
  try {
    const {
      sprintData,
      teamMetrics,
      historicalData
    } = req.body;
    
    if (!sprintData) {
      return res.status(400).json({
        error: 'Sprint data is required'
      });
    }
    
    const prediction = predictSprintSuccess({
      sprintData,
      teamMetrics: teamMetrics || {},
      historicalData: historicalData || []
    });
    
    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Sprint prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict sprint success',
      message: error.message
    });
  }
});

// Helper function: Predict sprint success
function predictSprintSuccess(params) {
  const { sprintData, teamMetrics, historicalData } = params;
  
  // Initialize risk factors
  let riskScore = 0;
  const riskFactors = [];
  const strengths = [];
  
  // 1. Capacity vs Commitment Analysis (30% weight)
  const capacityUtilization = (sprintData.committedPoints / sprintData.capacity) * 100;
  if (capacityUtilization > 95) {
    riskScore += 30;
    riskFactors.push({
      category: 'Capacity',
      severity: 'high',
      message: `Over-committed at ${Math.round(capacityUtilization)}% capacity utilization`,
      impact: 30
    });
  } else if (capacityUtilization > 85) {
    riskScore += 15;
    riskFactors.push({
      category: 'Capacity',
      severity: 'medium',
      message: `High capacity utilization at ${Math.round(capacityUtilization)}%`,
      impact: 15
    });
  } else if (capacityUtilization >= 70 && capacityUtilization <= 85) {
    strengths.push({
      category: 'Capacity',
      message: `Optimal capacity utilization at ${Math.round(capacityUtilization)}%`
    });
  }
  
  // 2. Team Velocity Consistency (25% weight)
  if (historicalData.length >= 3) {
    const velocities = historicalData.map(s => s.completedPoints);
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avgVelocity) * 100;
    
    if (coefficientOfVariation > 40) {
      riskScore += 25;
      riskFactors.push({
        category: 'Velocity',
        severity: 'high',
        message: `Highly inconsistent velocity (CV: ${Math.round(coefficientOfVariation)}%)`,
        impact: 25
      });
    } else if (coefficientOfVariation > 25) {
      riskScore += 12;
      riskFactors.push({
        category: 'Velocity',
        severity: 'medium',
        message: `Moderate velocity inconsistency (CV: ${Math.round(coefficientOfVariation)}%)`,
        impact: 12
      });
    } else {
      strengths.push({
        category: 'Velocity',
        message: `Consistent velocity pattern (CV: ${Math.round(coefficientOfVariation)}%)`
      });
    }
  }
  
  // 3. Story Complexity & Uncertainty (20% weight)
  const largeStories = sprintData.stories?.filter(s => s.storyPoints >= 8).length || 0;
  const lowConfidenceStories = sprintData.stories?.filter(s => s.confidence === 'low').length || 0;
  const totalStories = sprintData.stories?.length || 1;
  
  const complexityRatio = (largeStories + lowConfidenceStories) / totalStories;
  if (complexityRatio > 0.4) {
    riskScore += 20;
    riskFactors.push({
      category: 'Complexity',
      severity: 'high',
      message: `${Math.round(complexityRatio * 100)}% of stories are large or uncertain`,
      impact: 20
    });
  } else if (complexityRatio > 0.25) {
    riskScore += 10;
    riskFactors.push({
      category: 'Complexity',
      severity: 'medium',
      message: `${Math.round(complexityRatio * 100)}% of stories have complexity concerns`,
      impact: 10
    });
  }
  
  // 4. Team Availability & Dependencies (15% weight)
  const teamAvailability = teamMetrics.averageAvailability || 100;
  if (teamAvailability < 70) {
    riskScore += 15;
    riskFactors.push({
      category: 'Availability',
      severity: 'high',
      message: `Low team availability at ${Math.round(teamAvailability)}%`,
      impact: 15
    });
  } else if (teamAvailability < 85) {
    riskScore += 8;
    riskFactors.push({
      category: 'Availability',
      severity: 'medium',
      message: `Reduced team availability at ${Math.round(teamAvailability)}%`,
      impact: 8
    });
  }
  
  // 5. Dependencies & Blockers (10% weight)
  const dependencies = sprintData.dependencies || 0;
  const blockers = sprintData.blockers || 0;
  if (dependencies > 5 || blockers > 0) {
    riskScore += 10;
    riskFactors.push({
      category: 'Dependencies',
      severity: 'high',
      message: `${dependencies} dependencies and ${blockers} active blockers`,
      impact: 10
    });
  } else if (dependencies > 2) {
    riskScore += 5;
    riskFactors.push({
      category: 'Dependencies',
      severity: 'medium',
      message: `${dependencies} external dependencies identified`,
      impact: 5
    });
  }
  
  // Calculate success probability
  const successProbability = Math.max(0, Math.min(100, 100 - riskScore));
  
  // Determine risk level
  let riskLevel, riskColor;
  if (riskScore >= 60) {
    riskLevel = 'High Risk';
    riskColor = 'red';
  } else if (riskScore >= 35) {
    riskLevel = 'Medium Risk';
    riskColor = 'orange';
  } else {
    riskLevel = 'Low Risk';
    riskColor = 'green';
  }
  
  // Generate recommendations
  const recommendations = generatePredictorRecommendations(riskFactors, strengths, successProbability);
  
  return {
    successProbability: Math.round(successProbability),
    riskScore: Math.round(riskScore),
    riskLevel,
    riskColor,
    riskFactors: riskFactors.sort((a, b) => b.impact - a.impact),
    strengths,
    recommendations,
    metrics: {
      capacityUtilization: Math.round(capacityUtilization),
      teamAvailability: Math.round(teamAvailability),
      complexityRatio: Math.round(complexityRatio * 100),
      dependencies,
      blockers
    }
  };
}

// Helper function: Generate predictor recommendations
function generatePredictorRecommendations(riskFactors, strengths, successProbability) {
  const recommendations = [];
  
  if (successProbability < 50) {
    recommendations.push({
      type: 'critical',
      message: 'Sprint success is at high risk. Consider immediate intervention or scope reduction.'
    });
  } else if (successProbability < 70) {
    recommendations.push({
      type: 'warning',
      message: 'Sprint has moderate risk. Monitor closely and address risk factors proactively.'
    });
  } else {
    recommendations.push({
      type: 'success',
      message: 'Sprint is well-positioned for success. Maintain current practices.'
    });
  }
  
  // Address top risk factors
  riskFactors.slice(0, 3).forEach(risk => {
    if (risk.category === 'Capacity' && risk.severity === 'high') {
      recommendations.push({
        type: 'action',
        message: 'Reduce sprint scope by moving lower-priority stories to backlog.'
      });
    }
    if (risk.category === 'Velocity' && risk.severity === 'high') {
      recommendations.push({
        type: 'action',
        message: 'Review estimation practices and consider team retrospective on velocity.'
      });
    }
    if (risk.category === 'Complexity') {
      recommendations.push({
        type: 'action',
        message: 'Break down large stories into smaller, more manageable tasks.'
      });
    }
    if (risk.category === 'Availability') {
      recommendations.push({
        type: 'action',
        message: 'Adjust sprint commitment to match actual team availability.'
      });
    }
    if (risk.category === 'Dependencies') {
      recommendations.push({
        type: 'action',
        message: 'Prioritize resolving blockers and coordinate with dependent teams.'
      });
    }
  });
  
  // Leverage strengths
  if (strengths.length > 0) {
    recommendations.push({
      type: 'info',
      message: `Team shows ${strengths.length} positive indicator(s). Build on these strengths.`
    });
  }
  
  return recommendations;
}

// Helper function: Calculate sprint capacity
function calculateSprintCapacity(params) {
  const {
    teamMembers,
    sprintDuration,
    holidays,
    plannedLeave,
    focusFactor,
    workingHoursPerDay
  } = params;
  
  const memberCapacities = teamMembers.map(member => {
    const availability = member.availability || 1.0; // 1.0 = 100% available
    const hoursPerDay = (member.hoursPerDay || workingHoursPerDay) * availability;
    
    // Calculate working days
    let workingDays = sprintDuration;
    
    // Subtract holidays
    workingDays -= holidays.length;
    
    // Subtract planned leave for this member
    const memberLeave = plannedLeave.filter(leave => 
      leave.memberId === member.id || leave.memberName === member.name
    );
    memberLeave.forEach(leave => {
      workingDays -= leave.days || 0;
    });
    
    // Calculate total hours
    const totalHours = workingDays * hoursPerDay;
    
    // Apply focus factor (accounting for meetings, interruptions, etc.)
    const effectiveHours = totalHours * focusFactor;
    
    // Convert to story points (assuming 1 story point = X hours)
    const hoursPerPoint = member.hoursPerPoint || 4; // Default: 4 hours per story point
    const capacity = effectiveHours / hoursPerPoint;
    
    return {
      id: member.id,
      name: member.name,
      role: member.role || 'Developer',
      availability: availability * 100,
      workingDays,
      totalHours: Math.round(totalHours * 10) / 10,
      effectiveHours: Math.round(effectiveHours * 10) / 10,
      capacity: Math.round(capacity * 10) / 10,
      hoursPerPoint
    };
  });
  
  const totalCapacity = memberCapacities.reduce((sum, m) => sum + m.capacity, 0);
  const totalHours = memberCapacities.reduce((sum, m) => sum + m.effectiveHours, 0);
  
  return {
    teamSize: teamMembers.length,
    sprintDuration,
    focusFactor: focusFactor * 100,
    holidays: holidays.length,
    totalCapacity: Math.round(totalCapacity * 10) / 10,
    totalHours: Math.round(totalHours * 10) / 10,
    averageCapacityPerMember: Math.round((totalCapacity / teamMembers.length) * 10) / 10,
    memberCapacities,
    recommendations: generateCapacityRecommendations(memberCapacities, totalCapacity)
  };
}

// Helper function: Plan sprint
function planSprint(stories, availableCapacity, capacity) {
  const committed = [];
  const backlog = [];
  let committedPoints = 0;
  
  for (const story of stories) {
    const storyPoints = story.estimation.storyPoints;
    
    if (committedPoints + storyPoints <= availableCapacity) {
      committed.push({
        ...story,
        status: 'committed'
      });
      committedPoints += storyPoints;
    } else {
      backlog.push({
        ...story,
        status: 'backlog'
      });
    }
  }
  
  const utilizationRate = (committedPoints / capacity.totalCapacity) * 100;
  
  return {
    committed,
    backlog,
    committedPoints,
    backlogPoints: stories.reduce((sum, s) => sum + s.estimation.storyPoints, 0) - committedPoints,
    totalStories: stories.length,
    committedStories: committed.length,
    backlogStories: backlog.length,
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    recommendations: generateSprintRecommendations(committedPoints, capacity.totalCapacity, committed, backlog)
  };
}

// Helper function: Analyze velocity
function analyzeVelocity(sprintHistory) {
  const velocities = sprintHistory.map(sprint => sprint.completedPoints || 0);
  const average = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const max = Math.max(...velocities);
  const min = Math.min(...velocities);
  
  // Calculate standard deviation
  const variance = velocities.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / velocities.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate trend (simple linear regression)
  const n = velocities.length;
  const sumX = velocities.reduce((sum, _, i) => sum + i, 0);
  const sumY = velocities.reduce((sum, v) => sum + v, 0);
  const sumXY = velocities.reduce((sum, v, i) => sum + (i * v), 0);
  const sumX2 = velocities.reduce((sum, _, i) => sum + (i * i), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const trend = slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';
  
  // Predictability (coefficient of variation)
  const coefficientOfVariation = (stdDev / average) * 100;
  const predictability = coefficientOfVariation < 20 ? 'high' : coefficientOfVariation < 40 ? 'medium' : 'low';
  
  return {
    sprints: sprintHistory.length,
    average: Math.round(average * 10) / 10,
    max,
    min,
    standardDeviation: Math.round(stdDev * 10) / 10,
    trend,
    predictability,
    coefficientOfVariation: Math.round(coefficientOfVariation * 10) / 10,
    velocityData: velocities,
    recommendations: generateVelocityRecommendations(average, stdDev, trend, predictability)
  };
}

// Helper function: Generate capacity recommendations
function generateCapacityRecommendations(memberCapacities, totalCapacity) {
  const recommendations = [];
  
  // Check for low availability
  const lowAvailability = memberCapacities.filter(m => m.availability < 80);
  if (lowAvailability.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `${lowAvailability.length} team member(s) have reduced availability. Consider adjusting sprint scope.`
    });
  }
  
  // Check for capacity imbalance
  const capacities = memberCapacities.map(m => m.capacity);
  const avgCapacity = totalCapacity / memberCapacities.length;
  const imbalanced = memberCapacities.filter(m => 
    m.capacity < avgCapacity * 0.5 || m.capacity > avgCapacity * 1.5
  );
  
  if (imbalanced.length > 0) {
    recommendations.push({
      type: 'info',
      message: 'Capacity is unevenly distributed across team members. Consider workload balancing.'
    });
  }
  
  // Check for low total capacity
  if (totalCapacity < 20) {
    recommendations.push({
      type: 'warning',
      message: 'Low team capacity detected. Consider reducing sprint scope or extending sprint duration.'
    });
  }
  
  return recommendations;
}

// Helper function: Generate sprint recommendations
function generateSprintRecommendations(committedPoints, totalCapacity, committed, backlog) {
  const recommendations = [];
  const utilizationRate = (committedPoints / totalCapacity) * 100;
  
  if (utilizationRate < 60) {
    recommendations.push({
      type: 'suggestion',
      message: `Sprint is under-utilized (${Math.round(utilizationRate)}%). Consider adding more stories from backlog.`
    });
  } else if (utilizationRate > 90) {
    recommendations.push({
      type: 'warning',
      message: `Sprint is over-committed (${Math.round(utilizationRate)}%). Consider moving some stories to backlog.`
    });
  } else {
    recommendations.push({
      type: 'success',
      message: `Sprint capacity is well-balanced (${Math.round(utilizationRate)}% utilization).`
    });
  }
  
  // Check for high-risk stories
  const highRiskStories = committed.filter(s => 
    s.estimation.confidence === 'low' || s.estimation.storyPoints >= 8
  );
  
  if (highRiskStories.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `${highRiskStories.length} high-risk or large stories in sprint. Consider breaking them down.`
    });
  }
  
  // Check priority distribution
  const highPriority = committed.filter(s => s.priority === 'high').length;
  const totalCommitted = committed.length;
  
  if (highPriority < totalCommitted * 0.3) {
    recommendations.push({
      type: 'info',
      message: 'Consider prioritizing more high-priority stories in the sprint.'
    });
  }
  
  return recommendations;
}

// Helper function: Generate velocity recommendations
function generateVelocityRecommendations(average, stdDev, trend, predictability) {
  const recommendations = [];
  
  if (predictability === 'low') {
    recommendations.push({
      type: 'warning',
      message: 'Velocity is highly variable. Focus on improving estimation accuracy and reducing scope changes.'
    });
  } else if (predictability === 'high') {
    recommendations.push({
      type: 'success',
      message: 'Velocity is consistent and predictable. Team estimation is reliable.'
    });
  }
  
  if (trend === 'decreasing') {
    recommendations.push({
      type: 'warning',
      message: 'Velocity is trending downward. Investigate potential blockers or team capacity issues.'
    });
  } else if (trend === 'increasing') {
    recommendations.push({
      type: 'success',
      message: 'Velocity is improving over time. Team efficiency is increasing.'
    });
  }
  
  recommendations.push({
    type: 'info',
    message: `Use average velocity (${Math.round(average)}) as baseline for sprint planning.`
  });
  
  return recommendations;
}

// Sprint Planning Board endpoints

// Get board state
app.get('/api/board/state', (req, res) => {
  try {
    // In a real application, this would fetch from a database
    // For now, return a default board state
    const boardState = {
      backlog: [],
      sprint: [],
      inProgress: [],
      done: []
    };
    
    res.json({
      success: true,
      board: boardState
    });
  } catch (error) {
    console.error('Board state error:', error);
    res.status(500).json({
      error: 'Failed to get board state',
      message: error.message
    });
  }
});

// Save board state
app.post('/api/board/save', (req, res) => {
  try {
    const { board } = req.body;
    
    if (!board) {
      return res.status(400).json({
        error: 'Board state is required'
      });
    }
    
    // In a real application, this would save to a database
    // For now, just acknowledge the save
    
    res.json({
      success: true,
      message: 'Board state saved successfully'
    });
  } catch (error) {
    console.error('Board save error:', error);
    res.status(500).json({
      error: 'Failed to save board state',
      message: error.message
    });
  }
});

// Add story to board
app.post('/api/board/add-story', (req, res) => {
  try {
    const { story, column } = req.body;
    
    if (!story || !column) {
      return res.status(400).json({
        error: 'Story and column are required'
      });
    }
    
    // Estimate the story if description is provided
    let estimation = null;
    if (story.description) {
      estimation = estimateStoryPoints(story.description);
    }
    
    const enrichedStory = {
      ...story,
      id: story.id || `STORY-${Date.now()}`,
      estimation: estimation || story.estimation,
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      story: enrichedStory
    });
  } catch (error) {
    console.error('Add story error:', error);
    res.status(500).json({
      error: 'Failed to add story',
      message: error.message
    });
  }
});

// Bulk estimate stories
app.post('/api/board/estimate-stories', (req, res) => {
  try {
    const { stories } = req.body;
    
    if (!stories || !Array.isArray(stories)) {
      return res.status(400).json({
        error: 'Stories array is required'
      });
    }
    
    const estimatedStories = stories.map(story => ({
      ...story,
      estimation: story.description ? estimateStoryPoints(story.description) : null
    }));
    
    res.json({
      success: true,
      stories: estimatedStories
    });
  } catch (error) {
    console.error('Bulk estimate error:', error);
    res.status(500).json({
      error: 'Failed to estimate stories',
      message: error.message
    });
  }
});

// Historical Analytics Dashboard endpoints

// Get analytics overview
app.post('/api/analytics/overview', (req, res) => {
  try {
    const { sprintHistory } = req.body;
    
    if (!sprintHistory || !Array.isArray(sprintHistory) || sprintHistory.length === 0) {
      return res.status(400).json({
        error: 'Sprint history array is required'
      });
    }
    
    const analytics = calculateAnalyticsOverview(sprintHistory);
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      error: 'Failed to calculate analytics',
      message: error.message
    });
  }
});

// Get detailed sprint metrics
app.post('/api/analytics/sprint-metrics', (req, res) => {
  try {
    const { sprintHistory } = req.body;
    
    if (!sprintHistory || !Array.isArray(sprintHistory)) {
      return res.status(400).json({
        error: 'Sprint history array is required'
      });
    }
    
    const metrics = calculateSprintMetrics(sprintHistory);
    
    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Sprint metrics error:', error);
    res.status(500).json({
      error: 'Failed to calculate sprint metrics',
      message: error.message
    });
  }
});

// Helper function: Calculate analytics overview
function calculateAnalyticsOverview(sprintHistory) {
  const velocities = sprintHistory.map(s => s.completedPoints || 0);
  const commitments = sprintHistory.map(s => s.committedPoints || 0);
  
  // Basic statistics
  const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const avgCommitment = commitments.reduce((a, b) => a + b, 0) / commitments.length;
  const maxVelocity = Math.max(...velocities);
  const minVelocity = Math.min(...velocities);
  
  // Velocity trend
  const velocityAnalysis = analyzeVelocity(sprintHistory);
  
  // Commitment accuracy
  const accuracyRates = sprintHistory.map(s => {
    if (s.committedPoints === 0) return 0;
    return (s.completedPoints / s.committedPoints) * 100;
  });
  const avgAccuracy = accuracyRates.reduce((a, b) => a + b, 0) / accuracyRates.length;
  
  // Sprint success rate (completed >= 90% of committed)
  const successfulSprints = sprintHistory.filter(s =>
    (s.completedPoints / s.committedPoints) >= 0.9
  ).length;
  const successRate = (successfulSprints / sprintHistory.length) * 100;
  
  // Throughput (stories completed per sprint)
  const avgThroughput = sprintHistory.reduce((sum, s) =>
    sum + (s.storiesCompleted || 0), 0
  ) / sprintHistory.length;
  
  return {
    totalSprints: sprintHistory.length,
    velocity: {
      average: Math.round(avgVelocity * 10) / 10,
      max: maxVelocity,
      min: minVelocity,
      trend: velocityAnalysis.trend,
      predictability: velocityAnalysis.predictability,
      standardDeviation: velocityAnalysis.standardDeviation
    },
    commitment: {
      average: Math.round(avgCommitment * 10) / 10,
      accuracy: Math.round(avgAccuracy * 10) / 10
    },
    performance: {
      successRate: Math.round(successRate * 10) / 10,
      successfulSprints,
      failedSprints: sprintHistory.length - successfulSprints
    },
    throughput: {
      average: Math.round(avgThroughput * 10) / 10
    },
    recommendations: generateAnalyticsRecommendations(avgAccuracy, successRate, velocityAnalysis)
  };
}

// Helper function: Calculate sprint metrics
function calculateSprintMetrics(sprintHistory) {
  return sprintHistory.map((sprint, index) => {
    const accuracy = sprint.committedPoints > 0
      ? (sprint.completedPoints / sprint.committedPoints) * 100
      : 0;
    
    const success = accuracy >= 90;
    
    const carryover = sprint.carryoverPoints || 0;
    const carryoverRate = sprint.committedPoints > 0
      ? (carryover / sprint.committedPoints) * 100
      : 0;
    
    return {
      sprint: sprint.sprint || index + 1,
      committedPoints: sprint.committedPoints,
      completedPoints: sprint.completedPoints,
      carryoverPoints: carryover,
      storiesCompleted: sprint.storiesCompleted || 0,
      storiesCarriedOver: sprint.storiesCarriedOver || 0,
      accuracy: Math.round(accuracy * 10) / 10,
      carryoverRate: Math.round(carryoverRate * 10) / 10,
      success,
      velocity: sprint.completedPoints,
      date: sprint.date || null
    };
  });
}

// Helper function: Generate analytics recommendations
function generateAnalyticsRecommendations(avgAccuracy, successRate, velocityAnalysis) {
  const recommendations = [];
  
  if (avgAccuracy < 80) {
    recommendations.push({
      type: 'warning',
      category: 'Accuracy',
      message: `Low commitment accuracy (${Math.round(avgAccuracy)}%). Review estimation practices and sprint planning.`
    });
  } else if (avgAccuracy >= 95) {
    recommendations.push({
      type: 'success',
      category: 'Accuracy',
      message: `Excellent commitment accuracy (${Math.round(avgAccuracy)}%). Team estimation is highly reliable.`
    });
  }
  
  if (successRate < 60) {
    recommendations.push({
      type: 'critical',
      category: 'Success Rate',
      message: `Low sprint success rate (${Math.round(successRate)}%). Consider reducing sprint commitments.`
    });
  } else if (successRate >= 80) {
    recommendations.push({
      type: 'success',
      category: 'Success Rate',
      message: `Strong sprint success rate (${Math.round(successRate)}%). Team is consistently delivering.`
    });
  }
  
  if (velocityAnalysis.predictability === 'low') {
    recommendations.push({
      type: 'warning',
      category: 'Predictability',
      message: 'Velocity is highly variable. Focus on consistent sprint planning and reducing scope changes.'
    });
  } else if (velocityAnalysis.predictability === 'high') {
    recommendations.push({
      type: 'success',
      category: 'Predictability',
      message: 'Velocity is consistent and predictable. Excellent for long-term planning.'
    });
  }
  
  if (velocityAnalysis.trend === 'decreasing') {
    recommendations.push({
      type: 'warning',
      category: 'Trend',
      message: 'Velocity is trending downward. Investigate potential blockers or team capacity issues.'
    });
  } else if (velocityAnalysis.trend === 'increasing') {
    recommendations.push({
      type: 'info',
      category: 'Trend',
      message: 'Velocity is improving. Team efficiency is increasing over time.'
    });
  }
  
  return recommendations;
}

// JIRA Integration endpoints

// Test JIRA connection
app.post('/api/jira/test-connection', async (req, res) => {
  try {
    const { jiraUrl, email, apiToken } = req.body;
    
    if (!jiraUrl || !email || !apiToken) {
      return res.status(400).json({
        error: 'JIRA URL, email, and API token are required'
      });
    }
    
    // Test connection by fetching user info
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const testUrl = `${jiraUrl}/rest/api/3/myself`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      res.json({
        success: true,
        message: 'Connection successful',
        user: {
          displayName: userData.displayName,
          emailAddress: userData.emailAddress
        }
      });
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.error('JIRA connection error:', error);
    res.status(500).json({
      error: 'Failed to connect to JIRA',
      message: error.message
    });
  }
});

// Get JIRA projects
app.post('/api/jira/projects', async (req, res) => {
  try {
    const { jiraUrl, email, apiToken } = req.body;
    
    if (!jiraUrl || !email || !apiToken) {
      return res.status(400).json({
        error: 'JIRA credentials are required'
      });
    }
    
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    const projectsUrl = `${jiraUrl}/rest/api/3/project`;
    
    const response = await fetch(projectsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const projects = await response.json();
      res.json({
        success: true,
        projects: projects.map(p => ({
          id: p.id,
          key: p.key,
          name: p.name
        }))
      });
    } else {
      throw new Error('Failed to fetch projects');
    }
  } catch (error) {
    console.error('JIRA projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch JIRA projects',
      message: error.message
    });
  }
});

// Import stories from JIRA
app.post('/api/jira/import-stories', async (req, res) => {
  try {
    const { jiraUrl, email, apiToken, projectKey, jql } = req.body;
    
    if (!jiraUrl || !email || !apiToken || !projectKey) {
      return res.status(400).json({
        error: 'JIRA credentials and project key are required'
      });
    }
    
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    
    // Build JQL query
    const query = jql || `project = ${projectKey} AND type = Story ORDER BY created DESC`;
    const searchUrl = `${jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(query)}&maxResults=100`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Transform JIRA issues to our story format
      const stories = data.issues.map(issue => {
        const fields = issue.fields;
        const story = {
          id: issue.key,
          title: fields.summary,
          description: fields.description?.content?.[0]?.content?.[0]?.text || fields.description || '',
          priority: mapJiraPriority(fields.priority?.name),
          status: fields.status?.name || 'To Do',
          assignee: fields.assignee?.displayName || '',
          storyPoints: fields.customfield_10016 || fields.storyPoints || 0, // Common story points field
          labels: fields.labels || [],
          created: fields.created,
          updated: fields.updated,
          jiraUrl: `${jiraUrl}/browse/${issue.key}`
        };
        
        // Auto-estimate if no story points
        if (!story.storyPoints && story.description) {
          story.estimation = estimateStoryPoints(story.description);
          story.storyPoints = story.estimation.storyPoints;
        }
        
        return story;
      });
      
      res.json({
        success: true,
        total: data.total,
        imported: stories.length,
        stories
      });
    } else {
      throw new Error('Failed to import stories');
    }
  } catch (error) {
    console.error('JIRA import error:', error);
    res.status(500).json({
      error: 'Failed to import stories from JIRA',
      message: error.message
    });
  }
});

// Helper function: Map JIRA priority to our format
function mapJiraPriority(jiraPriority) {
  if (!jiraPriority) return 'medium';
  
  const priority = jiraPriority.toLowerCase();
  if (priority.includes('highest') || priority.includes('critical')) return 'high';
  if (priority.includes('high')) return 'high';
  if (priority.includes('low') || priority.includes('lowest')) return 'low';
  return 'medium';
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Story Point Estimator running on port ${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/estimate`);
});

module.exports = app;

// Made with Bob
