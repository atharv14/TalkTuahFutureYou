import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TimelineScenario } from '@/types/timeline';
import useAppStore from '@/lib/store/appStore';
import { v4 as uuidv4 } from 'uuid';
import { generateFinancialMetrics, getIncomeFromAnswers } from '@/lib/utils/timeline';

interface ScenarioComparisonProps {
    baseScenario: TimelineScenario;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ baseScenario }) => {
    const { toast } = useToast();
    const { userProfile, updateTimelineData, setComparisonScenario } = useAppStore();

    const [params, setParams] = React.useState({
        savingsRate: baseScenario.assumptions.savingsRate,
        investmentReturn: baseScenario.assumptions.investmentReturn,
        additionalIncome: 0,
        debtPayment: 0
    });

    const handleCreateComparison = () => {
        if (!userProfile?.answers) {
            toast({
                title: "Error",
                description: "User profile not found.",
                variant: "destructive",
            });
            return;
        }

        try {
            const newScenario: TimelineScenario = {
                id: uuidv4(),
                name: "Comparison Scenario",
                description: `Modified scenario with ${params.savingsRate}% savings rate and ${params.investmentReturn}% return`,
                metrics: generateFinancialMetrics({
                    income: getIncomeFromAnswers(userProfile.answers),
                    savingsRate: params.savingsRate,
                    investmentReturn: params.investmentReturn,
                    timeRange: userProfile.timeline?.timeRange || '5years',
                    additionalIncome: params.additionalIncome,
                    debtPayment: params.debtPayment
                }),
                assumptions: {
                    savingsRate: params.savingsRate,
                    investmentReturn: params.investmentReturn,
                    inflationRate: 2.5
                }
            };

            // Update the store with the new scenario
            updateTimelineData(newScenario.id, newScenario.metrics);
            setComparisonScenario(newScenario.id);

            toast({
                title: "Success",
                description: "Comparison scenario updated.",
            });
        } catch (error) {
            console.error('Error creating comparison:', error);
            toast({
                title: "Error",
                description: "Failed to create comparison scenario.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="p-4 space-y-6">
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Monthly Savings Rate (%)</Label>
                    <Slider
                        value={[params.savingsRate]}
                        onValueChange={([value]) => setParams(p => ({ ...p, savingsRate: value }))}
                        min={0}
                        max={50}
                        step={1}
                        // className="py-4"
                    />
                    <span className="text-sm text-muted-foreground">{params.savingsRate}%</span>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Expected Investment Return (%)</Label>
                    <Slider
                        value={[params.investmentReturn]}
                        onValueChange={([value]) => setParams(p => ({ ...p, investmentReturn: value }))}
                        min={0}
                        max={15}
                        step={0.5}
                        // className="py-4"
                    />
                    <span className="text-sm text-muted-foreground">{params.investmentReturn}%</span>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Additional Monthly Income ($)</Label>
                    <Slider
                        value={[params.additionalIncome]}
                        onValueChange={([value]) => setParams(p => ({ ...p, additionalIncome: value }))}
                        min={0}
                        max={5000}
                        step={100}
                        // className="py-4"
                    />
                    <span className="text-sm text-muted-foreground">${params.additionalIncome}</span>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Monthly Debt Payment ($)</Label>
                    <Slider
                        value={[params.debtPayment]}
                        onValueChange={([value]) => setParams(p => ({ ...p, debtPayment: value }))}
                        min={0}
                        max={2000}
                        step={50}
                        // className="py-4"
                    />
                    <span className="text-sm text-muted-foreground">${params.debtPayment}</span>
                </div>

                <Button
                    onClick={handleCreateComparison}
                    className="w-full"
                    variant="default"
                >
                    Generate Comparison
                </Button>
            </CardContent>
        </Card>
    );
};

export default ScenarioComparison;