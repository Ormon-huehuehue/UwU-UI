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
        // Map component names to their file paths
        const componentFilePaths: Record<string, string> = {
          "3d-button": "/components/3D-button.tsx",
          "arrow-button": "/components/arrow-pointer.tsx",
          "backup-button": "/components/backup-button.tsx",
          "chonky-button": "/components/chunky-button.tsx",
          "shiny-tooltip-button": "/components/Hover-2-seats.tsx",
          "goey-button": "/components/goey-button.tsx",
          "mech-key": "/components/mech-key.tsx",
          "toggle-switch": "/components/toggle-switch.tsx"
        };
        
        // Get the file path for the component
        const filePath = componentFilePaths[name];
        
        if (!filePath) {
          console.error(`Could not find file path for ${name}`);
          setSourceCode("");
          return;
        }
        
        // Fetch the component source code
        const response = await fetch(`/api/source?file=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch source code: ${response.statusText}`);
        }
        
        const { code } = await response.json();
        setSourceCode(code);
      } catch (error) {
        console.error(`Failed to load source for ${name}:`, error);
        setSourceCode("");
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
