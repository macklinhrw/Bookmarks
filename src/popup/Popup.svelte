<script lang="ts">
  import Router from "svelte-spa-router";
  import BookmarkSearch from "./BookmarkSearch.svelte";
  import BookmarkView from "./BookmarkView.svelte";
  const routes = {
    "/:scrollPos?/:query?": BookmarkSearch,
    "/view/:id/:scrollPos/:query?": BookmarkView,
  };
</script>

<main class="w-80 h-96 max-h-96 overflow-x-hidden overflow-y-auto">
  <Router {routes} />
</main>

<style>
</style>
