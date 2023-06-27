//belly button
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// fetch the jason data
d3.json(url).then(function(data){
    console.log.data;
});

//initialize
function init(){

    //using D3 for dropdown 
    let dropdownMenu = d3.select("#selDataset");

    //using d3 to get sample names and to populate the dropdown select
    d3.json(url).then(function(data) {

        //set variable for sample names
        let names = data.names;
        
        //adding the sample to the dropdown menu
        names.forEach((id) => {
            //log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });
        //set first sample for the list
        let sample_one = names[0];

        //set the value for the sample one
        console.log(sample_one);

        //build the initial plots
        buildMetadata (sample_one);
        buildBarChart (sample_one);
        buildBubbleChart (sample_one);
        buildGaugeChart (sample_one);

    });
};
//function that produce metadata init
function buildMetadata(sample){
    //use D3 to retrieve all data
    d3.json(url).then(function(data) {

        //retrive all metadata
        let metadata= data.metadata;

        //filter based on value of sample
        let value = metadata.filter(result => result.id ==sample);

        //log the array of metadata objects after filter
        console.log(value)

         //get index from array
         let valueData = value [0];

         //clear out metadata
         d3.select("#sample-metadata").html("");
         //use object.entries to pair to the pannel with values
         Object.entries(valueData).forEach(([key,value]) => {

            //log the individual key pairs as they are appended to the metadata pannel
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);

         });
    });
};

//function to build bar chart
function buildBarChart (sample) {
    //use d3 to retrive all the data
    d3.json(url).then(function(data) {
        //retrive all the sample data 
        let sampleInfo = data.samples;

        //filter based upon the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        //get the first index from the array
        let valueData = value[0];

        //get the otu-IDS, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        //set top 10 item in the descending orders
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        //set up trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // setup the layout
        let layout = {
            title: "Top 10 otus present"
        };
        console.log(trace);
        //call plotly to plot the bar chart
        plotly.newPlot("bar", trace, layout)
    });
};
//function to built bubble chart
function buildBubbleChart (sample) {

    //use d3 to retrive all the data
    d3.json(url).then(function(data) {
        //retrive all the sample data 
        let sampleInfo = data.samples;

       //filter based upon the value of the sample
       let value = sampleInfo.filter(result => result.id == sample);

       //get the first index from the array
       let valueData = value[0];

       //get the otu-IDS, labels, and sample values
       let otu_ids = valueData.otu_ids;
       let otu_labels = valueData.otu_labels;
       let sample_values = valueData.sample_values;

       //log the data to the console
       console.log(otu_ids, otu_labels, sample_values); 

       //set up trace for bar chart
       let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        markers: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
       };
       //set up the layout
       let layout = {
        title: "Bacteria per sample",
        hovermode: "closest",
        xaxis: {title:`OTU ID`},
       };
       // plotly plot of bubble chart
       plotly.newPlot("bubble",trace1, layout)
    });
};

// function that update the dashboard when each sample is change
function optionChanged(value) {
    // log new value
    console.log(value);
    //call all the functions
    buildMetadata(value); 
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);

};

// call all the initialize function
init();
 
