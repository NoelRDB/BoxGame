"use client"; // Required for Next.js

import { ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install("app_76433c702a5d8027e225adcbedc71892");
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
