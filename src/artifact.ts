import {MainStat, Stat, SubStat} from "./stat";
import {get_random_int, ruletka} from "./utils";

/**
 * 圣遗物部位
 */
export enum ArtifactType {
    Flower = 0, // 花
    Plume = 1, // 毛
    Sands = 2, // 沙
    Goblet = 3, // 杯
    Circlet = 4, // 头
}

/**
 * 副词条
 */
export type SubStatObject = { sub_stat: Stat, upgrade_ranks: number[] }

/**
 * 圣遗物
 */
export class Artifact {
    private main: Stat;
    private sub: SubStatObject[];
    private level: number;
    private type: ArtifactType;

    /**
     * 创建一个圣遗物
     * @param {ArtifactType} artifact_type 圣遗物部位
     */
    constructor(artifact_type: ArtifactType) {
        // 初始强化等级 0
        this.level = 0;

        // 类型
        this.type = artifact_type;

        // 根据传入的部位确定主词条
        this.main = Artifact.get_random_main_stat_by_artifact_type(artifact_type);
        this.sub = [];

        // 开始添加初始的副词条
        // 随机决定初始副词条的数量
        const c = get_random_int(0, 2000) % 2 === 0 ? 3 : 4;

        for(let i = 0; i < c; i++) {
            /*
             level_up函数也使用了这部分代码,
             如果修改了这里, 那么也应该修改level_up函数
             */

            // 已有词条集合
            const subs: Stat[] = [];
            this.sub.forEach(x => {
                subs.push(x.sub_stat);
            });

            // 随机获得新的词条
            const new_stat = SubStat.get_new_sub_stat([this.main, ...subs]);
            // 为词条选择一个初始强化档位
            const upgrade_rank = get_random_int(0, 4);

            // 插入词条
            this.sub.push({
                sub_stat: new_stat,
                upgrade_ranks: [upgrade_rank]
            });

        }

    }

    /**
     * 强化一级
     */
    public level_up(): void {
        // 强化一级
        if(this.level < 0 || this.level >= 20)
        {
            throw new Error("当前圣遗物等级不能再被强化")
        }

        this.level ++ ;

        // 如果当前强化等于4 8 12 16 20时,
        // 当前副词条数量少于4个时, 添加一个随机词条

        if(this.level == 4 || this.level == 8 || this.level == 12 || this.level == 16 || this.level == 20){
            if(this.sub.length < 4 ){
                /*
                 这里就是复制粘贴了构造函数中添加词条的部分
                 似乎没什么必要抽出来一个独立函数
                 如果改动过构造函数, 请务必也改动这里
                 */

                // 已有词条集合
                const subs: Stat[] = [];
                this.sub.forEach(x => {
                    subs.push(x.sub_stat);
                });
                // 随机获得新的词条
                const new_stat = SubStat.get_new_sub_stat([this.main, ...subs]);
                // 为词条选择一个初始强化档位
                const upgrade_rank = get_random_int(0, 4);

                // 插入词条
                this.sub.push({
                    sub_stat: new_stat,
                    upgrade_ranks: [upgrade_rank]
                });
            } else {
                // 如果已经有4个词条了,
                // 那么选中其中一个词条, 然后添加一个强化档位
                ruletka(this.sub).upgrade_ranks.push(get_random_int(0, 4));
            }
        }

    }

    /**
     * 根据传入的圣遗物部位取可能出现的主词条类型
     *
     * @param {ArtifactType} artifact_type 圣遗物部位
     *
     * @returns {Stat} 主词条类型
     *
     * @throws {Error} 参数错误
     */
    private static get_random_main_stat_by_artifact_type(artifact_type: ArtifactType): Stat {
        switch (artifact_type) {
            case ArtifactType.Flower:
                return Stat.Hp;
            case ArtifactType.Plume:
                return Stat.Atk;
            case ArtifactType.Sands:
                return ruletka(
                    [
                        Stat.HpPercent, Stat.AtkPercent, Stat.DefPercent,
                        Stat.EnergyRecharge, Stat.ElementalMastery
                    ]);
            case ArtifactType.Goblet:
                return ruletka(
                    [
                        Stat.HpPercent, Stat.AtkPercent, Stat.DefPercent,
                        Stat.ElementalDamageBonus, Stat.PhysicalDamageBonus,
                        Stat.ElementalMastery
                    ]
                );
            case ArtifactType.Circlet:
                return ruletka(
                    [
                        Stat.HpPercent, Stat.AtkPercent, Stat.DefPercent,
                        Stat.CriticalRate, Stat.CriticalDamage,
                        Stat.HealingBonus, Stat.ElementalMastery
                    ]
                );
            default:
                throw new Error("参数错误");
        }
    }

}