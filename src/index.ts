import {Artifact, ArtifactType} from "./artifact";
import {Stat, StatTypeTranslate, SubStat} from "./stat";

// 全局变量
let artifact: Artifact | undefined = undefined;

class DomController {
    public static Dom = {
        artifact_view: document.getElementById("artifact-view"),
        init_artifact_level: document.getElementById("init-level"),
        init_artifact_type: document.getElementById("init-artifact-type"),
        generate_artifact_button: document.getElementById("gen-btn"),
        level_up_log_view: document.getElementById("level-up-log-view"),
        level_up_artifact_button: document.getElementById("level-up-btn"),
    }

    /**
     * 清理所有log view
     */
    public static clear_all_view():void {
        if(this.Dom.artifact_view !== null){
            (this.Dom.artifact_view as HTMLElement).innerHTML = '';
        }

        if(this.Dom.level_up_log_view !== null){
            (this.Dom.level_up_log_view as HTMLElement).innerHTML = '';
        }

        this.set_button_display(false); // 隐藏强化按键
    }

    /**
     * 向强化日志窗口添加一个强化词条日志
     * @param inner
     */
    public static add_level_up_log(inner: string): void {
        if(this.Dom.level_up_log_view !== null){
            (this.Dom.level_up_log_view as HTMLElement).innerHTML += inner;
        }
    }

    /**
     * 获取初始的圣遗物强化等级
     */
    public static get_init_artifact_level(): number | undefined {
        if(this.Dom.init_artifact_level === null){
            return undefined;
        }

        return parseInt((this.Dom.init_artifact_level as HTMLInputElement).value);
    }

    /**
     * 获取初始的圣遗物部位类型
     */
    public static get_init_artifact_type(): ArtifactType | undefined {
        if(this.Dom.init_artifact_type === null){
            return undefined;
        }

        const t = parseInt((this.Dom.init_artifact_type as HTMLSelectElement).value);
        if(t < 0 || t > 4){
            return undefined;
        }

        return t;
    }

    /**
     * 设置强化按钮的可视性
     */
    public static set_button_display(display: boolean):void {
        if(this.Dom.level_up_artifact_button !== null){
            const btn = this.Dom.level_up_artifact_button as HTMLButtonElement;
            if(display){
                btn.style.display = ``;
            }else {
                btn.style.display = `none`;
            }
        }
    }

}



// 添加事件
document.addEventListener("DOMContentLoaded", () => {
    // 生成圣遗物 按键点击事件
    DomController.Dom.generate_artifact_button?.addEventListener("click", (event) => {
        // 清空当前全局保存的圣遗物
        artifact = undefined;
        // 清空dom
        DomController.clear_all_view();
        DomController.set_button_display(false);

        //
        const init_level = DomController.get_init_artifact_level();
        if(init_level === undefined){
            alert("初始等级错误");
            return;
        }
        if(init_level < 0 || init_level > 20){
            alert("初始等级不能小于0 或者 大于20");
            return;
        }

        // select 必须对应 artifact.ts/ArtifactType
        const init_type = DomController.get_init_artifact_type();
        if(init_type === undefined){
            alert("圣遗物类型错误");
            return;
        }


        try {
            // 创建圣遗物
            const new_artifact = new Artifact(init_type, x=>{
                // 绑定圣遗物升级事件
                x.on_sub_stat_upgraded.subscribe(x => {
                    if(new_artifact === undefined){
                        return;
                    }
                    // 从圣遗物副词条数组中取出词条类型
                    const sub_stat = new_artifact.get_sub_stat()[x.sub_stat_idx];

                    // 取词条当前强化档位对应的数值
                    const value = SubStat.get_value_by_rank(sub_stat.sub_stat, x.rank);
                    // 如果是百分比数值, 转换为百分比字符串
                    // 否则直接转换为字符串
                    let value_str = '';
                    if(value <= 1 ){
                        value_str = (value*100).toFixed(2).toString();
                        value_str += '%';
                    } else{
                        value_str = value.toString();
                    }

                    const inner = `<p>强化词条 ${StatTypeTranslate(sub_stat.sub_stat)} +${value_str}</p>`;

                    DomController.add_level_up_log(inner);

                });

                // 绑定圣遗物获得新词条事件
                x.on_new_sub_stat_added.subscribe(x => {
                    console.log(`获得词条: ${Stat[x.sub_stat]}`);
                })
            });

            // 强化
            for (let i: number = 0; i < init_level; i++) {
                new_artifact.level_up();
            }


            artifact = new_artifact;

            // 显示强化按钮
            DomController.set_button_display(true)

        }catch(exc){
            if(exc instanceof Error) {
                alert(exc.message);
            }
        }

        return;

    });

    // 强化圣遗物 按键点击事件
    DomController.Dom.level_up_artifact_button?.addEventListener("click", (event) => {
        if(artifact === undefined){
            alert("点击'生成圣遗物'才可以点击强化");
            return;
        }

        // 升级
        artifact.level_up();
    });
});

