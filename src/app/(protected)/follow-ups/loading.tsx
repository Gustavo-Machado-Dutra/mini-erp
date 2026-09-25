export default function FollowUpsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-72 bg-gray-100 rounded"></div>
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded"></div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <div className="h-8 w-24 bg-gray-100 rounded"></div>
        <div className="h-8 w-28 bg-gray-100 rounded"></div>
        <div className="h-8 w-24 bg-gray-100 rounded"></div>
        <div className="h-8 w-28 bg-gray-100 rounded"></div>
        <div className="h-8 w-20 bg-gray-100 rounded"></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="h-12 w-full bg-gray-100 rounded"></div>
        <div className="h-12 w-full bg-gray-100 rounded"></div>
        <div className="h-12 w-full bg-gray-100 rounded"></div>
        <div className="h-12 w-full bg-gray-100 rounded"></div>
      </div>
    </div>
  )
}