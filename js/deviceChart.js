var fakeDeviceChart = function() {
    var data = [{
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [1, 4, 8, 2, 13, 1, 0, 4],
        mode: 'lines',
        name: 'Algo 1'
    }, {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [4, 9, 3, 20, 1, 6, 13, 43],
        mode: 'lines',
        name: 'Algo 2'
    }];

    var layout = {
        width: 1100,
        height: 340
    };
    var options = {
        showLink: false,
        displayModeBar: false
    }

    Plotly.newPlot('device', data, layout, options);
}
