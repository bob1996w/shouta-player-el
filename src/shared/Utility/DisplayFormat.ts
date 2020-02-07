export class DisplayFormat {
    public static seconds2TimeString(source: number): string {
        let time = Math.floor(source);
        let seconds = time % 60;
        let minutes = Math.floor((time / 60)) % 60;
        let hours = Math.floor(time / 3600);
        return (hours > 0)? 
            `${hours}:${this.padTo2Digit(minutes)}:${this.padTo2Digit(seconds)}`: 
            `${minutes}:${this.padTo2Digit(seconds)}`;
    }

    private static padTo2Digit(source: number): string {
        let isNegative = source < 0;
        let absSource = Math.abs(source);
        if (absSource >= 10) return `${isNegative? '-': ''}${source}`;
        else return `${isNegative? '-': ''}0${source}`;
    }
}