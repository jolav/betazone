/* 
Source original
https://dis.um.es/profesores/ginesgm/retoviajante.html
*/

console.log('Loading.....init.js');

import * as render from "./render.js";
import * as data from "./data.js";

const init = {
  init: async function () {
    console.log('#### INIT #####');
    const rawData = await lib.makeRequest("./data.txt", 'GET', undefined);
    data.parseRawData(rawData);
    render.map();
  },
};

window.addEventListener("load", init.init);

const lib = {
  makeRequest: function (url, method, param) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        //console.log(xhr.status);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      if (method === 'GET') {
        xhr.send();
      } else if (method !== 'GET') {
        xhr.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8');
        if (param) {
          xhr.send(param);
        } else {
          xhr.send();
        }
      }
    });
  }
};

