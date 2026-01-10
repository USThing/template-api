import fastifyMetrics from "fastify-metrics";
import fp from "fastify-plugin";
import ipaddr from "ipaddr.js";

export default fp(async (fastify, opts) => {
  fastify.addHook("onRequest", async (request, reply) => {
    // Only check IP on the /metrics endpoint
    // Since we don't register this endpoint, we have to make this check.
    if (request.url.split("?")[0] === "/metrics") {
      const ip = request.ip;

      let remoteIP;
      try {
        remoteIP = ipaddr.parse(ip);
      } catch {
        request.log.warn({ ip }, "Invalid IP address accessing metrics");
        return reply.code(403).send("Forbidden");
      }

      // Handle IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1)
      if (
        remoteIP.kind() === "ipv6" &&
        (remoteIP as ipaddr.IPv6).isIPv4MappedAddress()
      ) {
        remoteIP = (remoteIP as ipaddr.IPv6).toIPv4Address();
      }

      const allowedIPv4 = [
        ipaddr.parseCIDR("127.0.0.0/8"), // localhost
        ipaddr.parseCIDR("10.0.0.0/8"), // private A
        ipaddr.parseCIDR("172.16.0.0/12"), // private B (includes 172.17.0.0/16 docker)
      ];

      const allowedIPv6 = [
        ipaddr.parseCIDR("::1/128"), // localhost
        ipaddr.parseCIDR("fc00::/7"), // unique local
      ];

      let allowed = false;
      if (remoteIP.kind() === "ipv4") {
        for (const range of allowedIPv4) {
          if (remoteIP.match(range)) {
            allowed = true;
            break;
          }
        }
      } else if (remoteIP.kind() === "ipv6") {
        for (const range of allowedIPv6) {
          if (remoteIP.match(range)) {
            allowed = true;
            break;
          }
        }
      }

      if (!allowed) {
        request.log.warn({ ip }, "Access to metrics denied");
        return reply.code(403).send("Forbidden");
      }
    }
  });

  await fastify.register(fastifyMetrics.default, {
    endpoint: "/metrics",
    defaultMetrics: { enabled: true },
  });
});
