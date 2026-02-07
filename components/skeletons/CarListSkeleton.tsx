import { Skeleton } from "@/components/ui/skeleton"

export function CarCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-4/3 bg-gray-100 dark:bg-gray-800">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
             <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 pt-4 mb-2 flex-1 space-y-3">
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded-md mt-4" />
      </div>

      {/* Footer Skeleton */}
      <div className="mt-auto bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between items-end">
        <div>
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col items-end">
             <Skeleton className="h-3 w-10 mb-1" />
             <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function CarListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <CarCardSkeleton key={i} />
            ))}
        </div>
    )
}
