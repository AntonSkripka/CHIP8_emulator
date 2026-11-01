# `match_filename`

**Function essence:** Compares fixed-width filename fields.

Signature: `static bool match_filename(const char* entry_name, const char* search_name)`

## Input / Output / Side-effects

- **Input:** An 18-byte directory filename field and a search string.
- **Output:** Returns the result of an 18-byte strncmp comparison.
- **Side-effects:** Code path and state changes: Uses strncmp for 18 bytes, matching the directory-entry field width.

## Detailed explanation

Uses strncmp for 18 bytes, matching the directory-entry field width.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The 18-byte bytewise comparison is case-sensitive and does not normalize Unicode; names that differ in case or encoding bytes do not match.
