import axios, { type AxiosResponse } from "axios";
// import crypto from "crypto";
// import { PCI_KEY, PCI_SECRET, USER_AGENT } from '$env/static';



// interface Feed {
//   id: number;
//   title: string;
//   image: string;
//   artwork: string;
//   author: string;
//   podcastGuid: string;
//   lastUpdateTime: string;
// }

export interface PCIsearchResults {
  feeds?: Feed[];
  count?: number;
  query?: string;
  description?: string;
}

                                                     

export interface Feed {
  id?: number;
  title?: string;
  url?: string;
  originalUrl?: string;
  link?: string;
  description?: string;
  author?: string;
  ownerName?: string;
  image?: string;
  artwork?: string;
  lastUpdateTime?: number;
  lastCrawlTime?: number;
  lastParseTime?: number;
  inPollingQueue?: number;
  priority?: number;
  lastGoodHttpStatusTime?: number;
  lastHttpStatus?: number;
  contentType?: string;
  itunesId?: null;
  generator?: string;
  language?: string;
  type?: number;
  dead?: number;
  crawlErrors?: number;
  parseErrors?: number;
  categories?: {
      [key: string]: string;
  };
  locked?: number;
  explicit?: boolean;
  podcastGuid?: string;
  medium?: string;
  episodeCount?: number;
  imageUrlHash?: number;
  newestItemPubdate?: number;
}

interface Episode {
  guid: string;
  title: string;
  datePublished: string;
  enclosureUrl: string;
}

interface Song {
  album: string;
  albumArt: string;
  albumUpdateTime: string;
  artist: string;
  podcastGuid: string;
  title: string;
  guid: string;
  datePublished: string;
  enclosureUrl: string;
}



// const { PCI_KEY, PCI_SECRET, USER_AGENT } = process.env;

const PCI_KEY="6397CKJ9PXF7D35NKCJN";
const PCI_SECRET='g#t5LeWtFUaTy#4D9sxtAw^N54m7QqgzfM$HS9C5';
const USER_AGENT="v4vTagger v0.0.1";

const baseUrl = "https://api.podcastindex.org/api/1.0/";

async function getSongsFromPCI(): Promise<void> {
  try {
    if (!PCI_KEY || !PCI_SECRET) {
      throw new Error("Missing API keys");
    }
    const headers = createHeaders(PCI_KEY, PCI_SECRET);
    const query = "podcasts/bymedium?medium=music&val=lightning&max=2000";
    const url = `${baseUrl}${query}`;
    const response: AxiosResponse = await axios.get(url, { headers });
    const data = response.data;

    const feeds: Feed[] = filterFeeds(data.feeds || data.feed || []);
    const songs: Song[] = await getSongs(feeds, baseUrl, headers);

    songs.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());

    fs.writeFileSync("feeds.json", JSON.stringify(songs, null, 2));
  } catch (error: any) {
    console.error("getSongsFromPCI error:", error.message);
  }
}



async function createHeaders(key: string, secret: string) {
  
  const input = key+secret+Math.floor(Date.now() / 1000);
  console.log("input: "+input);
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  const userAgent = USER_AGENT || "default-user-agent"; // not able to set in browser
  
  console.log("input: "+input);
  console.log("hash: "+hashHex);
  
  
  
  return {
    "X-Auth-Date": Math.floor(Date.now() / 1000).toString(),
    "X-Auth-Key": key,
    Authorization: hashHex,
    // "User-Agent": userAgent,
  };
}


const skipAuthors = ["Gabe Barrett"];
const skipFeedListIds = [5718023];

function filterFeeds(feeds: Feed[]): Feed[] {
  return feeds.filter((feed) => {
    const isSkipAuthor = skipAuthors.includes(feed.author);
    const isSkipFeed = skipFeedListIds.includes(feed.id);
    return !(isSkipAuthor || isSkipFeed);
  });
}

