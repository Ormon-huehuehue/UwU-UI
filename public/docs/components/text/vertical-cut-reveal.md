# Vertical Cut Reveal

> A text component that reveals the text with a cut reveal effect.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [vertical-cut-reveal](#vertical-cut-reveal)
- [Understanding the component](#understanding-the-component)
- [Examples](#examples)
  - [splitBy variations](#splitby-variations)
  - [staggerFrom variations](#staggerfrom-variations)
  - [No auto start](#no-auto-start)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh xs:text-2xl bg-white text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl flex flex-col items-start justify-center font-overused-grotesk p-10 md:p-16 lg:p-24 text-[#0015ff] tracking-wide uppercase">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="first"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
        }}
      >
        {`HI 👋, FRIEND!`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="last"
        reverse={true}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 0.5,
        }}
      >
        {`🌤️ IT IS NICE ⇗ TO`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="center"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 1.1,
        }}
      >
        {`MEET 😊 YOU.`}
      </VerticalCutReveal>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/vertical-cut-reveal.json"
```

### Manual

#### vertical-cut-reveal

```tsx
"use client"

import { AnimationOptions, motion } from "motion/react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

interface TextProps {
  children: React.ReactNode
  reverse?: boolean
  transition?: AnimationOptions
  splitBy?: "words" | "characters" | "lines" | string
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | "random" | number
  containerClassName?: string
  wordLevelClassName?: string
  elementLevelClassName?: string
  onClick?: () => void
  onStart?: () => void
  onComplete?: () => void
  autoStart?: boolean // Whether to start the animation automatically
}

// Ref interface to allow external control of the animation
export interface VerticalCutRevealRef {
  startAnimation: () => void
  reset: () => void
}

interface WordObject {
  characters: string[]
  needsSpace: boolean
}

const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      transition = {
        type: "spring",
        stiffness: 190,
        damping: 22,
      },
      splitBy = "words",
      staggerDuration = 0.2,
      staggerFrom = "first",
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
      onClick,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null)
    const text =
      typeof children === "string" ? children : children?.toString() || ""
    const [isAnimating, setIsAnimating] = useState(false)

    // handy function to split text into characters with support for unicode and emojis
    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
        return Array.from(segmenter.segment(text), ({ segment }) => segment)
      }
      // Fallback for browsers that don't support Intl.Segmenter
      return Array.from(text)
    }

    // Split text based on splitBy parameter
    const elements = useMemo(() => {
      const words = text.split(" ")
      if (splitBy === "characters") {
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }))
      }
      return splitBy === "words"
        ? text.split(" ")
        : splitBy === "lines"
          ? text.split("\n")
          : text.split(splitBy)
    }, [text, splitBy])

    // Calculate stagger delays based on staggerFrom
    const getStaggerDelay = useCallback(
      (index: number) => {
        const total =
          splitBy === "characters"
            ? elements.reduce(
                (acc, word) =>
                  acc +
                  (typeof word === "string"
                    ? 1
                    : word.characters.length + (word.needsSpace ? 1 : 0)),
                0
              )
            : elements.length
        if (staggerFrom === "first") return index * staggerDuration
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        return Math.abs(staggerFrom - index) * staggerDuration
      },
      [elements.length, staggerFrom, staggerDuration]
    )

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      onStart?.()
    }, [onStart])

    // Expose the startAnimation function via ref
    useImperativeHandle(ref, () => ({
      startAnimation,
      reset: () => setIsAnimating(false),
    }))

    // Auto start animation
    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart])

    const variants = {
      hidden: { y: reverse ? "-100%" : "100%" },
      visible: (i: number) => ({
        y: 0,
        transition: {
          ...transition,
          delay: ((transition?.delay as number) || 0) + getStaggerDelay(i),
        },
      }),
    }

    return (
      <span
        className={cn(
          containerClassName,
          "flex flex-wrap whitespace-pre-wrap",
          splitBy === "lines" && "flex-col"
        )}
        onClick={onClick}
        ref={containerRef}
        {...props}
      >
        <span className="sr-only">{text}</span>

        {(splitBy === "characters"
          ? (elements as WordObject[])
          : (elements as string[]).map((el, i) => ({
              characters: [el],
              needsSpace: i !== elements.length - 1,
            }))
        ).map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0)

          return (
            <span
              key={wordIndex}
              aria-hidden="true"
              className={cn("inline-flex overflow-hidden", wordLevelClassName)}
            >
              {wordObj.characters.map((char, charIndex) => (
                <span
                  className={cn(
                    elementLevelClassName,
                    "whitespace-pre-wrap relative"
                  )}
                  key={charIndex}
                >
                  <motion.span
                    custom={previousCharsCount + charIndex}
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === elements.length - 1 &&
                      charIndex === wordObj.characters.length - 1
                        ? onComplete
                        : undefined
                    }
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {wordObj.needsSpace && <span> </span>}
            </span>
          )
        })}
      </span>
    )
  }
)

