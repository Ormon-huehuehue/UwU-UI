# Letter 3D Swap

> A text component that swap the letters in a text with a box 3D effect.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [letter-3d-swap](#letter-3d-swap)
- [Usage](#usage)
- [Understanding the component](#understanding-the-component)
  - [Splitting the text into characters](#splitting-the-text-into-characters)
  - [Splitting the text into characters](#splitting-the-text-into-characters)
  - [Splitting the text into animation segments](#splitting-the-text-into-animation-segments)
  - [3D Transforms](#3d-transforms)
    - [Top and bottom rotations](#top-and-bottom-rotations)
    - [Left and right rotations](#left-and-right-rotations)
    - [Why the initial translation?](#why-the-initial-translation)
  - [Animation](#animation)
  - [Animation](#animation)
  - [Stagger](#stagger)
  - [Stagger delay calculation](#stagger-delay-calculation)
- [Resources](#resources)
- [Props](#props)
  - [Letter3DSwapProps](#letter3dswapprops)

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/letter-3d-swap.json"
```

### Manual

#### letter-3d-swap

```tsx
"use client"

import React, { ElementType, useCallback, useMemo, useState } from "react"
import {
  AnimationOptions,
  useAnimate,
  ValueAnimationTransition,
} from "motion/react"

import { cn } from "@/lib/utils"

// handy function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text)
}

// handy function  to extract text from children
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === "string") return children

  if (React.isValidElement(children)) {
    const childText = children.props.children
    if (typeof childText === "string") return childText
    if (React.isValidElement(childText)) {
      return extractTextFromChildren(childText)
    }
  }

  throw new Error(
    "Letter3DSwap: Children must be a string or a React element containing a string. " +
      "Complex nested structures are not supported."
  )
}

/**
 * Internal helper interface for representing a word in the text with its characters and spacing information
 */
interface WordObject {
  /**
   * Array of individual characters in the word
   */
  characters: string[]
  /**
   * Whether this word needs a space after it
   */
  needsSpace: boolean
}

interface Letter3DSwapProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   */
  as?: ElementType
  /**
   * Class name for the main container element.
   */
  mainClassName?: string

  /**
   * Class name for the front face element.
   */
  frontFaceClassName?: string

  /**
   * Class name for the secondary face element.
   */
  secondFaceClassName?: string

  /**
   * Duration of stagger delay between elements in seconds.
   * @default 0.05
   */
  staggerDuration?: number

  /**
   * Direction to stagger animations from.
   * @default "first"
   */
  staggerFrom?: "first" | "last" | "center" | number | "random"

  /**
   * Animation transition configuration.
   * @default { type: "spring", damping: 25, stiffness: 300 }
   */
  transition?: ValueAnimationTransition | AnimationOptions

  /**
   * Direction of rotation
   * @default "right"
   */
  rotateDirection?: "top" | "right" | "bottom" | "left"
}

const Letter3DSwap = ({
  children,
  as = "p",
  mainClassName,
  frontFaceClassName,
  secondFaceClassName,
  staggerDuration = 0.05,
  staggerFrom = "first",
  transition = { type: "spring", damping: 30, stiffness: 300 },
  rotateDirection = "right",
  ...props
}: Letter3DSwapProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [scope, animate] = useAnimate()

  // Determine rotation transform based on direction
  const rotationTransform = (() => {
    switch (rotateDirection) {
      case "top":
        return "rotateX(90deg)"
      case "right":
        return "rotateY(90deg)"
      case "bottom":
        return "rotateX(-90deg)"
      case "left":
        return "rotateY(90deg)"
      default:
        return "rotateY(-90deg)"
    }
  })()

  // Convert children to string for processing with error handling
  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children)
    } catch (error) {
      console.error(error)
      return ""
    }
  }, [children])

  // Splitting the text into animation segments
  const characters = useMemo(() => {
    const t = text.split(" ")
    const result = t.map((word: string, i: number) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== t.length - 1,
    }))
    return result
  }, [text])

  // Helper function to calculate stagger delay for each text segment
  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      const total = totalChars
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
    [staggerFrom, staggerDuration]
  )

  // Handle hover start - trigger the rotation
  const handleHoverStart = useCallback(async () => {
    if (isAnimating || isHovering) return

    setIsHovering(true)
    setIsAnimating(true)

    const totalChars = characters.reduce(
      (sum: number, word: WordObject) => sum + word.characters.length,
      0
    )

    // Create delays array based on staggerFrom
    const delays = Array.from({ length: totalChars }, (_, i) => {
      return getStaggerDelay(i, totalChars)
    })

    // Animate each character with its specific delay
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: rotationTransform },
      {
        ...transition,
        delay: (i: number) => delays[i],
      }
    )

    // Reset all boxes
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: "rotateX(0deg) rotateY(0deg)" },
      { duration: 0 }
    )

    setIsAnimating(false)
  }, [
    isAnimating,
    isHovering,
    characters,
    transition,
    getStaggerDelay,
    rotationTransform,
    animate,
  ])

  // Handle hover end
  const handleHoverEnd = useCallback(() => {
    setIsHovering(false)
  }, [])

  const ElementTag = as ?? "p"

  return (
    <ElementTag
      className={cn("flex flex-wrap relative", mainClassName)}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{text}</span>

      {characters.map(
        (wordObj: WordObject, wordIndex: number, array: WordObject[]) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce(
              (sum: number, word: WordObject) => sum + word.characters.length,
              0
            )

          return (
            <span key={wordIndex} className="inline-flex">
              {wordObj.characters.map((char: string, charIndex: number) => {
                const totalIndex = previousCharsCount + charIndex

                return (
                  <CharBox
                    key={totalIndex}
                    char={char}
                    frontFaceClassName={frontFaceClassName}
                    secondFaceClassName={secondFaceClassName}
                    rotateDirection={rotateDirection}
                  />
                )
              })}
              {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
            </span>
          )
        }
      )}
    </ElementTag>
  )
}

interface CharBoxProps {
  char: string
  frontFaceClassName?: string
  secondFaceClassName?: string
  rotateDirection: "top" | "right" | "bottom" | "left"
}

const CharBox = ({
  char,
  frontFaceClassName,
  secondFaceClassName,
  rotateDirection,
}: CharBoxProps) => {
  // Get the transform for the second face based on rotation direction
  const getSecondFaceTransform = () => {
    switch (rotateDirection) {
      case "top":
        return `rotateX(-90deg) translateZ(0.5lh)`
      case "right":
        return `rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)`
      case "bottom":
        return `rotateX(90deg) translateZ(0.5lh)`
      case "left":
        return `rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)`
      default:
        return `rotateY(90deg) translateZ(1ch)`
    }
  }

  const secondFaceTransform = getSecondFaceTransform()

  return (
    <span
      className="letter-3d-swap-char-box-item inline-box transform-3d"
      style={{
        transform:
          rotateDirection === "top" || rotateDirection === "bottom"
            ? "translateZ(-0.5lh)"
            : "rotateY(90deg) translateX(50%) rotateY(-90deg)",
      }}
    >
      {/* Front face */}
      <div
        className={cn("relative backface-hidden h-[1lh]", frontFaceClassName)}
        style={{
          transform: `${
            rotateDirection === "top" || rotateDirection === "bottom"
              ? "translateZ(0.5lh)"
              : rotateDirection === "left"
                ? "rotateY(90deg) translateX(50%) rotateY(-90deg)"
                : "rotateY(-90deg) translateX(50%) rotateY(90deg)"
          }`,
        }}
      >
        {char}
      </div>

      {/* Second face - positioned based on rotation direction */}
      <span
        className={cn(
          "absolute backface-hidden h-[1lh] top-0 left-0",
          secondFaceClassName
        )}
        style={{
          transform: secondFaceTransform,
        }}
      >
        {char}
      </span>
    </span>
  )
}

Letter3DSwap.displayName = "Letter3DSwap"

export default Letter3DSwap

```

## Usage

Just wrap your text with the component and set the `rotateDirection` prop to the direction you want the text to rotate, the rest will be taken care by the component.

## Understanding the component

### Splitting the text into characters

First, we split the text into `WorldObject` objects, each containing an array of characters and a boolean indicating whether there should be a space after the character. We use a handy function for this, which should respect emojis too.
### Splitting the text into characters

```tsx
// handy function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text)
}
```

This method also helps us to ensure that words stay together and properly spaced when the text wraps across multiple lines. Without this approach, simply splitting by characters would break words at line boundaries.

### Splitting the text into animation segments

```tsx
// Splitting the text into animation segments
const characters = useMemo(() => {
    const t = text.split(" ")
    const result = t.map((word: string, i: number) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== t.length - 1,
    }))
    return result
}, [text])
```

### 3D Transforms

When rendering each character, we create two instances of it - a front face and a second face. The second face is positioned relative to the first one and uses 3D CSS transforms to create the illusion that it's on a different face of a 3D box. The face it appears on depends on the `rotateDirection` prop:

- `"top"` - Character appears to flip upward from the top face
- `"right"` - Character appears to flip from the right side 
- `"bottom"` - Character appears to flip downward from the bottom face
- `"left"` - Character appears to flip from the left side

#### Top and bottom rotations

For top and bottom rotations, we create a 3D box effect through a series of transforms:

1. The front face is brought forward by translating it `0.5lh` on the Z axis (`lh` represents one line height)
2. For the second face, we:
   - Rotate it 90° (or -90°) on the X axis
   - Then translate it `0.5lh` forward in its local coordinate system to align with the edge of our virtual box
3. Finally, we translate the container back by `-0.5lh` to account for the initial translation of the front face

This creates the illusion of characters flipping between two faces of a 3D cube. The demo below shows how these transforms work together:

#### Left and right rotations

For left/right rotations, we need to handle the box dimensions more carefully. Unlike top/bottom rotations where we can use line height (`lh`) as a fixed measurement, the width of each character varies. The side faces of our 3D box need to match the actual character width.

To achieve this, we use percentage-based translations on the X and Y axes, since these can automatically adapt to each character's width. The transform sequence works like this:

1. First face:
   - Rotate 90° on Y axis to face sideways
   - Translate 50% of character width to align with edge
   - Rotate -90° on Y axis to face forward again
   
2. Second face:
   - Apply the same transforms as the first face
   - Add additional transforms to position it correctly on the side

3. Lastly, we push back both faces to account for the initial translation

The demo below shows this transform sequence step by step:

#### Why the initial translation?

The initial forward translation of our box (using `0.5lh` for `top`/`bottom` rotations, or the transform chain for `left`/`right` rotations) serves an important purpose. It ensures the rotation axis passes through the center of our virtual 3D box, rather than along its front face. This creates a more natural flipping motion, as the character rotates around its center point rather than pivoting from its front edge. Without this translation, the box rotation would appear to swing outward in an unnatural arc rather than flipping in place.

Of course, you can achieve the same result by applying (other) transforms in a different order, and even playing with the transform origins. I apologise if this seems overcomplicated, this is how it made sense to me :).

### Animation

Now that we have our virtual 3D box, the only thing left is to rotate each character box. For this, we use the `useAnimate` hook from [motion](https://motion.dev/docs/use-animate). This gives us a scope and an `animate` function to control the animation. We add `.letter-3d-swap-char-box-item` class name to each char box, so we can select and animate them with the `animate` function. After the animation is completed, we reset the transform to the original state.

### Animation

```tsx
// Animate each character with its specific delay
await animate(
  ".letter-3d-swap-char-box-item",
  { transform: rotationTransform },
  {
    ...transition,
    delay: (i: number) => delays[i],
  }

// Reset all boxes
await animate(
  ".letter-3d-swap-char-box-item",
  { transform: "rotateX(0deg) rotateY(0deg)" },
  { duration: 0 }
)
```

The transform is just a 90/-90 degree rotation either on the X or Y axis, depending on the `rotateDirection` prop.

### Stagger

The delay is calculated based on the `staggerFrom` prop, which can be set to `first`, `last`, `center`, `random` or a number. If it's a number, it's used as the index of the character to stagger from. For example, if `staggerFrom` is set to `2`, the second character will be staggered from the third one. We have a handy function to calculate the correct delay for each character:

### Stagger delay calculation

```tsx
// Helper function to calculate stagger delay for each text segment
const getStaggerDelay = useCallback(
  (index: number, totalChars: number) => {
    const total = totalChars
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
  [staggerFrom, staggerDuration]
)
```

Check out the demo to see the possible values for `staggerFrom`.

## Resources

- [Intro to CSS 3D transforms](https://3dtransforms.desandro.com/) by David DeSandro

## Props

### Letter3DSwapProps

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| as | `ElementType` | `p` | HTML Tag to render the component as |
| mainClassName | `string` | - | Class name for the main container element |
| frontFaceClassName | `string` | - | Class name for the front face element |
| secondFaceClassName | `string` | - | Class name for the secondary face element |
| staggerDuration | `number` | `0.05` | Duration of stagger delay between elements in seconds |
| staggerFrom | `"first" | "last" | "center" | "random" | number` | `"first"` | Direction to stagger animations from |
| transition | `ValueAnimationTransition | AnimationOptions` | `{ type: "spring", damping: 25, stiffness: 300 }` | Animation transition configuration |
| rotateDirection | `"top" | "right" | "bottom" | "left"` | `"right"` | Direction of rotation |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/letter-3d-swap).*