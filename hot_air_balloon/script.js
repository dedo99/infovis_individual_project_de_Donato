
// pos_x -> la posizione orizzontale della mongolfiera
// pos_y -> la posizione verticale della mongolfiera
// balloon_size -> la grandezza del pallone della mongolfiera
// basket_size -> la grandezza del cesto della mongolfiera
// color -> il colore della mongolfiera

var dataSet = [
    {"pos_x": 50, "pos_y": 150, "balloon_size": 80, "basket_size": 60, "color": 80},
    {"pos_x": 200, "pos_y": 50, "balloon_size": 100, "basket_size": 80, "color": 0},
    {"pos_x": 600, "pos_y": 50, "balloon_size": 60, "basket_size": 50, "color": 150},
    {"pos_x": 400, "pos_y": 400, "balloon_size": 120, "basket_size": 70, "color": 50},
    {"pos_x": 150, "pos_y": 600, "balloon_size": 70, "basket_size": 50, "color": 200},
    {"pos_x": 75, "pos_y": 50, "balloon_size": 90, "basket_size": 60, "color": 100},
    {"pos_x": 300, "pos_y": 245, "balloon_size": 80, "basket_size": 70, "color": 180},
    {"pos_x": 600, "pos_y": 400, "balloon_size": 110, "basket_size": 80, "color": 20},
    {"pos_x": 175, "pos_y": 300, "balloon_size": 60, "basket_size": 50, "color": 230},
    {"pos_x": 200, "pos_y": 500, "balloon_size": 100, "basket_size": 70, "color": 120}
]


// Ottenere i valori massimi per pos_x e pos_y
var maxPosX = d3.max(dataSet, function(d) { return d.pos_x; });
var maxPosY = d3.max(dataSet, function(d) { return d.pos_y; });
var maxBalloon_size = d3.max(dataSet, function(d) { return d.balloon_size; });
var maxBasket_size = d3.max(dataSet, function(d) { return d.basket_size; });

// scalatura delle dimensioni del pallone e del cesto
const dimBalloonSize = d3.scaleLinear().domain([0, maxBalloon_size]).range([0, 120]);
const dimBasketSize = d3.scaleLinear().domain([0, maxBasket_size]).range([0, 120]);

// scala di colori dell'arcobaleno compresi tra i valori 0 e 255
const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 255]);

// calcolo delle dimensioni maggiori per il raggio, altezza e largezza del cesto
var maxRadius = dimBalloonSize(maxBalloon_size);
var maxWidth_basket = dimBasketSize(maxBasket_size);
var maxHeight_basket = dimBasketSize(maxBasket_size)/3;

// massima altezza dell'elemento svg 
var maxHeight = (maxRadius*2) + maxHeight_basket + 70;
var maxWidth = Math.max(maxRadius*2, maxWidth_basket) + 20;

// Dimensioni della pagina del browser
var windowWidth = document.documentElement.clientWidth;
var windowHeight = document.documentElement.clientHeight;

console.log("Window width: " + windowWidth);
console.log("Window height: " + windowHeight);

// mapping su scala lineare dei valori asse X in input sulla base
// della dimensione orizzontale della finistra
const xScale = d3.scaleLinear().domain([0, maxPosX]).range([0, windowWidth - maxWidth*1.2]);

// mapping su scala lineare dei valori asse Y in input sulla base
// della dimensione verticale della finistra
const yScale = d3.scaleLinear().domain([0, maxPosY]).range([0, windowHeight - maxHeight]);





function change_attributesValue_Balloon(index_one, index_two){
    element_one = dataSet[index_one];
    element_two = dataSet[index_two];
    console.log(element_one);
    console.log(element_two);
    // scambio
    temp_one_balloon_size = element_one.balloon_size;
    temp_one_basket_size = element_one.basket_size;
    // temp_one_color = element_one.color;
    element_one.balloon_size = element_two.balloon_size;
    element_one.basket_size = element_two.basket_size;
    // element_one.color = element_two.color;
    element_two.balloon_size = temp_one_balloon_size;
    element_two.basket_size = temp_one_basket_size;
    // element_two.color = temp_one_color;
    console.log(element_one);
    console.log(element_two);
}



