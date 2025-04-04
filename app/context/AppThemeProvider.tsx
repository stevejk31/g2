'use client';

import React, {
  createContext, useContext, useMemo, ReactNode,
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createTheme, CssBaseline, responsiveFontSizes, ThemeProvider,
} from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

const AppThemeContext = createContext(null);

function AppThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => responsiveFontSizes(createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
    cssVariables: {
      colorSchemeSelector: 'class',
      disableCssColorScheme: true,
    },
  })), [prefersDarkMode]);

  return (
    <AppThemeContext.Provider value={null}>
      <ThemeProvider theme={theme} disableTransitionOnChange>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

export const useAppThemeContext = () => useContext(AppThemeContext);

export default AppThemeProvider;
