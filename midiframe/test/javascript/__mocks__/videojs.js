export default class videojs {

    constructor(videoId) {
        this.videoId = videoId;
        this.controlBar = {
            show: () => 'shown',
            hide: () => 'hidden'
        }
    }

    duration() {
        return 100;
    }

    currentTime() {
        return 75;
    }

    play() {

    }

    pause() {

    }



}