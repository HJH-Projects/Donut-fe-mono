import Webview from "react-native-webview";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <Webview source={{ uri: "http://localhost:3000" }} style={{ flex: 1 }} />
  );
}