function selection_interaction_element(index){

    console.log("Clicked index: " + index);
    
    var current_HotAirBaloon = d3.select('#b' + String(index));

    var selected_elements = d3.selectAll('.selected');
        
    console.log(selected_elements);
    console.log("Elementi selezionati: " + String(selected_elements.size()));

    if (selected_elements.size() == 0){
        // console.log(selected_elements.nodes()[0]);
        var balloon_ball = current_HotAirBaloon.select('circle');
        var balloon_basket = current_HotAirBaloon.select('rect');
        current_HotAirBaloon.attr('class', 'baloon selected');
        balloon_ball.transition().duration(500).attr('fill', 'white');
        balloon_basket.transition().duration(500).attr('fill', 'white');
    }
    if (selected_elements.size() == 1){
        if (selected_elements.nodes()[0] === current_HotAirBaloon) {
            current_HotAirBaloon.attr('class', 'baloon');
            var color = String(colorScale(dataSet[index].color))
            balloon_ball.attr('fill', color);
            balloon_basket.attr('fill', color);
        } else {
            // avviene lo scambio dei parametri
            current_HotAirBaloon.attr('class', 'baloon selected');
            // selected_elements.nodes()[0].setAttribute('class', 'baloon');
            const current_HotAirBaloon_Id = current_HotAirBaloon.attr('id');
            const selectedElementId = selected_elements.nodes()[0].getAttribute('id');
            const index_current = parseInt(current_HotAirBaloon_Id.substring(1));
            const index_selected = parseInt(selectedElementId.substring(1));
            change_attributesValue_Balloon(index_current, index_selected);
            update_draw(svgElem);
            // change_animation();
        }

    }
    
}


function intro_animation(){
    var baloons = d3.selectAll(".baloon");
    
    baloons.attr("opacity", 0)
    .attr("fill-opacity", 0)
    // Aggiungi una transizione che dura 2 secondi
    .transition()
    .duration(2000)
    // Imposta l'opacità e l'opacità di riempimento a 1
    .attr("opacity", 1)
    .attr("fill-opacity", 1);

}


