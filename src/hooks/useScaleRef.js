import { useCallback, useEffect, useRef, useState } from "react";

const calcScaleToFitWindow = (node) => {
  if (!node) {
    // If no node is provided, use default scale
    return 1;
  }

  const { clientWidth, clientHeight } = node;
  const { innerWidth, innerHeight } = window;

  const scales = [
    // X scale
    innerWidth / clientWidth,
    // Y scale
    innerHeight / clientHeight,
  ];
  const smallestScale = Math.min(...scales);

  return smallestScale;
};

const scaleNode = (node, scale) => {
  node.style.transformOrigin = "top left";
  node.style.transform = `scale(${scale})`;
};

const scaleToFitWindow = (node) => {
  if (!node) {
    // If no node is provided, do nothing
    return;
  }

  const scale = calcScaleToFitWindow(node);

  scaleNode(node, scale);
};

const useScaleRef = () => {
  const [scale, setScale] = useState(1);

  const scaleRef = useCallback((node) => {
    if (node !== null) {
      const scaleToFitWindowWithRef = () => {
        const newScale = calcScaleToFitWindow(node);

        scaleNode(node, newScale);
        setScale(newScale);
      };

      scaleToFitWindowWithRef();

      window.addEventListener("resize", scaleToFitWindowWithRef);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // scaleToFitWindow(entry.target);
          scaleToFitWindowWithRef();
        }
      });

      resizeObserver.observe(node);

      return () => {
        window.removeEventListener("resize", scaleToFitWindowWithRef);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return [scaleRef, scale];
};

export default useScaleRef;
