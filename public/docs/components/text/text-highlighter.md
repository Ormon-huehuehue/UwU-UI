# Text Highlighter

> An animated text highlighting component with multiple trigger modes and directional animations.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [text-highlighter](#text-highlighter)
- [Usage](#usage)
  - [Usage example](#usage-example)
- [Understanding the component](#understanding-the-component)
  - [Highlighter style](#highlighter-style)
  - [Get animation values by direction](#get-animation-values-by-direction)
  - [Animation](#animation)
  - [Different directions](#different-directions)
  - [Hover](#hover)
  - [Control via ref](#control-via-ref)
- [Notes](#notes)
  - [Fancier highlight color](#fancier-highlight-color)
- [Props](#props)
  - [TextHighlighterProps](#texthighlighterprops)
  - [TextHighlighterRef](#texthighlighterref)

Example:

```tsx
"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

import { TextHighlighter } from "@/fancy/components/text/text-highlighter"

export default function TextHighlighterDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const transition = { type: "spring", duration: 1, delay: 0.4, bounce: 0 }
  const highlightClass = "rounded-[0.3em] px-px"
  const highlightColor = "#F2AD91"
  const inViewOptions = { once: true, initial: true, amount: 0.1 }

  useEffect(() => {
    if (!containerRef.current) return

    const lenis = new Lenis({
      autoRaf: true,
      wrapper: containerRef.current,
      duration: 1.2,
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
    <div className="w-dvw h-dvh bg-[#fefefe] relative p-0">
      <div className="absolute bottom-0 w-full left-0 h-64 bg-gradient-to-t from-[#fefefe] from-10% via-50% via-[#fefefe]/50 to-transparent pointer-events-none isolate" />

      <div
        className="h-full w-full z-10 bg-[#fefefe] overflow-scroll"
        ref={containerRef}
      >
        <div className="max-w-md mx-auto px-4 mt-40 pb-64 p-0  text-black">
          <h1 className="text-4xl font-medium mb-20 font-calendas tracking-tight">
            Typeface alphabets
          </h1>

          <div className="text leading-normal space-y-4 font-overusedGrotesk ">
            <p className="whitespace-break-spaces">
              The present-day designer has a host of printing types at his
              disposal.{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                Since Gutenberg first invented movable type in 1436-55
              </TextHighlighter>{" "}
              hundreds of different types have been designed and cast in lead.{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                The most recent technical developments
              </TextHighlighter>{" "}
              with computer and photo-typesetting have once again brought new
              faces or variations of old ones on the market.
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                The choice is up to the designer
              </TextHighlighter>{" "}
              It is left to his feeling for form to use{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                good or poor typefaces
              </TextHighlighter>{" "}
              for his design work. In view of the limited space available, we
              shall refer here to only a few of the outstanding designs of the
              past and the 20th century which have appeared most frequently in
              publications.
            </p>

            <p>
              Knowledge of the quality of a typeface is of the greatest
              importance for the{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                functional, aesthetic and psychological effect
              </TextHighlighter>{" "}
              of printed matter. Again, the typographic design, i. e. the
              correct spaces between letters and words and the length and
              spacing of lines conducive to easy reading, does much to enhance
              the impression created.{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                Today the field is dominated mainly by computer and
                photo-typesetting
              </TextHighlighter>{" "}
              A typical characteristic of these forms of composition is the too
              narrow setting of the letters which makes reading difficult. The
              designer will be well advised to demand the normal spacing between
              letters when ordering photo-typesetting.
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                By studying the classic designs
              </TextHighlighter>{" "}
              of{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                Garamond, Casion, Bodoni, Walbaum
              </TextHighlighter>{" "}
              and others, the designer can learn what the timeless criteria are
              which produce a refined and artistic typeface that makes for ease
              of reading.
            </p>

            <p>
              The lead type designs of{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                Berthold, Helvetica, Folio, Univers
              </TextHighlighter>{" "}
              etc. produce pleasant and easily legible type areas. The
              typographic rules that apply to the roman typefaces are also valid
              for the sans serifs.
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                The creators of these type designs
              </TextHighlighter>{" "}
              were extremely intelligent artists with high creative powers. This
              is shown by the fact that for more than four centuries innumerable
              type designers have sought to create new type alphabets but very
              few of these have gained acceptance.{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                An alphabet of Garamond
              </TextHighlighter>{" "}
              for example, is an artistic achievement of the first order. Each
              letter has its own unmistakable face, whether lower or upper case,
              and displays the highest quality of form and originality. Each
              letter has its own personality and makes a marked impact.
            </p>

            <p>
              Every designer who is concerned with typography should take the
              trouble when creating graphic designs to{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                sketch words and sentences by hand
              </TextHighlighter>{" "}
              Many designers take advantage of the Letraset process, which can
              undoubtedly produce a clean draft design that is almost ready for
              press. But a feeling for good letter forms and an attractive
              typeface can be acquired only by constant and careful practice in
              sketching letters.
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                How the forms of letters can create simultaneously both tension
                and nobility
              </TextHighlighter>{" "}
              and how pleasantly legible lines of type can appear to the eye of
              the reader may be seen from the examples on the following pages.
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                The Renaissance created midline typography
              </TextHighlighter>{" "}
              which held its position until the 20th century.
            </p>

            <p>
              The new typography differs from the old in that it is the first to
              try to{" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                develop the outward appearance from the function of the text
              </TextHighlighter>
            </p>

            <p>
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                The new typography uses the background
              </TextHighlighter>{" "}
              as an element of design which is on a par with the other elements.
            </p>

            <p>
              Earlier typography (midline typography){" "}
              <TextHighlighter
                className={highlightClass}
                transition={transition}
                highlightColor={highlightColor}
                useInViewOptions={inViewOptions}
              >
                played an active role against a dead, passive background.
              </TextHighlighter>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/text-highlighter.json"
```

### Manual

#### text-highlighter

```tsx
"use client"

import {
  ElementType,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, Transition, useInView, UseInViewOptions } from "motion/react"

import { cn } from "@/lib/utils"

type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt"

type TextHighlighterProps = {
  /**
   * The text content to be highlighted
   */
  children: React.ReactNode

  /**
   * HTML element to render as
   * @default "p"
   */
  as?: ElementType

  /**
   * How to trigger the animation
   * @default "inView"
   */
  triggerType?: "hover" | "ref" | "inView" | "auto"

  /**
   * Animation transition configuration
   * @default { duration: 0.4, type: "spring", bounce: 0 }
   */
  transition?: Transition

  /**
   * Options for useInView hook when triggerType is "inView"
   */
  useInViewOptions?: UseInViewOptions

  /**
   * Class name for the container element
   */
  className?: string

  /**
   * Highlight color (CSS color string). Also can be a function that returns a color string, eg:
   * @default 'hsl(60, 90%, 68%)' (yellow)
   */
  highlightColor?: string

  /**
   * Direction of the highlight animation
   * @default "ltr" (left to right)
   */
  direction?: HighlightDirection
} & React.HTMLAttributes<HTMLElement>

export type TextHighlighterRef = {
  /**
   * Trigger the highlight animation
   * @param direction - Optional direction override for this animation
   */
  animate: (direction?: HighlightDirection) => void

  /**
   * Reset the highlight animation
   */
  reset: () => void
}

export const TextHighlighter = forwardRef<
  TextHighlighterRef,
  TextHighlighterProps
>(
  (
    {
      children,
      as = "span",
      triggerType = "inView",
      transition = { type: "spring", duration: 1, delay: 0, bounce: 0 },
      useInViewOptions = {
        once: true,
        initial: false,
        amount: 0.1,
      },
      className,
      highlightColor = "hsl(25, 90%, 80%)",
      direction = "ltr",
      ...props
    },
    ref
  ) => {
    const componentRef = useRef<HTMLDivElement>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [currentDirection, setCurrentDirection] =
      useState<HighlightDirection>(direction)

    // this allows us to change the direction whenever the direction prop changes
    useEffect(() => {
      setCurrentDirection(direction)
    }, [direction])

    const isInView =
      triggerType === "inView"
        ? useInView(componentRef, useInViewOptions)
        : false

    useImperativeHandle(ref, () => ({
      animate: (animationDirection?: HighlightDirection) => {
        if (animationDirection) {
          setCurrentDirection(animationDirection)
        }
        setIsAnimating(true)
      },
      reset: () => setIsAnimating(false),
    }))

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : triggerType === "auto"
              ? true
              : false

    const ElementTag = as || "span"

    // Get background size based on direction
    const getBackgroundSize = (animated: boolean) => {
      switch (currentDirection) {
        case "ltr":
          return animated ? "100% 100%" : "0% 100%"
        case "rtl":
          return animated ? "100% 100%" : "0% 100%"
        case "ttb":
          return animated ? "100% 100%" : "100% 0%"
        case "btt":
          return animated ? "100% 100%" : "100% 0%"
        default:
          return animated ? "100% 100%" : "0% 100%"
      }
    }

    // Get background position based on direction
    const getBackgroundPosition = () => {
      switch (currentDirection) {
        case "ltr":
          return "0% 0%"
        case "rtl":
          return "100% 0%"
        case "ttb":
          return "0% 0%"
        case "btt":
          return "0% 100%"
        default:
          return "0% 0%"
      }
    }

    const animatedSize = useMemo(() => getBackgroundSize(shouldAnimate), [shouldAnimate, currentDirection])
    const initialSize = useMemo(() => getBackgroundSize(false), [currentDirection])
    const backgroundPosition = useMemo(() => getBackgroundPosition(), [currentDirection])

    const highlightStyle = {
      backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: backgroundPosition,
      backgroundSize: animatedSize,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    } as React.CSSProperties

    return (
      <ElementTag
        ref={componentRef}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
        {...props}
      >
        <motion.span
          className={cn("inline", className)}
          style={highlightStyle}
          animate={{
            backgroundSize: animatedSize,
          }}
          initial={{
            backgroundSize: initialSize,
          }}
          transition={transition}
        >
          {children}
        </motion.span>
      </ElementTag>
    )
  }
)

TextHighlighter.displayName = "TextHighlighter"

export default TextHighlighter

```

## Usage

Just wrap your text content with the component and set the highlight color with the `highlightColor` prop.
### Usage example

```tsx
<TextHighlighter highlightColor="hsl(25, 90%, 80%)">Howdy!</TextHighlighter>
```

## Understanding the component

The magic behind this component lies in animating the text's background. Instead of using a solid background color (CSS prop: `background-color`), we use `background-image` with a linear gradient. This allows us to animate the entire background of the text by changing the `background-size` property; something that wouldn't be possible with the simple `background-color` property. We also use a linear gradient because we can't set a solid color directly as a background image (as far as I know).

### Highlighter style

```tsx
const highlightStyle = {
  backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: backgroundPosition,
  backgroundSize: animatedSize,
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
} as React.CSSProperties
```

We also use `box-decoration-break: clone` to make sure each individual line is properly highlighted when dealing with multi-line text. Check out [this demo](https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break) why this is important.

The direction of the highlight reveal is controlled by the `direction` prop. Depending on the value, we set the `background-position` and `background-size` accordingly. There is two function which returns the appropriate values:

### Get animation values by direction

```tsx
// Get background size based on direction
const getBackgroundSize = (animated: boolean) => {
  switch (currentDirection) {
    case "ltr":
      return animated ? "100% 100%" : "0% 100%"
    case "rtl":
      return animated ? "100% 100%" : "0% 100%"
    case "ttb":
      return animated ? "100% 100%" : "100% 0%"
    case "btt":
      return animated ? "100% 100%" : "100% 0%"
    default:
      return animated ? "100% 100%" : "0% 100%"
  }
}

// Get background position based on direction
const getBackgroundPosition = () => {
  switch (currentDirection) {
    case "ltr":
      return "0% 0%"
    case "rtl":
      return "100% 0%"
    case "ttb":
      return "0% 0%"
    case "btt":
      return "0% 100%"
    default:
      return "0% 0%"
  }
}
```

Then, we just use motion to animate the `background-size` property based on the `shouldAnimate` state:

### Animation

```tsx
<motion.span
  className={cn("inline", className)}
  style={highlightStyle}
  animate={{
    backgroundSize: animatedSize,
  }}
  initial={{
    backgroundSize: initialSize,
  }}
  transition={transition}
>
  {children}
</motion.span>
```

You can customize the transition by passing a `Transition` object to the `transition` prop. The default value is spring type animation `{ type: "spring", duration: 1, delay: 0., bounce: 0 }`.

By default, the animation will be triggered once the component is mounted. Another interesting trigger option is `inView`, which will trigger the animation when the component enters the viewport (demonstrated in the demo above). You can customize that behaviour by setting the `useInViewOptions` prop. For more information, check out the [useInView](https://www.react-spring.io/docs/hooks/use-in-view) documentation.

### Different directions

You can control the highlight animation direction via the `direction` prop. The available options are:

- `"ltr"` - Left to right animation
- `"rtl"` - Right to left animation  
- `"ttb"` - Top to bottom animation
- `"btt"` - Bottom to top animation

The following demo shows how to dynamically change the reveal direction based on the user's scroll direction. Scroll left and right to see the animations trigger.

Example:

```tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

import { TextHighlighter } from "@/fancy/components/text/text-highlighter"

const HIGHLIGHT_COLOR = "hsl(80, 100%, 50%)"

const DEMO_USE_IN_VIEW_OPTIONS = { once: false, initial: false, amount: 0.1 }
const DEMO_TRANSITION = { type: "spring", duration: 1, delay: 0.4, bounce: 0 }

const SECTION_CLASSES =
  "min-w-full h-full snap-start flex items-center justify-center shrink-0"
const CONTAINER_CLASSES =
  "max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 sm:px-6"
const PARAGRAPH_CLASSES =
  "text-sm sm:text-base md:text-lg leading-relaxed font-overusedGrotesk mb-3 sm:mb-4 last:mb-0"

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: false,
    margin: "-20%",
    amount: 0.5,
  })

  return (
    <section className={SECTION_CLASSES}>
      <div className={CONTAINER_CLASSES}>
        <motion.div
          ref={ref}
          initial={{
            opacity: 0,
            filter: "blur(8px)",
          }}
          animate={
            isInView
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0.3, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.8,
            delay: isInView ? delay : 0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="space-y-4"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className={PARAGRAPH_CLASSES}>{children}</p>
}

export default function TextHighlighterDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(1)
  const [scrollDirection, setScrollDirection] = useState<"ltr" | "rtl">("ltr")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let prevScrollLeft = container.scrollLeft

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const sectionIndex = Math.round(scrollLeft / containerWidth) + 1
      setCurrentSection(Math.min(5, Math.max(1, sectionIndex)))

      const scrollDiff = scrollLeft - prevScrollLeft
      if (Math.abs(scrollDiff) > 5) {
        setScrollDirection(scrollDiff > 0 ? "ltr" : "rtl")
      }
      prevScrollLeft = scrollLeft
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="w-dvw h-dvh bg-[#fff] text-black relative p-0">
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-1/2 z-20 text-sm sm:text-base -translate-x-1/2 rounded-full border border-black/80 px-2 sm:px-3 pb-0.5 flex items-center justify-center w-8 sm:w-10 tabular-nums">
        <div key={currentSection} className="font-overusedGrotesk">
          {currentSection.toString().padStart(2, "0")}
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full w-full z-10 bg-[#fff] overflow-x-scroll overflow-y-hidden snap-x snap-mandatory flex mb-4 sm:mb-6"
      >
        <Section>
          <Paragraph>
            <span>Our </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              object detection systems
            </TextHighlighter>
            <span> identify and locate items in real-time. From </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              facial recognition
            </TextHighlighter>
            <span>
              {" "}
              to product identification, we deliver precision at scale.
            </span>
          </Paragraph>

          <Paragraph>
            <span>Whether it's </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              traffic monitoring
            </TextHighlighter>
            <span> for smart cities or </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              inventory management
            </TextHighlighter>
            <span>
              {" "}
              for retail, our AI distinguishes between people, vehicles, and
              objects with unmatched accuracy.
            </span>
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            <span>Advanced </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              video analytics
            </TextHighlighter>
            <span> track movement across frames. Our </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              object tracking algorithms
            </TextHighlighter>
            <span>
              {" "}
              power autonomous vehicles and security systems worldwide.
            </span>
          </Paragraph>

          <Paragraph>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              Scene understanding
            </TextHighlighter>
            <span>
              {" "}
              capabilities analyze spatial relationships and context. From{` `}
            </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              sports performance analysis
            </TextHighlighter>
            <span> to </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              surveillance systems
            </TextHighlighter>
            <span>, we make sense of complex visual data.</span>
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            <span>Our </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              OCR technology
            </TextHighlighter>
            <span>
              {" "}
              converts printed and handwritten text to digital format instantly.{" "}
            </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              Document automation
            </TextHighlighter>
            <span> streamlines workflows across industries.</span>
          </Paragraph>

          <Paragraph>
            <span>From </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              invoice processing
            </TextHighlighter>
            <span> to </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              accessibility solutions
            </TextHighlighter>
            <span>
              , our text recognition supports multiple languages and formats
              with exceptional accuracy.
            </span>
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              3D depth perception
            </TextHighlighter>
            <span> enables precise spatial understanding. Our </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              stereo vision systems
            </TextHighlighter>
            <span>
              {" "}
              power robotic automation and quality control processes.
            </span>
          </Paragraph>

          <Paragraph>
            <span>Advanced </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              augmented reality
            </TextHighlighter>
            <span> and </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              virtual reality applications
            </TextHighlighter>
            <span>
              {" "}
              rely on our depth analysis for immersive, interactive experiences.
            </span>
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              Image segmentation
            </TextHighlighter>
            <span>
              {" "}
              separates objects with pixel-perfect precision. Our{` `}
            </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              enhancement algorithms
            </TextHighlighter>
            <span>
              {" "}
              restore clarity and remove noise from any visual content.
            </span>
          </Paragraph>

          <Paragraph>
            <span>Generate </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              synthetic training data
            </TextHighlighter>
            <span> and create </span>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              high-resolution imagery
            </TextHighlighter>
            <span> for machine learning models and creative applications.</span>
          </Paragraph>

          <Paragraph>
            <TextHighlighter
              highlightColor={HIGHLIGHT_COLOR}
              direction={scrollDirection}
              useInViewOptions={DEMO_USE_IN_VIEW_OPTIONS}
              transition={DEMO_TRANSITION}
            >
              Transform your industry
            </TextHighlighter>
            <span>
              {" "}
              with computer vision that sees, understands, and acts on visual
              information like never before.
            </span>
          </Paragraph>
        </Section>
      </div>
    </div>
  )
}

```

### Hover

You can also trigger the highlight animation via hover, if you set the `triggerType` prop to `"hover"`:

Example:

```tsx
"use client"

import { TextHighlighter } from "@/fancy/components/text/text-highlighter"

export default function TextHighlighterHoverDemo() {
  return (
    <div className="w-dvw h-dvh bg-[#fefefe] flex items-center justify-center">
      <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 text-black">
        <div className="flex flex-col gap-8 text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
          <TextHighlighter
            triggerType="hover"
            direction="ltr"
            className="px-2 py-1 cursor-pointer"
            highlightColor="#BBC2E2"
            transition={{ type: "spring", duration: 0.68, bounce: 0 }}
          >
            hover me - left to right
          </TextHighlighter>

          <TextHighlighter
            triggerType="hover"
            direction="rtl"
            className="px-2 py-1 cursor-pointer"
            highlightColor="#BBC2E2"
            transition={{ type: "spring", duration: 0.8, bounce: 0 }}
          >
            hover me - right to left
          </TextHighlighter>

          <TextHighlighter
            triggerType="hover"
            direction="ttb"
            className="px-2 py-1 cursor-pointer"
            highlightColor="#BBC2E2"
            transition={{ type: "spring", duration: 0.8, bounce: 0 }}
          >
            hover me - top to bottom
          </TextHighlighter>

          <TextHighlighter
            triggerType="hover"
            direction="btt"
            className="px-2 py-1 cursor-pointer"
            highlightColor="#BBC2E2"
            transition={{ type: "spring", duration: 0.8, bounce: 0 }}
          >
            hover me - bottom to top
          </TextHighlighter>
        </div>
      </div>
    </div>
  )
}

```

### Control via ref

You can also trigger the animation via an exposed ref. This is useful if you want to trigger the animation programmatically:

Example:

```tsx
"use client"

import { useRef, useState } from "react"

import {
  TextHighlighter,
  TextHighlighterRef,
} from "@/fancy/components/text/text-highlighter"

export default function TextHighlighterDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const highlighterRefs = useRef<TextHighlighterRef[]>([])
  const [isHighlighted, setIsHighlighted] = useState(false)

  const transition = { type: "spring", duration: 1, delay: 0, bounce: 0 }
  const highlightClass = "rounded-[0.3em] px-px"
  const highlightColor = "#F7F764"

  const handleHighlight = () => {
    highlighterRefs.current.forEach((ref) => {
      ref.animate()
    })
    setIsHighlighted(true)
  }

  const handleReset = () => {
    highlighterRefs.current.forEach((ref) => {
      ref.reset()
    })
    setIsHighlighted(false)
  }

  return (
    <div className="w-dvw h-dvh bg-[#fefefe] relative p-0">
      <div
        className="h-full w-full z-10 bg-[#fefefe] overflow-scroll"
        ref={containerRef}
      >
        <div className="max-w-5xl mx-auto px-12 mt-20 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
            <div className="space-y-2">
              <p>
                The present-day designer has a host of printing types at his
                disposal. Since{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  Gutenberg
                </TextHighlighter>{" "}
                first invented movable type in 1436-55 hundreds of different
                types have been designed and cast in lead. The{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  most recent technical developments
                </TextHighlighter>{" "}
                with computer and photo-typesetting have once again brought new
                faces or variations of old ones on the market.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                Knowledge of the quality of a typeface is of the greatest
                importance for the{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  functional, aesthetic and psychological effect
                </TextHighlighter>{" "}
                of printed matter. Again, the typographic design, i.e. the
                correct spaces between letters and words and the length and
                spacing of lines conducive to easy reading, does much to enhance
                the impression created.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                By studying the classic designs of{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  Garamond, Caslon, Bodoni, Walbaum
                </TextHighlighter>{" "}
                and others, the designer can learn what the timeless criteria
                are which produce a refined and artistic typeface that makes for
                ease of reading.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                The lead type designs of{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  Berthold, Helvetica, Folio, Univers
                </TextHighlighter>{" "}
                etc. produce pleasant and easily legible type areas. The
                typographic rules that apply to the roman typefaces are also
                valid for the sans serifs.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  The creators of these type designs
                </TextHighlighter>{" "}
                were extremely intelligent artists with high creative powers.
                This is shown by the fact that for more than four centuries
                innumerable type designers have sought to create new type
                alphabets but very few of these have gained acceptance. An{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  alphabet of Garamond
                </TextHighlighter>{" "}
                for example, is an artistic achievement of the first order.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                Every designer who is concerned with typography should take the
                trouble when creating graphic designs to{" "}
                <TextHighlighter
                  ref={(el) => {
                    if (el) highlighterRefs.current.push(el)
                  }}
                  triggerType="ref"
                  className={highlightClass}
                  transition={transition}
                  highlightColor={highlightColor}
                >
                  sketch words and sentences by hand
                </TextHighlighter>
                . Many designers take advantage of the Letraset process, which
                can undoubtedly produce a clean draft design that is almost
                ready for press.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 flex gap-4">
        <button
          onClick={isHighlighted ? handleReset : handleHighlight}
          className="text-black border border-border px-3 py-1.5 rounded-md bg-transparent text-xs backdrop-blur-lg cursor-pointer hover:bg-muted"
        >
          {isHighlighted ? "Reset" : "Highlight"}
        </button>
      </div>
    </div>
  )
}

```

## Notes

- While the component only support a single-colored highlight directly, you can change it to an image, a fancy gradient, or anything that a `background-image` can handle. Just change the appropriate line:
### Fancier highlight color

```ts
backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,   // change this to make it fancier
```

- As many users have pointed out, excessive animations can be distracting and impact readability, especially when highlighting large blocks of text. Consider using animations sparingly and adjusting the transition duration and delay to create a more subtle effect. You may also want to use the `useInViewOptions` prop to control when animations trigger, for example by increasing the `amount` threshold or setting `once: true` to only animate elements once.

## Props

### TextHighlighterProps

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The text content to be highlighted |
| as | `ElementType` | `"span"` | HTML element to render as |
| triggerType | `"auto" | "hover" | "ref" | "inView"` | `"inView"` | How to trigger the animation |
| transition | `Transition` | `{ type: "spring", duration: 1, delay: 0, bounce: 0 }` | Animation transition configuration |
| useInViewOptions | `UseInViewOptions` | `{ once: true, initial: false, amount: 0.5 }` | Options for useInView hook when triggerType is "inView" |
| className | `string` | - | Class name for the container element |
| highlightColor | `string` | `"hsl(25, 90%, 80%)"` | Highlight color (CSS color string) |
| direction | `"ltr" | "rtl" | "ttb" | "btt"` | `"ltr"` | Direction of the highlight animation |

### TextHighlighterRef

| Method | Description |
|----------|----------|
| animate(direction?: HighlightDirection) | Trigger the highlight animation with optional direction override |
| reset() | Reset the highlight animation to its initial state |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/text-highlighter).*