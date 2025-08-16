import { ArtifactType, Stat } from "./data_types";
import {
    ArtifactIndexToType,
    GetArtifactTypeLocalization,
    GetMainStatValue,
    GetStatLocalization,
    GetSubStatValue
} from "./data";
import {FloatToPercentString} from "./utils";
import {SubStats} from "./artifact";

export type DomManager = {
}

export type LoadEvents = {
    generateArtifactButtonEvent: (event: MouseEvent) => void;
}


export type DomObject = {
    artifactView: HTMLElement | null,
    initLevelInput: HTMLElement | null,
    initArtifactTypeSelect: HTMLElement | null,
    generateArtifactButton: HTMLElement | null,
    levelUpgradeLogView: HTMLElement | null,
    levelUpgradeButton: HTMLElement | null,
}


export function NewDomManager(domObjs: DomObject) {
    let dom = domObjs;

    let initEvents: LoadEvents;


    return {
        // 清除圣遗物详情
        ClearArtifactView(): void {
            if(dom.artifactView === null) {
                throw new Error("Artifact view not found.");
            }

            dom.artifactView.innerHTML = "";
        },
        // 清除圣遗物强化日志详情
        ClearLevelUpgradeLogView(): void {
            if(dom.levelUpgradeLogView === null){
                throw new Error("Level upgrade not found.");
            }

            dom.levelUpgradeLogView.innerHTML = "";
        },
        // 获取需要生成的圣遗物类型
        GetInitArtifactType(): ArtifactType {
            if(dom.initArtifactTypeSelect === null){
                throw new Error("Artifact types not found.");
            }

            const t = parseInt((dom.initArtifactTypeSelect as HTMLSelectElement).value);

            if(t < 0 || t > 4){
                throw new Error("The artifact type should be a positive number.");
            }

            return ArtifactIndexToType(t);
        },
        // 更新圣遗物详细
        UpdateArtifactView(artifactType: ArtifactType, mainStat: { stat: Stat, currentLevel: number }, subStats: SubStats[]): void {

            if(dom.artifactView === null) {
                throw new Error("Artifact view not found.");
            }


            // 圣遗物类型
            const headHtml = `
                <p style="font-size: 20px; font-weight: bold">
                    ${GetArtifactTypeLocalization(artifactType, "zh_cn")} (+${mainStat.currentLevel})
                </p>`;

            // 主词条
            const mainStatValue = GetMainStatValue(mainStat.stat, mainStat.currentLevel);
            const mainStatHtml = `<p>${GetStatLocalization(mainStat.stat, "zh_cn")} +${mainStatValue >= 1? mainStatValue: FloatToPercentString(mainStatValue, 2, false)}</p>`;

            // 副词条
            let subStatHtml = ``;

            // 遍历副词条集合
            subStats.forEach(x => {
                // 叠加强化值
                let v = 0;
                x.rank.forEach(rank => {
                    v += GetSubStatValue(x.subStat, rank);
                });
                subStatHtml += `<p>+${x.rank.length - 1} ${GetStatLocalization(x.subStat, "zh_cn")} +${v >= 1? v: FloatToPercentString(v, 2, false)}</p>`;
            });

            // 嵌入ArtifactView
            dom.artifactView.innerHTML = headHtml + mainStatHtml + subStatHtml;

            },
        // 添加圣遗物强化日志
        AddLevelUpgradeLogView(subStat: Stat, upgradeRank: number): void {
            if(dom.levelUpgradeLogView === null){
                throw new Error("Level upgrade view not found.");
            }

            const value = GetSubStatValue(subStat, upgradeRank);
            const html = `<p>${GetStatLocalization(subStat, "zh_cn")}, +${value > 1 ? value : FloatToPercentString(value, 2, false)}</p>`;
            dom.levelUpgradeLogView.innerHTML += html;

        },
        // 切换圣遗物升级按钮的可视状态
        SetArtifactLevelUpgradeButtonShowStatus(shown: boolean): void {
            if(dom.levelUpgradeButton === null){
                throw new Error("Artifact upgrade button not found.");
            }

            (dom.levelUpgradeButton as HTMLButtonElement).style.display = shown ? "block": "none";
        },
        // 获取初始强化等级
        GetInitUpgradeLevel(): number {
            if(dom.initLevelInput ===  null) {
                throw new Error("Level upgrade not found.");
            }

            const initLevel = parseInt((dom.initLevelInput as HTMLInputElement).value);
            if(initLevel < 0 || initLevel > 20){
                throw new Error("Level upgrade must be 0~20");
            }
            return initLevel;
        }
    }
}