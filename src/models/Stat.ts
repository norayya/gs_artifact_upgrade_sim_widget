/**
 * 词条类型
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 */
export enum StatType  {
    hpValue = 0,                // 生命值
    atkValue = 1,               // 攻击力
    defValue = 2,               // 防御力
    hpPercent = 3,              // 生命值%
    atkPercent = 4,             // 攻击力%
    defPercent = 5,             // 防御力%
    elementalMastery = 6,       // 精通
    energyRecharge = 7,         // 充能
    criticalRate = 8,           // 暴击
    criticalDamage = 9,         // 爆伤
    healingBonus = 10,          // 治疗
    elementalDamageBonus = 11,  // 属伤加成
    physicalDamageBonus = 12,   // 物伤加成
}

/**
 * 词条数值的类型
 *
 * 0-int, 1-float
 *
 * int类型表示此词条以整数方式计算
 *
 * float类型表示此词条以百分比方式计算
 */
export enum StatValueType  {
    int = 0,
    float = 1,
}

/**
 * 词条数据
 *
 * StatType: 词条类型
 *
 * .mainStat: (可空) 若为undefined, 则此词条不会在主词条中出现
 *
 * ..value: 若此词条可在主词条出现, 对应圣遗物强化等级的词条数值
 *
 * .subStat: (可空) 若为undefined, 则此词条不会在副词条中出现
 *
 * ..value: 若此词条可在副词条出现, 对应该副词条每次强化都可能会叠加的值
 *
 * ..weight: 当为圣遗物添加词条时的随机词条权重
 *
 * .valueType: 词条数值类型
 *
 * .name: 名称
 */
const statData: Record<StatType, {
    mainStat?: { values: number[] },
    subStat?: { values: number[], weight: number},
    valueType: StatValueType,
    name: Record<string, string>,
}> = {
    [StatType.hpValue]: {
        mainStat: {
            values: [717, 920, 1123, 1326, 1530, 1733, 1936, 2139, 2342, 2545, 2749, 2952, 3155, 3358, 3561, 3764, 3967, 4171, 4374, 4577, 4780]
        },
        subStat: {
            values: [209, 239, 269, 299],
            weight: 6
        },
        valueType: StatValueType.int,
        name: {
            name1: "Hp",
            name2: "生命值"
        }
    },
    [StatType.atkValue]: {
        mainStat: {
            values: [47, 60, 73, 86, 100, 113, 126, 139, 152, 166, 179, 192, 205, 219, 232, 245, 258, 272, 285, 298, 311]
        },
        subStat: {
            values: [14, 16, 18, 19],
            weight: 6
        },
        valueType: StatValueType.int,
        name: {
            name1: "Atk",
            name2: "攻击力"
        }
    },
    [StatType.defValue]: {
        mainStat: undefined,
        subStat: {
            values: [16, 19, 21, 23],
            weight: 6
        },
        valueType: StatValueType.int,
        name: {
            name1: "Def",
            name2: "防御力"
        }
    },
    [StatType.hpPercent]: {
        mainStat: {
            values: [0.07,0.09,0.11,0.129,0.149,0.169,0.189,0.209,0.228,0.248,0.268,0.288,0.308,0.328,0.348,0.367,0.387,0.407,0.427,0.446,0.466]
        },
        subStat: {
            values: [0.041, 0.047, 0.053, 0.058],
            weight: 4
        },
        valueType: StatValueType.float,
        name: {
            name1: "Hp",
            name2: "生命值"
        }
    },
    [StatType.atkPercent]: {
        mainStat: {
            values: [0.07, 0.09, 0.11, 0.129, 0.149, 0.169, 0.189, 0.209, 0.228, 0.248, 0.268, 0.288, 0.308, 0.328, 0.348, 0.367, 0.387, 0.407, 0.427, 0.446, 0.466]
        },
        subStat: {
            values: [0.041, 0.047, 0.053, 0.058],
            weight: 4
        },
        valueType: StatValueType.float,
        name: {
            name1: "Atk",
            name2: "攻击力"
        }
    },
    [StatType.defPercent]: {
        mainStat: {
            values: [0.087, 0.112, 0.137, 0.162, 0.186, 0.211, 0.236, 0.261, 0.286, 0.31, 0.335, 0.36, 0.385, 0.409, 0.434, 0.459, 0.484, 0.508, 0.533, 0.558, 0.583]
        },
        subStat: {
            values: [0.051, 0.058, 0.066, 0.073],
            weight: 4
        },
        valueType: StatValueType.float,
        name: {
            name1: "Def",
            name2: "防御力"
        }
    },
    [StatType.elementalMastery]: {
        mainStat: {
            values:[28, 36, 44, 52, 60, 68, 76, 84, 91, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 179, 187]
        },
        subStat: {
            values: [16, 19, 21, 23],
            weight: 4
        },
        valueType: StatValueType.int,
        name: {
            name1: "ElementalMastery",
            name2: "元素精通"
        }
    },
    [StatType.energyRecharge]: {
        mainStat: {
            values: [0.078, 0.1, 0.122, 0.144, 0.166, 0.188, 0.21, 0.232, 0.254, 0.276, 0.298, 0.32, 0.342, 0.364, 0.386, 0.408, 0.43, 0.452, 0.474, 0.496, 0.518]
        },
        subStat: {
            values: [0.045, 0.052, 0.058, 0.065],
            weight: 4
        },
        valueType: StatValueType.float,
        name: {
            name1: "EnergyRecharge",
            name2: "元素充能效率"
        }
    },
    [StatType.criticalRate]: {
        mainStat: {
            values: [0.047, 0.06, 0.073, 0.086, 0.099, 0.113, 0.126, 0.139, 0.152, 0.166, 0.179, 0.192, 0.205, 0.218, 0.232, 0.245, 0.258, 0.271, 0.284, 0.298, 0.311]
        },
        subStat: {
            values: [0.027, 0.031, 0.035, 0.039],
            weight: 3
        },
        valueType: StatValueType.float,
        name: {
            name1: "CriticalRate",
            name2: "暴击率"
        }
    },
    [StatType.criticalDamage]: {
        mainStat: {
            values: [0.093, 0.12, 0.146, 0.173, 0.199, 0.225, 0.252, 0.278, 0.305, 0.331, 0.357, 0.384, 0.41, 0.437, 0.463, 0.49, 0.516, 0.542, 0.569, 0.595, 0.622]
        },
        subStat: {
            values: [0.054, 0.062, 0.07, 0.078],
            weight: 3
        },
        valueType: StatValueType.float,
        name: {
            name1: "CriticalDamage",
            name2: "暴击伤害"
        }
    },
    [StatType.healingBonus]: {
        mainStat: {
            values: [0.054, 0.069, 0.084, 0.1, 0.115, 0.13, 0.145, 0.161, 0.176, 0.191, 0.206, 0.221, 0.237, 0.252, 0.267, 0.282, 0.298, 0.313, 0.328, 0.343, 0.359]
        },
        subStat: undefined,
        valueType: StatValueType.float,
        name: {
            name1: "HealingBonus",
            name2: "治疗加成"
        }
    },
    [StatType.elementalDamageBonus]: {
        mainStat: {
            values: [0.07, 0.09, 0.11, 0.129, 0.149, 0.169, 0.189, 0.209, 0.228, 0.248, 0.268, 0.288, 0.308, 0.328, 0.348, 0.367, 0.387, 0.407, 0.427, 0.446, 0.466]
        },
        subStat: undefined,
        valueType: StatValueType.float,
        name: {
            name1: "ElementDamageBonus",
            name2: "元素伤害加成"
        }
    },
    [StatType.physicalDamageBonus]: {
        mainStat: {
            values: [0.087, 0.112, 0.137, 0.162, 0.186, 0.211, 0.236, 0.261, 0.286, 0.31, 0.335, 0.36, 0.385, 0.409, 0.434, 0.459, 0.484, 0.508, 0.533, 0.558, 0.583]
        },
        subStat: undefined,
        valueType: StatValueType.float,
        name: {
            name1: "PhysicalDamageBonus",
            name2: "物理伤害加成"
        }
    }
}

