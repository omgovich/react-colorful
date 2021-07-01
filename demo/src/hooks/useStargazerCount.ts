import { useEffect, useState } from "react";

export const useStargazerCount = (): number => {
  const [count, setCount] = useState(1300);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" && "fetch" in window) {
      fetch("https://api.github.com/repos/omgovich/react-colorful").then((result) => {
        result.json().then((data) => setCount(data.stargazers_count));
      });
    }
  }, []);

  return count;
};
