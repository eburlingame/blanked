import { LocalBackend } from "@/state/local";
import { BlankedBackend } from "@/state/models";
import React, { useContext } from "react";

const backend = new LocalBackend();

const BackendContext = React.createContext<BlankedBackend>(backend);

export type BackendBootstrapper = {
  children: React.ReactNode;
};

export const useBackend = () => useContext(BackendContext);

const BackendBootstrapper = ({ children }: BackendBootstrapper) => {
  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
};

export default BackendBootstrapper;
