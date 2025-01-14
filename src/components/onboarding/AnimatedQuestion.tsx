import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface AnimatedQuestionProps {
  children: React.ReactNode;
  isActive: boolean;
}

const AnimatedQuestion: React.FC<AnimatedQuestionProps> = ({
  children,
  isActive,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedQuestion;