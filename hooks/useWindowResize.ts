// hooks/useWindowResize.ts
"use client";
import { useEffect, type RefObject } from "react";
import onWindowResize from "../utils/resize-screen";

const useWindowResize = (rootRef?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const handler = () => onWindowResize(rootRef?.current); // element পাস
    window.addEventListener("resize", handler);
    handler();

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [rootRef]);
};

export default useWindowResize;
