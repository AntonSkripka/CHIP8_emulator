export function authorLine(authors, keys = []) {
    return keys.map((key) => authors[key]?.name ?? key).join(', ') || 'UNKNOWN AUTHOR';
}

export function releaseYear(release) {
    const match = /^(\d{4})/.exec(release ?? '');
    return match?.[1] ?? '';
}

export function releaseDate(release) {
    return release || 'UNKNOWN';
}
