//--------------------------------------------------------
//-- Repository - Changelog tests
//--------------------------------------------------------
import fss from "@absolunet/fss";
import marked from "marked";
import semver from "semver";
import environment from "../../helpers/environment.js";
import paths from "../../helpers/paths.js";

const extractValues = (raw, pattern) => {
	const { groups = {} } = raw.match(pattern) || {};

	return groups;
};

const parseFile = (file) => {
	const parsedText = fss.readFile(file, "utf8");
	const tokens = marked.lexer(parsedText);

	const header = tokens.splice(0, 4).map(({ type, depth, text }) => {
		return { type, depth, text };
	});

	let unreleased = false;
	const releases = tokens
		.filter(({ type, depth, text }) => {
			if (type === "heading" && depth === 2) {
				if (text !== "[Unreleased]") {
					return true;
				}

				unreleased = true;
			}

			return false;
		})
		.map(({ text }) => {
			const { version, date } = extractValues(text, /^\[(?<version>.+)\] - (?<date>\d{4}-\d{2}-\d{2})$/u);

			return { version, date, raw: text };
		});
	const types = tokens
		.filter(({ type, depth }) => {
			return type === "heading" && depth === 3;
		})
		.map(({ text }) => {
			return text;
		});
	const links = Object.keys(tokens.links);

	return { header, unreleased, releases, types, links };
};

const changelogTests = () => {
	//-- Not subpackage
	if (environment.repositoryType !== environment.REPOSITORY_TYPE.subPackage) {
		const FILE = "CHANGELOG.md";
		const filePath = `${paths.project.root}/${FILE}`;
		const { header, unreleased, releases, types, links } = parseFile(filePath);

		describe(`Validate ${environment.getReadablePath(paths.project.root)}/${FILE} respects 'Keep a Changelog'`, () => {
			test(`Ensure header is valid`, () => {
				expect(header, "Header must be identical").toEqual([
					{ type: "heading", depth: 1, text: "Changelog" },
					{ type: "paragraph", text: "All notable changes to this project will be documented in this file." },
					{ type: "space" },
					{
						type: "paragraph",
						text: "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
					},
				]);
			});

			test(`Ensure unreleased heading is valid`, () => {
				expect(unreleased, "File must contain an unreleased heading").toBeTrue();
				expect(links, "Unreleased must have a link").toContain("unreleased");
			});

			test(`Ensure current version is documented`, () => {
				const versions = releases.map(({ version }) => {
					return version;
				});
				expect(versions, "Release headings must contain current version").toContain(environment.version);
			});

			releases.forEach(({ version, date, raw }) => {
				test(`Ensure release heading '${raw}' is valid`, () => {
					expect(version, "Version must be valid").toBe(semver.valid(version));
					expect(links, "Version must have a link").toContain(version);
					expect(Date.parse(date), "Date must be valid").not.toBeNaN();
				});
			});

			test(`Ensure type headings are valid`, () => {
				types.forEach((type) => {
					expect(
						["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"],
						"Type heading must be in whitelist"
					).toContain(type);
				});
			});
		});
	}
};

export default changelogTests;
