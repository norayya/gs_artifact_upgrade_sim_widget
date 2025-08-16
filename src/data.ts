import s_data from "../data/stats_data.json";
import a_data from "../data/artifact_types_data.json";
import {ArtifactType, ArtifactTypesTable, Stat, StatsTable} from "./data_types";
import {GetRandom, Ruletka, ValueType} from "./utils";


// 引入数据文件并反序列到对象
const stats_data = s_data as StatsTable;
const artifact_data = a_data as ArtifactTypesTable;


/**
 * 获取圣遗物上允许出现的副词条集合
 */
const ArtifactAllowSubStats: Stat[] = (()=> {
    const stats : Stat[] = [];

    (Object.keys(stats_data) as Stat[]).forEach(k=> {
        if(stats_data[k].subStatValue !== undefined && stats_data[k].subStatWeight !== undefined){
            stats.push(k);
        }
    });

    return stats;

})();


/**
 * 随机挑选一个可能出现的圣遗物副词条
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Distribution
 *
 * @param currentStats 现有的词条集合
 *
 * @returns 选出的词条
 *
 * @throws 算法错误
 * @throws 权重计算错误
 */
export function GetNewSubStat(currentStats: Stat[]): Stat {
    /*
     传入参数时, 需将当前圣遗物的主副词条都传入, 即便是元素伤害加成这类不能在副词条中出现的词条.
     虽然在逻辑上不必要, 但为了简化算法请务必这么做.
     如果这个算法没有出现问题, 请不要修改这个算法.
    */

    // 从可能出现的副词条类型集合中去掉已有词条
    const pool = ArtifactAllowSubStats.filter(x => {
        // 筛选出 不包含在已有词条集合 且 允许在圣遗物副词条刷出的词条
        return !currentStats.includes(x) && (stats_data[x].subStatValue !== undefined)
    });

    // 求权重和
    let weight_sum = 0;
    pool.forEach(k => {
        const w = stats_data[k].subStatWeight;
        if(w === undefined){
            // 理论上不会出现这个错误
            throw new Error(`Sub StatWeight Is undefined`);
        }

        weight_sum += w;
    });

    // 对权重和求随机数
    const rnd = GetRandom(ValueType.Int, 0, weight_sum);

    // 遍历奖池, 如果叠加权重大于随机数, 命中词条
    let k = 0;

    for(let i = 0; i < pool.length; i++){
        const w = stats_data[pool[i]].subStatWeight;
        if(w === undefined){
            // 理论上不会出现这个错误
            throw new Error(`Sub StatWeight Is undefined`);
        }

        k += w;

        if(k >= rnd){
            return pool[i];
        }
    }

    // 没有命中词条, 那么可能是算法出了问题

    throw new Error(`Unknown Error`);
}

/**
 * 根据传入的圣遗物部位取可能的主词条类型
 *
 * @param artifactType 圣遗物部位类型
 *
 * @returns 随机主词条类型
 */
export function GetRandomMainStatByArtifactType(artifactType: ArtifactType): Stat {
    return Ruletka(artifact_data[artifactType].allowMainStats);
}

/**
 * 根据传入的Dom中的圣遗物列表的index选取圣遗物部位
 * 0: 花, 1: 毛, 2:沙, 3:杯, 4:头
 * @param index Dom中的圣遗物列表index
 *
 * @returns 圣遗物部位
 */
export function ArtifactIndexToType(index: number): ArtifactType {
    switch (index) {
        case 0:
            return ArtifactType.Flower;
        case 1:
            return ArtifactType.Plume;
        case 2:
            return ArtifactType.Sands;
        case 3:
            return ArtifactType.Goblet;
        case 4:
            return ArtifactType.Circlet;
        default:
            throw new Error(`Unknown Artifact Type index, index does not exist`);
    }
}

/**
 * 获取词条类型名称的本地化翻译
 * @param stat 词条
 * @param lang 语言类型, zh_cn: 简体中文
 *
 * @returns 本地化翻译名称
 */
export function GetStatLocalization(stat: Stat, lang: string): string {
    const localization = stats_data[stat].localization;
    if(localization === undefined){
        throw new Error(`Unknown Localization`);
    }

    const r = localization[lang];
    if(r === undefined){
        throw new Error(`Unknown Localization`);
    }

    return r;
}

/**
 * 获取圣遗物部位名称的本地化翻译
 *
 * @param artifactType 圣遗物部位
 * @param lang 语言类型， zh_cn: 简体中文
 *
 * @returns 本地化翻译名称
 */
export function GetArtifactTypeLocalization(artifactType: ArtifactType, lang: string): string {
    const localization = artifact_data[artifactType].localization;
    if(localization === undefined){
        throw new Error(`Unknown Localization`);
    }
    const r = localization[lang];
    if(r === undefined){
        throw new Error(`Unknown Localization`);
    }
    return r;
}

/**
 * 根据副词条的强化rank获取对应的强化值
 *
 * @param subStat 副词条类型
 * @param rank 强化等级
 *
 * @returns 对应的强化值
 */
export function GetSubStatValue(subStat: Stat, rank: number): number {
   if(rank < 0 || rank > 3) {
       throw new Error(`rank must be between 0 and 3`);
   }

   const subStatValues = stats_data[subStat].subStatValue;
   if(subStatValues === undefined){
       throw new Error(`SunStatValue is undefined`);
   }

   return subStatValues[rank];
}

/**
 * 根据强化等级获取对应的主词条数值
 * @param mainStat 主词条类型
 * @param currentLevel 强化等级
 * @returns 对应的强化值
 */
export function GetMainStatValue(mainStat: Stat, currentLevel: number): number {
    if(currentLevel <0 || currentLevel > 20){
        throw new Error(`currentLevel must be between 0 and 20`);
    }

    const mainStatValues = stats_data[mainStat].mainStatValue;
    if(mainStatValues === undefined){
        throw new Error(`MainStatValue is undefined`);
    }

    return mainStatValues[currentLevel];
}