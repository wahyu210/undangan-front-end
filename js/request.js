export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';
export const HTTP_PUT = 'PUT';
export const HTTP_PATCH = 'PATCH';
export const HTTP_DELETE = 'DELETE';

export const request = (method, path) => {
  let url = document.querySelector('body').getAttribute('data-url');
  let req = {
    method: method,
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  if (url.slice(-1) === '/') {
    url = url.slice(0, -1);
  }

  return {
    then(resolve = null, reject = null) {
      return fetch(url + path, req)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          // Check if the response is not empty before parsing JSON
          return res.text().then((text) => (text ? JSON.parse(text) : {}));
        })
        .then((res) => {
          if (res.error) {
            throw res.error[0];
          }
          return res;
        })
        .then(resolve, reject)
        .catch((err) => {
          alert(err.message);
          throw err;
        });
    },
    download(resolve = null, reject = null) {
      return fetch(url + path, req)
        .then((res) => {
          if (res.status === 200) {
            return res;
          }
          throw new Error(`Download failed! status: ${res.status}`);
        })
        .then(resolve, reject)
        .catch((err) => {
          alert(err.message);
          throw err;
        });
    },
    token(token) {
      if (token.split('.').length === 3) {
        req.headers.append('Authorization', 'Bearer ' + token);
        return this;
      }
      req.headers.append('x-access-key', token);
      return this;
    },
    body(body) {
      req.body = JSON.stringify(body);
      return this;
    },
  };
};
