# Gooey Button

> Delete button with gooey close effect and confirm state.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Gooey Button Example](#gooey-button-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

See the interactive demo at: [goey-button](https://uwuui.com/docs/components/components/button/goey-button)

## Installation

{/* Coming soon */}

## Usage

### Gooey Button Example

```tsx
import GooeyButton from "@/components/goey-button";

export default function Example() {
  return <GooeyButton />
}
```

## Understanding the component

The button transitions from a primary "Delete" state to a "Confirm" state. A circular close button uses an SVG filter to apply a gooey effect when overlapping the main button.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| onDelete | `() => void` | - | Called when the confirm action is clicked. |
| onCancel | `() => void` | - | Called when the close action is clicked. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/goey-button).*