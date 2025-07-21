import { configureStore } from '@reduxjs/toolkit';

import CustomizerReducer from './customizer/CustomizerSlice';
import mainMenuReducer from './MainMenuSlice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    mainMenu: mainMenuReducer,
  },
});

export default store;
