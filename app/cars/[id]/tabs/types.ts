import { CarWithRelations } from "@/lib/types";

export interface InfoTabProps {
    car: CarWithRelations;
    isOverdue: boolean;
    userRole: 'ADMIN' | 'STAFF' | string;
}

export interface FinanceTabProps {
    car: CarWithRelations;
    totalGop: number;
    totalChiPhi: number;
}

export interface RecordsTabProps {
    car: CarWithRelations;
    isOverdue: boolean;
}

export interface DealTimelineProps {
    status: string;
    deposit: number;
    isSold: boolean;
}

export interface DetailRowProps {
    icon: React.ElementType;
    label: string;
    value: string | number | null;
    subValue?: string | null;
    isBadge?: boolean;
}
