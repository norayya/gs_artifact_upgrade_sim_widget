import { Artifact, NewArtifact} from "./artifact";
import { NewDomManager } from "./view";

// 全局变量
let artifact: Artifact | undefined = undefined;

// Dom管理器
const domManager = NewDomManager({
    artifactView: document.getElementById("artifact-view"),
    initLevelInput: document.getElementById("init-level"),
    initArtifactTypeSelect: document.getElementById("init-artifact-type"),
    levelUpgradeLogView: document.getElementById("level-up-log-view"),
    levelUpgradeButton: document.getElementById("level-upgrade-button"),
});

//点击生成圣遗物按钮事件
const generateArtifactButtonEvent = (event: Event)=> {
    // 移除当前圣遗物
    if(artifact !== undefined) {
        artifact.OnArtifactLevelUpgraded().CleanSubscribe();
        artifact.OnArtifactSubStatAddedOrUpgraded().CleanSubscribe();
    }
    artifact = undefined;

    // 清空圣遗物详情
    domManager.ClearArtifactView();
    domManager.ClearLevelUpgradeLogView();

    // 生成新的圣遗物
    const t = domManager.GetInitArtifactType();
    artifact = NewArtifact(t);

    // 添加事件
    artifact.OnArtifactLevelUpgraded().Subscribe(data=>{
        if(artifact !== undefined) {
            // 更新圣遗物详情
            domManager.UpdateArtifactView(
                data.artifactType,
                { stat: data.mainStat, currentLevel: data.currentLevel },
                data.subStats
            );
        }
    });
    artifact.OnArtifactSubStatAddedOrUpgraded().Subscribe(data=> {
        domManager.AddLevelUpgradeLogView(data.currentLevel, data.subStat, data.upgradeRank);
    });

    // 初始强化
    const initLevel = domManager.GetInitUpgradeLevel();
    for(let i = 0; i<initLevel; i++) {
        artifact.LevelUpgrade();
    }

    // 更新圣遗物详情
    domManager.UpdateArtifactView(
        artifact.GetArtifactType(),
        { stat: artifact.GetMainStat(), currentLevel: artifact.CurrentLevel() },
        artifact.GetSubStats()
    );


    // 更新升级按钮状态
    domManager.SetArtifactLevelUpgradeButtonShowStatus(true);
}

//点击圣遗物升级按钮事件
const artifactLevelUpgrade = (event: Event)=> {
    if(artifact !== undefined) {
        artifact.LevelUpgrade();
    }
}

// 添加事件
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gen-btn")?.addEventListener("click", generateArtifactButtonEvent);
    document.getElementById("level-upgrade-button")?.addEventListener("click", artifactLevelUpgrade);

    // 更新升级按钮状态
    domManager.SetArtifactLevelUpgradeButtonShowStatus(false);

});




