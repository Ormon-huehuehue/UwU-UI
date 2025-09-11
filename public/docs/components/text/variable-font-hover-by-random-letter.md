# Variable Font Hover By Random Letter

> A text component that animates the font variation settings of letters in a random order. Works only with variable fonts.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [variable-font-hover-by-random-letter](#variable-font-hover-by-random-letter)
- [Understanding Variable Fonts](#understanding-variable-fonts)
  - [Font variation example prop](#font-variation-example-prop)
- [Resources](#resources)
- [Props](#props)

Example:

```tsx
import VariableFontHoverByRandomLetter from "@/fancy/components/text/variable-font-hover-by-random-letter"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh rounded-lg items-center justify-center font-overused-grotesk p-24 bg-linear-to-br text-[#1f464d] bg-white ">
      <div className="w-full h-full items-center justify-center flex">
        <VariableFontHoverByRandomLetter
          label="Let's Go!"
          staggerDuration={0.03}
          className="rounded-full items-center flex justify-center cursor-pointer px-8 py-5 align-text-top text-4xl sm:text-5xl md:text-7xl"
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' 0"
        />
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/variable-font-hover-by-random-letter.json"
```

### Manual

#### variable-font-hover-by-random-letter

```tsx
"use client"

import { useMemo } from "react"
import { motion, Transition } from "motion/react"

// Function to shuffle an array
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

interface TextProps {
  label: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  transition?: Transition
  staggerDuration?: number
  className?: string
  onClick?: () => void
}

const VariableFontHoverByRandomLetter = ({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  className,
  onClick,
  ...props
}: TextProps) => {
  const shuffledIndices = useMemo(() => {
    const indices = Array.from({ length: label.length }, (_, i) => i)
    shuffleArray(indices)
    return indices
  }, [label])

  const letterVariants = {
    hover: (index: number) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
    initial: (index: number) => ({
      fontVariationSettings: fromFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
  }

  return (
    <motion.span
      className={`${className}`}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        const index = shuffledIndices[i]
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            aria-hidden="true"
            variants={letterVariants}
            custom={index}
          >
            {letter}
          </motion.span>
        )
      })}
    </motion.span>
  )
}

export default VariableFontHoverByRandomLetter

```

## Understanding Variable Fonts

This component is designed to work exclusively with variable fonts. Variable fonts are a modern font technology that allows a single font file to contain multiple variations of a typeface — these variations can be adjusted along different axes, such as weight, width, or slant, etc.

Each axis in a variable font has a minimum and maximum value, and you can interpolate between these values to create custom styles. Common axes include:

- Weight (`wght`): Controls the thickness of the letterforms (usually ranges from 100 to 900)
- Width (`wdth`): Controls the width of the letterforms
- Slant (`slnt`): Changes the angle of the letterforms
- Italic (`ital`): Also controls the slant of the letterforms
- Optical Size (`opsz`): Controls the size of the letterforms

These 5 axes are actually standardized, so when a font have them, they will have the names above. But, a font can have limitless custom axes too, with completely arbitrary names.

In this component, the `fromFontVariationSettings` and `toFontVariationSettings` props define the starting and ending states of the font variation. For example, using the [Overused Grotesk](https://github.com/RandomMaerks/Overused-Grotesk) font (which we use in this demo), we can modify the 'slnt' (slant) and 'wght' (weight) axes:

- The `slnt` axis ranges from 0 (up) to -10 (upright)
- The `wght` axis ranges from 100 (thin) to 900 (black)

An example prop therefore would be:

### Font variation example prop

```jsx
  fromFontVariationSettings="'wght' 100, 'slnt' 0"
```

**Always check the font's documentation to see what are the available axes and their ranges.**

Important to mention that older browsers versions and various environemnts don't support variable fonts, so make sure to check compatibility.

## Resources

I highly recommend to go down the rabbit hole, it's super fun :)

- [MDN Web Docs for Variable fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [Super cool article by ABC Dinamo](https://abcdinamo.com/news/using-variable-fonts-on-the-web)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| label* | `string` | - | The text to be displayed and animated |
| fromFontVariationSettings* | `string` | - | Initial font variation settings |
| toFontVariationSettings* | `string` | - | Target font variation settings on hover |
| className | `string` | - | Additional CSS classes for styling |
| transition | `Transition` | `{ type: "spring", duration: 0.7 }` | Transition settings for the animation. Refer to motion docs for more details |
| staggerDuration | `number` | `0.03` | Delay between each letter's animation start |
| onClick | `() => void` | - | Callback function for click events |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/variable-font-hover-by-random-letter).*