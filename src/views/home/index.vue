<script setup lang="ts">

</script>

<template>
  <div class="description">
    <div class="title">NoteBlog</div>
    <div class="brief">个人笔记系统</div>
  </div>
  <div class="introduce">
    <div class="info-card">
      <div class="card-title">Markdown</div>
      <div class="card-brief">丰富的语法支持，代码高亮，可灵活插入图片。</div>
    </div>
    <div class="info-card">
      <div class="card-title">支持 vim&emacs 输入</div>
      <div class="card-brief">让双手不离键盘，轻松提升笔记效率。</div>
    </div>
    <div class="info-card">
      <div class="card-title">多端同步</div>
      <div class="card-brief">支持所有设备同步笔记资料。</div>
    </div>
    <div class="info-card">
      <div class="card-title">笔记共享</div>
      <div class="card-brief">笔记可通过发布为文章的方式共享笔记。</div>
    </div>
    <div class="info-card">
      <div class="card-title">详细历史纪录</div>
      <div class="card-brief">每次更新文章都在后端备份，轻松管理版本信息。</div>
    </div>
    <div class="info-card">
      <div class="card-title">权限管理</div>
      <div class="card-brief">文章可进行访问控制设置，解决共享隐私问题。</div>
    </div>
  </div>
</template>

<style scoped>
.description {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px;
  background-color: #29303e;
}

.title {
  color: #fff;
  font-size: 48px;
}

.brief {
  color: #ddd;
}

.introduce {
  display: flex;
  flex-wrap: wrap;
  padding: 32px 64px;
}

.info-card {
  width: calc(100% / 3);
  padding: 16px;
  box-sizing: border-box;
}

.card-title {
  font-weight: 700;
  margin: 8px 0;
}

.card-brief {
  color: #666;
  word-break: break-word;
}
</style>
