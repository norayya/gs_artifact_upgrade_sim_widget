import {get_random_int, ruletka} from "./utils";
import {ArtifactType} from "./artifact";

/**
 * 圣遗物词条类型
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

/**
 * 元素伤害加成可能出现的属性类型
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Distribution #Goblet of Eonothem
 */
export enum ElementalDamageStat {
    PyroDamageBonus = 0,        // 火属性伤害加成
    ElectroDamageBonus = 1,     // 雷属性伤害加成
    CryoDamageBonus = 2,        // 冰属性伤害加成
    HydroDamageBonus = 3,       // 水属性伤害加成
    DendroDamageBonus = 4,      // 草属性伤害加成
    AnemoDamageBonus = 5,       // 风属性伤害加成
    GeoDamageBonus = 6,         // 岩属性伤害加成
}


/**
 * 主词条
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 */
export class MainStat {
    /**
     * 通过主词条参数获取对应的强化可能值数组
     *
     * @param {Stat} stat 主词条类型
     *
     * @return {number[]} 对应的强化数值数组, 下标即强化等级
     *
     * @throws {Error} 传递了主词条不存在的词条类型
     */
    private static get_value_table_by_stat(stat: Stat): number[] {
        if(stat === Stat.Hp){
            return [
                717, 920, 1123, 1326, 1530,
                1733, 1936, 2139, 2342, 2545,
                2749, 2952, 3155, 3358, 3561,
                3764, 3967, 4171, 4374, 4577, 4780
            ];
        } else if(stat === Stat.Atk){
            return [
                47, 60, 73, 86, 100,
                113, 126, 139, 152, 166,
                179, 192, 205, 219, 232,
                245, 258, 272, 285, 298, 311
            ];
        } else if(stat === Stat.HpPercent || stat === Stat.AtkPercent || stat === Stat.ElementalDamageBonus) {
            return [
                0.07, 0.09, 0.11, 0.129, 0.149,
                0.169, 0.189, 0.209, 0.228, 0.248,
                0.268, 0.288, 0.308, 0.328, 0.348,
                0.367, 0.387, 0.407, 0.427, 0.446, 0.466
            ];
        } else if(stat === Stat.DefPercent || stat === Stat.PhysicalDamageBonus){
            return [
                0.087, 0.112, 0.137, 0.162, 0.186,
                0.211, 0.236, 0.261, 0.286, 0.31,
                0.335, 0.36, 0.385, 0.409, 0.434,
                0.459, 0.484, 0.508, 0.533, 0.558, 0.583
            ];
        } else if(stat === Stat.ElementalMastery) {
            return [
                28, 36, 44, 52, 60,
                68, 76, 84, 91, 99,
                107, 115, 123, 131, 139,
                147, 155, 163, 171, 179, 187
            ];
        } else if(stat === Stat.EnergyRecharge) {
            return [
                0.078, 0.1, 0.122, 0.144, 0.166,
                0.188, 0.21, 0.232, 0.254, 0.276,
                0.298, 0.32, 0.342, 0.364, 0.386,
                0.408, 0.43, 0.452, 0.474, 0.496, 0.518
            ];
        } else if(stat === Stat.CriticalRate) {
            return [
                0.047, 0.06, 0.073, 0.086, 0.099,
                0.113, 0.126, 0.139, 0.152, 0.166,
                0.179, 0.192, 0.205, 0.218, 0.232,
                0.245, 0.258, 0.271, 0.284, 0.298, 0.311
            ];
        } else if(stat === Stat.CriticalDamage) {
            return [
                0.093, 0.12, 0.146, 0.173, 0.199,
                0.225, 0.252, 0.278, 0.305, 0.331,
                0.357, 0.384, 0.41, 0.437, 0.463,
                0.49, 0.516, 0.542, 0.569, 0.595, 0.622
            ];
        } else if(stat === Stat.HealingBonus) {
            return [
                0.054, 0.069, 0.084, 0.1, 0.115,
                0.13, 0.145, 0.161, 0.176, 0.191,
                0.206, 0.221, 0.237, 0.252, 0.267,
                0.282, 0.298, 0.313, 0.328, 0.343, 0.359
            ];
        } else {

            throw new Error("传递了主词条不存在的词条类型.");
        }

    }


