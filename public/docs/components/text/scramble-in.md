# Scramble In

> A text component that reveals the text with a scrambled part in front.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [scramble-in](#scramble-in)
- [Usage](#usage)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
import { useEffect, useRef } from "react"

import ScrambleIn, {
  ScrambleInHandle,
} from "@/fancy/components/text/scramble-in"

export default function Preview() {
  const titles = [
    "1. One More Time (featuring Romanthony) - 5:20",
    "2. Aerodynamic - 3:27",
    "3. Digital Love - 4:58",
    "4. Harder, Better, Faster, Stronger - 3:45",
    "5. Crescendolls - 3:31",
    "6. Nightvision - 1:44",
    "7. Superheroes - 3:57",
    "8. High Life - 3:22",
    "9. Something About Us - 3:51",
    "10. Voyager - 3:47",
    "11. Veridis Quo - 5:44",
    "12. Short Circuit - 3:26",
    "13. Face to Face (featuring Todd Edwards) - 3:58",
    "14. Too Long (featuring Romanthony) - 10:00",
  ]

  const scrambleRefs = useRef<(ScrambleInHandle | null)[]>([])

  useEffect(() => {
    titles.forEach((_, index) => {
      const delay = index * 50
      setTimeout(() => {
        scrambleRefs.current[index]?.start()
      }, delay)
    })
  }, [])

  return (
    <div className="w-dvw h-dvh flex flex-col text-sm md:text-lg lg:text-lg xl:text-xl justify-start items-start bg-white text-foreground dark:text-muted font-normal overflow-hidden py-16 px-8 sm:px-16 md:px-20 lg:px-24 text-center">
      {titles.map((model, index) => (
        <ScrambleIn
          key={index}
          ref={(el) => {
            scrambleRefs.current[index] = el
          }}
          text={model}
          scrambleSpeed={25}
          scrambledLetterCount={5}
          autoStart={false}
        />
      ))}
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/scramble-in.json"
```

### Manual

#### scramble-in

```tsx
"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"

interface ScrambleInProps {
  text: string
  scrambleSpeed?: number
  scrambledLetterCount?: number
  characters?: string
  className?: string
  scrambledClassName?: string
  autoStart?: boolean
  onStart?: () => void
  onComplete?: () => void
}

export interface ScrambleInHandle {
  start: () => void
  reset: () => void
}

const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
      className = "",
      scrambledClassName = "",
      autoStart = true,
      onStart,
      onComplete,
    },
    ref
  ) => {
    const [displayText, setDisplayText] = useState("")
    const [isAnimating, setIsAnimating] = useState(false)
    const [visibleLetterCount, setVisibleLetterCount] = useState(0)
    const [scrambleOffset, setScrambleOffset] = useState(0)

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      onStart?.()
    }, [onStart])

    const reset = useCallback(() => {
      setIsAnimating(false)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      setDisplayText("")
    }, [])

    useImperativeHandle(ref, () => ({
      start: startAnimation,
      reset,
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart, startAnimation])

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isAnimating) {
        interval = setInterval(() => {
          // Increase visible text length
          if (visibleLetterCount < text.length) {
            setVisibleLetterCount((prev) => prev + 1)
          }
          // Start sliding scrambled text out
          else if (scrambleOffset < scrambledLetterCount) {
            setScrambleOffset((prev) => prev + 1)
          }
          // Complete animation
          else {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
          }

          // Calculate how many scrambled letters we can show
          const remainingSpace = Math.max(0, text.length - visibleLetterCount)
          const currentScrambleCount = Math.min(
            remainingSpace,
            scrambledLetterCount
          )

          // Generate scrambled text
          const scrambledPart = Array(currentScrambleCount)
            .fill(0)
            .map(
              () => characters[Math.floor(Math.random() * characters.length)]
            )
            .join("")

          setDisplayText(text.slice(0, visibleLetterCount) + scrambledPart)
        }, scrambleSpeed)
      }

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [
      isAnimating,
      text,
      visibleLetterCount,
      scrambleOffset,
      scrambledLetterCount,
      characters,
      scrambleSpeed,
      onComplete,
    ])

    const renderText = () => {
      const revealed = displayText.slice(0, visibleLetterCount)
      const scrambled = displayText.slice(visibleLetterCount)

      return (
        <>
          <span className={className}>{revealed}</span>
          <span className={scrambledClassName}>{scrambled}</span>
        </>
      )
    }

    return (
      <>
        <span className="sr-only">{text}</span>
        <span className="inline-block whitespace-pre-wrap" aria-hidden="true">
          {renderText()}
        </span>
      </>
    )
  }
)

ScrambleIn.displayName = "ScrambleIn"
export default ScrambleIn

```

## Usage

With the `autoStart` prop, you can start the animation automatically.
But there is also a `start` and `reset` method exposed via a ref if you need to control the animation from outside of the component, as you see in the demo above.

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| text* | `string` | - | The text to be displayed and scrambled |
| scrambleSpeed | `number` | `50` | Speed of the scrambling animation in milliseconds |
| scrambledLetterCount | `number` | `8` | Number of letters to scramble |
| autoStart | `boolean` | `true` | Whether to start the animation automatically |
| className | `string` | `undefined` | Additional CSS classes for styling |
| characters | `string` | `"ABCDEFGHIJKLMNO PQRSTUVWXYZ abcdefghijklmno pqrstuvwxyz !@#$%^&*()_+"` | Characters to use for scrambling |
| scrambledClassName | `string` | `undefined` | Additional CSS classes for styling the scrambled text |
| autoStart | `boolean` | `true` | Whether to start the animation automatically |
| onComplete | `() => void` | - | Callback function for when the animation completes |
| onStart | `() => void` | - | Callback function for when the animation starts |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/scramble-in).*