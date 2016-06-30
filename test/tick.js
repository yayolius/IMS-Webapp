/**
 * Created by ahenriquez on 20-06-16.
 */
var request = require('request');
var index = 1;
var up = true;

function tick() {
  if (up) {
    index++;
    if (index == 11) {
      up = false;
    }
  }
  if (!up) {
    index--;
    if (index == 0) {
      up = true;
    }
  }
  request.post({
    url: 'http://0.0.0.0:8080/api/Devices/add-datapoint',
    form: {name: "prueba", value: index}
  }, function (error, response, body) {
    console.log(index, body);
    setTimeout(function () {
      tick();
    }, 10 * 1000 + Math.random() * 1000);
  });
}


tick();
