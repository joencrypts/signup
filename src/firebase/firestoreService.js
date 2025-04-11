import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Create or update user's answers
export const saveUserAnswers = async (userId, answers) => {
  try {
    const userAnswersRef = doc(db, 'userAnswers', userId);
    
    // Create a document with the user's answers
    await setDoc(userAnswersRef, {
      answers,
      lastUpdated: serverTimestamp(),
      userId
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error saving user answers:', error);
    throw error;
  }
};

// Get user's answers
export const getUserAnswers = async (userId) => {
  try {
    const userAnswersRef = doc(db, 'userAnswers', userId);
    const docSnap = await getDoc(userAnswersRef);
    
    if (docSnap.exists()) {
      return docSnap.data().answers;
    }
    return null;
  } catch (error) {
    console.error('Error getting user answers:', error);
    throw error;
  }
};

// Update a specific answer
export const updateAnswer = async (userId, questionIndex, answer) => {
  try {
    const userAnswersRef = doc(db, 'userAnswers', userId);
    const docSnap = await getDoc(userAnswersRef);
    
    if (docSnap.exists()) {
      const currentAnswers = docSnap.data().answers || {};
      currentAnswers[questionIndex] = answer;
      
      await updateDoc(userAnswersRef, {
        answers: currentAnswers,
        lastUpdated: serverTimestamp()
      });
    } else {
      // If document doesn't exist, create it with the first answer
      await setDoc(userAnswersRef, {
        answers: { [questionIndex]: answer },
        lastUpdated: serverTimestamp(),
        userId
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating answer:', error);
    throw error;
  }
}; 