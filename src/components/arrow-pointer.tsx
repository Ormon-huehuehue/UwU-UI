'use client'

import React, { useEffect, useRef, useState, ReactElement, cloneElement } from 'react'
import { useInView } from 'framer-motion'

// Types and Enums
enum ArrowType {
  SOLID = "solid",
  DASHED = "dashed", 
  DOTTED = "dotted"
}

enum ArrowLineCap {
  SQUARE = "square",
  ROUND = "round"
}

interface ArrowConfig {
  thickness: number
  color: string
  type: ArrowType
  gapBetweenDashes: number
  lineCap: ArrowLineCap
  tipLength: number
  preview: boolean
}

interface ArrowPointsToCtaProps {
  button?: ReactElement
  buttonWidth?: "default" | "fill"
  arrow: ArrowConfig
  className?: string
  style?: React.CSSProperties
}

// Global mouse position tracking
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e: MouseEvent) => {
    ;(window as any).mouseX = e.clientX
    ;(window as any).mouseY = e.clientY
  })
}

// Component Message for when no button is connected
const ComponentMessage: React.FC<{
  title: string
  subtitle: string
  style?: React.CSSProperties
}> = ({ title, subtitle, style }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        ...style
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "600" }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.4" }}>
        {subtitle}
      </p>
    </div>
  )
}

// Default props
const defaultProps: ArrowPointsToCtaProps = {
  button: undefined,
  buttonWidth: "default",
  arrow: {
    thickness: 1,
    color: "rgb(153, 153, 153)",
    type: ArrowType.DASHED,
    gapBetweenDashes: 10,
    lineCap: ArrowLineCap.ROUND,
    tipLength: 10,
    preview: true
  }
}

