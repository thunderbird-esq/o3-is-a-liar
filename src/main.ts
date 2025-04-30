import { createApp } from 'vue';
import Boot from './views/Boot.vue';
import Desktop from './views/Desktop.vue';

const app = createApp(Boot);

// after 3s, replace Boot with Desktop
setTimeout(() => {
  app.component('Boot', Desktop);
}, 3000);

app.mount('#app');
