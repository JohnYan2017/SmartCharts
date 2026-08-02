<template>
  <view v-for="(child, ci) in nodes" :key="ci">
    <view
      class="dash-card sub-card"
      :class="{ 'has-children': child.children && child.children.length, 'expanded': child.children && child.children.length && !child._collapsed }"
      @click="onChildClick(child, ci)"
    >
      <view class="card-main">
        <view class="card-icon small-icon" :style="{ background: child.color || 'linear-gradient(135deg, #1a73e8, #5856d6)' }">
          <!-- #ifdef H5 -->
          <i v-if="isFaClass(child.icon)" :class="child.icon" class="card-fa-icon small-fa"></i>
          <text v-else-if="child.icon" class="card-emoji small-emoji">{{ child.icon }}</text>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <text v-if="iconFn(child.icon)" class="card-emoji small-emoji">{{ iconFn(child.icon) }}</text>
          <!-- #endif -->
        </view>
        <view class="card-info">
          <text class="card-title">{{ child.name }}</text>
        </view>
        <view v-if="child.children && child.children.length" class="card-right">
          <text class="card-badge">{{ child.children.length }}</text>
          <text class="card-chevron" :class="{ rotated: !child._collapsed }">›</text>
        </view>
        <text v-else class="card-arrow">›</text>
      </view>
    </view>

    <!-- 递归渲染子节点 -->
    <view v-if="child.children && child.children.length && !child._collapsed" class="sub-models">
      <SubNodes
        :nodes="child.children"
        :depth="depth + 1"
        :icon-fn="iconFn"
        :on-open="onOpen"
        :path="path.concat(ci)"
        @toggle="onToggle"
      />
    </view>
  </view>
</template>

<script>
export default { name: 'SubNodes' }
</script>

<script setup>
const props = defineProps({
  nodes: { type: Array, default: () => [] },
  depth: { type: Number, default: 0 },
  iconFn: { type: Function, default: () => (() => '') },
  onOpen: { type: Function, required: true },
  path: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle'])

function isFaClass(str) {
  return str && str.includes('fa-')
}

function onChildClick(child, ci) {
  if (child.children && child.children.length) {
    emit('toggle', { path: props.path.concat(ci) })
  } else {
    props.onOpen(child)
  }
}

function onToggle(payload) {
  emit('toggle', payload)
}
</script>

<style scoped>
.dash-card {
  border-radius: 14rpx;
  margin-bottom: 6rpx;
  padding: 16rpx 20rpx;
  background: #fafbfc;
  border: 1rpx solid #f0f0f0;
  cursor: pointer;
}

.dash-card:active { background: #f0f4ff; }
.dash-card.expanded {
  background: #f5f7fb;
  border-color: #e0e8f5;
  border-radius: 14rpx 14rpx 6rpx 6rpx;
}
.card-main { display: flex; align-items: center; }
.card-icon {
  width: 72rpx; height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.card-icon.small-icon {
  width: 56rpx; height: 56rpx;
  border-radius: 12rpx;
}
.card-emoji { font-size: 30rpx; line-height: 1; }
.small-emoji { font-size: 24rpx; }
.card-fa-icon { font-size: 28rpx; color: #fff; }
.small-fa { font-size: 22rpx; }
.card-info { flex: 1; min-width: 0; }
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
  margin-left: 8rpx;
}
.card-badge {
  font-size: 20rpx;
  color: #fff;
  background: #1a73e8;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  font-weight: 600;
}
.card-chevron {
  font-size: 32rpx;
  color: #8e8e93;
  transition: transform 0.15s ease;
  display: inline-block;
  width: 32rpx;
  text-align: center;
}
.card-chevron.rotated { transform: rotate(90deg); }
.card-arrow { font-size: 32rpx; color: #c7c7cc; }

.sub-models {
  margin-left: 28rpx;
  padding-left: 20rpx;
  border-left: 2rpx solid #e8e8ed;
  margin-bottom: 6rpx;
}
</style>
