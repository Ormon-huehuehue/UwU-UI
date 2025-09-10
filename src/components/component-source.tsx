"use client"

import * as React from "react"

import { CodeSnippet } from "./code-snippet"
import { registry } from "@/fancy/index"

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
        // Map component names to their file paths
        const componentFilePaths: Record<string, string> = {
          "3d-button": "/components/3D-button.tsx",
          "arrow-button": "/components/arrow-pointer.tsx",
          "backup-button": "/components/backup-button.tsx",
          "chonky-button": "/components/chunky-button.tsx",
          "shiny-tooltip-button": "/components/Hover-2-seats.tsx"
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

  return <CodeSnippet title={name + ".tsx"} code={sourceCode} language="tsx" />
}
