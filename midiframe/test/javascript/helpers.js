const loggerColor = '\x1b[36m%s\x1b[0m';

export const log = (input) => {
    let logString = "[TEST] ";
    let endLogString = " [TEST]";
    let toPrint = logString + input + endLogString;
    console.log(loggerColor, toPrint);
}