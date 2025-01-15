// src/components/onboarding/OnboardingQuestionnaire.tsx
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { questions } from '@/data/onboardingQuestions';
import { OnboardingAnswer } from '@/types/onboarding';
import useAppStore from '@/lib/store/appStore';
import { generateFuturePersona } from '@/lib/api/futurePersona';
import SingleChoiceQuestion from './questions/SingleChoiceQuestions';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestions';
import SliderQuestion from './questions/SliderQuestion';
import TextQuestion from './questions/TextQuestion';
import OnboardingProgress from './OnboardingProgress';
import AnimatedQuestion from './AnimatedQuestion';
import { Loader2 } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { generateDefaultScenario } from '@/lib/utils/timeline';

const OnboardingQuestionnaire: React.FC = () => {
    // State Management
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hooks
    const { toast } = useToast();
    const { updateAnswers, setOnboarded, updateFuturePersona, setUserProfile } = useAppStore();

    // Current Question Setup
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(
        a => a.questionId === currentQuestion.id
    );

    // Validation
    const validateAnswer = useCallback(() => {
        if (!currentAnswer && currentQuestion.required) {
            setError('Please answer this question before continuing');
            return false;
        }
        setError(null);
        return true;
    }, [currentAnswer, currentQuestion]);

    // Answer Handler
    const handleAnswer = useCallback((answer: OnboardingAnswer) => {
        setError(null);
        setAnswers(prev => {
            const existingIndex = prev.findIndex(a => a.questionId === answer.questionId);
            if (existingIndex >= 0) {
                const newAnswers = [...prev];
                newAnswers[existingIndex] = answer;
                return newAnswers;
            }
            return [...prev, answer];
        });
    }, []);

    // Navigation Handlers
    const handleComplete = useCallback(async () => {
        if (!validateAnswer()) return;

        setIsLoading(true);
        try {
            const persona = await generateFuturePersona(answers);

            // Generate initial timeline scenario
            const defaultScenario = generateDefaultScenario(answers);
            console.log('Generated Default Scenario:', defaultScenario);

            const initialTimeline = {
                scenarios: [defaultScenario],
                activeScenarioId: defaultScenario.id,
                comparisonScenarioId: null,
                timeRange: '5years' as const
            };

            updateAnswers(answers);
            updateFuturePersona(persona);

            const newProfile = {
                answers,
                futurePersona: persona,
                timeline: initialTimeline
            };

            setUserProfile(newProfile);
            setOnboarded(true);

            toast({
                title: "Profile Created!",
                description: "Your future self is ready to chat with you.",
            });
        } catch (err) {
            toast({
                title: "Error:" + console.error(err),
                description: "Failed to generate your future profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [validateAnswer, answers, updateAnswers, updateFuturePersona, setOnboarded, setUserProfile, toast]);

    const handleNext = useCallback(() => {
        if (!validateAnswer()) return;

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleComplete();
        }
    }, [currentQuestionIndex, validateAnswer, handleComplete]);

    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setError(null);
        }
    }, [currentQuestionIndex]);

    // Question Renderer
    const renderQuestion = useCallback(() => {
        switch (currentQuestion.type) {
            case 'single':
                return (
                    <SingleChoiceQuestion
                        question={currentQuestion.question}
                        description={currentQuestion.description}
                        options={currentQuestion.options || []}
                        value={currentAnswer?.answer as string}
                        onChange={(value) => handleAnswer({
                            questionId: currentQuestion.id,
                            answer: value
                        })}
                    />
                );

            case 'multiple':
                return (
                    <MultipleChoiceQuestion
                        question={currentQuestion.question}
                        description={currentQuestion.description}
                        options={currentQuestion.options || []}
                        value={currentAnswer?.answer as string[] || []}
                        onChange={(value) => handleAnswer({
                            questionId: currentQuestion.id,
                            answer: value
                        })}
                    />
                );

            case 'slider':
                return (
                    <SliderQuestion
                        question={currentQuestion.question}
                        description={currentQuestion.description}
                        min={currentQuestion.min || 0}
                        max={currentQuestion.max || 10}
                        value={currentAnswer?.answer as number ||
                            (currentQuestion.min || 0)}
                        onChange={(value) => handleAnswer({
                            questionId: currentQuestion.id,
                            answer: value
                        })}
                    />
                );

            case 'text':
                return (
                    <TextQuestion
                        question={currentQuestion.question}
                        description={currentQuestion.description}
                        value={currentAnswer?.answer as string || ''}
                        onChange={(value) => handleAnswer({
                            questionId: currentQuestion.id,
                            answer: value
                        })}
                    />
                );

            default:
                return null;
        }
    }, [currentQuestion, currentAnswer, handleAnswer]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-center">Shape Your Financial Future</CardTitle>
                    <OnboardingProgress
                        currentStep={currentQuestionIndex}
                        totalSteps={questions.length}
                    />
                </CardHeader>
                <CardContent>
                    <AnimatedQuestion isActive={true}>
                        {renderQuestion()}
                    </AnimatedQuestion>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <div className="mt-6 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0 || isLoading}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingQuestionnaire;