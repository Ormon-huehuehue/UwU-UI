# Scramble Hover

> A text component that scrambles the text on hover.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [scramble-hover](#scramble-hover)
- [Usage](#usage)
- [Props](#props)

Example:

```tsx
"use client"

import { motion } from "motion/react"

import ScrambleHover from "@/fancy/components/text/scramble-hover"

export default function Preview() {
  const models = [
    "Llama 3.1 405B Instruct Turbo",
    "Llama 3.2 3B Instruct Turbo",
    "Gemma 2 27B",
    "Mistral 7B Instruct v0.3",
    "Mixtral 8x7B Instruct",
    "DeepSeek LLM Chat 67B",
    "Qwen 2.5 72B Instruct Turbo",
    "WizardLM 2 8x22B",
    "Nous Hermes 2 Mixtral",
    "StripedHyena Nous 7B",
    "DBRX Instruct",
    "MythoMax L2 13B",
    "SOLAR 10.7B Instruct",
    "Gemma 2B Instruct",
  ]

  return (
    <div className="w-dvw h-dvh flex flex-col  justify-center items-end bg-white text-foreground dark:text-muted font-normal overflow-hidden py-20 px-8 sm:px-16 md:px-24 lg:px-32 text-right text-sm sm:text-lg md:text-xl">
      {models.map((model, index) => (
        <motion.div
          layout
          key={model}
          animate={{ opacity: [0, 1, 1], y: [10, 10, 0] }}
          transition={{
            duration: 0.1,
            ease: "circInOut",
            delay: index * 0.05 + 0.5,
            times: [0, 0.2, 1],
          }}
        >
          <ScrambleHover
            text={model}
            scrambleSpeed={50}
            maxIterations={8}
            useOriginalCharsOnly={true}
            className="cursor-pointer"
          />
        </motion.div>
      ))}
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/scramble-hover.json"
```

### Manual

#### scramble-hover

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrambleHoverProps {
  text: string
  scrambleSpeed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: "start" | "end" | "center"
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  scrambledClassName?: string
}

const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>())

  useEffect(() => {
    let interval: NodeJS.Timeout
    let currentIteration = 0

    const getNextIndex = () => {
      const textLength = text.length
      switch (revealDirection) {
        case "start":
          return revealedIndices.size
        case "end":
          return textLength - 1 - revealedIndices.size
        case "center":
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealedIndices.size / 2)
          const nextIndex =
            revealedIndices.size % 2 === 0
              ? middle + offset
              : middle - offset - 1

          if (
            nextIndex >= 0 &&
            nextIndex < textLength &&
            !revealedIndices.has(nextIndex)
          ) {
            return nextIndex
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedIndices.has(i)) return i
          }
          return 0
        default:
          return revealedIndices.size
      }
    }

    const shuffleText = (text: string) => {
      if (useOriginalCharsOnly) {
        const positions = text.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.has(i),
        }))

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char)

        // Shuffle remaining non-revealed, non-space characters
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[nonSpaceChars[i], nonSpaceChars[j]] = [
            nonSpaceChars[j],
            nonSpaceChars[i],
          ]
        }

        let charIndex = 0
        return positions
          .map((p) => {
            if (p.isSpace) return " "
            if (p.isRevealed) return text[p.index]
            return nonSpaceChars[charIndex++]
          })
          .join("")
      } else {
        return text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (revealedIndices.has(i)) return text[i]
            return availableChars[
              Math.floor(Math.random() * availableChars.length)
            ]
          })
          .join("")
      }
    }

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("")

    if (isHovering) {
      setIsScrambling(true)
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndex()
            revealedIndices.add(nextIndex)
            setDisplayText(shuffleText(text))
          } else {
            clearInterval(interval)
            setIsScrambling(false)
          }
        } else {
          setDisplayText(shuffleText(text))
          currentIteration++
          if (currentIteration >= maxIterations) {
            clearInterval(interval)
            setIsScrambling(false)
            setDisplayText(text)
          }
        }
      }, scrambleSpeed)
    } else {
      setDisplayText(text)
      revealedIndices.clear()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isHovering,
    text,
    characters,
    scrambleSpeed,
    useOriginalCharsOnly,
    sequential,
    revealDirection,
    maxIterations,
  ])

  return (
    <motion.span
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn("inline-block whitespace-pre-wrap", className)}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              revealedIndices.has(index) || !isScrambling || !isHovering
                ? className
                : scrambledClassName
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  )
}

