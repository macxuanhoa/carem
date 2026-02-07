import { Skeleton } from "@/components/ui/skeleton";

export default function SellCarSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="space-y-4">
        {/* Card 1 Skeleton */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Skeleton className="h-5 w-48 mb-6" />
          
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <Skeleton className="h-10 w-full rounded-xl mt-2" />
          </div>
        </div>

        {/* Card 2 Skeleton */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
          <Skeleton className="h-5 w-32 mb-6" />
          
          <div className="space-y-4">
             <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
             </div>
             <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-999">
             <Skeleton className="h-12 flex-1 rounded-xl" />
             <Skeleton className="h-12 flex-2 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
