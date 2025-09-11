# Box Carousel

> A 3D carousel component that displays items in a rotating box/cube layout with drag support and smooth animations.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [box-carousel](#box-carousel)
- [Usage](#usage)
  - [High-level example](#high-level-example)
- [Understanding the Component](#understanding-the-component)
  - [Face positioning](#face-positioning)
  - [Depth](#depth)
  - [Rotation](#rotation)
  - [Motion values](#motion-values)
  - [3D transform](#3d-transform)
  - [Item Management](#item-management)
  - [Item indices](#item-indices)
  - [Update item indices](#update-item-indices)
  - [Drag Interaction](#drag-interaction)
  - [Drag handling](#drag-handling)
  - [Drag snap](#drag-snap)
  - [Auto-play Mode](#auto-play-mode)
  - [Keyboard Navigation](#keyboard-navigation)
  - [Mixed Media Support](#mixed-media-support)
  - [Imperative API](#imperative-api)
  - [Ref usage](#ref-usage)
  - [Reduced Motion Support](#reduced-motion-support)
- [Credits](#credits)
- [Resources](#resources)
- [Props](#props)
  - [BoxCarousel Props](#boxcarousel-props)
  - [BoxCarousel Ref Methods](#boxcarousel-ref-methods)

Example:

```tsx
"use client"

import { useRef, useState  } from "react"
import { Bug, BugOff } from "lucide-react"
import BoxCarousel, { 
  type BoxCarouselRef, 
  type CarouselItem, 
} from "@/fancy/components/carousel/box-carousel"
import useScreenSize from "@/hooks/use-screen-size"

// Sample carousel items with mix of images and videos
const carouselItems: CarouselItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://cdn.cosmos.so/778d0640-d4b8-45b4-8bbe-862e759c231d?format=jpeg",
    alt: "Blurry poster"
  },
  {
    id: "2", 
    type: "image",
    src: "https://cdn.cosmos.so/27ac2696-1f2b-498e-8d3d-11f2dd358ab9?format=jpeg",
    alt: "Abstract blurry figure"
  },
  {
    id: "3",
    type: "image", 
    src: "https://cdn.cosmos.so/c48b739d-202d-4340-ab6b-afa34f0d7142?format=jpeg",
    alt: "Long exposure photo of a person"
  },
  {
    id: "4",
    type: "image",
    src: "https://cdn.cosmos.so/5332f9ac-7823-4635-871d-d4b3032e1c62?format=jpeg", 
    alt: "Blurry portrait photo of a person"
  },
  {
    id: "5",
    type: "image",
    src: "https://cdn.cosmos.so/d9ed937e-7c3b-4f64-a4f3-708d639f13a1?format=jpeg",
    alt: "Long exposure shots with multiple people"
  },
  {
    id: "6",
    type: "image",
    src: "https://cdn.cosmos.so/33b43e2a-da66-42d9-a0b1-08165d80b0aa?format=jpeg",
    alt: "Close up blurry photo of a person poster"
  },
  {
    id: "7",
    type: "image",
    src: "https://cdn.cosmos.so/40342df7-2ea2-4297-add2-fe17cdc62551?format=jpeg",
    alt: "Long exposure shot of a motorcyclist"
  },
]

export default function BoxCarouselDemo() {
  const carouselRef = useRef<BoxCarouselRef>(null)
  const [debug, setDebug] = useState(false)
  const screenSize = useScreenSize()

  // Responsive dimensions based on screen size
  const getCarouselDimensions = () => {
    if (screenSize.lessThan("md")) {
      return { width: 200, height: 150 }
    }
    return { width: 350, height: 250 }
  }

  const { width, height } = getCarouselDimensions()

  const handleNext = () => {
    carouselRef.current?.next()
  }

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleIndexChange = (index: number) => {
    console.log('Index changed:', index)
  }

  const toggleDebug = () => {
    setDebug(!debug)
  }

  return (
    <div className="w-full max-w-4xl h-full p-6 flex justify-items-center justify-center items-center text-muted-foreground bg-[#fefefe]">
      <button
        onClick={toggleDebug}
        className="absolute top-4 left-4 p-1.5 border border-black text-black rounded-full cursor-pointer transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
        title={debug ? "Debug Mode: ON" : "Debug Mode: OFF"}
      >
        {debug ? (
          <Bug size={10} />
        ) : (
          <BugOff size={10} />
        )}
      </button>

      <div className="space-y-24">

        <div className="flex justify-center pt-20">
          <BoxCarousel
            ref={carouselRef}
            items={carouselItems}
            width={width}
            height={height}
            direction="right"
            onIndexChange={handleIndexChange}
            debug={debug}
            enableDrag
            perspective={1000}
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button 
            onClick={handlePrev}
            className="px-2 py-0.5 text-xs border border-black text-black rounded-full cursor-pointer transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
          >
            Prev
          </button>
          <button 
            onClick={handleNext}
            className="px-2 py-0.5 text-xs border border-black text-black rounded-full cursor-pointer transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/box-carousel.json"
```

### Manual

#### box-carousel

```tsx
"use client"

import React, {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  ValueAnimationOptions,
} from "motion/react"

import { cn } from "@/lib/utils"

interface CarouselItem {
  /**
   * Unique identifier for the carousel item
   */
  id: string
  /**
   * The type of media: "image" or "video"
   */
  type: "image" | "video"
  /**
   * Source URL for the image or video
   */
  src: string
  /**
   * (Optional) Alternative text for images
   */
  alt?: string
  /**
   * (Optional) Poster image for videos (displayed before playback)
   */
  poster?: string
}

/**
 * Props for a single face of the cube in the BoxCarousel.
 */
interface FaceProps {
  /**
   * The CSS transform string to position and rotate the face in 3D space.
   */
  transform: string
  /**
   * Optional additional CSS class names for the face.
   */
  className?: string
  /**
   * Optional React children to render inside the face.
   */
  children?: ReactNode
  /**
   * Optional inline styles for the face.
   */
  style?: React.CSSProperties
  /**
   * If true, enables debug mode (e.g., shows backface and opacity).
   */
  debug?: boolean
}

const CubeFace = memo(
  ({ transform, className, children, style, debug }: FaceProps) => (
    <div
      className={cn(
        "absolute overflow-hidden",
        debug && "backface-visible opacity-50",
        className
      )}
      style={{ transform, ...style }}
    >
      {children}
    </div>
  )
)

CubeFace.displayName = "CubeFace"

const MediaRenderer = memo(
  ({
    item,
    className,
    debug = false,
  }: {
    item: CarouselItem
    className?: string
    debug?: boolean
  }) => {
    if (!debug) {
      if (item.type === "video") {
        return (
          <video
            src={item.src}
            poster={item.poster}
            className={cn("w-full h-full object-cover", className)}
            muted
            loop
            autoPlay
          />
        )
      }

      return (
        <img
          src={item.src}
          alt={item.alt || ""}
          draggable={false}
          className={cn("w-full h-full object-cover", className)}
        />
      )
    }

    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center border text-2xl",
          className
        )}
      >
        {item.id}
      </div>
    )
  }
)

MediaRenderer.displayName = "MediaRenderer"

export interface BoxCarouselRef {
  /**
   * Advance to the next item in the carousel.
   */
  next: () => void

  /**
   * Go back to the previous item in the carousel.
   */
  prev: () => void

  /**
   * Get the index of the currently visible item.
   */
  getCurrentItemIndex: () => number
}

type RotationDirection = "top" | "bottom" | "left" | "right"

interface SpringConfig {
  stiffness?: number
  damping?: number
  mass?: number
}

/**
 * Props for the BoxCarousel component
 */
interface BoxCarouselProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * Array of items to display in the carousel
   */
  items: CarouselItem[]

  /**
   * Width of the carousel in pixels
   */
  width: number

  /**
   * Height of the carousel in pixels
   */
  height: number

  /**
   * Additional CSS classes for the container
   */
  className?: string

  /**
   * Enable debug mode (shows extra info/overlays)
   */
  debug?: boolean

  /**
   * Perspective value for 3D effect (in px)
   * @default 600
   */
  perspective?: number

  /**
   * The axis and direction of rotation
   * @default "vertical"
   * "top" | "bottom" | "left" | "right"
   */
  direction?: RotationDirection

  /**
   * Transition configuration for rotation animation
   * @default { duration: 1.25, ease: [0.953, 0.001, 0.019, 0.995] }
   */
  transition?: ValueAnimationOptions

  /**
   * Transition configuration for snapping after drag
   * @default { type: "spring", damping: 30, stiffness: 200 }
   */
  snapTransition?: ValueAnimationOptions

  /**
   * Spring physics config for drag interaction
   * @default { stiffness: 200, damping: 30 }
   */
  dragSpring?: SpringConfig

  /**
   * Enable auto-play mode
   * @default false
   */
  autoPlay?: boolean

  /**
   * Interval (ms) between auto-play transitions
   * @default 3000
   */
  autoPlayInterval?: number

  /**
   * Callback when the current item index changes
   */
  onIndexChange?: (index: number) => void

  /**
   * Enable drag interaction
   * @default true
   */
  enableDrag?: boolean

  /**
   * Sensitivity of drag (higher = more rotation per pixel)
   * @default 0.5
   */
  dragSensitivity?: number
}

const BoxCarousel = forwardRef<BoxCarouselRef, BoxCarouselProps>(
  (
    {
      items,
      width,
      height,
      className,
      perspective = 600,
      debug = false,
      direction = "left",
      transition = { duration: 1.25, ease: [0.953, 0.001, 0.019, 0.995] },
      snapTransition = { type: "spring", damping: 30, stiffness: 200 },
      dragSpring = { stiffness: 200, damping: 30 },
      autoPlay = false,
      autoPlayInterval = 3000,
      onIndexChange,
      enableDrag = true,
      dragSensitivity = 0.5,
      ...props
    },
    ref
  ) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0)
    const [currentFrontFaceIndex, setCurrentFrontFaceIndex] = useState(1)

    const prefersReducedMotion = useReducedMotion()

    const _transition = prefersReducedMotion ? { duration: 0 } : transition

    // 0 ⇢ will be shown if the user presses "prev"
    const [prevIndex, setPrevIndex] = useState(items.length - 1)

    // 1 ⇢ item that is currently visible
    const [currentIndex, setCurrentIndex] = useState(0)

    // 2 ⇢ will be shown on the next "next"
    const [nextIndex, setNextIndex] = useState(1)

    // 3 ⇢ two steps ahead (the face that is at the back right now)
    const [afterNextIndex, setAfterNextIndex] = useState(2)

    const [currentRotation, setCurrentRotation] = useState(0)

    const rotationCount = useRef(1)
    const isRotating = useRef(false)
    const pendingIndexChange = useRef<number | null>(null)
    const isDragging = useRef(false)
    const startPosition = useRef({ x: 0, y: 0 })
    const startRotation = useRef(0)

    const baseRotateX = useMotionValue(0)
    const baseRotateY = useMotionValue(0)

    // Use springs for smoother animation during drag
    const springRotateX = useSpring(baseRotateX, dragSpring)
    const springRotateY = useSpring(baseRotateY, dragSpring)

    const handleAnimationComplete = useCallback(
      (triggeredBy: string) => {
        if (isRotating.current && pendingIndexChange.current !== null) {
          isRotating.current = false

          let newFrontFaceIndex: number
          let currentBackFaceIndex: number

          if (triggeredBy === "next") {
            newFrontFaceIndex = (currentFrontFaceIndex + 1) % 4
            currentBackFaceIndex = (newFrontFaceIndex + 2) % 4
          } else {
            newFrontFaceIndex = (currentFrontFaceIndex - 1 + 4) % 4
            currentBackFaceIndex = (newFrontFaceIndex + 3) % 4
          }

          setCurrentItemIndex(pendingIndexChange.current)
          onIndexChange?.(pendingIndexChange.current)

          const indexOffset = triggeredBy === "next" ? 2 : -1

          if (currentBackFaceIndex === 0) {
            setPrevIndex(
              (pendingIndexChange.current + indexOffset + items.length) %
                items.length
            )
          } else if (currentBackFaceIndex === 1) {
            setCurrentIndex(
              (pendingIndexChange.current + indexOffset + items.length) %
                items.length
            )
          } else if (currentBackFaceIndex === 2) {
            setNextIndex(
              (pendingIndexChange.current + indexOffset + items.length) %
                items.length
            )
          } else if (currentBackFaceIndex === 3) {
            setAfterNextIndex(
              (pendingIndexChange.current + indexOffset + items.length) %
                items.length
            )
          }

          pendingIndexChange.current = null
          rotationCount.current++

          setCurrentFrontFaceIndex(newFrontFaceIndex)
        }
      },
      [currentFrontFaceIndex, items.length, onIndexChange]
    )

    // Drag functionality - using direct event handlers like css-box
    const handleDragStart = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!enableDrag || isRotating.current) return

        isDragging.current = true
        const point = "touches" in e ? e.touches[0] : e
        startPosition.current = { x: point.clientX, y: point.clientY }
        startRotation.current = currentRotation

        // Prevent default to avoid text selection
        e.preventDefault()
      },
      [enableDrag, currentRotation]
    )

    const handleDragMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current || isRotating.current) return

        const point = "touches" in e ? e.touches[0] : e
        const deltaX = point.clientX - startPosition.current.x
        const deltaY = point.clientY - startPosition.current.y

        const isVertical = direction === "top" || direction === "bottom"
        const delta = isVertical ? deltaY : deltaX
        const rotationDelta = (delta * dragSensitivity) / 2

        let newRotation = startRotation.current

        if (direction === "top" || direction === "right") {
          newRotation += rotationDelta
        } else {
          newRotation -= rotationDelta
        }

        // Constrain rotation to ±120 degrees from start position. Otherwise the index recalculation will be off. TBD - find a better solution
        const minRotation = startRotation.current - 120
        const maxRotation = startRotation.current + 120
        newRotation = Math.max(minRotation, Math.min(maxRotation, newRotation))

        // Apply the rotation immediately during drag
        if (isVertical) {
          baseRotateX.set(newRotation)
        } else {
          baseRotateY.set(newRotation)
        }
      },
      [enableDrag, direction, dragSensitivity]
    )

    const handleDragEnd = useCallback(() => {
      if (!isDragging.current) return

      isDragging.current = false

      const isVertical = direction === "top" || direction === "bottom"
      const currentValue = isVertical ? baseRotateX.get() : baseRotateY.get()

      // Calculate the nearest quarter rotation (90-degree increment)
      const quarterRotations = Math.round(currentValue / 90)
      const snappedRotation = quarterRotations * 90

      // Calculate how many steps we've moved from the original position
      const rotationDifference = snappedRotation - currentRotation
      const steps = Math.round(rotationDifference / 90)

      if (steps !== 0) {
        isRotating.current = true

        // Calculate new item index
        let newItemIndex = currentItemIndex
        for (let i = 0; i < Math.abs(steps); i++) {
          if (steps > 0) {
            newItemIndex = (newItemIndex + 1) % items.length
          } else {
            newItemIndex =
              newItemIndex === 0 ? items.length - 1 : newItemIndex - 1
          }
        }

        pendingIndexChange.current = newItemIndex

        // Animate to the snapped position
        const targetMotionValue = isVertical ? baseRotateX : baseRotateY
        animate(targetMotionValue, snappedRotation, {
          ...snapTransition,
          onComplete: () => {
            handleAnimationComplete(steps > 0 ? "next" : "prev")
            setCurrentRotation(snappedRotation)
          },
        })
      } else {
        // Snap back to current position
        const targetMotionValue = isVertical ? baseRotateX : baseRotateY
        animate(targetMotionValue, currentRotation, snapTransition)
      }
    }, [
      direction,
      baseRotateX,
      baseRotateY,
      currentRotation,
      currentItemIndex,
      items.length,
      transition,
      handleAnimationComplete,
    ])

    // Set up global event listeners for drag
    useEffect(() => {
      if (enableDrag) {
        window.addEventListener("mousemove", handleDragMove)
        window.addEventListener("mouseup", handleDragEnd)
        window.addEventListener("touchmove", handleDragMove)
        window.addEventListener("touchend", handleDragEnd)

        return () => {
          window.removeEventListener("mousemove", handleDragMove)
          window.removeEventListener("mouseup", handleDragEnd)
          window.removeEventListener("touchmove", handleDragMove)
          window.removeEventListener("touchend", handleDragEnd)
        }
      }
    }, [enableDrag, handleDragMove, handleDragEnd])

    const next = useCallback(() => {
      if (items.length === 0 || isRotating.current) return

      isRotating.current = true
      const newIndex = (currentItemIndex + 1) % items.length
      pendingIndexChange.current = newIndex

      if (direction === "top") {
        animate(baseRotateX, currentRotation + 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("next")
            setCurrentRotation(currentRotation + 90)
          },
        })
      } else if (direction === "bottom") {
        animate(baseRotateX, currentRotation - 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("next")
            setCurrentRotation(currentRotation - 90)
          },
        })
      } else if (direction === "left") {
        animate(baseRotateY, currentRotation - 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("next")
            setCurrentRotation(currentRotation - 90)
          },
        })
      } else if (direction === "right") {
        animate(baseRotateY, currentRotation + 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("next")
            setCurrentRotation(currentRotation + 90)
          },
        })
      }
    }, [items.length, direction, transition, currentRotation])

    const prev = useCallback(() => {
      if (items.length === 0 || isRotating.current) return

      isRotating.current = true
      const newIndex =
        currentItemIndex === 0 ? items.length - 1 : currentItemIndex - 1
      pendingIndexChange.current = newIndex

      if (direction === "top") {
        animate(baseRotateX, currentRotation - 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("prev")
            setCurrentRotation(currentRotation - 90)
          },
        })
      } else if (direction === "bottom") {
        animate(baseRotateX, currentRotation + 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("prev")
            setCurrentRotation(currentRotation + 90)
          },
        })
      } else if (direction === "left") {
        animate(baseRotateY, currentRotation + 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("prev")
            setCurrentRotation(currentRotation + 90)
          },
        })
      } else if (direction === "right") {
        animate(baseRotateY, currentRotation - 90, {
          ..._transition,
          onComplete: () => {
            handleAnimationComplete("prev")
            setCurrentRotation(currentRotation - 90)
          },
        })
      }
    }, [items.length, direction, transition])

    useImperativeHandle(
      ref,
      () => ({
        next,
        prev,
        getCurrentItemIndex: () => currentItemIndex,
      }),
      [next, prev, currentItemIndex]
    )

    const depth = useMemo(
      () => (direction === "top" || direction === "bottom" ? height : width),
      [direction, width, height]
    )

    const transform = useTransform(
      isDragging.current
        ? [springRotateX, springRotateY]
        : [baseRotateX, baseRotateY],
      ([x, y]) =>
        `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`
    )

    // Determine face transforms based on the desired rotation axis
    const faceTransforms = (() => {
      switch (direction) {
        case "left":
          return [
            // left, front, right, back (rotation around Y-axis)
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ]
        case "top":
          return [
            // top, front, bottom, back (rotation around X-axis)
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ]
        case "right":
          return [
            // right, front, left, back (rotation around Y-axis)
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ]
        case "bottom":
          return [
            // bottom, front, top, back (rotation around X-axis)
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ]
        default:
          return [
            // left, front, right, back (rotation around Y-axis)
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ]
      }
    })()

    // Auto play functionality
    useEffect(() => {
      if (autoPlay && items.length > 0) {
        const interval = setInterval(next, autoPlayInterval)
        return () => clearInterval(interval)
      }
    }, [autoPlay, items.length, next, autoPlayInterval])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isRotating.current) return

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault()
            if (direction === "left" || direction === "right") {
              prev()
            }
            break
          case "ArrowRight":
            e.preventDefault()
            if (direction === "left" || direction === "right") {
              next()
            }
            break
          case "ArrowUp":
            e.preventDefault()
            if (direction === "top" || direction === "bottom") {
              prev()
            }
            break
          case "ArrowDown":
            e.preventDefault()
            if (direction === "top" || direction === "bottom") {
              next()
            }
            break
          default:
            break
        }
      },
      [direction, next, prev, items.length]
    )

    return (
      <div
        className={cn("relative focus:outline-0", enableDrag && "cursor-move", className)}
        style={{
          width,
          height,
          perspective: `${perspective}px`,
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`3D carousel with ${items.length} items`}
        aria-describedby="carousel-instructions"
        aria-live="polite"
        aria-atomic="true"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        {...props}
      >
        <div className="sr-only" aria-live="assertive">
          Showing item {currentItemIndex + 1} of {items.length}:{" "}
          {items[currentItemIndex]?.alt || `Item ${currentItemIndex + 1}`}
        </div>

        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={{
            transform: transform,
          }}
        >
          {/* First face */}
          <CubeFace
            transform={faceTransforms[0]}
            style={
              debug
                ? { width, height, backgroundColor: "#ff9999" }
                : { width, height }
            }
            debug={debug}
          >
            <MediaRenderer item={items[prevIndex]} debug={debug} />
          </CubeFace>

          {/* Second face */}
          <CubeFace
            transform={faceTransforms[1]}
            style={
              debug
                ? { width, height, backgroundColor: "#99ff99" }
                : { width, height }
            }
            debug={debug}
          >
            <MediaRenderer item={items[currentIndex]} debug={debug} />
          </CubeFace>

          {/* Third face */}
          <CubeFace
            transform={faceTransforms[2]}
            style={
              debug
                ? { width, height, backgroundColor: "#9999ff" }
                : { width, height }
            }
            debug={debug}
          >
            <MediaRenderer item={items[nextIndex]} debug={debug} />
          </CubeFace>

          {/* Fourth face */}
          <CubeFace
            transform={faceTransforms[3]}
            style={
              debug
                ? { width, height, backgroundColor: "#ffff99" }
                : { width, height }
            }
            debug={debug}
          >
            <MediaRenderer item={items[afterNextIndex]} debug={debug} />
          </CubeFace>
        </motion.div>
      </div>
    )
  }
)

BoxCarousel.displayName = "BoxCarousel"

export default BoxCarousel
export type { CarouselItem, RotationDirection, SpringConfig }

```

## Usage

The Box Carousel creates a 3D rotating cube effect where each face displays a different item from your collection. You can navigate through items using mouse/touch drag, keyboard arrows, or control it via ref.

You need to pass an items array with at least 4 items, as well as the desired width and height of your items.

### High-level example

```tsx
function MyCarousel() {
  return (
    <BoxCarousel
      items={items}
      width={400}
      height={300}
      direction="right"
      enableDrag={true}
    />
  )
}
```

## Understanding the Component

The component constructs a 3D box using four faces positioned with CSS transforms. The order of the faces depends on the rotation direction, which will be important when we update the item indices. In the following snippet you can follow through the order when the rotation direction is `left`. If you want to dive deeper into how these transforms work, check out the [CSS Box documentation](https://uwuui.com/docs/components/blocks/css-box.md).

### Face positioning

```tsx
const faceTransforms = (() => {
  switch (direction) {
    case "left":
      return [
        `rotateY(-90deg) translateZ(${width / 2}px)`,  // left face
        `rotateY(0deg) translateZ(${depth / 2}px)`,    // front face
        `rotateY(90deg) translateZ(${width / 2}px)`,   // right face
        `rotateY(180deg) translateZ(${depth / 2}px)`,  // back face
      ]
    // ... other directions
  }
})()
```

The `depth` is calculated based on the rotation direction - for horizontal rotations (left/right), it uses the width, and for vertical rotations (top/bottom), it uses the height. This means all items are constrained to the same aspect ratio:

### Depth

```tsx
const depth = useMemo(
  () => (direction === "top" || direction === "bottom" ? height : width),
  [direction, width, height]
)
```

### Rotation

The component uses Motion's `useMotionValue` for control over rotations. For each rotation, we just add or subtract 90 degrees:

### Motion values

```tsx
//...

const baseRotateX = useMotionValue(0)  // For vertical rotations
const baseRotateY = useMotionValue(0)  // For horizontal rotations

//...

// Rotate to next face when direction is left
} else if (direction === "left") {
  animate(baseRotateY, currentRotation - 90, {
    ..._transition,
    onComplete: () => {
      handleAnimationComplete("next")
      setCurrentRotation(currentRotation - 90)
    },
  })
}
//...
```

Then, we just transform these motion values to a CSS transform and use it on the whole box container.

### 3D transform

```tsx
//...

const transform = useTransform(
  isDragging.current ? [springRotateX, springRotateY] : [baseRotateX, baseRotateY],
  ([x, y]) => `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`
)

//...

<motion.div
  className="relative w-full h-full [transform-style:preserve-3d]"
  style={{
    transform: transform,
  }}
>
```

### Item Management

The component maintains four item indices to track which items are displayed on each face. The first face (at `prevIndex`) is, by default, the last item in our items array. The second face is the current camera-facing item, which is the first item in our array. The third face is the next item in our array, and the fourth face (backward-facing face) is the next item after the next item in our array.

### Item indices

```ts
const [prevIndex, setPrevIndex] = useState(items.length - 1)     // Face 0
const [currentIndex, setCurrentIndex] = useState(0)             // Face 1 (visible)
const [nextIndex, setNextIndex] = useState(1)                   // Face 2
const [afterNextIndex, setAfterNextIndex] = useState(2)         // Face 3
```

If our carousel only had 4 items, we could leave these indices as-is. However, with more than 4 items, we need to update the indices after each rotation so that the correct items are always displayed on each face—even after several rotations.

In practice, only the index for the backward-facing face needs to be updated after a rotation; the other three faces remain consistent. The function that handles this may look a bit tricky at first, but the logic is straightforward: after each rotation, we determine which face is now at the back and update its index to point to the next appropriate item in the array.

### Update item indices

```ts
const handleAnimationComplete = useCallback(
  (triggeredBy: string) => {
    if (isRotating.current && pendingIndexChange.current !== null) {
      isRotating.current = false

      let newFrontFaceIndex: number
      let currentBackFaceIndex: number

      if (triggeredBy === "next") {
        newFrontFaceIndex = (currentFrontFaceIndex + 1) % 4
        currentBackFaceIndex = (newFrontFaceIndex + 2) % 4
      } else {
        newFrontFaceIndex = (currentFrontFaceIndex - 1 + 4) % 4
        currentBackFaceIndex = (newFrontFaceIndex + 3) % 4
      }

      setCurrentItemIndex(pendingIndexChange.current)
      onIndexChange?.(pendingIndexChange.current)

      const indexOffset = triggeredBy === "next" ? 2 : -1

      if (currentBackFaceIndex === 0) {
        setPrevIndex(
          (pendingIndexChange.current + indexOffset + items.length) %
            items.length
        )
      } else if (currentBackFaceIndex === 1) {
        setCurrentIndex(
          (pendingIndexChange.current + indexOffset + items.length) %
            items.length
        )
      } else if (currentBackFaceIndex === 2) {
        setNextIndex(
          (pendingIndexChange.current + indexOffset + items.length) %
            items.length
        )
      } else if (currentBackFaceIndex === 3) {
        setAfterNextIndex(
          (pendingIndexChange.current + indexOffset + items.length) %
            items.length
        )
      }

      pendingIndexChange.current = null
      rotationCount.current++

      setCurrentFrontFaceIndex(newFrontFaceIndex)
    }
  },
[currentFrontFaceIndex, items.length, onIndexChange]
)
```

### Drag Interaction

The component supports drag interaction. In the following function you can see that we're modifying the base rotation values based on the delta of the mouse/touch position:

### Drag handling

```ts
const handleDragMove = useCallback(
  (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || isRotating.current) return

    const point = "touches" in e ? e.touches[0] : e
    const deltaX = point.clientX - startPosition.current.x
    const deltaY = point.clientY - startPosition.current.y

    const isVertical = direction === "top" || direction === "bottom"
    const delta = isVertical ? deltaY : deltaX
    const rotationDelta = (delta * dragSensitivity) / 2

    let newRotation = startRotation.current

    if (direction === "top" || direction === "right") {
      newRotation += rotationDelta
    } else {
      newRotation -= rotationDelta
    }

    // Constrain rotation to +/-120 degrees from start position. Otherwise the index recalculation will be off. TBD - find a better solution
    const minRotation = startRotation.current - 120
    const maxRotation = startRotation.current + 120
    newRotation = Math.max(minRotation, Math.min(maxRotation, newRotation))

    // Apply the rotation immediately during drag
    if (isVertical) {
      baseRotateX.set(newRotation)
    } else {
      baseRotateY.set(newRotation)
    }
  },
  [enableDrag, direction, dragSensitivity]
)
```

When the drag interaction is released, the carousel will snap back to the nearest 90-degree increment:

### Drag snap

```ts
const handleDragEnd = useCallback(() => {
  if (!isDragging.current) return

  isDragging.current = false

  const isVertical = direction === "top" || direction === "bottom"
  const currentValue = isVertical ? baseRotateX.get() : baseRotateY.get()

  // Calculate the nearest quarter rotation (90-degree increment)
  const quarterRotations = Math.round(currentValue / 90)
  const snappedRotation = quarterRotations * 90

  // Calculate how many steps we've moved from the original position
  const rotationDifference = snappedRotation - currentRotation
  const steps = Math.round(rotationDifference / 90)

  if (steps !== 0) {
    isRotating.current = true

    // Calculate new item index
    let newItemIndex = currentItemIndex
    for (let i = 0; i < Math.abs(steps); i++) {
      if (steps > 0) {
        newItemIndex = (newItemIndex + 1) % items.length
      } else {
        newItemIndex =
          newItemIndex === 0 ? items.length - 1 : newItemIndex - 1
      }
    }

    pendingIndexChange.current = newItemIndex

    // Animate to the snapped position
    const targetMotionValue = isVertical ? baseRotateX : baseRotateY
    animate(targetMotionValue, snappedRotation, {
      ...snapTransition,
      onComplete: () => {
        handleAnimationComplete(steps > 0 ? "next" : "prev")
        setCurrentRotation(snappedRotation)
      },
    })
  } else {
    // Snap back to current position
    const targetMotionValue = isVertical ? baseRotateX : baseRotateY
    animate(targetMotionValue, currentRotation, snapTransition)
  }
}, [
  direction,
  baseRotateX,
  baseRotateY,
  currentRotation,
  currentItemIndex,
  items.length,
  transition,
  handleAnimationComplete,
])
```

You can customize the snap transition by passing in a custom value for `snapTransition` prop. The default value is `{ type: "spring", damping: 30, stiffness: 200 }`.

You can also customize the drag sensitivity and spring physics by passing in custom values for `dragSensitivity` and `dragSpring` props. The default values are `0.5` and `{ stiffness: 200, damping: 30 }` respectively.

An important note here is that the drag rotation is constrained to a +/- 120 degree range for the sake of simplicity. Otherwise we would need to re-order the whole items array to keep the correct ordering of items after a huge rotation.
Feel free to open a PR if you'd like to fix this :).

### Auto-play Mode

You can enable automatic progression through items with the `autoPlay` prop:

Example:

```tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { Bug, BugOff } from "lucide-react"
import BoxCarousel, { 
  type BoxCarouselRef, 
  type CarouselItem, 
} from "@/fancy/components/carousel/box-carousel"
import useScreenSize from "@/hooks/use-screen-size"

// Sample carousel items with mix of images and videos
const carouselItems: CarouselItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://cdn.cosmos.so/778d0640-d4b8-45b4-8bbe-862e759c231d?format=jpeg",
    alt: "Blurry poster"
  },
  {
    id: "2", 
    type: "image",
    src: "https://cdn.cosmos.so/27ac2696-1f2b-498e-8d3d-11f2dd358ab9?format=jpeg",
    alt: "Abstract blurry figure"
  },
  {
    id: "3",
    type: "image", 
    src: "https://cdn.cosmos.so/c48b739d-202d-4340-ab6b-afa34f0d7142?format=jpeg",
    alt: "Long exposure photo of a person"
  },
  {
    id: "4",
    type: "image",
    src: "https://cdn.cosmos.so/5332f9ac-7823-4635-871d-d4b3032e1c62?format=jpeg", 
    alt: "Blurry portrait photo of a person"
  },
  {
    id: "5",
    type: "image",
    src: "https://cdn.cosmos.so/d9ed937e-7c3b-4f64-a4f3-708d639f13a1?format=jpeg",
    alt: "Long exposure shots with multiple people"
  },
  {
    id: "6",
    type: "image",
    src: "https://cdn.cosmos.so/33b43e2a-da66-42d9-a0b1-08165d80b0aa?format=jpeg",
    alt: "Close up blurry photo of a person poster"
  },
  {
    id: "7",
    type: "image",
    src: "https://cdn.cosmos.so/40342df7-2ea2-4297-add2-fe17cdc62551?format=jpeg",
    alt: "Long exposure shot of a motorcyclist"
  },
]

export default function BoxCarouselDemo() {
  const carouselRef = useRef<BoxCarouselRef>(null)
  const [debug, setDebug] = useState(false)

  const screenSize = useScreenSize()

  // Responsive dimensions based on screen size
  const getCarouselDimensions = () => {
    if (screenSize.lessThan("md")) {
      return { width: 200, height: 150 }
    }
    return { width: 350, height: 250 }
  }

  const { width, height } = getCarouselDimensions()

  const handleIndexChange = (index: number) => {
    console.log('Index changed:', index)
  }

  const toggleDebug = () => {
    setDebug(!debug)
  }

  return (
    <div className="w-full max-w-4xl h-full p-6 flex justify-items-center justify-center items-center text-muted-foreground bg-[#fefefe]">
      <button
        onClick={toggleDebug}
        className="absolute top-4 left-4 p-1.5 border border-black text-black rounded-full cursor-pointer transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
        title={debug ? "Debug Mode: ON" : "Debug Mode: OFF"}
      >
        {debug ? (
          <Bug size={10} />
        ) : (
          <BugOff size={10} />
        )}
      </button>

      <div className="space-y-24">

        <div className="flex justify-center">
          <BoxCarousel
            ref={carouselRef}
            items={carouselItems}
            width={width}
            height={height}
            direction="top"
            autoPlay
            autoPlayInterval={1500}
            onIndexChange={handleIndexChange}
            debug={debug}
            enableDrag
            perspective={1000}
          />
        </div>

      </div>
    </div>
  )
}

```

### Keyboard Navigation

The component includes full keyboard support when the carousel is in focus:

- **Arrow keys**: Navigate based on rotation direction
  - Left/Right arrows work for `left`/`right` directions
  - Up/Down arrows work for `top`/`bottom` directions

### Mixed Media Support

Supports both images and videos with different handling:

Example:

```tsx
"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import BoxCarousel, {
  type BoxCarouselRef,
  type CarouselItem,
} from "@/fancy/components/carousel/box-carousel"
import useScreenSize from "@/hooks/use-screen-size"

// Sample carousel items with mix of images and videos
const carouselItems: CarouselItem[] = [
  {
    id: "1",
    type: "video",
    src: "https://cdn.cosmos.so/3fe9c8a8-b562-4090-a5ac-5bbdf655a938.mp4",
    alt: "@portalsandpaths",
  },
  {
    id: "2",
    type: "video",
    src: "https://cdn.cosmos.so/594e87df-e8ca-4d03-8137-f78b5dab6793.mp4",
    alt: "@studio.size",
  },
  {
    id: "3",
    type: "image",
    src: "https://cdn.cosmos.so/92162e2e-abf6-4b98-a557-bfe25a336608?format=jpeg",
    alt: "@david_wise",
  },
  {
    id: "4",
    type: "video",
    src: "https://cdn.cosmos.so/aae0a1e6-d03d-43ae-aa7f-21627a950730.mp4",
    alt: "@svenvranjes",
  },
  {
    id: "5",
    type: "image",
    src: "https://cdn.cosmos.so/7a5f1a73-ca73-466b-afaf-2b3d0639aa1a?format=jpeg",
    alt: "@deconstructie",
  },
]

export default function BoxCarouselDemo() {
  const carouselRef = useRef<BoxCarouselRef>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const screenSize = useScreenSize()

  // Responsive dimensions based on screen size
  const getCarouselDimensions = () => {
    if (screenSize.lessThan("md")) {
      return { width: 200, height: 150 }
    }
    return { width: 350, height: 250 }
  }

  const { width, height } = getCarouselDimensions()

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="w-full max-w-4xl h-full p-6 flex justify-items-center justify-center items-center text-muted-foreground bg-[#fefefe]">

      <div className="space-y-20">
        <div className="flex justify-center">
          <BoxCarousel
            ref={carouselRef}
            items={carouselItems}
            width={width}
            height={height}
            direction="right"
            onIndexChange={handleIndexChange}
            enableDrag
            perspective={1000}
          />
        </div>

        <div className="flex gap-2 justify-center w-full items-start">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentIndex}
              layoutId="id"
              layout
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-3 py-1.5 text-sm w-autp bg-gray-200 text-black rounded-xl"
            >
              {carouselItems[currentIndex]?.alt}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

```

Videos automatically play with `muted`, `loop`, and `autoPlay` attributes. If you need more custom controls here, modify the `MediaRenderer` component.

### Imperative API

You can access carousel controls programmatically using a ref. This can be handy when you want to trigger a rotation via buttons, just like in the first demo on the page:

### Ref usage

```tsx
function MyComponent() {
  const carouselRef = useRef<BoxCarouselRef>(null)

  const handleNext = () => {
    carouselRef.current?.next()
  }

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const getCurrentIndex = () => {
    return carouselRef.current?.getCurrentItemIndex() ?? 0
  }

  return (
    <>
      <BoxCarousel ref={carouselRef} items={items} width={400} height={300} />
      <button onClick={handleNext}>Next</button>
      <button onClick={handlePrev}>Previous</button>
    </>
  )
}
```

### Reduced Motion Support

The component automatically respects user preferences for reduced motion by setting transition duration to 0 when `prefers-reduced-motion` is detected. The drag interaction remains intact, though.

## Credits

You can find the links for each artwork used in the demo [here](https://www.cosmos.so/danielpetho/box-carousel-demo).

Ported to Framer by [Framer University](https://framer.university/)

## Resources

- [Intro to CSS 3D transforms](https://3dtransforms.desandro.com/) by David DeSandro
- [CSS Box](https://uwuui.com/docs/components/blocks/css-box.md)
- [Flickity](https://flickity.metafizzy.co/) by MetaFizzy

## Props

### BoxCarousel Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| items* | `CarouselItem[]` | - | Array of items to display in the carousel |
| width* | `number` | - | Width of the carousel in pixels |
| height* | `number` | - | Height of the carousel in pixels |
| className | `string` | - | Additional CSS classes for the container |
| direction | `"top" | "bottom" | "left" | "right"` | `"left"` | The axis and direction of rotation |
| perspective | `number` | `600` | CSS perspective value for 3D effect depth |
| debug | `boolean` | `false` | Enable debug mode to visualize cube faces |
| transition | `ValueAnimationOptions` | `{ duration: 1.25, ease: [0.953, 0.001, 0.019, 0.995] }` | Animation options for programmatic rotations |
| snapTransition | `ValueAnimationOptions` | `{ type: "spring", damping: 30, stiffness: 200 }` | Animation options for drag snap-back |
| dragSpring | `SpringConfig` | `{ stiffness: 200, damping: 30 }` | Spring physics configuration for drag interactions |
| autoPlay | `boolean` | `false` | Enable automatic progression through items |
| autoPlayInterval | `number` | `3000` | Interval in milliseconds for auto-play |
| enableDrag | `boolean` | `true` | Enable drag interaction for navigation |
| dragSensitivity | `number` | `0.5` | Sensitivity multiplier for drag movement |
| onIndexChange | `(index: number) => void` | - | Callback fired when the active item changes |

### BoxCarousel Ref Methods

| Method | Type | Default | Description |
|----------|----------|----------|----------|
| goTo | `(index: number) => void` | - | Programmatically go to a specific item index |
| next | `() => void` | - | Advance to the next item |
| prev | `() => void` | - | Go to the previous item |
| getCurrentItemIndex | `() => number` | - | Get the current active item index |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/carousel/box-carousel).*