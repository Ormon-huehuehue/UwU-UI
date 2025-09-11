# Arrow Points to CTA

> Animated canvas arrow that guides the user’s cursor toward a target CTA button.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Arrow Points to CTA Example](#arrow-points-to-cta-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)
  - [ArrowPointsToCta](#arrowpointstocta)
  - [arrow (config)](#arrow-config)

See the interactive demo at: [arrow-button](https://uwuui.com/docs/components/components/button/arrow-button)

## Installation

{/* Coming soon */}

## Usage

### Arrow Points to CTA Example

```tsx
import ArrowPointsToCta from "@/components/arrow-pointer";
import ButtonBlack from "@/components/chunky-button";

export default function Example() {
  return (
    <ArrowPointsToCta
      button={<ButtonBlack title="Buy now" />}
      buttonWidth="default"
      arrow={{
        thickness: 2,
        color: "rgb(255, 0, 0)",
        type: "dashed",
        gapBetweenDashes: 15,
        lineCap: "round",
        tipLength: 12,
        preview: false
      }}
    />
  );
}
```

## Understanding the component

The component renders a full-screen canvas and draws a curved arrow from the current mouse position toward the provided CTA element. Visibility and opacity are driven by whether the CTA is in view and how far the cursor is from the target. The stroke style, tip, and dash patterns are configurable.

## Credits

By Sarthak Kapila.

## Props

### ArrowPointsToCta

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| button | `ReactElement` | - | The CTA element to point at. Required for runtime usage. |
| buttonWidth | `"default" | "fill"` | `"default"` | Keep intrinsic button width or stretch to fill container. |
| className | `string` | - | Optional class name on the wrapper. |
| style | `React.CSSProperties` | - | Inline styles for the wrapper. |

### arrow (config)

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| thickness | `number` | `1` | Stroke width in pixels. |
| color | `string` | `"rgb(153, 153, 153)"` | Stroke color (supports `rgb(...)` and `rgba(...)`). |
| type | `"solid" | "dashed" | "dotted"` | `"dashed"` | Line dash style. |
| gapBetweenDashes | `number` | `10` | Gap size for dashed/dotted line. |
| lineCap | `"square" | "round"` | `"round"` | Stroke line cap for the arrow head lines. |
| tipLength | `number` | `10` | Length of the arrow head in pixels. |
| preview | `boolean` | `true` | Preview arrow when designing on canvas (not used in Next.js). |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/arrow-button).*