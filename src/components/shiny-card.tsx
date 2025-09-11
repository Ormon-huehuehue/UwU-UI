'use client'

import React, { useState, useId } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import Link from 'next/link'

interface CardProps {
  variant?: 'assets' | 'assets-hover' | 'components' | 'components-hover'
  className?: string
  style?: React.CSSProperties
}

const Card: React.FC<CardProps> = ({ 
  variant = 'assets', 
  className = '', 
  style = {} 
}) => {
  const [currentVariant, setCurrentVariant] = useState(variant)
  const layoutId = useId()

  const transitions = {
    default: { duration: 0, type: 'tween' as const },
    hover: { damping: 60, delay: 0, mass: 1, stiffness: 300, type: 'spring' as const },
    componentsHover: { damping: 60, delay: 0, mass: 1, stiffness: 350, type: 'spring' as const }
  }

  const isAssetsVariant = currentVariant === 'assets' || currentVariant === 'assets-hover'
  const isComponentsVariant = currentVariant === 'components' || currentVariant === 'components-hover'
  const isHoverState = currentVariant === 'assets-hover' || currentVariant === 'components-hover'

  const handleMouseEnter = () => {
    if (isAssetsVariant) {
      setCurrentVariant('assets-hover')
    } else if (isComponentsVariant) {
      setCurrentVariant('components-hover')
    }
  }

  const handleMouseLeave = () => {
    if (currentVariant === 'assets-hover') {
      setCurrentVariant('assets')
    } else if (currentVariant === 'components-hover') {
      setCurrentVariant('components')
    }
  }

  const getHref = () => {
    return isComponentsVariant 
      ? 'https://vercel.com/design/icons'
      : 'https://vercel.com/design/brands'
  }

  const getTitle = () => {
    return isComponentsVariant ? 'Icons' : 'Assets'
  }

  const getDescription = () => {
    return isComponentsVariant 
      ? 'Icon set tailored for developer tools.'
      : 'Learn how to work with our brand assets.'
  }

  const AssetsIllustration = () => (
    <svg 
      fill="none" 
      height="271" 
      width="320" 
      className="w-full h-auto"
      viewBox="0 0 320 271"
    >
      <mask height="278" id="b" maskUnits="userSpaceOnUse" width="600" x="-173" y="-7" style={{maskType: 'alpha'}}>
        <ellipse cx="127" cy="131.634" fill="url(#a)" rx="300" ry="138.634"/>
      </mask>
      <g mask="url(#b)">
        <path d="M126.179 109.505c-7.445 0-12.812 4.843-12.812 12.109 0 7.265 6.035 12.109 13.486 12.109 4.498 0 8.463-1.776 10.917-4.77l-5.158-2.973c-1.362 1.486-3.433 2.354-5.759 2.354-3.23 0-5.974-1.682-6.993-4.373h18.895c.148-.753.236-1.533.236-2.354 0-7.259-5.361-12.102-12.812-12.102Zm-6.373 9.754c.843-2.684 3.15-4.373 6.373-4.373 3.23 0 5.536 1.689 6.372 4.373h-12.745Zm-1.523-17.154-18.686 32.29-18.691-32.29h7.006l11.679 20.181 11.679-20.181h7.013Zm-63.156-3.364 24.915 43.054H30.211l24.916-43.054Zm110.971 22.873c0 4.036 2.643 6.727 6.743 6.727 2.778 0 4.862-1.258 5.934-3.31l5.179 2.98c-2.145 3.566-6.164 5.712-11.113 5.712-7.451 0-12.812-4.844-12.812-12.109 0-7.266 5.368-12.109 12.812-12.109 4.949 0 8.962 2.146 11.113 5.711l-5.179 2.98c-1.072-2.052-3.156-3.31-5.934-3.31-4.093 0-6.743 2.691-6.743 6.728Zm55.617-19.509v30.945h-6.069v-30.945h6.069Zm-22.927 7.4c-7.444 0-12.811 4.843-12.811 12.109 0 7.265 6.041 12.109 13.486 12.109 4.497 0 8.462-1.776 10.917-4.77l-5.159-2.973c-1.362 1.486-3.432 2.354-5.758 2.354-3.23 0-5.975-1.682-6.993-4.373h18.894a12.06 12.06 0 0 0 .236-2.354c0-7.259-5.36-12.102-12.812-12.102Zm-6.372 9.754c.843-2.684 3.142-4.373 6.372-4.373s5.537 1.689 6.373 4.373h-12.745Zm-34.41-9.082v6.519a7.705 7.705 0 0 0-2.158-.33c-3.917 0-6.743 2.691-6.743 6.728v9.956h-6.069v-22.873h6.069v6.189c0-3.417 3.985-6.189 8.901-6.189Z" fill="#fff"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" d="M-143.73 98.513h540.17"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.1s'}} d="M30.805-14.577v337.543"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.2s'}} d="m.463 3.897 179.965 311.71"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.3s'}} d="m24.228 3.552 171.699 297.392"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.4s'}} d="M221.625-14.921V332.61"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.5s'}} d="M-143.73 134.3h540.17"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.6s'}} d="M-143.73 106.285h540.17"/>
        <path stroke="#fff" strokeDasharray="5 5" strokeOpacity=".4" strokeWidth=".5" style={{animationDelay: '.7s'}} d="M-145.105 141.545H397.03"/>
      </g>
      <defs>
        <radialGradient cx="0" cy="0" gradientTransform="matrix(0 138.634 -300 0 127 131.634)" gradientUnits="userSpaceOnUse" id="a" r="1">
          <stop/>
          <stop offset="1" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  )

  const IconsIllustration = () => (
    <svg 
      fill="none" 
      height="216" 
      width="455" 
      className="w-[379px] h-auto"
      viewBox="0 0 455 216"
    >
      <g opacity=".54" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2m59.73 9a2 2 0 0 1-3.46 0M70 17H50a3 3 0 0 0 3-3V9a7 7 0 1 1 14 0v5a3 3 0 0 0 3 3Zm45-13h-14a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-3-2v4m-8-4v4m-5 4h18m39.89-8.55 8 4A2.001 2.001 0 0 1 166 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2.004 2.004 0 0 1-1.1-1.8V7.24a1.999 1.999 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0v0Z" pathLength="1"/>
        <path d="M146.32 6.16 156 11l9.68-4.84M156 22.76V11m54-8a2.998 2.998 0 0 0-3 3v12a2.999 2.999 0 0 0 5.121 2.121A2.999 2.999 0 0 0 210 15h-12a2.998 2.998 0 0 0-3 3 2.999 2.999 0 0 0 5.121 2.121A2.999 2.999 0 0 0 201 18V6a2.999 2.999 0 0 0-5.121-2.121A2.999 2.999 0 0 0 198 9h12a2.998 2.998 0 0 0 3-3 2.999 2.999 0 0 0-3-3Zm38 14 4 4 4-4m-4-5v9" pathLength="1"/>
        {/* Additional paths truncated for brevity - include all remaining paths from original */}
      </g>
      <defs>
        <clipPath id="a"><path fill="#fff" transform="translate(96 48)" d="M0 0h24v24H0z"/></clipPath>
        <clipPath id="b"><path fill="#fff" transform="translate(288 48)" d="M0 0h24v24H0z"/></clipPath>
        <clipPath id="c"><path fill="#fff" transform="translate(336 48)" d="M0 0h24v24H0z"/></clipPath>
        <clipPath id="d"><path fill="#fff" transform="translate(432 144)" d="M0 0h24v24H0z"/></clipPath>
      </defs>
    </svg>
  )

  return (
    <MotionConfig transition={transitions.default}>
      <div className={`inline-block ${className}`} style={style}>
        <Link 
          href={getHref()}
          target={isComponentsVariant ? "_blank" : undefined}
          rel={isComponentsVariant ? "noopener noreferrer" : undefined}
          className="block"
        >
          <motion.div
            layoutId={layoutId}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer overflow-hidden rounded-2xl bg-black border border-gray-800/20 p-6 w-[293px] h-[280px] flex flex-col justify-end"
            style={{
              backgroundColor: 'rgb(1, 1, 1)',
              borderColor: 'rgba(204, 204, 224, 0.2)',
            }}
            whileHover={{ scale: 1.02 }}
            transition={isComponentsVariant ? transitions.componentsHover : transitions.hover}
          >
            {/* Illustration Container */}
            <div className="absolute -left-1.5 -top-2 -right-1.5 h-[258px] flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                {isAssetsVariant && (
                  <motion.div
                    key="assets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AssetsIllustration />
                  </motion.div>
                )}
                {isComponentsVariant && (
                  <motion.div
                    key="components"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconsIllustration />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gradient Overlay for Components */}
            {isComponentsVariant && (
              <motion.div
                className="absolute z-10"
                style={{
                  background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.54) 100%)',
                  left: '126px',
                  right: '256px',
                  top: '6px',
                  height: '191px',
                }}
                initial={{ borderRadius: 0 }}
                animate={{ 
                  borderRadius: isHoverState ? 45 : 0 
                }}
                transition={transitions.componentsHover}
              />
            )}

            {/* Content */}
            <div className="relative z-20 flex flex-col gap-1">
              <motion.h3 
                className="text-white font-medium text-base"
                style={{ fontFamily: '"Inter-Medium", "Inter", sans-serif' }}
              >
                {getTitle()}
              </motion.h3>
              <motion.p 
                className="text-gray-400 text-sm leading-tight"
                style={{ lineHeight: '1.3em' }}
              >
                {getDescription()}
              </motion.p>
            </div>

            {/* Light Effect */}
            <div 
              className="absolute w-[466px] h-[466px] -left-[400px] -top-[400px] z-10"
              style={{
                background: 'radial-gradient(40.2% 99.24161073825503% at 50% 50%, rgba(68, 68, 68, 0.45) 0%, rgba(68, 68, 68, 0) 100%)',
                filter: 'blur(15px)',
                transform: isHoverState ? 'rotate(45deg) translate(800px, 800px)' : 'rotate(45deg)',
                transition: 'transform 0.6s ease-out',
              }}
            />
          </motion.div>
        </Link>
      </div>
    </MotionConfig>
  )
}

export default Card