import { useContext } from 'react';
import AuthContext from '../firebase/FirebaseContext';
//import { AuthContext } from '../jwt/JwtContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
