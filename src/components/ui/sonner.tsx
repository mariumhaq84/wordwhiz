
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50 group-[.toaster]:to-amber-100 group-[.toaster]:text-amber-800 group-[.toaster]:border-amber-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-amber-700",
          actionButton:
            "group-[.toast]:bg-amber-500 group-[.toast]:text-white group-[.toast]:rounded-full",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:text-amber-600 group-[.toast]:rounded-full",
          error: 
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-pink-50 group-[.toaster]:to-pink-100 group-[.toaster]:text-pink-800 group-[.toaster]:border-pink-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
