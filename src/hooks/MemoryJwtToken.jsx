import { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const useToken = () => {
  return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const setTokenWithCallback = (newToken, callback) => {
    setToken(newToken);
    if (callback) {
      callback();
    }
  };

  return (
    <TokenContext.Provider value={{ token, setToken: setTokenWithCallback }}>
      {children}
    </TokenContext.Provider>
  );
};
