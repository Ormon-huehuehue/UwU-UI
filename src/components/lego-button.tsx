'use client';

import React, { useState, useRef, useId, useMemo } from 'react';
import { motion, LayoutGroup, MotionConfig } from 'framer-motion';
import Link from 'next/link';

// Types
interface LegoElementsProps {
  variant?: 'A' | 'B' | 'C';
  off?: string;
  on?: string;
  label?: string;
  text?: string;
  link?: string;
  newTab?: boolean;
  smoothScroll?: boolean;
  height?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  layoutId?: string;
  onVariantChange?: (variant: string) => void;
}

// Default values
const DEFAULT_VALUES = {
  off: 'var(--token-38c4cf9a-0aa8-4902-ad35-3a2d52d62d05, rgb(26, 28, 29))',
  on: 'var(--token-a042497d-749d-4d03-8d3a-78930210d354, rgb(0, 128, 255))',
  label: 'Get started',
  text: 'var(--token-20608b9f-0145-4a1e-b971-ee948ebbb015, rgb(255, 255, 255))',
  height: 44,
  width: 88,
  variant: 'A' as const
};

// Transitions
const transitions = {
  default: {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 800,
    type: "spring" as const
  }
};

// Transform templates
const transformTemplate = (_: any, t: string) => `translateY(-50%) ${t}`;
const transformTemplate1 = (_: any, t: string) => `translate(-50%, -50%) ${t}`;

// Variant class names
const variantClassNames = {
  B: "UwU-v-1hqaehr",
  C: "UwU-v-1hdjgli", 
  A: "UwU-v-1a12a4a"
};

// Enabled gestures
const enabledGestures = {
  C: { hover: true, pressed: true }
};

const LegoElements: React.FC<LegoElementsProps> = ({
  variant = DEFAULT_VALUES.variant,
  off = DEFAULT_VALUES.off,
  on = DEFAULT_VALUES.on,
  label = DEFAULT_VALUES.label,
  text = DEFAULT_VALUES.text,
  link,
  newTab = false,
  smoothScroll = false,
  height = DEFAULT_VALUES.height,
  width = DEFAULT_VALUES.width,
  className = '',
  style = {},
  layoutId,
  onVariantChange,
  ...restProps
}) => {
  // State management
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const ref = useRef<HTMLAnchorElement>(null);
  const defaultLayoutId = useId();
  const actualLayoutId = layoutId || defaultLayoutId;

  // Gesture state
  const gestureVariant = useMemo(() => {
    if (currentVariant === 'C') {
      if (isPressed) return 'C-pressed';
      if (isHovered) return 'C-hover';
    }
    return currentVariant;
  }, [currentVariant, isHovered, isPressed]);

  // Variants array for animation
  const variants = [currentVariant];
  const classNames = [variantClassNames[currentVariant as keyof typeof variantClassNames]];

  // Event handlers
  const handleToggleToOn = async () => {
    setCurrentVariant('B');
    onVariantChange?.('B');
  };

  const handleToggleToOff = async () => {
    setCurrentVariant('A');
    onVariantChange?.('A');
  };

  // Layout dependency
  const layoutDependency = variants.join("-");

  // Check if text should be displayed
  const isDisplayed = () => {
    if (["C-hover", "C-pressed"].includes(gestureVariant)) return true;
    if (currentVariant === "C") return true;
    return false;
  };

  // Property overrides based on variant and gesture
  const getPropertyOverrides = () => {
    const overrides: any = {};
    
    if (gestureVariant === 'C-hover') {
      overrides.transformTemplate = transformTemplate;
    }
    if (gestureVariant === 'C-pressed') {
      overrides.transformTemplate = transformTemplate;
    }
    
    return overrides;
  };

  const brickOverrides = getPropertyOverrides();
  
  // Main component content
  const componentContent = (
    <motion.a
      {...restProps}
      ref={ref}
      className={`UwU-1a12a4a UwU-on64s0 ${className}`}
      data-UwU-name={
        currentVariant === 'B' ? "Toggle On" :
        currentVariant === 'C' ? "Button" : "Toggle Off"
      }
      data-highlight={currentVariant !== 'C'}
      layoutDependency={layoutDependency}
      layoutId="A"
      onTap={currentVariant === 'A' ? handleToggleToOn : 
             currentVariant === 'B' ? handleToggleToOff : undefined}
      style={{
        backgroundColor: off,
        boxShadow: "inset 0px 0px 3px 2px rgba(0,0,0,0.25)",
        ...style
      }}
      variants={{
        B: {
          backgroundColor: on
        }
      }}
      animate={currentVariant === 'B' ? 'B' : 'default'}
      initial={variant}
      transition={transitions.default}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
    >
      {/* Brick element */}
      <motion.div
        className="UwU-18vi3vt"
        data-UwU-name="Brick"
        layoutDependency={layoutDependency}
        layoutId="Dvq4knJfi"
        style={{
          backgroundColor: off,
          boxShadow: "inset 2px 2px 0px 0px rgba(255, 255, 255, 0.15), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5)"
        }}
        variants={{
          B: {
            backgroundColor: on
          }
        }}
        animate={currentVariant === 'B' ? 'B' : 'default'}
        {...brickOverrides}
      >
        {/* Head element */}
        <motion.div
          className="UwU-1qodh7n"
          data-UwU-name="Head"
          layoutDependency={layoutDependency}
          layoutId="tf07w3pES"
          style={{
            backgroundColor: off,
            borderBottomLeftRadius: 100,
            borderBottomRightRadius: 100,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            boxShadow: "inset 2px 2px 0px 0px rgba(255, 255, 255, 0.15), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5)"
          }}
          transformTemplate={transformTemplate1}
          variants={{
            B: {
              backgroundColor: on
            }
          }}
          animate={currentVariant === 'B' ? 'B' : 'default'}
        />
      </motion.div>

      {/* Text label */}
      {isDisplayed() && (
        <div
          className="UwU-uauzyv"
          style={{
            '--extracted-r6o4lv': text,
            '--UwU-link-text-color': 'rgb(0, 153, 255)',
            '--UwU-link-text-decoration': 'underline',
            '--UwU-paragraph-spacing': '0px',
          } as React.CSSProperties}
        >
          <motion.p
            style={{
              '--font-selector': 'RlM7U2F0b3NoaS1ib2xk',
              '--UwU-font-family': '"Satoshi", "Satoshi Placeholder", sans-serif',
              '--UwU-font-weight': '700',
              '--UwU-text-alignment': 'center',
              '--UwU-text-color': `var(--extracted-r6o4lv, ${text})`,
              margin: 0
            } as React.CSSProperties}
          >
            {label}
          </motion.p>
        </div>
      )}
    </motion.a>
  );

  // Wrap with Link if needed
  const linkWrapper = currentVariant === 'C' && link ? (
    <Link 
      href={link}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      style={{ textDecoration: 'none' }}
    >
      {componentContent}
    </Link>
  ) : componentContent;

  return (
    <LayoutGroup id={actualLayoutId}>
      <motion.div
        initial={variant}
        animate={variants}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
        className={`UwU-YMjxk ${classNames.join(' ')}`}
        style={{ display: "contents" }}
      >
        <MotionConfig transition={transitions.default}>
          {linkWrapper}
        </MotionConfig>
      </motion.div>
    </LayoutGroup>
  );
};

