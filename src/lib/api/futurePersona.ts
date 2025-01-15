// src/lib/api/futurePersona.ts
import { TimelineScenario } from '@/types/timeline';
import { OnboardingAnswer } from '@/types/onboarding';
import { FuturePersona, ChatCompletionMessage } from '@/types/chat';
import { openai } from './openai';
import { formatFinancialContext, formatGoalsContext } from '@/lib/utils/formatContext';

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
          role: "system",
          content: `You are an AI creating a future financial persona. 
                   Respond ONLY with a JSON object, no markdown formatting, following exactly this structure:
                   {
                     "personality": "Brief description of future self's personality",
                     "goals": ["List of 3-5 achieved goals"],
                     "achievedMilestones": ["List of 3-5 key financial milestones"]
                   }`
        },
        {
          role: "user",
          content: `Create a future persona based on these answers:\n${answers.map(a => `${a.questionId}: ${Array.isArray(a.answer) ? a.answer.join(', ') : a.answer}`).join('\n')
            }`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    try {
      const cleanedContent = cleanJsonString(content);
      console.log('Cleaned content:', cleanedContent);

      const parsedResponse = JSON.parse(cleanedContent);

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
    activeScenario?: TimelineScenario;
    timeRange?: '1year' | '5years' | '10years';
    previousMessages?: ChatCompletionMessage[];
  }
): Promise<string> => {
  try {
    const financialContext = context.activeScenario && context.timeRange
      ? formatFinancialContext(
        context.activeScenario.metrics,
        context.timeRange
      )
      : '';

    const goalsContext = formatGoalsContext(context.answers);

    const userName = context.answers.find(a => a.questionId === 'user_name')?.answer || '';

    const systemPrompt = `You are ${userName}'s future self from 2034.

                          ### Your Background
                          - Personality: ${context.futurePersona.personality}
                          - Achieved Goals: ${context.futurePersona.achievedGoals.join(', ')}
                          - Key Milestones: ${context.futurePersona.milestones.join(', ')}

                          ${financialContext}
                          ${goalsContext}

                          ### Response Guidelines
                          1. Address ${userName} by name occasionally to make it personal
                          2. Use markdown formatting for better readability
                          3. Reference specific numbers from their financial data when relevant
                          4. Explain the impact of their current decisions on future outcomes
                          5. Provide emotional support while staying realistic
                          6. Suggest actionable next steps based on their goals and timeline
                          7. Use emojis occasionally to add personality
                          8. Keep responses concise but informative

                          Remember to speak in first person and reference achievements when relevant.`;

    const messages: ChatCompletionMessage[] = [
      { role: "system", content: systemPrompt },
      ...(context.previousMessages?.slice(-5) || []),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content ||
      "I'm having trouble connecting with your future self. Please try again.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};