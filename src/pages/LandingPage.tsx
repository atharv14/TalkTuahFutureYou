import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import OnboardingQuestionnaire from '@/components/onboarding/OnboardingQuestionnaire';

const LandingPage: React.FC = () => {
  const [startOnboarding, setStartOnboarding] = React.useState(false);

  if (startOnboarding) {
    return <OnboardingQuestionnaire />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-400">
          TalkTuahFutureYou
        </h1>
        
        <p className="text-xl text-gray-600">
          Experience a conversation with your future self and discover how your 
          financial decisions today shape your tomorrow.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg"
            onClick={() => setStartOnboarding(true)}
            className="text-lg px-8 py-6 bg-gray-700 hover:bg-gray-900 text-white transition-colors"
          >
            Start Your Journey
          </Button>
        </motion.div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2 * index }
              }}
              className="p-6 bg-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Quick Insights",
    description: "Get tailored financial advice based on your goals and preferences"
  },
  {
    title: "Future Perspective",
    description: "See how today's decisions impact your financial future"
  },
  {
    title: "AI-Powered Chat",
    description: "Natural conversations with your AI-generated future self"
  }
];

export default LandingPage;