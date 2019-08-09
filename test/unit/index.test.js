import fs from 'fs';

const [, crap] = fs.readFileSync('./package.json', 'utf8').split('\n');


test(`Project tests`, () => {
	expect(`Custom test - ${crap}`).toBe('Custom test -   "name": "@absolunet/tester",');
});
