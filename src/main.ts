import App from './App.vue';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import router from './router';
import store from './store';

import '@/api/interceptor';

import 'vditor/src/assets/scss/index.scss';
import 'element-plus/theme-chalk/el-form.css';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store);

app.mount('#app');
