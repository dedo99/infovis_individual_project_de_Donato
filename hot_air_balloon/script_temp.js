
function draw(svgElement){

    const divElement = document.getElementById("main_svg");

    dataSet.forEach(function(element, index, array) {           
        
        var clonedElement = svgElement.cloneNode(true); 
        
        // Modifica la posizione e le dimensioni dell'elemento SVG
        clonedElement.setAttribute('id', "b" + String(index))
        clonedElement.setAttribute('class', 'baloon');
        var balloon_ball = clonedElement.querySelector('g circle');
        var balloon_basket = clonedElement.querySelector('rect');
        
        var radius = dimBalloonSize(element.balloon_size);
        var width_basket = dimBasketSize(element.basket_size);
        var height_basket = dimBasketSize(element.basket_size)/3;
        balloon_ball.attributes.r.value = radius;
        balloon_basket.attributes.width.value = width_basket;
        balloon_basket.attributes.height.value = height_basket;

        // modifica colori
        balloon_ball.setAttribute('fill', String(colorScale(element.color)));
        balloon_basket.setAttribute('fill', String(colorScale(element.color)));

        var width = Math.max(radius*2, width_basket);
        var height = (radius*2) + height_basket + 50;
        
        clonedElement.setAttribute('width', String(width + 50) + 'px');
        clonedElement.setAttribute('height', String(height) + 'px');
        clonedElement.setAttribute('transform', 'translate('+ String(xScale(element.pos_x)) + ',' + String(yScale(element.pos_y)) +')');

        // appendi l'elemento balloon al div
        divElement.appendChild(clonedElement);
        console.log(clonedElement);
    });

    intro_animation();

}
