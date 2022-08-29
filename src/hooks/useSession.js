import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SessionContext = createContext([{}, () => {}]);

const SessionContextProvider = ({ children }) => {
  const [session, setSession] = useState({ id: uuidv4() });

  return (
    <SessionContext.Provider value={[session, setSession]}>
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => useContext(SessionContext);

export default useSession;
export { SessionContextProvider };
