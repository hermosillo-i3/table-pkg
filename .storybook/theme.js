import { create } from '@storybook/theming';
import * as path from 'path';

export default create({
  base: 'light',
  brandTitle: 'Tabla FiveBim',
  brandImage: path.join(__dirname, 'assets/logo.png'),
  brandTarget: '_self',
});