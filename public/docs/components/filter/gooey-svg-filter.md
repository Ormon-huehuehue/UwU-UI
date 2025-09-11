# Gooey SVG Filter

> An svg filter component that creates a gooey effect on the background. Can be used to create fluid interfaces or rounded-at-all-corners panels. Limited support for Safari.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [gooey-svg-filter](#gooey-svg-filter)
- [Usage](#usage)
  - [Goeey SVG Filter Example](#goeey-svg-filter-example)
- [Understanding the component](#understanding-the-component)
- [Examples](#examples)
  - [Fluid interface](#fluid-interface)
  - [Rounded corners](#rounded-corners)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import useDetectBrowser from "@/hooks/use-detect-browser"
import useScreenSize from "@/hooks/use-screen-size"
import { Button } from "@/components/ui/button"
import GooeySvgFilter from "@/fancy/components/filter/gooey-svg-filter"

const TAB_CONTENT = [
  {
    title: "2024",
    files: [
      "learning-to-meditate.md",
      "spring-garden-plans.md",
      "travel-wishlist.md",
      "new-coding-projects.md",
    ],
  },
  {
    title: "2023",
    files: [
      "year-in-review.md",
      "marathon-training-log.md",
      "recipe-collection.md",
      "book-reflections.md",
    ],
  },
  {
    title: "2022",
    files: [
      "moving-to-a-new-city.md",
      "starting-a-blog.md",
      "photography-basics.md",
      "first-coding-project.md",
    ],
  },
  {
    title: "2021",
    files: [
      "goals-and-aspirations.md",
      "daily-gratitude.md",
      "learning-to-cook.md",
      "remote-work-journal.md",
    ],
  },
]

export default function GooeyDemo() {
  const [activeTab, setActiveTab] = useState(0)
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(true)
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

  return (
    <div className="relative w-dvw h-dvh flex justify-center p-8 font-calendas md:text-base text-xs sm:text-sm bg-white dark:bg-black">
      <GooeySvgFilter
        id="gooey-filter"
        strength={screenSize.lessThan("md") ? 8 : 15}
      />

      <Button
        variant="outline"
        onClick={() => setIsGooeyEnabled(!isGooeyEnabled)}
        className="absolute top-4 left-4 font-overused-grotesk"
      >
        {isGooeyEnabled ? "Disable filter" : "Enable filter"}
      </Button>

      <div className="w-11/12 md:w-4/5 relative mt-24">
        <div
          className="absolute inset-0"
          style={{ filter: isGooeyEnabled ? "url(#gooey-filter)" : "none" }}
        >
          <div className="flex w-full ">
            {TAB_CONTENT.map((_, index) => (
              <div key={index} className="relative flex-1 h-8 md:h-12">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-[#efefef]"
                    transition={{
                      type: "spring",
                      bounce: 0.0,
                      duration: isSafari ? 0 : 0.4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Content panel */}
          <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-[#efefef] overflow-hidden text-muted-foreground">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 50,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="p-8 md:p-12"
              >
                <div className="space-y-2 mt-4 sm:mt-8 md:mt-8">
                  <ul className="">
                    {TAB_CONTENT[activeTab].files.map((file, index) => (
                      <li
                        key={file}
                        className="border-b border-muted-foreground/50 pt-2 pb-1 text-black"
                      >
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive text overlay, no filter */}
        <div className="relative flex w-full ">
          {TAB_CONTENT.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className="flex-1 h-8 md:h-12"
            >
              <span
                className={`
                w-full h-full flex items-center justify-center
                ${activeTab === index ? "text-black" : "text-muted-foreground"}
              `}
              >
                {tab.title}
              </span>
            </button>
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
shadcn@latest add "https://uwuui.com/r/gooey-svg-filter.json"
```

### Manual

#### gooey-svg-filter

```tsx
const GooeySvgFilter = ({
  id = "gooey-filter",
  strength = 10,
}: {
  id?: string
  strength?: number
}) => {
  return (
    <svg className="hidden absolute">
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur-sm"
          />
          <feColorMatrix
            in="blur-sm"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

export default GooeySvgFilter

```

## Usage

Add the `GooeySvgFilter` component to your project, pass an `id` prop to the component (optional), then use the same `id` prop in the `filter` CSS property of the container you want to apply the filter to. High-level example:

### Goeey SVG Filter Example

```tsx
<GooeySvgFilter id="gooey-filter" />
<div style={{ filter: "url(#gooey-filter)" }}>
 filter will be applied here
</div>
```

## Understanding the component

The filter is surprisingly simple. First, we apply a blur, which makes closer element to 'bleed' or blur into each other. Then, we just increase the contrast of our alpha channel with a color matrix. Lastly, we composite these two layers together with an `atop` operator, which will mask out anything outside the filter.  

Please refer to [this article](https://css-tricks.com/gooey-effect/) by [Lucas Bebber](https://lbebber.github.io/public/) for more details. The entire component is derived from this work, and Lucas does a much better job explaining the filter than I do:).

## Examples

### Fluid interface

Example:

```tsx
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Home, Mail, Menu, Settings, User, X } from "lucide-react"

import useDetectBrowser from "@/hooks/use-detect-browser"
import GooeySvgFilter from "@/fancy/components/filter/gooey-svg-filter"

const MENU_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: Mail, label: "Contact" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
]

export default function GooeyDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const browser = useDetectBrowser()
  const isSafari = browser === "Safari"

  return (
    <div className="relative w-dvw h-dvh flex items-center justify-center dark:bg-black bg-white">
      <GooeySvgFilter id="gooey-filter-menu" strength={5} />

      <div
        className="absolute top-4 left-4"
        style={{ filter: "url(#gooey-filter-menu)" }}
      >
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen &&
            MENU_ITEMS.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.label}
                  className="absolute w-12 h-12 bg-[#efefef] rounded-full flex items-center justify-center"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    y: (index + 1) * 44,
                    opacity: 1,
                  }}
                  exit={{
                    y: 0,
                    opacity: 0,
                    transition: {
                      delay:
                        (MENU_ITEMS.length - index) * (isSafari ? 0.0 : 0.05),
                      duration: isSafari ? 0 : 0.4,
                      type: "spring",
                      bounce: 0,
                    },
                  }}
                  transition={{
                    delay: index * (isSafari ? 0.0 : 0.05),
                    duration: isSafari ? 0 : 0.4,
                    type: "spring",
                    bounce: 0,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{
                        delay: index * (isSafari ? 0.0 : 0.05),
                        duration: isSafari ? 0 : 0.2,
                        type: "spring",
                        bounce: 0,
                      }}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground hover:text-black" />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )
            })}
        </AnimatePresence>

        {/* Main Menu Button */}
        <motion.button
          className="relative w-12 h-12 bg-[#efefef] rounded-full flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: isSafari ? 0 : 0.2 }}
              >
                <X className="w-5 h-5 text-black" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: isSafari ? 0 : 0.2 }}
              >
                <Menu className="w-5 h-5 text-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p>Open the menu in the top left corner</p>
    </div>
  )
}

```

### Rounded corners

The following example combines the [PixelTrail](/docs/components/background/pixel-trail) component with this svg filter to create a rounded-at-all-corners effect. Unfortunately, the component doesn't support Safari, so you'll need to create a fallback for that.

Example:

```tsx
import useDetectBrowser from "@/hooks/use-detect-browser"
import useScreenSize from "@/hooks/use-screen-size"
import PixelTrail from "@/fancy/components/background/pixel-trail"
import GooeySvgFilter from "@/fancy/components/filter/gooey-svg-filter"

export default function GooeyDemo() {
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

  return (
    <div className="relative w-dvw h-dvh flex flex-col items-center justify-center gap-8 bg-black text-center text-pretty">
      <img
        src="https://images.aiscribbles.com/34fe5695dbc942628e3cad9744e8ae13.png?v=60d084"
        alt="impressionist painting"
        className="w-full h-full object-cover absolute inset-0 opacity-70"
      />

      <GooeySvgFilter id="gooey-filter-pixel-trail" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? "none" : "url(#gooey-filter-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-white"
        />
      </div>

      <p className="text-white text-4xl sm:text-5xl md:text-7xl z-10 font-calendas w-1/2 font-bold">
        Speaking things into existence
        <span className="font-overused-grotesk"></span>
      </p>
    </div>
  )
}

```

## Notes

- Safari support for SVG filters is still very limited, so make sure to check compatibility, and create fallbacks (in the demos above, you can also see that the motion is disabled for Safari). For a fully supported solution, your best bet is to create a shader instead. Let us know if you would like to see a component for that!
- Keep a large enough space for the filter to avoid clipping.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| id | `string` | - | The id of the filter |
| strength | `number` | `15` | The strength of the gooey effect |

  ## Credits

  The component is derived from [this article](https://css-tricks.com/gooey-effect/) by [Lucas Bebber](https://lbebber.github.io/public/).

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/filter/gooey-svg-filter).*