<script setup lang="ts">
import { ref } from 'vue';

// const isMenuVisible = ref(false);
const hideMenuTimer = ref<NodeJS.Timeout | null>(null);

function handleButtonClick() {
  console.log('Floating button clicked!');
  // 保持原有的点击逻辑
  // window.ipcRenderer.send('show-main-window');
  const trigger = document.querySelector('.floating-action-button');
  const submenu = document.querySelector('.extension-menu');
  if (trigger && submenu) {
    submenu.classList.toggle('active');
    (trigger as HTMLElement).style.transform = submenu.classList.contains('active')
            ? 'rotate(90deg)' 
            : 'rotate(0deg)';
  }
}

function handleMenuItemClick(action: string) {
  console.log(`Menu item clicked: ${action}`);
  // isMenuVisible.value = false; // 点击菜单项后立即隐藏菜单
  if (hideMenuTimer.value) {
    clearTimeout(hideMenuTimer.value); // 清除可能存在的隐藏计时器
    hideMenuTimer.value = null;
  }
  // 根据 action 执行相应操作，例如：
  // if (action === 'query') { window.ipcRenderer.send('open-query-window'); }
  // if (action === 'setting') { window.ipcRenderer.send('open-settings-window'); }
  // if (action === 'quit') { window.ipcRenderer.send('quit-app'); }
}

</script>

<template>
  <div id="floating-button-container">
    <button class="floating-action-button" 
      @mouseover="handleButtonClick()"
      @mouseleave="handleButtonClick()"
    >
    </button>
    <div class="extension-menu">
      <button class="menu-item menu-item-query" @click="handleMenuItemClick('query')"></button>
      <button class="menu-item menu-item-setting" @click="handleMenuItemClick('setting')"></button>
      <button class="menu-item menu-item-exit" @click="handleMenuItemClick('quit')"></button>
    </div>
  </div>

</template>

<style scoped>

#floating-button-container {
  position: fixed;
  -webkit-app-region: no-drag; 
  right: 10px;
}

.floating-action-button {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%; /* 圆形按钮 */
  background-color: #6f6e71; /* 按钮颜色 */
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  -webkit-app-region: no-drag; 
  background-image: url("./assets/assistant.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70%; /* 调整图标大小，使其在按钮内看起来更合适 */
}

#floating-action-button:hover {
  background-color: #6f6e71;
}

#floating-action-button:active {
  background-color: #6f6e71;
  /*transform: scale(0.95);*/
}

/* 移除了不再使用的 .button-icon 样式，因为图标现在是按钮的背景 */

.extension-menu {
  position: absolute;
  top: 0;
  right: 70px;
  display: none;
  gap: 0;
  background-color: #6f6e71;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
}

.extension-menu.active {
    right: 50px; /* 展开后位置 */
    display: flex;
    gap: 10px; /* 按钮间距 */
}

.menu-item {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 圆形菜单项 */
  background-color: #6e6e71; /* 菜单项背景色 */
  color: black;
  cursor: pointer;
  font-size: 10px;
  border: none;
  white-space: nowrap; /* 防止菜单项文字换行 */
  text-align: center; /* 菜单项文字居中 */
  justify-content: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 60%; /* 调整图标大小，使其在按钮内看起来更合适 */
}

.menu-item-query {
  background-image: url("./assets/query.svg");
}
.menu-item-setting {
  background-image: url("./assets/setting.svg");
}
.menu-item-exit {
  background-image: url("./assets/exit.svg");
}
.menu-item:hover {
  background-color: #6f6e71; /* 鼠标悬停在菜单项上的背景色 */
  transform: scale(1.1);
}
</style>
