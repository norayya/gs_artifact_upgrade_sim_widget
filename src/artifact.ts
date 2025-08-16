import { GetRandom, Ruletka, ValueType } from "./utils";
import { Event, NewEvent } from "./event";
import { ArtifactType, Stat } from "./data_types";
import { GetNewSubStat, GetRandomMainStatByArtifactType } from "./data";

/**
 * 圣遗物
 */
export type Artifact = {
    /**
     * 圣遗物升级事件
     */
    OnArtifactLevelUpgraded(): Event<ArtifactLevelUpgradedEventData, undefined>;
    /**
     * 圣遗物副词条被添加事件
     */
    OnArtifactSubStatAddedOrUpgraded(): Event<ArtifactSubStatAddedEventData, undefined>;
    /**
     * 圣遗物升一级
     */
    LevelUpgrade(): void;
    /**
     * 获取当前圣遗物强化等级
     */
    CurrentLevel(): number;
    /**
     * 获取当前圣遗物的主词条
     */
    GetMainStat(): Stat;
    /**
     * 获取当前圣遗物的部位类型
     */
    GetArtifactType(): ArtifactType;
    /**
     * 获取当前圣遗物副词条集合
     */
    GetSubStats():SubStats[];
}

/**
 * 圣遗物升级事件数据类型
 */
export type ArtifactLevelUpgradedEventData = {
    artifactType: ArtifactType;
    mainStat: Stat;
    currentLevel: number
    subStats: SubStats[];

}

/**
 * 圣遗物副词条被添加时事件数据类型
 */
export type ArtifactSubStatAddedEventData = {
    currentLevel: number,
    subStat: Stat,
    upgradeRank: number
}

/**
 * 副词条集合
 */
export type SubStats = {
    subStat: Stat,
    rank: number[]
}

/**
 * 新建圣遗物
 * @param artifactType 圣遗物部位
 */
export function NewArtifact(artifactType: ArtifactType): Artifact {
    // 圣遗物升级事件
    let onArtifactLevelUpgraded: Event<ArtifactLevelUpgradedEventData, undefined>;
    // 副词条被添加/强化事件
    let onArtifactSubStatAddedOrUpgraded: Event<ArtifactSubStatAddedEventData, undefined>;

    // 当前强化等级
    let currentLevel: number;

    // 主词条
    let mainStat: Stat;

    // 副词条集合
    let subStats: SubStats[];

    // 为圣遗物添加一个副词条
    const addNewSubStat = (): SubStats => {
        // 已有词条集合
        const subStatsArray = subStats.map(x => {
            return x.subStat;
        });



        const newSubStatObject = {
            // 选出一个随机词条
            subStat: GetNewSubStat(subStatsArray),
            // 为词条选择一个初始的强化档位
            rank: [GetRandom(ValueType.Int, 0, 4)],
        };


        // 插入词条
        subStats.push(newSubStatObject);

        // 返回该次选出的新词条
        return {...newSubStatObject};

    }

    // 初始化闭包
    (()=> {
        // 初始化事件
        onArtifactLevelUpgraded = NewEvent<ArtifactLevelUpgradedEventData, undefined>();
        onArtifactSubStatAddedOrUpgraded = NewEvent<ArtifactSubStatAddedEventData, undefined>();

        // 设置初始强化等级
        currentLevel = 0;
        // 随机选取主词条
        mainStat = GetRandomMainStatByArtifactType(artifactType);
        // 设置初始空集合
        subStats = [];

        // 随机决定初始副词条的数量
        const c = GetRandom(ValueType.Int, 0, 2000) % 2 === 0 ? 3 : 4;

        // 添加副词条
        for(let i = 0; i < c; i++) {
            const result = addNewSubStat();
            // 触发词条添加事件
            onArtifactSubStatAddedOrUpgraded.Emit({
                currentLevel: currentLevel,
                subStat: result.subStat,
                upgradeRank: result.rank[0]
            })
        }
    })(); // 执行初始化函数


    return {
        OnArtifactLevelUpgraded(): Event<ArtifactLevelUpgradedEventData, undefined> {
            return onArtifactLevelUpgraded;
        },
        OnArtifactSubStatAddedOrUpgraded(): Event<ArtifactSubStatAddedEventData, undefined> {
            return onArtifactSubStatAddedOrUpgraded;
        },
        LevelUpgrade(): void {
            if(currentLevel < 0){
                throw new Error(`Artifact level cannot less than 0, maybe an error occurred during init.`);
            }

            if(currentLevel >= 20){
                throw new Error(`Out of limit.`);
            }

            // 等级+1
            currentLevel ++ ;

            // 如果强化后的强化等级等于4 8 12 16 20时,
            if(currentLevel == 4 || currentLevel == 8 || currentLevel == 12 || currentLevel == 16 || currentLevel == 20){
                if(subStats.length < 4){
                    // 且当前副词条数量少于4个时,
                    // 添加一个随机词条
                    const result = addNewSubStat();
                    // 触发词条添加事件
                    onArtifactSubStatAddedOrUpgraded.Emit({
                        currentLevel: currentLevel,
                        subStat: result.subStat,
                        upgradeRank: result.rank[0]
                    })

                } else {
                    // 如果已经有4个词条了,
                    // 选择其中一个词条, 添加一个强化档位
                    const randomRank = GetRandom(ValueType.Int, 0, 4);
                    const stat = Ruletka(subStats);
                    stat.rank.push(randomRank);
                    // 触发词条强化事件
                    onArtifactSubStatAddedOrUpgraded.Emit({
                        currentLevel: currentLevel,
                        subStat: stat.subStat,
                        upgradeRank: randomRank
                    })
                }

                // 触发圣遗物升级事件
                onArtifactLevelUpgraded.Emit({
                    artifactType: artifactType,
                    mainStat: mainStat,
                    currentLevel: currentLevel,
                    subStats: subStats
                });

            }

            // 触发圣遗物升级事件
            onArtifactLevelUpgraded.Emit({
                artifactType: artifactType,
                mainStat: mainStat,
                currentLevel: currentLevel,
                subStats: subStats
            });



        },
        CurrentLevel(): number {
            return currentLevel;
        },
        GetMainStat(): Stat {
            return mainStat;
        },
        GetArtifactType(): ArtifactType {
            return artifactType;
        },
        GetSubStats():SubStats[] {
            return subStats;
        }
    }

}

