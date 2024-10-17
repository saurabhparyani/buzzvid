import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleOAuthProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error(
      "Google Client ID is not set. Please check your environment variables."
    );
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleOAuthProviderWrapper;
