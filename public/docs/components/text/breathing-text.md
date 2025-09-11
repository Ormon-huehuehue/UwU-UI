# Breathing Text

> A text component that animates the font variation settings of letters in a breathing effect continuously. Works only with variable fonts.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [breathing-text](#breathing-text)
- [Understanding Variable Fonts](#understanding-variable-fonts)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
import BreathingText from "@/fancy/components/text/breathing-text"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-3xl sm:text-4xl md:text-5xl flex flex-row gap-12 items-center justify-center font-overused-grotesk bg-white">
      <div className="flex flex-col items-center justify-center text-black">
        <BreathingText
          staggerDuration={0.08}
          fromFontVariationSettings="'wght' 100, 'slnt' 0"
          toFontVariationSettings="'wght' 800, 'slnt' -10"
        >
          overused grotesk
        </BreathingText>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/breathing-text.json"
```

### Manual

#### breathing-text

```tsx
"use client"

import { ElementType } from "react"
import { motion, Transition, Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   */
  as?: ElementType

  /**
   * Initial font variation settings
   */
  fromFontVariationSettings: string

  /**
   * Target font variation settings to animate to
   */
  toFontVariationSettings: string

  /**
   * Animation transition configuration
   * @default { duration: 1.5, ease: "easeInOut" }
   */
  transition?: Transition

  /**
   * Duration of stagger delay between elements in seconds
   * @default 0.1
   */
  staggerDuration?: number

  /**
   * Direction to stagger animations from
   * @default "first"
   */
  staggerFrom?: "first" | "last" | "center" | number

  /**
   * Delay between animation repeats in seconds
   * @default 0.1
   */
  repeatDelay?: number
}

const BreathingText = ({
  children,
  as = "span",
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = {
    duration: 1.5,
    ease: "easeInOut",
  },
  staggerDuration = 0.1,
  staggerFrom = "first",
  repeatDelay = 0.1,
  className,
  ...props
}: TextProps) => {
  const letterVariants: Variants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat: Infinity,
        repeatType: "mirror",
        delay: i * staggerDuration,
        repeatDelay: repeatDelay,
      },
    }),
  }

  const getCustomIndex = (index: number, total: number) => {
    if (typeof staggerFrom === "number") {
      return Math.abs(index - staggerFrom)
    }
    switch (staggerFrom) {
      case "first":
        return index
      case "last":
        return total - 1 - index
      case "center":
      default:
        return Math.abs(index - Math.floor(total / 2))
    }
  }

  const letters = String(children).split("")
  const ElementTag = as

  return (
    <ElementTag
      className={cn(
        className,
        // an after pseudo element is used to create a container large enough to hold the text with full weight. Helps avoid layout shifts
        "relative after:absolute after:content-[attr(data-text)] after:font-black after:pointer-none after:overflow-hidden after:select-none after:invisible after:h-0"
      )}
      {...props}
      data-text={children}
    >
      {letters.map((letter: string, i: number) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          aria-hidden="true"
          variants={letterVariants}
          initial="initial"
          animate="animate"
          custom={getCustomIndex(i, letters.length)}
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{children}</span>
    </ElementTag>
  )
}

export default BreathingText

```

## Understanding Variable Fonts

This component is designed to work exclusively with variable fonts. Please refer to the [Variable Font Hover By Letter](https://uwuui.com/docs/components/text/variable-font-hover-by-letter#understanding-variable-fonts.md) documentation for more details.

## Notes

Since the animation is continous, keep the performance in check when using this component.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| as | `ElementType` | `"span"` | HTML Tag to render the component as |
| fromFontVariationSettings* | `string` | - | Initial font variation settings |
| toFontVariationSettings* | `string` | - | Target font variation settings to animate to |
| transition | `Transition` | `{ duration: 1.5, ease: "easeInOut" }` | Animation transition configuration |
| staggerDuration | `number` | `0.1` | Duration of stagger delay between elements in seconds |
| staggerFrom | `"first" | "last" | "center" | number` | `"first"` | Direction to stagger animations from |
| repeatDelay | `number` | `0.1` | Delay between animation repeats in seconds |
| className | `string` | - | Class name for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/breathing-text).*