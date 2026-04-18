<script setup lang="ts">
import ArtifactView from "@/components/ArtifactView.vue";
import ArtifactUpgradeLogView from "@/components/ArtifactUpgradeLogView.vue";
import {Artifact, ArtifactType, getInitArtifactTypeSelectOptionShowNames,} from "@/models/Artifact";
import {computed, ref, watch} from "vue";
import UpdateLog from "@/components/UpdateLog.vue";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

// 当前圣遗物
let currentArtifact = ref<Artifact | undefined>();

// 初始化圣遗物强化等级
const initLevel = ref<number>(0);

// 初始化圣遗物类型选项
const initArtifactTypesSelectOptionShowNames = ref(getInitArtifactTypeSelectOptionShowNames());

// 初始化圣遗物插槽
let init_artifact_slot = ref<number>(0);

// 清除按钮点击事件
const onClearBtnClick = () => {
    currentArtifact.value = undefined;
}

// 是否显示升级按钮
const upgrade_btn_isShow = computed(() => {
  return currentArtifact.value !== undefined;
})

// 是否显示清除按钮
const clear_btn_isShow = computed(() => {
  return currentArtifact.value !== undefined;
})

// 升级按钮点击事件
const onUpdateBtnClick = () => {
  currentArtifact?.value.upgrade();
}

// 是否允许升级按钮点击
const upgrade_btn_isDisabled = computed(() => {
  if (currentArtifact.value === undefined) {
    return false;
  }
  return (currentArtifact?.value.upgradeLevel >= 20);
})

// 生成按钮点击事件
const onGenerateBtnClick = () => {
  currentArtifact.value = Artifact.new(ArtifactType[ArtifactType[init_artifact_slot.value]], initLevel.value);
}

// 是否允许生成按钮点击
const generate_btn_isDisabled = computed(() => {
  return currentArtifact.value !== undefined;
})

// 版本号点击事件
const openUpdateLog = () => {
  update_log_isShow.value = true;
}

// 是否显示更新记录
let update_log_isShow = ref(false);

const update_window_ref = ref(null);

// 锁定背景滚动
watch(update_log_isShow, (value)=> {
  if(value){
    disableBodyScroll(update_window_ref)
  }else{
    enableBodyScroll(update_window_ref)
  }
})

const closeUpdateLog = () => {
  update_log_isShow.value = false;
}

// 测试按键事件
const onTestBtnClick = () => {
  console.log(currentArtifact.value);
}


</script>

<template>
  <h1>原神圣遗物强化模拟器</h1>

  <ArtifactView v-bind:currentArtifact="currentArtifact"></ArtifactView>

  <label for="init_level">初始等级 (0-20):</label>
  <input type = "number" id ="init_level" min = "0" max = "20" value="0" v-model="initLevel" />

  <label for="init_artifact_slot">选择部位</label>
  <select id="init_artifact_slot" name="init_artifact_slot" v-model="init_artifact_slot">
    <option v-for = "artifact_names in initArtifactTypesSelectOptionShowNames" :key="artifact_names.slot" :value="artifact_names.slot">
      {{ artifact_names.showName }}
    </option>
  </select>

  <div>
    <button id="artifact_generate_btn" :disabled="generate_btn_isDisabled" @click="onGenerateBtnClick">生成圣遗物</button>
    <button id="artifact_upgrade_btn" :disabled="upgrade_btn_isDisabled" v-show="upgrade_btn_isShow" @click="onUpdateBtnClick">强化圣遗物</button>
    <button id="artifact_clear_btn" v-show="clear_btn_isShow" @click="onClearBtnClick">移除圣遗物</button>
    <button id="test_btn" v-show="false" @click="onTestBtnClick" >Test Btn</button>
  </div>

  <ArtifactUpgradeLogView v-bind:currentArtifact="currentArtifact"></ArtifactUpgradeLogView>



  <p id="versionText" @click="openUpdateLog">ver: r4</p>

  <div ref="update_window_ref" v-show="update_log_isShow" id="update_log_window">
    <UpdateLog></UpdateLog>
    <button id="update_log_close_btn" @click="closeUpdateLog">关闭</button>
  </div>


</template>

<style scoped>
  input {
    padding: 8px;
    margin:5px;
    width:50px;
  }

  select {
    padding: 8px;
    margin: 5px;
    width: 140px;
  }

  button {
    padding: 8px 15px;
    margin: 5px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

  }

  button:hover {
    background-color: #45a049;
  }

  button:disabled{
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.5;
  }

  #versionText {
    cursor: pointer;
    width: 50px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 2px;
  }

  #update_log_window {
    position: fixed;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: grid;
    align-items: center;
    justify-content: center;
    height: 40%;
    min-width: 450px;
    min-height: 650px;
    max-width: 500px;
    margin: 120px auto auto;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  #update_log_close_btn {
    width: 80px;
  }

</style>
