// Get sample
function init() {
    // fetch the html selector for drop-down menu
    var selector = d3.select("#selDataset");

    // get data to include in drop-down
    d3.json("samples.json").then((data) => {
            
        // create variable to hold names
        var sNames = data.names;

        // check if data are pulled in correctly
        // console.log(sNames);
            
        sNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample)
        });

        // set the initial data to the first name
        var sample = sNames[0];

        // placeholder for building the charts for the initial charts
        buildMetadata(sample);
        createBarChart(sample);
        createBubbleChart(sample);
        createGauge(sample);
    });
}

// create a function to display the metadata (pairs of keys and values in dictionary based on data selected)
function buildMetadata(sample) {
    
    // select the reference for the sample metadata
    var metadata_ref = d3.select("#sample-metadata");
    
    // empty before populating information
    metadata_ref.html("");

    // select the metadata of selected id/name
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var results = metadata.filter(m => m.id == sample)[0];
        
        // check data
        // console.log(results);

        // populate information in the metadata panel/box
        Object.entries(results).forEach(([key, value]) => {

            if (key == "id") {
                key = key.toUpperCase();
            }

            if (key == "bbtype") {
                key = key[0].toUpperCase() + key.slice(0, 0) + key[1].toUpperCase() + key.slice(1, 1) + " " + key[2].toUpperCase() + key.slice(3);
            }

            if (key == "wfreq") {
                key = key[0].toUpperCase() + key.slice(0, 0) + " " + key[1].toUpperCase() + key.slice(2);
            }

            else {
                 key = key[0].toUpperCase() + key.slice(1);
            };

            metadata_ref
            .append("p")
            .text(`${key}: ${value}`)
        });  
    });
  }


// create bar charts
function createBarChart(sample) {
    // get data
    d3.json("samples.json").then((data) => {

        // get sample values, otu_ids, and otu_labels
        var samples_data = data.samples;

        // locate the sample ID that matches selection in drop-down
        var results = samples_data.filter(s => s.id == sample)[0];
        // check data
        // console.log(results);

        // get all the needed variables
        var otu_ids = results.otu_ids
        var otu_labels = results.otu_labels
        var values = results.sample_values
        // check data
        // console.log(`selected otu id: ${otu_ids}`);
        // console.log(`selected otu label: ${otu_labels}`);
        // console.log(`selected sample values: ${values}`);
        
        // select top 10
        var x_values = values.slice(0,10).reverse();
        // check data
        // console.log(x_values);

        var y_axisLabels = otu_ids.slice(0,10).reverse();
        var y_axisLabels = y_axisLabels.map(id => `OTU_${id}`);
        var hover_over_labels = otu_labels.slice(0,10).reverse();
        // check data
        // console.log(y_axisLabels);

        var hover_over_labels = hover_over_labels.map(label => label.replace(/;/gi, '<br>'));
        // console.log(hover_over_labels);

        var trace = {
            x: x_values,
            y: y_axisLabels,
            type: 'bar',
            orientation: 'h',
            text: hover_over_labels,
            marker: {
                color: 'rgba(198,224,217,1)'
            }
        }

        var data = [trace]

        var layout = {
            title: {
                text: `Top 10 OTUs Found in Subject ${sample}`,
                font: {
                    autosize: true,
                    color: '#8f8897'
                }
            },
            autosize: true,
            margin: {
                pad: 5
            },
            xaxis: {
                showgrid: false,
                tickfont: {
                    color: '#8f8897'
                }
            },
            yaxis: {
                tickfont: {
                    color: '#8f8897'
                }
            }
          };

        Plotly.newPlot('bar', data, layout);

    });
}

// create bubble chart
function createBubbleChart(sample) {
    // get data
    d3.json("samples.json").then((data) => {

        // get sample values, otu_ids, and otu_labels
        var samples_data = data.samples;

        // locate the sample ID that matches selection in drop-down
        var results = samples_data.filter(s => s.id == sample)[0];
        // check data
        // console.log(results);

        // get all the needed variables
        var otu_ids = results.otu_ids
        var otu_labels = results.otu_labels
        var values = results.sample_values
        // check data
        // console.log(`selected otu id: ${otu_ids}`);
        // console.log(`selected otu label: ${otu_labels}`);
        // console.log(`selected sample values: ${values}`);

        var labels = otu_labels.map(label => label.replace(/;/gi, '<br>'));

        var trace = {
            x: otu_ids,
            y: values,
            mode: 'markers',
            marker: {
                size: values,
                color: otu_ids,
                colorscale: 'Portland'
            },
            text: labels,
            hovermode: 'closest',
        }

        var data = [trace];

        var layout = {
            title: {
                text: `OTUs found in Subject ${sample}`,
                font: {
                    autosize: true,
                    color: '#8f8897'
                }
            },
            autosize: true,
            margin: {
                pad: 10
            },
            xaxis: {
                title: {
                    text: 'OKU IDs',
                    font: {
                        color: '#8f8897'
                    }
                },
                showgrid: false,
                tickfont: {
                    color: '#8f8897'
                }
            },
            yaxis: {
                tickfont: {
                    color: '#8f8897'
                }
            }
        };
        
        Plotly.newPlot('bubble', data, layout);
    });        
}

// create gauge
function createGauge(sample) {
    // get data
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        // console.log(metadata);

        var results = metadata.filter(m => m.id == sample)[0];

        // check data
        // console.log(results);

        // get washing frequency
        var wFreq = results.wfreq
        // check data
        // console.log(wFreq);

        // Enter a speed between 0 and 180
        let level = parseFloat(wFreq) * 20;

        // Trig to calc meter point
        var degrees = 180 - level,
             radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
           x: [0], y:[0],
            marker: {size: 20, color:'850000'},
            showlegend: false,
            name: ' time(s)',
            text: wFreq,
            hoverinfo: 'text+name'},
          { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
          rotation: 90,
          text:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: 'text',
          textposition:'inside',	  
          marker: {
                colors: [
                    "rgba(0,80,11,.5)",
                    "rgba(8,100,18,.5)",
                    "rgba(14,127,0,.5)",
                    "rgba(110,154,22,.5)",
                    "rgba(170,202,42,.5)",
                    "rgba(195,205,60,.5)",
                    "rgba(210,210,80,.5)",
                    "rgba(220,225,120,.5)",
                    "rgba(230,230,190,.5)",
                    "rgba(243,242,225,0)"
                ]},
          labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: 'label',
          hole: .5,
          type: 'pie',
          showlegend: false,
        }];

        var layout = {
          shapes:[{
              layer: 'above',
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            }],
            title: {
                text: 'Washing Frequency',
                font: {
                    color: '#8f8897'
                }
            },
          autosize: true,
          xaxis: {zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]},
          yaxis: {zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', data, layout);
    });
}

// on change function
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    createBarChart(newSample);
    buildMetadata(newSample);
    createBubbleChart(newSample);
    createGauge(newSample);
  }

  
init();