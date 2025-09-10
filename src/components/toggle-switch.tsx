'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToggleSwitchProps {
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  defaultValue = false, 
  onChange,
  className = ''
}) => {
  const [isOn, setIsOn] = useState(defaultValue);

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`flex flex-col items-center gap-2.5 ${className}`}>
      {/* Light indicator */}
      <motion.div
        className="w-2.5 h-1.5 rounded-lg"
        animate={{
          backgroundColor: isOn ? 'rgb(255, 81, 0)' : 'rgb(233, 233, 233)',
          boxShadow: isOn 
            ? '0px 0px 6px 0px rgb(255, 81, 0)' 
            : '0px 0px 6px 0px rgba(255, 81, 0, 0)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      
      {/* Switch container */}
      <motion.div
        className="relative w-20 h-10 rounded-2xl cursor-pointer p-1 border"
        onClick={handleToggle}
        animate={{
          backgroundColor: isOn ? 'rgba(232, 232, 232, 0)' : 'rgb(233, 233, 233)',
          borderColor: isOn ? 'rgb(233, 233, 233)' : 'rgba(232, 232, 232, 0)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Thumb */}
        <motion.div
          className="w-9 h-8 bg-white rounded-xl flex flex-col items-center justify-center gap-0.5 relative z-10"
          animate={{
            x: isOn ? 36 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 328,
            damping: 40,
            mass: 1
          }}
          style={{
            boxShadow: `
              inset 0px 1px 0px 0px rgb(255, 255, 255), 
              inset 0px -1px 0px 0px rgba(0, 0, 0, 0.1), 
              0px 21px 8px 0px rgba(0, 0, 0, 0.03), 
              0px 12px 7px 0px rgba(0, 0, 0, 0.09), 
              0px 5px 5px 0px rgba(0, 0, 0, 0.15), 
              0px 1px 3px 0px rgba(0, 0, 0, 0.18)
            `
          }}
        >
          {/* Dot patterns */}
          <div className="flex flex-row items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`row1-${i}`}
                className="w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgb(205, 205, 205) 0%, rgb(255, 255, 255) 100%)'
                }}
              />
            ))}
          </div>
          
          <div className="flex flex-row items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`row2-${i}`}
                className="w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgb(205, 205, 205) 0%, rgb(255, 255, 255) 100%)'
                }}
              />
            ))}
          </div>
          
          <div className="flex flex-row items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`row3-${i}`}
                className="w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgb(205, 205, 205) 0%, rgb(255, 255, 255) 100%)'
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ToggleSwitch;