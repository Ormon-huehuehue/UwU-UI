# Scroll and Swap Text

> A text component that swaps the letters vertically on scroll.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [scroll-and-swap-text](#scroll-and-swap-text)
- [Understanding the component](#understanding-the-component)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

import ScrollAndSwapText from "@/fancy/components/text/scroll-and-swap-text"

// Generate an array of imaginary names
const names = [
  "Alexandra Rodriguez",
  "Benjamin Chen",
  "Catherine Williams",
  "David Martinez",
  "Elena Petrov",
  "Francesco Rossi",
  "Gabriela Santos",
  "Henrik Larsson",
  "Isabella Thompson",
  "James Anderson",
  "Katarina Novak",
  "Leonardo Silva",
  "Maria Gonzalez",
  "Nikolai Volkov",
  "Olivia Johnson",
  "Pablo Hernandez",
  "Qiana Washington",
  "Ricardo Lopez",
  "Sophia Kim",
  "Thomas Mueller",
  "Ursula Schmidt",
  "Viktor Petersen",
  "Wen Li",
  "Xavier Dubois",
  "Yasmin Hassan",
  "Zachary Brown",
  "Amelia Davis",
  "Bruno Costa",
  "Clara Johansson",
  "Diego Morales",
  "Evelyn Taylor",
  "Felix Wagner",
  "Grace Wilson",
  "Hugo Andersen",
  "Iris Nakamura",
  "Julian Beck",
  "Kira Popovic",
  "Lucas Garcia",
  "Maya Patel",
  "Nathan Clark",
  "Ophelia Martin",
  "Pietro Romano",
  "Quinn O'Brien",
  "Rosa Fernandez",
  "Sebastian Lee",
  "Tara Mitchell",
  "Ulrich Weber",
  "Valentina Rosso",
  "William Jones",
  "Xiomara Reyes",
  "Yuki Tanaka",
  "Zara Ahmed",
  "Andre Leclerc",
  "Beatrice Hall",
  "Carlos Mendoza",
  "Delphine Moreau",
  "Emilio Bianchi",
  "Fiona Murphy",
  "Giovanni Conti",
  "Helena Svensson",
  "Ivan Dimitrov",
  "Jasmine Green",
  "Kai Nielsen",
  "Luna Torres",
  "Marco Esposito",
  "Nadia Kozlov",
  "Oscar Lindberg",
  "Penelope White",
  "Quincy Adams",
  "Rafael Vargas",
  "Stella Jackson",
  "Theo Van Der Berg",
  "Uma Sharma",
  "Vincenzo Ferrari",
  "Willow Parker",
  "Ximena Castillo",
  "Yolanda King",
  "Zander Cooper",
  "Aria Blackwood",
  "Bastien Dubois",
  "Camille Laurent",
  "Dante Ricci",
  "Estelle Moreau",
  "Fabio Santos",
  "Gemma Wright",
  "Hector Vega",
  "Ingrid Hansen",
  "Javier Ruiz",
  "Kaia Storm",
  "Liam O'Connor",
  "Mila Petrov",
  "Noah Fischer",
  "Octavia Bell",
  "Phoenix Rivera",
  "Quentin Gray",
  "Ruby Anderson",
  "Sage Thompson",
  "Tobias Klein",
  "Unity Cross",
  "Vera Kozlova",
  "Wade Turner",
  "Xara Moon",
  "York Sterling",
  "Zoe Martinez",
  "Atlas Kane",
  "Brielle Fox",
  "Caspian Reed",
  "Dara Singh",
  "Eden Blake",
  "Falcon Knight",
  "Gaia Stone",
  "Harbor Wells",
  "Indigo Vale",
  "Juno Pierce",
  "Knox Rivers",
]

export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const lenis = new Lenis({
      autoRaf: true,
      wrapper: containerRef.current,
      duration: 3,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div
      className="w-dvw h-dvh rounded-lg items-center justify-start font-overused-grotesk p-4 overflow-auto overscroll-auto bg-blue-500 text-white relative"
      ref={containerRef}
    >
      <div className="min-h-[200vh] flex justify-center items-start pt-96 uppercase relative">
        <p className="absolute top-4 left-4 font-bold text-xl">
          SCROLL SLOWLY
        </p>
        <div className="flex md:text-4xl sm:text-2xl text-3xl lg:text-4xl xl:text-5xl justify-center items-center flex-col leading-none -space-y-0">
          {names.map((name, index) => (
            <ScrollAndSwapText
              key={index}
              offset={[`0 0.2`, `0 0.8`]}
              className="font-bold leading-tighter"
              containerRef={containerRef}
            >
              {name}
            </ScrollAndSwapText>
          ))}
        </div>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/scroll-and-swap-text.json"
```

### Manual

#### scroll-and-swap-text

```tsx
"use client"

import React, { ElementType, useMemo, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

// handy function to extract text from children
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
    "ScrollAndSwapText: Children must be a string or a React element containing a string. " +
      "Complex nested structures are not supported."
  )
}

interface ScrollAndSwapTextProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default "span"
   */
  as?: ElementType

  /**
   * Reference to the container element for scroll tracking
   */
  containerRef: React.RefObject<HTMLElement>

  /**
   * Offset configuration for when the animation should start and end relative to the scroll container. Check motion documentation for more details.
   * @default ["0 0", "0 1"]
   */
  offset?: [string, string]

  /**
   * Additional CSS classes for styling the component
   */
  className?: string

  /**
   * Spring animation configuration for smoothing the scroll-based animation
   * @default { stiffness: 200, damping: 30 }
   */
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

/**
 * ScrollAndSwapText creates a scroll-triggered text animation where text slides vertically
 * based on scroll progress.
 */
const ScrollAndSwapText = ({
  children,
  as = "span",
  offset = ["0 0", "0 1"],
  className,
  containerRef,
  springConfig = { stiffness: 200, damping: 30 },
  ...props
}: ScrollAndSwapTextProps) => {
  const ref = useRef<HTMLElement>(null)

  // Convert children to string for processing with error handling
  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children)
    } catch (error) {
      console.error(error)
      return ""
    }
  }, [children])

  // Track scroll progress within the specified container and target element
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: offset as any, // framer motion doesnt export the type, so we have to cast it, sorry :/
    layoutEffect: false,
  })

  // Apply spring physics to smooth the scroll-based animation
  const springScrollYProgress = useSpring(scrollYProgress, springConfig)

  // Transform scroll progress into vertical translation values
  // Original text moves from 0% to -100% (slides up and out)
  const top = useTransform(springScrollYProgress, [0, 1], ["0%", "-100%"])
  // Replacement text moves from 100% to 0% (slides up from below)
  const bottom = useTransform(springScrollYProgress, [0, 1], ["100%", "0%"])

  const ElementTag = as

  return (
    <ElementTag
      className={cn("flex overflow-hidden relative items-center justify-center p-0", className)}
      ref={ref}
      {...props}
    >

      <span className="relative text-transparent" aria-hidden="true">
        {text}
      </span>
      
      <motion.span className="absolute" style={{ top: top }}>
        {text}
      </motion.span>
      
      <motion.span
        className="absolute"
        style={{ top: bottom }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
    </ElementTag>
  )
}

