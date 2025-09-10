// components/Button.tsx
'use client';

import React, { useState, useId } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import TextShimmer from './TextShimmer';

interface ButtonProps {
  title?: string;
  link?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const Button: React.FC<ButtonProps> = ({ 
  title = "Buy now", 
  link = "#", 
  className = "",
  style = {},
  width = 117,
  height = 44
}) => {
  const [variant, setVariant] = useState<'ccJtameEa' | 'lRxDmf3nw'>('ccJtameEa');
  const [isHovered, setIsHovered] = useState(false);
  const layoutId = useId();

  const transition1 = {
    bounce: 0.2,
    delay: 0,
    duration: 0.4,
    type: "spring" as const
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setVariant('lRxDmf3nw');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVariant('ccJtameEa');
  };

  return (
    <LayoutGroup id={layoutId}>
      <motion.div
        animate={variant}
        initial={false}
        transition={transition1}
      >
        <Link href={link} style={{ textDecoration: 'none' }}>
          <motion.a
            className={`framer-button-root ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={variant === 'lRxDmf3nw' ? handleMouseLeave : undefined}
            style={{
              // Main container styles from .framer-f27ri3
              alignContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              gap: '10px',
              height: 'min-content',
              justifyContent: 'center',
              overflow: 'visible',
              padding: '4px',
              position: 'relative',
              textDecoration: 'none',
              width: 'min-content',
              borderRadius: '10px',
              ...style
            }}
            transition={transition1}
          >
            {/* Background with shimmer - absolute positioned */}
            <motion.div
              className="framer-bg"
              style={{
                // Styles from .framer-3dentx
                alignContent: 'center',
                alignItems: 'center',
                bottom: '0px',
                display: 'flex',
                flex: 'none',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                gap: '0px',
                justifyContent: 'flex-start',
                left: '0px',
                overflow: 'hidden',
                padding: '2px 0px 0px 0px',
                position: 'absolute',
                right: '0px',
                top: '0px',
                backgroundColor: 'rgb(243, 243, 243)',
                borderRadius: '12px',
                zIndex: 1,
              }}
              variants={{
                ccJtameEa: { top: '0px' },
                lRxDmf3nw: { top: '-23px' }
              }}
              transition={transition1}
            >
              <motion.div
                className="framer-shimmer"
                style={{
                  // Styles from .framer-1nagu1x
                  flex: 'none',
                  height: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '102px',
                  backgroundColor: 'rgb(244, 244, 244)',
                  borderRadius: '10px',
                  opacity: 0,
                  zIndex: 2,
                }}
                variants={{
                  ccJtameEa: { opacity: 0 },
                  lRxDmf3nw: { opacity: 1 }
                }}
                transition={transition1}
              >
                <div
                  style={{
                    // Styles from .framer-wx9o7a-container
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    flex: 'none',
                    height: '20px',
                    left: '0px',
                    position: 'absolute',
                    right: '-1px',
                    top: 'calc(50% - 10px)',
                    zIndex: 0,
                  }}
                >
                  <TextShimmer 
                    style={{ 
                      height: '100%', 
                      width: '100%' 
                    }} 
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Button content - main visible part */}
            <motion.div
              className="framer-button-content"
              style={{
                // Styles from .framer-dnfvxf
                alignContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flex: 'none',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                gap: '10px',
                height: '36px',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '0px 26px 0px 26px',
                position: 'relative',
                width: 'min-content',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: '8px',
                boxShadow: '0px 1px 7px 0px rgba(0, 0, 0, 0.08)',
                zIndex: 3,
              }}
            >
              <div
                style={{
                  // Styles from .framer-1vlgpym
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  flex: 'none',
                  height: 'auto',
                  position: 'relative',
                  whiteSpace: 'pre',
                  width: 'auto',
                  zIndex: 1,
                  fontFamily: '"Inter", "Inter Placeholder", sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em',
                  color: 'rgb(39, 43, 45)',
                }}
              >
                {title}
              </div>
            </motion.div>
          </motion.a>
        </Link>
      </motion.div>
    </LayoutGroup>
  );
};

export default Button;