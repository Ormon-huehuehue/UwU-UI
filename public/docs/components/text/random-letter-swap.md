# Random Letter Swap

> A text component that randomly swaps the letters vertically on hover.

## Table of Contents

- [Installation](#installation)
  - [Only forward animation](#only-forward-animation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [random-letter-swap-forward-anim](#random-letter-swap-forward-anim)
  - [Ping Pong animation](#ping-pong-animation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [random-letter-swap-pingpong-anim](#random-letter-swap-pingpong-anim)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

Example:

```tsx
import RandomLetterSwapForward from "@/fancy/components/text/random-letter-swap-forward-anim"
import RandomLetterSwapPingPong from "@/fancy/components/text/random-letter-swap-pingpong-anim"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh rounded-lg bg-white text-3xl md:text-5xl flex flex-col items-center justify-center font-overused-grotesk">
      <div className="h-full text-red-500 rounded-xl py-12  align-text-center gap-y-1 md:gap-y-2 flex flex-col justify-center items-center">
        <RandomLetterSwapForward
          label="Right here!"
          reverse={true}
          className=""
        />
        <RandomLetterSwapForward
          label="Right now!"
          reverse={false}
          className="font-bold italic px-4"
        />
        <RandomLetterSwapPingPong label="Right here!" className="" />
        <RandomLetterSwapPingPong
          label="Right now!"
          reverse={false}
          className=" font-bold"
        />
      </div>
    </div>
  )
}

```

There are two types of animations available for this component:

1. Forward animation — plays the animation timeline once forward.
2. Ping Pong animation — plays the animation timeline in a ping pong fashion.

## Installation

### Only forward animation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/random-letter-swap-forward-anim.json"
```

### Manual

Install the following dependencies:

```bash
lodash
```

Lodash is used for debouncing here — so the animation doesn't break on rapid hover changes.

Then, copy and paste the following code into your project:

#### random-letter-swap-forward-anim

```tsx
"use client"

import { useState } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, useAnimate } from "motion/react"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  className?: string
  onClick?: () => void
}

const RandomLetterSwapForward = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const mergeTransition = (transition: AnimationOptions, i: number) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from(
    { length: label.length },
    (_, i) => i
  ).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked) return
      setBlocked(true)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        animate(
          ".letter-" + randomIndex,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        ).then(() => {
          animate(
            ".letter-" + randomIndex,
            {
              y: 0,
            },
            {
              duration: 0,
            }
          )
        })

        animate(
          ".letter-secondary-" + randomIndex,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
          .then(() => {
            animate(
              ".letter-secondary-" + randomIndex,
              {
                top: reverse ? "-100%" : "100%",
              },
              {
                duration: 0,
              }
            )
          })
          .then(() => {
            if (i === label.length - 1) {
              setBlocked(false)
            }
          })
      }
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden ${className}`}
      onHoverStart={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span
              className={`relative pb-2 letter-${i}`}
              style={{ top: 0 }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary-${i}`}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default RandomLetterSwapForward

```

### Ping Pong animation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/random-letter-swap-pingpong-anim.json"
```

### Manual

Install the following dependencies:

```bash
lodash
```

Lodash is used for debouncing here — so the animation doesn't break on rapid hover changes.

Then, copy and paste the following code into your project:

#### random-letter-swap-pingpong-anim

```tsx
"use client"

import { useState } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, useAnimate } from "motion/react"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  className?: string
  onClick?: () => void
}

const RandomLetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const mergeTransition = (transition: AnimationOptions, i: number) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from(
    { length: label.length },
    (_, i) => i
  ).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked) return
      setBlocked(true)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        animate(
          ".letter-" + randomIndex,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        )

        animate(
          ".letter-secondary-" + randomIndex,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setBlocked(false)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        animate(
          ".letter-" + randomIndex,
          {
            y: 0,
          },
          mergeTransition(transition, i)
        )

        animate(
          ".letter-secondary-" + randomIndex,
          {
            top: reverse ? "-100%" : "100%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span
              className={`relative pb-2 letter-${i}`}
              style={{ top: 0 }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary-${i}`}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default RandomLetterSwapPingPong

```

## Understanding the component

The component works the same as the [Letter Swap Hover](https://uwuui.com/docs/components/text/letter-swap.md) component, but with a random letter swapping animation (and of course, a slightly different implementation of the animation). Please refer to that documentation for more details.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| label* | `string` | - | The text to be displayed and animated |
| reverse | `boolean` | `true` | Direction of the animation (true: bottom to top, false: top to bottom) |
| transition | `AnimationOptions` | `{ type: "spring", duration: 0.7 }` | Animation configuration for each letter |
| staggerDuration | `number` | `0.03` | Delay between each letter's animation start |
| className | `string` | - | Additional CSS classes for styling |
| onClick | `() => void` | - | Callback function for click events |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/random-letter-swap).*