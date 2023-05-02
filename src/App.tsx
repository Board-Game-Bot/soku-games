import { Route, Routes } from '@solidjs/router';
import { WelcomeView } from './pages/welcome';
import { GameView } from './pages/game';

export function App() {
  return (
    <Routes>
      <Route path="/" component={WelcomeView} />
      <Route path="/game" component={GameView} />
    </Routes>
  );
}
