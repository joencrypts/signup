import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { analyzeQuizAnswers, generateDetailedReport } from '../services/aiAnalysisService';
import '../styles/dynamic.css';

const Report = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [detailedReport, setDetailedReport] = useState(null);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!user) {
          setError('Please log in to view your report');
          navigate('/login');
          return;
        }

        // Validate user ID
        if (!user.uid || typeof user.uid !== 'string') {
          setError('Invalid user ID');
          return;
        }

        // Generate analysis and detailed report
        const analysisResult = await analyzeQuizAnswers(user.uid);
        const detailedReportResult = await generateDetailedReport(user.uid);

        setAnalysis(analysisResult);
        setDetailedReport(detailedReportResult);
      } catch (error) {
        console.error('Error generating report:', error);
        setError(error.message || 'Failed to generate report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [user, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleRetakeQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generating your personalized report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/quiz')} className="retake-button">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!analysis || !detailedReport) {
    return (
      <div className="report-container">
        <div className="error-container">
          <h2>No Data Available</h2>
          <p>Unable to generate report. Please try again later.</p>
          <button onClick={() => navigate('/quiz')} className="retake-button">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-content">
        <h1>Your Digital Wellness Report</h1>
        
        <section className="report-section">
          <h2>Personality Profile</h2>
          <p>{analysis.personalityProfile}</p>
        </section>

        <section className="report-section">
          <h2>Key Strengths</h2>
          <ul>
            {analysis.keyStrengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </section>

        <section className="report-section">
          <h2>Areas for Improvement</h2>
          <ul>
            {analysis.areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </section>

        <section className="report-section">
          <h2>Recommendations</h2>
          <ul>
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </section>

        <section className="report-section">
          <h2>Digital Wellness Score</h2>
          <div className="score-container">
            <div className="score-circle">
              <span>{analysis.wellnessScore}</span>
            </div>
          </div>
        </section>

        <section className="report-section">
          <h2>Detailed Analysis</h2>
          <p>{detailedReport.detailedAnalysis.personality}</p>
          
          <h3>Behavior Patterns</h3>
          <ul>
            {detailedReport.detailedAnalysis.behaviorPatterns.map((pattern, index) => (
              <li key={index}>{pattern}</li>
            ))}
          </ul>

          <h3>Risk Assessment</h3>
          <p>{detailedReport.detailedAnalysis.riskAssessment}</p>
        </section>

        <section className="report-section">
          <h2>Improvement Plan</h2>
          
          <h3>Short-term Actions</h3>
          <ul>
            {detailedReport.improvementPlan.shortTerm.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>

          <h3>Long-term Strategies</h3>
          <ul>
            {detailedReport.improvementPlan.longTerm.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>

          <h3>Goals</h3>
          <ul>
            {detailedReport.improvementPlan.goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </section>

        <section className="report-section">
          <h2>Action Items</h2>
          <ul>
            {detailedReport.actionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="report-section">
          <h2>Conclusion</h2>
          <p>{detailedReport.conclusion}</p>
        </section>

        <div className="report-actions">
          <button onClick={handlePrint} className="print-button">
            Print Report
          </button>
          <button onClick={handleRetakeQuiz} className="retake-button">
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;