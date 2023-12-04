import { createSignal } from 'solid-js';

export const downloadGame = (npmPackage: string, version: string, stuff: string, onLoad: () => void) => {
  if (document.querySelector(`script#${npmPackage}`)) return ;

  const dom = document.createElement('script');
  dom.type = 'module';
  dom.src = `https://cdn.jsdelivr.net/npm/${npmPackage}@${version}/dist/${stuff}/index.js`;
  document.body.append(dom);
  dom.onload = onLoad;
};

export const [loadingMap, setLoadingMap] = createSignal<Record<string, number>>({});
