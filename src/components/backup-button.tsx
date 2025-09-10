'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ButtonProps {
  variant?: 'backup' | 'backing-up' | 'done';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface LoaderProps {
  variant?: 'loading' | 'complete' | 'idle';
  check?: number;
}

// Loader Component
const Loader: React.FC<LoaderProps> = ({ variant = 'loading', check = 0 }) => {
  const [currentVariant, setCurrentVariant] = useState(variant);

  useEffect(() => {
    setCurrentVariant(variant);
    if (variant === 'loading') {
      const timer = setTimeout(() => {
        setCurrentVariant('complete');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [variant]);

  const isLoading = currentVariant === 'loading';
  const isComplete = currentVariant === 'complete';

  return (
    <div style={{ width: '20px', height: '20px', position: 'relative', overflow: 'visible' }}>
      {/* Check Icon */}
      <motion.div
        initial={{ opacity: check, scale: 0.2 }}
        animate={{ 
          opacity: isComplete ? 1 : check,
          scale: isComplete ? 1 : currentVariant === 'idle' ? 1 : 0.2
        }}
        transition={{ duration: 0.25, ease: [0.44, 0, 0.56, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M10 0C4.47656 0 0 4.47656 0 10C0 15.5234 4.47656 20 10 20C15.5234 20 20 15.5234 20 10C20 4.47656 15.5234 0 10 0ZM14.7344 7.68359L15.4141 6.95312L13.9531 5.58594L13.2656 6.31641L8.35156 11.5859L6.6875 10.0195L5.95312 9.33594L4.58594 10.7969L5.3125 11.4805L7.71875 13.7305L8.44531 14.4141L9.13281 13.6836L14.7344 7.68359Z" 
              fill="#D9D9D9"
            />
          </svg>
        </div>
      </motion.div>

      {/* Loading Circle - only show when loading */}
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 5, 
          bottom: 18, 
          overflow: 'visible' 
        }}>
          {/* Static outer circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px'
          }}>
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8.5" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          
          {/* Animated spinning arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.7,
              ease: [0.79, 0.07, 0.47, 1],
              repeat: Infinity,
              repeatType: 'loop'
            }}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '75%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px'
            }}>
              <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1.5A8.5 8.5 0 0 1 8.5 10" stroke="#fff" strokeWidth="3"/>
              </svg>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Main Button Component
const BackupButton: React.FC<ButtonProps> = ({ 
  variant = 'backup', 
  onClick,
  className = '',
  style = {}
}) => {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [loaderCheck, setLoaderCheck] = useState(0);

  const handleClick = () => {
    if (currentVariant === 'backup') {
      setCurrentVariant('backing-up');
      setLoaderCheck(0);
      
      // Auto transition to done after 2.8 seconds
      setTimeout(() => {
        setCurrentVariant('done');
        setLoaderCheck(1);
      }, 2800);

      // Auto reset to backup after 1.5 seconds in done state
      setTimeout(() => {
        setCurrentVariant('backup');
        setLoaderCheck(0);
      }, 4300); // 2800 + 1500
    }
    
    onClick?.();
  };

  const getButtonText = () => {
    switch (currentVariant) {
      case 'backing-up':
        return 'Backing Up';
      case 'done':
        return 'Done';
      default:
        return 'Back Up Now';
    }
  };

  const getLoaderVariant = () => {
    switch (currentVariant) {
      case 'backing-up':
        return 'loading';
      case 'done':
        return 'complete';
      default:
        return 'idle';
    }
  };

  const showLoader = currentVariant === 'backing-up' || currentVariant === 'done';

  return (
    <motion.button
      className={`backup-button ${className}`}
      onClick={handleClick}
      initial={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      style={{
        backgroundColor: 'rgb(8, 189, 113)',
        borderRadius: '1000px',
        border: 'none',
        boxShadow: 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.2), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.15)',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: '"Inter", "Inter Placeholder", sans-serif',
        height: '50px',
        padding: '0 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        position: 'relative',
        textShadow: '0px 0.5px 0px rgba(0, 0, 0, 0.15)',
        minWidth: '134.5px',
        ...style
      }}
    >
      {/* Loader Icon - absolutely positioned when showing */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            <Loader 
              variant={getLoaderVariant()}
              check={loaderCheck}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Text */}
      <span style={{ position: 'relative', zIndex: 0 }}>
        {getButtonText()}
      </span>

      {/* Animated Ring - only show in backup state */}
      {currentVariant === 'backup' && (
        <motion.div
          className="animated-ring"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ 
            duration: 0.7, 
            ease: [0.5, 0, 0.88, 0.77], 
            repeat: Infinity, 
            repeatType: 'mirror' 
          }}
          style={{
            position: 'absolute',
            top: '-6px',
            left: '-6px',
            right: '-6px',
            bottom: '-6px',
            border: '2px solid rgb(8, 189, 113)',
            borderRadius: '1000px',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}
    </motion.button>
  );
};

export default BackupButton;