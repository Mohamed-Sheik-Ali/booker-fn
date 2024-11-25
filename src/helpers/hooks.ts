import { useState } from "react";

export const useLoader = () => {
  const [loading, setLoading] = useState(false);

  const handleLoader = (state: boolean) => {
    setLoading(state);
  };

  return {handleLoader, loading};
};