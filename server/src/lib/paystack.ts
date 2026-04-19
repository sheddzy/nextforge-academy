import https from 'https';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

export function verifyPaystackTransaction(reference: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error('Invalid Paystack response'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
