/**
 * 取整数范围内随机数
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 取浮点数范围内随机数
 * @param min
 * @param max
 */
export function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}