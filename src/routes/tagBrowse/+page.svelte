<script lang="ts">
    import { getSongsByTag, type SongFromTagAPI } from "$lib/apis/tagsapi.js";
    import TagCloud from "$lib/tagCloud.svelte";
    import { currentSongs } from "$lib/stores.js";
    import SongsView from '$lib/SongsView.svelte';
    import { onMount } from "svelte";
    onMount(() => {
        $currentSongs = [];
    })

    let tag: string = "";
    async function getTags(tag: string) {
        $currentSongs = await getSongsByTag(tag);
    }
</script>
<TagCloud />

<SongsView />

<style>

</style>