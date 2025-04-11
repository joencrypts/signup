import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizData from '../quizData';
import { useUser } from '../context/UserContext';
import { saveUserAnswers, updateAnswer, getUserAnswers } from '../firebase/firestoreService';
import '../styles/dynamic.css';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user, setResult } = useUser();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Load existing answers if any
      loadExistingAnswers();
    }
  }, [navigate]);

  const loadExistingAnswers = async () => {
    try {
      if (user?.uid) {
        const existingAnswers = await getUserAnswers(user.uid);
        if (existingAnswers) {
          setAnswers(existingAnswers);
        }
      }
    } catch (error) {
      console.error('Error loading existing answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionIndex, answer) => {
    try {
      setSaving(true);
      if (user?.uid) {
        await updateAnswer(user.uid, questionIndex, answer);
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const analyzeTraits = () => {
    const traitScores = {};
    const traitCounts = {};
    
    // Initialize all possible traits
    const allTraits = new Set();
    quizData.forEach(question => {
      question.options.forEach(option => {
        Object.keys(option.traits).forEach(trait => allTraits.add(trait));
      });
    });

    // Initialize scores and counts for all traits
    allTraits.forEach(trait => {
      traitScores[trait] = 0;
      traitCounts[trait] = 0;
    });

    // Calculate weighted scores based on answers
    Object.entries(answers).forEach(([questionIndex, answerLabel]) => {
      const question = quizData[questionIndex];
      const selectedOption = question.options.find(opt => opt.label === answerLabel);
      
      if (selectedOption && selectedOption.traits) {
        Object.entries(selectedOption.traits).forEach(([trait, weight]) => {
          traitScores[trait] = (traitScores[trait] || 0) + weight;
          traitCounts[trait]++;
        });
      }
    });

    // Calculate average scores and normalize
    const normalizedScores = {};
    const maxPossibleScore = 2;
    
    Object.entries(traitScores).forEach(([trait, score]) => {
      const count = traitCounts[trait];
      if (count > 0) {
        const averageScore = score / count;
        normalizedScores[trait] = Math.round((averageScore / maxPossibleScore) * 100);
      } else {
        normalizedScores[trait] = 0;
      }
    });

    // Determine primary traits (top 3)
    const sortedTraits = Object.entries(normalizedScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);

    // Determine character type based on primary traits
    const characterType = determineCharacterType(sortedTraits);

    return {
      traitScores: normalizedScores,
      primaryTraits: sortedTraits,
      characterType
    };
  };

  const determineCharacterType = (primaryTraits) => {
    const characterTypes = {
      'The Mindful Explorer': ['Mindful', 'Curious', 'Disciplined'],
      'The Digital Guardian': ['Guarded', 'Disciplined', 'Mindful'],
      'The Social Butterfly': ['Expressive', 'Influenced', 'Curious'],
      'The Casual User': ['Detached', 'Mindful', 'Disciplined'],
      'The Impulsive Scroller': ['Impulsive', 'Influenced', 'Expressive'],
      'The Privacy Advocate': ['Guarded', 'Disciplined', 'Mindful'],
      'The Balanced User': ['Mindful', 'Disciplined', 'Curious'],
      'The Digital Minimalist': ['Detached', 'Mindful', 'Disciplined']
    };

    for (const [type, traits] of Object.entries(characterTypes)) {
      const matches = traits.filter(trait => primaryTraits.includes(trait));
      if (matches.length >= 2) {
        return type;
      }
    }

    return 'The Balanced User';
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      try {
        // Save all answers before analyzing
        if (user?.uid) {
          await saveUserAnswers(user.uid, answers);
        }
        
        // Analyze traits
        const analysis = analyzeTraits();
        setResult(analysis);
        
        // Navigate to report
        navigate('/report', { 
          state: { 
            answers,
            ...analysis
          } 
        });
      } catch (error) {
        console.error('Error saving answers:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner" />
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const question = quizData[currentQuestion];

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion + 1} of {quizData.length}</h2>
      <div className="question-card">
        <h3>{question.question}</h3>
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${answers[currentQuestion] === option.label ? 'selected' : ''}`}
              onClick={() => handleAnswer(currentQuestion, option.label)}
              disabled={saving}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="navigation-buttons">
        {currentQuestion > 0 && (
          <button className="action-button" onClick={handlePrevious}>
            Previous
          </button>
        )}
        <button
          className="action-button"
          onClick={handleNext}
          disabled={!answers[currentQuestion] || saving}
        >
          {currentQuestion === quizData.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
