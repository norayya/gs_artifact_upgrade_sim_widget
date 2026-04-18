<script setup lang="ts">
import {Artifact} from "@/models/Artifact";
import {getStatName, getStatValueType, getSubStatValue, StatType, StatValueType} from "@/models/Stat";
import {floatToPercentString} from "@/utils/floatToText";

const props = defineProps<{
  currentArtifact?: Artifact
}>();

function artifactSubStatValue(stat: StatType, upgradeLevel: number): string {
  const v = getSubStatValue(stat, upgradeLevel);
  return getStatValueType(stat) === StatValueType.int ? v.toString() : floatToPercentString(v, 1, true)
}

</script>

<template>
  <div id="artifact_upgrade_log_view" class="artifact_upgrade_log_view">
    <div v-for="(minorAffix, index) in props.currentArtifact?.minorAffixes.filter(x => x.showOnLog === true)" :key="minorAffix.subStat">
        {{`+${(index+1)*4}:`}} {{ getStatName(minorAffix.subStat)}} {{ `+${artifactSubStatValue(minorAffix.subStat, minorAffix.upgradeLevel)}` }}
      </div>
    </div>
</template>

<style scoped>
  .artifact_upgrade_log_view {
    border: 1px solid #ccc;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    min-height: 280px;
    font-size: 14px;
  }
</style>