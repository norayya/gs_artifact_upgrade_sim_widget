import {getAllSubStats, StatType, StatValueType} from "@/models/Stat";
import {getRandomFloat, getRandomInt} from "@/utils/random";

/**
 * 圣遗物类型
 *
 * 同时表示装备插槽
 *
 *  0-花, 1-毛, 2-沙, 3-杯, 4-头
 */
export enum ArtifactType {
    flower = 0,      // 花
    plume = 1,       // 毛
    sands =2,       // 沙
    goblet = 3,      // 杯
    circlet = 4     // 头
}

/**
 * 圣遗物数据表
 *
 * 相关文档: https://genshin-impact.fandom.com/wiki/Artifact/Distribution
 *
 */
const artifactData: Record<ArtifactType, {
    id: string,
    allowMainStats: {
        mainStat: StatType,
        chance: number
    }[],
    name: {
        name1: string;
        name2: string;
        name3: string
    }
}> = {
    [ArtifactType.flower]: {
        id: "flower",
        allowMainStats: [
            { mainStat:StatType.hpValue, chance:1 }     // 生命值
        ],
        name: { name1: "生之花", name2:"[花] 生之花", name3: "Flower"}
    },
    [ArtifactType.plume]: {
        id: "plume",
        allowMainStats: [
            { mainStat:StatType.atkValue, chance: 1 }   // 攻击力
        ],
        name: { name1: "死之羽", name2: "[毛] 死之羽", name3: "Plume"}
    },
    [ArtifactType.sands]: {
        id: "sands",
        allowMainStats: [
            {mainStat: StatType.hpPercent, chance: 0.2668},     // 生命值%
            {mainStat: StatType.atkPercent, chance: 0.2666},    // 攻击力%
            {mainStat: StatType.defPercent, chance: 0.2666},    // 防御力%
            {mainStat: StatType.energyRecharge, chance: 0.1},   // 充能
            {mainStat: StatType.elementalMastery, chance: 0.1}  // 精通
        ],
        name: { name1: "时之沙", name2: "[沙] 时之沙", name3: "Sands"}
    },
    [ArtifactType.goblet]: {
        id: "goblet",
        allowMainStats: [
            {mainStat: StatType.hpPercent, chance: 0.1925},             // 生命值%
            {mainStat: StatType.atkPercent, chance: 0.1925},            // 攻击力%
            {mainStat: StatType.defPercent, chance: 0.19},              // 防御力%
            {mainStat: StatType.elementalDamageBonus, chance: 0.35},    // 属伤加成
            {mainStat: StatType.physicalDamageBonus, chance: 0.05},     // 物伤加成
            {mainStat: StatType.elementalMastery, chance: 0.025}        // 精通
        ],
        name: { name1: "空之杯", name2: "[杯] 空之杯", name3: "Goblet"}
    },
    [ArtifactType.circlet]: {
        id: "circlet",
        allowMainStats: [
            { mainStat: StatType.hpPercent, chance: 0.22},          // 生命值%
            { mainStat: StatType.atkPercent, chance: 0.22},         // 攻击力%
            { mainStat: StatType.defPercent, chance: 0.22},         // 防御力%
            { mainStat: StatType.criticalRate, chance: 0.1},        // 暴击
            { mainStat: StatType.criticalDamage, chance: 0.1},      // 爆伤
            { mainStat: StatType.healingBonus, chance: 0.1},        // 治疗
            { mainStat: StatType.elementalMastery, chance: 0.04}    // 精通
        ],
        name: {name1: "理之冠", name2: "[头} 理之冠", name3: "Circlet"}
    }
};

/**
 * 获取圣遗物部位名称
 * @param slot
 */
export function getArtifactTypeName(slot: ArtifactType): string{
    return artifactData[slot].name["name1"];
}

/**
 * 取显示在首页select box options的插槽名称
 * @constructor
 */
export function getInitArtifactTypeSelectOptionShowNames(): {slot: ArtifactType, showName: string}[] {
    const table: {slot: ArtifactType, showName: string}[] = [];

    // 遍历枚举 按枚举值查找
    Object.values(ArtifactType).filter(value => !isNaN(Number(value))).forEach(value=>{
        const t = value as ArtifactType;

        table.push({slot: t, showName: artifactData[t].name['name2']});
    });

    return table;
}

/**
 * 圣遗物
 */
export class Artifact {
    // 圣遗物类型
    artifactType: ArtifactType;
    // 主词条
    majorAffix: StatType;
    // 副词条,
    minorAffixes: { subStat: StatType, upgradeLevel: number, isActive: boolean, showOnLog: boolean}[] = [];
    // 强化等级
    upgradeLevel: number = 0;


