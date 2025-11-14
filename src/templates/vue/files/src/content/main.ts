import { createApp } from 'vue';
import Content from './Content.vue';

// Create a container for the Vue app
const container = document.createElement('div');
container.id = 'extn-vue-content';
document.body.appendChild(container);

// Mount the Vue component
createApp(Content).mount(container);
