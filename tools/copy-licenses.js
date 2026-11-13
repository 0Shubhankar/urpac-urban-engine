import {cpSync} from 'node:fs';
cpSync(new URL('../docs/third-party/',import.meta.url),new URL('../dist/licenses/',import.meta.url),{recursive:true});
