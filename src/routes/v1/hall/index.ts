import { FastifyTypebox } from "../../../app.js";
import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export type HallOptions = {
  hallWLUsr: string;
  hallWLPwd: string;
};

export const HallWL = Type.Array(
  Type.Object({
    sid: Type.String(),
    rank: Type.Number(),
    sex: Type.Union([Type.Literal("M"), Type.Literal("F")]),
    type: Type.Union([Type.Literal("L"), Type.Literal("NL")]),
  }),
);
export type HallWL = Static<typeof HallWL>;

const hall: FastifyPluginAsync<HallOptions> = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  let handle: NodeJS.Timeout | null = null;
  let wl: HallWL = [];
  fastify.addHook("onReady", () => {
    async function update(usr: string, pwd: string) {
      try {
        fastify.log.info("Updating hall WL...");
        const { stdout, stderr } = await execAsync(
          `xvfb-run python3 ./scripts/parser-hall-wl/main.py --usr ${usr} --pwd ${pwd}`,
        );
        wl = JSON.parse(stdout);
        fastify.log.info({ stderr }, "Hall WL update successful.");
      } catch (e) {
        fastify.log.error(e, "Hall WL update failed.");
      }
    }
    void update(opts.hallWLUsr, opts.hallWLPwd);
    handle = setInterval(
      update,
      15 * 60 * 1000, // = 1 minute
      opts.hallWLUsr,
      opts.hallWLPwd,
    );
  });
  fastify.addHook("onClose", () => {
    if (handle) {
      clearInterval(handle);
    }
  });
  fastify.get(
    "/wl",
    {
      schema: {
        summary: "Get hall waitlist information.",
        tags: ["Hall"],
        response: {
          200: HallWL,
        },
      },
    },
    async function () {
      return wl;
    },
  );
};

export default hall;
