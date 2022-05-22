<script lang="ts">
  import "@src/index.css";
  import { MessageType, type Message } from "@src/messages";
  import { onMount } from "svelte";

  let results: any = [];
  let search: any = "";
  let input: any = "";

  const handleInput = () => {
    let message: Message = { type: MessageType.QUERY, payload: search };
    chrome.runtime.sendMessage(message, (response: Message) => {
      results = response.payload;
    });
  };

  onMount(() => {
    input.focus();
    let message: Message = { type: MessageType.QUERY, payload: "" };
    chrome.runtime.sendMessage(message, (response: Message) => {
      console.log(response);
      results = response.payload;
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
        <div
          class="flex h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
                 border-2 border-black rounded hover:cursor-pointer"
          on:click={() => chrome.tabs.create({ url: result[2] })}
        >
          <div class="flex w-5/6 my-auto">
            <p class="p-1 truncate">{result[1]}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
</style>