function update_draw(svgElement){

    const divElement = d3.select("#main_svg");
    
    // Exit clause: Remove elements
    divElement.exit().remove();
    
    
    // ----------------------------------------
    // ----------------ENTER-------------------
    // ----------------------------------------
    divElement.selectAll(".baloon")
    .data(dataSet)
    .enter()
    .append(() => svgElement.cloneNode(true))
    .attr("id", (d, i) => "b" + i)
    .attr("class", "baloon")
    .attr("x", (d) => xScale(d.pos_x))
    .attr("y", (d) => yScale(d.pos_y))
    // .attr("transform", (d) => "translate(" + xScale(d.pos_x) + "," + yScale(d.pos_y) + ")")
    .each(function(d) {

        // Modifica la posizione e le dimensioni dell'elemento SVG
        var balloon_ball = d3.select(this).select('circle');
        var balloon_basket = d3.select(this).select('rect');
        var left_rope_balloon = d3.select(this).select('#left_rope_balloon');
        var right_rope_balloon = d3.select(this).select('#right_rope_balloon');
        var left_line_balloon = d3.select(this).select('#left_line_balloon');
        var right_line_balloon = d3.select(this).select('#right_line_balloon');
        var central_line_balloon = d3.select(this).select('#central_line_balloon');
        var left_rope_basket = d3.select(this).select('#left_rope_basket');
        var right_rope_basket = d3.select(this).select('#right_rope_basket');

        // Aggiornamento dimensioni pallone
        var radius = dimBalloonSize(d.balloon_size);
        var width_basket = dimBasketSize(d.basket_size);
        var height_basket = dimBasketSize(d.basket_size)/3;
        var distance_btw_ball_basket = 30;

        var width = Math.max(maxRadius*2, maxWidth_basket) + 20;
        var height = (maxRadius*2) + maxHeight_basket + 70;
        var top_left_x = 0;
        var top_left_y = 0;


        d3.select(this).attr('width', String(width + 50) + 'px');
        d3.select(this).attr('height', String(height) + 'px');
        d3.select(this).attr('viewBox', top_left_x + ' ' + top_left_y + ' ' + width + ' ' + height);


        // console.log(radius)
        var cx_ball = parseFloat(width/2);
        var cy_ball = parseFloat(radius + 20);
        balloon_ball.attr('r', radius).attr('cx', cx_ball).attr('cy', cy_ball);

        // Aggiornamento linee dentro il pallone
        left_line_balloon.attr('d', "M" + cx_ball + " " + (cy_ball+radius) + " Q " + (cx_ball-radius-20) + " " + cy_ball + ", " + cx_ball + " " + (cy_ball-radius));
        right_line_balloon.attr('d', "M" + cx_ball + " " + (cy_ball+radius) + " Q " + (cx_ball+radius+20) + " " + cy_ball + ", " + cx_ball + " " + (cy_ball-radius));
        central_line_balloon.attr('y1', cy_ball - radius)
        .attr('y2', cy_ball + radius)
        .attr('x1', cx_ball)
        .attr('x2', cx_ball);

        // Aggiornamento dimensioni cavo sinistro
        left_rope_balloon.attr('y1', cy_ball)
        .attr('y2', cy_ball + radius + distance_btw_ball_basket + height_basket/3)
        .attr('x1', cx_ball - radius)
        .attr('x2', cx_ball - width_basket/2);
        
        // Aggiornamento dimensioni cavo destro
        right_rope_balloon.attr('y1', cy_ball)
        .attr('y2', cy_ball + radius + distance_btw_ball_basket + height_basket/3)
        .attr('x1', cx_ball + radius)
        .attr('x2', cx_ball + width_basket/2);

        // Aggiornamento dimensioni cesto
        balloon_basket.attr('width', width_basket);
        balloon_basket.attr('height', height_basket);
        balloon_basket.attr('x', cx_ball - width_basket/2);
        balloon_basket.attr('y', cy_ball + radius + 30);

        // Aggiornamento dimensioni cavi cesto
        left_rope_basket.attr('y1', cy_ball + radius + 30)
        .attr('y2', cy_ball + radius + 30 + height_basket)
        .attr('x1', cx_ball - width_basket/5)
        .attr('x2', cx_ball - width_basket/5);

        right_rope_basket.attr('y1', cy_ball + radius + 30)
        .attr('y2', cy_ball + radius + 30 + height_basket)
        .attr('x1', cx_ball + width_basket/5)
        .attr('x2', cx_ball + width_basket/5);


        // modifica colori
        balloon_ball.attr('fill', String(colorScale(d.color)));
        balloon_basket.attr('fill', String(colorScale(d.color)));



    });


    
    // ----------------------------------------
    // ----------------UPDATE------------------
    // ----------------------------------------

    divElement.selectAll(".baloon")
    .data(dataSet)
    .attr("class", "baloon")
    .each(function(d) {

     
        // Modifica la posizione e le dimensioni dell'elemento SVG
        var balloon_ball = d3.select(this).select('circle');
        var balloon_basket = d3.select(this).select('rect');
        var left_rope_balloon = d3.select(this).select('#left_rope_balloon');
        var right_rope_balloon = d3.select(this).select('#right_rope_balloon');
        var left_line_balloon = d3.select(this).select('#left_line_balloon');
        var right_line_balloon = d3.select(this).select('#right_line_balloon');
        var central_line_balloon = d3.select(this).select('#central_line_balloon');
        var left_rope_basket = d3.select(this).select('#left_rope_basket');
        var right_rope_basket = d3.select(this).select('#right_rope_basket');

        //calcolo parametri necessari
        var radius = dimBalloonSize(d.balloon_size);
        var width_basket = dimBasketSize(d.basket_size);
        var height_basket = dimBasketSize(d.basket_size)/3;
        var distance_btw_ball_basket = 30;
        
        
        // modifica area in cui viene rappresentata la mongolfiera
        var width = Math.max(maxRadius*2, maxWidth_basket) + 20;
        var height = (maxRadius*2) + maxHeight_basket + 70;
        var top_left_x = 0;
        var top_left_y = 0;

        
        var cx_ball = parseFloat(width/2);
        var cy_ball = parseFloat(radius + 20);

        // Modifica area oggetto svg
        d3.select(this).transition()
        .duration(2000)
        .attr('width', String(width + 50) + 'px')
        .attr('height', String(height) + 'px')
        .attr('viewBox', top_left_x + ' ' + top_left_y + ' ' + width + ' ' + height);


        // Aggiornamento dimensioni pallone
        balloon_ball.transition()
        .duration(2000)
        .attr('cx', cx_ball)
        .attr('cy', cy_ball)
        .attr('r', radius)
        .attr('fill', String(colorScale(d.color)));


        // Aggiornamento dimensioni cavo sinistro
        console.log(cy_ball);
        left_rope_balloon.transition()
        .duration(2000)
        .attr('y1', cy_ball)
        .attr('y2', cy_ball + radius + distance_btw_ball_basket + height_basket/3)
        .attr('x1', cx_ball - radius)
        .attr('x2', cx_ball - width_basket/2);
        
        // Aggiornamento dimensioni cavo destro
        console.log(cy_ball);
        right_rope_balloon.transition()
        .duration(2000)
        .attr('y1', cy_ball)
        .attr('y2', cy_ball + radius + distance_btw_ball_basket + height_basket/3)
        .attr('x1', cx_ball + radius)
        .attr('x2', cx_ball + width_basket/2);


        // Aggiornamento linee dentro il pallone
        left_line_balloon.transition()
        .duration(2000)
        .attr('d', "M" + cx_ball + " " + (cy_ball+radius) + " Q " + (cx_ball-radius-20) + " " + cy_ball + ", " + cx_ball + " " + (cy_ball-radius));
        
        right_line_balloon.transition()
        .duration(2000)
        .attr('d', "M" + cx_ball + " " + (cy_ball+radius) + " Q " + (cx_ball+radius+20) + " " + cy_ball + ", " + cx_ball + " " + (cy_ball-radius));
        
        central_line_balloon.transition()
        .duration(2000)
        .attr('y1', cy_ball - radius)
        .attr('y2', cy_ball + radius)
        .attr('x1', cx_ball)
        .attr('x2', cx_ball);

        
        // Aggiornamento dimensioni cesto
        balloon_basket.transition()
        .duration(2000)
        .attr('width', width_basket)
        .attr('height', height_basket)
        .attr('x', cx_ball - width_basket/2)
        .attr('y', cy_ball + radius + 30)
        .attr('fill', String(colorScale(d.color)));


        // Aggiornamento dimensioni cavi cesto
        left_rope_basket.transition()
        .duration(2000)
        .attr('y1', cy_ball + radius + 30)
        .attr('y2', cy_ball + radius + 30 + height_basket)
        .attr('x1', cx_ball - width_basket/5)
        .attr('x2', cx_ball - width_basket/5);

        right_rope_basket.transition()
        .duration(2000)
        .attr('y1', cy_ball + radius + 30)
        .attr('y2', cy_ball + radius + 30 + height_basket)
        .attr('x1', cx_ball + width_basket/5)
        .attr('x2', cx_ball + width_basket/5);
        
    });
  
  
}
  


