import { useEffect, useRef } from "react";

export function useEffectOnce(callBack) {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      callBack();
      calledOnce.current = true;
    }
  }, [callBack]);
}

export function useOutsideClick(ref, fn) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      console.log("outside click");
      fn();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, fn]);
}

export const makeCapital = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};
