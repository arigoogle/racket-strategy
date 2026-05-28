import { usePWAInstall } from '@/hooks/usePWAInstall'

export function InstallButton() {
  const { installable, promptInstall } = usePWAInstall()
  if (!installable) return null
  return (
    <button
      onClick={() => promptInstall()}
      className="btn btn-primary text-xs"
      aria-label="Install Racket Strategy"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Install
    </button>
  )
}
