<script lang="ts">
    import { searchPciMusic, type PCIsearchResults, type Feed } from "$lib/apis/pci.js";
    import { getSongsByFeedGuid } from "$lib/apis/tagsapi.js";
    import { currentSongs } from "$lib/stores.js";
    import SongsView from '$lib/SongsView.svelte';
    import { onMount } from "svelte";

    let searchTerm = "Doerfel";
    let albums: Feed[] = [];
    let album : Feed = {};
    let loadImages: boolean = false;
    
    onMount(() => {
        $currentSongs = [];
    })

    async function searchAlbums(searchTerm: string) {
        albums = [];
        currentSongs.set([]);
        let results: PCIsearchResults | undefined =
            await searchPciMusic(searchTerm);
        if (results?.feeds) albums = results.feeds;
        return albums;
    }

    async function getSongsFromAlbum(album:Feed) {
        if (album.podcastGuid) {
            $currentSongs = await getSongsByFeedGuid(album.podcastGuid);
            console.log("currentAlbum: ", $currentSongs);
        } else {
        // handle the case where podcastGuid is undefined
        }
    }
</script>

<div id="search-box">
    <h1>Search Album or Artist</h1>
    <input type="text" placeholder="Search" bind:value={searchTerm} on:keyup={e=>e.key==='Enter' && searchAlbums(searchTerm)} id="tfSearch"/>
    <button on:click={() => searchAlbums(searchTerm)}>Search</button><br>
    Load Images <input type="checkbox" name="loadImages" id="" bind:checked={loadImages}>
</div>

{#if albums.length > 0}
    <div id="search-results">
        <h2>Search Results</h2>
        <ul>
            {#each albums as album}
                <li>
                    {#if loadImages}
                        <img src="{album.artwork}" width="75px" alt="">
                    {/if}
                    <a href={'#'} on:click={() => getSongsFromAlbum(album)} title="{album.author} - {album.title}">{album.author?.substring(0, 30)} - {album.title?.substring(0, 30)} - ({album.episodeCount})</a></li>
            {/each}
        </ul>

    </div>
{/if}

{#if $currentSongs.length > 0}
<SongsView />
{/if}
<style>
</style>
