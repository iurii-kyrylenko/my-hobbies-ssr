import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

export enum Severity {
    MSG,
    ERR,
};

interface NotificationData {
    message: string;
    severity: Severity;
}

export function NotificationSink() {
    const { data } = useQuery<NotificationData | null>({
        queryKey: ["notification"],
        queryFn: () => null,
    });

    const notify = useNotification();

    React.useEffect(() => {
        const intervalId = setTimeout(() => notify(null), 3000);
        return () => clearTimeout(intervalId);
    }, [data, notify]);

    const clsSeverity = data?.severity === Severity.MSG ? "bg-green-800" : "bg-red-800";

    return (
        <>
            {data && <div className={`fixed bottom-6 ps-3 pe-4 left-20 h-12 flex items-center text-white ${clsSeverity}`}>
                <span
                    className="pr-3 opacity-70 hover:opacity-100 cursor-pointer"
                    onClick={() => notify(null)}
                >
                    &#x2715;
                </span>
                {data.message}
            </div>}
        </>
    );
}

export function useNotification() {
    const queryClient = useQueryClient();

    return (data: NotificationData | null) => {
        queryClient.setQueryData(["notification"], () => data);
    };
}
