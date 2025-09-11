# Variable Font Hover By Letter

> A text component that animates the font variation settings of letters. Works only with variable fonts.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [variable-font-hover-by-letter](#variable-font-hover-by-letter)
- [Understanding Variable Fonts](#understanding-variable-fonts)
- [Resources](#resources)
- [Props](#props)

Example:

```tsx
import VariableFontHoverByLetter from "@/fancy/components/text/variable-font-hover-by-letter"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh rounded-lg sm:text-xl xs:text-sm md:text-2xl xl:text-3xl flex flex-col items-center justify-center font-overused-grotesk bg-white text-foreground dark:text-muted">
      <div className="w-full justify-start items-center p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="w-3/4">
          <h2>OPEN ROLES ✽</h2>
          <ul className="flex flex-col space-y-1 mt-6 md:mt-12 h-full cursor-pointer">
            <VariableFontHoverByLetter
              label="DESIGN ENGINEER (US)"
              staggerDuration={0.03}
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
            <VariableFontHoverByLetter
              label="PRODUCT DESIGNER (US/UK)"
              staggerDuration={0.0}
              transition={{ duration: 1, type: "spring" }}
              fromFontVariationSettings="'wght' 400, 'slnt' -10"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
            <VariableFontHoverByLetter
              label="ENGINEERING MANAGER (US)"
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
              staggerFrom={"last"}
            />
            <VariableFontHoverByLetter
              label="SALES ENGINEER (US)"
              staggerFrom={"center"}
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/variable-font-hover-by-letter.json"
```

### Manual

Install the following dependencies:

```bash
lodash
```

lodash is used for debouncing here — so the animation doesn't break on rapid hover changes.

Then, copy and paste the following code into your project:

#### variable-font-hover-by-letter

```tsx
"use client"

import { useState } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, stagger, useAnimate } from "motion/react"

interface TextProps {
  label: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

const VariableFontHoverByLetter = ({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { fontVariationSettings: toFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        { fontVariationSettings: fromFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre letter"
            aria-hidden="true"
          >
            {letter}
          </motion.span>
        )
      })}
    </motion.span>
  )
}

export default VariableFontHoverByLetter

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

<CodeSnippet>
```jsx
`fromFontVariationSettings="'wght' 100, 'slnt' 0"`
```
</CodeSnippet>

**Always check the font's documentation to see what are the available axes and their ranges.**

Important to mention that older browser versions and various environments don't support variable fonts, so make sure to check compatibility.

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
| transition | `AnimationOptions` | `{ type: "spring", duration: 0.7 }` | Transition settings for the animation. Refer to motion docs for more details |
| staggerDuration | `number` | `0.03` | Delay between each letter's animation start |
| staggerFrom | `"first" | "last" | "center" | number` | `"first"` | Starting point of the stagger effect. Number is the index of the letter where the stagger animation starts |
| onClick | `() => void` | - | Callback function for click events |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/variable-font-hover-by-letter).*