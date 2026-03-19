import { ConfigProvider, App as AntApp } from "antd";
import { RouterProvider } from "react-router";
import { router } from './routes';

const antdTheme = {
  token: {
    colorPrimary: "#7c3aed",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}