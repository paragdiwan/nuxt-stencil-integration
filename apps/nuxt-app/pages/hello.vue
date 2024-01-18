<template>
    <div>
        test <MyComponent first="hello" last="world" />
    </div>
</template>

<script lang="ts" setup>
import { defineCustomElements , applyPolyfills } from "stencil-lib/loader";

applyPolyfills().then(() => {
    defineCustomElements();
})

//@ts-ignore
import { MyComponent } from "stencil-vue-wrapper/dist/index";

</script>