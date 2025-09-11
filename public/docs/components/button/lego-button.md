# Lego Button

> A Lego-styled button with a springy press effect.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Lego Button Example](#lego-button-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)

See the interactive demo at: [lego-button](https://uwuui.com/docs/components/components/button/lego-button)

## Installation

{/* Coming soon */}

## Usage

### Lego Button Example

```tsx
import LegoElements from "@/components/lego-button";

export default function Example() {
  return (
    <>
      <LegoElements 
        variant="A"
        onVariantChange={(variant) => console.log('Variant changed:', variant)}
      />
      <LegoElements 
        variant="B"
        onVariantChange={(variant) => console.log('Variant changed:', variant)}
      />
      <LegoElements 
        variant="C"
        label="Get Started"
        link="/signup"
        newTab={true}
      />
    </>
  );
}
```

## Understanding the component

The button uses a subtle elevation shadow that collapses on press, creating a tactile feel. Motion is powered by a spring animation for a responsive interaction.

## Credits

By Sarthak Kapila.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| label | `string` | `"Get started"` | Text displayed inside the button. |
| text | `string` | `"Get started"` | Text displayed inside the button. |
| link | `string` | `"#"` | Optional link to wrap the button (Next.js `Link`). |
| width | `number` | `144` | Button width in pixels. |
| newTab | `boolean` | `false` | Open link in new tab. |
| smoothScroll | `boolean` | `false` | Smooth scroll to link. |
| height | `number` | `56` | Button height in pixels. |
| className | `string` | - | Optional class name on the root container. |
| style | `React.CSSProperties` | - | Inline styles for the root container. |
| layoutId | `string` | - | Optional layout id for the root container. |
| onVariantChange | `(variant: string) => void` | - | Callback function when the variant changes. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/lego-button).*