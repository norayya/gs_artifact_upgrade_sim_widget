import {get_random_int, ruletka} from "./utils";


/**
 * 如果是百分比数值, 转换为百分比字符串
 *
 * 否则直接转换为字符串
 * @param n
 */
export const ParseString = (n: number): string => {
    // 取词条当前强化档位对应的数值

    let str = '';
    if(n <= 1){
        str = (n*100).toFixed(1).toString();
        str += "%";
    }else{
        str = n.toString();
    }
    return str;
}


/**
 * 副词条
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 */
export class SubStat {

    /**
     * 随机一个可能出现的圣遗物副词条
     *
     * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Distribution
     *
     * @param {Stat[]} current_stats 传入现有的词条组合
     *
     * @returns {Stat} 选出的副词条
     *
     * @throws {Error} 算法错误
     * @throws {Error} 函数内部调用了`get_sub_stat_weight()`, 继承其异常
     */
    public static get_new_sub_stat(current_stats: Stat[]): Stat {
        /*
         传入参数时, 需将当前圣遗物的主副词条都传入, 即便是元素伤害加成这类不能在副词条中出现的词条.
         虽然在逻辑上不必要, 但为了简化算法请务必这么做.
         如果这个算法没有出现问题, 请不要修改这个算法.
         */

        // 取可能出现的副词条类型 和 已有词条的差集
        const ev = Object.keys(Stat).filter(k => !isNaN(Number(k))).map( k=> Number(k)) as Stat[];
        const pool: Stat[] = ev.filter(k => StatsTable[k].subStatValue !== undefined && StatsTable[k].subStatWeight !== undefined)
            .filter(k => !current_stats.includes(k));

        // 求权重和
        let sum_w: number = 0;
        pool.forEach(x => sum_w += StatsTable[x].subStatWeight as number);

        // 对权重和求随机数
        const r = get_random_int(0, sum_w);

        // 遍历奖池, 如果叠加权重大于随机数, 命中词条
        let k = 0;

        for (let i = 0; i < pool.length; i++) {
            k += StatsTable[pool[i]].subStatWeight as number;
            if(k >= r) {
                return pool[i];
            }
        }

        // 如果没有命中, 那么
        // 也许是这个算法出了问题
        throw new Error("算法错误");

    }
}
