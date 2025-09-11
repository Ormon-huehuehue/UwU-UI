# Media Between Text

> A component that animates a media (image or video) between two text elements.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [media-between-text](#media-between-text)
- [Usage](#usage)
- [Examples](#examples)
  - [Scroll](#scroll)
  - [Vertical & Ref](#vertical-ref)
- [Props](#props)

Example:

```tsx
import useScreenSize from "@/hooks/use-screen-size"
import MediaBetweenText from "@/fancy/components/blocks/media-between-text"

export default function Preview() {
  const screenSize = useScreenSize()

  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-background">
      <a
        href="https://www.instagram.com/p/C3oL4euoc2l/?img_index=1"
        target="_blank"
        rel="noreferrer"
      >
        <MediaBetweenText
          firstText="that's a nice ("
          secondText=") chair!"
          mediaUrl={
            "https://cdn.cosmos.so/90e2192e-7bd4-44af-96ae-05cd955c0cfb?format=jpeg"
          }
          mediaType="image"
          triggerType="hover"
          mediaContainerClassName="w-full h-[30px] sm:h-[100px] overflow-hidden mx-px mt-1 sm:mx-2 sm:mt-4"
          className="cursor-pointer sm:text-6xl text-2xl text-[#ff5941] lowercase font-light flex flex-row items-center justify-center w-full"
          animationVariants={{
            initial: { width: 0 },
            animate: {
              width: screenSize.lessThan("sm") ? "30px" : "100px",
              transition: { duration: 0.4, type: "spring", bounce: 0 },
            },
          }}
        />
      </a>
    </div>
  )
}

```

Artwork by [Joffey](https://www.instagram.com/designbyjoffey/)

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/media-between-text.json"
```

### Manual

#### media-between-text

```tsx
"use client"

import { ElementType, forwardRef, useImperativeHandle, useRef, useState } from "react"
import { motion, useInView, UseInViewOptions, Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface MediaBetweenTextProps {
  /**
   * The text to display before the media
   */
  firstText: string

  /**
   * The text to display after the media
   */
  secondText: string

  /**
   * URL of the media (image or video) to display
   */
  mediaUrl: string

  /**
   * Type of media to display
   */
  mediaType: "image" | "video"

  /**
   * Optional class name for the media container
   */
  mediaContainerClassName?: string

  /**
   * Fallback URL for video poster or image loading
   */
  fallbackUrl?: string

  /**
   * HTML Tag to render the text elements as
   * @default p
   */
  as?: ElementType

  /**
   * Whether video should autoplay
   * @default true
   */
  autoPlay?: boolean

  /**
   * Whether video should loop
   * @default true
   */
  loop?: boolean

  /**
   * Whether video should be muted
   * @default true
   */
  muted?: boolean

  /**
   * Whether video should play inline
   * @default true
   */
  playsInline?: boolean

  /**
   * Alt text for image
   */
  alt?: string

  /**
   * Type of animation trigger
   * @default "hover"
   */
  triggerType?: "hover" | "ref" | "inView"

  /**
   * Reference to container element for inView trigger
   */
  containerRef?: React.RefObject<HTMLDivElement>

  /**
   * Options for useInView hook
   */
  useInViewOptionsProp?: UseInViewOptions

  /**
   * Custom animation variants
   */
  animationVariants?: {
    initial: Variants["initial"]
    animate: Variants["animate"]
  }

  /**
   * Optional class name for the root element
   */
  className?: string

  /**
   * Optional class name for the left text element
   */
  leftTextClassName?: string

  /**
   * Optional class name for the right text element
   */
  rightTextClassName?: string
}

export type MediaBetweenTextRef = {
  animate: () => void
  reset: () => void
}

export const MediaBetweenText = forwardRef<
  MediaBetweenTextRef,
  MediaBetweenTextProps
>(
  (
    {
      firstText,
      secondText,
      mediaUrl,
      mediaType,
      mediaContainerClassName,
      fallbackUrl,
      as = "p",
      autoPlay = true,
      loop = true,
      muted = true,
      playsInline = true,
      alt,
      triggerType = "hover",
      containerRef,
      useInViewOptionsProp = {
        once: true,
        amount: 0.5,
        root: containerRef,
      },
      animationVariants = {
        initial: { width: 0, opacity: 1 },
        animate: {
          width: "auto",
          opacity: 1,
          transition: { duration: 0.4, type: "spring", bounce: 0 },
        },
      },
      className,
      leftTextClassName,
      rightTextClassName,
    },
    ref
  ) => {
    const componentRef = useRef<HTMLDivElement>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    const isInView =
      triggerType === "inView"
        ? useInView(componentRef || containerRef, useInViewOptionsProp)
        : false
    const [isHovered, setIsHovered] = useState(false)

    useImperativeHandle(ref, () => ({
      animate: () => setIsAnimating(true),
      reset: () => setIsAnimating(false),
    }))

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : false

    const TextComponent = motion.create(as)

    return (
      <div
        className={cn("flex", className)}
        ref={componentRef}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
      >
        <TextComponent layout className={leftTextClassName}>
          {firstText}
        </TextComponent>
        <motion.div
          className={mediaContainerClassName}
          variants={animationVariants}
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
        >
          {mediaType === "video" ? (
            <video
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={playsInline}
              poster={fallbackUrl}
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={alt || `${firstText} ${secondText}`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
        <TextComponent layout className={rightTextClassName}>
          {secondText}
        </TextComponent>
      </div>
    )
  }
)

MediaBetweenText.displayName = "MediaBetweenText"

export default MediaBetweenText

```

## Usage

The component is extremely simple, and only consists of two text elements and a media element (either an image or a video). The trick for the smooth animation is to use `layout` animations on the two texts, so they smoothly transition when the media element is revealed.
You can trigger the media reveal animation by `hover`, `ref`, or `inView`:

- `hover`: The media will animate when you hover over the component
- `ref`: You can call the `animate` and `reset` methods exposed via a ref to manually control the animation
- `inView`: The media will animate when the component is in view. You can pass an `useInViewOptionsProp` prop to customize the in view detection. Refer to the [motion documentation](https://motion.dev/docs/docs/react-use-in-view) for more details.

You can also customize the animation by passing a `animationVariants` prop. Please use `animate` and `initial` variants. Refer to the [motion documentation](https://motion.dev/docs/react-animation#animatable-values) for more details.

## Examples

### Scroll

Scroll down to trigger the animation. In this case, you can pass down a containerRef prop to the component to track when elements come into view within that specific container, rather than the entire viewport. This is useful when you want to trigger animations based on scrolling within a specific scrollable container.

Example:

```tsx
import React from "react"

import useScreenSize from "@/hooks/use-screen-size"
import MediaBetweenText from "@/fancy/components/blocks/media-between-text"

const elements = [
  {
    src: "https://cdn.cosmos.so/53454cbe-a4ec-4782-923f-a82d70e12645.mp4",
    left: "Tim",
    right: "Rodenböker",
    url: "https://www.instagram.com/tim_rodenbroeker/",
  },
  {
    src: "https://cdn.cosmos.so/499ddb3b-57cf-4c07-996c-f797fadf64ab.mp4",
    left: "Simon ",
    right: "Alexander-Adams",
    url: "https://www.instagram.com/polyhop/",
  },
  {
    src: "https://cdn.cosmos.so/444e4a2a-45a6-477f-b342-6b6bc9a7c53b.mp4",
    left: "Andreion",
    right: "de Castro",
    url: "https://www.instagram.com/andreiongd/",
  },
  {
    src: "https://cdn.cosmos.so/f533f1a8-9f67-4360-b395-7abc8594cac9.mp4",
    left: "Lorraine",
    right: "Li",
    url: "https://www.instagram.com/lorrr.l/",
  },
]

export default function MediaBetweenTextScrollDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  const screenSize = useScreenSize()

  return (
    <div
      className="w-dvw h-dvh items-center justify-center bg-background overflow-auto"
      ref={ref}
    >
      <div className="h-full relative w-full flex">
        <h3 className="text-5xl sm:text-8xl tracking-wide absolute sm:bottom-12 sm:left-12 bottom-4 left-4 w-64">
          today's inspo
        </h3>
        <p className="bottom-4 right-4 sm:right-12 sm:bottom-12 absolute ">
          Scroll down ↓
        </p>
      </div>

      <div className="h-full w-full flex flex-col space-y-12 mt-24 justify-center items-center text-6xl px-6">
        {elements.map((element, index) => (
          <a href={element.url} target="_blank" rel="noreferrer">
            <MediaBetweenText
              key={index}
              firstText={element.left}
              secondText={element.right}
              mediaUrl={element.src}
              mediaType="video"
              triggerType="inView"
              useInViewOptionsProp={{
                once: false,
                amount: 1,
                root: ref,
                margin: "-5% 0px -0% 0px",
              }}
              containerRef={ref}
              mediaContainerClassName="w-full h-[40px] sm:h-[80px] overflow-hidden mx-1 sm:mx-3 mt-1 sm:mt-4"
              className="cursor-pointer text-lg sm:text-4xl font-light flex flex-row items-center justify-center"
              animationVariants={{
                initial: { width: 0 },
                animate: {
                  width: screenSize.lessThan("sm") ? "40px" : "100px",
                  transition: {
                    duration: 1,
                    type: "spring",
                    bounce: 0,
                    delay: 0.1,
                  },
                },
              }}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

```

Artworks by [Tim Rodenböker](https://www.instagram.com/tim_rodenbroeker/), [polyhop](https://www.instagram.com/polyhop/), [Andreion de Castro](https://www.instagram.com/andreiongd/), [Lorraine Li](https://www.instagram.com/lorrr.l/)

### Vertical & Ref

You can also style the whole container, the media element, and the text elements separately. In this example, we use a column-layout to create a vertical effect. The animation can also be triggered from outside the component, by calling the `animate` and `reset` methods exposed via a ref. Click on the "Open" button to trigger the animation.

Example:

```tsx
import { useRef, useState } from "react"

import useScreenSize from "@/hooks/use-screen-size"
import { Button } from "@/components/ui/button"
import MediaBetweenText, {
  MediaBetweenTextRef,
} from "@/fancy/components/blocks/media-between-text"

export default function Preview() {
  const ref = useRef<MediaBetweenTextRef>(null)
  const [isOpen, setIsOpen] = useState(false)
  const screenSize = useScreenSize()

  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-background">
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            ref.current?.animate()
          } else {
            ref.current?.reset()
          }
        }}
        size={"sm"}
        variant={"outline"}
        className="absolute top-4 left-4 h-8"
      >
        {isOpen ? "Close" : "Open"}
      </Button>

      <MediaBetweenText
        firstText="Artificial "
        secondText="Intelligence"
        mediaUrl={
          "https://cdn.cosmos.so/47c0223f-c704-4d5a-8b47-c48262ebe301?format=jpeg"
        }
        mediaType="image"
        triggerType="ref"
        ref={ref}
        mediaContainerClassName="w-full h-[60px] sm:h-[100px] overflow-hidden pt-1"
        className="cursor-pointer text-3xl sm:text-7xl font-calendas flex flex-col font-light items-center justify-center"
        leftTextClassName=""
        rightTextClassName="italic"
        animationVariants={{
          initial: {
            width: screenSize.lessThan("sm") ? "160px" : "280px",
            height: 0,
            transition: { duration: 0.7, ease: [0.944, 0.008, 0.147, 1.002] },
          },
          animate: {
            width: screenSize.lessThan("sm") ? "200px" : "330px",
            height: screenSize.lessThan("sm") ? "200px" : "300px",
            transition: { duration: 0.7, ease: [0.944, 0.008, 0.147, 1.002] },
          },
        }}
      />
    </div>
  )
}

```

Video from [chrbutler.com](https://www.chrbutler.com/what-i-want-from-the-internet)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| firstText* | `string` | - | The text to display before the media |
| secondText* | `string` | - | The text to display after the media |
| mediaUrl* | `string` | - | URL of the media (image or video) to display |
| mediaType* | `"image" | "video"` | - | Type of media to display |
| mediaContainerClassName | `string` | - | Optional class name for the media container |
| fallbackUrl | `string` | - | Fallback URL for video poster or image loading |
| as | `ElementType` | `"p"` | HTML Tag to render the text elements as |
| autoPlay | `boolean` | `true` | Whether video should autoplay |
| loop | `boolean` | `true` | Whether video should loop |
| muted | `boolean` | `true` | Whether video should be muted |
| playsInline | `boolean` | `true` | Whether video should play inline |
| alt | `string` | - | Alt text for image |
| triggerType | `"hover" | "ref" | "inView"` | `"hover"` | Type of animation trigger |
| containerRef | `React.RefObject` | - | Reference to container element for inView trigger |
| useInViewOptionsProp | `UseInViewOptions` | `{ once: true, amount: 0.5, root: containerRef }` | Options for useInView hook |
| animationVariants | `{ initial: Variants["initial"]; animate: Variants["animate"] }` | `{ initial: { width: 0, opacity: 1 }, animate: { width: "auto", opacity: 1, transition: { duration: 0.4, type: "spring", bounce: 0 } } }` | Custom animation variants |
| className | `string` | - | Optional class name for the root element |
| leftTextClassName | `string` | - | Optional class name for the left text element |
| rightTextClassName | `string` | - | Optional class name for the right text element |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/media-between-text).*