# Image Trail

> A component that creates a trail effect on cursor/touch movement. Works also with videos, svgs, or any type of html elements.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [image-trail](#image-trail)
- [Introduction](#introduction)
- [Usage](#usage)
  - [Image trail usage example](#image-trail-usage-example)
- [Understanding the component](#understanding-the-component)
  - [How the Trail Follows the Cursor](#how-the-trail-follows-the-cursor)
  - [Calculating target position](#calculating-target-position)
  - [Animating the Trail Items](#animating-the-trail-items)
  - [Customizing the Visual Animation](#customizing-the-visual-animation)
  - [Z Index Stacking](#z-index-stacking)
  - [Non-image elements](#non-image-elements)
- [Notes](#notes)
- [Props](#props)
  - [Image Trail Wrapper](#image-trail-wrapper)
  - [Image Trail Item](#image-trail-item)

Example:

```tsx
import Image from "next/image"
import { exampleImages } from "@/utils/demo-images"

import ImageTrail,{
  ImageTrailItem,
} from "@/fancy/components/image/image-trail"

const ImageTrailDemo = () => {
  return (
    <div className="w-dvw h-dvh bg-white relative text-foreground dark:text-muted">
      <ImageTrail
         threshold={80}
         keyframes={{ opacity: [0, 1, 1, 0], scale: [1, 1, 2] }}
         keyframesOptions={{
           opacity: { duration: 2, times: [0, 0.001, 0.9, 1] },
           scale: { duration: 2, times: [0, 0.8, 1] },
         }}
         repeatChildren={1}
      >
        {[...exampleImages, ...exampleImages].map((image, index) => (
          <ImageTrailItem key={index}>
            <div className="h-20 w-20 sm:w-28 sm:h-24 relative overflow-hidden">
              <Image
                src={image.url}
                alt="image"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrail>
      <h1 className="text-5xl sm:text-9xl absolute top-1/2 left-1/2 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-100">
        ALBUMS
      </h1>
    </div>
  )
}

export default ImageTrailDemo

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/image-trail.json"
```

### Manual

#### image-trail

```tsx
// author: Khoa Phan <https://www.pldkhoa.dev>

"use client"

import React, { ElementType, HTMLAttributes, useEffect, useMemo } from "react"
import type { DOMKeyframesDefinition, AnimationOptions } from "motion"
import { useAnimate } from "motion/react"

import { cn } from "@/lib/utils"

interface ImageTrailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be displayed
   */
  children: React.ReactNode

  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * How much distance in pixels the mouse has to travel to trigger of an element to appear.
   */
  threshold?: number

  /**
   * The intensity for the momentum movement after showing the element. The value will be clamped > 0 and <= 1.0. Defaults to 0.3.
   */
  intensity?: number

  /**
   * Animation Keyframes for defining the animation sequence. Example: { scale: [0, 1, 1, 0] }
   */
  keyframes?: DOMKeyframesDefinition

  /**
   * Options for the animation/keyframes. Example: { duration: 1, times: [0, 0.1, 0.9, 1] }
   */
  keyframesOptions?: AnimationOptions

  /**
   * Animation keyframes for the x and y positions after showing the element. Describes how the element should try to arrive at the mouse position.
   */
  trailElementAnimationKeyframes?: {
    x?: AnimationOptions
    y?: AnimationOptions
  }

  /**
   * The number of times the children will be repeated. Defaults to 3.
   */
  repeatChildren?: number

  /**
   * The base zIndex for all elements. Defaults to 0.
   */
  baseZIndex?: number

  /**
   * Controls stacking order behavior.
   * - "new-on-top": newer elements stack above older ones (default)
   * - "old-on-top": older elements stay visually on top
   */
  zIndexDirection?: "new-on-top" | "old-on-top"
}

interface ImageTrailItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * The content to be displayed
   */
  children: React.ReactNode
}

/**
 * Helper functions
 */
const MathUtils = {
  // linear interpolation
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
  // distance between two points
  distance: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1),
}

const ImageTrail = ({
  className,
  as = "div",
  children,
  threshold = 100,
  intensity = 0.3,
  keyframes,
  keyframesOptions,
  repeatChildren = 3,
  trailElementAnimationKeyframes = {
    x: { duration: 1, type: "tween", ease: "easeOut" },
    y: { duration: 1, type: "tween", ease: "easeOut" },
  },
  baseZIndex = 0,
  zIndexDirection = "new-on-top",
  ...props
}: ImageTrailProps) => {
  const allImages = React.useRef<NodeListOf<HTMLElement>>()
  const currentId = React.useRef(0)
  const lastMousePos = React.useRef({ x: 0, y: 0 })
  const cachedMousePos = React.useRef({ x: 0, y: 0 })
  const [containerRef, animate] = useAnimate()
  const zIndices = React.useRef<number[]>([])

  const clampedIntensity = useMemo(
    () => Math.max(0.0001, Math.min(1, intensity)),
    [intensity]
  )

  useEffect(() => {
    allImages.current = containerRef?.current?.querySelectorAll(
      ".image-trail-item"
    ) as NodeListOf<HTMLElement>

    zIndices.current = Array.from(
      { length: allImages.current.length },
      (_, index) => index
    )
  }, [containerRef, allImages])

  const handleMouseMove = (e: React.MouseEvent) => {
    const containerRect = containerRef?.current?.getBoundingClientRect()
    const mousePos = {
      x: e.clientX - (containerRect?.left || 0),
      y: e.clientY - (containerRect?.top || 0),
    }

    cachedMousePos.current.x = MathUtils.lerp(
      cachedMousePos.current.x || mousePos.x,
      mousePos.x,
      clampedIntensity
    )

    cachedMousePos.current.y = MathUtils.lerp(
      cachedMousePos.current.y || mousePos.y,
      mousePos.y,
      clampedIntensity
    )

    const distance = MathUtils.distance(
      mousePos.x,
      mousePos.y,
      lastMousePos.current.x,
      lastMousePos.current.y
    )

    if (distance > threshold && allImages?.current) {
      const N = allImages.current.length
      const current = currentId.current

      if (zIndexDirection === "new-on-top") {
        // Shift others down, put current on top
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] -= 1
          }
        }
        zIndices.current[current] = N - 1
      } else {
        // Shift others up, put current at bottom
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] += 1
          }
        }
        zIndices.current[current] = 0
      }

      allImages.current[current].style.display = "block"
      allImages.current.forEach((img, index) => {
        img.style.zIndex = String(zIndices.current[index] + baseZIndex)
      })

      animate(
        allImages.current[currentId.current],
        {
          x: [
            cachedMousePos.current.x -
              allImages.current[currentId.current].offsetWidth / 2,
            mousePos.x - allImages.current[currentId.current].offsetWidth / 2,
          ],
          y: [
            cachedMousePos.current.y -
              allImages.current[currentId.current].offsetHeight / 2,
            mousePos.y -
              allImages.current?.[currentId.current].offsetHeight / 2,
          ],
          ...keyframes,
        },
        {
          ...trailElementAnimationKeyframes.x,
          ...trailElementAnimationKeyframes.y,
          ...keyframesOptions,
        }
      )
      currentId.current = (current + 1) % N
      lastMousePos.current = { x: mousePos.x, y: mousePos.y }
    }
  }

  const ElementTag = as ?? "div"

  return (
    <ElementTag
      className={cn("h-full w-full relative", className)}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      {...props}
    >
      {Array.from({ length: repeatChildren }).map(() => (
        <>{children}</>
      ))}
    </ElementTag>
  )
}

export const ImageTrailItem = ({
  className,
  children,
  as = "div",
  ...props
}: ImageTrailItemProps) => {
  const ElementTag = as ?? "div"
  return (
    <ElementTag
      {...props}
      className={cn(
        "absolute top-0 left-0 will-change-transform hidden",
        className,
        "image-trail-item"
      )}
    >
      {children}
    </ElementTag>
  )
}

export default ImageTrail

```

## Introduction

This component is a fun mouse interaction effect. The idea is to follow the mouse and show a trail of random images. It's a kind of brutalist effect and there are various possibilities when it comes to showing and hiding the images.

## Usage

Wrap each image with the `ImageTrailItem` component and wrap everything with the `ImageTrail` as a parent component.

### Image trail usage example

```tsx
<ImageTrail>
  <ImageTrailItem>...</ImageTrailItem>
  <ImageTrailItem>...</ImageTrailItem>
  <ImageTrailItem>...</ImageTrailItem>
</ImageTrail>
```

## Understanding the component

The `ImageTrail` component creates its effect by tracking the mouse (or touch) position and animating a series of child elements (`ImageTrailItem`) to follow that movement with a configurable delay and visual style.

### How the Trail Follows the Cursor

1.  **Tracking Position:** The component continuously monitors the mouse or touch position.
2.  **Calculating Target Position (Linear Interpolation):** Instead of instantly moving trail items to the current cursor position, it calculates a "target" position using linear interpolation (`lerp`). This smooths out the movement.

### Calculating target position

```tsx
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

    //...

    cachedMousePos.current.x = MathUtils.lerp(
      cachedMousePos.current.x || mousePos.x,
      mousePos.x,
      clampedIntensity
    )

    cachedMousePos.current.y = MathUtils.lerp(
      cachedMousePos.current.y || mousePos.y,
      mousePos.y,
      clampedIntensity
    )
    ```
</CodeSnippet>

3.  **Controlling Responsiveness (`intensity`):** The `intensity` prop (a value between 0 and 1) controls how quickly the calculated target position updates to match the actual cursor position.
    *   Lower values (e.g., 0.1) result in a smoother, more delayed "momentum" effect, where the trail items lag behind the cursor.
    *   Higher values (e.g., 0.8) make the trail more responsive but less smooth.
    *   An intensity of `1` positions the trail items exactly at the cursor's current position.

Example:

```tsx
import ImageTrail,{
  ImageTrailItem,
} from "@/fancy/components/image/image-trail"

const images = [
  "https://cdn.cosmos.so/7dc46d69-ad3b-4942-ab84-511ae786892e?format=jpeg",
  "https://cdn.cosmos.so/cb5c5995-4ba7-4519-a0e8-aa6427cc0a90?format=jpeg", 
  "https://cdn.cosmos.so/264d0ae9-f2e9-4deb-843c-229e70bbe4cc?format=jpeg",
  "https://cdn.cosmos.so/d9ed5da2-92b8-4b71-84e8-7bef645c44dc?format=jpeg",
  "https://cdn.cosmos.so/223c2fad-7dcb-46e0-9f00-826edcf8d7b1?format=jpeg",
  "https://cdn.cosmos.so/48e640ee-75e1-4390-a34a-b790785f033a?format=jpeg",
  "https://cdn.cosmos.so/d9c19f7c-d605-4257-8546-dafe0daa250f.?format=jpeg",
  "https://cdn.cosmos.so/5ff27be0-bed8-4779-b520-6896e68e7e4d?format=jpeg",
  "https://cdn.cosmos.so/9098d86e-b3f7-425f-be96-40df45c82342?format=jpeg",
  "https://cdn.cosmos.so/5c01be2f-57fe-4a1a-91ad-a37b9426e080?format=jpeg",
  "https://cdn.cosmos.so/6a1d9c63-5b32-4a22-b03e-5dc63164ad8a?format=jpeg",
]

const ImageTrailDemo = () => {
  return (
    <div className="w-dvw h-dvh bg-white relative text-foreground dark:text-muted">
      <ImageTrail
        threshold={100}
        intensity={1}
        keyframes={{ scale: [1, 1] }}
        keyframesOptions={{
          scale: { duration: 1, times: [1, 1] },
        }}
        repeatChildren={1}
      >
        {images.map((url, index) => (
          <ImageTrailItem key={index}>
            <div className="w-20 sm:w-28 h-full relative overflow-hidden">
              <img src={url} alt="image" className="object-cover" />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrail>
      <p className="text sm:text-lg absolute top-4 left-6 font-medium pointer-events-none z-100">
        move your cursor
      </p>
    </div>
  )
}

export default ImageTrailDemo

```

4.  **Triggering Animation (`threshold`):** An animation cycle for the next trail item is only triggered when the cursor moves a certain distance. This distance is calculated using the Pythagorean theorem (`Math.hypot`):

<CodeSnippet title="Calculating distance">
    ```tsx
    const distance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.hypot(x2 - x1, y2 - y1)
    ```
</CodeSnippet>

    The `threshold` prop (default: `100` pixels) defines this minimum distance. No new trail items are animated until the cursor has moved at least this far since the last item was triggered.

### Animating the Trail Items

When the movement threshold is met:

1.  **Cycling Through Items:** The component activates the next available `ImageTrailItem` in the sequence. By default, it cycles through all children and repeats from the beginning. You can set the `repeatChildren` prop to a number greater than 1 to duplicate the children internally and avoid immediate repetition.
2.  **Making Items Visible:** Trail items are initially hidden (`display: none`). When triggered, the next item is made visible (`display: block`) and starts its animation.
3.  **Animating Position:** The core movement animation uses the `animate` function from `Motion`. Each triggered item animates its `x` and `y` coordinates towards the continuously updating `cachedMousePos` (calculated using `lerp` as described above).

### Customizing the Visual Animation

Beyond the position animation, you can control how each `ImageTrailItem` visually appears and disappears using the `keyframes` and `keyframesOptions` props passed to the main `ImageTrail` component.

*   **`keyframes`:** Define the states of the animation (e.g., scale, opacity). You should define the initial state (how the element appears) and the final state (how it disappears).
*   **`keyframesOptions`:** Fine-tune the timing, duration, and easing for the properties defined in `keyframes`. The `times` array within options specifies the progress points (0 to 1) at which each keyframe state should be reached.

**Example:**

<CodeSnippet title="Custom keyframes">
```tsx
keyframes={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
keyframesOptions={{
  duration: 0.6, // Total duration for one item's animation
  scale: { times: [0, 0.1, 0.7, 1] }, // Scale keyframe timings
  opacity: { times: [0, 0.1, 0.7, 1] }, // Opacity keyframe timings
}}
```

In this example:
*   The item starts invisible (`opacity: 0`, `scale: 0`).
*   At 10% of the duration (`0.06s`), it quickly scales up and fades in (`opacity: 1`, `scale: 1`).
*   It remains fully visible until 70% of the duration (`0.42s`).
*   From 70% to 100% (`0.42s` to `0.6s`), it scales down and fades out back to the initial state (`opacity: 0`, `scale: 0`).

There must be the same number of values in a `times` array as there are keyframes for that property. If `times` is omitted, the keyframes are spread evenly across the `duration`. You can read more about this in the [Motion docs](https://motion.dev/docs/animate#times).

The component reuses DOM elements rather than creating new ones for each animation. It maintains a fixed set of `ImageTrailItem` elements that get recycled as needed. When an item needs to be triggered again, the component updates its position and restarts the animation without having to remove and remount elements in the DOM. For this recycling to work properly, make sure to define both initial and final states in the `keyframes` prop, as explained in the example above.

### Z Index Stacking

The component automatically manages the `z-index` of the trail items to control their stacking order. You can customize this behavior using two props:

- `zIndexDirection`: Controls whether newer or older items should appear on top
  - `"new-on-top"` (default): The most recently triggered item will have the highest z-index
  - `"old-on-top"`: The oldest items stay on top, with new items appearing underneath

- `baseZIndex`: Sets the starting z-index value (defaults to 0)

When a new item is triggered, the component maintains proper stacking by:
- For `"new-on-top"`: Setting the current item to the highest z-index and shifting all others down by 1
- For `"old-on-top"`: Setting the current item to the lowest z-index (baseZIndex) and shifting all others up by 1

Example with `zIndexDirection="old-on-top"`:

Example:

```tsx
import ImageTrail,{
  ImageTrailItem,
} from "@/fancy/components/image/image-trail"

const images = [
  "https://cdn.cosmos.so/7dc46d69-ad3b-4942-ab84-511ae786892e?format=jpeg",
  "https://cdn.cosmos.so/cb5c5995-4ba7-4519-a0e8-aa6427cc0a90?format=jpeg",
  "https://cdn.cosmos.so/264d0ae9-f2e9-4deb-843c-229e70bbe4cc?format=jpeg",
  "https://cdn.cosmos.so/d9ed5da2-92b8-4b71-84e8-7bef645c44dc?format=jpeg",
  "https://cdn.cosmos.so/223c2fad-7dcb-46e0-9f00-826edcf8d7b1?format=jpeg",
  "https://cdn.cosmos.so/48e640ee-75e1-4390-a34a-b790785f033a?format=jpeg",
  "https://cdn.cosmos.so/d9c19f7c-d605-4257-8546-dafe0daa250f.?format=jpeg",
  "https://cdn.cosmos.so/5ff27be0-bed8-4779-b520-6896e68e7e4d?format=jpeg",
  "https://cdn.cosmos.so/9098d86e-b3f7-425f-be96-40df45c82342?format=jpeg",
  "https://cdn.cosmos.so/5c01be2f-57fe-4a1a-91ad-a37b9426e080?format=jpeg",
  "https://cdn.cosmos.so/6a1d9c63-5b32-4a22-b03e-5dc63164ad8a?format=jpeg",
]

const ImageTrailDemo = () => {
  return (
    <div className="w-dvw h-dvh bg-white relative text-foreground dark:text-muted">
      <ImageTrail
        threshold={1}
        intensity={1}
        className="perspective-400"
        keyframes={{ scale: [1, 0], rotateX: [0, -90], rotateY: [0, -90], rotateZ: [0, 360] }}
        keyframesOptions={{
          scale: { duration: 1, type: "tween", ease: "easeOut" },
          rotateZ: { duration: 3, type: "tween", ease: "easeOut" },
          rotateY: { duration: 3, type: "tween", ease: "easeOut" },
          rotateX: { duration: 3, type: "tween", ease: "easeOut" },
        }}
        repeatChildren={10}
        zIndexDirection="old-on-top"
      >
        {images.map((url, index) => (
          <ImageTrailItem key={index} className="transform-3d">
            <div className="sm:w-36 sm:h-36 w-30 h-30 relative overflow-hidden rounded-xl">
              <img src={url} alt="image" className="object-cover" />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrail>
      <p className="text sm:text-lg absolute top-4 left-6 font-medium pointer-events-none z-100">
        move your cursor
      </p>
    </div>
  )
}

export default ImageTrailDemo

```

That's it! :)

### Non-image elements

The component is not constrained to be used with images, you can wrap videos, svgs, or basically any HTML elements inside a `ImageTrailItem`.

Example:

```tsx
import Image from "next/image"

import ImageTrail,{
  ImageTrailItem,
} from "@/fancy/components/image/image-trail"

const ImageTrailVariousElementsDemo = () => {
  return (
    <div className="w-dvw h-dvh bg-white relative text-foreground dark:text-muted">
      <ImageTrail
        threshold={60}
        keyframes={{ opacity: [0, 1, 1, 0], scale: [1, 1, 0] }}
        keyframesOptions={{
          opacity: { duration: 1, times: [0, 0.001, 0.9, 1] },
          scale: { duration: 1, times: [0, 0.8, 1] },
        }}
      >
        <ImageTrailItem>
          <div className="w-20 sm:w-28 aspect-square relative overflow-hidden bg-orange-500">
            <Image
              src={
                "https://images.unsplash.com/photo-1727341554370-80e0fe9ad082?q=80&w=2276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </ImageTrailItem>
        <ImageTrailItem>
          <div className="w-16 sm:w-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 107 243"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M90.6323 71.1433C95.9279 63.8693 101.283 56.5333 104.965 48.2748C105.355 47.1008 106.388 45.9327 106.181 44.6678C105.859 43.3526 103.93 43.0857 103.28 44.2887C100.187 51.4196 96.0129 56.3747 93.3873 59.7922C88.1477 66.6601 85.7113 69.8668 79.8443 76.9862C77.933 79.6185 75.3537 82.6433 72.6644 86.2504C73.4926 81.4036 74.2088 76.5375 74.7996 71.6559C74.9251 71.5843 75.0448 71.4992 75.1471 71.389C75.0911 71.4315 75.0545 71.4605 75.0178 71.4857C75.0583 71.4547 75.1066 71.418 75.1568 71.3793C75.2031 71.3503 75.3267 71.2594 75.4638 71.1433C75.7089 70.9751 75.8807 70.8552 75.9985 70.7681C76.2997 70.6115 76.5796 70.4007 76.8325 70.186C77.9947 69.4549 77.124 69.9752 79.2554 68.4163C80.7323 67.5769 89.335 58.7981 92.8661 54.05C96.8952 48.5765 99.7197 43.8168 101.515 38.4285C102.253 36.2623 102.907 34.0652 103.403 31.8313C103.538 30.903 104.054 29.8876 103.531 29.0056C102.811 27.6885 100.673 27.9554 100.316 29.4273C97.4184 40.5907 91.3679 49.4836 83.3965 57.7905C81.2478 60.1094 78.9407 62.2621 76.6124 64.3973C76.4097 64.6178 76.2186 64.8286 76.0371 65.0297C79.2419 52.6478 84.5298 40.9254 87.8581 28.5879C89.3543 22.923 90.1323 17.0995 90.5571 11.2624C90.6111 8.70172 91.1363 5.584 90.7501 3.12385C90.3756 2.0311 88.8002 1.74872 88.0222 2.58231C87.2364 3.45458 87.5627 4.76202 87.3697 5.8393C86.6534 15.6122 85.831 23.1241 82.7382 32.7017C80.9003 38.4304 78.765 44.1069 76.8287 49.8337C76.9522 47.4799 77.0353 45.1532 77.0565 42.9445C77.2804 37.4982 77.319 32.0421 76.5159 26.6364C75.7205 20.0161 74.093 13.5253 72.0929 7.17381C71.3091 4.73301 70.9713 3.853 70.396 2.39277C69.8824 1.37158 70.477 1.6733 69.2434 0.630829C68.1275 -0.0518993 66.5676 0.592147 66.2355 1.85703C66.0618 2.42178 66.2336 2.9788 66.3977 3.52227C66.7278 4.69626 67.0425 5.87411 67.3784 7.04809C70.8072 18.7009 73.342 28.1198 73.0969 39.6856C73.1471 46.9693 72.9327 54.2415 72.342 61.502C72.3227 61.8385 72.3053 62.177 72.2879 62.5135C70.9809 59.8387 69.4345 56.7287 69.1932 55.9318C66.9672 50.3172 65.4285 44.4492 63.9343 38.6045C62.2392 31.6263 61.3222 24.4934 60.1137 17.4244C59.5441 15.4652 56.5826 16.2446 57.0903 18.2599C58.824 31.5296 61.2681 48.2594 66.8861 62.0996C67.3205 63.2272 69.5832 68.3428 70.6488 69.0062C70.9828 69.2886 71.3477 69.4356 71.7107 69.4839C70.784 76.5452 69.3226 83.9063 67.4943 91.366C67.3167 90.3622 67.1371 89.3585 66.9595 88.3547C65.7896 81.1425 64.0791 74.0174 61.9439 67.0315C59.8106 60.6413 57.2892 54.3846 55.1269 48.0021C53.2736 42.401 51.592 36.7439 49.87 31.1022C49.395 29.3847 46.7212 30.0655 47.1961 31.841C49.8815 43.2694 53.1616 54.5277 57.0421 65.6061C59.8588 74.5918 61.9574 83.7941 63.7316 93.0371C64.2528 96.031 64.4439 97.0174 64.6158 99.2783C64.7393 99.9417 64.6119 100.667 64.8609 101.296C64.2374 103.493 63.5791 105.69 62.9072 107.885C62.7759 105.903 62.5906 103.976 62.357 102.305C61.1909 96.1896 60.3106 89.989 58.5673 84.003C56.9456 79.1446 55.1752 74.3268 53.1964 69.6038C52.2195 67.2965 50.4395 63.8113 49.4452 61.0765C49.1981 60.4672 49.0842 59.7284 48.4587 59.388C47.3447 58.6918 45.8292 59.8387 46.2231 61.1113C47.3003 64.2348 48.6421 67.2636 49.6827 70.4007C51.177 75.3383 52.5477 80.3147 54.0574 85.2505C57.0575 98.2436 58.4186 106.268 59.2082 116.524C59.2622 117.395 59.2487 118.358 59.2584 119.166C58.7043 120.793 58.1386 122.412 57.5672 124.023C57.154 122.816 56.7371 121.613 56.3896 120.391C54.0246 112.09 51.2658 103.912 48.4278 95.7622C47.6189 93.4548 46.6999 91.1881 45.9431 88.8614C45.4894 87.8402 45.5261 86.4303 44.5242 85.7707C43.3349 85.0261 41.7209 86.2543 42.1399 87.6081C44.0106 93.4587 45.4856 99.4098 46.9914 105.361C49.3043 113.262 52.6519 125.288 54.9802 130.926C54.9879 130.958 55.0053 130.984 55.015 131.016C54.2678 133.016 53.5168 135.003 52.7542 136.96C51.7059 139.882 50.6769 142.689 49.6556 145.427C49.3332 142.354 48.895 139.2 48.4742 136.801C47.0687 129.003 45.6941 121.184 43.75 113.5C43.084 110.877 42.3214 108.278 41.7036 105.641C41.248 104.173 41.219 102.497 40.4854 101.151C39.4718 99.7193 37.1068 100.891 37.6107 102.586C39.0316 109.233 39.2093 112.409 40.3078 118.466C42.2326 129.195 44.7076 142.397 45.7636 151.2C45.9586 153.251 45.9779 152.744 46.059 154.79C45.1265 157.142 44.1825 159.455 43.2172 161.757C41.4024 149.137 38.7961 136.645 35.6705 124.284C35.3037 122.665 34.9253 121.05 34.5121 119.443C34.3905 118.996 34.0913 118.611 33.6955 118.377C32.3924 117.561 30.6239 118.907 31.0815 120.391C33.9098 135.192 37.9119 157.976 39.3231 168.273C39.3231 168.866 39.493 169.352 39.7653 169.723C38.3791 172.816 36.9234 175.937 35.3848 179.123C35.1434 175.636 34.6994 172.158 34.3249 168.683C33.2939 159.179 30.622 149.984 28.2686 140.751C27.923 139.335 27.5987 137.915 27.3033 136.488C27.1933 136.08 26.9191 135.73 26.5581 135.517C25.3689 134.774 23.7549 135.999 24.1738 137.354C26.2183 149.073 29.1393 162.606 29.9637 172.684C30.4637 177.133 30.8576 181.604 30.6761 186.085C30.6529 187.064 30.5853 188.039 30.512 189.014C24.6121 200.537 16.4785 213.977 11.6791 222.193C8.88358 227.067 6.10163 231.954 3.10535 236.706C2.5088 237.679 1.90644 238.646 1.2983 239.611C0.773184 240.303 0.678612 241.354 1.27709 242.029C3.55712 244.342 4.94517 241.011 6.49929 239.388C7.48969 238.131 10.847 233.778 12.7293 230.89C20.9652 218.843 29.0544 205.099 36.4022 190.638C47.4509 182.122 64.1177 170.067 77.3461 158.415C78.9871 157.039 80.6165 155.649 82.2806 154.301C83.0258 153.57 84.1726 153.131 84.6167 152.16C85.3812 150.593 83.4235 148.868 81.9505 149.808C71.4462 157.457 59.4437 167.296 49.2715 174.864C46.5764 176.916 43.8619 178.941 41.1514 180.972C42.5646 177.995 43.945 175.001 45.281 171.992C45.3678 171.924 45.4508 171.851 45.5281 171.767C50.4704 168.259 62.8609 159.6 70.0407 153.552C76.5912 148.017 82.8946 142.116 88.6574 135.759C90.1246 134.246 87.9122 131.984 86.3696 133.467C79.2342 140.876 70.228 147.748 65.3707 151.494C61.7643 154.169 58.1927 156.896 54.5536 159.525C52.7041 160.795 50.841 162.053 49.0012 163.339C49.6518 161.768 50.2908 160.198 50.9144 158.625C51.4183 158.221 51.8797 157.626 52.8624 156.629C60.4554 148.86 68.0561 141.087 75.9271 133.598C79.6338 129.96 83.1533 126.139 86.7384 122.383C89.14 119.838 91.9819 117.041 93.3719 115.138C93.9028 114.258 94.9685 113.416 94.6924 112.295C94.3873 111.053 92.5726 110.803 91.9548 111.937C89.8524 115.006 84.1205 119.4 79.8559 123.574C71.4945 131.363 63.2064 139.221 55.1675 147.342C55.3509 146.826 55.5478 146.307 55.7293 145.791C57.3413 141.196 58.9958 136.612 60.6098 132.013C61.2256 131.523 61.7797 130.906 62.4091 130.469C65.1003 128.224 67.8688 126.069 70.533 123.791C76.6472 118.917 82.5451 113.766 87.8851 108.04C90.6381 105.057 93.2367 101.934 95.7755 98.7677C96.6674 97.6769 98.3528 95.4508 98.4126 95.3367C98.7717 94.7255 99.4165 94.2072 99.5111 93.4819C99.8026 91.9559 97.54 91.1726 96.8025 92.5439C89.2076 102.208 75.5912 113.49 63.5713 123.319C64.6235 120.118 65.6313 116.904 66.556 113.662C66.6661 113.558 66.7761 113.451 66.9151 113.327C69.9693 110.204 73.0235 107.075 76.0796 103.951C81.9525 97.8896 88.0956 92.041 93.2232 85.3124C95.6461 82.2198 96.8855 80.4656 99.4397 76.8411C100.712 74.8819 102.521 72.9691 103.399 70.8339C103.681 69.3582 101.49 68.5942 100.776 69.9249C97.6578 74.2088 92.5205 80.0343 88.1786 84.8675C81.854 91.4105 75.3576 97.7871 68.9847 104.284C69.5272 102 70.0485 99.7096 70.535 97.4139C78.3616 86.1924 82.3289 81.8233 90.6362 71.1453L90.6323 71.1433Z"
                fill="black"
              />
            </svg>
          </div>
        </ImageTrailItem>
        <ImageTrailItem>
          <div className="w-20 sm:w-28 relative overflow-hidden aspect-[9/16]">
            <video
              src={
                "https://cdn.cosmos.so/96ae0b34-289d-489d-94a1-c68925ddd3a9.mp4"
              }
              className="w-full h-full object-cover absolute inset-0"
              autoPlay
              muted
              playsInline
              loop
            />
          </div>
        </ImageTrailItem>
        <ImageTrailItem>
          <div className="w-28 sm:w-36 aspect-video text-center border bg-white border-black grid place-items-center text-sm sm:text-base">
            Hey, this is just a simple div
          </div>
        </ImageTrailItem>
      </ImageTrail>
      <p className="text sm:text-lg absolute top-4 left-6 font-medium pointer-events-none z-100">
        move your cursor
      </p>
    </div>
  )
}

export default ImageTrailVariousElementsDemo

```

## Notes

- The `ImageTrailItem` component assigns a default className of `.image-trail-item` to identify elements for animation within the `ImageTrail` component. Be cautious when applying custom `className` values with the same name (`.image-trail-item`) in your application, as this may cause conflicts or unintended behavior due to duplicate class selectors. To avoid issues, ensure custom classes are unique or use the `className` prop to extend styles without overriding the default `.image-trail-item` class.

- When using the `ImageTrail` component, content is heavily animated. To prevent performance issues, avoid using overly large images or videos.

## Props

### Image Trail Wrapper

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| threshold | `number` | `100` | How much distance in pixels the mouse has to travel to trigger an element to appear |
| as | `ElementType` | `div` | HTML Tag |
| intensity | `number` | `0.3` | The intensity for the momentum movement after showing the element. The value will be clamped greater than 0 and less than or equal to 1.0 |
| keyframes | `DOMKeyframesDefinition` | - | Animation Keyframes for defining the animation sequence. Example: `{ scale: [0, 1, 1, 0] }` |
| keyframesOptions | `AnimationOptions` | - | Options for the animation/keyframes. Example: `{ duration: 1, times: [0, 0.1, 0.9, 1] }` |
| trailElementAnimationKeyframes | `{ x?: AnimationOptions, y?: AnimationOptions }` | `{ x: { duration: 1, type: "tween", ease: "easeOut" }, y: { duration: 1, type: "tween", ease: "easeOut" } }` | Animation keyframes for the x and y positions after showing the element. Describes how the element should try to arrive at the mouse position |
| repeatChildren | `number` | `3` | The number of times the children will be repeated |
| baseZIndex | `number` | `0` | The base zIndex for all elements |
| zIndexDirection | `"new-on-top" | "old-on-top"` | `"new-on-top"` | Controls stacking order behavior. "new-on-top": newer elements stack above older ones, "old-on-top": older elements stay visually on top |
| className | `string` | - | Additional CSS class names |

### Image Trail Item

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| as | `ElementType` | `div` | HTML Tag |
| className | `string` | - | Additional CSS class names |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/image/image-trail).*