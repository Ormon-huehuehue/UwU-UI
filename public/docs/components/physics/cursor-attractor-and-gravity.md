# Cursor Attractor & Gravity

> A set of wrapper components for creating physics-based attractors and gravity animations with Matter.js.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [svg-path-to-vertices](#svg-path-to-vertices)
    - [calculate-position](#calculate-position)
    - [cursor-attractor-and-gravity](#cursor-attractor-and-gravity)
- [Usage](#usage)
  - [Gravity usage example](#gravity-usage-example)
- [Understanding the component](#understanding-the-component)
- [Examples](#examples)
  - [Repel](#repel)
  - [SVGs](#svgs)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
import { motion } from "motion/react"

import useScreenSize from "@/hooks/use-screen-size"
import Gravity, {
  MatterBody,
} from "@/fancy/components/physics/cursor-attractor-and-gravity"

export default function Preview() {
  const screenSize = useScreenSize()
  const words = [
    "we",
    "analyze",
    { text: "millions", highlight: true },
    { text: "of", highlight: true },
    { text: "data", highlight: true },
    { text: "points", highlight: true },
    "per",
    "second",
    "to",
    "provide",
    "you",
    "with",
    "the",
    "most",
    "accurate",
    "insights.",
  ]

  return (
    <div className="w-dvw h-dvh flex flex-col relative font-overused-grotesk justify-center items-center bg-white">
      <Gravity
        attractorStrength={0.0}
        cursorStrength={0.0004}
        cursorFieldRadius={200}
        className="w-full h-full z-0 absolute"
      >
        {[...Array(150)].map((_, i) => {
          // Adjust max size based on screen size
          const maxSize = screenSize.lessThan("sm")
            ? 20
            : screenSize.lessThan("md")
              ? 30
              : 40
          const size = Math.max(
            screenSize.lessThan("sm") ? 10 : 20,
            Math.random() * maxSize
          )
          return (
            <MatterBody
              key={i}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${Math.random() * 100}%`}
              y={`${Math.random() * 100}%`}
            >
              <div
                className="rounded-full bg-[#eee]"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            </MatterBody>
          )
        })}
      </Gravity>
      <span className="text z-10 sm:text-lg md:text-xl text-black px-4 py-2 w-2/3 flex flex-wrap whitespace-pre-wrap">
        {words.map((word, index) => {
          const text = typeof word === "string" ? word : word.text
          const highlight = typeof word === "object" && word.highlight

          return (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`${highlight ? "text-[#0015ff]" : ""} ${index < words.length - 1 ? "mr-1" : ""}`}
            >
              {text}
            </motion.span>
          )
        })}
      </span>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/cursor-attractor-and-gravity.json"
```

### Manual

Install the following dependencies:

```bash
matter-js @types/matter-js poly-decomp
```

Then, create an utility function for parsing SVG paths into a set of vertices:

#### svg-path-to-vertices

```tsx
import SVGPathCommander from "svg-path-commander"

// Function to convert SVG path `d` to vertices
export function parsePathToVertices(path: string, sampleLength = 15) {
  // Convert path to absolute commands
  const commander = new SVGPathCommander(path)

  const points: { x: number; y: number }[] = []
  let lastPoint: { x: number; y: number } | null = null

  // Get total length of the path
  const totalLength = commander.getTotalLength()
  let length = 0

  // Sample points along the path
  while (length < totalLength) {
    const point = commander.getPointAtLength(length)

    // Only add point if it's different from the last one
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y })
      lastPoint = point
    }

    length += sampleLength
  }

  // Ensure we get the last point
  const finalPoint = commander.getPointAtLength(totalLength)
  if (
    lastPoint &&
    (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)
  ) {
    points.push({ x: finalPoint.x, y: finalPoint.y })
  }

  return points
}
```

The other is for calculating the position of an element based on its container, and a posiiton value

#### calculate-position

```tsx
export function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
): number {
  // Handle percentage strings (e.g. "50%")
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100
    return containerSize * percentage
  }

  // Handle direct pixel values
  if (typeof value === "number") {
    return value
  }

  // If no value provided, center the element
  return (containerSize - elementSize) / 2
}

```

And another one for calculating the position of an element based on its container, and a posiiton value:

#### cursor-attractor-and-gravity

```tsx
"use client"

import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { calculatePosition } from "@/utils/calculate-position"
import { parsePathToVertices } from "@/utils/svg-path-to-vertices"
import { debounce } from "lodash"
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Render,
  Runner,
  World,
  Body,
} from "matter-js"

import { cn } from "@/lib/utils"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

type GravityProps = {
  children: ReactNode
  debug?: boolean
  attractorPoint?: { x: number | string; y: number | string }
  attractorStrength?: number
  cursorStrength?: number
  cursorFieldRadius?: number
  resetOnResize?: boolean
  addTopWall?: boolean
  autoStart?: boolean
  className?: string
}

type PhysicsBody = {
  element: HTMLElement
  body: Matter.Body
  props: MatterBodyProps
}

type MatterBodyProps = {
  children: ReactNode
  matterBodyOptions?: Matter.IBodyDefinition
  isDraggable?: boolean
  bodyType?: "rectangle" | "circle" | "svg"
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
  className?: string
}

export type GravityRef = {
  start: () => void
  stop: () => void
  reset: () => void
}

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void
  unregisterElement: (id: string) => void
} | null>(null)

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(Math.random().toString(36).substring(7))
  const context = useContext(GravityContext)

  useEffect(() => {
    if (!elementRef.current || !context) return
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    })

    return () => context.unregisterElement(idRef.current)
  }, [props, children, matterBodyOptions, isDraggable])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute",
        className,
      )}
    >
      {children}
    </div>
  )
}

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      attractorPoint = { x: 0.5, y: 0.5 },
      attractorStrength = 0.001,
      cursorStrength = 0.0005,
      cursorFieldRadius = 100,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null)
    const engine = useRef(Engine.create())
    const render = useRef<Render>()
    const runner = useRef<Runner>()
    const bodiesMap = useRef(new Map<string, PhysicsBody>())
    const frameId = useRef<number>()
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
    const mouseRef = useMousePositionRef(canvas)

    const isRunning = useRef(false)

    // Register Matter.js body in the physics world
    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return
        const width = element.offsetWidth
        const height = element.offsetHeight
        const canvasRect = canvas.current!.getBoundingClientRect()

        const angle = (props.angle || 0) * (Math.PI / 180)

        const x = calculatePosition(props.x, canvasRect.width, width)
        const y = calculatePosition(props.y, canvasRect.height, height)

        let body
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2
          body = Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path")
          const vertexSets: Matter.Vector[][] = []

          paths.forEach((path) => {
            const d = path.getAttribute("d")
            const p = parsePathToVertices(d!, props.sampleLength)
            vertexSets.push(p)
          })

          body = Bodies.fromVertices(x, y, vertexSets, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        }

        if (body) {
          World.add(engine.current.world, [body])
          bodiesMap.current.set(id, { element, body, props })
        }
      },
      [debug]
    )

    // Unregister Matter.js body from the physics world
    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id)
      if (body) {
        World.remove(engine.current.world, body.body)
        bodiesMap.current.delete(id)
      }
    }, [])

    // Keep react elements in sync with the physics world
    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position
        const rotation = body.angle * (180 / Math.PI)

        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`
      })

      frameId.current = requestAnimationFrame(updateElements)
    }, [])

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return

      const height = canvas.current.offsetHeight
      const width = canvas.current.offsetWidth

      Common.setDecomp(require("poly-decomp"))

      // Remove default gravity
      engine.current.gravity.x = 0
      engine.current.gravity.y = 0

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      })

      // Add walls
      const walls = [
        // Floor
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),

        // Right wall
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),

        // Left wall
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),
      ]

      const topWall = addTopWall
        ? Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: {
              visible: debug,
            },
          })
        : null

      if (topWall) {
        walls.push(topWall)
      }

      World.add(engine.current.world, [...walls])

      runner.current = Runner.create()
      Render.run(render.current)
      updateElements()
      runner.current.enabled = false

      if (autoStart) {
        runner.current.enabled = true
        startEngine()
      }

      // Add force application before update
      Events.on(engine.current, "beforeUpdate", () => {
        const bodies = engine.current.world.bodies.filter(
          (body) => !body.isStatic
        )

        // Calculate attractor position in pixels
        const attractorX = typeof attractorPoint.x === 'string' 
          ? (width * parseFloat(attractorPoint.x) / 100)
          : width * attractorPoint.x
        const attractorY = typeof attractorPoint.y === 'string'
          ? (height * parseFloat(attractorPoint.y) / 100) 
          : height * attractorPoint.y

        bodies.forEach((body) => {
          // Apply attractor force
          const dx = attractorX - body.position.x
          const dy = attractorY - body.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 0) {
            const force = {
              x: (dx / distance) * attractorStrength * body.mass,
              y: (dy / distance) * attractorStrength * body.mass,
            }
            Body.applyForce(body, body.position, force)
          }

          // Apply cursor force if mouse is present
          if (mouseRef.current?.x && mouseRef.current?.y && mouseRef.current.x > 0 && mouseRef.current.y > 0) {
            const mdx = mouseRef.current.x - body.position.x
            const mdy = mouseRef.current.y - body.position.y
            const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy)

            if (mouseDistance > 0 && mouseDistance < cursorFieldRadius) {
              const mouseForce = {
                x: (mdx / mouseDistance) * cursorStrength * body.mass,
                y: (mdy / mouseDistance) * cursorStrength * body.mass,
              }
              Body.applyForce(body, body.position, mouseForce)
            }
          }
        })
      })
    }, [updateElements, debug, autoStart, attractorPoint, attractorStrength, cursorStrength])

    // Clear the Matter.js world
    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }

      if (render.current) {
        Render.stop(render.current)
        render.current.canvas.remove()
      }

      if (runner.current) {
        Runner.stop(runner.current)
      }

      if (engine.current) {
        World.clear(engine.current.world, false)
        Engine.clear(engine.current)
      }

      bodiesMap.current.clear()
    }, [])

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return

      const newWidth = canvas.current.offsetWidth
      const newHeight = canvas.current.offsetHeight

      setCanvasSize({ width: newWidth, height: newHeight })

      // Clear and reinitialize
      clearRenderer()
      initializeRenderer()
    }, [clearRenderer, initializeRenderer, resetOnResize])

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true

        Runner.run(runner.current, engine.current)
      }
      if (render.current) {
        Render.run(render.current)
      }
      frameId.current = requestAnimationFrame(updateElements)
      isRunning.current = true
    }, [updateElements, canvasSize])

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return

      if (runner.current) {
        Runner.stop(runner.current)
      }
      if (render.current) {
        Render.stop(render.current)
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      isRunning.current = false
    }, [])

    const reset = useCallback(() => {
      stopEngine()
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0

        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        )
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        )
        body.position.x = x
        body.position.y = y
      })
      updateElements()
      handleResize()
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine]
    )

    useEffect(() => {
      if (!resetOnResize) return

      const debouncedResize = debounce(handleResize, 500)
      window.addEventListener("resize", debouncedResize)

      return () => {
        window.removeEventListener("resize", debouncedResize)
        debouncedResize.cancel()
      }
    }, [handleResize, resetOnResize])

    useEffect(() => {
      initializeRenderer()
      return clearRenderer
    }, [initializeRenderer, clearRenderer])

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(className, "absolute top-0 left-0 w-full h-full")}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    )
  }
)

