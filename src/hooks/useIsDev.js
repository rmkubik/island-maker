import { useEffect, useState } from "react";

const useIsDev = () => {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    try {
      const queryString = window.location.search;
      const queryParams = new URLSearchParams(queryString);
      const devString = queryParams.get("dev");
      const dev = Boolean(devString);

      setIsDev(dev);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return isDev;
};

export default useIsDev;
