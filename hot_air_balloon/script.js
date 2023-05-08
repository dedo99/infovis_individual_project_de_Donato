
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


// Ottenere i valori massimi per pos_x e pos_y
var maxPosX = d3.max(dataSet, function(d) { return d.pos_x; });
var maxPosY = d3.max(dataSet, function(d) { return d.pos_y; });
var maxBalloon_size = d3.max(dataSet, function(d) { return d.balloon_size; });
var maxBasket_size = d3.max(dataSet, function(d) { return d.basket_size; });

// Get the browser window size
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

console.log("Window width: " + windowWidth);
console.log("Window height: " + windowHeight);

// mapping su scala lineare dei valori asse X in input sulla base
// della dimensione orizzontale della finistra
const xScale = d3.scaleLinear().domain([0, maxPosX + 150]).range([0, windowWidth]);

// mapping su scala lineare dei valori asse Y in input sulla base
// della dimensione verticale della finistra
const yScale = d3.scaleLinear().domain([0, maxPosY + 150]).range([0, windowHeight]);

const dimBalloonSize = d3.scaleLinear().domain([0, maxBalloon_size]).range([0, 100]);
const dimBasketSize = d3.scaleLinear().domain([0, maxBasket_size]).range([0, 100]);

// scala di colori dell'arcobaleno compresi tra i valori 0 e 255
const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 255]);


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

function change_attributesValue_Balloon(index_one, index_two){
    element_one = dataSet[index_one];
    element_two = dataSet[index_two];
    console.log(element_one);
    console.log(element_two);
    // scambio
    temp_one_balloon_size = element_one.balloon_size;
    temp_one_basket_size = element_one.basket_size;
    temp_one_color = element_one.color;
    element_one.balloon_size = element_two.balloon_size;
    element_one.basket_size = element_two.basket_size;
    element_one.color = element_two.color;
    element_two.balloon_size = temp_one_balloon_size;
    element_two.basket_size = temp_one_basket_size;
    element_two.color = temp_one_color;
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
        balloon_ball.attr('fill', 'white');
        balloon_basket.attr('fill', 'white');
    }
    if (selected_elements.size() == 1){
        if (selected_elements.nodes()[0] === current_HotAirBaloon) {
            current_HotAirBaloon.attr('class', 'baloon');
            var color = String(colorScale(dataSet[index].color))
            balloon_ball.attr('fill', color);
            balloon_basket.attr('fill', color);
        } else {
            // avviene lo scambio dei parametri
            selected_elements.nodes()[0].setAttribute('class', 'baloon');
            const current_HotAirBaloon_Id = current_HotAirBaloon.attr('id');
            const selectedElementId = selected_elements.nodes()[0].getAttribute('id');
            const index_current = parseInt(current_HotAirBaloon_Id.substring(1));
            const index_selected = parseInt(selectedElementId.substring(1));
            change_attributesValue_Balloon(index_current, index_selected);
            update_draw(svgElem);
        }

    }
    // console.log(first_HotAirBaloon);

    
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
    .attr("transform", (d) => "translate(" + xScale(d.pos_x) + "," + yScale(d.pos_y) + ")")
    .each(function(d) {

        // Modifica la posizione e le dimensioni dell'elemento SVG
        var balloon_ball = d3.select(this).select('g circle');
        var balloon_basket = d3.select(this).select('rect');

        var radius = dimBalloonSize(d.balloon_size);
        var width_basket = dimBasketSize(d.basket_size);
        var height_basket = dimBasketSize(d.basket_size)/3;
        balloon_ball.attr('r', radius);
        balloon_basket.attr('width', width_basket);
        balloon_basket.attr('height', height_basket);

        // modifica colori
        balloon_ball.attr('fill', String(colorScale(d.color)));
        balloon_basket.attr('fill', String(colorScale(d.color)));

        var width = Math.max(radius*2, width_basket);
        var height = (radius*2) + height_basket + 50;

        d3.select(this).attr('width', String(width + 50) + 'px');
        d3.select(this).attr('height', String(height) + 'px');

    });


    
    // ----------------------------------------
    // ----------------UPDATE------------------
    // ----------------------------------------

    divElement.selectAll(".baloon")
    .data(dataSet)
    .attr("id", (d, i) => "b" + i)
    .attr("class", "baloon")
    .attr("transform", (d) => "translate(" + xScale(d.pos_x) + "," + yScale(d.pos_y) + ")")
    .each(function(d) {

        // Modifica la posizione e le dimensioni dell'elemento SVG
        var balloon_ball = d3.select(this).select('g circle');
        var balloon_basket = d3.select(this).select('rect');

        var radius = dimBalloonSize(d.balloon_size);
        var width_basket = dimBasketSize(d.basket_size);
        var height_basket = dimBasketSize(d.basket_size)/3;
        balloon_ball.attr('r', radius);
        balloon_basket.attr('width', width_basket);
        balloon_basket.attr('height', height_basket);

        // modifica colori
        balloon_ball.attr('fill', String(colorScale(d.color)));
        balloon_basket.attr('fill', String(colorScale(d.color)));

        var width = Math.max(radius*2, width_basket);
        var height = (radius*2) + height_basket + 50;

        d3.select(this).attr('width', String(width + 50) + 'px');
        d3.select(this).attr('height', String(height) + 'px');

    });

  
  
}
  




var svgElem;

// ----------------------------------------------------------------------
// ---------------------CARICAMENTO DELLA PAGINA-------------------------
// ----------------------------------------------------------------------

window.onload = (event) => {  
    
    // Carica il file SVG tramite fetch e inserisce le mongolfiere nel DOM
    fetch("./figures/hot_air_baloon.svg")
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

    }, dataSet.length);

}
