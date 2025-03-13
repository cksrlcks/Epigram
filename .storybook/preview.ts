import type { Preview } from '@storybook/react';
import '../src/assets/css/globals.css';
import './style.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
        { name: 'custom', value: '#404040' },
      ],
    },
  },
};

export default preview;
