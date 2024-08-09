

export function getAcronym(str: string): string {
    const words = str.split(' ');
    if (words.length < 5) return str;
    return words.map(word => word.charAt(0).toUpperCase()).join('.')+'.';
}