export default function PageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div>
              <div className="w-20 sm:w-24 h-4 sm:h-5 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-32 sm:w-40 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 sm:p-6">
          <div className="space-y-6">
            <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-24 sm:w-32 h-3 bg-gray-200 rounded animate-pulse" />

            <div className="space-y-4 mt-8">
              <div className="w-20 sm:w-24 h-4 bg-gray-200 rounded animate-pulse" />

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="w-24 sm:w-32 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>

            <div className="w-full h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse mt-6" />
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <div className="w-36 sm:w-48 h-6 sm:h-8 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 rounded animate-pulse" />
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-48 sm:w-64 h-3 sm:h-4 bg-gray-200 rounded animate-pulse mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="w-24 sm:w-32 h-4 sm:h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="w-20 sm:w-28 h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />

                <div className="flex items-center justify-between pt-2">
                  <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-10 sm:w-12 h-4 sm:h-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
