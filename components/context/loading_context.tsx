import React, { Component, ReactNode, useContext, useState } from "react";

type loadingType = boolean;

interface LoadingContextType {
  loading: loadingType;
  setLoading: React.Dispatch<React.SetStateAction<loadingType>>;
}

const LoadingContext = React.createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

export const LoaderHolder = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<loadingType>(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
