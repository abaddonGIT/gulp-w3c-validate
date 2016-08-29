/**
 * Created by Abaddon on 23.08.2016.
 */
import Base from "./BaseParallax";
import Uses from "../utility/UsesFunction";
import Promise from "promise";

class VideoParallax extends Base {
    constructor(box) {
        super();
        this.box = box;
    }

    /**
     * Start parallax
     */
    start() {
        super.start();
        if (!Uses.isLiteMode()) {
            this.loadVideo().then(() => {
                this.setBlock();
            }, function () {
                console.error("Source load error!");
            });
        } else {
            this.loadImg().then(() => {
                this.setBlock();
            }, function () {
                console.error("Source load error!");
            });
        }
    }

    /**
     * Load video source
     */
    loadVideo() {
        return new Promise(function (resolve, reject) {
            let video = this.box.getInner();
            video.load();
            video.play();
            this.setVideoTagSettings();
            video.onloadeddata = () => {
                this.box.setOricSizes({width: video.videoWidth, height: video.videoHeight});
                resolve();
            };
            video.onerror = function () {
                reject();
            };
            //set sources error handlers
            let sourceLn = this.box.sources.length;
            if (sourceLn) {
                while (sourceLn--) {
                    let source = this.box.sources[sourceLn];
                    source.onerror = function () {
                        reject();
                    }
                }
            }
        }.bind(this));
    }

    /**
     * Set video settings
     */
    setVideoTagSettings() {
        let video = this.box.getInner(),
            loop = video.getAttribute("data-loop"),
            volume = parseInt(video.getAttribute("data-volume"));

        if (!isNaN(volume)) {
            video.volume = volume / 100;
        }

        if (loop === "true") {
            video.onended = function () {
                video.pause();
                video.currentTime = 0;
                video.load();
                video.play();
            }
        }
    }

    /**
     * Load img source
     */
    loadImg() {
        this.box.removeVideo();
        return super.loadImg();
    }

    /**
     * Calc and set sizes for block
     */
    setBlock() {
        this.resizeTick();
    }
}


export default VideoParallax;