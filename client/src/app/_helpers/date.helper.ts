import * as moment from "moment";

function getDateDiffInSeconds(start: Date, end: Date): number {
    const diff = moment(end).diff(start);
    return Math.trunc(moment.duration(diff).asSeconds());
}

function secondsToText(value: number): string {
    let count = 60 * 60 * 24 * 7;
    if (value > count) {
        return `About ${Math.floor(value / count)} weeks to complete`;
    }

    if (value < -count) {
        return `About ${Math.abs(Math.floor(value / count))} weeks expired`;
    }

    count /= 7;
    if (value > count) {
        return `About ${Math.floor(value / count)} days to complete`;
    }

    if (value < -count) {
        return `About ${Math.abs(Math.floor(value / count))} days expired`;
    }

    count /= 24;
    if (value > count) {
        return `About ${Math.floor(value / count)} hours to complete`;
    }

    if (value < -count) {
        return `About ${Math.abs(Math.floor(value / count))} hours expired`;
    }

    count /= 60;
    if (value > count) {
        return `About ${Math.floor(value / count)} minutes`;
    }

    if (value < -count) {
        return `About ${Math.abs(Math.floor(value / count))} minutes expired`;
    }

    return value >= 0 ? `${value} seconds` : `${Math.abs(value)} seconds expired`;
}

export { getDateDiffInSeconds, secondsToText };
