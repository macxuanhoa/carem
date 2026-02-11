import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 pt-12 pb-4">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1">
                    <Skeleton className="h-2 w-16 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-5 w-24 bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
            <Skeleton className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="px-4 space-y-8 mt-6">
        {/* Hero Card Skeleton */}
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-900 rounded-3xl animate-pulse relative overflow-hidden">
            <div className="absolute bottom-5 left-5 space-y-2">
                <Skeleton className="h-3 w-24 bg-slate-300 dark:bg-slate-800" />
                <Skeleton className="h-8 w-48 bg-slate-300 dark:bg-slate-800" />
            </div>
            <div className="absolute bottom-5 right-5">
                <Skeleton className="h-16 w-32 bg-slate-300 dark:bg-slate-800" />
            </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Skeleton className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-12 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-2 w-16 bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            ))}
        </div>

        {/* List Skeleton */}
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                            <div className="flex space-x-2">
                                <Skeleton className="h-3 w-12 bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
