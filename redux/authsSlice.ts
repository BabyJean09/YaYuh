import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string | null;
  role: string | null;
  username: string | null;
  user_id: string | null;
}

const initialState: AuthState = {
  role: null, // No role initially
  username: null,
  user_id: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.username = null;
      state.user_id = null;
      state.email = null;
    },
  },
});

export const { setRole, setUsername, setEmail, setId, logout } = authSlice.actions;

export default authSlice.reducer;
