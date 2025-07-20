/**
 * 获取一个范围区间的随机整数
 *
 * @param {number} min 最小值
 * @param {number} max 最大值
 *
 * @return {number} [min, max)左闭右开区间(包含min但不包含max)中的随机一个整数值
 */
export function get_random_int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 获取一个范围区间的随机浮点数
 *
 * @param {number} min 最小值
 * @param {number} max 最大值
 *
 * @return {number} [min, max)左闭右开区间(包含min但不包含max)中的随机一个浮点数值
 */
export function get_random_float(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 随机从数组中选出一个成员, 并返回
 *
 * @template T
 *
 * @param {T[]} array 被选择的数组
 *
 * @return {T}   选出的成员
 */
export function ruletka<T>(array: T[]): T {
    const idx = get_random_int(0, array.length);
    return array[idx];
}