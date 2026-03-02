import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Icon } from "@mint/ui/components/ui/icon"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Icon icon={CheckmarkCircle02Icon} className="size-4" />
        ),
        info: (
          <Icon icon={InformationCircleIcon} className="size-4" />
        ),
        warning: (
          <Icon icon={Alert02Icon} className="size-4" />
        ),
        error: (
          <Icon icon={MultiplicationSignCircleIcon} className="size-4" />
        ),
        loading: (
          <Icon icon={Loading03Icon} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { toast } from "sonner"
export { Toaster }
