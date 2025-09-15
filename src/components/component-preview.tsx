"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { customRegistry } from "@/fancy/custom-registry"

import { CodeSnippet } from "./code-snippet"
import { RestartButton } from "./restart-button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  extractClassname?: boolean
  extractedClassNames?: string
  align?: "center" | "start" | "end"
  framerLink?: string
  description?: string
}

export function ComponentPreview({
  name,
  children,
  className,
  framerLink,
  extractClassname,
  extractedClassNames,
  align = "center",
  description,
  ...props
}: ComponentPreviewProps) {
  const [sourceCode, setSourceCode] = React.useState("")
  const [previewKey, setPreviewKey] = React.useState(0)
  const [showRestartButton, setShowRestartButton] = React.useState(true)

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

  const handleRestart = React.useCallback(() => {
    setPreviewKey((prev) => prev + 1)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") {
        handleRestart()
      }
      // Toggle restart button visibility with Cmd+D
      if ((event.metaKey || event.ctrlKey) && event.key === "1") {
        event.preventDefault()
        setShowRestartButton((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleRestart])

  const Preview = React.useMemo(() => {
    const entry = (customRegistry as Record<string, { component: React.ComponentType<any> }>) [name]
    const Component = entry?.component

    if (!Component) {
      return (
        <p
          data-algolia-ignore
          className="text text-muted-foreground justify-center items-center flex w-full h-full whitespace-pre"
        >
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm whitespace-pre">
            {name}
          </code>{" "}
          not found.
        </p>
      )
    }

    // Render the component with default props
    return (
      <div className="flex items-center justify-center p-10">
        <Component />
      </div>
    )
  }, [name])

  return (
    <div
      data-algolia-ignore
      className={cn(
        "group relative flex flex-col h-full w-full ",
        className
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between">
          <TabsList className="w-full justify-start rounded-none p-0 h-9 bg-transparent space-x-3 px-3">
            <TabsTrigger
              value="preview"
              className="relative text-base rounded-none border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-colors duration-300 ease-out hover:text-foreground data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Demo
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative text-base rounded-none border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-colors duration-300 ease-out hover:text-foreground data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="preview"
          className="border border-black-500 flex rounded-2xl"
        >
          <div className="w-full flex items-center justify-center rounded-2xl min-h-[530px] overflow-hidden relative max-h-[530px]">
            {/* <div className="absolute top-4 right-4 rounded-full border">

            </div> */}
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              }
            >
              {showRestartButton && (
                <div className="absolute right-4 top-4 z-50 flex gap-2 flex-row">
                  <RestartButton onRestart={handleRestart} />
                </div>
              )}
              <React.Fragment key={previewKey}>{Preview}</React.Fragment>
            </React.Suspense>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeSnippet
            title={name + ".tsx"}
            code={sourceCode}
            language="tsx"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
