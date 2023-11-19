/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from './App';

const root = document.getElementById('root');

import 'virtual:uno.css';

render(() => <App />, root!);
