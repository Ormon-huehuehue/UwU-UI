# Lumi Card

> A lumi card with a lumi effect.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Lumi Card Example](#lumi-card-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Props](#props)

See the interactive demo at: [lumi-card](https://uwuui.com/docs/components/components/card/lumi-card)

## Installation

{/* Coming soon */}

## Usage

### Lumi Card Example

```tsx
import LumiCard from "@/components/lumi-card";

export default function Example() {
  return (
    <LumiCard
          title={"UwU UI"}
          subtitle={"Cool UI components"}
          footerLabel={"github"}
          imageUrl={"https://framerusercontent.com/images/OIHZCKGdnHNaGppookHuHF0eKA4.png"}
        />
  )
}
```

## Understanding the component

The card uses a subtle elevation shadow that collapses on press, creating a tactile feel. Motion is powered by a spring animation for a responsive interaction.

## Credits

By Sarthak Kapila.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| title | `string` | - | Title of the card. |
| subtitle | `string` | - | Subtitle of the card. |
| footerLabel | `string` | - | Footer label of the card. |
| imageUrl | `string` | - | Image URL of the card. |
| videoUrl | `string` | - | Video URL of the card. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/card/lumi-card).*