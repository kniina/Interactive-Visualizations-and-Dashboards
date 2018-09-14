////////////  Function that builds the metadata panel //////////// 
function buildMetadata(sample) {
  
  // Define endpoint
  var url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((data) => {
  console.log(data)
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select('#sample-metadata');
    
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");
    
    // Iterate through each sample record in data
    Object.entries(data).forEach((sample)=>{
      
      // Append new div tag for each key-value pair and display values
      metadataPanel
        .append("div")
        .text(sample[0]+ ":  " + sample[1]);
    }); 
  });
}
 
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


 //////////// @TODO: Use `d3.json` to fetch the sample data for the plots ////////////  
function buildCharts(sample) {

  // Define endpoint
  var url = '/samples/' + sample;
  
  // Use `d3.json` to fetch the sample data
  d3.json(url).then((data)=>{
    console.log(data)

    // Get revelevant data values used for building plots
    var sampleValues = data.sample_values;
    var sampleLabels = data.otu_ids;
    var sampleText = data.otu_labels;
    
    //////////// @TODO: Build a Bubble Chart using the sample data ////////////
    // Grab a reference to the bubble ID in HTML File
    var bubbleChart = d3.select('#bubble')
    
    // Object that contains data to be plotted and specs for plotting
    var trace = {
      x: sampleLabels,
      y: sampleValues,
      mode: 'markers',
      text: sampleText,
      marker: { 
        size: sampleValues,
        color: sampleLabels,
        colorscale: 'Portland',
      }
    };

    var layout = {
      title: "Visualizing BB_Samples",
      height: 500
    };

    // Plot the bubble chart using data and defined trace and layout
    var data = [trace];
    Plotly.newPlot('bubble', data, layout)


    //////////// @TODO: Build a Pie Chart ////////////
    // Grab a reference to the pie ID in HTML File
    var pieGraph = d3.select('#pie')

   // Show only 10 samples on pie chart
    var chartValues = sampleValues.slice(0, 10);
    var chartLabels = sampleLabels.slice(0, 10);
    var chartText = sampleText.slice(0, 10);

    // Object that contains data to be plotted and specs for plotting
    var data = [{
      values: chartValues, 
      labels: chartLabels,
      type: "pie",
      text: chartText 
    }];

    var layout = {
      title: "Top 10 Samples",
      height: 600, 
      width: 450,
      colorway: ['Portland'],
    };

    // Plot the pie graph using data and defined trace and layout
    Plotly.newPlot("pie", data, layout);
  }); 
}

// Function for initializing DOM
function init() {
  
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function called when an event takes place
function optionChanged(newSample) {

  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
