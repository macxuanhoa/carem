import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "./logger";

export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/**
 * Helper to execute logic with safety checks inside a Server Action
 */
export async function executeAction<TInput, TOutput>(
    schema: z.Schema<TInput>,
    rawData: TInput,
    handler: (data: TInput, user: any) => Promise<TOutput>,
    options: { adminOnly?: boolean } = {}
): Promise<ActionResponse<TOutput>> {
    const session = await auth();
    const user = session?.user as any;

    try {
        // 1. Auth
        if (!user) {
            return { success: false, error: "Vui lòng đăng nhập để thực hiện thao tác này." };
        }

        if (options.adminOnly && user.role !== "ADMIN") {
            logger.warn("Unauthorized Admin Access Attempt", { action: "executeAction", user: user.id });
            return { success: false, error: "Bạn không có quyền thực hiện thao tác này." };
        }

        // 2. Validation
        const validationResult = schema.safeParse(rawData);
        if (!validationResult.success) {
            return { 
                success: false, 
                error: "Dữ liệu không hợp lệ.", 
                fieldErrors: validationResult.error.flatten().fieldErrors 
            };
        }

        // 3. Execution
        const data = await handler(validationResult.data, user);
        return { success: true, data };

    } catch (error: any) {
        logger.error("Action Error", { error: error.message, stack: error.stack }, user?.id);
        return { 
            success: false, 
            error: error.message || "Đã xảy ra lỗi máy chủ." 
        };
    }
}
