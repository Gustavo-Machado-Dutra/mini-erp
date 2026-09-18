export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {children}
    </header>
  )
}