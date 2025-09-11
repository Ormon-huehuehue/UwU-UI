# Stacking Cards

> A component used in websites to display layered cards that stack on top of one another, often with interactive animations.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [stacking-cards](#stacking-cards)
- [Usage](#usage)
  - [Stacking cards usage example](#stacking-cards-usage-example)
- [Understanding the component](#understanding-the-component)
- [Notes](#notes)
- [Props](#props)
  - [StackingCards](#stackingcards)
  - [StackingCardItem](#stackingcarditem)

Example:

```tsx
// author: Khoa Phan <https://www.pldkhoa.dev>

"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import StackingCards, {
  StackingCardItem,
} from "@/fancy/components/blocks/stacking-cards"

const cards = [
  {
    bgColor: "bg-[#f97316]",
    title: "The Guiding Light",
    description:
      "Lighthouses have stood as beacons of hope for centuries, guiding sailors safely through treacherous waters. Their glowing light and towering presence serve as a reminder of humanity’s connection to the sea.",
    image:
      "https://plus.unsplash.com/premium_vector-1739262161806-d954eb02427c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#0015ff]",
    title: "Life Beneath the Waves",
    description:
      "From shimmering schools of fish to solitary hunters, the ocean is home to an incredible variety of marine life. Each species plays a vital role in maintaining the balance of underwater ecosystems.",
    image:
      "https://plus.unsplash.com/premium_vector-1739200616200-69a138d91627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#ff5941]",
    title: "Alone on the Open Sea",
    description:
      "Drifting across the endless horizon, traveling alone on the sea is a test of courage and resilience. With nothing but the waves and the sky, solitude becomes both a challenge and a source of deep reflection.",
    image:
      "https://plus.unsplash.com/premium_vector-1738597190290-a3b571590b9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#1f464d]",
    title: "The Art of Sailing",
    description:
      "Harnessing the power of the wind, sailing is both a skill and an adventure. Whether racing across the waves or leisurely cruising, it’s a timeless way to explore the vast blue expanse.",
    image:
      "https://plus.unsplash.com/premium_vector-1738935247245-97940c74cced?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
  },
  {
    bgColor: "bg-[#0015ff]",
    title: "The Era of Whaling",
    description:
      "Once a thriving industry, whale hunting shaped economies and cultures across the world. Today, efforts to protect these majestic creatures highlight the shift toward conservation and respect for marine life.",
    image:
      "https://plus.unsplash.com/premium_vector-1738935247692-1c2f2c924fd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjJ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
  },
]

export default function StackingCardsDemo() {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  return (
    <div
      className="h-[620px] bg-white overflow-auto text-white"
      ref={(node) => setContainer(node)}
    >
      <StackingCards
        totalCards={cards.length}
        scrollOptons={{ container: { current: container } }}
      >
        <div className="relative font-calendas h-[620px] w-full z-10 text-2xl md:text-7xl font-bold uppercase flex justify-center items-center text-[#ff5941] whitespace-pre">
          Scroll down ↓
        </div>
        {cards.map(({ bgColor, description, image, title }, index) => {
          return (
            <StackingCardItem key={index} index={index} className="h-[620px]">
              <div
                className={cn(
                  bgColor,
                  "h-[80%] sm:h-[70%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-11/12 rounded-3xl mx-auto relative"
                )}
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-2xl mb-5">{title}</h3>
                  <p>{description}</p>
                </div>

                <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    className="object-cover"
                    fill
                  />
                </div>
              </div>
            </StackingCardItem>
          )
        })}

        <div className="w-full h-80 relative overflow-hidden">
          <h2 className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-[#ff5941] font-calendas">
            fancy
          </h2>
        </div>
      </StackingCards>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/stacking-cards.json"
```

### Manual

#### stacking-cards

```tsx
// author: Khoa Phan <https://www.pldkhoa.dev>

"use client"

import {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react"

import { cn } from "@/lib/utils"

interface StackingCardsProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  scrollOptons?: UseScrollOptions
  scaleMultiplier?: number
  totalCards: number
}

interface StackingCardItemProps
  extends HTMLAttributes<HTMLDivElement>,
    PropsWithChildren {
  index: number
  topPosition?: string
}

export default function StackingCards({
  children,
  className,
  scrollOptons,
  scaleMultiplier,
  totalCards,
  ...props
}: StackingCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    ...scrollOptons,
    target: targetRef,
  })

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}
    >
      <div className={cn(className)} ref={targetRef} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  )
}

const StackingCardItem = ({
  index,
  topPosition,
  className,
  children,
  ...props
}: StackingCardItemProps) => {
  const {
    progress,
    scaleMultiplier,
    totalCards = 0,
  } = useStackingCardsContext() // Get from Context
  const scaleTo = 1 - (totalCards - index) * (scaleMultiplier ?? 0.03)
  const rangeScale = [index * (1 / totalCards), 1]
  const scale = useTransform(progress, rangeScale, [1, scaleTo])
  const top = topPosition ?? `${5 + index * 3}%`

  return (
    <div className={cn("h-full sticky top-0", className)} {...props}>
      <motion.div
        className={"origin-top relative h-full"}
        style={{ top, scale }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const StackingCardsContext = createContext<{
  progress: MotionValue<number>
  scaleMultiplier?: number
  totalCards?: number
} | null>(null)

export const useStackingCardsContext = () => {
  const context = useContext(StackingCardsContext)
  if (!context)
    throw new Error("StackingCardItem must be used within StackingCards")
  return context
}

export { StackingCardItem }

```

## Usage

Wrap `StackingCards` around the content you want to animate and `StackingCardItem` around each card you want to animate.
The structure looks like this:

### Stacking cards usage example

```tsx
<StackingCards>
  <StackingCardItem>
      {/* Your card goes here */}
  </StackingCardItem>
</StackingCards>
```

## Understanding the component

The component utilizes scroll progress to determine the scale of each element. The first element has the highest scale multiplier, making it the smallest when it reaches the bottom of the container's scroll area, while the last element follows the opposite pattern, creating a layered effect.

To achieve this, I use each element's index to calculate its scale multiplier. Just simple as that! 😀

## Notes

- By default, this component uses the `window` to track scroll progress. However, in some cases, you may want to wrap it inside another scrollable container. To achieve this, simply define the container for `useScroll` from `motion`. In the `Demo` above, I defined the `containerRef` and passed it to the `scrollOptions` prop of the `StackingCards` component.

- To ensure `StackingCardItem` works correctly, you need to define its height. This allows the wrapper to have a larger height than the card itself, ensuring that the `topPosition` functions properly.

## Props

### StackingCards

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| totalCards* | `number` | `0` | Total number of cards to be animated (this is for calculating the scale intensity) |
| scaleMultiplier | `number` | `0.03` | The intensity of the card to scale |
| scrollOptons | `UseScrollOptions` | `{offset: ["start start", "end end"]}` | Scroll options for `useScroll` hook from `motion`. |
| className | `string` | - | `className` for the container |
| Other Props | - | - | All attributes for `HTMLDivElement` |

### StackingCardItem

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| index* | `number` | - | `index` value of your card (to calculate scale intensity) |
| topPosition | `string` | `5 + index * 3` | The top position of the card |
| className | `string` | - | `className` for the `StackingCardItem` element |
| Other Props | - | - | All attributes for `HTMLDivElement` |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/stacking-cards).*