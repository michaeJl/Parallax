
const scroll = () => {

    const  layers = document.querySelectorAll(".img_parallax");
    layers.forEach(item=>{
        const lays = getCoords(item);
        const translate3d = "translate3d(-50%," + (-100) +"px, 0px)";
                    item.style.transform = translate3d;
    })
    
    window.addEventListener('scroll',()=> {
        const  topDistance = pageYOffset;
        
        const movement = -(topDistance * 0.2);
        
        for (let layer in layers) {
            const lays = getCoords(layers[layer]);
                
            if (lays){
                if (topDistance+(document.documentElement.clientHeight)*2 >= lays.top && topDistance-(document.documentElement.clientHeight)*2 <= lays.bottom){
                    const translate3d = "translate3d(-50%," +((-100)+ movement) +"px, 0px)";
                    layers[layer].style.transform = translate3d;
                }
            }  
        }
    });
    function getCoords(elem) {
        if (elem.nodeName){
            let box = elem.getBoundingClientRect();
            return {
                top: Math.round(box.top + pageYOffset),
                bottom: Math.round(box.bottom + pageXOffset)
            };
        }
      };
      console.log(window.screen.height);
};


export default scroll;