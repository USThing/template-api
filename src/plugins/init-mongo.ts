import fp from "fastify-plugin";

export type InitMongoPluginOptions = Record<never, unknown>;

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<InitMongoPluginOptions>(async (fastify) => {
  fastify.addHook("onReady", async () => {
    // Initialize the MongoDB database
    const collectionCourseCatalog =
      fastify.mongo.db!.collection("course-catalog");
    await collectionCourseCatalog.createIndex({ fullAcademicYear: 1 });
    await collectionCourseCatalog.createIndex({ termCode: 1 });
    await collectionCourseCatalog.createIndex({ courseID: 1 });
    await collectionCourseCatalog.createIndex({ courseCode: 1 });
    await collectionCourseCatalog.createIndex({ coursePrefix: 1 });
    await collectionCourseCatalog.createIndex(
      { termCode: 1, courseID: 1 },
      { unique: true },
    );
    await collectionCourseCatalog.createIndex(
      { termCode: 1, courseCode: 1 },
      { unique: true },
    );
  });
});
