"use client"

import Link from "next/link"
import { LayoutGroup, motion } from "motion/react"
import TextRotate from "@/fancy/components/text/text-rotate"

export function LandingHero() {
  return (
    <section className="w-full h-screen overflow-hidden md:overflow-visible flex flex-col items-center justify-center relative">


      <div className=" flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto">
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
        >
          <span>Make your </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <motion.span
                layout
                className="flex whitespace-pre"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                website{" "}
              </motion.span>

              <TextRotate
                texts={[
                  "✨ fwancy~", "fun~", "wuvwy ♥~", "weird~", "🪩 fwunky~", "sexy~", "🕶️ coow~", "gooo 🚀~", "🔥🔥🔥 fwee~", "🥺👉👈 uwu~", "pop ✨~", "wock 🤘~", "✨"
                ]}
                mainClassName="overflow-hidden pr-3 text-pink-400 py-0 pb-2 md:pb-4 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center font-overused-grotesk pt-4 sm:pt-8 md:pt-10 lg:pt-12"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
        </motion.p>

        <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20 lg:mt-20 text-xs">
          <motion.button
            className="w-28 sm:w-32 md:w-36 lg:w-40 sm:text-base md:text-lg lg:text-xl font-medium tracking-tight text-background bg-foreground px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-lg md:rounded-xl z-20 shadow-2xl whitespace-nowrap cursor-pointer"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
              scale: {
                duration: 0.2,
              },
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Link href="/docs/introduction">
              Check docs <span className="font-serif ml-1">→</span>
            </Link>
          </motion.button>
          <motion.button
            className="w-28 sm:w-32 md:w-36 lg:w-40 sm:text-base md:text-lg lg:text-xl font-medium tracking-tight text-white bg-pink-400 px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-lg md:rounded-xl z-20 shadow-2xl whitespace-nowrap cursor-pointer" 
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
              scale: {
                duration: 0.2,
              },
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Link href="https://github.com/weknowyourgame/UwU-ui">★ on GitHub</Link>
          </motion.button>
        </div>
      </div>
    </section>
  )
}
