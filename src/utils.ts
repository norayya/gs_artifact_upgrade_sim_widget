/**
 * 随机从数组中选出一个成员, 并返回
 *
 * @param array 被选择的数组
 *
 * @return 选出的成员
 */
export function Ruletka<T>(array: T[]): T {
    const idx = GetRandom(ValueType.Int, 0, array.length);
    return array[idx];
}

/**
 * 随机数类型
 */
export enum ValueType {
    Int = "int",
    Float = "float"
}

/**
 * 取随机数
 *
 * @param type 随机数类型
 * @param min 最小值
 * @param max 最大值
 *
 * @returns [min, max)左闭右开区间(包含min但不包含max)中的随机一个值
 *
 * @throws 随机数类型type参数错误
 *
 */
export function GetRandom(type: ValueType, min: number, max: number): number {
    switch (type) {
        case ValueType.Int:
            return Math.floor(Math.random() * (max - min)) + min;
        case ValueType.Float:
            return Math.random() * (max - min) + min;
        default:
            throw new Error(`Unknown random type ${type}`);
    }
}

/**
 * 格式化数字到字符串, 用于为浮点数转换为百分号制字符串
 *
 * @param n 被转换的数值
 * @param decimals 保留小数点位数
 * @param trailing 是否保留小数位的尾数0
 *
 * @throws 输入参数n不是可被处理的数字
 */
export function FloatToPercentString(n: number, decimals: number, trailing: boolean): string {
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