import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { defaultData, defaultSchema } from '../helpers/schemas';

const spec = new Spec();

spec.test('returns recipes from exposed paths `name`', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
    [''],
    ['name'],
  ]);
  ctx.deepEqual(recipes, {
    $schema: 'https://conventions.0xcert.org/87-asset-evidence.json',
    data: [
      {
        path: [],
        values: [
          { index: 3, value: 'B', nonce: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce' },
        ],
        nodes: [
          { index: 1, hash: '1fba16a89b1b3db0b386153879172947f611d8218c7ac1d5ccf076cdbbf10048' },
          { index: 3, hash: '78dbcc37c29dc20ba67f95e716ba983696fe82328c39ff0aa3d3aca1ec28a946' },
          { index: 5, hash: 'c55bf29bdc98704b2fa7003fca49e290b2c87e2f8c268dcec7a3eb3a0832bcbd' },
          { index: 8, hash: '283e38811185f219e37064989f7ba3ab7191c58eafe8dea39688a7372931d76d' },
        ],
      },
    ],
  });
});

spec.test('returns recipes from exposed paths `event.organizer.name`', async (ctx) => {
  const cert = new Cert({
    schema: defaultSchema,
  });
  const recipes = await cert.disclose(defaultData, [
    ['event', 'organizer', 'name'],
  ]);
  ctx.deepEqual(recipes, {
    $schema: 'https://conventions.0xcert.org/87-asset-evidence.json',
    data: [
      {
        path: [],
        values: [
          { index: 2, value: '9b079860f537c3300225f312a865f209cf410a7489b140f1eec2f9da9bd88ff2', nonce: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
        ],
        nodes: [
          { index: 1, hash: '1fba16a89b1b3db0b386153879172947f611d8218c7ac1d5ccf076cdbbf10048' },
          { index: 3, hash: '78dbcc37c29dc20ba67f95e716ba983696fe82328c39ff0aa3d3aca1ec28a946' },
          { index: 6, hash: '680bddde558d04defa8fa5817e96eb7f47e4f07a17d6b3bda1a78c58ea05ded8' },
        ],
      },
      {
        path: ['event'],
        values: [
          { index: 0, value: 'e41ddc3a726700cacec02298841db28af75d0671969a565b72de12d12d0e2736', nonce: '293ff6ac108e226a78170251c8be9e83073894e5ba2861c598fb5ea93793cf3f' },
        ],
        nodes: [
          { index: 2, hash: '732576d3f7e924a0b5c6ac17d10e5fb036d448e9871f2d38bfb2e8cffd5cd71b' },
        ],
      },
      {
        path: ['event', 'organizer'],
        values: [
          { index: 1, value: 'B', nonce: 'f2c6defbdfd54cae320d14d82a80cdd3edfe010ebba2308862ff3bc1aff9cda9' },
        ],
        nodes: [
          { index: 1, hash: '65fe2f8b7b6304deec8828c78f9f0164d947a64b093cffb64073febcdea68660' },
          { index: 4, hash: '1a2feaef8a3e8cf5d0ba00ebb6f86904aab110bb8b3950c794b2547e13a6a73c' },
        ],
      },
    ],
  });
});

export default spec;
