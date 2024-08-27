import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../../app.js";
import { Type } from "@sinclair/typebox";
import { mongodb } from "@fastify/mongodb";
import { pipeline } from "stream/promises";
import fastifyMultipart from "@fastify/multipart";
import { Readable } from "node:stream";

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
      reply.type("application/vnd.android.package-archive");
      reply.header("content-disposition", 'attachment; filename="latest.apk"');
      return apkBucket.openDownloadStreamByName("latest.apk");
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
          summary: "Upload the Latest USThing APK",
          tags: ["APK"],
          consumes: ["multipart/form-data"],
          body: {
            type: "object",
            required: ["apk"],
            properties: {
              apk: { isFile: true },
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
          apk: fastifyMultipart.MultipartFile;
        };

        const inputStream = await body.apk.toBuffer();
        const outputStream = apkBucket.openUploadStream("latest.apk");

        await pipeline(Readable.from(inputStream), outputStream);

        const outdatedFiles = apkBucket.find({
          filename: "latest.apk",
          _id: { $ne: outputStream.id },
        });

        for await (const file of outdatedFiles) {
          await apkBucket.delete(file._id);
        }
      },
    );
  });
};

export default apk;
