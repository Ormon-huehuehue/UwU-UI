"use client"

import * as React from "react"

import { CodeSnippet } from "./code-snippet"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function ComponentSource({
  name,
  children,
  className,
  ...props
}: ComponentSourceProps) {
  const [sourceCode, setSourceCode] = React.useState("")

  React.useEffect(() => {
    async function loadSourceCode() {
      try {
        // Try to load from registry first
        try {
          const registryResponse = await fetch(`/r/${encodeURIComponent(name)}.json`, { cache: "force-cache" })
          if (registryResponse.ok) {
            const registry = await registryResponse.json()
            const files: Array<{ path: string; content: string }> = registry.files || []
            const mainFile = files.find((f) => {
              const base = f.path.split("/").pop() || ""
              const fileNameWithoutExt = base.replace(/\.(tsx|ts)$/i, "")
              return fileNameWithoutExt.toLowerCase() === name.toLowerCase()
            })
            if (mainFile?.content) {
              setSourceCode(mainFile.content)
              return
            }
          }
        } catch (_) {
          // Registry fetch failed, continue to fallback
        }

        // Fallback to API source endpoint
        const componentFilePaths: Record<string, string> = {
          "3d-button": "/components/3D-button.tsx",
          "arrow-button": "/components/arrow-pointer.tsx",
          "backup-button": "/components/backup-button.tsx",
          "chonky-button": "/components/chunky-button.tsx",
          "shiny-tooltip-button": "/components/Hover-2-seats.tsx",
          "goey-button": "/components/goey-button.tsx",
          "mech-key": "/components/mech-key.tsx",
          "toggle-switch": "/components/toggle-switch.tsx",
          "cwickable-button": "/components/cwickable.tsx",
          "lego-button": "/components/lego-button.tsx",
          "shiny-card": "/components/shiny-card.tsx",
          "lumi-card": "/fancy/examples/card/lumi-card-demo.tsx",
        }

        const filePath = componentFilePaths[name]
        if (filePath) {
          const response = await fetch(`/api/source?file=${encodeURIComponent(filePath)}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch source code: ${response.statusText}`)
          }
          const { code } = await response.json()
          setSourceCode(code)
          return
        }

        console.error(`Could not resolve source for ${name}`)
        setSourceCode("")
      } catch (error) {
        console.error(`Failed to load source for ${name}:`, error);
        setSourceCode("");
      }
    }
    loadSourceCode();
  }, [name])

  return <CodeSnippet title={name + ".tsx"} code={sourceCode} language="tsx" />
}
