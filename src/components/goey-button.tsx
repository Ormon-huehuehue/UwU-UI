'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';

// Gooey Effect Component
interface GooeyEffectProps {
  intensity?: number;
  id?: string;
  className?: string;
}

const GooeyEffect: React.FC<GooeyEffectProps> = ({ 
  intensity = 7, 
  id: providedId,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceId = useMemo(() => generateRandomString(), []);
  const id = providedId ? hash(providedId) : instanceId;
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.parentElement?.parentElement;
      if (parent) {
        setParentId(parent.id || parent.className || '');
      }
    }

    return () => {
      if (ref.current) {
        const parent = ref.current.parentElement?.parentElement;
        if (parent) {
          parent.style.filter = '';
        }
      }
    };
  }, []);

  const isSafari = () => {
    if (typeof navigator === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  return (
    <div ref={ref} className={`gooey-component ${className}`} style={{ display: 'none' }}>
      {!isSafari() && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              ${parentId ? `div:has(> .delete-button-container) { filter: url(#goo-${id}) !important }` : ''}
            `
          }}
        />
      )}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id={`goo-${id}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={intensity} result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

// Delete Button Component
interface DeleteButtonProps {
  onDelete?: () => void;
  onCancel?: () => void;
  className?: string;
  variant?: 'default' | 'confirm' | 'going-back';
}

type ButtonVariant = 'default' | 'confirm' | 'going-back';

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onDelete, 
  onCancel, 
  className = '',
  variant: controlledVariant
}) => {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [isPressed, setIsPressed] = useState(false);

  // Use controlled variant if provided, otherwise use internal state
  const currentVariant = controlledVariant || variant;

  const handleDeleteClick = () => {
    if (currentVariant === 'default') {
      setVariant('confirm');
    }
  };

  const handleConfirmClick = () => {
    onDelete?.();
    // Optionally reset to default after a delay
    setTimeout(() => setVariant('default'), 300);
  };

  const handleCancelClick = () => {
    setVariant('going-back');
    setTimeout(() => {
      setVariant('default');
      onCancel?.();
    }, 300);
  };

  const transitions = {
    spring: { type: 'spring', bounce: 0.3, duration: 1 },
    springFast: { type: 'spring', bounce: 0.3, duration: 0.7, delay: 0.05 }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      backgroundColor: 'rgb(225, 34, 7)',
      borderRadius: '16px',
      scale: 1
    };

    switch (currentVariant) {
      case 'confirm':
        return { ...baseStyles, backgroundColor: 'rgb(0, 0, 0)' };
      case 'going-back':
        return { ...baseStyles, backgroundColor: 'rgb(0, 0, 0)', scale: 0.9 };
      default:
        return isPressed 
          ? { ...baseStyles, backgroundColor: 'rgb(0, 0, 0)', scale: 0.9 }
          : baseStyles;
    }
  };

  const getTextOpacity = (textType: 'delete' | 'confirm') => {
    if (textType === 'delete') {
      return currentVariant === 'default' ? 1 : 0;
    } else {
      return currentVariant === 'confirm' || currentVariant === 'going-back' ? 1 : 0;
    }
  };

  const getCloseButtonStyles = () => {
    return {
      backgroundColor: 'rgb(0, 0, 0)',
      borderRadius: '100px',
      right: currentVariant === 'confirm' ? '-56px' : '5px'
    };
  };

  const getIconRotation = () => {
    return currentVariant === 'confirm' ? 0 : 60;
  };

  return (
    <MotionConfig transition={transitions.spring}>
      <div className={`delete-button-container ${className}`}>
        <motion.div
          className="delete-button-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            cursor: currentVariant === 'default' ? 'pointer' : 'default',
            width: 'min-content',
            height: 'min-content'
          }}
          onTap={currentVariant === 'default' ? handleDeleteClick : undefined}
          onTapStart={() => setIsPressed(true)}
          onTapEnd={() => setIsPressed(false)}
          onTapCancel={() => setIsPressed(false)}
        >
          {/* Main Button */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 26px',
              height: '44px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
              overflow: 'hidden',
              ...getButtonStyles()
            }}
            animate={getButtonStyles()}
            transition={transitions.spring}
          >
            {/* Delete Text */}
            <MotionConfig transition={transitions.springFast}>
              <motion.p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  color: 'rgb(255, 255, 255)',
                  margin: 0,
                  whiteSpace: 'pre',
                  userSelect: 'none'
                }}
                animate={{ opacity: getTextOpacity('delete') }}
              >
                Delete
              </motion.p>
            </MotionConfig>

            {/* Confirm Text */}
            <MotionConfig transition={transitions.springFast}>
              <motion.p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  color: 'rgb(255, 255, 255)',
                  margin: 0,
                  whiteSpace: 'pre',
                  userSelect: 'none',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}
                animate={{ opacity: getTextOpacity('confirm') }}
              >
                Confirm
              </motion.p>
            </MotionConfig>
          </motion.div>

          {/* Close Button */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentVariant === 'confirm' ? 'pointer' : 'default',
              zIndex: 1,
              ...getCloseButtonStyles()
            }}
            animate={getCloseButtonStyles()}
            onTap={currentVariant === 'confirm' ? handleCancelClick : undefined}
          >
            <motion.div
              style={{
                width: '20px',
                height: '20px',
                overflow: 'hidden'
              }}
              animate={{ rotateX: getIconRotation() }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <path
                  d="M 3.492 3.492 C 3.98 3.004 4.77 3.004 5.258 3.492 L 10 8.232 L 14.742 3.49 C 15.232 3.017 16.012 3.024 16.494 3.506 C 16.976 3.988 16.982 4.768 16.508 5.258 L 11.768 10 L 16.51 14.742 C 16.983 15.232 16.976 16.012 16.494 16.494 C 16.012 16.976 15.232 16.982 14.742 16.508 L 10 11.768 L 5.258 16.51 C 4.768 16.983 3.988 16.976 3.506 16.494 C 3.024 16.012 3.018 15.232 3.492 14.742 L 8.232 10 L 3.49 5.258 C 3.003 4.77 3.003 3.98 3.49 3.492 Z"
                  fill="rgb(255, 255, 255)"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gooey Effect */}
        <GooeyEffect intensity={7} />
      </div>
    </MotionConfig>
  );
};

// Utility functions
function generateRandomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function hash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}

export default DeleteButton;