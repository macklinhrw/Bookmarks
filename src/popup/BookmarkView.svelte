<script lang="ts">
  import { push } from "svelte-spa-router";
  import ArrowLeft from "./ArrowLeft.svelte";
  interface paramType {
    id: number;
    scrollPos: number;
    query: string | null;
  }
  export let params: paramType = {} as any;
</script>

<main>
  <div
    class="hover: cursor-pointer m-2"
    on:click={() => {
      if (params.query) {
        push(`/${params.scrollPos}/${params.query}`);
      } else {
        push(`/${params.scrollPos}`);
      }
    }}
  >
    <ArrowLeft />
  </div>
  <div class="m-4 space-y-4">
    <p>{params.id}</p>
  </div>
</main>

<style></style>
