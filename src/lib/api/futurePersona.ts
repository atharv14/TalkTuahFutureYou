// src/lib/api/futurePersona.ts
import { OnboardingAnswer } from '@/types/onboarding';
import { openai } from './openai';
import { FuturePersona } from '@/types/chat';

const cleanJsonString = (str: string): string => {
  // Remove Markdown code blocks and any other formatting
  let cleanedStr = str.replace(/```json\s?|\s?```/g, '').trim();
  // Remove any other Markdown formatting if present
  cleanedStr = cleanedStr.replace(/^`|`$/g, '').trim();
  return cleanedStr;
};

export const generateFuturePersona = async (
  answers: OnboardingAnswer[]
): Promise<FuturePersona> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system" as const,
          content: `You are an AI creating a future financial persona. 
                   Respond ONLY with a JSON object, no markdown formatting, following exactly this structure:
                   {
                     "personality": "Brief description of future self's personality",
                     "goals": ["List of 3-5 achieved goals"],
                     "achievedMilestones": ["List of 3-5 key financial milestones"]
                   }`
        },
        {
          role: "user" as const,
          content: `Create a future persona based on these answers:\n${
            answers.map(a => `${a.questionId}: ${Array.isArray(a.answer) ? a.answer.join(', ') : a.answer}`).join('\n')
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    try {
      // Clean and parse the response
      const cleanedContent = cleanJsonString(content);
      console.log('Cleaned content:', cleanedContent); // For debugging
      
      const parsedResponse = JSON.parse(cleanedContent);
      
      // Transform to FuturePersona type
      const persona: FuturePersona = {
        personality: parsedResponse.personality || '',
        achievedGoals: parsedResponse.goals || [],
        milestones: parsedResponse.achievedMilestones || []
      };

      return persona;
    } catch (error) {
      console.error('Error parsing response:', error);
      console.error('Raw content:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('Error generating future persona:', error);
    throw error;
  }
};

export const generateChatResponse = async (
  message: string,
  context: {
    answers: OnboardingAnswer[];
    futurePersona: FuturePersona;
  }
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system" as const,
          content: `You are the user's future self from 2034. 
                   Your personality: ${context.futurePersona.personality}
                   You've achieved: ${context.futurePersona.achievedGoals.join(', ')}
                   Key milestones: ${context.futurePersona.milestones.join(', ')}
                   Speak in first person and reference these achievements when relevant.
                   Be encouraging but realistic. Keep responses concise and also a little bit of sarcasm.
                   You can use emojis to add tone.`,
        },
        {
          role: "user" as const,
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || 
      "I'm having trouble connecting with your future self. Please try again.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};