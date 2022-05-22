<script lang="ts">
  import type { searchResult } from "@src/background";
  import Gear from "./Gear.svelte";
  import ArrowDown from "./ArrowDown.svelte";

  import "@src/index.css";
  import { MessageType, type Message } from "@src/messages";
  import { onMount } from "svelte";

  let results: [searchResult] = [] as any;
  let search: any = "";
  let input: any = "";

  const handleInput = () => {
    let message: Message = { type: MessageType.QUERY, payload: search };
    chrome.runtime.sendMessage(message, (response: Message) => {
      results = response.payload.sort((a: searchResult, b: searchResult) => {
        if (a.isFolder && b.isFolder) return 0;
        if (a.isFolder) {
          return -1;
        } else if (b.isFolder) {
          return 1;
        }
        return 0;
      });
    });
  };

  onMount(() => {
    input.focus();
    let message: Message = { type: MessageType.QUERY, payload: "" };
    chrome.runtime.sendMessage(message, (response: Message) => {
      results = response.payload.sort((a: searchResult, b: searchResult) => {
        if (a.isFolder && b.isFolder) return 0;
        if (a.isFolder) {
          return -1;
        } else if (b.isFolder) {
          return 1;
        }
        return 0;
      });
    });
  });
</script>

<main>
  <div class="my-2 mx-1">
    <input
      class="focus:outline-none focus:ring-blue-400 focus:ring-2 bg-slate-500 p-1 rounded w-full placeholder:text-gray-300"
      bind:value={search}
      on:input={handleInput}
      bind:this={input}
      placeholder="Enter a title or url here"
    />
    <div class="space-y-1 mt-2 pb-1">
      {#each results as result}
        {#if !result.isFolder}
          <div
            class="flex h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
                 border-2 border-black rounded hover:cursor-pointer"
            on:click={() => chrome.tabs.create({ url: result.url })}
          >
            <div class="flex w-5/6 my-auto">
              <p class="p-1 truncate">{result.title}</p>
            </div>
            <div class="flex ml-auto my-auto space-x-1">
              <Gear />
              <ArrowDown />
            </div>
          </div>
        {:else}
          <div
            class="flex h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
                 border-2 border-black rounded hover:cursor-pointer"
          >
            <div class="flex w-5/6 my-auto">
              <p class="p-1 truncate text-sky-500">{result.title}</p>
            </div>
            <div class="flex ml-auto my-auto space-x-1">
              <Gear />
              <ArrowDown />
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</main>

<style>
</style>
