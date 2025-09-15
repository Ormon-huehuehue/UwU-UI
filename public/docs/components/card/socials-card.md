# Socials Card

> A card with social media icons.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Socials Card Example](#socials-card-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)

Example:

```tsx
import Link from 'next/link';
import React from 'react';

const SocialsCard = () => {
  return (
    <div>
      <svg width={0} height={0}>
        <defs>
          <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
          </clipPath>
        </defs>
      </svg>
      <div className="relative">
        <div className="relative flex items-end gap-x-2 p-2">
          <div className="relative">
            [](https://github.com/weknowyourgame)
          </div>
          <div className="relative">
            [](https://x.com/0xsarthakk)
          </div>
          <div className="relative">
            [](https://linkedin.com/in/sarthakkapila)
          </div>
          <div className="relative">
            [](https://www.youtube.com/@sarthakkapila)
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialsCard;
```

## Installation

{/* Coming soon */}

## Usage

### Socials Card Example

```tsx
import SocialsCard from "@/components/socials-card";

export default function Example() {
  return <SocialsCard />;
}
```

## Understanding the component

The card uses a subtle elevation shadow that collapses on press, creating a tactile feel. Motion is powered by a spring animation for a responsive interaction.

## Credits

By Sarthak Kapila.

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/card/socials-card).*