import { FastifyTypebox } from "../../../app.js";

import { ClubInfoSchema, ClubInfo, ClubInfoWithImageSchema } from "./types.js";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import fs from 'fs';
import { GridFSBucket } from 'mongodb';

const clubsInfo: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
): Promise<void> => {
  const collection = fastify.mongo.db!.collection<ClubInfo>("clubs");

  async function uploadImage(filePath: string, fileName:string, db: any) {
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(fileName, { contentType: 'image/png' });
      readStream.on('error', reject);
      uploadStream.on('error', reject);
      uploadStream.on('finish', resolve);
      readStream.pipe(uploadStream);
    });
  };

  async function uploadClubs(data: ClubInfo[], db: any) {
  const collection = db.collection('clubs');
  const BASE_IMAGE_PATH = "assets/clubLogos/";
  //first, validate all image paths
  for (const club of data) {
    try {
      await fs.promises.access(`${BASE_IMAGE_PATH}${club.imageName}`);
    } catch (err) {
      throw new Error(`Logo path for club ${club.name} is invalid. Current path: ${BASE_IMAGE_PATH}${club.imageName}`);
    }
  }
  for (let club of data) {
    await uploadImage(`${BASE_IMAGE_PATH}${club.imageName}`, club.imageName, db);
    await collection.updateOne(
      { name: club.name },
      { $set: club },
      { upsert: true }
    );

  }
}


async function getBase64FromFilename(filename: string): Promise<string> {
const db = fastify.mongo.db;
if (!db) {
    throw new Error("No database connection");
}
  const bucket = new GridFSBucket(db, { bucketName: 'images' });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('error', err => reject(err));
    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      resolve(base64);
    });
  });
}

async function deleteClubs(names: string[], db: any) {
    const collection = db.collection('clubs');
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    for (const name of names) {
        const club = await collection.find({ "name": name }).toArray();
        if (club.length > 0) {
            for (const c of club) {
                if (c.logoPath) {
                    // Delete image from GridFS
                    const files = await bucket.find({ filename: c.logoPath }).toArray();
                    for (const file of files) {
                        await bucket.delete(file._id);
                    }
                }
            }
        collection.deleteMany({ "name": name });
        }
    }
}

  // Get all clubs, optionally filtered by a search string of name

  
  fastify.get(
    "/clubs",
    {
      schema: {
        summary:
          "Get all clubs, optionally filtered by a search string of name.",
        description: "If no search string is specified, all clubs will be returned.",
        tags: ["Clubs"],
        querystring: Type.Object({
          searchName: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(ClubInfoWithImageSchema),
        },
      },
    },
    async function (request) {
      const searchName = request.query.searchName ?? "";
      let searchResults = await collection
        .find(
          {
            $or: [
              { name: { $regex: searchName, $options: "i" } },
            ],
          },
          {
            projection: { _id: 0 },
          },
        )
        .toArray();

    const finalResults = await Promise.all(
      searchResults.map(async (club) => {
        if (club.imageName) {
          try {
            const base64 = await getBase64FromFilename(club.imageName);
            return { ...club, imageBase64: base64 };
          } catch (error) {
            fastify.log.error(error);
            return { ...club, imageBase64: "" };
          }
        }
        return { ...club, imageBase64: "" };
      })
    );

    return finalResults;
  }
);

 fastify.get(
    "/clubNames",
    {
      schema: {
        summary: "Get all club names",
        description: "Retrieve a list of all club names.",
        tags: ["Clubs"],
        response: {
          200: Type.Array(Type.String()),
        },
      },
    },
    async function (request, reply) {
      const clubNames = await collection.distinct("name");
      reply.send(clubNames);
    }
  );

  fastify.post(
    "/uploadClub", 
    {
        schema: {
          summary: "Upload or update club information",
          description: "Upload or update club information. If a club with the same name exists, it will be updated.",
          tags: ["Clubs"],
            body: Type.Array(ClubInfoSchema),
            response: {
                201: Type.Object({
                    success: Type.Boolean(),
                    message: Type.String(),
                }),
            },
        },
    },
    async function (request, reply) {
        const clubs = request.body;
        await uploadClubs(clubs, fastify.mongo.db!);

        reply.status(201).send({
            success: true,
            message: "Club uploaded successfully",
        });
    }
)

fastify.post("/deleteClubs", {
    schema: {
        summary: "Delete clubs by names",
        description: "Delete clubs by providing an array of club names. This will also delete associated images from GridFS.",
        tags: ["Clubs"],
        body: Type.Object({
            names: Type.Array(Type.String(), {
                description: 'Array of club names to be deleted',
                examples: [['Fencing Club', 'The Catholic Society']]
            })
        }),
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                message: Type.String(),
            }),
        },
    }},
    async function (request, reply) {
        const { names } = request.body;
        for (const name of names) {
            const club = await collection.find({ "name": name }).toArray();
            if (club.length === 0) {
                reply.status(404).send({
                    success: false,
                    message: `Club with name ${name} not found`,
                });
                return;
            }
        }
        await deleteClubs(names, fastify.mongo.db!);

        reply.status(200).send({
            success: true,
            message: "Clubs deleted successfully",
        });
    }
);


}

export default clubsInfo;