    /**
     * 根据传入的主词条类型和强化等级获取对应的强化数值
     *
     * @param {Stat} stat 主词条类型
     * @param {number} level 强化等级
     *
     * @return {number} 对应强化等级的强化数值
     *
     * @throws {Error} 错误的强化等级值
     * @throws {Error} 函数内部调用了`get_value_table_by_stat()`, 继承其异常
     */
    public static get_value_by_level(stat: Stat, level: number): number {
        if(level < 0 || level > 20){
            throw new Error("错误的强化等级值");
        }

        const table = this.get_value_table_by_stat(stat);

        return table[level];

    }

    /**
     * 随机获取一个元素伤害类型
     *
     * @return {ElementalDamageStat} 元素伤害类型, 可能的值参照枚举`ElementalDamageStat`定义
     */
    public static get_random_elemental_damage_stat(): ElementalDamageStat {
        return get_random_int(0, 6 + 1); // 6是下标最大值, 所以要+1
    }
    
}

/**
 * 副词条
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 */
export class SubStat {
    /**
     * 取可能出现在圣遗物上的副词条类型
     *
     * @returns {Stat[]} 词条类型数组
     */
    // export function get_probability_sub_stats(): Stat[] {
    //     return [Stat.Hp, Stat.Atk, Stat.Def,
    //         Stat.HpPercent, Stat.AtkPercent, Stat.DefPercent,
    //         Stat.EnergyRecharge, Stat.ElementalMastery,
    //         Stat.CriticalDamage, Stat.CriticalRate]
    //     }
    private static readonly probability_sub_stats:Stat[] = [Stat.Hp, Stat.Atk, Stat.Def,
        Stat.HpPercent, Stat.AtkPercent, Stat.DefPercent,
        Stat.EnergyRecharge, Stat.ElementalMastery,
        Stat.CriticalDamage, Stat.CriticalRate];

    /**
     * 通过副词条参数获取对应的词条每次强化提升数值时可能出现的档位对应数值数组
     *
     * @param {Stat} stat 副词条类型
     *
     * @return {number[]} 对应强化时每档提升的数值数组, 下标即档位
     *
     * @throws {Error} 传递了副词条不存在的词条类型
     */
    private static get_value_table_by_stat(stat: Stat): number[] {
        if(stat === Stat.Hp){
            return [209, 239, 269, 299];
        }else if(stat === Stat.HpPercent || stat === Stat.AtkPercent){
            return [0.041, 0.047, 0.053, 0.058];
        }else if(stat === Stat.Def || stat == Stat.ElementalMastery){
            return [16, 19, 21, 23];
        }else if(stat === Stat.DefPercent){
            return [0.051, 0.058, 0.066, 0.073];
        }else if(stat === Stat.Atk){
            return [14, 16, 18, 19];
        }else if(stat === Stat.EnergyRecharge){
            return [0.045, 0.052, 0.058, 0.065];
        }else if(stat === Stat.CriticalRate){
            return [0.027, 0.031, 0.035, 0.039];
        }else if(stat === Stat.CriticalDamage){
            return [0.054, 0.062, 0.07, 0.078];
        }else{
            throw new Error("传递了副词条不存在的词条类型.");
        }

    }

    /**
     * 根据传入的副词条类型和强化档位获取对应的强化数值
     *
     * @param {stat} stat 副词条类型
     * @param {number} rank 强化档位,传入参数范围必须为0~3, 0为最低档位 3为最高档位.
     *
     * @return {number} 强化提升值
     *
     * @throws {Error} rank传入参数范围错误.
     * @throws {Error} 函数内部调用了`get_value_table_by_stat()`, 继承其异常
     */
    public static get_value_by_rank(stat: Stat, rank: number): number {
        if(rank < 0 || rank> 3){
            throw new Error("强化档位必须为0~3");
        }
        return this.get_value_table_by_stat(stat)[rank];
    }

