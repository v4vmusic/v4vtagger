

export function getAcronym(str: string): string {
    const words = str.split(' ');
    if (words.length < 5) return str;
    return words.map(word => word.charAt(0).toUpperCase()).join('.')+'.';
}

// write a function that takes a string and outputs the first 3 words of the string followed by an acronym of the remaining letters


export function getFirstWordsAndAcronym(str: string): string {
    const words = str.split(' ');
    if (words.length < 3) return str;
    const first3Words = words.slice(0, 3);
    const remainingWords = words.slice(3);
    const acronym = remainingWords.map(word => word.charAt(0).toUpperCase()).join('.')+'.';
    return first3Words.join(' ') + ' ' + acronym;
}
