'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextShimmerProps {
  className?: string;
  style?: React.CSSProperties;
}

const TextShimmer: React.FC<TextShimmerProps> = ({ 
  className = "",
  style = {}
}) => {
  const [variant, setVariant] = useState<'IOngpcJws' | 'vX7vyFWHI'>('IOngpcJws');

  useEffect(() => {
    const timer = setTimeout(() => {
      setVariant(prev => prev === 'IOngpcJws' ? 'vX7vyFWHI' : 'IOngpcJws');
    }, 1000);

    return () => clearTimeout(timer);
  }, [variant]);

  const transition1 = {
    bounce: 0,
    delay: 0,
    duration: 0.8,
    type: "spring" as const
  };

  return (
    <motion.div
      className={`framer-text-shimmer ${className}`}
      style={{
        height: '56px',
        overflow: 'hidden',
        position: 'relative',
        width: '268px',
        ...style
      }}
      initial={false}
      animate={variant}
      transition={transition1}
      variants={{
        IOngpcJws: {
          mask: "linear-gradient(94deg, rgba(0, 0, 0, 0.5) -43%, rgb(0, 0, 0) -22%, rgba(0, 0, 0, 0.5) -2%)",
          WebkitMask: "linear-gradient(94deg, rgba(0, 0, 0, 0.5) -43%, rgb(0, 0, 0) -22%, rgba(0, 0, 0, 0.5) -2%)"
        },
        vX7vyFWHI: {
          mask: "linear-gradient(94deg, rgba(0, 0, 0, 0.5) 107%, rgb(0, 0, 0) 127%, rgba(0, 0, 0, 0.5) 150%)",
          WebkitMask: "linear-gradient(94deg, rgba(0, 0, 0, 0.5) 107%, rgb(0, 0, 0) 127%, rgba(0, 0, 0, 0.5) 150%)"
        }
      }}
    >
      <motion.div
        style={{
          flex: 'none',
          height: 'auto',
          left: '50%',
          position: 'absolute',
          top: '50%',
          whiteSpace: 'pre',
          width: 'auto',
          transform: 'translate(-50%, -50%)',
          fontFamily: '"Inter", "Inter Placeholder", sans-serif',
          fontSize: '10px',
          fontWeight: '600',
          color: 'rgb(69, 68, 68)',
        }}
      >
        2 seats remaining
      </motion.div>
    </motion.div>
  );
};

export default TextShimmer;