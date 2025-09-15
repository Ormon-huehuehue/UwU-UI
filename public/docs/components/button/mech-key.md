# Mechanical Key

> A single mechanical keycap with press animation and sound.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Mechanical Key Example](#mechanical-key-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

Example:

```tsx
'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/utils'

type SingleKeyProps = {
  keyLabel?: string;
  keyValue?: string;
  className?: string;
  onClick?: () => void;
  autoReset?: boolean;
  resetDelay?: number;
}

const SingleKey = ({
  keyLabel = "⌘",
  keyValue = "Meta",
  className = "",
  onClick,
  autoReset = true,
  resetDelay = 100
}: SingleKeyProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === keyValue) {
        setIsPressed(true);
        playClickSound();
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === keyValue) {
        setIsPressed(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [keyValue]);

  const playClickSound = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.4;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }

  const handlePress = () => {
    setIsPressed(true);
    playClickSound();
    
    if (onClick) onClick();
    
    if (autoReset) {
      setTimeout(() => {
        setIsPressed(false);
      }, resetDelay);
    }
  }

  return (
    <div className='relative aspect-[400/310] flex items-center justify-center w-[clamp(200px,30vw,300px)] transition-all duration-[260ms] ease-out [transform-style:preserve-3d]'>
      <button
        className={cn(
          "absolute w-[50%] h-[50%] cursor-pointer [transform-style:preserve-3d] select-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          className
        )}
        style={{
          clipPath: 'polygon(0 0, 54% 0, 89% 24%, 100% 70%, 54% 100%, 46% 100%, 0 69%, 12% 23%, 47% 0%)',
          mask: 'url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%'
        }}
        onClick={handlePress}
      >
        <span className="w-full h-full inline-block">
          <span 
            className={cn(
              "active:translate-y-[26px] transition-all duration-[176ms] w-full h-full inline-block [container-type:inline-size]", 
              isPressed ? "translate-y-[26px] transition-all duration-[176ms]" : ""
            )}
          >
            <span 
              style={{ transform: 'rotateX(36deg) rotateY(45deg) rotateX(-90deg)' }} 
              className="absolute z-50 top-[5%] left-1/2 -translate-x-1/2"
            >
              <span className="text-black text-[22cqi] pointer-events-none">{keyLabel}</span>
            </span>
            <img
              src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86"
              alt=""
              style={{
                "--brightness": 2,
                "--saturate": 0,
                filter: 'hue-rotate(calc(var(--hue, 0) * 1deg)) saturate(var(--saturate, 1)) brightness(var(--brightness, 1))'
              } as any}
              className="pointer-events-none absolute top-0 w-[96%] left-1/2 -translate-x-1/2"
            />
          </span>
        </span>
      </button>
    </div>
  )
}

export default SingleKey

```

## Installation

{/* Coming soon */}

## Usage

### Mechanical Key Example

```tsx
import SingleKey from "@/components/mech-key";

export default function Example() {
  return <SingleKey keyLabel="⌘" keyValue="Meta" />
}
```

## Understanding the component

The component renders a 3D-styled key that can be pressed by mouse or keyboard. It plays a click sound and simulates down/up travel with CSS transforms.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| keyLabel | `string` | `"⌘"` | Visible label on the keycap. |
| keyValue | `string` | `"Meta"` | Keyboard key to listen to for press events. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/mech-key).*