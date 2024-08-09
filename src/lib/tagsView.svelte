<script lang="ts">
    import { type SongFromTagAPI, patchTagsByFeedGuid, patchTagsByGuids, getSongsByTag } from './apis/tagsapi.ts';
    import { currentSongs } from "$lib/stores.js";
    export let song:SongFromTagAPI;
    let edting:boolean = false;
    let tagstring:string = '';
    

    function editTags() {
        edting = true;
        tagstring = song.tags?.join(', ') || '';
    }
    function doneEditing(wholeAlbum:boolean) {
        if (wholeAlbum){
            if (confirm("Are you sure?\nThis will update every song on the album with these tags, There is no undo.")) {
                // update tags for whole album
                upateAPI(wholeAlbum);
            }else {
                return;
            }
        }
        if (tagstring.match(/[^a-zA-Z0-9, ]/g)) {
            alert("Tags can only contain letters, numbers, spaces and must be seperated by a comma\n example: rock, pop, 50s, demu");
            return;
        }
        edting = false;
        song.tags = tagstring.toLowerCase().split(', ');
        //TODO: handle cases like "a,b" and "a , b"
        upateAPI(wholeAlbum);
    }

    function upateAPI(wholeAlbum:boolean) {
        console.log("wholeAlbum: ", wholeAlbum);
        
        if (wholeAlbum) {
            console.log("Updating tags for whole album ", song.feedGuid);
            patchTagsByFeedGuid(song.feedGuid ?? '', song.tags ?? []);
        }else {
            console.log("Updating tags for this song ", song.title);
            patchTagsByGuids(song.feedGuid ?? '', song.itemGuid ?? '', song.tags ?? []);
        }
    }
    async function getTags(tag: string) {
        $currentSongs = await getSongsByTag(tag);
    }

</script>
{#if !edting}
    {#if Array.isArray(song.tags) && song.tags.length > 0}
            {#each song.tags as tag, i}
                <a href={'#'} on:click={() => getTags(tag)} >{tag}</a>
                {#if i < (song.tags.length - 1)}&nbsp-&nbsp{/if}
            {/each}
            <li><button on:click={editTags}>Edit</button></li>
    {:else}
            No Tags Yet 🙁 <button on:click={editTags}>Add</button>
    {/if}
{:else}
    <li>
        <input type="text" bind:value={tagstring}>
        <button on:click={() => doneEditing(false)}>This Song</button> | 
        <button on:click={() => doneEditing(true)}>Whole Album</button>
        <a href={"#"} on:click={() => edting = false}>Cancel</a>
    </li>
{/if}

<style>
    a {
        font-size: 0.8em;
        color: blue;
        text-decoration: none;
    }
    button {
        font-size: 0.8em;
    }
    li  {
        list-style-type: none;
    }
</style>