<template>
  <n-loading-bar-provider>
    <LoadingContent />
    <n-dialog-provider>
      <DialogContent />
      <n-message-provider>
        <MessageContent />
        <slot></slot>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script setup>
import LoadingContent from "../LoadingContent/LoadingContent";
import DialogContent from "../DialogContent/DialogContent";
import MessageContent from "../MessageContent/MessageContent";
</script>
