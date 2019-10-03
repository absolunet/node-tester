//--------------------------------------------------------
//-- Repository - lerna.json tests
//--------------------------------------------------------
import semver       from 'semver';
import fss          from '@absolunet/fss';
import arborescence from '../../helpers/arborescence';
import env          from '../../helpers/environment';
import paths        from '../../helpers/paths';


export default () => {

		//-- Multi package
	if (env.repositoryType === env.REPOSITORY_TYPE.multiPackage) {
		const FILE = 'lerna.json';

		describe(`Validate ${env.getReadablePath(paths.project.root)}/${FILE}`, () => {

			test(`Ensure '${FILE}' is valid`, () => {
				arborescence.fileExists(FILE, paths.project.root);

				const config = fss.readJson(`${paths.project.root}/${FILE}`);

				expect(config.version, 'Version must be valid').toBe(semver.valid(config.version));

				expect(config.packages, 'Packages must must be valid').toStrictEqual(['packages/*']);
			});

		});

	} else {
		describe.skip();
	}

};
