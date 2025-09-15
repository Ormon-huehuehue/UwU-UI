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
          const registryResponse = await fetch(`/r/${encodeURIComponent(name)}.json`)
          if (registryResponse.ok) {
            const registry = await registryResponse.json()
            const files: Array<{ path: string; content: string }> = registry.files || []
            const mainFile = files.find((f) => {
              const base = f.path.split("/").pop() || ""
              const fileNameWithoutExt = base.replace(/\.(tsx|ts)$/i, "")
              // More flexible matching - check if the name matches after normalizing case and hyphens
              const normalizedFileName = fileNameWithoutExt.toLowerCase().replace(/[-_]/g, '')
              const normalizedName = name.toLowerCase().replace(/[-_]/g, '')
              return normalizedFileName === normalizedName
            })
            if (mainFile?.content) {
              setSourceCode(mainFile.content)
              return
            } else if (files.length > 0 && files[0].content) {
              // Fallback to first file if no match found
              setSourceCode(files[0].content)
              return
            }
          }
        } catch (registryError) {
          console.error(`Registry fetch failed for ${name}:`, registryError)
        }

        console.error(`Could not resolve source for ${name} - registry file not found or empty`)
        setSourceCode("// Source code could not be loaded - registry file not found")
      } catch (error) {
        console.error(`Failed to load source for ${name}:`, error);
        setSourceCode("// Error loading source code");
      }
    }
    loadSourceCode();
  }, [name])

  return <CodeSnippet title={name + ".tsx"} code={sourceCode} language="tsx" />
}