// export async function getSongs(feeds: Feed[], baseUrl: string, headers: { [key: string]: string }): Promise<Song[]> {
//   const songsPromises: Promise<Song[]>[] = feeds.map(async (feed) => {
    
//     const episodesUrl = `${baseUrl}episodes/bypodcastguid?guid=${feed.podcastGuid}`;
//     const response: AxiosResponse = await axios.get(episodesUrl, { headers });
//     const episodes: Episode[] = response.data.items;
//     return episodes.map((episode) => ({
//       album: feed.title,
//       albumArt: feed.image || feed.artwork,
//       albumUpdateTime: feed.lastUpdateTime,
//       artist: feed.author,
//       podcastGuid: feed.podcastGuid,
//       title: episode.title,
//       guid: episode.guid,
//       datePublished: episode.datePublished,
//       enclosureUrl: episode.enclosureUrl,
//     }));
//   });

//   return (await Promise.all(songsPromises)).flat();
// }

// getSongsFromPCI();

export async function getFeedFromPCIbyGuid(guid: string): Promise<any> {
  console.log("getFeedFromPCIbyGuid: "+guid);
  
  try {
    if (!PCI_KEY || !PCI_SECRET) {
      throw new Error("Missing API keys");
    }
    
    const headers = await createHeaders(PCI_KEY, PCI_SECRET);
    const url = `${baseUrl}podcasts/byguid?guid=${guid}`;
    console.log("url: "+url);
    
    const response: AxiosResponse = await axios.get(url, { headers });
    const data = response.data;
    
    const episodes: Episode[] = data.items;
    episodes.forEach((episode) => {
      console.log(episode);
    });
    return data;
  } catch (error: any) {
    console.error("getFeedFromPCIbyGuid error:", error.message);
  }
}

export async function getEpisodesFromPCIbyGuid(feedGuid: string): Promise<any> {
  //episodes/bypodcastguid?guid=bfd83193-932e-5ef0-b557-418769038ead&pretty
  try {
    if (!PCI_KEY || !PCI_SECRET) {
      throw new Error("Missing API keys");
    }
    const headers = await createHeaders(PCI_KEY, PCI_SECRET);
    const url = `${baseUrl}episodes/bypodcastguid?guid=${feedGuid}`;
    const response: AxiosResponse = await axios.get(url, { headers });
    const data = response.data;
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("getEpisodeFromPCIbyGuids error:", error.message);
  }
}

// export async function getEpisodeFromPCIbyGuids(feedGuid: string, episodeGuid: string): Promise<void> {
//   //byguid?guid=PC2084&podcastguid=abc
//   try {
//     if (!PCI_KEY || !PCI_SECRET) {
//       throw new Error("Missing API keys");
//     }
//     const hash = createHash(PCI_KEY, PCI_SECRET, Math.floor(Date.now() / 1000));
//     const headers = createHeaders(PCI_KEY, await hash, Math.floor(Date.now() / 1000));
//     const url = `${baseUrl}/episodes/byguid?guid=${episodeGuid}&podcastguid=${feedGuid}`;
//     const response: AxiosResponse = await axios.get(url, { headers });
//     const data = response.data;
//     console.log(data);
//   } catch (error: any) {
//     console.error("getEpisodeFromPCIbyGuids error:", error.message);
//   }
// }

export async function searchPciMusic(feedTitle: string): Promise<PCIsearchResults | undefined> {
  try {
    if (!PCI_KEY || !PCI_SECRET) {
      throw new Error("Missing API keys");
    }
    // const hash = createHash(PCI_KEY, PCI_SECRET, Math.floor(Date.now() / 1000));
    const headers = await createHeaders(PCI_KEY, PCI_SECRET);
    const url = `${baseUrl}search/music/byterm?q=${feedTitle}`;
    const response: AxiosResponse = await axios.get(url, { headers });
    const data = response.data;
    console.log(data);
    return data;
    
  } catch (error: any) {
    console.error("searchPciMusic error:", error.message);
  }
}