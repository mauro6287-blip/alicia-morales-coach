"use client";

import { useEffect, useState } from "react";

export default function DebugImage() {
    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

    return (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 p-4 text-white text-xs">
            <p>Debug Image: /logo.png</p>
            <img
                src="/logo.png"
                alt="Debug Logo"
                className="w-8 h-8 mt-2 border border-white"
                onLoad={() => setStatus("success")}
                onError={() => setStatus("error")}
            />
            <p className={`mt-1 font-bold ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                Status: {status}
            </p>
            <p>Env: {process.env.NODE_ENV}</p>
        </div>
    );
}
