import {get_random_int, ruletka} from "./utils";
import {ArtifactType} from "./artifact";

/**
 * 圣遗物属性类型
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 *
 */
export enum Stat {
    Hp = 0,                     // 生命值
    Atk = 1,                    // 攻击力
    Def = 2,                    // 防御力
    HpPercent = 3,              // 生命值%
    AtkPercent = 4,             // 攻击力%
    DefPercent = 5,             // 防御力%
    ElementalMastery = 6,       // 元素精通
    EnergyRecharge = 7,         // 元素充能效率
    CriticalRate = 8,           // 暴击率
    CriticalDamage = 9,         // 暴击伤害
    HealingBonus = 10,          // 治疗加成
    ElementalDamageBonus = 11,  // 元素伤害加成
    PhysicalDamageBonus = 12,   // 物理伤害加成
}

export type StatsTableObject = { mainStatValue?: number[], subStatValue?: number[], subStatWeight?: number, localization?: Record<string, string> };

/**
 * 词条表
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 */
export const StatsTable : Record<Stat, StatsTableObject> = {
    [Stat.Hp] : {
        // 生命值
        mainStatValue: [
            717, 920, 1123, 1326, 1530,
            1733, 1936, 2139, 2342, 2545,
            2749, 2952, 3155, 3358, 3561,
            3764, 3967, 4171, 4374, 4577, 4780
        ],
        subStatValue: [209, 239, 269, 299],
        subStatWeight: 6,
        localization: {
            "zh_cn": "生命值"
        }
    },
    [Stat.Atk]: {
        // 攻击力
        mainStatValue: [
            47, 60, 73, 86, 100,
            113, 126, 139, 152, 166,
            179, 192, 205, 219, 232,
            245, 258, 272, 285, 298, 311
        ],
        subStatValue: [14, 16, 18, 19],
        subStatWeight: 6,
        localization: {
            "zh_cn": "攻击力"
        }
    },
    [Stat.Def]: {
        // 防御力
        mainStatValue: undefined,
        subStatValue: [16, 19, 21, 23],
        subStatWeight: 6,
        localization: {
            "zh_cn": "防御力"
        }
    },
    [Stat.HpPercent]: {
        // 生命值 百分比
        mainStatValue: [
            0.07, 0.09, 0.11, 0.129, 0.149,
            0.169, 0.189, 0.209, 0.228, 0.248,
            0.268, 0.288, 0.308, 0.328, 0.348,
            0.367, 0.387, 0.407, 0.427, 0.446, 0.466
        ],
        subStatValue: [0.041, 0.047, 0.053, 0.058],
        subStatWeight: 4,
        localization:{
            "zh_cn": "生命值"
        }
    },
    [Stat.AtkPercent]: {
        // 攻击力 百分比
        mainStatValue: [
            0.07, 0.09, 0.11, 0.129, 0.149,
            0.169, 0.189, 0.209, 0.228, 0.248,
            0.268, 0.288, 0.308, 0.328, 0.348,
            0.367, 0.387, 0.407, 0.427, 0.446, 0.466
        ],
        subStatValue: [0.041, 0.047, 0.053, 0.058],
        subStatWeight: 4,
        localization: {
            "zh_cn": "攻击力"
        }
    },
    [Stat.DefPercent]: {
        // 防御力 百分比
        mainStatValue: [
            0.087, 0.112, 0.137, 0.162, 0.186,
            0.211, 0.236, 0.261, 0.286, 0.31,
            0.335, 0.36, 0.385, 0.409, 0.434,
            0.459, 0.484, 0.508, 0.533, 0.558, 0.583
        ],
        subStatValue: [0.051, 0.058, 0.066, 0.073],
        subStatWeight: 4,
        localization:{
            "zh_cn": "防御力"
        }
    },
    [Stat.ElementalMastery]: {
        // 元素精通
        mainStatValue: [
            28, 36, 44, 52, 60,
            68, 76, 84, 91, 99,
            107, 115, 123, 131, 139,
            147, 155, 163, 171, 179, 187
        ],
        subStatValue:  [16, 19, 21, 23],
        subStatWeight: 4,
        localization: {
            "zh_cn": "元素精通"
        }
    },
    [Stat.EnergyRecharge]: {
        // 元素充能效率
        mainStatValue:[
            0.078, 0.1, 0.122, 0.144, 0.166,
            0.188, 0.21, 0.232, 0.254, 0.276,
            0.298, 0.32, 0.342, 0.364, 0.386,
            0.408, 0.43, 0.452, 0.474, 0.496, 0.518
        ],
        subStatValue: [0.045, 0.052, 0.058, 0.065],
        subStatWeight: 4,
        localization: {
            "zh_cn": "元素充能效率"
        }
    },
    [Stat.CriticalRate]: {
        // 暴击率
        mainStatValue: [
            0.047, 0.06, 0.073, 0.086, 0.099,
            0.113, 0.126, 0.139, 0.152, 0.166,
            0.179, 0.192, 0.205, 0.218, 0.232,
            0.245, 0.258, 0.271, 0.284, 0.298, 0.311
        ],
        subStatValue: [0.027, 0.031, 0.035, 0.039],
        subStatWeight: 3,
        localization: {
            "zh_cn": "暴击率"
        }
    },
    [Stat.CriticalDamage]: {
        // 暴击伤害
        mainStatValue: [
            0.093, 0.12, 0.146, 0.173, 0.199,
            0.225, 0.252, 0.278, 0.305, 0.331,
            0.357, 0.384, 0.41, 0.437, 0.463,
            0.49, 0.516, 0.542, 0.569, 0.595, 0.622
        ],
        subStatValue: [0.054, 0.062, 0.07, 0.078],
        subStatWeight: 3,
        localization: {
            "zh_cn": "暴击伤害"
        }
    },
    [Stat.HealingBonus]: {
        // 治疗加成
        mainStatValue: [
            0.054, 0.069, 0.084, 0.1, 0.115,
            0.13, 0.145, 0.161, 0.176, 0.191,
            0.206, 0.221, 0.237, 0.252, 0.267,
            0.282, 0.298, 0.313, 0.328, 0.343, 0.359
        ],
        subStatValue: undefined,
        localization: {
            "zh_cn": "治疗加成"
        }
    },
    [Stat.ElementalDamageBonus]: {
        // 元素伤害加成
        mainStatValue: [
            0.07, 0.09, 0.11, 0.129, 0.149,
            0.169, 0.189, 0.209, 0.228, 0.248,
            0.268, 0.288, 0.308, 0.328, 0.348,
            0.367, 0.387, 0.407, 0.427, 0.446, 0.466
        ],
        subStatValue: undefined,
        localization: {
            "zh_cn": "元素伤害加成"
        }
    },
    [Stat.PhysicalDamageBonus]: {
        // 物理伤害加成
        mainStatValue: [
            0.087, 0.112, 0.137, 0.162, 0.186,
            0.211, 0.236, 0.261, 0.286, 0.31,
            0.335, 0.36, 0.385, 0.409, 0.434,
            0.459, 0.484, 0.508, 0.533, 0.558, 0.583
        ],
        subStatValue: undefined,
        localization: {
            "zh_cn": "物理伤害加成"
        }
    }
}


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