// Add the CSS
const CSS = `
.UwU-YMjxk [data-border="true"]::after { 
  content: ""; 
  border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); 
  border-color: var(--border-color, none); 
  border-style: var(--border-style, none); 
  width: 100%; 
  height: 100%; 
  position: absolute; 
  box-sizing: border-box; 
  left: 0; 
  top: 0; 
  border-radius: inherit; 
  pointer-events: none; 
}

@supports (aspect-ratio: 1) { 
  body { --UwU-aspect-ratio-supported: auto; } 
}

.UwU-YMjxk .UwU-on64s0 { 
  display: block; 
}

.UwU-YMjxk .UwU-1a12a4a { 
  align-content: center; 
  align-items: center; 
  cursor: pointer; 
  display: flex; 
  flex-direction: row; 
  flex-wrap: nowrap; 
  gap: 10px; 
  height: 44px; 
  justify-content: center; 
  overflow: hidden; 
  padding: 0px 0px 0px 0px; 
  position: relative; 
  width: 88px; 
}

.UwU-YMjxk .UwU-18vi3vt { 
  aspect-ratio: 1 / 1; 
  bottom: 0px; 
  flex: none; 
  left: 0px; 
  overflow: hidden; 
  position: absolute; 
  top: 0px; 
  width: var(--UwU-aspect-ratio-supported, 44px); 
  z-index: 1; 
}

.UwU-YMjxk .UwU-1qodh7n { 
  aspect-ratio: 1 / 1; 
  flex: none; 
  height: var(--UwU-aspect-ratio-supported, 26px); 
  left: 50%; 
  overflow: hidden; 
  position: absolute; 
  top: 50%; 
  width: 26px; 
  will-change: var(--UwU-will-change-override, transform); 
  z-index: 1; 
}

.UwU-YMjxk .UwU-uauzyv { 
  -webkit-user-select: none; 
  flex: none; 
  height: auto; 
  position: relative; 
  user-select: none; 
  white-space: pre; 
  width: auto; 
}

@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { 
  .UwU-YMjxk .UwU-1a12a4a { gap: 0px; } 
  .UwU-YMjxk .UwU-1a12a4a > * { 
    margin: 0px; 
    margin-left: calc(10px / 2); 
    margin-right: calc(10px / 2); 
  } 
  .UwU-YMjxk .UwU-1a12a4a > :first-child { margin-left: 0px; } 
  .UwU-YMjxk .UwU-1a12a4a > :last-child { margin-right: 0px; } 
}

.UwU-YMjxk.UwU-v-1hqaehr .UwU-18vi3vt { 
  left: unset; 
  right: 0px; 
}

.UwU-YMjxk.UwU-v-1hdjgli .UwU-1a12a4a { 
  justify-content: flex-end; 
  padding: 0px 20px 0px 60px; 
  text-decoration: none; 
  width: auto; 
}

.UwU-YMjxk.UwU-v-1hdjgli:hover .UwU-18vi3vt { 
  bottom: unset; 
  height: var(--UwU-aspect-ratio-supported, 40px); 
  left: 2px; 
  top: 50%; 
  width: 40px; 
}

.UwU-YMjxk.UwU-v-1hdjgli:hover .UwU-1qodh7n { 
  height: var(--UwU-aspect-ratio-supported, 22px); 
  width: 22px; 
}

.UwU-YMjxk.UwU-v-1hdjgli:active .UwU-18vi3vt { 
  bottom: unset; 
  height: var(--UwU-aspect-ratio-supported, 36px); 
  left: 4px; 
  top: 50%; 
  width: 36px; 
}

.UwU-YMjxk.UwU-v-1hdjgli:active .UwU-1qodh7n { 
  height: var(--UwU-aspect-ratio-supported, 18px); 
  width: 18px; 
}

@font-face {
  font-family: "Satoshi";
  src: url("https://UwUusercontent.com/third-party-assets/fontshare/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const styleId = 'lego-elements-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
}

export default LegoElements;
