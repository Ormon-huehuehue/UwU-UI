# Typewriter

> A component that types out a text, one letter at a time.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [typewriter](#typewriter)
- [Usage](#usage)
- [Props](#props)

Example:

```tsx
import Typewriter from "@/fancy/components/text/typewriter"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh md:text-3xl lg:text-4xl sm:text-2xl text-xl flex flex-row items-start justify-start bg-white text-foreground dark:text-muted font-normal overflow-hidden p-16 pt-48">
      <p className="whitespace-pre-wrap">
        <span>{"We're born 🌞 to "}</span>
        <Typewriter
          text={[
            "experience",
            "dance",
            "love",
            "be alive",
            "create things that make the world a better place",
          ]}
          speed={70}
          className="text-yellow-500 text-pretty"
          waitTime={1500}
          deleteSpeed={40}
          cursorChar={"_"}
        />
      </p>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/typewriter.json"
```

### Manual

#### typewriter

```tsx
"use client"

import { ElementType, useEffect, useState } from "react"
import { motion, Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface TypewriterProps {
  /**
   * Text or array of texts to type out
   */
  text: string | string[]

  /**
   * HTML Tag to render the component as
   * @default div
   */
  as?: ElementType

  /**
   * Speed of typing in milliseconds
   * @default 50
   */
  speed?: number

  /**
   * Initial delay before typing starts
   * @default 0
   */
  initialDelay?: number

  /**
   * Time to wait between typing and deleting
   * @default 2000
   */
  waitTime?: number

  /**
   * Speed of deleting characters
   * @default 30
   */
  deleteSpeed?: number

  /**
   * Whether to loop through texts array
   * @default true
   */
  loop?: boolean

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Whether to show the cursor
   * @default true
   */
  showCursor?: boolean

  /**
   * Hide cursor while typing
   * @default false
   */
  hideCursorOnType?: boolean

  /**
   * Character or React node to use as cursor
   * @default "|"
   */
  cursorChar?: string | React.ReactNode

  /**
   * Animation variants for cursor
   */
  cursorAnimationVariants?: {
    initial: Variants["initial"]
    animate: Variants["animate"]
  }

  /**
   * Optional class name for cursor styling
   */
  cursorClassName?: string
}

const Typewriter = ({
  text,
  as: Tag = "div",
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: "reverse",
      },
    },
  },
  ...props
}: TypewriterProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = Array.isArray(text) ? text : [text]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const currentText = texts[currentTextIndex]

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === "") {
          setIsDeleting(false)
          if (currentTextIndex === texts.length - 1 && !loop) {
            return
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentIndex(0)
          timeout = setTimeout(() => {}, waitTime)
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1))
          }, deleteSpeed)
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, waitTime)
        }
      }
    }

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === "") {
      timeout = setTimeout(startTyping, initialDelay)
    } else {
      startTyping()
    }

    return () => clearTimeout(timeout)
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
  ])

  return (
    <Tag className={cn("inline whitespace-pre-wrap tracking-tight", className)} {...props}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType &&
              (currentIndex < texts[currentTextIndex].length || isDeleting)
              ? "hidden"
              : ""
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </Tag>
  )
}

export default Typewriter

```

## Usage

As a text, either a string or an array of strings can be passed to the component. The component will automatically split the text into an array of characters, and animate each letter one by one. If you pass an array of strings, the component will animate one text, delete it, then continue animating the next one. The component will loop through the texts if you set the `loop` prop to `true`.

The cursor at the end of the text is optional. You can use a character or even a svg node if you like. There is a prop to customize the cursor animation, where you have to define the two motion variants as `initial` and `animate`.

Ideally, the component should respect multiple lines. If you experience otherwise, please let me know.:)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| text* | `string | string[]` | - | Text or array of texts to type out |
| as | `ElementType` | `"div"` | HTML Tag to render the component as |
| speed | `number` | `50` | Speed of typing in milliseconds |
| initialDelay | `number` | `0` | Initial delay before typing starts |
| waitTime | `number` | `2000` | Time to wait between typing and deleting |
| deleteSpeed | `number` | `30` | Speed of deleting characters |
| loop | `boolean` | `true` | Whether to loop through texts array |
| className | `string` | - | Optional class name for styling |
| showCursor | `boolean` | `true` | Whether to show the cursor |
| hideCursorOnType | `boolean` | `false` | Hide cursor while typing |
| cursorChar | `string | React.ReactNode` | `"|"` | Character or React node to use as cursor |
| cursorAnimationVariants | `{ initial: Variants["initial"]; animate: Variants["animate"] }` | See description | Animation variants for cursor. Default: `{ initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.01, repeat: Infinity, repeatDelay: 0.4, repeatType: "reverse" } } }` |
| cursorClassName | `string` | `"ml-1"` | Optional class name for cursor styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/typewriter).*