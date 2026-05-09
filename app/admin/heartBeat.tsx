import { useEffect } from "react";

const HEARTBEAT_INTERVAL = 4 * 60 * 1000;
const HeartBeat = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return;

            try {
                const response = await fetch("/api/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.adminToken) {
                        localStorage.setItem("adminToken", data.adminToken);
                    }
                }
            } catch (error) {
                console.error("Heartbeat token refresh error:", error);
            }
        }, HEARTBEAT_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default HeartBeat;

