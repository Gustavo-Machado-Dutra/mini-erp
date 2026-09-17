export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="font-bold text-lg">RevenueFlow</div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}