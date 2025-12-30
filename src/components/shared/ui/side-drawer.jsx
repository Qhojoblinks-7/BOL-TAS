import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/utils"

const SideDrawer = ({
  shouldScaleBackground = true,
  ...props
}) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
SideDrawer.displayName = "SideDrawer"

const SideDrawerTrigger = DrawerPrimitive.Trigger

const SideDrawerPortal = DrawerPrimitive.Portal

const SideDrawerClose = DrawerPrimitive.Close

const SideDrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props} />
))
SideDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const SideDrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SideDrawerPortal>
    <SideDrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full w-80 flex flex-col border-r bg-background",
        className
      )}
      {...props}>
      {children}
    </DrawerPrimitive.Content>
  </SideDrawerPortal>
))
SideDrawerContent.displayName = "SideDrawerContent"

const SideDrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-1.5 p-4 text-left", className)}
    {...props} />
)
SideDrawerHeader.displayName = "SideDrawerHeader"

const SideDrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
SideDrawerFooter.displayName = "SideDrawerFooter"

const SideDrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
SideDrawerTitle.displayName = DrawerPrimitive.Title.displayName

const SideDrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
SideDrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  SideDrawer,
  SideDrawerPortal,
  SideDrawerOverlay,
  SideDrawerTrigger,
  SideDrawerClose,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerFooter,
  SideDrawerTitle,
  SideDrawerDescription,
}