# Shiny Tooltip Button

> A compact button with a moving shimmer highlight on hover and a clean content plate.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Shiny Tooltip Button Example](#shiny-tooltip-button-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)

See the interactive demo at: [shiny-tooltip-button](https://uwuui.com/docs/components/components/button/shiny-tooptip-button)

## Installation

{/* Coming soon */}

## Usage

### Shiny Tooltip Button Example

```tsx
import ShinyButton from "@/components/Hover-2-seats";

export default function Example() {
  return (
    <ShinyButton 
      title="Buy now" 
      link="#"
      width={117}
      height={44}
    />
  );
}
```

## Understanding the component

The button renders a background shimmer layer that slides up and fades in on hover, revealing a bright highlight above the content plate. The shimmer text is rendered by an internal `TextShimmer` component.

## Credits

By Sarthak Kapila.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| title | `string` | `"Buy now"` | Text displayed inside the button. |
| link | `string` | `"#"` | Optional link to wrap the button (Next.js `Link`). |
| className | `string` | - | Optional class name on the root container. |
| style | `React.CSSProperties` | - | Inline styles for the root container. |
| width | `number` | `117` | Outer width of the button. |
| height | `number` | `44` | Outer height of the button. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/shiny-tooptip-button).*