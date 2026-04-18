<script setup>

</script>

<template>
  <div>
    <p>更新日志</p>
    <div id="update_log">
      <h3>r4</h3>
        <p>Apr 19, 2026</p>
        <p>1. 换用vue框架</p>
        <p>2. 现在圣遗物主词条随机概率已正确工作</p>

      <h3>r3</h3>
        <p>Mar 19, 2026</p>
        <p>1. 修复「头」可能会出现重复词条的问题</p>

      <h3>r2</h3>
        <p>Sep 15, 2025</p>
        <p>1. 跟随月之一版本更新, 现在roll出3词条圣遗物时, 第4词条会显示未激活</p>

      <h3>r1</h3>
        <p>Aug 16, 2025</p>
        <p>1. 插件发布</p>
    </div>

  </div>
</template>

<style scoped>
#update_log {
  width: 400px;
  height: 500px;
  max-height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  padding: 10px;
}

</style>