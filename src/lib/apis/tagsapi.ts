import axios, { type AxiosResponse } from "axios";
const baseUrl = "https://tags.v4vmusic.com/"
//http://tags.v4vmusic.com:3001/items/byGuid/05b75483-9f5b-5236-bd66-69e9d3e1b995/c372c998-bbec-47fb-b266-f178dce6aba4

export async function getAllTags(): Promise<string[]> {
    const endpoint = "https://tags.v4vmusic.com/tags";
    const response = await fetch(endpoint, { mode: "cors" });
    const data = await response.json();
    return data
}


export async function getTagsByGuids(feedGuid: string, episodeGuid: string): Promise<SongFromTagAPI[]> {
    const endpoint = baseUrl + "items/byGuid/" + feedGuid + "/" + episodeGuid;
    let tags: string[] = [];
    console.log("endpoint: " + endpoint);
    console.log("tags: " + tags);
    const response = await fetch(endpoint, { mode: "cors" });
    const data = await response.json();
    return tags = data.tags;
}


export async function getSongsByTag(tag: string): Promise<SongFromTagAPI[]> {
    const endpoint = baseUrl + "items/byTag/" + tag;
    let songs: string[] = [];
    console.log("endpoint: " + endpoint);
    console.log("songs: " + songs);
    const response = await fetch(endpoint, { mode: "cors" });
    const data = await response.json();
    return songs = data;
}


export async function getSongsByFeedGuid(feedGuid: string): Promise<SongFromTagAPI[]> {
    const endpoint = baseUrl + "items/byGuid/" + feedGuid;
    console.log("endpoint: " + endpoint);
    const response = await fetch(endpoint, { mode: "cors" });
    const data: SongFromTagAPI[] = await response.json();
    // console.log("SongsByFeedGuid: " + JSON.stringify(data));
    return data;
}

export async function getSongsByGuids(feedGuid: string, episodeGuid: string): Promise<SongFromTagAPI[]> {
    const endpoint = baseUrl + "items/byGuid/" + feedGuid + "/" + episodeGuid;
    console.log("endpoint: " + endpoint);
    const response = await fetch(endpoint, { mode: "cors" });
    const data: SongFromTagAPI[] = await response.json();
    // console.log("SongsByGuids: " + JSON.stringify(data));
    return data;
}


export async function patchTagsByGuids(feedGuid: string, episodeGuid: string, tags: string[]): Promise<void> {
    tags = sanitizeTags(tags);
    const endpoint = baseUrl + "items/addtags/" + feedGuid + "/" + episodeGuid;
    console.log("endpoint: " + endpoint);
    const response = await axios.patch(endpoint, {
        tags: tags
    });
    const data = await response.data;
    console.log(data);
}


export async function patchTagsByFeedGuid(feedGuid: string, tags: string[]): Promise<void> {
    tags = sanitizeTags(tags);
    const endpoint = baseUrl + "items/addtagsbyfeedguid/" + feedGuid;
    // use axios to patch the tags
    const response = await axios.patch(endpoint, {
        tags: tags
    });
    const data = await response.data;
    console.log(data);
}


export function sanitizeTags(tags: string[]): string[] {
    const out: string[] = [];
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].length > 0) {
            out.push(tags[i].toLowerCase());
            // remove any characters that are not letters, numbers, or spaces
            out[i] = out[i].replace(/[^a-zA-Z0-9\s]/g, '');
            // trim the string 
            out[i] = out[i].trim();
        }
    }

    // remove duplicates
    const seen: { [key: string]: boolean } = {};
    for (let i = 0; i < out.length; i++) {
        if (!seen[out[i]]) {
            seen[out[i]] = true;
        } else {
            out.splice(i, 1);
            i--;
        }
    }





    return out;
}


export interface SongFromTagAPI {
    _id?: string;
    tags?: string[];
    feedGuid?: string;
    itemGuid?: string;
    synced?: string;
    imageURL?: string;
    mp3URL?: string;
    artistName?: string;
    title?: string;
    __v?: number;
    //TODO: add album title
} 