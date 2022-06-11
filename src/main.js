import app from './app';
import router from './router';
require('./components');

app.use(router);
app.mount('#app');
