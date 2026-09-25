export default function CustomersLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="h-14 bg-white rounded-lg border border-gray-200"></div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="h-6 bg-gray-100 rounded w-full"></div>
        <div className="h-6 bg-gray-100 rounded w-full"></div>
        <div className="h-6 bg-gray-100 rounded w-full"></div>
        <div className="h-6 bg-gray-100 rounded w-full"></div>
      </div>
    </div>
  )
}
