import Constants from "expo-constants";

export const generateAPIUrl = (relativePath: string) => {
  // 1. Extract the host debugger address from the running bundle configuration (e.g., "192.168.1.5:8081")
  const hostUri = Constants.expoConfig?.hostUri;
  
  // 2. Clean the string to grab just the IP and Port layout
  const manifestHost = hostUri ? hostUri.split("?")[0] : null;
  
  // 3. Fallback safely if running on a standard web simulator layout
  const origin = manifestHost ? `http://${manifestHost}` : "http://localhost:8081";
  
  const finalUrl = `${origin}${relativePath}`;
  console.log("🔗 Fixed API Target URL:", finalUrl);
  
  return finalUrl;
};