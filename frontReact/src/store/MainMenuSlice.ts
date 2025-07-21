import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MainMenuState {
  selected: string;
}

const initialState: MainMenuState = {
  selected: 'inicio', // Por defecto 'inicio'
};

const mainMenuSlice = createSlice({
  name: 'mainMenu',
  initialState,
  reducers: {
    setMainMenu(state, action: PayloadAction<string>) {
      state.selected = action.payload;
    },
  },
});

export const { setMainMenu } = mainMenuSlice.actions;
export default mainMenuSlice.reducer; 