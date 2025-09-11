# Mechanical Key

> A single mechanical keycap with press animation and sound.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Mechanical Key Example](#mechanical-key-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

See the interactive demo at: [mech-key](https://uwuui.com/docs/components/components/button/mech-key)

## Installation

{/* Coming soon */}

## Usage

### Mechanical Key Example

```tsx
import SingleKey from "@/components/mech-key";

export default function Example() {
  return <SingleKey keyLabel="⌘" keyValue="Meta" />
}
```

## Understanding the component

The component renders a 3D-styled key that can be pressed by mouse or keyboard. It plays a click sound and simulates down/up travel with CSS transforms.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| keyLabel | `string` | `"⌘"` | Visible label on the keycap. |
| keyValue | `string` | `"Meta"` | Keyboard key to listen to for press events. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/mech-key).*