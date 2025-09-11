# Shiny Card

> A shiny card with a shiny effect.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Shiny Card Example](#shiny-card-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)

See the interactive demo at: [shiny-card](https://uwuui.com/docs/components/components/card/shiny-card)

## Installation

{/* Coming soon */}

## Usage

### Shiny Card Example

```tsx
import ShinyCard from "@/components/shiny-card";

export default function Example() {
  return <ShinyCard />;
}
```

## Understanding the component

The card uses a subtle elevation shadow that collapses on press, creating a tactile feel. Motion is powered by a spring animation for a responsive interaction.

## Credits

By Sarthak Kapila.

## Props

| Prop | Type | Default |
|----------|----------|----------|
| variant | `string` | `"assets"` | Variant of the card. |
| className | `string` | - | Optional class name on the root container. |
| style | `React.CSSProperties` | - | Inline styles for the root container. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/card/shiny-card).*