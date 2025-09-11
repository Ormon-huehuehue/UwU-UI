# Gravity

> A set of wrapper components for creating physics-based gravity animations with Matter.js.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [svg-path-to-vertices](#svg-path-to-vertices)
    - [calculate-position](#calculate-position)
    - [gravity](#gravity)
- [Usage](#usage)
  - [Gravity usage example](#gravity-usage-example)
- [Understanding the component](#understanding-the-component)
  - [Gravity component](#gravity-component)
  - [MatterBody component](#matterbody-component)
  - [Matter Body](#matter-body)
  - [Matter Body options](#matter-body-options)
  - [Context](#context)
- [Examples](#examples)
  - [Non-draggable bodies](#non-draggable-bodies)
  - [Different body types](#different-body-types)
  - [SVGs](#svgs)
- [Props](#props)
  - [Gravity](#gravity)
  - [MatterBody](#matterbody)

Example:

```tsx
import Gravity, { MatterBody } from "@/fancy/components/physics/gravity"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh flex flex-col relative font-azeret-mono bg-white">
      <div className="pt-20 text-6xl sm:text-7xl md:text-8xl text-foreground dark:text-muted w-full text-center font-calendas italic">
        fancy
      </div>
      <p className="pt-4 text-base sm:text-xl md:text-2xl text-foreground dark:text-muted w-full text-center">
        components made with:
      </p>
      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="30%"
          y="10%"
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-8 py-4">
            react
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="30%"
          y="30%"
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#e794da] text-white rounded-full hover:cursor-grab px-8 py-4 ">
            typescript
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="40%"
          y="20%"
          angle={10}
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d] text-white rounded-full hover:cursor-grab px-8 py-4 ">
            motion
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="75%"
          y="10%"
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941] text-white rounded-full hover:cursor-grab px-8 py-4 ">
            tailwind
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="80%"
          y="20%"
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#f97316] text-white rounded-full hover:cursor-grab px-8 py-4 ">
            drei
          </div>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="50%"
          y="10%"
        >
          <div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726] text-white rounded-full hover:cursor-grab px-8 py-4 ">
            matter-js
          </div>
        </MatterBody>
      </Gravity>
    </div>
  )
}

```

Setting up Matter.js for creating physics-based animations can be a bit tricky and cumbersome, especially with React. This component simplifies the process by wrapping your content with a physics world, and transforming your React components into Matter.js bodies.

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/gravity.json"
```

### Manual

First, install the following dependencies:

```bash
matter-js @types/matter-js poly-decomp svg-path-commander
```

We use the `matter-js` library to create the physics simulation. The `poly-decomp` package is used to decompose bodies into a set of vertices, which is required for the `svg` body type. The `svg-path-commander` package is used to parse SVG paths and convert them into a set of vertices (since the built-in feature for this in `matter-js` is outdated).

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

And another one for calculating the position of an element based on its container, and a posiiton value:

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

Then, copy the component source code:

#### gravity

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
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js"

import { cn } from "@/lib/utils"

type GravityProps = {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  grabCursor?: boolean
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
        isDraggable && "pointer-events-none"
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
      gravity = { x: 0, y: 1 },
      grabCursor = true,
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
    const mouseConstraint = useRef<Matter.MouseConstraint>()
    const mouseDown = useRef(false)
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

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

      engine.current.gravity.x = gravity.x
      engine.current.gravity.y = gravity.y

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

      const mouse = Mouse.create(render.current.canvas)
      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
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

      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0

      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", (event) => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default"
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab"
            }
          }
        })

        canvas.current.addEventListener("mousedown", (event) => {
          mouseDown.current = true

          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grabbing"
            } else {
              canvas.current.style.cursor = "default"
            }
          }
        })
        canvas.current.addEventListener("mouseup", (event) => {
          mouseDown.current = false

          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grab"
            } else {
              canvas.current.style.cursor = "default"
            }
          }
        })
      }

      World.add(engine.current.world, [mouseConstraint.current, ...walls])

      render.current.mouse = mouse

      runner.current = Runner.create()
      Render.run(render.current)
      updateElements()
      runner.current.enabled = false

      if (autoStart) {
        runner.current.enabled = true
        startEngine()
      }
    }, [updateElements, debug, autoStart])

    // Clear the Matter.js world
    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }

      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current)
      }

      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse)
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

First, you need to wrap your scene / content with the `Gravity` component. Set the gravity direction vector in the `gravity` prop (default is `{x: 0, y: 1}`). Then, in order to transform your regular HTML elements into Matter bodies, you need to wrap them with the `MatterBody` component. 

You need to set each bodies `x` and `y` position, either as a percentage of your container size, or as a number. You do not need to set the width and height manually, everything else is taken care of by component :). High-level example:

### Gravity usage example

```tsx
<Gravity>
  <MatterBody x="50%" y="50%">
    <div>Hello world!</div>
  </MatterBody>
  <MatterBody x="10%" y="10%">
    <div>fancy!</div>
  </MatterBody>
</Gravity>
```

## Understanding the component

### Gravity component

At its core, the Gravity component creates and manages a Matter.js physics world. It handles:

1. **Physics Setup**: Creates a canvas and initializes the Matter.js physics engine with:

   - A physics engine to calculate forces and collisions
   - A renderer to visualize the physics (when debug mode is enabled)
   - A runner to step the physics simulation forward
   - Mouse constraints to enable dragging of elements

2. **Animation Loop**: Continuously updates the positions of your HTML elements to match their physics bodies in the Matter.js world. This creates the illusion that your DOM elements are actually affected by physics.

3. **Controls**: Exposes three main methods:

   - `start()`: Begins the physics simulation
   - `stop()`: Pauses the physics simulation
   - `reset()`: Returns all elements to their starting positions

4. **Debug Mode**: When enabled via the `debug` prop, shows the actual Matter.js physics bodies as overlays, which is super helpful for development.

### MatterBody component

The `MatterBody` component transforms regular HTML elements into physics-enabled elements. Key features:

- **Positioning**: Set initial positions with `x` and `y` props

### Matter Body 

```typescript
<MatterBody x="50%" y="100px">
  <div>I'm physics-enabled!</div>
</MatterBody>
```

- **Body Types**: Choose between different physics shapes:

  - `rectangle`: Default, good for most elements
  - `circle`: Perfect for round elements
  - `svg`: For complex custom shapes

- **Physics Properties**: Customize how elements behave with `matterBodyOptions`. The most commonly used options are:

### Matter Body options

```tsx
<MatterBody 
  matterBodyOptions={{ 
    friction: 0.5,     // How slippery it is
    restitution: 0.7,  // How bouncy it is
    density: 0.001,    // How heavy it is
    isStatic: false,   // If true, the element won't move but can be collided with
    force: { x: 0, y: 0 } // Initial force applied to the body
    // ... 
  }}
>
  <div>I'm bouncy!</div>
</MatterBody>
```

For a complete list of options, check out the [Matter.js Body documentation](https://brm.io/matter-js/docs/classes/Body.html#properties). You can fine-tune everything from angular velocity to mass to create exactly the physics behavior you want.

### Context

The components use React Context to communicate. When you wrap an element with `MatterBody`, it registers itself with the parent `Gravity` component. The registration process:

1. Creates a Matter.js physics body matching your element's size and shape
2. Adds the body to the physics world
3. Sets up a sync system where the HTML element's position updates to match its physics body

## Examples

### Non-draggable bodies

By default, the MatterBody makes its element draggable. You can disable this behavior by setting the `isDraggable` prop to `false`. (Under the hood, we just add back the pointer-events to the elements, so they will be clickable, hover-able, etc, but the Matter body underneath will not receive any pointer events). This can be handy to create creative footers with clickable links for example:

Example:

```tsx
"use client"

import { motion } from "motion/react"

import Gravity, { MatterBody } from "@/fancy/components/physics/gravity"

const socialLinks = [
  { name: "LinkedIn", x: "30%", y: "10%" },
  { name: "X (Twitter)", x: "30%", y: "30%" },
  { name: "Instagram", x: "40%", y: "20%", angle: 10 },
  { name: "GitHub", x: "75%", y: "10%", angle: -4 },
  { name: "BlueSky", x: "80%", y: "20%", angle: 5 },
]

const stars = ["✱", "✽", "✦", "✸", "✹", "✺"]

export default function Preview() {
  return (
    <div className="w-dvw h-dvh flex flex-col relative bg-white font-calendas">
      <p className="pt-4 text-6xl sm:text-7xl md:text-9xl text-[#0015ff] w-full text-center font-calendas">
        CONTACT
      </p>
      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
        {socialLinks.map((link) => (
          <MatterBody
            key={link.name}
            matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
            x={link.x}
            y={link.y}
            angle={link.angle || 0}
            isDraggable={false}
          >
            <motion.div
              className="text-xl sm:text-2xl md:text-3xl bg-white text-[#0015ff] border border-[#0015ff] rounded-full hover:cursor-pointer hover:bg-[#0015ff] hover:text-white md:px-8 md:py-4 py-3 px-6"
              whileTap={{ scale: 0.9 }}
            >
              {link.name}
            </motion.div>
          </MatterBody>
        ))}

        {stars.map((star, i) => (
          <MatterBody
            key={i}
            matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
            x={`${Math.random() * 60 + 20}%`}
            y={`${Math.random() * 20 + 40}%`}
            angle={Math.random() * 360}
          >
            <div
              className={`aspect-square w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#0015ff] text-white rounded-lg text-center`}
            ></div>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  )
}

```

### Different body types

With the `bodyType` prop, you can choose between different types of bodies. The available types are `circle`, `rectangle`, and `svg`.

In this example, we have a mixed of `circle` and `rectangle` bodies. Again, you do not need to define the sizes on the `MatterBody` component, you can define them on your component level, eg. adding `w-12 h12` to your tailwind classes. Then, the component will calculate the size for the matter.js engine.

Example:

```tsx
import {
  Atom,
  AudioLines,
  BatteryCharging,
  Brain,
  Cloud,
  Cog,
  Cpu,
  Cuboid,
  Earth,
  Eye,
  Globe,
  HandMetal,
  Heart,
  Laptop,
  Layers,
  MessageCircle,
  Microscope,
  Move,
  PaintRoller,
  PersonStanding,
  Pyramid,
  Regex,
  Rocket,
  Satellite,
  Save,
  ScanFace,
  Settings,
  Sigma,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react"

import Gravity, { MatterBody } from "@/fancy/components/physics/gravity"

export default function Preview() {
  const icons = [
    { icon: Atom, size: 24 },
    { icon: Brain, size: 24 },
    { icon: Cog, size: 24 },
    { icon: Cpu, size: 24 },
    { icon: TrendingUp, size: 24 },
    { icon: Globe, size: 24 },
    { icon: Laptop, size: 24 },
    { icon: Microscope, size: 24 },
    { icon: Pyramid, size: 24 },
    { icon: Rocket, size: 24 },
    { icon: PaintRoller, size: 24 },
    { icon: Eye, size: 24 },
    { icon: ScanFace, size: 24 },
    { icon: PersonStanding, size: 24 },
    { icon: Sun, size: 24 },
    { icon: Sparkles, size: 24 },
    { icon: Regex, size: 24 },
    { icon: Cloud, size: 24 },
    { icon: Settings, size: 24 },
    { icon: MessageCircle, size: 24 },
    { icon: Cuboid, size: 24 },
    { icon: Atom, size: 24 },
    { icon: Brain, size: 24 },
    { icon: AudioLines, size: 24 },
    { icon: BatteryCharging, size: 24 },
    { icon: Satellite, size: 24 },
    { icon: Move, size: 24 },
    { icon: Star, size: 24 },
    { icon: HandMetal, size: 24 },
    { icon: Heart, size: 24 },
    { icon: Save, size: 24 },
    { icon: Layers, size: 24 },
    { icon: Earth, size: 24 },
    { icon: Zap, size: 24 },
    { icon: Sigma, size: 24 },
  ]

  return (
    <div className="w-dvw h-dvh flex flex-col items-center relative bg-white">
      <h2 className=" text-black pt-24 text-xl ponter-events-none">
        icons from lucide.dev
      </h2>
      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
        {icons.map((IconData, index) => {
          const Icon = IconData.icon
          const randomX = Math.random() * 60 + 20 // Random x between 20-80%
          const randomY = Math.random() * 20 + 5 // Random y between 5-25%
          const bodyType = Math.random() > 0.7 ? "rectangle" : "circle"

          return (
            <MatterBody
              key={index}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              bodyType={bodyType}
              x={`${randomX}%`}
              y={`${randomY}%`}
            >
              <div
                className={`p-4 ${
                  bodyType === "circle" ? "rounded-full" : "rounded-md"
                } bg-white border border-border shadow-md text-foreground dark:text-muted`}
              >
                <Icon size={IconData.size} />
              </div>
            </MatterBody>
          )
        })}
      </Gravity>
    </div>
  )
}

```

### SVGs

The third `bodyType` option is `svg`, which allows you to create physics bodies from SVG elements. This is particularly useful for creating custom-shaped physics objects that match your SVG graphics.

Here's how it works:

1. The component takes your SVG element and extracts the path data
2. It converts the path into a series of vertices (points) that outline the shape (with a custom converter using the `svg-path-commander` package)
3. These vertices are then converted into polygons by matter.js (with the help of the `poly-decomp` package).
4. The resulting polygons are then used to create Matter.js bodies

Example:

```tsx
"use client"

import { useState } from "react"

import Gravity, { MatterBody } from "@/fancy/components/physics/gravity"

export default function Preview() {
  const [debug, setDebug] = useState(false)

  return (
    <div className="w-dvw h-dvh flex flex-col relative  bg-white">
      <button
        onClick={() => setDebug(!debug)}
        className="absolute top-4 left-4 px-4 py-2 text-xs border border-border rounded-lg bg-background hover:bg-accent cursor-pointer z-10"
      >
        {debug ? "Disable Debug" : "Enable Debug"}
      </button>
      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full" debug={debug}>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="30%"
          y="10%"
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
              fill="#1F464D"
            />
          </svg>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="80%"
          y="30%"
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
              fill="#0015FF"
            />
          </svg>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="40%"
          y="20%"
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
              fill="#E794DA"
            />
          </svg>
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="75%"
          y="10%"
          bodyType="circle"
        >
          <div className="w-32 h-32 bg-red  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 " />
        </MatterBody>
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x="80%"
          y="20%"
        >
          <div className="w-16 h-16 bg-orange-500  text-white [#E794DA] rounded-lg hover:cursor-grab px-8 py-4 " />
        </MatterBody>
        <MatterBody
          matterBodyOptions={{
            friction: 0.5,
            restitution: 0.2,
            isStatic: true,
          }}
          x="50%"
          y="95%"
          bodyType="svg"
        >
          <svg
            width="298"
            height="125"
            viewBox="0 0 298 125"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7705 44.16H2.3225L1.8105 41.344C1.8105 41.344 7.9545 39.936 10.7705 37.376V32.512C10.7705 16.128 19.3465 -7.62939e-06 37.9065 -7.62939e-06C48.1465 -7.62939e-06 53.2665 3.96799 53.2665 8.448C53.2665 12.032 50.0665 14.336 46.9945 14.336C46.2265 14.336 45.7145 14.208 45.7145 14.208C45.0745 12.288 42.1305 5.24799 35.0905 5.24799C25.8745 5.24799 21.7785 14.848 21.7785 28.672V38.4H42.2585V44.416H21.7785V84.48C21.7785 90.496 23.4425 91.776 27.2825 92.032L34.1945 92.544V96C34.1945 96 22.0345 95.616 16.4025 95.616C10.5145 95.616 0.5305 96 0.5305 96V92.544L3.9865 92.032C7.8265 91.52 10.7705 88.32 10.7705 83.456V44.16ZM58.4255 83.584C58.4255 89.216 62.1375 91.648 66.4895 91.648C72.6335 91.648 74.9375 88.96 80.1855 87.68C80.1855 87.68 79.5455 84.096 79.5455 79.36C79.5455 74.752 79.6735 70.528 79.6735 70.528C68.1535 70.528 58.4255 74.752 58.4255 83.584ZM79.8015 66.432C79.8015 66.432 80.1855 57.856 80.1855 53.632C80.1855 46.848 77.8815 41.728 69.8175 41.728C63.6735 41.728 61.2415 45.056 61.2415 48.256C61.2415 50.304 62.0095 51.968 62.9055 52.992C61.2415 54.272 59.0655 54.912 56.7615 54.912C52.6655 54.912 49.9775 52.736 49.9775 49.024C49.9775 42.112 60.8575 36.352 72.6335 36.352C85.8175 36.352 90.8095 44.032 90.8095 55.936C90.8095 64 90.1695 71.936 90.1695 80.512C90.1695 86.912 90.9375 91.008 96.1855 91.008C99.3855 91.008 101.434 89.728 101.434 89.728L102.586 91.904C102.586 91.904 98.7455 98.048 91.3215 98.048C85.3055 98.048 82.1055 94.208 81.0815 90.496C75.8335 91.648 72.1215 98.048 61.8815 98.048C52.6655 98.048 47.1615 93.44 47.1615 84.992C47.1615 70.656 64.9535 66.432 79.8015 66.432ZM170.138 92.032L174.106 92.544V96C174.106 96 165.658 95.616 160.026 95.616C153.754 95.616 144.666 96 144.666 96V92.544L147.354 92.032C151.194 91.264 154.138 88.32 154.138 83.456V54.656C154.138 47.744 150.682 44.16 144.026 44.16C137.242 44.16 132.378 48.512 127.514 49.408V84.48C127.514 90.496 128.41 91.648 132.506 92.032L136.602 92.544V96C136.602 96 127.77 95.616 122.01 95.616C116.25 95.616 106.138 96 106.138 96V92.544L109.722 92.032C113.562 91.52 116.506 88.32 116.506 83.456V52.864C116.506 47.36 114.33 45.184 106.906 45.184L106.138 42.368C118.042 41.216 127.514 36.48 127.514 36.48V45.824C130.586 44.928 138.266 36.352 148.25 36.352C159.642 36.352 165.018 43.776 165.018 53.248V84.48C165.018 90.496 166.042 91.52 170.138 92.032ZM207.426 42.112C198.466 42.112 191.298 49.408 191.298 66.048C191.298 77.952 198.082 89.856 213.314 89.856C219.202 89.856 224.194 88.704 227.906 86.912L229.186 89.344C227.522 91.392 220.61 98.048 207.554 98.048C197.826 98.048 180.034 91.392 180.034 68.608C180.034 52.096 191.938 36.352 212.418 36.352C220.994 36.352 230.338 39.808 230.338 46.72C230.338 50.56 226.114 52.992 222.146 52.992C220.866 52.992 219.714 52.736 218.562 52.224C218.562 52.224 219.074 50.944 219.074 49.28C219.074 46.208 216.77 42.112 207.426 42.112ZM263.396 38.4V41.856L260.196 42.368C257.636 42.752 256.356 43.648 256.356 45.312C256.356 45.568 256.356 46.208 256.612 47.104L268.004 83.968L282.084 47.872C282.468 46.72 282.724 45.952 282.724 45.44C282.724 43.904 281.7 42.752 279.396 42.368L275.94 41.856V38.4C275.94 38.4 281.316 38.784 288.1 38.784C293.732 38.784 297.956 38.4 297.956 38.4V41.856L296.036 42.24C292.196 43.008 289.38 44.928 287.332 49.92L263.396 106.624C259.044 116.992 252.9 124.416 242.66 124.416C233.444 124.416 230.883 119.68 230.883 115.712C230.883 112.896 233.059 109.824 237.796 109.824C238.564 109.824 239.588 109.952 239.844 110.08C239.716 110.464 239.588 110.976 239.588 111.488C239.588 115.072 241.764 116.48 245.348 116.48C251.236 116.48 256.1 113.024 259.3 104.96L262.5 97.024L245.988 50.304C243.94 44.416 241.635 42.88 238.436 42.368L234.98 41.856V38.4C234.98 38.4 244.708 38.784 250.468 38.784C255.46 38.784 263.396 38.4 263.396 38.4Z"
              fill="black"
            />
          </svg>
        </MatterBody>
      </Gravity>
    </div>
  )
}

```

As you can see in the demo above, SVG bodies can produce varying results. Simple shapes like the stars translate well, maintaining their shapes in the physics simulation. More complex shapes like the _fancy_ text at the bottom (which is an SVG path, and not an HTML element) end up with rougher approximations.

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

While the demo's _fancy_ text on the bottom worked well by chance for me, you more than likely will need to experiment with different settings to get the desired results. Use the `debug` prop to visualize the physics bodies and their vertices, and adjust the `sampleLength` prop to control the accuracy of the conversion.

For more details on the decomposition process, refer to the [poly-decomp documentation](https://github.com/schteppe/poly-decomp), the [Matter.js documentation](https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices), and to the [SVG path commander documentation](https://github.com/thednp/svg-path-commander).

## Props

### Gravity

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| debug | `boolean` | `false` | Whether to show the physics bodies and their vertices |
| gravity | `{ x: number; y: number }` | `{ x: 0, y: 1 }` | The direction of gravity |
| resetOnResize | `boolean` | `true` | Whether to reset the physics world when the window is resized |
| grabCursor | `boolean` | `true` | Whether to show grab/grabbing cursor when interacting with bodies |
| addTopWall | `boolean` | `true` | Whether to add a wall at the top of the canvas |
| autoStart | `boolean` | `true` | Whether to automatically start the physics simulation |
| className | `string` | - | Additional CSS classes to apply to the container |

### MatterBody

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| matterBodyOptions | `Matter.IBodyDefinition` | `{ friction: 0.1, restitution: 0.1, density: 0.001, isStatic: false }` | Matter.js body configuration options |
| bodyType | `"rectangle" | "circle" | "svg"` | `"rectangle"` | The type of physics body to create |
| isDraggable | `boolean` | `true` | Whether the body can be dragged with the mouse |
| sampleLength | `number` | `15` | The sampling distance for SVG path vertices |
| x | `number | string` | `0` | Initial x position (can be percentage string) |
| y | `number | string` | `0` | Initial y position (can be percentage string) |
| angle | `number` | `0` | Initial rotation angle in degrees |
| className | `string` | - | Additional CSS classes to apply to the container |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/physics/gravity).*