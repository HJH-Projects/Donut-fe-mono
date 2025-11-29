import Webview from "react-native-webview";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const isLocal = process.env.APP_ENV === "local";

  return (
    <Webview source={{ uri: isLocal? 'http://localhost:3000': 'https://donut-fe-mono.vercel.app' }} style={{ flex: 1 }} />
  );
}
