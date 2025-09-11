# Animated Gradient With SVG

> An animated multi-color gradient background effect with SVG elements.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-dimensions](#use-dimensions)
  - [globals.css](#globalscss)
    - [animated-gradient-with-svg](#animated-gradient-with-svg)
- [Understanding the component](#understanding-the-component)
  - [Movement variables](#movement-variables)
- [Props](#props)

Example:

```tsx
"use client"

import React from "react"

import AnimatedGradient from "@/fancy/components/background/animated-gradient-with-svg"

interface BentoCardProps {
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  align?: "left" | "center"
}

const gradientColors = ["#FF0000", "#FF4500", "#FF9900"]

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  align = "left",
}) => (
  <div className="relative overflow-hidden rounded-2xl min-h-[120px] sm:min-h-[180px] w-dvw h-dvh flex flex-col justify-between p-4 sm:p-6 font-medium">
    <span className="absolute inset-0 z-0 pointer-events-none bg-[#ff592f]">
      <AnimatedGradient colors={gradientColors} speed={10} blur="medium" />
    </span>
    <div
      className={`relative z-10 flex-1 ${align === "center" ? "items-center text-center" : "items-start text-left"} flex flex-col justify-between w-full h-full`}
    >
      <div>
        <div className="text-white text-xs sm:text-sm md:text-base font-semibold -mb-0.5">
          {title}
        </div>
        {subtitle && (
          <div className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2">
            {subtitle}
          </div>
        )}
      </div>
      {description && (
        <div className="text-white text-[10px] sm:text-xs mt-auto mb-1 sm:mb-2 text-pretty leading-tight">{description}</div>
      )}
      {buttonText && (
        <button className="mt-2 sm:mt-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white text-white text-[10px] sm:text-xs font-medium transition-colors cursor-pointer">
          {buttonText}
        </button>
      )}
    </div>
  </div>
)

const AnimatedGradientDemo: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background px-20 sm:px-8 py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 w-full max-w-lg">
        {/* Top left card */}
        <div className="sm:col-span-8 h-32 sm:h-48">
          <BentoCard
            title="Animated Bento"
            subtitle="#001"
            description="Using only SVG circles and blur"
          />
        </div>
        {/* Top right card */}
        <div className="h-32 sm:h-48 sm:col-span-4">
          <BentoCard title="Gradients" buttonText="Explore More"  />
        </div>
      </div>
    </div>
  )
}

export default AnimatedGradientDemo

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/animated-gradient-with-svg.json"
```

### Manual

Add this hook for querying the dimensions of an element:

#### use-dimensions

```tsx
import { RefObject, useEffect, useState } from "react"

interface Dimensions {
  width: number
  height: number
}

export function useDimensions(
  ref: RefObject<HTMLElement | SVGElement>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [ref])

  return dimensions
}

```

Update your `globals.css` file to include the animation keyframes:

### globals.css

```css
  /* ... */
  @theme: {
    --animate-background-gradient: background-gradient;
    @keyframes: background-gradient {
      0%, 100% {
        transform: translate(0, 0);
        animationDelay: var(--background-gradient-delay, 0s);
      }
      20% {
        transform: translate(calc(100% * var(--tx-1, 1)), calc(100% * var(--ty-1, 1)));
      }
      40% {
        transform: translate(calc(100% * var(--tx-2, -1)), calc(100% * var(--ty-2, 1)));
      }
      60% {
        transform: translate(calc(100% * var(--tx-3, 1)), calc(100% * var(--ty-3, -1)));
      }
      80% {
        transform: translate(calc(100% * var(--tx-4, -1)), calc(100% * var(--ty-4, -1)));
      }     
    }
  },
};
```

Then, copy and paste the following code into your project:

#### animated-gradient-with-svg

```tsx
"use client"

import React, { useMemo, useRef } from "react"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-debounced-dimensions"

interface AnimatedGradientProps {
  colors: string[]
  speed?: number
  blur?: "light" | "medium" | "heavy"
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  speed = 5,
  blur = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)

  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  )

  const blurClass =
    blur === "light"
      ? "blur-2xl"
      : blur === "medium"
        ? "blur-3xl"
        : "blur-[100px]"

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn(`absolute inset-0`, blurClass)}>
        {colors.map((color, index) => {
          const animationProps = {
            animation: `background-gradient ${speed}s infinite ease-in-out`,
            animationDuration: `${speed}s`,
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 50}%`,
            "--tx-1": Math.random() - 0.5,
            "--ty-1": Math.random() - 0.5,
            "--tx-2": Math.random() - 0.5,
            "--ty-2": Math.random() - 0.5,
            "--tx-3": Math.random() - 0.5,
            "--ty-3": Math.random() - 0.5,
            "--tx-4": Math.random() - 0.5,
            "--ty-4": Math.random() - 0.5,
          } as React.CSSProperties

          return (
            <svg
              key={index}
              className={cn("absolute", "animate-background-gradient")}
              width={circleSize * randomInt(0.5, 1.5)}
              height={circleSize * randomInt(0.5, 1.5)}
              viewBox="0 0 100 100"
              style={animationProps}
            >
              <circle cx="50" cy="50" r="50" fill={color} />
            </svg>
          )
        })}
      </div>
    </div>
  )
}

export default AnimatedGradient

```

## Understanding the component

Animated gradients can be achieved with many different techniques (shaders, CSS gradients, etc.), this component uses simple SVG circles with a blur filter to create the effect.

1. For each color in the `colors` prop array, the component creates an SVG circle element
2. Each circle is given a random initial position using percentage values
3. The movement of each circle is controlled by 8 CSS variables that define target positions:
   - `--tx-1` and `--ty-1` for the first position
   - `--tx-2` and `--ty-2` for the second position
   - And so on for positions 3 and 4
4. These variables are set to random values between -0.5 and 0.5.

### Movement variables

```tsx
style={
  {
    //...
    "--tx-1": (Math.random() - 0.5),
    "--ty-1": (Math.random() - 0.5),
    "--tx-2": (Math.random() - 0.5),
    "--ty-2": (Math.random() - 0.5),
    "--tx-3": (Math.random() - 0.5),
    "--ty-3": (Math.random() - 0.5),
    "--tx-4": (Math.random() - 0.5),
    "--ty-4": (Math.random() - 0.5),
  } as React.CSSProperties
}
```

5. The `background-gradient` animation keyframes are used to animate the circles between these positions
6. Lastly, we blur the container element which holds the circles, to create a smooth effect.

If you would like to achieve a more complex animation, you have to edit the component directly, for example:

1. Add more keyframe positions by increasing the number of `--tx` and `--ty` variables
2. Use cubic-bezier timing functions to create non-linear movement
3. Add rotation or scaling transforms

and so on.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| colors* | `string[]` | - | Array of color strings to be used in the gradient |
| speed | `number` | `5` | Speed of the animation (this is somewhat an arbitrary number, refer tothe source code for more details) |
| blur | `"light" | "medium" | "heavy"` | `"light"` | Intensity of the blur effect |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/background/animated-gradient-svg).*