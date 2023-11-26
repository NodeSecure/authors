// Node.js Dependencies
import net from "node:net";
import streamConsumers from "node:stream/consumers";

// CONSTANTS
const kDefaultSocketServer = "whois.iana.org";

function* lazyParseIanaWhoisResponse(
  rawResponseStr: string
): IterableIterator<[string, string]> {
  const lines = rawResponseStr.split(/\r?\n/);

  for (const line of lines) {
    const safeLine = line.trim();

    if (safeLine !== "" && safeLine.charAt(0) !== "%" && safeLine.includes(":")) {
      const [key, value] = safeLine.split(":");

      yield [key.trimStart(), value.trimStart()];
    }
  }
}

export async function whois(
  domain: string,
  server = kDefaultSocketServer
): Promise<string | null> {
  const client = new net.Socket();
  client.setTimeout(1_000);
  client.connect(43, server, () => client.write(`${domain}\r\n`));

  try {
    const rawResponseStr = await streamConsumers.text(client);
    const response = Object.fromEntries(
      lazyParseIanaWhoisResponse(rawResponseStr)
    );

    if ("refer" in response && response.refer !== server) {
      return whois(domain, response.refer);
    }

    return response?.["Registry Expiry Date"] ?? null;
  }
  finally {
    client.destroy();
  }
}

