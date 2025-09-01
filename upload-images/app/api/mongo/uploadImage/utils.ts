import { MongoClient, ServerApiVersion } from 'mongodb';
import { computePhash, isEquel } from '../sameImage/utils';


const DB = 'certiview';
const COLLECTION = 'images';

const getMongoClient = (mongoUri: string) => new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const upload = async (image: File, mongoUri: string) => {
    const client = getMongoClient(mongoUri);
    await client.connect();

    const db = client.db(DB);
    const collection = db.collection(COLLECTION);

    const buffer = Buffer.from(await image.arrayBuffer());
    const phashValue = await computePhash(buffer);

    const insertResult = await collection.insertOne({
        imageBuffer: buffer,
        phash: phashValue,
        uploadedAt: new Date(),
    });

    await client.close();

    return { insertResult, phash: phashValue };
};

export const findSimilarImage = async (
    image: File,
    mongoUri: string,
    threshold = 5
) => {
    const client = getMongoClient(mongoUri);
    await client.connect();

    const db = client.db(DB);
    const collection = db.collection(COLLECTION);

    const buffer = Buffer.from(await image.arrayBuffer());
    const newPhash = await computePhash(buffer);

    const docs = await collection
        .find({}, { projection: { _id: 1, phash: 1 } })
        .toArray();

    for (const doc of docs) {
        if (isEquel(newPhash, doc.phash, threshold)) {
            await client.close();
            return { exists: true, id: doc._id, matchedPhash: doc.phash };
        }
    }

    await client.close();
    return { exists: false, targetPhash: newPhash };
};
