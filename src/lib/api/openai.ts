import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is missing. Please check your .env file.');
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, proxy through backend
});

// export interface PersonaResponse {
//   personality: string;
//   goals: string[];
//   achievedMilestones: string[];
// }

// export const generateFuturePersona = async (
//   answers: OnboardingAnswer[]
// ): Promise<PersonaResponse> => {
//   try {
//     const prompt = createPersonaPrompt(answers);
    
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are an AI that creates detailed future personas based on financial goals and preferences. Generate realistic, encouraging, but grounded future scenarios."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     const content = response.choices[0]?.message?.content;
//     if (!content) throw new Error('No response from OpenAI');

//     return parsePersonaResponse(content);
//   } catch (error) {
//     console.error('Error generating future persona:', error);
//     throw error;
//   }
// };

// const createPersonaPrompt = (answers: OnboardingAnswer[]): string => {
//   const answersText = answers
//     .map(a => `${a.questionId}: ${Array.isArray(a.answer) ? a.answer.join(', ') : a.answer}`)
//     .join('\n');

//   return `Based on the following questionnaire answers, create a future persona:
  
// ${answersText}

// Respond with a JSON object containing:
// {
//   "personality": "A brief description of the future self's personality and mindset",
//   "goals": ["List of achieved and new goals"],
//   "achievedMilestones": ["List of key financial milestones achieved"]
// }`;
// };

// const parsePersonaResponse = (content: string): PersonaResponse => {
//   try {
//     const response = JSON.parse(content);
//     return {
//       personality: response.personality || '',
//       goals: response.goals || [],
//       achievedMilestones: response.achievedMilestones || [],
//     };
//   } catch (error) {
//     console.error('Error parsing persona response:', error);
//     throw new Error('Invalid response format from OpenAI');
//   }
// };