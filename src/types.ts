/**
 * 圣遗物属性类型
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Stats
 *
 */
export enum Stat {
    Hp = "hp",                                      // 生命值
    Atk = "atk",                                    // 攻击力
    Def = "def",                                    // 防御力
    HpPercent = "hpPercent",                        // 生命值%
    AtkPercent = "atkPercent",                      // 攻击力%
    DefPercent = "defPercent",                      // 防御力%
    ElementalMastery = "elementalMastery",          // 元素精通
    EnergyRecharge = "energyRecharge",              // 元素充能效率
    CriticalRate = "criticalRate",                  // 暴击率
    CriticalDamage = "criticalDamage",              // 暴击伤害
    HealingBonus = "healingBonus",                  // 治疗加成
    ElementalDamageBonus = "elementalDamageBonus",  // 元素伤害加成
    PhysicalDamageBonus = "physicalDamageBonus",    // 物理伤害加成
}

/**
 * 属性值类型
 */
export enum StatValueType {
    Int = "int",
    Float = "float",
}

/**
 * 词条表的词条对象类型
 */
export type StatsTableObject = {
    mainStatValue?: number[],   // 词条作为主词条时每一级强化对应的数值
    subStatValue?: number[],    // 词条作为副词条时每一级强化可能出现的档位对应的数值
    subStatWeight?: number,     // 为装备添加新副词条时出现的权重
    valueType: StatValueType,   // 属性值类型
    localization?: Record<string, string>  // 翻译文本相关
};

/**
 * 词条表类型对象表
 */
export type StatsTable = Record<Stat, StatsTableObject>;

/**
 * 圣遗物部位
 */
export enum ArtifactType {
    Flower = "flower",      // 花
    Plume = "plume",        // 毛
    Sands = "sands",        // 沙
    Goblet = "goblet",      // 杯
    Circlet = "circlet",    // 头
}

/**
 * 圣遗物部位对象类型
 */
export type ArtifactTypesTableObject = {
    slot: number,               // 该部位对应的装备插槽
    allowMainStats: Stat[],     // 允许在该部位出现的主词条类型
    localization?: Record<string, string>   // 翻译文本相关
};

/**
 * 圣遗物部位对象表
 */
export type ArtifactTypesTable = Record<ArtifactType, ArtifactTypesTableObject>;