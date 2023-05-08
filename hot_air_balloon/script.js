
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

var selected_elements;

function selection_first_element(index){


    console.log("Clicked index: " + index);
    first_HotAirBaloon = d3.select('#b' + String(index));
    var balloon_ball = first_HotAirBaloon.select('circle');
    var balloon_basket = first_HotAirBaloon.select('rect');

    selected_elements = d3.selectAll('.selected');
    
    
    console.log(Array.isArray(selected_elements)); // restituisce true se elements è un array

    console.log(selected_elements);
    console.log("Elementi selezionati: " + String(selected_elements.size()));

    if (selected_elements.size() == 0){
        console.log(selected_elements.nodes()[0]);
        first_HotAirBaloon = selected_elements.nodes()[0];
        first_HotAirBaloon.attr('class', 'baloon selected');
        balloon_ball.attr('fill', 'white');
        balloon_basket.attr('fill', 'white');
    }
    if (selected_elements.size() == 1){
        if (first_HotAirBaloon.classed('selected')) {
            first_HotAirBaloon.attr('class', 'baloon');
            var color = String(colorScale(dataSet[index].color))
            balloon_ball.attr('fill', color);
            balloon_basket.attr('fill', color);
        } else {
            
    
        }
    }




    // console.log(first_HotAirBaloon);

    
}


function selection_second_element(){
    
}

function setColorFill(index, color){
    var balloon_ball = d3.select('#' + String(index) + ' circle');
    var balloon_basket = d3.select('#' + String(index) + ' rect');

    balloon_ball.attr("fill", colorScale(color));
    ba
}

window.onload = (event) => {
    var svg = d3.select("svg");
    const divElement = document.getElementById("main_svg");
    
    
    // Carica il file SVG tramite fetch e inserisce le mongolfiere nel DOM
    fetch("./figures/hot_air_baloon.svg")
    .then(response => response.text())
    .then(svgText => {
        
        dataSet.forEach(function(element, index, array) {

            // Il testo viene quindi analizzato come un documento SVG
            // utilizzando DOMParser, e l'elemento SVG risultante viene 
            // inserito all'interno del div 
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            divElement.appendChild(svgElement);
                        
            
            // Modifica la posizione e le dimensioni dell'elemento SVG
            svgElement.setAttribute('id', "b" + String(index))
            svgElement.setAttribute('class', 'baloon');
            var balloon_ball = svgElement.querySelector('g circle');
            var balloon_basket = svgElement.querySelector('rect');
            
            var radius = dimBalloonSize(element.balloon_size);
            var width_basket = dimBasketSize(element.basket_size);
            var height_basket = dimBasketSize(element.basket_size)/3;
            balloon_ball.attributes.r.value = radius;
            balloon_basket.attributes.width.value = width_basket;
            balloon_basket.attributes.height.value = height_basket;

            // modifica colori
            balloon_ball.setAttribute('fill', String(colorScale(element.color))); // imposta il colore rosso
            balloon_basket.setAttribute('fill', String(colorScale(element.color))); // imposta il colore blu

            var width = Math.max(radius*2, width_basket);
            var height = (radius*2) + height_basket + 50;
            
            svgElement.setAttribute('width', String(width + 50) + 'px');
            svgElement.setAttribute('height', String(height) + 'px');
            svgElement.setAttribute('transform', 'translate('+ String(xScale(element.pos_x)) + ',' + String(yScale(element.pos_y)) +')');
        });

        intro_animation();
    });


    // ------------------------------------------------------------------
    // Individuare quando viene selezionato qualche oggetto mongolfiera
    // ------------------------------------------------------------------
    var baloon_selection = document.getElementsByClassName('baloon');
    
    setTimeout(() => {

        for(let i = 0; i < baloon_selection.length; i++) {
            baloon_selection[i].addEventListener("click", () => {
                selection_first_element(i);
            });
        }

    }, dataSet.length);

}