/**
 * 获取可能会在圣遗物中出现的副词条类型
 *
 * stat: 副词条类型
 *
 * value: 若此词条可在副词条出现, 对应该副词条每次强化都可能会叠加的值
 *
 * valueWeight: 当为圣遗物添加词条时的随机词条权重
 *
 * valueType: 词条数值类型
 */
export function getAllSubStats(): { stat: StatType, value: number[], valueWeight: number, valueType: StatValueType}[] {
    const arr:  { stat: StatType, value: number[], valueWeight: number, valueType: StatValueType}[] = [];

    Object.entries(statData).forEach(([statType, v]) => {
         if(v.subStat !== undefined){
             arr.push({
                 stat: Number(statType) as StatType,
                 value: v.subStat.values,
                 valueWeight: v.subStat.weight,
                 valueType: v.valueType
             })
         }
    });

    return arr;
}

export function getStatName( stat: StatType) : string {
    return statData[stat].name["name2"];
}

export function getMainStatValue(stat: StatType, level: number): number{
    const s = statData[stat];

    if(s.valueType === StatValueType.float){
        return s.mainStat.values[level]
    }else if(s.valueType === StatValueType.int){
        return s.mainStat.values[level];
    }
}

export function getSubStatValue(stat: StatType, upgradeLevel: number): number{
    const s = statData[stat];

    if(s.valueType === StatValueType.float){
        return s.subStat.values[upgradeLevel]
    }else if(s.valueType === StatValueType.int){
        return s.subStat.values[upgradeLevel];
    }
}

export function getStatValueType(stat: StatType): StatValueType{
    const s = statData[stat];

    return s.valueType;
}