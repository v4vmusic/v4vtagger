<script lang="ts">
    import { getAllTags, getSongsByTag } from "$lib/apis/tagsapi.js";
    import { onMount } from "svelte";
    import { currentSongs } from "$lib/stores.js";
    
    let tags: string[] = [];
    
    onMount(async () => {
        tags = await getAllTags();
        console.log(tags);
    })

    async function getTags(tag: string) {
        $currentSongs = await getSongsByTag(tag);
    }
</script>

<h2>All Tags</h2>
<div id="tagcloud">
    {#each tags as tag, i}
        <a href={'#'} on:click={() => getTags(tag)} >{tag}</a>
        {#if i < (tags.length - 1)}&nbsp-&nbsp{/if}
    {/each}
</div>

<style>
    #tagcloud {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 50%;
    }
</style>