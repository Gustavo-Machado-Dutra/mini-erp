export default function AppointmentsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-72 bg-gray-100 rounded"></div>
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-100 rounded"></div>
      <div className="h-64 bg-white border border-gray-200 rounded-lg"></div>
    </div>
  )
}