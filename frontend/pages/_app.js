import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
}
