import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LifeEvent, LifeEventType, TimelineScenario } from '@/types/timeline';

const LIFE_EVENT_TEMPLATES: Record<LifeEventType, Omit<LifeEvent, 'id' | 'timing'>> = {
    career_change: {
        type: 'career_change',
        name: 'Career Change',
        description: 'Switching to a new career path',
        financialImpact: {
            initialCost: 0,
            monthlyIncome: 1000, // Assumed salary increase
            savingsRateChange: 5,
        }
    },
    home_purchase: {
        type: 'home_purchase',
        name: 'Home Purchase',
        description: 'Buying a property',
        financialImpact: {
            initialCost: 50000, // Down payment
            monthlyExpense: 2000, // Mortgage payment
            savingsRateChange: -10,
        }
    },
    education: {
        type: 'education',
        name: 'Further Education',
        description: 'Investing in education or certification',
        financialImpact: {
            initialCost: 30000,
            monthlyExpense: 500,
            investmentReturnChange: 2,
        }
    },
    business_startup: {
        type: 'business_startup',
        name: 'Start a Business',
        description: 'Starting your own business',
        financialImpact: {
            initialCost: 25000,
            monthlyIncome: -2000, // Initial loss of income
            investmentReturnChange: 5,
        }
    },
    major_expense: {
        type: 'major_expense',
        name: 'Major Expense',
        description: 'Significant one-time expense',
        financialImpact: {
            initialCost: 10000,
            monthlyExpense: 200,
        }
    },
};

interface LifeEventManagerProps {
    scenario: TimelineScenario;
    onAddEvent: (event: LifeEvent) => void;
    onRemoveEvent: (eventId: string) => void;
}

const LifeEventManager: React.FC<LifeEventManagerProps> = ({
    scenario,
    onAddEvent,
    onRemoveEvent,
}) => {
    const [selectedEventType, setSelectedEventType] = React.useState<LifeEventType | null>(null);
    const [timing, setTiming] = React.useState<number>(0);

    const handleAddEvent = () => {
        if (!selectedEventType) return;

        const template = LIFE_EVENT_TEMPLATES[selectedEventType];
        const newEvent: LifeEvent = {
            id: uuidv4(),
            timing,
            ...template,
        };

        onAddEvent(newEvent);
        setSelectedEventType(null);
        setTiming(0);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Life Events</h3>
            
            {/* Existing Events */}
            <div className="space-y-2">
                {scenario.lifeEvents?.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Month {event.timing}: {event.description}
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRemoveEvent(event.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add New Event */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Add Life Event
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Life Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Event Type</Label>
                            <Select
                                value={selectedEventType || ''}
                                onValueChange={(value) => setSelectedEventType(value as LifeEventType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(LIFE_EVENT_TEMPLATES).map(([type, template]) => (
                                        <SelectItem key={type} value={type}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>When does this happen? (Month)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={120}
                                value={timing}
                                onChange={(e) => setTiming(parseInt(e.target.value))}
                            />
                        </div>

                        <Button onClick={handleAddEvent} className="w-full">
                            Add Event
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LifeEventManager;