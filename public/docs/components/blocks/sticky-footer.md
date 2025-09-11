# Sticky Footer

> A demo showcasing a footer that sticks to the bottom of the page.

## Table of Contents

- [How to](#how-to)
- [Notes](#notes)

Example:

```tsx
import React from "react"

const Preview: React.FC = () => {
  return (
    <div className="w-full bg-[#efefef] items-center justify-center h-full overflow-auto">
      {/* add relative positioning to the main conent */}
      <div className="relative w-dvw h-dvh z-10 text-2xl md:text-7xl font-bold uppercase flex justify-center items-center bg-[#ff5941] text-white whitespace-pre">
        Scroll down ↓
      </div>

      {/* Sticky footer. The only important thing here is the z-index, the sticky position and the bottom value */}
      <div className="sticky z-0 bottom-0 left-0 w-full h-80 bg-white flex justify-center items-center">
        <div className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12 text-[#ff5941]">
          <div className="flex flex-row space-x-12 sm:pace-x-16  md:space-x-24 text-sm sm:text-lg md:text-xl">
            <ul>
              <li className="hover:underline cursor-pointer">Home</li>
              <li className="hover:underline cursor-pointer">Docs</li>
              <li className="hover:underline cursor-pointer">Comps</li>
            </ul>
            <ul>
              <li className="hover:underline cursor-pointer">Github</li>
              <li className="hover:underline cursor-pointer">Instagram</li>
              <li className="hover:underline cursor-pointer">X (Twitter)</li>
            </ul>
          </div>
          <h2 className="absolute bottom-0 left-0  translate-y-1/3 sm:text-[192px]  text-[80px] text-[#ff5941] font-calendas">
            fancy
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Preview

```

## How to

This page doesn't contain a component, as achieving a sticky footer doesn't require any complex logic abstracted into a component. Some tutorials tend to overcomplicate this, but for most cases, it's enough to add a few Tailwind classes to our elements, which you can find in this demo.

You need two things to make this work:

- A main element that will sit on top of the footer
- A footer element that will be behind the main element

1. Usually, you want the main element to be **at least** `h-[100vh]` (or `h-[100%]` if you use it inside a container, like in the demo above), so that it fully hides the footer by default
2. You also need to set the position to `relative`, so the z-index will work correctly
3. Then, set the footer element's position to `sticky` and make it stick to the bottom with `bottom-0`
4. Finally, make sure that the main element has a higher z-index than the footer element so it always sits on top of the footer

That's it! Can you believe that?

## Notes

The main drawback to be aware of is that the footer element will always be behind the main content in the viewport. This can occasionally interfere with pointer events and components that rely on z-index stacking. However, in my experience this approach works well for most common use cases.

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/sticky-footer).*