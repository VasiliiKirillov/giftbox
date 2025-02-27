import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-styled-components',
              { displayName: mode === 'development' },
            ],
          ],
        },
      }),
    ],
  };
});
