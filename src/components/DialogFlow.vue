<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { marked } from 'marked'; // 用于解析Markdown

// 定义对话条目的类型
interface DialogEntry {
  id: number;
  type: 'query' | 'response' | 'loading';
  content: string;
  isMarkdown?: boolean; // 标记回复是否为Markdown格式
}

const props = defineProps<{
  initialMessages?: DialogEntry[];
}>();

const dialogEntries = ref<DialogEntry[]>(props.initialMessages || []);
const dialogContainerRef = ref<HTMLElement | null>(null);
let nextId = ref(props.initialMessages?.length || 0);

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (dialogContainerRef.value) {
    dialogContainerRef.value.scrollTop = dialogContainerRef.value.scrollHeight;
  }
};

// 监听消息列表变化，自动滚动到底部
watch(dialogEntries, scrollToBottom, { deep: true });

// 方法：添加用户查询
const addQuery = (queryText: string) => {
  dialogEntries.value.push({
    id: nextId.value++,
    type: 'query',
    content: queryText,
  });
  // 模拟等待回复，添加加载状态
  dialogEntries.value.push({
    id: nextId.value++,
    type: 'loading',
    content: '正在查询中...',
  });
};

// 方法：添加系统回复
const addResponse = (responseText: string, isMarkdown: boolean = false) => {
  // 移除加载状态
  const loadingIndex = dialogEntries.value.findIndex(entry => entry.type === 'loading');
  if (loadingIndex !== -1) {
    dialogEntries.value.splice(loadingIndex, 1);
  }

  dialogEntries.value.push({
    id: nextId.value++,
    type: 'response',
    content: responseText,
    isMarkdown: isMarkdown,
  });
};

// 暴露给父组件的方法
defineExpose({
  addQuery,
  addResponse,
  clearDialog: () => {
    dialogEntries.value = [];
    nextId.value = 0;
  }
});

// 用于渲染Markdown内容
const renderMarkdown = (markdownText: string) => {
  return marked(markdownText);
};

</script>

<template>
  <div class="dialog-flow-container" ref="dialogContainerRef">
    <div v-if="dialogEntries.length === 0" class="empty-state">
      暂无对话内容
    </div>
    <div
      v-for="entry in dialogEntries"
      :key="entry.id"
      :class="['dialog-entry', `dialog-entry-${entry.type}`]"
    >
      <div v-if="entry.type === 'query'" class="query-content">
        {{ entry.content }}
      </div>
      <div v-else-if="entry.type === 'response'" class="response-content">
        <div v-if="entry.isMarkdown" v-html="renderMarkdown(entry.content)"></div>
        <div v-else>{{ entry.content }}</div>
      </div>
      <div v-else-if="entry.type === 'loading'" class="loading-content">
        <span class="spinner"></span> {{ entry.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-flow-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 条目之间的间隙 */
  padding: 15px;
  overflow-y: auto;
  height: 400px; /* 您可以根据需要调整高度 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

.dialog-entry {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word; /* 确保长单词能换行 */
  line-height: 1.5;
}

.dialog-entry-query {
  background-color: #007bff;
  color: white;
  align-self: flex-end; /* 用户查询靠右 */
  border-bottom-right-radius: 4px; /* 调整气泡尖角效果 */
}

.dialog-entry-response {
  background-color: #e9e9eb;
  color: #333;
  align-self: flex-start; /* 系统回复靠左 */
  border-bottom-left-radius: 4px; /* 调整气泡尖角效果 */
}

.dialog-entry-response .response-content :deep(p) {
  margin-top: 0;
  margin-bottom: 0.5em;
}
.dialog-entry-response .response-content :deep(p:last-child) {
  margin-bottom: 0;
}
.dialog-entry-response .response-content :deep(ul),
.dialog-entry-response .response-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 0.5em;
}
.dialog-entry-response .response-content :deep(pre) {
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
.dialog-entry-response .response-content :deep(code) {
  font-family: 'Courier New', Courier, monospace;
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}
.dialog-entry-response .response-content :deep(pre) > code {
  background-color: transparent;
  padding: 0;
}


.dialog-entry-loading {
  align-self: flex-start;
  color: #555;
  font-style: italic;
  display: flex;
  align-items: center;
}

.loading-content .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>