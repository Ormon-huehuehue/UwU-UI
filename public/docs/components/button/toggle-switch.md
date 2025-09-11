# Toggle Switch

> A tactile on/off switch with indicator light and spring animation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Toggle Switch Example](#toggle-switch-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

See the interactive demo at: [toggle-switch](https://uwuui.com/docs/components/components/button/toggle-switch)

## Installation

{/* Coming soon */}

## Usage

### Toggle Switch Example

```tsx
import ToggleSwitch from "@/components/toggle-switch";

export default function Example() {
  return <ToggleSwitch defaultValue={false} />
}
```

## Understanding the component

The switch animates the thumb with a spring and updates a small indicator light. Transitions are tuned for a crisp, tactile feel.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| defaultValue | `boolean` | `false` | Initial on/off state. |
| onChange | `(value: boolean) => void` | - | Called when the value changes. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/toggle-switch).*