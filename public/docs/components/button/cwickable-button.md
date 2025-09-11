# Cwickable Button

> A chunky, pressable card-style button with subtle depth and inner light play.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Cwickable Button Example](#cwickable-button-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

See the interactive demo at: [cwickable-button](https://uwuui.com/docs/components/components/button/cwickable-button)

## Installation

{/* Coming soon */}

## Usage

### Cwickable Button Example

```tsx
import Cwickablebutton from "@/components/cwickable";

export default function Example() {
  return (
    <div className="p-6 bg-[#212121] rounded-3xl">
      <Cwickablebutton className="p-3">
        <img src="/favicon.ico" alt="icon" width={20} height={20} />
      </Cwickablebutton>
    </div>
  );
}
```

## Understanding the component

The button uses an outer container with a soft drop shadow and border. On press, the content shifts down slightly and the inner overlay swaps its top/bottom borders to simulate a sunken state. This creates a convincing tactile feel using only CSS and a small React state.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children | `React.ReactNode` | - | Content placed inside the button (icon, text, etc.). |
| className | `string` | - | Optional classes to control padding/size/appearance. |
| onClick | `() => void` | - | Click handler for the button. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/cwickable-button).*