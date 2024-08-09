<script lang=ts>
    import { currentSongs } from "./stores.ts";
    import TagsView from '$lib/tagsView.svelte';
    import { getAcronym } from "$lib/utils/utils";

    let loadImages: boolean = false;
</script>

{#if $currentSongs.length > 0}
<div id="songs-view">
    <ul>
        <li>Load Images <input type="checkbox" name="loadImages" id="" bind:checked={loadImages}></li>
        {#each $currentSongs as song}
            <li>
                {#if loadImages}
                    <img src="{song.imageURL}" width="50px" alt="">
                {/if}
                <a href="https://lnbeats.com/album/{song.feedGuid}" target="_blank" title="{song.artistName} - {song.title}">
                     {getAcronym(song.artistName ?? '')} - {getAcronym(song.title ?? '')}
                </a>
                <ul>
                    <li>
                        <TagsView song={song} />
                    </li>
                </ul>
            </li>
        {/each}
    </ul>
</div>
{/if}

<style>

</style>