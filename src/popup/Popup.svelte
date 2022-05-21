<script lang="ts">
  import "@src/index.css";
  import { MessageType, type Message } from "@src/messages";
  import { onMount } from "svelte";

  let results: any = [];
  let search: any = "";
  let input: any;

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
  <div class="my-4 mx-2">
    <input
      class="focus:outline-none focus:ring-blue-400 focus:ring-2 bg-slate-400 p-1 rounded w-full"
      bind:value={search}
      on:input={handleInput}
      bind:this={input}
      placeholder="Enter a title or url here"
    />
    <div class="space-y-2 mt-2">
      {#each results as result}
        <p>{result}</p>
      {/each}
    </div>
  </div>
</main>

<style>
</style>