// Helper functions
const parseFramerColor = (color: string) => {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)

  if (rgbaMatch) {
    const [_, r, g, b, a] = rgbaMatch
    return {
      rgbString: `rgba(${r}, ${g}, ${b}, ${a})`,
      rgbObject: { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) }
    }
  } else if (rgbMatch) {
    const [_, r, g, b] = rgbMatch
    return {
      rgbString: `rgba(${r}, ${g}, ${b}, 1)`,
      rgbObject: { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: 1 }
    }
  }

  console.warn("Could not parse color:", color)
  return {
    rgbString: "rgba(0, 0, 0, 1)",
    rgbObject: { r: 0, g: 0, b: 0, a: 1 }
  }
}

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop" | null>(null)

  useEffect(() => {
    const checkBreakpoint = () => {
      if (window.innerWidth <= 809) {
        setBreakpoint("mobile")
      } else if (window.innerWidth <= 1199) {
        setBreakpoint("tablet")
      } else {
        setBreakpoint("desktop")
      }
    }

    checkBreakpoint()
    window.addEventListener("resize", checkBreakpoint)
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}

const updateCanvas = ({ canvasRef, targetRef }: {
  canvasRef: React.RefObject<HTMLCanvasElement>
  targetRef: React.RefObject<HTMLDivElement>
}) => {
  if (!canvasRef || !targetRef || typeof window === "undefined") return

  const canvas = canvasRef.current
  const target = targetRef.current
  if (!canvas || !target) return

  const targetDimensions = target.getBoundingClientRect()
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight * 2 + targetDimensions.height
}

const drawPreviewArrow = ({ ctx, canvas, framerProps, rgbColor }: {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  framerProps: ArrowPointsToCtaProps
  rgbColor: ReturnType<typeof parseFramerColor>
}) => {
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - 50
  const startX = centerX
  const startY = centerY - 200

  ctx.strokeStyle = rgbColor.rgbString
  ctx.lineWidth = framerProps.arrow.thickness

  const lineDash = framerProps.arrow.type === "dashed" 
    ? [10 + framerProps.arrow.thickness, framerProps.arrow.gapBetweenDashes]
    : framerProps.arrow.type === "dotted"
    ? [framerProps.arrow.thickness, framerProps.arrow.gapBetweenDashes]
    : framerProps.arrow.type === "solid"
    ? []
    : [10, framerProps.arrow.gapBetweenDashes]

  ctx.beginPath()
  ctx.setLineDash(lineDash)
  ctx.moveTo(startX, startY)
  ctx.lineTo(centerX, centerY)
  ctx.stroke()

  const headLength = framerProps.arrow.tipLength
  const angle = Math.PI / 2

  ctx.lineCap = framerProps.arrow.lineCap
  ctx.beginPath()
  ctx.setLineDash([])
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(
    centerX - headLength * Math.cos(angle - Math.PI / 6),
    centerY - headLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(
    centerX - headLength * Math.cos(angle + Math.PI / 6),
    centerY - headLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()
}

const drawArrow = ({ ctx, target, canvas, mouseRef, currentOpacity, framerProps, rgbColor }: {
  ctx: CanvasRenderingContext2D
  target: HTMLDivElement
  canvas: HTMLCanvasElement
  mouseRef: React.MutableRefObject<{ x: number | null; y: number | null }>
  currentOpacity: number
  framerProps: ArrowPointsToCtaProps
  rgbColor: ReturnType<typeof parseFramerColor>
}) => {
  if (!ctx || !target || !canvas) return

  const { x: mouseX, y: mouseY } = mouseRef.current
  if (!mouseX || !mouseY) return

  const targetRect = target.getBoundingClientRect()

  if (mouseX >= targetRect.left && mouseX <= targetRect.right && 
      mouseY >= targetRect.top && mouseY <= targetRect.bottom) {
    return
  }

  const canvasRect = canvas.getBoundingClientRect()
  const x0 = mouseX - canvasRect.left
  const y0 = mouseY - canvasRect.top
  const cx = targetRect.left - canvasRect.left + targetRect.width / 2
  const cy = targetRect.top - canvasRect.top + targetRect.height / 2

  const a = Math.atan2(cy - y0, cx - x0)
  const x1 = cx - Math.cos(a) * (targetRect.width / 2 + 20)
  const y1 = cy - Math.sin(a) * (targetRect.height / 2 + 20)

  const midX = (x0 + x1) / 2
  const midY = (y0 + y1) / 2
  const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5)
  const t = Math.max(-1, Math.min(1, (y0 - y1) / 200))
  const controlX = midX
  const controlY = midY + offset * t

  const verticalDistance = mouseY < targetRect.top ? targetRect.top - mouseY :
    mouseY > targetRect.bottom ? mouseY - targetRect.bottom : 0
  const horizontalDistance = mouseX < targetRect.left ? targetRect.left - mouseX :
    mouseX > targetRect.right ? mouseX - targetRect.right : 0

  const distance = Math.max(verticalDistance, horizontalDistance)
  const minDistance = 100
  const maxDistance = 200
  const distanceOpacity = Math.min(0.75, Math.max(0, (distance - minDistance) / (maxDistance - minDistance)))
  const opacity = distanceOpacity * currentOpacity

  ctx.strokeStyle = `rgba(${rgbColor.rgbObject.r},${rgbColor.rgbObject.g},${rgbColor.rgbObject.b},${opacity})`
  ctx.lineWidth = framerProps.arrow.thickness

  const lineDash = framerProps.arrow.type === "dashed"
    ? [10 + framerProps.arrow.thickness, framerProps.arrow.gapBetweenDashes]
    : framerProps.arrow.type === "dotted"
    ? [framerProps.arrow.thickness, framerProps.arrow.gapBetweenDashes]
    : framerProps.arrow.type === "solid"
    ? []
    : [10, framerProps.arrow.gapBetweenDashes]

  ctx.lineCap = framerProps.arrow.lineCap
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x0, y0)

  const angle = Math.atan2(y1 - controlY, x1 - controlX)
  const headLength = framerProps.arrow.tipLength
  const gapSize = headLength * -0.3
  const lineEndX = x1 + gapSize * Math.cos(angle)
  const lineEndY = y1 + gapSize * Math.sin(angle)

  ctx.quadraticCurveTo(controlX, controlY, lineEndX, lineEndY)
  ctx.setLineDash(lineDash)
  ctx.stroke()
  ctx.restore()

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(
    x1 - headLength * Math.cos(angle - Math.PI / 6),
    y1 - headLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(x1, y1)
  ctx.lineTo(
    x1 - headLength * Math.cos(angle + Math.PI / 6),
    y1 - headLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()
}

const animate = ({ ctx, target, wrapperRef, canvas, mouseRef, animationFrameRef, targetInView, opacityRef, framerProps, rgbColor }: {
  ctx: CanvasRenderingContext2D
  target: HTMLDivElement
  wrapperRef: React.RefObject<HTMLDivElement>
  canvas: HTMLCanvasElement
  mouseRef: React.MutableRefObject<{ x: number | null; y: number | null }>
  animationFrameRef: React.MutableRefObject<number | null>
  targetInView: boolean
  opacityRef: React.MutableRefObject<number>
  framerProps: ArrowPointsToCtaProps
  rgbColor: ReturnType<typeof parseFramerColor>
}) => {
  if (!ctx || !canvas) return

  const targetOpacity = targetInView ? 1 : 0
  const opacityDiff = targetOpacity - opacityRef.current
  const duration = 100
  const step = 16

  if (Math.abs(opacityDiff) > 0.001) {
    const stepPercentage = step / duration
    const newOpacity = opacityRef.current + opacityDiff * stepPercentage

    if (targetInView) {
      opacityRef.current = Math.min(1, newOpacity)
    } else {
      opacityRef.current = Math.max(0, newOpacity)
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (opacityRef.current > 0) {
    drawArrow({ ctx, target, canvas, mouseRef, currentOpacity: opacityRef.current, framerProps, rgbColor })
  }

  if (Math.abs(opacityDiff) > 0.001 || (targetInView && opacityRef.current > 0)) {
    animationFrameRef.current = requestAnimationFrame(() =>
      animate({ ctx, target, wrapperRef, canvas, mouseRef, animationFrameRef, targetInView, opacityRef, framerProps, rgbColor })
    )
  }
}

const useMouseEvents = ({ isOnFramerCanvas, canvasRef, targetRef, wrapperRef, mouseRef, animationFrameRef, targetInView, framerProps, rgbColor }: {
  isOnFramerCanvas: boolean
  canvasRef: React.RefObject<HTMLCanvasElement>
  targetRef: React.RefObject<HTMLDivElement>
  wrapperRef: React.RefObject<HTMLDivElement>
  mouseRef: React.MutableRefObject<{ x: number | null; y: number | null }>
  animationFrameRef: React.MutableRefObject<number | null>
  targetInView: boolean
  framerProps: ArrowPointsToCtaProps
  rgbColor: ReturnType<typeof parseFramerColor>
}) => {
  const opacityRef = useRef(0)
  const lastTargetInView = useRef(targetInView)
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (isOnFramerCanvas || breakpoint === "mobile") return

    const canvas = canvasRef.current
    const target = targetRef.current
    if (!canvas || !target) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateMousePosition = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    let handleMouseMove: ((e: MouseEvent) => void) | null = null
    if (targetInView) {
      handleMouseMove = updateMousePosition
      window.addEventListener("mousemove", handleMouseMove)

      if (!lastTargetInView.current) {
        updateMousePosition({
          clientX: (window as any).mouseX || 0,
          clientY: (window as any).mouseY || 0
        } as MouseEvent)
      }
    }

    lastTargetInView.current = targetInView

    animate({ ctx, target, wrapperRef, canvas, mouseRef, animationFrameRef, targetInView, opacityRef, framerProps, rgbColor })

    return () => {
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isOnFramerCanvas, targetInView, breakpoint])
}

// Main component
export const ArrowPointsToCta: React.FC<ArrowPointsToCtaProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props }
  const isOnFramerCanvas = false // In Next.js, this is always false
  const haveNativeButton = mergedProps.button !== undefined

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const animationFrameRef = useRef<number | null>(null)

  const rgbColor = parseFramerColor(mergedProps.arrow.color)
  const targetInView = useInView(targetRef)

  useEffect(() => {
    updateCanvas({ canvasRef, targetRef })

    const debounce = (fn: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout
      return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
      }
    }

    const debouncedResize = debounce(() => {
      updateCanvas({ canvasRef, targetRef })
    }, 150)

    window.addEventListener("resize", debouncedResize)
    return () => window.removeEventListener("resize", debouncedResize)
  }, [haveNativeButton])

  useEffect(() => {
    if (isOnFramerCanvas && mergedProps.arrow.preview) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      drawPreviewArrow({ ctx, canvas, framerProps: mergedProps, rgbColor })
    }

    return () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [isOnFramerCanvas, mergedProps, rgbColor])

  useMouseEvents({
    isOnFramerCanvas,
    canvasRef,
    targetRef,
    wrapperRef,
    mouseRef,
    animationFrameRef,
    targetInView,
    framerProps: mergedProps,
    rgbColor
  })

  if (!haveNativeButton) {
    return (
      <div style={{ width: "100%", height: "100%", ...mergedProps.style }} className={mergedProps.className}>
        <ComponentMessage
          title="Arrow Points to CTA"
          subtitle="Set up the component by connecting button to the component or selecting the button from the component properties."
        />
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        ...mergedProps.style
      }}
      className={mergedProps.className}
    >
      <div
        ref={targetRef}
        style={{
          overflow: "visible",
          width: mergedProps.buttonWidth === "default" ? "fit-content" : "100%",
          display: "flex"
        }}
      >
        {React.Children.map(mergedProps.button, (child) => {
          if (React.isValidElement(child)) {
            return cloneElement(child, {
              style: {
                ...child.props.style,
                width: mergedProps.buttonWidth === "fill" ? "100%" : child.props.style?.width
              }
            } as any)
          }
          return child
        })}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 2147483647
        }}
      />
    </div>
  )
}

ArrowPointsToCta.displayName = "Arrow Points to CTA"

export default ArrowPointsToCta