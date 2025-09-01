import { writeFile, readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import phash from 'sharp-phash';


const saveBufferToTempFile = async (buffer: Buffer) => {
    const tempFilePath = join(tmpdir(), `temp_file_${randomUUID()}.bin`);
    await writeFile(tempFilePath, buffer);

    return tempFilePath;
}

export const computePhash = async (buffer: Buffer): Promise<string> => {
    const path = await saveBufferToTempFile(buffer);
    const img = await readFile(path);
    const phashImg = await phash(img);
    await unlink(path);

    return phashImg;
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

