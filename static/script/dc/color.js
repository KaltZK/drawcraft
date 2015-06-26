define("dc/color",{
        hexToRgb:function(hex){
                var value=parseInt(hex.replace(/([^0-9a-zA-Z])*/,''),16);
                var rgb=[];
                while(value){
                        rgb.push(value%256);
                        value=Math.floor(value/256);
                }
                rgb.reverse();
                return rgb;
        },
        rgbToHex:function(rgb){
                rgb.reverse();
                var w=0,r=1,bits=[];
                rgb.forEach(function(x){w+=x*r;r*=256;});
                while(w){
                        var b=w%16;
                        w=Math.floor(w/16);
                        bits.push(b<10 ? b.toString(): String.fromCharCode(b-10+65));
                }
                return "#"+bits.reduce(function(x,y){return x+y});
        },
        invert:function(hex){
                return "#"+hex.split('')
                .map(function(c){return 15-parseInt(c,16)})
                .filter(function(n){return !isNaN(n)})
                .map(function(n){return n<10?n.toString():String.fromCharCode(n-10+65)})
                .join('');
        },
});