    /**
     * 新建圣遗物
     * @param type 圣遗物类型
     * @param initLevel 初始化强化等级
     */
    static new(type: ArtifactType, initLevel: number): Artifact {
        if(initLevel <0 || initLevel >20){
            throw new Error();
        }

        const newArtifact = new Artifact();
        newArtifact.artifactType = type;

        // 设置圣遗物可用的主词条
        newArtifact.setNewMainStat();


        // 确定初始激活副词条数量
        newArtifact.minorAffixes = [];
        //newArtifact.initActiveMinorAffixCount = getRandomInt(0, 2000) %2 === 0 ? 3: 4;
        const initActiveMinorAffixCount = getRandomInt(0, 2000) %2 === 0 ? 3: 4;

        // 抽出4词条
        for(let i = 0; i < 4; i++){
            const s = newArtifact.getNewSubStat();
            newArtifact.minorAffixes.push(
                {
                    subStat: s.subStat,
                    upgradeLevel:getRandomInt(0, 4),
                    isActive: false,
                    showOnLog: false
                }
            )
        }
        // 激活词条
        for(let i = 0; i < initActiveMinorAffixCount; i++){
            newArtifact.minorAffixes[i].isActive = true;
        }

        // 执行初始强化
        for(let i= 0; i< initLevel; i++){
            newArtifact.upgrade();
        }

        return newArtifact;
    }

    /**
     * 设置主词条
     *
     * 从对应的圣遗物类型的artifactData.allowMainStats中挑选一个主词条
     * @private
     */
    private setNewMainStat() {
        this.majorAffix = ((x: { mainStat: StatType, chance: number}[]): { mainStat: StatType, chance: number} => {
            const arr: { mainStat: StatType, chance: number}[] = [];
            // 归一化
            for(let i = 0; i < x.length; i++){
                arr[i] = { mainStat: x[i].mainStat, chance: i === 0 ? x[i].chance: arr[i-1].chance + x[i].chance};
            }
            // 取浮点随机数
            const p = getRandomFloat(0, 1);
            for(let i = 0; i < arr.length; i++){
                if(arr[i].chance > p){
                    // 抽出
                    return x.find(x => x.mainStat === arr[i].mainStat);
                }
            }
        })(artifactData[this.artifactType].allowMainStats).mainStat;
    }

    /**
     * 抽出副词条
     *
     * 按照权重从副词条候选池中挑选副词条
     * @private
     */
    private getNewSubStat(): { subStat: StatType, value: number[], valueType: StatValueType} {
        // 副词条候选池
        const subsPool: { stat: StatType, value: number[], valueWeight: number, valueType: StatValueType, probability: number }[]=[];
        // 权重和
        let wSum = 0;
        // 挑选与填充候选池
        getAllSubStats().forEach(x => {
            if(x.stat !== this.majorAffix && (this.minorAffixes.some(y => y.subStat === x.stat) === false)){
                wSum += x.valueWeight;
                subsPool.push({
                    stat: x.stat,
                    value: x.value,
                    valueWeight: x.valueWeight,
                    valueType: x.valueType,
                    probability: 0
                });
            }
        });
        // 计算权重和
        subsPool.forEach(x => {
            x.probability = x.valueWeight / wSum;
        });
        // 归一化
        for(let i =0; i<subsPool.length; i++){
            subsPool[i].probability = i === 0 ? subsPool[i].probability: subsPool[i-1].probability + subsPool[i].probability;
        }
        //取浮点随机数
        const p = getRandomFloat(0, subsPool[subsPool.length - 1].probability);
        for(let i =0; i<subsPool.length; i++){
            if(subsPool[i].probability > p){
                // 抽出
                return {
                    subStat: subsPool[i].stat,
                    value: subsPool[i].value,
                    valueType: subsPool[i].valueType
                };
            }
        }
    }

    upgrade() {
        if(this.upgradeLevel === 20) {
            // 不能再强化
            throw new Error();
        }

        this.upgradeLevel++;

        // 如果当前强化等级达到 4 8 12 16 20
        // 如果存在未激活的词条, 激活词条, 否则强化其中一个词条
        if(this.upgradeLevel === 4 || this.upgradeLevel === 8 || this.upgradeLevel === 12 || this.upgradeLevel === 16 || this.upgradeLevel === 20){
            const s = this.minorAffixes.find(x => x.isActive === false);
            if(s !== undefined){
                // 激活词条
                s.isActive = true;
                s.showOnLog = true;
                return;
            }
            else {
                // 随机强化
                const p = getRandomInt(0, 4) // 挑出已经存在的词条
                this.minorAffixes.push({
                    subStat: this.minorAffixes[p].subStat,
                    upgradeLevel: getRandomInt(0, 4),
                    isActive: true,
                    showOnLog: true
                });
                return;
            }
        }
    }
}

