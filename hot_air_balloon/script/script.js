// VARIABILI DATASET
// pos_x -> la posizione orizzontale della mongolfiera
// pos_y -> la posizione verticale della mongolfiera
// balloon_size -> la grandezza del pallone della mongolfiera
// basket_size -> la grandezza del cesto della mongolfiera
// color -> il colore della mongolfiera


// VARIABILI GLOBALI
var colorScale;
var xScale;
var yScale;
var dimBalloonSize;
var dimBasketSize;
var maxRadius;
var maxWidth_basket;
var maxHeight_basket;
var maxHeight;
var maxWidth;


// funzione di setup di tutte le dimensioni necessarie per disegnare gli oggetti
// in maniera proporzionata rispetto alla finestra del browser
function setupDraw(dataSet){

    // Dimensioni della pagina del browser
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;

    console.log("Window width: " + windowWidth);
    console.log("Window height: " + windowHeight);

    // Ottenere i valori massimi per pos_x e pos_y
    var maxPosX = d3.max(dataSet, function(d) { return d.pos_x; });
    var maxPosY = d3.max(dataSet, function(d) { return d.pos_y; });
    var maxBalloon_size = d3.max(dataSet, function(d) { return d.balloon_size; });
    var maxBasket_size = d3.max(dataSet, function(d) { return d.basket_size; });

    if (windowWidth > 1000){
        // scalatura delle dimensioni del pallone e del cesto
        dimBalloonSize = d3.scaleLinear().domain([0, maxBalloon_size]).range([0, windowWidth/14]);
        dimBasketSize = d3.scaleLinear().domain([0, maxBasket_size]).range([0, windowWidth/14]);
        console.log("Maggiore di 1000")
    } else{
        // scalatura delle dimensioni del pallone e del cesto
        dimBalloonSize = d3.scaleLinear().domain([0, maxBalloon_size]).range([0, windowWidth/10]);
        dimBasketSize = d3.scaleLinear().domain([0, maxBasket_size]).range([0, windowWidth/10]);
        console.log("Minore di 1000")
    }


    // scala di colori dell'arcobaleno compresi tra i valori 0 e 255
    colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 255]);

    // calcolo delle dimensioni maggiori per il raggio, altezza e largezza del cesto
    maxRadius = dimBalloonSize(maxBalloon_size);
    maxWidth_basket = dimBasketSize(maxBasket_size);
    maxHeight_basket = dimBasketSize(maxBasket_size)/3;

    // massima altezza dell'elemento svg 
    maxHeight = (maxRadius*2) + maxHeight_basket + 70;
    maxWidth = Math.max(maxRadius*2, maxWidth_basket) + 20;


    // mapping su scala lineare dei valori asse X in input sulla base
    // della dimensione orizzontale della finistra
    xScale = d3.scaleLinear().domain([0, maxPosX]).range([0, windowWidth - maxWidth*1.2]);

    // mapping su scala lineare dei valori asse Y in input sulla base
    // della dimensione verticale della finistra
    yScale = d3.scaleLinear().domain([0, maxPosY]).range([0, windowHeight - maxHeight]);


}




/////////////////////////////////////
////////// EVENT LISTENER ///////////
/////////////////////////////////////

// Quando viene avvertita una modifica della dimensione della 
// finestra della pagina viene ricaricata e settata con i nuovi parametri
window.addEventListener('resize', function () { 
    window.location.reload();
});


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



var is_Animation = false;

function selection_interaction_element(index){

    if (is_Animation){
        return
    }

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
        is_Animation = true;
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
        setTimeout(() => is_Animation = false, 2000);
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
  

var dataSet;

var svgElem;

// ----------------------------------------------------------------------
// ---------------------CARICAMENTO DELLA PAGINA-------------------------
// ----------------------------------------------------------------------

window.onload = (event) => {  

    fetch('./data/dataset.json')
    .then(response => response.json())
    .then(data => {
        // Ora dataSet conterrà i dati del file JSON
        dataSet = data;
        console.log(dataSet);

        // crea tutte le impostazioni per la visualizzazione
        setupDraw(dataSet);
        
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
    
    
        // ------------------------------------------------------------------
        // Gestione comparsa finistra con descrizione per task affrontato
        // ------------------------------------------------------------------
    
        var consegna = document.getElementById("consegna");
    
        consegna.addEventListener('click', () => {
            // Ottenere il riferimento all'elemento <svg> utilizzando l'ID
            var svgElement = document.getElementById('main_svg');
    
            // Ottenere il riferimento all'elemento <div> utilizzando l'ID o un altro selettore
            var div_consegna = document.getElementById('div_consegna');
    
            // Ottenere l'oggetto che rappresenta i valori di stile calcolati
            var consegnaStyle = window.getComputedStyle(div_consegna);
    
            // Ottenere i valori di stile specifici
            var height_consegna = consegnaStyle.height;
    
            // Ottenere il valore corrente del parametro top
            var currentTop = svgElement.style.top;
    
            if (currentTop == '0px'){
                // Modificare il valore del parametro top
                svgElement.style.top = height_consegna;
                div_consegna.style.color = 'black';
            } else {
                svgElement.style.top = '0px';
                // div_consegna.style.color = 'white';
    
            }
    
            console.log('Nuovo valore del parametro top:', svgElement.style.top);
    
        });
    
        
    })
    .catch(error => {
        // Gestione dell'errore nel caso in cui il recupero dei dati JSON fallisca
        console.error('Errore nel recupero dei dati JSON:', error);
    });




}
