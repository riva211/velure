"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-dark-coffee-950 group-[.toaster]:border-parchment-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-dark-coffee-950 dark:group-[.toaster]:text-parchment-50 dark:group-[.toaster]:border-dark-coffee-800",
          description: "group-[.toast]:text-dim-grey-600 dark:group-[.toast]:text-dim-grey-400",
          actionButton:
            "group-[.toast]:bg-seashell-600 group-[.toast]:text-parchment-50 dark:group-[.toast]:bg-seashell-700 dark:group-[.toast]:text-parchment-50",
          cancelButton:
            "group-[.toast]:bg-parchment-100 group-[.toast]:text-dim-grey-600 dark:group-[.toast]:bg-dark-coffee-800 dark:group-[.toast]:text-dim-grey-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
