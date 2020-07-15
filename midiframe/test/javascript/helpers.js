const loggerColor = '\x1b[36m%s\x1b[0m';

export const log = (input) => {
    let logString = "[TEST] ";
    let endLogString = " [TEST]";
    let toPrint = logString + input + endLogString;
    console.log(loggerColor, toPrint);
}


export class VideoJsMock {

    constructor(videoId) {
        this.videoId = videoId;
        this.time = 50;
        this.playing = false;
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.playing = true;
    }

    pause() {
        this.paused = true;
        this.playing = false;
    }

    currentTime(amount = false) {
        if (amount) {
            this.time = amount;
            return;
        }
        return this.time;
    }

    duration() {
        return 100;
    }
}