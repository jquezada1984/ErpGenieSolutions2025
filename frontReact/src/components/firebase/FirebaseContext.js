import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { firebase } from './Firebase';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  platform: 'Firebase',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  onceGetUsers: () => Promise.resolve(),
  CreateUser: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Here you should extract the complete user profile to make it available in your entire app.
          // The auth state only provides basic information.
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: true,
              user: {
                id: user.uid,
                avatar: user.photoURL,
                email: user.email,
              },
            },
          });
        } else {
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [dispatch],
  );

  // Sign Up
  const createUserWithEmailAndPassword = (email, password) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);
  // Sign In
  const signInWithEmailAndPassword = (email, password) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  // Sign out
  const logout = () => firebase.auth().signOut();
  const CreateUser = (id, username, email) =>
    firebase.database().ref(`users/${id}`).set({
      username,
      email,
    });
  const onceGetUsers = () => firebase.database().ref('users').once('value');

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Firebase',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        CreateUser,
        onceGetUsers,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
