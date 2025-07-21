import {Artifact, ArtifactType, ArtifactTypeTranslate} from "./artifact";
import {MainStat, ParseString, Stat, StatTypeTranslate, SubStat} from "./stat";
import {EventHandle} from "./event";

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


    /**
     * 更新圣遗物描述内容
     * @param artifact
     */
    public static update_artifact_view(artifact: Artifact): void {
        if(this.Dom.artifact_view !== null){
            //
            const zh_cn_artifact_type = ArtifactTypeTranslate(artifact.get_artifact_type());
            const head = `<p style="font-size: 20px; font-weight: bold">${zh_cn_artifact_type} (+${artifact.current_level()})</p>`;

            // 主词条
            const zh_cn_main_stat = StatTypeTranslate(artifact.get_main_type());
            const main_stat_value = MainStat.get_value_by_level(artifact.get_main_type() ,artifact.current_level());
            const main = `<p>${zh_cn_main_stat} +${ParseString(main_stat_value)}</p>`

            // 副词条
            let t = '';
            for(let i=0; i< artifact.get_sub_stat().length; i++){
                const zh_cn_sub_stat = StatTypeTranslate(artifact.get_sub_stat()[i].sub_stat);
                let v = 0;
                // 叠加强化值
                for(let j=0; j<artifact.get_sub_stat()[i].upgrade_ranks.length; j++){
                    const table = SubStat.get_value_by_rank(artifact.get_sub_stat()[i].sub_stat, artifact.get_sub_stat()[i].upgrade_ranks[j]);
                    v += table;
                }
                const v_str = ParseString(v);
                t += `<p>+${artifact.get_sub_stat()[i].upgrade_ranks.length-1} ${zh_cn_sub_stat} +${v_str}</p>`;
            }

            let r = head + main + t;

            (this.Dom.artifact_view as HTMLElement).innerHTML = r;

        }
    }

    public static add_level_up_log(t: string, sub_stat: Stat, rank: number): void {
        if(this.Dom.level_up_log_view !== null){
            const zh_cn_sub_stat = StatTypeTranslate(sub_stat);
            const sub_stat_value = ParseString(SubStat.get_value_by_rank(sub_stat, rank));
            const inner = `<p>${t} ${zh_cn_sub_stat} +${sub_stat_value}</p>`;

            (this.Dom.level_up_log_view as HTMLElement).innerHTML += inner;
        }
    }

}

// 添加事件
document.addEventListener("DOMContentLoaded", () => {
    // 生成圣遗物 按键点击事件
    DomController.Dom.generate_artifact_button?.addEventListener("click", (event) => {
        // 清空当前全局保存的圣遗物
        if(artifact !== undefined){
            // 清空事件
            artifact.on_new_sub_stat_added.clear_subscribe();
            artifact.on_sub_stat_upgraded.clear_subscribe();
        }
        // 断开引用
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


                    //const inner_add_level = `<p>强化词条 ${StatTypeTranslate(sub_stat.sub_stat)} +${ParseString(SubStat.get_value_by_rank(sub_stat.sub_stat, x.rank))}</p>`;

                    DomController.add_level_up_log("强化词条", sub_stat.sub_stat, x.rank);

                    // 添加到圣遗物描述窗口
                    DomController.update_artifact_view(new_artifact);
                });

                // 绑定圣遗物获得新词条事件
                x.on_new_sub_stat_added.subscribe(x => {
                    // 取词条当前强化档位对应的数值
                    const value = SubStat.get_value_by_rank(x.sub_stat, x.rank);

                    DomController.add_level_up_log("获得词条", x.sub_stat, x.rank);

                })
            });

            // 强化
            for (let i: number = 0; i < init_level; i++) {
                new_artifact.level_up();

                // 添加到圣遗物描述窗口
                DomController.update_artifact_view(new_artifact);
            }

            // 放入全局变量
            artifact = new_artifact;

            // 显示强化按钮
            DomController.set_button_display(true)

            // 添加到圣遗物描述窗口
            DomController.update_artifact_view(new_artifact);

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

        // 添加到圣遗物描述窗口
        DomController.update_artifact_view(artifact);

    });
});