var svgElem;

// ----------------------------------------------------------------------
// ---------------------CARICAMENTO DELLA PAGINA-------------------------
// ----------------------------------------------------------------------

window.onload = (event) => {  

    var div = document.getElementById('main_svg');

    div.style.width = document.documentElement.clientWidth + 'px';
    div.style.height = document.documentElement.clientHeight + 'px';


    
    // Carica il file SVG tramite fetch e inserisce le mongolfiere nel DOM
    fetch("./figures/custom_details_hot_air_balloon.svg")
    .then(response => response.text())
    .then(svgText => {

        // Il testo viene quindi analizzato come un documento SVG
        // utilizzando DOMParser, e l'elemento SVG risultante viene 
        // inserito all'interno del div 
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        svgElem = svgElement;
        console.log(svgElement);

        update_draw(svgElement);

        intro_animation();

    });


    // ------------------------------------------------------------------
    // Individuare quando viene selezionato qualche oggetto mongolfiera
    // ------------------------------------------------------------------
    var baloon_selection = document.getElementsByClassName('baloon');
    
    setTimeout(() => {

        for(let i = 0; i < baloon_selection.length; i++) {
            baloon_selection[i].addEventListener("click", () => {
                selection_interaction_element(i);
            });
        }

    }, dataSet.length * 100);

}
