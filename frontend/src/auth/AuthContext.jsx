import { createContext, useState, useEffect ,useMemo} from 'react';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const ME = gql`query { me { id email pseudo role } }`;

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const { data, loading } = useQuery(ME, {
    skip: !localStorage.getItem('token')
  });

  useEffect(() => {
  
      if (data?.me) {
        setAuth(data.me);
      }
    }, [data]);
  
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const contextValue = useMemo(() => ({ auth, setAuth, loading }), [auth, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
