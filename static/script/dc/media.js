define("dc/media",[],function(){
        navigator.getMedia = ( navigator.getUserMedia||
                navigator.webkitGetUserMedia||
                navigator.mozGetUserMedia||
                navigator.msGetUserMedia);
        return{
                setVideo:function(video){this.setMedia({
                        video: true,
                        audio: true,
                },video)},
                setAudio:function(audio){this.setMedia({
                        video: false,
                        audio: true,
                },audio)},
                setMedia:function(arg,media){
                        navigator.getMedia(arg,function(stream){
                                if (navigator.mozGetUserMedia){
                                        media.mozSrcObject=stream;
                                }else{
                                        var vendorURL = window.URL || window.webkitURL;
                                        media.src = vendorURL.createObjectURL(stream);
                                }
                                media.play();
                        },function(err){
                                console.log("An error occured! " + err);
                        });
                },
        };
});
