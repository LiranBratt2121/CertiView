import { writeFile, readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';


export const getPhashFromServer = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://certi-view-2f5y.vercel.app/phash', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.phash as string;

    } catch (error) {
        console.error("Error fetching phash:", error);
        return "";
    }
};

const hammingDistance = (a: string, b: string): number => {
    if (a.length !== b.length) {
        throw new Error("Strings must be equal length");
    }

    return [...a].reduce((acc, ch, i) => acc + (ch !== b[i] ? 1 : 0), 0);
}

export const isEquel = (a: string, b: string, threshold: number) => {
    return hammingDistance(a, b) <= threshold;
}

