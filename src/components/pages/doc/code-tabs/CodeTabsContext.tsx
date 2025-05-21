'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface ActiveLabelContextProps {
  activeLabel: string;
  setActiveLabel: (label: string) => void;
}

const ActiveLabelContext = createContext<ActiveLabelContextProps | undefined>(undefined);

interface ActiveLabelProviderProps {
  children: ReactNode;
}

const ActiveLabelProvider: React.FC<ActiveLabelProviderProps> = ({ children }) => {
  const [activeLabel, setActiveLabel] = useState<string>('');
  return (
    <ActiveLabelContext.Provider value={{ activeLabel, setActiveLabel }}>
      {children}
    </ActiveLabelContext.Provider>
  );
};

export { ActiveLabelContext, ActiveLabelProvider };
