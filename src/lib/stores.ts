import { writable } from 'svelte/store';
import { type SongFromTagAPI} from '$lib/apis/tagsapi.ts' 


export const currentSongs = writable<SongFromTagAPI[]>([]);
export const loadImages = writable<boolean>(false);