VerticalCutReveal.displayName = "VerticalCutReveal"
export default VerticalCutReveal

```

## Understanding the component

1. First, the text is split into smaller pieces based on the `splitBy` prop:

   - `words`: Splits into individual words (e.g., "Hello world" → ["Hello", "world"])
   - `characters`: Splits into individual characters (e.g., "Hi" → ["H", "i"])
   - `lines`: Splits by newline characters (`\n`)
   - `string`: Splits by any custom string delimiter

2. Each piece of text is wrapped in two `<span>` elements:

   - An outer `<span>` that acts as a container with its position to `relative` and its overflow to `overflow-hidden`
   - An inner `<span>` that holds the actual text, initially positioned off-screen using `y: 100` (or `-100` if `reverse` is true)

3. When the animation starts:
   - The inner `<span>` elements smoothly transition from their off-screen position (`y: 100`) to their final position (`y: 0`)
   - This creates a "cutting" or "revealing" effect as each piece of text slides into view
   - The animation can be staggered from different directions (first, last, center, or random) using the `staggerFrom` prop

A key implementation detail is that the component always maintains word boundaries, even when splitting by characters. There are two reason for this:

1. When dealing with multi-line text, each line maintains its own reveal animation starting point. This means if you have text that spans multiple lines, each line will animate independently from its own baseline, rather than all elements animating from a single point (like the bottom of the entire paragraph).
2. When using `characters` mode, characters from the same word stay together in a word container. This prevents unwanted line breaks in the middle of words - if a word needs to wrap to the next line, it will wrap as a complete unit rather than having some characters on one line and others on the next line. This maintains proper text flow and readability while still allowing character-by-character animation within each word.

## Examples

### splitBy variations

With the `splitBy` prop, you can control how the text is split into smaller pieces. It can be either `words`, `characters`, `lines`, or a custom `string` delimiter.

Example:

```tsx
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text md:text-2xl lg:text-4xl flex flex-col items-start justify-center font-azeret-mono bg-white p-6 md:p-16 lg:p-20 xl:p-24 text-[#0015ff] tracking-wide ">
      <div className="flex flex-col justify-center w-full items-start space-y-4">
        <VerticalCutReveal
          splitBy="lines"
          staggerDuration={0.2}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 30,
            delay: 0.2,
          }}
          containerClassName="text-[#00000] leading-relaxed"
        >
          {"→ We're on a mission\nto make the 🌐 web \nsuper fun again! ☺"}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

```

Example:

```tsx
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-lg md:text-2xl flex flex-col items-start justify-center font-calendas p-10 md:p-16 lg:p-24 bg-[#0015ff] text-white tracking-wide font-bold">
      <div className="flex flex-col justify-center w-full items-center space-y-4">
        <VerticalCutReveal
          splitBy="words"
          staggerDuration={0.1}
          staggerFrom="first"
          reverse={true}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 30,
            delay: 0,
          }}
        >
          {`super cool & awesome example text`}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

```

### staggerFrom variations

With the `staggerFrom` prop, you can control the starting index of the animation. It can be either `first`, `last`, `center`, a `number` (custom index).

Example:

```tsx
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl flex flex-col items-start justify-center font-overused-grotesk bg-white p-2 text-[#0015ff] tracking-wide uppercase font-bold">
      <div className="flex flex-col justify-center w-full items-center space-y-4">
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 0,
          }}
        >
          {`THIS STAGGERS FROM FIRST`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom="last"
          reverse={true}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 1,
          }}
        >
          {`THIS STAGGERS FROM LAST`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom="center"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 2.3,
          }}
        >
          {`THIS STAGGERS FROM CENTER`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom={5}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 3.2,
          }}
        >
          {`THIS ONE FROM THE 5TH CHARACTER`}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

