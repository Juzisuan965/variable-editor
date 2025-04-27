<template>
  <div class="dropdown-menu">
    <template v-if="items.length">
      <div
        class="dropdown-item-wrapper"
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="handleMouseEnter(item, index)"
        @mouseleave="handleMouseLeave()"
      >
        <button
          :class="{
            'is-selected': index === selectedIndex,
            'has-children': item.children && item.children.length,
          }"
          @click="selectItem(index)"
        >
          {{ item.label }}
          <span
            v-if="item.children && item.children.length"
            class="has-children-icon"
            >›</span
          >
        </button>

        <div
          v-if="
            item.children &&
            item.children.length &&
            (hoveredItem === item ||
              (index === selectedIndex && showSubMenuForSelected))
          "
          class="sub-menu"
          @mouseenter="isHoveringSubMenu = true"
          @mouseleave="isHoveringSubMenu = false"
        >
          <button
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            :class="{
              'is-selected':
                childIndex === selectedChildIndex &&
                selectedParentIndex === index,
            }"
            @click.stop="selectSubItem(item, child)"
          >
            {{ child.label }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VariableType } from "./types";

interface Props {
  items: Array<VariableType>;
  command: (item: { id: string; label: string }) => void;
}

const props = defineProps<Props>();
const selectedIndex = ref(0);
const hoveredItem = ref<VariableType | null>(null);
const showSubMenuForSelected = ref(false);
const selectedChildIndex = ref(0);
const selectedParentIndex = ref(-1);
const isNavigatingSubMenu = ref(false);

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
    hoveredItem.value = null;
    showSubMenuForSelected.value = false;
    selectedChildIndex.value = 0;
    selectedParentIndex.value = -1;
    isNavigatingSubMenu.value = false;
  }
);

const upHandler = () => {
  if (isNavigatingSubMenu.value && selectedParentIndex.value >= 0) {
    const parentItem = props.items[selectedParentIndex.value];
    if (parentItem && parentItem.children && parentItem.children.length > 0) {
      selectedChildIndex.value =
        (selectedChildIndex.value + parentItem.children.length - 1) %
        parentItem.children.length;
    }
  } else {
    selectedIndex.value =
      (selectedIndex.value + props.items.length - 1) % props.items.length;
    updateSubMenuForKeyboardNavigation();
  }
};

const downHandler = () => {
  if (isNavigatingSubMenu.value && selectedParentIndex.value >= 0) {
    const parentItem = props.items[selectedParentIndex.value];
    if (parentItem && parentItem.children && parentItem.children.length > 0) {
      selectedChildIndex.value =
        (selectedChildIndex.value + 1) % parentItem.children.length;
    }
  } else {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    updateSubMenuForKeyboardNavigation();
  }
};

const rightHandler = () => {
  const selectedItem = props.items[selectedIndex.value];
  if (
    selectedItem &&
    selectedItem.children &&
    selectedItem.children.length > 0
  ) {
    showSubMenuForSelected.value = true;
    selectedChildIndex.value = 0;
    selectedParentIndex.value = selectedIndex.value;
    isNavigatingSubMenu.value = true;
  }
};

const leftHandler = () => {
  if (isNavigatingSubMenu.value) {
    isNavigatingSubMenu.value = false;
  }
};

const updateSubMenuForKeyboardNavigation = () => {
  const selectedItem = props.items[selectedIndex.value];

  if (
    selectedItem &&
    selectedItem.children &&
    selectedItem.children.length > 0
  ) {
    showSubMenuForSelected.value = true;
    selectedParentIndex.value = selectedIndex.value;

    if (!isNavigatingSubMenu.value) {
      selectedChildIndex.value = 0;
    }
  } else {
    showSubMenuForSelected.value = false;
    isNavigatingSubMenu.value = false;
  }
};

const enterHandler = () => {
  if (isNavigatingSubMenu.value && selectedParentIndex.value >= 0) {
    const parentItem = props.items[selectedParentIndex.value];
    if (parentItem && parentItem.children && parentItem.children.length > 0) {
      const childItem = parentItem.children[selectedChildIndex.value];
      if (childItem) {
        selectSubItem(parentItem, childItem);
      }
    }
  } else {
    selectItem(selectedIndex.value);
  }
};

const handleMouseEnter = (item: VariableType, index: number) => {
  if (item.children && item.children.length) {
    hoveredItem.value = item;
  }
  selectedIndex.value = index;
  isNavigatingSubMenu.value = false;
};

const handleMouseLeave = () => {
  if (!isHoveringSubMenu.value) {
    hoveredItem.value = null;
  }
};

const isHoveringSubMenu = ref(false);

const selectItem = (index: number) => {
  const item = props.items[index];
  if (item) {
    if (item.children && item.children.length) {
      showSubMenuForSelected.value = true;
      selectedParentIndex.value = index;
      selectedChildIndex.value = 0;
      isNavigatingSubMenu.value = true;
    } else {
      props.command({
        id: item.value,
        label: item.label,
      });
    }
  }
};

const selectSubItem = (parent: VariableType, child: VariableType) => {
  const combinedItem = {
    value: `${parent.value}:${child.value}`,
    label: `${parent.label}:${child.label}`,
    childValue: child.value,
    childLabel: child.label,
  };
  props.command({
    id: combinedItem.value,
    label: combinedItem.label,
  });
};

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === "ArrowUp") {
    upHandler();
    return true;
  }

  if (event.key === "ArrowDown") {
    downHandler();
    return true;
  }

  if (event.key === "ArrowRight") {
    rightHandler();
    return true;
  }

  if (event.key === "ArrowLeft") {
    leftHandler();
    return true;
  }

  if (event.key === "Enter") {
    enterHandler();
    return true;
  }

  return false;
};

defineExpose({
  onKeyDown,
});
</script>

<style lang="less" scoped>
.dropdown-menu {
  background: #fff;
  border: 1px solid rgba(61, 37, 20, 0.05);
  border-radius: 0.7rem;
  box-shadow: 0px 12px 33px 0px rgba(0, 0, 0, 0.06),
    0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow: visible;
  padding: 0.5rem;
  position: relative;

  .dropdown-item-wrapper {
    position: relative;
  }

  button {
    align-items: center;
    background-color: transparent;
    display: flex;
    gap: 0.25rem;
    text-align: left;
    width: 100%;
    border: none;
    padding: 6px 6px;
    border-radius: 4px;
    color: #2e2b29;
    position: relative;

    &:hover,
    &:hover.is-selected {
      background-color: rgba(61, 37, 20, 0.12);
    }

    &.is-selected {
      background-color: rgba(61, 37, 20, 0.08);
    }

    &.has-children {
      display: flex;
      justify-content: space-between;

      .has-children-icon {
        margin-left: 8px;
        font-size: 14px;
      }
    }
  }

  .sub-menu {
    position: absolute;
    left: 100%;
    top: 0;
    background: #fff;
    border: 1px solid rgba(61, 37, 20, 0.05);
    border-radius: 0.7rem;
    box-shadow: 0px 12px 33px 0px rgba(0, 0, 0, 0.06),
      0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04);
    padding: 0.5rem;
    z-index: 10;
    min-width: 150px;
  }

  .sub-item {
    &:hover {
      background-color: rgba(61, 37, 20, 0.12);
    }
  }
}
</style>
