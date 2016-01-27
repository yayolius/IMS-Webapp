var fakeChart = function() {
    var fakeData = [{
        x: [1,2,3,4],
        y: [0,2,4, 6],
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Chancador 1'
    }, {
        x: [1,2,3,4],
        y: [2,4,6,8],
        fill :'tonexty',
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Chancador 2'
    },{
        x: [1,2,3,4],
        y: [4,6,8,10],
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Chancador 3'        
    }];

    layout = {title: ''}

    var options = {
        showLink: false,
        displayModeBar: false
    }

    Plotly.newPlot('dashboardGraph', fakeData, layout, options);
}    
