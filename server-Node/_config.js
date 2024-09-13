/* */

import { _config } from "./_private.js";
import os from "os";

const config = {
  "version": "0.5.2",
  "mode": "dev",
  "port": 3000,
};

checkMode();

function checkMode() {
  const serverName = os.hostname().toLowerCase();
  if (!_config.devHosts.includes(serverName)) {
    config.mode = _config.mode;
    config.port = _config.port;
  }
}

export { config };

/* FAKE _private.js

const _config = {
  "devHosts": [
    "host1",
    "host2",
    "host3",
    "host4",
  ],
  "mode": "production",
  "port": 3003,
};

export {
  _config
};

*/
