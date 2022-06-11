import Axios from 'axios';

let createdClient = null;

const createClient = () => {
  if (createdClient) return createdClient;

  const client = Axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
  });

  createdClient = client;
  return client;
};

class Http {
  constructor() {
    ['options', 'head', 'get'].forEach((method) => {
      Http.prototype[method] = (url, options) => {
        const client = createClient();
        return client.request({ method, url, ...options });
      };
    });

    ['put', 'post', 'patch', 'delete'].forEach((method) => {
      Http.prototype[method] = (url, data, options) => {
        const client = createClient();
        return client.request({ method, url, data, ...options });
      };
    });
  }
}

export default new Http();
