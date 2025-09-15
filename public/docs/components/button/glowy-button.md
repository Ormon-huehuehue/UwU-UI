# Glowy Button

> A cool button with a glowy effect.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Glowy Button Example](#glowy-button-example)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

Example:

```tsx
import Link from 'next/link'
import { Mail, Github, Linkedin } from 'lucide-react'

interface GlowyButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
const GlowyCallButton = ({ 
  href,
  className = '',
  children,
  icon: Icon,
}: GlowyButtonProps) => {
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener"
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3
        bg-gradient-to-br from-orange-500 to-red-500
        border border-orange-600 rounded-2xl
        text-white font-medium text-sm
        shadow-lg hover:shadow-xl transition-all duration-200
        hover:scale-105 active:scale-95
        ${className}
      `}
      style={{
        boxShadow: `
        rgba(40, 40, 40, 0.72) 0px 0.6px 1.1px -1.25px,
        rgba(30, 30, 30, 0.635) 0px 2.3px 4.1px -2.5px,
        rgba(20, 20, 20, 0.25) 0px 10px 18px -3.75px,
        rgba(100, 100, 100, 0.5) 0px -0.7px 1px -0.8px inset,
        rgba(70, 70, 70, 0.5) 0px -2.7px 3.8px -1.7px inset,
        rgba(60, 60, 60, 0.5) 0px -12px 16.8px -2.5px inset,
        
        /* White glow that goes outside */
        rgba(255, 255, 255, 0.6) 0px 0px 15px,
        rgba(255, 255, 255, 0.4) 0px 0px 25px,
        rgba(255, 255, 255, 0.2) 0px 0px 35px,
        
        /* Inner white glow */
        rgba(255, 255, 255, 0.5) 0px 0px 10px inset,
        rgba(255, 255, 255, 0.3) 0px 0px 20px inset
        `
      }}
    >
      {Icon && Icon}
      <span>{children}</span>
    </Link>
  )
}

export default GlowyCallButton
```

## Installation

{/* Coming soon */}

## Usage

### Glowy Button Example

```tsx
import GlowyButton from "@/components/glowy-button";
import { Calendar } from "lucide-react";

export default function Example() {
  return <GlowyButton href="https://cal.com/sarthak-kapila/" icon={<Calendar/>}>
    Book a call
  </GlowyButton>
}
```

## Understanding the component

The button uses a gradient background and a shadow to create a glowy effect.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| key | `string` | `"Glowy Button"` | Visible label on the button. |
| href | `string` | `"https://cal.com/"` | Link to the button. |
| icon | `React.ReactNode` | `` | Icon to display inside the button. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/button/glowy-button).*