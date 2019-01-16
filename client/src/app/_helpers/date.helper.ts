import * as moment from "moment";

function getDateDiffInSeconds(start: Date, end: Date): number {
    const diff = moment(end).diff(start);
    return Math.trunc(moment.duration(diff).asSeconds());
}

function secondsToText(value: number): string {
    let count = 60 * 60 * 60 * 24;
    if (value > count) {
        return `${Math.floor(value / count)} w.`;
    }

    if (value < -count) {
        return `${Math.floor(value / count)} w.`;
    }

    count /= 24;
    if (value > count) {
        return `${Math.floor(value / count)} d.`;
    }

    if (value < -count) {
        return `${Math.floor(value / count)} d.`;
    }

    count /= 60;
    if (value > count) {
        return `${Math.floor(value / count)} h.`;
    }

    if (value < -count) {
        return `${Math.floor(value / count)} h.`;
    }

    count /= 60;
    if (value > count) {
        return `${Math.floor(value / count)} m.`;
    }

    if (value < -count) {
        return `${Math.floor(value / count)} m.`;
    }

    return `${value} s.`;
}

export { getDateDiffInSeconds, secondsToText };
