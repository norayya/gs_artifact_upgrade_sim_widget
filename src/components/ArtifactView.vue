<script setup lang="ts">
import {Artifact, getArtifactTypeName} from "@/models/Artifact";
import {computed} from "vue";
import {getMainStatValue, getStatName, getStatValueType, getSubStatValue, StatType, StatValueType} from "@/models/Stat";
import {floatToPercentString} from "@/utils/floatToText";

const props = defineProps<{
    currentArtifact?: Artifact
  }>();

// 控制显示
const p_isShow = computed(() => {
  return props.currentArtifact === undefined;
});

// 圣遗物类型名称
const artifact_type_name = computed(() => {
  if(props.currentArtifact === undefined){
    return '';
  }
  return getArtifactTypeName(props.currentArtifact?.artifactType);
})

// 圣遗物当前强化等级
const artifact_current_level = computed(() => {
  if(props.currentArtifact === undefined){
    return '';
  }
  return `(+ ${props.currentArtifact?.upgradeLevel})`;
})

// 圣遗物主词条名称
const artifact_major_affix_name = computed(() => {
  if(props.currentArtifact === undefined){
    return '';
  }
  return getStatName(props.currentArtifact.majorAffix);
})

// 圣遗物主词条数值
const artifact_major_affix_value = computed(() => {
 if(props.currentArtifact === undefined){
   return '';
 }

 const v = getMainStatValue(props.currentArtifact.majorAffix, props.currentArtifact.upgradeLevel);
 return `+ ${getStatValueType(props.currentArtifact.majorAffix) === StatValueType.int ? v : floatToPercentString(v, 1, true)}`;
})

// 格式化词条值
function format_affix_value(value: number, type: StatValueType): string {
  return type === StatValueType.int ? value.toString(): floatToPercentString(value, 1, true);
}

// 圣遗物副词条
const artifact_minor_affixes = computed(() => {
  if(props.currentArtifact === undefined){
    return undefined;
  }

  const affixes: { stat: StatType, value: number, valueType: StatValueType, isActive: boolean , upgradeTimes: number}[] = [];

  for(let i =0; i< 4; i++){
    const s = props.currentArtifact.minorAffixes[i];
    affixes.push({
      stat: s.subStat,
      value: getSubStatValue(s.subStat, s.upgradeLevel),
      valueType: getStatValueType(s.subStat),
      isActive: s.isActive,
      upgradeTimes: 0
    });
  }

  if(props.currentArtifact.minorAffixes.length > 4) {
    for(let i = 4 ; i < props.currentArtifact.minorAffixes.length; i++ ){
      const s = props.currentArtifact.minorAffixes[i];
      const a = affixes.find(x => x.stat === s.subStat);

      a.value += getSubStatValue(s.subStat, s.upgradeLevel);
      a.upgradeTimes ++ ;
    }
  }

  return affixes;
});


</script>

<template>
  <div class="artifact_view" v-show="p_isShow">
    <p >点击"生成圣遗物"生成一个圣遗物</p>
  </div>

  <div class="artifact_view_show" v-show="!p_isShow">
    <p class="artifact_view_show_artifact_type"> {{ artifact_type_name }} {{ artifact_current_level }} </p>

    <div class="major_affix_text"> {{ artifact_major_affix_name }} {{ artifact_major_affix_value }} </div>

    <div :class="subStat.isActive ? 'minor_affix_text' : 'minor_affix_text minor_affix_text_no_active'" v-for="subStat in artifact_minor_affixes" :key="subStat.stat">
       {{`+${subStat.upgradeTimes}`}} {{ getStatName(subStat.stat) }} {{`+${format_affix_value(subStat.value, subStat.valueType)}`}} {{ subStat.isActive ? '': ` (未激活)`}}
    </div>
  </div>


</template>

<style scoped>
  .artifact_view {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    min-height: 260px;
  }

  .artifact_view_show {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    min-height: 260px;
  }

  .artifact_view_show_artifact_type {
    font-size: 20px;
    font-weight: bold;
  }

  .major_affix_text {
    font-size: 16px;
    margin-bottom: 6px;
  }

  .minor_affix_text {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .minor_affix_text_no_active {
    color: darkgray;
  }
</style>