    /**
     * 取为圣遗物添加副词条时, 副词条出现的权重
     *
     * 只能传入[生命值, 攻击力, 防御力, 生命值%. 攻击力%, 防御力%, 元素充能效率, 元素精通, 暴击率, 暴击伤害] 之一
     *
     * 因为圣遗物只能出现这些副词条
     *
     * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Distribution
     *
     * @param {Stat} sub_stat 副词条类型
     *
     * @returns {number} 词条权重
     *
     * @throws {Error} 传入了圣遗物不能出现的副词条类型
     * @throws {Error} 传入的副词条类型不能找到对应权重值
     */
    private static get_sub_stat_weight(sub_stat: Stat): number {

        if(!this.probability_sub_stats.includes(sub_stat)) {
            throw new Error(`圣遗物不能出现${sub_stat}词条`);
        }

        if(sub_stat === Stat.Hp || sub_stat === Stat.Atk || sub_stat === Stat.Def) {
            return 6;
        } else if (sub_stat === Stat.HpPercent || sub_stat === Stat.AtkPercent || sub_stat === Stat.DefPercent || sub_stat === Stat.EnergyRecharge || sub_stat === Stat.ElementalMastery) {
            return 4;
        } else if(sub_stat === Stat.CriticalRate || sub_stat === Stat.CriticalDamage) {
            return 3;
        } else{
            throw new Error("不能找到对应词条的权重, 传参错误");
        }
    }


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
        const pool = this.probability_sub_stats.filter(x => !current_stats.includes(x));

        // 求权重和
        let sum_w: number = 0;
        pool.forEach(x => sum_w += this.get_sub_stat_weight(x));

        // 对权重和求随机数
        const r = get_random_int(0, sum_w);

        // 遍历奖池, 如果叠加权重大于随机数, 命中词条
        let k = 0;

        for (let i = 0; i < pool.length; i++) {
            k += this.get_sub_stat_weight(pool[i]);
            if(k >= r) {
                return pool[i];
            }
        }

        // 如果没有命中, 那么
        // 也许是这个算法出了问题
        throw new Error("算法错误");

    }
}

/**
 * 翻译词条类型
 * @param {Stat} stat 词条
 */
export function StatTypeTranslate(stat: Stat): string {
    switch(stat){
        case Stat.Hp: return "生命值";
        case Stat.Atk: return "攻击力";
        case Stat.Def: return "防御力";
        case Stat.HpPercent: return "生命值%";
        case Stat.AtkPercent: return "攻击力%";
        case Stat.DefPercent: return "防御力%";
        case Stat.ElementalMastery: return "元素精通";
        case Stat.EnergyRecharge: return "元素充能效率";
        case Stat.CriticalRate: return "暴击率";
        case Stat.CriticalDamage: return "暴击伤害";
        case Stat.HealingBonus: return "治疗加成";
        case Stat.ElementalDamageBonus: return "元素伤害加成";
        case Stat.PhysicalDamageBonus: return "物理伤害加成";
    }
}

/**
 * 翻译元素伤害加成词条
 * @param {ElementalDamageStat} e_stat 词条
 */
export function ElementalDamageBonusTypeTranslate(e_stat: ElementalDamageStat): string {
    switch(e_stat){
        case ElementalDamageStat.PyroDamageBonus: return "火属性伤害加成";
        case ElementalDamageStat.ElectroDamageBonus: return "雷属性伤害加成";
        case ElementalDamageStat.CryoDamageBonus: return "冰属性伤害加成";
        case ElementalDamageStat.HydroDamageBonus: return "水属性伤害加成";
        case ElementalDamageStat.DendroDamageBonus: return "草属性伤害加成";
        case ElementalDamageStat.AnemoDamageBonus: return "风属性伤害加成";
        case ElementalDamageStat.GeoDamageBonus: return "岩属性伤害加成";
    }
}