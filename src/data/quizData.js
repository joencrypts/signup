const quizData = [
  // General Usage Awareness
  {
    question: 'How many hours a day do you spend online (on average)?',
    options: [
      { label: 'Less than 1 hour', traits: { Detached: 2 } },
      { label: '1–3 hours', traits: { Mindful: 1 } },
      { label: '3–5 hours', traits: { Curious: 1, Influenced: 1 } },
      { label: '5+ hours', traits: { Impulsive: 2, Influenced: 1 } },
    ],
  },
  {
    question: 'Do you often find yourself scrolling without a purpose?',
    options: [
      { label: 'Always', traits: { Impulsive: 2, Detached: 1 } },
      { label: 'Sometimes', traits: { Impulsive: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Disciplined: 2 } },
    ],
  },
  {
    question: 'Do you frequently multitask with digital devices?',
    options: [
      { label: 'Yes, always', traits: { Impulsive: 2 } },
      { label: 'Often', traits: { Influenced: 1 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
    ],
  },
  {
    question: 'How often do you take digital detoxes?',
    options: [
      { label: 'Regularly', traits: { Disciplined: 2 } },
      { label: 'Sometimes', traits: { Mindful: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },

  // Digital Wellness & Mental Health
  {
    question: 'Do you feel anxious or stressed if you can’t check your phone for a while?',
    options: [
      { label: 'Extremely', traits: { Impulsive: 2 } },
      { label: 'A little', traits: { Impulsive: 1 } },
      { label: 'Not really', traits: { Mindful: 1 } },
      { label: 'Not at all', traits: { Detached: 2, Mindful: 1 } },
    ],
  },
  {
    question: 'Do you compare yourself to others based on what you see online?',
    options: [
      { label: 'Frequently', traits: { Influenced: 2 } },
      { label: 'Sometimes', traits: { Influenced: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Guarded: 2 } },
    ],
  },
  {
    question: 'Do you feel mentally drained or unproductive after spending time online?',
    options: [
      { label: 'Very often', traits: { Impulsive: 2 } },
      { label: 'Occasionally', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Disciplined: 2 } },
    ],
  },
  {
    question: 'Do you frequently check your phone right after waking up or before sleeping?',
    options: [
      { label: 'Always', traits: { Impulsive: 2 } },
      { label: 'Sometimes', traits: { Impulsive: 1 } },
      { label: 'Rarely', traits: { Disciplined: 1 } },
      { label: 'Never', traits: { Mindful: 2 } },
    ],
  },
  {
    question: 'Do you feel more connected or isolated because of your digital habits?',
    options: [
      { label: 'Very connected', traits: { Expressive: 2 } },
      { label: 'Somewhat connected', traits: { Curious: 1 } },
      { label: 'Isolated', traits: { Detached: 2 } },
      { label: 'No major change', traits: { Mindful: 1 } },
    ],
  },

  // Privacy & Security
  {
    question: 'How often do you read privacy policies before accepting them?',
    options: [
      { label: 'Always', traits: { Guarded: 2 } },
      { label: 'Sometimes', traits: { Mindful: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },
  {
    question: 'Do you use the same password across multiple sites?',
    options: [
      { label: 'Always', traits: { Impulsive: 2 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Disciplined: 1 } },
      { label: 'Never', traits: { Guarded: 2 } },
    ],
  },
  {
    question: 'Have you ever experienced a phishing scam or data leak?',
    options: [
      { label: 'Yes, multiple times', traits: { Influenced: 2 } },
      { label: 'Once', traits: { Curious: 1 } },
      { label: 'No, but I’m worried about it', traits: { Guarded: 1 } },
      { label: 'Never', traits: { Guarded: 2 } },
    ],
  },
  {
    question: 'Do you use tools like VPNs, ad blockers, or password managers?',
    options: [
      { label: 'Yes, regularly', traits: { Guarded: 2, Disciplined: 1 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },
  {
    question: 'Do you review app permissions regularly?',
    options: [
      { label: 'Yes, always', traits: { Guarded: 2 } },
      { label: 'Occasionally', traits: { Mindful: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },

  // Misinformation & Influence
  {
    question: 'Have you ever shared a news article online without verifying the source?',
    options: [
      { label: 'Frequently', traits: { Influenced: 2 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Guarded: 2 } },
    ],
  },
  {
    question: 'Do you often get your news mainly from social media?',
    options: [
      { label: 'Yes, always', traits: { Influenced: 2 } },
      { label: 'Mostly', traits: { Curious: 1 } },
      { label: 'Sometimes', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Guarded: 2 } },
    ],
  },
  {
    question: 'Do you feel that the content you’re shown is tailored to influence your opinions or emotions?',
    options: [
      { label: 'Absolutely', traits: { Influenced: 2 } },
      { label: 'Somewhat', traits: { Curious: 1 } },
      { label: 'Not sure', traits: { Detached: 1 } },
      { label: 'Not really', traits: { Guarded: 1 } },
    ],
  },
  {
    question: 'Have you noticed your beliefs becoming more extreme due to the content you consume online?',
    options: [
      { label: 'Yes, strongly', traits: { Influenced: 2 } },
      { label: 'A bit', traits: { Curious: 1 } },
      { label: 'Not really', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Disciplined: 2 } },
    ],
  },

  // Digital Identity
  {
    question: 'Do you use filters or editing tools frequently on your photos?',
    options: [
      { label: 'Always', traits: { Expressive: 2 } },
      { label: 'Sometimes', traits: { Influenced: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Detached: 2 } },
    ],
  },
  {
    question: 'Do you feel pressure to present yourself a certain way online?',
    options: [
      { label: 'Yes, always', traits: { Influenced: 2 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Rarely', traits: { Mindful: 1 } },
      { label: 'Never', traits: { Detached: 2 } },
    ],
  },
  {
    question: 'Do you have different personas across platforms?',
    options: [
      { label: 'Yes, totally', traits: { Expressive: 2 } },
      { label: 'A little', traits: { Influenced: 1 } },
      { label: 'Not really', traits: { Curious: 1 } },
      { label: 'Nope', traits: { Mindful: 1 } },
    ],
  },
  {
    question: 'Do you feel more yourself online or offline?',
    options: [
      { label: 'Online', traits: { Expressive: 2 } },
      { label: 'Both equally', traits: { Curious: 1 } },
      { label: 'Offline', traits: { Disciplined: 1 } },
      { label: 'Neither', traits: { Detached: 2 } },
    ],
  },

  // Bonus / Final Check
  {
    question: 'Do you intentionally curate your digital experience (e.g., mute/unfollow/block)?',
    options: [
      { label: 'Yes, regularly', traits: { Guarded: 2 } },
      { label: 'Occasionally', traits: { Mindful: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },
  {
    question: 'Do you set screen time limits or use focus modes?',
    options: [
      { label: 'Always', traits: { Disciplined: 2 } },
      { label: 'Sometimes', traits: { Mindful: 1 } },
      { label: 'Rarely', traits: { Influenced: 1 } },
      { label: 'Never', traits: { Impulsive: 1 } },
    ],
  },
  {
    question: 'Do you feel like your digital habits align with your values?',
    options: [
      { label: 'Yes, completely', traits: { Mindful: 2 } },
      { label: 'Mostly', traits: { Disciplined: 1 } },
      { label: 'Sometimes', traits: { Curious: 1 } },
      { label: 'Not at all', traits: { Impulsive: 1 } },
    ],
  },
];

export default quizData;
