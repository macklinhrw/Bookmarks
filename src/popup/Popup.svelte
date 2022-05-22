<script lang="ts">
  import Router from "svelte-spa-router";
  import BookmarkSearch from "./BookmarkSearch.svelte";
  import BookmarkView from "./BookmarkView.svelte";
  const routes = {
    "/:scrollPos?/:query?": BookmarkSearch,
    "/view/:id/:scrollPos/:query?": BookmarkView,
  };
</script>

<main>
  <Router {routes} />
</main>

<style>
</style>