Gravity.displayName = "Gravity"
export default Gravity

```

## Usage

First, you need to wrap your scene / content with the `Gravity` component. Set the attraction point coordinates in the `attractorPoint` prop. This point will either attract or repel all the bodies inside the container. Then, in order to transform your regular HTML elements into Matter bodies, you need to wrap them with the `MatterBody` component. 

You need to set each bodies `x` and `y` position, either as a percentage of your container size, or as a number. You do not need to set the width and height manually, everything else is taken care of by component :). Lastly, set the strength and radius of the cursor attractor, which will also attract or repell all bodies. High-level example:

### Gravity usage example

```tsx
<Gravity attractorPoint={{ x: "50%", y: "50%" }} attractorStrength={0.0006} cursorStrength={-0.005} cursorFieldRadius={200}>
  <MatterBody x="50%" y="50%">
    <div>Hello world!</div>
  </MatterBody>
  <MatterBody x="10%" y="10%">
    <div>fancy!</div>
  </MatterBody>
</Gravity>
```

## Understanding the component

Please refer to the [Gravity](https://uwuui.com/docs/components/physics/gravity.md) documentation, since the component is almost identical. The only difference is that in this component that we don't use a directional gravitational force.Instead, we use attractor force(s), either from a defined static point (optional), and/or from the cursor position, that attract or repel all bodies inside the container. This is achieved by calculating the distance between the attractor point(s) and each body, and applying a force in the opposite direction of the body's velocity. The force is proportional to the distance and inversely proportional to the mass of the body.

## Examples

### Repel

By setting one of the attractor points' strength to a negative value, you can create a repelling effect. The following demo showcases a negative force from the cursor by applying a negative value to the `cursorStrength` prop.

Example:

```tsx
import useScreenSize from "@/hooks/use-screen-size"
import Gravity, {
  MatterBody,
} from "@/fancy/components/physics/cursor-attractor-and-gravity"

