import s_data from "../data/stats_data.json";
import a_data from "../data/artifact_types_data.json";
import { Stat, StatsTable, ArtifactType, ArtifactTypesTable } from "./data_types";
import { Ruletka, GetRandom, ValueType } from "./utils";



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