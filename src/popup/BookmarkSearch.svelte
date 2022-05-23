<script lang="ts">
  import "@src/index.css";
  import type { searchResult } from "@src/background";
  import Gear from "./Gear.svelte";
  import ArrowDown from "./ArrowDown.svelte";
  import { push } from "svelte-spa-router";
  import { MessageType } from "@src/messages";
  import type { Message } from "@src/messages";
  import { afterUpdate, onMount } from "svelte";

  let results: searchResult[] = [];
  let search: any = "";
  let input: any = "";
  let scrolled = false;
  let expanded: number[] = [];
  let collapsed = -1;

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

  const getLinkBoxStyle = (id: number) => {
    let h = "h-10";
    if (expanded.includes(id)) h = "";
    console.log(expanded, id);
    return `flex ${h} p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
            border-2 border-black rounded hover:cursor-pointer`;
  };

  // TODO: Cache results anticipating navigation back
  // if popup is closed on bookmarkview, clear the cache
  // this could make the scroll not have to wait for query results
  // which is a little jarring if the query isn't fast
  afterUpdate(() => {
    if (!scrolled && params.scrollPos) {
      console.log("attempting to scroll to", params.scrollPos);
      window.scrollTo(0, params.scrollPos);
      if (window.scrollY == params.scrollPos) scrolled = true;
    }
  });

  const handleExpand = (e: any, id: number) => {
    e.stopPropagation();
    expanded = [...expanded, id];
  };
  const handleCollapse = (e: any, id: number) => {
    e.stopPropagation();
    const index = expanded.indexOf(id);
    if (index > -1) {
      expanded.splice(index, 1);
      expanded = expanded;
      collapsed = id;
    }
  };

  onMount(() => {
    if (params.query) {
      search = params.query;
    }
    input.focus();
    handleInput();
  });

  interface paramType {
    scrollPos: number | null;
    query: string | null;
  }
  export let params: paramType = {} as any;
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
          {#if !expanded.includes(result.id)}
            <div
              class="flex h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
            border-2 border-black rounded hover:cursor-pointer"
              on:click={() => chrome.tabs.create({ url: result.url })}
            >
              <div class="flex w-5/6 my-auto">
                <p class="p-1 truncate">{result.title}</p>
              </div>
              <div class="flex ml-auto my-auto space-x-1">
                <div
                  on:click={(e) => {
                    e.stopPropagation();
                    if (search == "") {
                      push(`/view/${result.id}/${window.scrollY}`);
                    } else {
                      push(`/view/${result.id}/${window.scrollY}/${search}`);
                    }
                  }}
                >
                  <Gear />
                </div>
                {#if result.id == collapsed}
                  <div
                    class="animate-arrowr"
                    on:click={(e) => {
                      handleExpand(e, result.id);
                    }}
                  >
                    <ArrowDown />
                  </div>
                {:else}
                  <div
                    on:click={(e) => {
                      handleExpand(e, result.id);
                    }}
                  >
                    <ArrowDown />
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div
              class="flex min-h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
            border-2 border-black rounded hover:cursor-pointer"
              on:click={() => chrome.tabs.create({ url: result.url })}
            >
              <div class="flex w-5/6 my-auto max-h-24">
                <p class="p-1 overflow-ellipsis overflow-hidden">
                  {result.title}
                </p>
              </div>
              <div class="flex ml-auto my-auto space-x-1">
                <div
                  on:click={(e) => {
                    e.stopPropagation();
                    if (search == "") {
                      push(`/view/${result.id}/${window.scrollY}`);
                    } else {
                      push(`/view/${result.id}/${window.scrollY}/${search}`);
                    }
                  }}
                >
                  <Gear />
                </div>
                <div
                  on:click={(e) => {
                    handleCollapse(e, result.id);
                  }}
                  class="animate-arrow"
                >
                  <ArrowDown />
                </div>
              </div>
            </div>
          {/if}
        {:else}
          <div
            class="flex h-10 p-1 bg-slate-800 hover:bg-slate-900 hover:transition-colors
                 border-2 border-black rounded hover:cursor-pointer"
            on:click={() => {
              search = "in:" + result.title;
              handleInput();
              input.focus();
            }}
          >
            <div class="flex w-5/6 my-auto">
              <p class="p-1 truncate text-sky-500">{result.title}</p>
            </div>
            <div class="flex ml-auto my-auto space-x-1">
              <Gear />
              <div
                on:click={(e) => {
                  handleExpand(e, result.id);
                }}
              >
                <ArrowDown />
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</main>

<style></style>