export default ScrambleHover

```

## Usage

For the scrambling effect, you can use either the original characters, or another set of characters specified in the `characters` prop.

Example:

```tsx
import ScrambleHover from "@/fancy/components/text/scramble-hover"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh  text-xl sm:text-3xl md:text-5xl bg-white text-foreground dark:text-muted font-normal overflow-hidden p-12 sm:p-20 flex flex-col md:p-24 space-y-2 space-x-6">
      <ScrambleHover
        text={"original characters"}
        scrambleSpeed={50}
        maxIterations={8}
        useOriginalCharsOnly={true}
        className="cursor-pointer"
      />
      <ScrambleHover
        text={"new characters"}
        scrambleSpeed={50}
        maxIterations={8}
        useOriginalCharsOnly={false}
        className="cursor-pointer"
        characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\,./<>?"
      />
    </div>
  )
}

```

You can also apply a different styling on the scrambled text by passing a string to the `scrambleClassName` prop. This allows for example to use a different font family or color, like in the following example. Please not that if the `scrambledClassName` is applied, it's not going to be merged with the `className` prop, so you have to style the original text and the scrambled text separately.

Example:

```tsx
import ScrambleHover from "@/fancy/components/text/scramble-hover"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh flex text-4xl justify-center items-center bg-white text-foreground dark:text-muted  font-normal overflow-hidden p-24 space-y-2">
      <ScrambleHover
        text={"special symbols"}
        scrambleSpeed={50}
        maxIterations={8}
        useOriginalCharsOnly={false}
        className="cursor-pointer text-4xl"
        characters="čüỳĦØ↋⒬¢⏧⏛⏄⎄*¿"
        scrambledClassName="font-notoSansSymbols text-3xl cursor-pointer"
      />
    </div>
  )
}

```

With the `sequential` prop, you can scramble the text in a sequential manner, starting from the `start`, the `end`, or the `center` of the text. In that case, the `maxIterations` prop is ignored.
In my experience this works best with a monospaced font, but feel free to experiment.

Example:

```tsx
import ScrambleHover from "@/fancy/components/text/scramble-hover"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-sm sm:text-xl md:text-2xl justify-center items-center font-normal text-light overflow-hidden p-12 sm:p-20 flex flex-col md:p-24 space-y-20 bg-black text-white">
      <div className="text-left w-full">
        <ScrambleHover
          text={"from the start"}
          scrambleSpeed={40}
          sequential={true}
          revealDirection="start"
          useOriginalCharsOnly={false}
          className="font-azeret-mono"
          characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\,./<>?"
        />
      </div>
      <div className="text-center w-full">
        <ScrambleHover
          text={"from the center"}
          scrambleSpeed={40}
          sequential={true}
          revealDirection="center"
          useOriginalCharsOnly={false}
          className="font-azeret-mono"
          characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\,./<>?"
        />
      </div>
      <div className="text-right w-full">
        <ScrambleHover
          text={"from the end"}
          scrambleSpeed={40}
          sequential={true}
          revealDirection="end"
          useOriginalCharsOnly={false}
          className="font-azeret-mono"
          characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\,./<>?"
        />
      </div>
    </div>
  )
}

```

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| text* | `string` | - | The text to be displayed and scrambled |
| scrambleSpeed | `number` | `50` | Speed of the scrambling animation in milliseconds |
| maxIterations | `number` | `10` | Maximum number of iterations for the scrambling animation |
| sequential | `boolean` | `false` | Whether to scramble the text sequentially |
| revealDirection | `"start" | "end" | "center"` | `"start"` | The direction to reveal the scrambled text |
| useOriginalCharsOnly | `boolean` | `true` | Whether to use only the original characters or the whole string |
| className | `string` | `undefined` | Additional CSS classes for styling |
| characters | `string` | `"ABCDEFGHIJKLMNO PQRSTUVWXYZ abcdefghijklmno pqrstuvwxyz !@#$%^&*()_+"` | Characters to use for scrambling, if `useOriginalCharsOnly` is `false` |
| scrambledClassName | `string` | `undefined` | Additional CSS classes for styling the scrambled text |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/scramble-hover).*