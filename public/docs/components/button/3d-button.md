# 3D Button

> A glossy, pill-shaped 3D button with hover and press depth effects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [3D Button Example](#3d-button-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)

See the interactive demo at: [3d-button](https://uwuui.com/docs/components/components/button/3d-button)

## Installation

{/* Coming soon */}

## Usage

### 3D Button Example

```tsx
import Button3D from "@/components/3D-button";

export default function Example() {
  return (
    <Button3D 
      label="Get started" 
      link="/start" 
      width={234} 
      height={80}
    />
  );
}
```

## Understanding the component

The button simulates depth using layered gradients, inner shadows, and four decorative corner plates. Hover and press states adjust padding and shadows to create a convincing 3D movement.

## Credits

By Sarthak Kapila.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| label | `string` | `"Get started"` | Text displayed inside the button. |
| link | `string` | `"#"` | Optional link to wrap the button. Uses Next.js `Link` when not `#`. |
| height | `number` | `80` | Outer container height. |
| width | `number` | `234` | Outer container width. |
| className | `string` | - | Optional class name on the root container. |
| style | `React.CSSProperties` | - | Inline styles for the root container. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/3d-button).*