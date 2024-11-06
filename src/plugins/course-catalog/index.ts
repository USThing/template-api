import fp from "fastify-plugin";
import { Updater } from "./updater.js";

export interface CourseCatalogOptions {
  msApiAccessToken: string;
}

export default fp<CourseCatalogOptions>(async (fastify, opts) => {
  const [initUpdater, closeUpdater] = Updater(fastify, opts);
  fastify.addHook("onReady", initUpdater);
  fastify.addHook("onClose", closeUpdater);
});
