import { Updater } from "./updater.js";
import fp from "fastify-plugin";

export interface CourseCatalogOptions {
  msApiAccessToken: string;
}

export default fp<CourseCatalogOptions>(async (fastify, opts) => {
  const [initUpdater, closeUpdater] = Updater(fastify, opts);
  fastify.addHook("onReady", initUpdater);
  fastify.addHook("onClose", closeUpdater);
});
