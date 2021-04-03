function init() {
     var dropdownMenu = d3.select("#selDataset");
     d3.json("static/js/data/samples.json").then((data) => {
         var sampleNames = data.names;
         sampleNames.forEach((sample) => {
             dropdownMenu.append("option").text(sample).property("value", sample);
         });
         var defaultSample = sampleNames[0];

         var metadata = data.metadata;
         var outputArray = metadata.filter(sampleObject => sampleObject.id == defaultSample);
         var output = outputArray[0];
         console.log(outputArray[0]);      
         var samples = data.samples;
          var outputArray = samples.filter(sampleObject => sampleObject.id == defaultSample);
          var output = outputArray[0];
          var sample_values = output.sample_values.slice(0,10);
          var otu_ids = output.otu_ids.slice(0,10);
          var otu_labels = output.otu_labels.slice(0,10);

         printdata(data);
         printdata(metadata);
         printdata(metadata.wfreq);
         printdata(defaultSample);
         printdata(output);
         printdata(otu_ids);
         printdata(otu_labels);
         printdata(sample_values)

         createChart(defaultSample);
         metaData(defaultSample);
         dropdownMenu.on("change", optionChanged);
     });
 }



function printdata(sampleData){
     console.log(sampleData);
}


function metaData(sample) {
     d3.json("static/js/data/samples.json").then((data) => {
         console.log(data);
         var metadata = data.metadata;
         var outputArray = metadata.filter(sampleObject => sampleObject.id == sample);
         var output = outputArray[0];
        
         var PANEL = d3.select("#sample-metadata");
         PANEL.html("");
         Object.entries(output).forEach(([key, value]) => {
             PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
             console.log(key);
             console.log(value)
         });
         
     });
 }
 
//  // Function to create horizontal bar chart
 function createChart(sample) {
     d3.json("static/js/data/samples.json").then((data) => {
         var samples = data.samples;
         var outputArray = samples.filter(sampleObject => sampleObject.id == sample);
         var output = outputArray[0];
         var sample_values = output.sample_values;
         console.log(sample_values)
         var otu_ids = output.otu_ids;
         var otu_labels = output.otu_labels;
         var metadata = data.metadata;
         var outputArray = metadata.filter(sampleObject => sampleObject.id == sample);
         var output = outputArray[0];
         washingFrequency = outputArray[0].wfreq;
         console.log(outputArray[0].wfreq);

         //Construct horizontal bar chart for the most common otu's found in each individual
         //Bar chart
         var barData = [{
             type: "bar",
             x: sample_values.slice(0, 10).reverse(), 
             y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
             text: otu_labels.slice(0, 10).reverse(),
             orientation: "h",
             color: 'rgb(142,124,195)'
         }];
 
         var barlayout = {
             title: "Most Common OTU's per Individual",
             margin: {t: 50, l: 100},
             
         };
 
         Plotly.newPlot("bar", barData, barlayout);
 
         //Bubble chart
         var trace1 = {
             x: otu_ids,
             y: sample_values,
             text: otu_labels,
             mode: "markers",
             marker: {
             color: ['rgb(293, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)',
                'rgb(93, 168, 214)', 'rgb(75, 155, 214)',  'rgb(244,109,67)', 'rgb(25, 65, 54)',
               'rgb(215,48,39)', 'rgb(275, 177, 114)'],
             size: sample_values,
             }
         };
 
         var data = [trace1];
 
         var layout = {
             title: "Distribution of OTU's",
             showlegend: false,
             height: 600,
             width: 1000,
             xaxis: {
                 title:{
                     text: "OTU ids"
                 }
             },
             yaxis: {
                 title: {
                     text: "Sample Values"
                 }
             }
         };
 
         Plotly.newPlot("bubble", data, layout);


        
         var data = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: washingFrequency,
            title: { text: "Weekly Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 7 },
            gauge: { axis: { range: [null, 15] } }
           
            
          }
        ];
        
        var layout = { width: 600, height: 350 };
        Plotly.newPlot('gauge', data, layout);
         
     });
 }
 
//  //create function init

 
 //Function to show data for new sample
 function optionChanged() {
     //create a variable to reference the dropdown where test subject can be changed
     var menuOption = d3.select("#selDataset");
     //create variable to select value for whatever user puts into this field
     var userSelection = menuOption.property("value");
     //run metadata and create chart function fors the new user choice
     metaData(userSelection);
     createChart(userSelection);
     console.log(userSelection);
 };
 
  init();
