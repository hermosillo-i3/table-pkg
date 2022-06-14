import "@fortawesome/react-fontawesome";
import "@fortawesome/free-solid-svg-icons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: '#ffffff',
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}