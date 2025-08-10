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
 * 词条表的词条对象类型
 */
export type StatsTableObject = { mainStatValue?: number[], subStatValue?: number[], subStatWeight?: number, localization?: Record<string, string> };

/**
 * 词条表类型
 */
export type StatsTable = Record<Stat, StatsTableObject>;

