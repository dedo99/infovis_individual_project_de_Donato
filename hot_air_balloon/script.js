
// pos_x -> la posizione orizzontale della mongolfiera
// pos_y -> la posizione verticale della mongolfiera
// balloon_size -> la grandezza del pallone della mongolfiera
// basket_size -> la grandezza del cesto della mongolfiera
// color -> il colore della mongolfiera

var dataSet = [
    {"pos_x": 50, "pos_y": 150, "balloon_size": 80, "basket_size": 60, "color": 255},
    {"pos_x": 200, "pos_y": 50, "balloon_size": 100, "basket_size": 80, "color": 0},
    {"pos_x": 854, "pos_y": 420, "balloon_size": 60, "basket_size": 50, "color": 150},
    {"pos_x": 250, "pos_y": 200, "balloon_size": 120, "basket_size": 70, "color": 50},
    {"pos_x": 150, "pos_y": 600, "balloon_size": 70, "basket_size": 50, "color": 200},
    {"pos_x": 75, "pos_y": 50, "balloon_size": 90, "basket_size": 60, "color": 100},
    {"pos_x": 225, "pos_y": 150, "balloon_size": 80, "basket_size": 70, "color": 180},
    {"pos_x": 750, "pos_y": 200, "balloon_size": 110, "basket_size": 80, "color": 20},
    {"pos_x": 175, "pos_y": 100, "balloon_size": 60, "basket_size": 50, "color": 230},
    {"pos_x": 300, "pos_y": 500, "balloon_size": 100, "basket_size": 70, "color": 120}
]




function draw_with_animation(svg, partial_dataset, svgElement){

    // Exit clause: Remove elements
    svg.exit().remove();

    svg.selectAll("circle")
        .data(partial_dataset) 	
        .enter()     	
        .append("circle")
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y })
        .attr("r",   function(d) { return d.z })
        .attr("fill", "red")
        .attr("fill", function(d){  return d3.rgb(d.x/3,d.y/3,d.z/3) })
        .attr("fill-opacity", 0)
        .attr("stroke-width", "2")
        .attr("stroke", "black")
        .transition()
        .duration(500)
        .attr("fill-opacity", 1);


    svg.selectAll("circle")
        .data(partial_dataset)
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y })
        .attr("r",   function(d) { return d.z })
        .attr("fill", "red")
        .attr("fill", function(d){  return d3.rgb(d.x/3,d.y/3,d.z/3) })
        .attr("stroke-width", "2")
        .attr("stroke", "black");

}



window.onload = (event) => {
    var svg = d3.select("svg");
    const divElement = document.getElementById("main_svg");
    
    var partial_dataset = [];

    setTimeout(() => {

        dataSet.forEach(function(element, index, array) {
            
            // Carica il file SVG tramite fetch
            fetch("./figures/hot_air_baloon.svg")
            .then(response => response.text())
            .then(svgText => {
                
                // Il testo viene quindi analizzato come un documento SVG
                // utilizzando DOMParser, e l'elemento SVG risultante viene 
                // inserito all'interno del div 
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;
                divElement.appendChild(svgElement);
                
                
                // setTimeout(() => {   
                //     partial_dataset.push(elem);
                //     draw_with_animation(svg, partial_dataset, svgElement);
                // }, index * 50);
                
                
                // Modifica la posizione e le dimensioni dell'elemento SVG
                // console.log(svgElement);
                // svgElement.setAttribute('viewBox', '202.698 86.108 169.346 231.917');
                svgElement.setAttribute('width', '100');
                svgElement.setAttribute('height', '100');
                // console.log(element.pos_x)
                svgElement.setAttribute('transform', 'translate('+ String(element.pos_x) + ',' + String(element.pos_y) +')');
            });
        
        });
        
    }, 1000);
    
    


}