export default function Preview() {
  const screenSize = useScreenSize()

  const getImageCount = () => {
    if (screenSize.lessThan("sm")) return 50
    if (screenSize.lessThan("md")) return 60
    if (screenSize.lessThan("lg")) return 70
    return 80
  }

  const getMaxSize = () => {
    if (screenSize.lessThan("sm")) return 40
    if (screenSize.lessThan("md")) return 50
    return 60
  }

  const getMinSize = () => {
    if (screenSize.lessThan("sm")) return 10
    if (screenSize.lessThan("md")) return 20
    return 20
  }

  return (
    <div className="w-dvw h-dvh flex flex-col relative justify-center items-center md:items-end bg-white">
      <div>
        <p className="z-20 text-2xl sm:text-3xl md:text-3xl text-foreground dark:text-muted md:pr-24">
          join the <span className="font-calendas  italic">community</span>
        </p>
      </div>
      <Gravity
        attractorPoint={{ x: "33%", y: "50%" }}
        attractorStrength={0.0005}
        cursorStrength={-0.004}
        cursorFieldRadius={screenSize.lessThan("sm") ? 100 : 200}
        className="w-full h-full"
      >
        {[...Array(getImageCount())].map((_, i) => {
          const size = Math.max(getMinSize(), Math.random() * getMaxSize())
          return (
            <MatterBody
              key={i}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${Math.random() * 100}%`}
              y={`${Math.random() * 30}%`}
            >
              <img
                src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i}.jpg`}
                alt={`Avatar ${i}`}
                className="rounded-full object-cover hover:cursor-pointer"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            </MatterBody>
          )
        })}
      </Gravity>
    </div>
  )
}

