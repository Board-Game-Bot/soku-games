import { Counter } from '../../components/counter';
import logo from '../../logo.svg';
import styles from './index.module.css';

export function WelcomeView() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p class={'text-4xl'}>Quick Started Template for Solid.js</p>
        <img
          class={'h-[80px]'}
          src="https://skillicons.dev/icons?i=solidjs,ts,vite,tailwindcss"
          alt="skillicons"
        />
        <Counter class={'mt-5'} />
      </header>
    </div>
  );
}
