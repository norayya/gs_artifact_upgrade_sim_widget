import {Artifact, ArtifactType} from "./artifact";

// Dom
const Dom = {
    artifact_view: document.getElementById("artifact-view"),
    init_artifact_level: document.getElementById("init-level"),
    init_artifact_type: document.getElementById("init-artifact-type"),
    generate_artifact_button: document.getElementById("gen-btn"),
}

// 添加事件
document.addEventListener("DOMContentLoaded", () => {
    // 生成圣遗物 按键点击事件
    Dom.generate_artifact_button?.addEventListener("click", (event) => {
        // 清空当前全局保存的圣遗物
        artifact = undefined;

        // 
        if(Dom.init_artifact_level === null){
            alert("初始等级不能为空");
        }

        if(Dom.init_artifact_type === null){
            alert("圣遗物类型错误");
        }

        const init_level = parseInt((Dom.init_artifact_level as HTMLInputElement).value);
        if(init_level < 0 || init_level > 20){
            alert("初始等级不能小于0 或者 大于20");
        }

        // select 必须对应 artifact.ts/ArtifactType
        const init_type = parseInt((Dom.init_artifact_type as HTMLSelectElement).value);
        if(init_type < 0 || init_type > 4){
            alert("圣遗物类型错误");
        }

        // 创建圣遗物
        const new_artifact = new Artifact(init_type);

        // 强化
        for(let i: number = 0; i < init_level; i++){
            new_artifact.level_up();
        }

        artifact = new_artifact;
        return;

    });
});

// 全局变量
let artifact: Artifact | undefined = undefined;

