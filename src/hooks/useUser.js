import { createContext, useContext, useState } from "react";

const UserContext = createContext([{}, () => {}]);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export default useUser;
export { UserContextProvider };
