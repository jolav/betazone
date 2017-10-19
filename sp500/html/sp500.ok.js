'use strict';

{
  var init = function init() {
    console.log('Init sp500');
    getAjaxData(list, showData);
    setInterval(function () {
      getAjaxData(list, showData);
    }, 5000);
  };

  var showData = function showData(data) {
    datas = Object.values(data);
    // console.log(datas[0])
    var res = '';
    for (var i = 0; i < datas.length; i++) {
      // let fecha = new Date(datas[i].time * 1e3).toISOString().slice(-13, -5)
      var going = '';
      if (datas[i].price > datas[i].last) {
        going = 'up';
      }
      if (datas[i].price < datas[i].last) {
        going = 'down';
      }
      if (datas[i].price === 0) {
        going = '';
        datas[i].price = datas[i].last;
      }
      res += '<div class="row tooltip" id="' + i + '">\n           <div>' + datas[i].symbol + '</div>\n           <div class="' + going + '">' + datas[i].price + '</div>\n           <span class="tooltipText">\n           <strong>' + datas[i].companyName + '</strong><br>\n           Last day : ' + datas[i].last + '<br>\n           <small>' + datas[i].industry + '<br>' + datas[i].sector + '</small>\n           </span>\n         </div>';
    }
    document.getElementById('data').innerHTML = res;
  };

  var getAjaxData = function getAjaxData(urlData, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // 4 = "DONE"
        if (xhr.status === 200) {
          // 200 ="OK"
          console.log(xhr.responseText);
          callback(JSON.parse(xhr.responseText));
        } else {
          console.log('Error: ' + xhr.status);
        }
      }
    };
    xhr.open('GET', urlData); // add false to synchronous request
    xhr.send();
  };

  // const list = 'http://localhost:3000/v1/tick/'
  var list = 'https://sp500.datasilo.org/api/v1/tick/';

  var datas = void 0;

  window.addEventListener('load', init);
}