```

### SVGs

Youy can choose `svg` as a `bodyType` for your matter bodies. This is particularly useful for creating custom-shaped physics objects that match your SVG graphics.

Here's how it works:

1. The component takes your SVG element and extracts the path data
2. It converts the path into a series of vertices (points) that outline the shape (with a custom converter using the `svg-path-commander` package)
3. These vertices are then converted into polygons by matter.js (with the help of the `poly-decomp` package).
4. The resulting polygons are then used to create Matter.js bodies

Example:

```tsx
import { useState } from "react"

import Gravity, {
  MatterBody,
} from "@/fancy/components/physics/cursor-attractor-and-gravity"

export default function Preview() {
  const [debug, setDebug] = useState(false)

  return (
    <div className="w-dvw h-dvh flex flex-col relative justify-center items-center bg-white">
      <button
        onClick={() => setDebug(!debug)}
        className="absolute top-4 left-4 px-4 py-2 text-xs border border-border rounded-lg bg-background hover:bg-accent cursor-pointer z-10"
      >
        {debug ? "Disable Debug" : "Enable Debug"}
      </button>
      <p className="z-20 text-2xl sm:text-3xl md:text-3xl text-black">
        UwU UI
      </p>
      <Gravity
        //attractorPoint={{ x: "33%", y: "50%" }}
        attractorStrength={0.0}
        cursorStrength={0.0005}
        cursorFieldRadius={200}
        className="w-full h-full"
        debug={debug}
      >
        {["#0015FF", "#E794DA"].map((color, i) => (
          <>
            <MatterBody
              key={`star1-${i}`}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${10 + Math.random() * 80}%`}
              y={`${10 + Math.random() * 80}%`}
              bodyType="svg"
            >
              <svg
                width="111"
                height="108"
                viewBox="0 0 111 108"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.9185 107.176L33.6145 66.472L0.5905 44.328H41.0385L55.5025 0.679993L70.2225 44.328L110.415 44.328L77.3905 66.472L91.3425 107.176L55.5025 81.192L19.9185 107.176Z"
                  fill={color}
                />
              </svg>
            </MatterBody>

            <MatterBody
              key={`star2-${i}`}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${10 + Math.random() * 80}%`}
              y={`${10 + Math.random() * 80}%`}
              bodyType="svg"
            >
              <svg
                width="152"
                height="153"
                viewBox="0 0 152 153"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M45.3648 152.4L41.7648 150.8L52.5648 100L1.76484 110.8L0.164844 107.2L41.7648 76.4L0.164844 46L1.76484 42.4L52.5648 52.8L41.7648 2.39999L45.3648 0.799989L76.1648 42.4L106.565 0.799989L110.165 2.39999L99.7648 52.8L150.165 42.4L151.765 46L110.165 76.4L151.765 107.2L150.165 110.8L99.7648 100L110.165 150.8L106.565 152.4L76.1648 110.8L45.3648 152.4Z"
                  fill={color}
                />
              </svg>
            </MatterBody>

            <MatterBody
              key={`star3-${i}`}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${10 + Math.random() * 80}%`}
              y={`${10 + Math.random() * 80}%`}
              angle={10}
              bodyType="svg"
            >
              <svg
                width="99"
                height="99"
                viewBox="0 0 99 99"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M46.9325 98.376C45.0125 87.368 37.2045 73.544 22.3565 62.408C15.0605 56.904 7.6365 53.32 0.3405 51.784V46.408C14.8045 42.952 29.0125 33.224 38.1005 20.04C42.7085 13.384 45.6525 6.856 46.9325 0.0719986H52.3085C54.4845 13 64.4685 27.336 78.0365 36.936C84.6925 41.672 91.6045 44.872 98.6445 46.408V51.784C84.4365 54.728 67.9245 67.4 59.7325 80.328C55.6365 86.856 53.2045 92.872 52.3085 98.376H46.9325Z"
                  fill={color}
                />
              </svg>
            </MatterBody>
          </>
        ))}
      </Gravity>
    </div>
  )
}

```

As you can see in the demo above, SVG bodies can produce varying results. Simple shapes like some of the stars translate well, but some of them are a bit rough.

This variance in quality stems from the challenging process of converting SVG paths to physics bodies. Therefore, there are a few caveats to keep in mind:

1. **SVG Requirements**:

   - Keep them simple. The simpler the SVG, the better the decomposition, and the simulation.
   - It's only tested with single-path SVGs, and it probably won't work with nested paths.
   - Avoid shapes with holes or complex curves, or shapes that are seem to be too complex to decompose into polygons.

2. **Performance Impact**:
   - Complex SVGs create more detailed physics bodies, which can slow down the simulation
   - More vertices mean more calculations
   - The initial path-to-vertices conversion can be slow.

If you're not getting the desired results, you have several options:

1. Break down complex SVGs into simpler shapes
2. Use basic physics bodies (rectangles/circles) with the SVG as a visual overlay
3. Fine-tune the vertex sampling with the `sampleLength` prop

You more than likely will need to experiment with different settings to get the desired results. Use the `debug` prop to visualize the physics bodies and their vertices, and adjust the `sampleLength` prop to control the accuracy of the conversion.

For more details on the decomposition process, refer to the [poly-decomp documentation](https://github.com/schteppe/poly-decomp), the [Matter.js documentation](https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices), and to the [SVG path commander documentation](https://github.com/thednp/svg-path-commander).

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| attractorPoint | `{ x: number | string; y: number | string }` | `{ x: 0.5, y: 0.5 }` | The attractor point coordinates |
| attractorStrength | `number` | `0.001` | The strength of the attractor force |
| cursorStrength | `number` | `0.0005` | The strength of the cursor force |
| cursorFieldRadius | `number` | `100` | The radius of the cursor field |
| resetOnResize | `boolean` | `true` | Whether to reset the physics world when the window is resized |
| addTopWall | `boolean` | `true` | Whether to add a wall at the top of the canvas |
| autoStart | `boolean` | `true` | Whether to automatically start the physics simulation |
| className | `string` | - | Additional CSS classes for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/physics/cursor-attractor-and-gravity).*