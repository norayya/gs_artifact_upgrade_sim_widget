export function floatToPercentString(n: number, decimals: number, trailing: boolean): string {
    if(Number.isNaN(n) || !Number.isFinite(n)) {
        throw new Error(`${n} is not a number`);
    }

    let num = n * 100;
    const p = Math.pow(10, decimals);
    num = Math.round((num + Number.EPSILON) * p) / p;

    let result = num.toFixed(decimals);

    if(!trailing) {
        // 去除结果的0 和多余的小数点
        result = result.replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
    }

    return `${result}%`;
}