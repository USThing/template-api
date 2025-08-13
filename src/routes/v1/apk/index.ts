import { FastifyTypebox } from "../../../app.js";
import { mongodb } from "@fastify/mongodb";
import fastifyMultipart from "@fastify/multipart";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { Readable } from "node:stream";
import { pipeline } from "stream/promises";

export type ApkOptions = {
  apkKey: string;
};

const apk: FastifyPluginAsync<ApkOptions> = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  const apkBucket = new mongodb.GridFSBucket(fastify.mongo.db!, {
    bucketName: "apk",
  });
  const apkVersion = fastify.mongo.db!.collection<{
    version: string;
  }>("apk.version");

  fastify.get(
    "/latest",
    {
      schema: {
        summary: "Download the Latest USThing APK",
        tags: ["APK"],
        produces: ["application/vnd.android.package-archive"],
        response: {
          200: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    async function (request, reply) {
      const latestFile = apkBucket.openDownloadStreamByName("usthing.apk");
      const latestVersion = await apkVersion.findOne();
      return reply
        .type("application/vnd.android.package-archive")
        .header(
          "content-disposition",
          `attachment; filename="usthing-${latestVersion?.version}.apk"`,
        )
        .send(latestFile);
    },
  );

  fastify.get(
    "/latest/version",
    {
      schema: {
        summary: "Get the Latest USThing APK Version",
        tags: ["APK"],
        response: {
          200: Type.String(),
        },
      },
    },
    async function (request, reply) {
      const latestVersion = await apkVersion.findOne();
      return (
        reply
          .type("application/json; charset=utf-8")
          // https://github.com/fastify/fastify/issues/6291
          // We cannot serialize string directly.
          .send(JSON.stringify(latestVersion?.version ?? "0.0.0"))
      );
    },
  );

  // Register to keep the Bearer Auth & Multipart to this scope
  fastify.register(async function (fastify) {
    fastify.register(import("@fastify/bearer-auth"), {
      keys: new Set([opts.apkKey]),
    });
    fastify.register(import("@fastify/multipart"), {
      limits: {
        fileSize: 256 * 1024 * 1024, // 256 MiB
      },
      attachFieldsToBody: true,
    });

    fastify.post(
      "/latest",
      {
        schema: {
          summary: "Upload the Latest USThing APK with Version",
          tags: ["APK"],
          consumes: ["multipart/form-data"],
          body: {
            type: "object",
            required: ["apkFile", "apkVersion"],
            properties: {
              apkFile: {
                isFile: true,
              },
              apkVersion: {},
            },
          },
          response: {
            200: Type.String(),
          },
          security: [{ ApkAuth: [] }],
        },
      },
      async function (request, reply) {
        const body = request.body as {
          apkFile: fastifyMultipart.MultipartFile;
          apkVersion: fastifyMultipart.MultipartValue;
        };
        const istream = await body.apkFile.toBuffer();
        const ostream = apkBucket.openUploadStream("usthing.apk");

        // Upload the APK file to GridFS
        await pipeline(Readable.from(istream), ostream);
        // Update the APK version in the database
        await apkVersion.updateOne(
          {},
          { $set: { version: body.apkVersion.value as string } },
          { upsert: true },
        );

        // Clean up outdated APK files
        const outdatedFiles = apkBucket.find({
          filename: "usthing.apk",
          _id: { $ne: ostream.id },
        });
        for await (const file of outdatedFiles) {
          await apkBucket.delete(file._id);
        }
      },
    );
  });
};
export default apk;
