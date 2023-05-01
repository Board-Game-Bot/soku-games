import { Route, Routes } from '@solidjs/router';
import { WelcomeView } from './pages/welcome';

export function App() {
  return (
    <Routes>
      <Route path="/" component={WelcomeView} />
    </Routes>
  );
}