```

Or you can use the `random` option, which will animate the elements in a random order. You can see the multiline text in action here too:

Example:

```tsx
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text md:text-xl flex items-center justify-center font-overused-grotesk bg-white p-10 md:p-16 lg:p-24 text-[#0015ff]">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.002}
        staggerFrom="random"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 35,
          delay: 0.1,
        }}
        containerClassName="text-[#00000] leading-snug"
      >
        {`“When a small, unassuming object exceeds our expectations, we are not only surprised but pleased. Our usual reaction is something like, "That little thing did all that?" Simplicity is about the unexpected pleasure derived from what is likely to be insignificant and would otherwise go unnoticed. The smaller the object, the more forgiving we can be when it misbehaves.”
        ― John Maeda,`}
      </VerticalCutReveal>
    </div>
  )
}

```

### No auto start

If you don't want the animation to start automatically, you can set the `autoStart` prop to `false`. In this case, you can call the `startAnimation` method exposed via a ref to start the animation manually. Here is an example demonstrating how to do this when the component is inside the viewport (with the `useInView` hook from framer motion):

Example:

```tsx
"use client"

import { useEffect, useRef } from "react"
import { useInView } from "motion/react"

import VerticalCutReveal, {
  VerticalCutRevealRef,
} from "@/fancy/components/text/vertical-cut-reveal"

export default function Preview() {
  const ref = useRef(null)
  const textRef = useRef<VerticalCutRevealRef>(null)
  const isInView = useInView(ref, { once: false })

  useEffect(() => {
    if (isInView) {
      textRef.current?.startAnimation()
    } else {
      textRef.current?.reset()
    }
  }, [isInView])

  return (
    <div className="w-dvw h-dvh font-overused-grotesk bg-[#0015ff] overflow-auto text-white text md:text-4xl lg:text-4xl font-bold text-xl">
      <div className="h-full flex w-full  justify-center items-center ">
        Scroll down champ ↓
      </div>
      <div className="h-full  flex text-white justify-center items-center">
        <div ref={ref}>
          <VerticalCutReveal
            splitBy="characters"
            staggerDuration={0.02}
            staggerFrom="first"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 35,
              delay: 0.1,
            }}
            containerClassName="text-[#00000] leading-snug"
            ref={textRef}
            autoStart={false}
          >
            {`howdy! 👋`}
          </VerticalCutReveal>
        </div>
      </div>
    </div>
  )
}

```

## Notes

Since each element is "cutted" because of the `overflow-hidden` property, with some fonts and font-families (eg italic), parts of the letter may be cutoff. That's why you can use the `containerClassName` prop to style the container element, the `worldLeterLevelClassName` prop to style word level container, and the `elementLevelClassName` prop to style the individual split elements. You can add padding for example to accomodate more space for the text.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `string` | - | The text to be displayed and animated |
| reverse | `boolean` | `true` | Direction of the animation (true: bottom to top, false: top to bottom) |
| transition | `AnimationOptions` | `{ type: "spring", damping: 30, stiffness: 300 }` | Animation configuration for each element. Refer to motion docs for more details |
| splitBy | `"words" | "characters" | "lines" | string` | `"words"` | The split method for the text |
| staggerDuration | `number` | `0.2` | Delay between each element's animation start |
| staggerFrom | `"first" | "last" | "center" | "random" | number` | `"first"` | Starting index of the animation |
| containerClassName | `string` | - | Additional CSS classes for styling the container |
| wordLevelClassName | `string` | - | Additional CSS classes for styling the word level container |
| elementLevelClassName | `string` | - | Additional CSS classes for styling the individual elements |
| onClick | `() => void` | - | Callback function for click events |
| onStart | `() => void` | - | Callback function for when the animation starts |
| onComplete | `() => void` | - | Callback function for when the animation completes |
| autoStart | `boolean` | `true` | Whether to start the animation automatically |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/vertical-cut-reveal).*