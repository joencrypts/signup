import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import quizData from '../quizData';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to get question context
const getQuestionContext = (question) => {
  return {
    text: question.question,
    category: question.category || 'General',
    options: question.options.map(opt => ({
      label: opt.label,
      traits: opt.traits
    }))
  };
};

// Helper function to parse AI response
const parseAIResponse = (text) => {
  try {
    // Remove any markdown code block indicators
    const cleanText = text.replace(/```json\n|\n```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
};

export const analyzeQuizAnswers = async (userId) => {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Valid user ID is required');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get user's answers from Firestore
    const userAnswersRef = doc(db, 'userAnswers', userId);
    if (!userAnswersRef) {
      throw new Error('Failed to create document reference');
    }

    const userAnswersDoc = await getDoc(userAnswersRef);
    if (!userAnswersDoc.exists()) {
      throw new Error('No answers found for this user');
    }

    const userData = userAnswersDoc.data();
    if (!userData || !userData.answers) {
      throw new Error('No answers found in user data');
    }

    const { answers } = userData;
    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid answers format');
    }

    // Format the answers with full question context
    const formattedAnalysis = Object.entries(answers).map(([index, answer]) => {
      const questionIndex = parseInt(index);
      if (isNaN(questionIndex)) {
        console.warn(`Invalid question index: ${index}`);
        return null;
      }

      const question = quizData[questionIndex];
      if (!question) {
        console.warn(`Question not found for index ${questionIndex}`);
        return null;
      }

      const context = getQuestionContext(question);
      const selectedOption = question.options.find(opt => opt.label === answer);
      
      return {
        questionNumber: questionIndex + 1,
        question: context.text,
        category: context.category,
        selectedAnswer: answer,
        selectedTraits: selectedOption?.traits || {},
        possibleAnswers: context.options.map(opt => ({
          label: opt.label,
          traits: opt.traits
        }))
      };
    }).filter(Boolean); // Remove any null entries

    if (formattedAnalysis.length === 0) {
      throw new Error('No valid questions found for analysis');
    }

    // Create the prompt for analysis
    const prompt = `
      You are a digital wellness expert analyzing a user's digital hygiene quiz responses.
      Analyze the following answers carefully, considering the context of each question and its implications for digital wellness.
      
      Quiz Analysis Context:
      ${JSON.stringify(formattedAnalysis, null, 2)}
      
      Please analyze these responses and provide a JSON object with this exact structure:
      {
        "personalityProfile": "A detailed description of their digital personality based on their answer patterns and associated traits",
        "keyStrengths": ["List of 3-5 key strengths identified from their answers and positive traits"],
        "areasForImprovement": ["List of 3-5 areas for improvement based on concerning patterns and negative traits"],
        "recommendations": ["List of 3-5 specific recommendations tailored to their responses and trait combinations"],
        "wellnessScore": number,
        "summary": "A brief summary of key findings and patterns, including trait analysis"
      }
      
      Make the analysis specific, actionable, and focused on digital wellness. Consider both the answers and their associated traits to provide a comprehensive analysis.
      IMPORTANT: Return ONLY the JSON object, without any additional text or markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsedResponse = parseAIResponse(text);
    if (!parsedResponse) {
      throw new Error('Failed to parse AI response');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw error;
  }
};

export const generateDetailedReport = async (userId) => {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Valid user ID is required');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get user's answers from Firestore
    const userAnswersRef = doc(db, 'userAnswers', userId);
    if (!userAnswersRef) {
      throw new Error('Failed to create document reference');
    }

    const userAnswersDoc = await getDoc(userAnswersRef);
    if (!userAnswersDoc.exists()) {
      throw new Error('No answers found for this user');
    }

    const userData = userAnswersDoc.data();
    if (!userData || !userData.answers) {
      throw new Error('No answers found in user data');
    }

    const { answers, lastUpdated } = userData;
    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid answers format');
    }

    // Format the analysis with full context
    const formattedAnalysis = Object.entries(answers).map(([index, answer]) => {
      const questionIndex = parseInt(index);
      if (isNaN(questionIndex)) {
        console.warn(`Invalid question index: ${index}`);
        return null;
      }

      const question = quizData[questionIndex];
      if (!question) {
        console.warn(`Question not found for index ${questionIndex}`);
        return null;
      }

      const context = getQuestionContext(question);
      const selectedOption = question.options.find(opt => opt.label === answer);
      
      return {
        questionNumber: questionIndex + 1,
        question: context.text,
        category: context.category,
        selectedAnswer: answer,
        selectedTraits: selectedOption?.traits || {},
        possibleAnswers: context.options.map(opt => ({
          label: opt.label,
          traits: opt.traits
        }))
      };
    }).filter(Boolean); // Remove any null entries

    if (formattedAnalysis.length === 0) {
      throw new Error('No valid questions found for analysis');
    }

    // Create the prompt for detailed analysis
    const prompt = `
      You are a digital wellness expert creating a comprehensive analysis of a user's digital habits.
      Based on their detailed quiz responses and associated traits, provide an in-depth report.
      
      Quiz Analysis Context:
      ${JSON.stringify(formattedAnalysis, null, 2)}
      
      Last Updated: ${lastUpdated}
      
      Please provide a JSON object with this exact structure:
      {
        "detailedAnalysis": {
          "personality": "Detailed personality analysis based on answer patterns and trait combinations",
          "behaviorPatterns": ["List of 3-5 behavior patterns identified from responses and trait analysis"],
          "riskAssessment": "Detailed risk assessment based on concerning patterns and negative traits"
        },
        "improvementPlan": {
          "shortTerm": ["List of 3-5 short-term actions based on immediate needs and trait combinations"],
          "longTerm": ["List of 3-5 long-term strategies based on patterns and trait distribution"],
          "goals": ["List of 3-5 specific goals tailored to their habits and trait analysis"]
        },
        "actionItems": ["List of 5-7 specific action items based on their answers and trait combinations"],
        "conclusion": "A comprehensive conclusion based on their digital habits and trait analysis"
      }
      
      Make the analysis specific, actionable, and focused on improving digital wellness. Consider both the answers and their associated traits to provide a comprehensive analysis.
      IMPORTANT: Return ONLY the JSON object, without any additional text or markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsedResponse = parseAIResponse(text);
    if (!parsedResponse) {
      throw new Error('Failed to parse AI response');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error in detailed report generation:', error);
    throw error;
  }
}; 