ScrollAndSwapText.displayName = "ScrollAndSwapText"

export default ScrollAndSwapText

```

## Understanding the component

The trick here is similar to the [Letter Swap Hover](/docs/components/text/letter-swap-hover) component—duplicate the text, then wrapping the them in a container with `relative` position, then stack the elements vertically. We use `useScroll` hook from motion to track the scroll position of the container, and use the `scrollYProgress` value to offset the vertical position of the elements (by setting the `y` property of the element).

## Notes

- In order to achieve a nice effect, you likely have to play with the container (where to track the scroll) and its offset. Please refer to motion's [documentation](https://www.framer.com/motion/use-scroll/) for more details.

- Make sure that the container has a non-static position, like `relative`, `fixed`, or `absolute` to ensure scroll offset is calculated correctly.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| as | `ElementType` | `"span"` | HTML Tag to render the component as |
| containerRef* | `React.RefObject` | - | Reference to the container element for scroll tracking |
| offset | `[string, string]` | `["0 0", "0 1"]` | Offset configuration for when the animation should start and end relative to the scroll container |
| className | `string` | - | Additional CSS classes for styling the component |
| springConfig | `{ stiffness?: number, damping?: number, mass?: number }` | `{ stiffness: 200, damping: 30 }` | Spring animation configuration for smoothing the scroll-based animation |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/scroll-and-swap).*