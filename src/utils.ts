/**
 * 随机从数组中选出一个成员, 并返回
 *
 * @template T
 *
 * @param {T[]} array 被选择的数组
 *
 * @return {T}   选出的成员
 */
export function Ruletka<T>(array: T[]): T {
    const idx = GetRandom(RandomType.Int, 0, array.length);
    return array[idx];
}

/**
 * 随机数类型
 */
export enum RandomType {
    Int = "int",
    Float = "float"
}

/**
 * 取随机数
 *
 * @param {RandomType} type 随机数类型
 * @param {number} min 最小值
 * @param {number} max 最大值
 *
 * @returns {number}  [min, max)左闭右开区间(包含min但不包含max)中的随机一个值
 *
 * @error 传参错误
 *
 */
export function GetRandom(type: RandomType, min: number, max: number): number {
    switch (type) {
        case RandomType.Int:
            return Math.floor(Math.random() * (max - min)) + min;
        case RandomType.Float:
            return Math.random() * (max - min) + min;
        default:
            throw new Error(`Unknown random type ${type}`);
    }
}