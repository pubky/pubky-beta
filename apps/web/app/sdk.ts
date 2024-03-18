// sdkInstance.js
import { Client } from '@pubky/sdk';

export * from '@pubky/common'
export * from 'z32'

const TEST_HOMESERVER = 'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo'
const TEST_PKARR_RELAY = 'http://localhost:7258'

export const client = new Client(TEST_HOMESERVER, {
  relay: TEST_PKARR_RELAY
});

export default client
