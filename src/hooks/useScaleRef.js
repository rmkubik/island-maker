import { useCallback, useEffect, useRef } from "react";

const scaleToFitWindow = (node) => {
  if (!node) {
    // If no node is provided, do nothing
    return;
  }

  const { clientWidth, clientHeight } = node;
  const { innerWidth, innerHeight } = window;

  const scales = [
    // X scale
    innerWidth / clientWidth,
    // Y scale
    innerHeight / clientHeight,
  ];

  console.log({ scales, clientWidth, clientHeight, innerWidth, innerHeight });

  node.style.transformOrigin = "top left";
  node.style.transform = `scale(${Math.min(...scales)})`;
};

const useScaleRef = () => {
  // const scaleRef = useRef();

  const scaleRef = useCallback((node) => {
    if (node !== null) {
      const scaleToFitWindowWithRef = () => scaleToFitWindow(node);

      scaleToFitWindowWithRef();

      window.addEventListener("resize", scaleToFitWindowWithRef);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          scaleToFitWindow(entry.target);
        }
      });

      resizeObserver.observe(node);

      return () => {
        window.removeEventListener("resize", scaleToFitWindowWithRef);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return scaleRef;
};

export default useScaleRef;
