import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MainMenuState {
  selected: string;
}

const initialState: MainMenuState = {
  selected: '', // Se asigna al cargar menuLateral (primera sección con permisos)
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