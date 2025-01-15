import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useAppStore from '@/lib/store/appStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { generateDefaultScenario } from '@/lib/utils/timeline';
import ScenarioComparison from './ScenarioComparison';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
// import { Slider } from '@/components/ui/slider';


interface TimelineVisualizerProps {
    isVisible: boolean;
    onClose: () => void;
}

const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({
    isVisible,
    onClose
}) => {
    const { userProfile, setTimeRange, updateTimelineData } = useAppStore();
    const [showComparison, setShowComparison] = React.useState(false);

    const activeScenario = userProfile?.timeline?.scenarios.find(
        s => s.id === userProfile.timeline?.activeScenarioId
    );

    const comparisonScenario = userProfile?.timeline?.scenarios.find(
        s => s.id === userProfile.timeline?.comparisonScenarioId
    );

    const currentTimeRange = userProfile?.timeline?.timeRange || '5years';

    const metricsData = useMemo(() => {
        if (!activeScenario) {
            console.log('No active scenario');
            return [];
        }

        const timeRange = userProfile?.timeline?.timeRange || '5years';
        console.log('Current timeRange:', timeRange);
        console.log('Active Scenario:', activeScenario);
        console.log('Comparison Scenario:', comparisonScenario);

        const monthsToShow = {
            '1year': 12,
            '5years': 60,
            '10years': 120
        }[timeRange];

        // Take exactly the number of months we need
        const baseMetrics = activeScenario.metrics.slice(0, (monthsToShow + 1) * 3);
        console.log('Base Metrics:', baseMetrics);
        const comparisonMetrics = comparisonScenario?.metrics.slice(0, (monthsToShow + 1) * 3);

        // Group by month
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupedByMonth = baseMetrics.reduce((acc: { [key: string]: any }, metric) => {
            const date = new Date(metric.date);
            const monthKey = formatDate(date, 'MMM yyyy');

            if (!acc[monthKey]) {
                acc[monthKey] = {
                    date: monthKey,
                    savings: 0,
                    investment: 0,
                    income: 0,
                    compSavings: 0,
                    compInvestment: 0,
                    compIncome: 0,
                };
            }

            acc[monthKey][metric.type] = Math.round(metric.amount);
            return acc;
        }, {});

        // Add comparison metrics if they exist
        if (comparisonMetrics && showComparison) {
            comparisonMetrics.forEach(metric => {
                const date = new Date(metric.date);
                const monthKey = formatDate(date, 'MMM yyyy');
                if (groupedByMonth[monthKey]) {
                    groupedByMonth[monthKey][`comp${metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}`] =
                        Math.round(metric.amount);
                }
            });
        }

        const finalData = Object.values(groupedByMonth);
        console.log('Final Grouped Data:', finalData);
        return finalData;
    }, [activeScenario, comparisonScenario, showComparison, userProfile?.timeline?.timeRange]);

    const handleTimeRangeChange = (value: '1year' | '5years' | '10years') => {
        setTimeRange(value);
        if (userProfile?.answers && activeScenario) {
            const newScenario = generateDefaultScenario(userProfile.answers, value);
            updateTimelineData(activeScenario.id, newScenario.metrics);
        }
    };

    if (!isVisible || !activeScenario) return null;
    console.log('Sample data point:', metricsData[0]);
    return (
        <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[90vw] h-[80vh] p-6">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl">Financial Timeline</DialogTitle>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <Select
                            value={userProfile?.timeline?.timeRange}
                            onValueChange={handleTimeRangeChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1year">1 Year</SelectItem>
                                <SelectItem value="5years">5 Years</SelectItem>
                                <SelectItem value="10years">10 Years</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={showComparison}
                                onCheckedChange={setShowComparison}
                            />
                            <Label>Show Comparison</Label>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row gap-4 h-[calc(100%-80px)]">
                    <div className="flex-1 min-h-[300px] lg:min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={metricsData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    interval={currentTimeRange === '1year' ? 1 : 'preserveStartEnd'}
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                    width={80}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    wrapperStyle={{
                                        paddingBottom: "20px"
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="investment"
                                    name="Investments"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                />
                                <Line
                                    type="monotone"
                                    dataKey="savings"
                                    name="Savings"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Monthly Income"
                                    stroke="#ffc658"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                />

                                {/* Comparison Lines */}
                                {showComparison && (
                                    <>
                                        <Line
                                            type="monotone"
                                            dataKey="compInvestment"
                                            name="Comparison Investments"
                                            stroke="#2E8B57"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            dot={false}
                                            connectNulls
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="compSavings"
                                            name="Comparison Savings"
                                            stroke="#4B0082"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            dot={false}
                                            connectNulls
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="compIncome"
                                            name="Comparison Income"
                                            stroke="#FF8C00"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            dot={false}
                                            connectNulls
                                        />
                                    </>
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {showComparison && activeScenario && (
                        <div className="g:w-80 shrink-0">
                            <ScrollArea className="h-full">
                                <ScenarioComparison baseScenario={activeScenario} />
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TimelineVisualizer;