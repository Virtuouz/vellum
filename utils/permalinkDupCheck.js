const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const glob = require('glob');
const { Liquid } = require('liquidjs');

// --- Configuration ---
// Directory to scan for Markdown files
const DOCS_DIRECTORY = './src/docs';
// Path to the directory data file
const DATA_FILE_PATH = path.join(DOCS_DIRECTORY, 'docs.json');
// Custom filter path
const fileSubstringFilter = require(path.join(process.cwd(), 'src/filters/extract-file-substring-filter'));

// --- Initialize LiquidJS Engine ---
const engine = new Liquid();
engine.registerFilter('fileSubstringFilter', fileSubstringFilter);

/**
 * Calculates the permalink for a given file using a LiquidJS template.
 * @param {object} frontMatter - The parsed front matter of the file.
 * @param {string} filePath - The path to the file.
 * @param {string} permalinkTemplate - The LiquidJS template string for the permalink.
 * @returns {Promise<string|null>} The rendered permalink or null on error.
 */
async function calculatePermalink(frontMatter, filePath, permalinkTemplate) {
    // Create the context for Liquid rendering, similar to Eleventy's `page` object
    const fileStem = filePath.replace(/^\.?\/src/, '').replace(/\.mdx?$/, '');
    const context = {
        page: { filePathStem: fileStem },
        title: frontMatter.title || null,
        pageLink: frontMatter.pageLink || null
    };

    if (!permalinkTemplate) {
        console.warn(`Warning: No permalink template found for ${filePath}. Skipping.`);
        return null;
    }
    
    try {
        const permalink = await engine.parseAndRender(permalinkTemplate, context);
        // Clean up potential double slashes that can occur with path joining
        return permalink.trim().replace(/\/\//g, '/');
    } catch (error) {
        console.error(`Error evaluating permalink for ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Main function to find and update duplicate permalinks.
 */
async function updatePermalinks() {
    console.log("Starting permalink check...");

    // 1. Load the default permalink template from the directory data file
    let defaultPermalinkTemplate;
    try {
        const dataFileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        defaultPermalinkTemplate = JSON.parse(dataFileContent).permalink;
        console.log("Successfully loaded default permalink template.");
    } catch (error) {
        console.error(`Fatal: Could not read or parse the data file at ${DATA_FILE_PATH}.`, error);
        return; // Exit if the main template can't be found
    }

    const seenPermalinks = {}; // Tracks permalinks to find duplicates
    const files = glob.sync(`${DOCS_DIRECTORY}/**/*.md`);

    for (const filePath of files) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        const frontMatterMatch = fileContent.match(/^---\n([\s\S]+?)\n---/);
        
        let frontMatter = {};
        if (frontMatterMatch) {
            frontMatter = yaml.load(frontMatterMatch[1]) || {};
        }

        // 2. Use front matter permalink if it exists, otherwise use the default
        const permalinkTemplate = frontMatter.permalink || defaultPermalinkTemplate;
        const originalPermalink = await calculatePermalink(frontMatter, filePath, permalinkTemplate);

        if (originalPermalink) {
            let permalink = originalPermalink;

            // 3. Check for duplicates and generate a new permalink if needed
            if (seenPermalinks[permalink]) {
                const count = seenPermalinks[permalink];
                permalink = permalink.replace(/(\/index\.html)$/, `-copy${count}$1`);
                console.warn(`Duplicate found for "${originalPermalink}". New permalink: "${permalink}"`);
                seenPermalinks[originalPermalink] = count + 1;
            } else {
                seenPermalinks[permalink] = 1;
            }

            // 4. If the permalink was changed, update the file's front matter
            if (permalink !== originalPermalink) {
                frontMatter.permalink = permalink;
                const updatedFrontMatterYaml = yaml.dump(frontMatter);
                const newFrontMatterBlock = `---\n${updatedFrontMatterYaml}---`;

                if (frontMatterMatch) {
                    // If front matter existed, replace it
                    fileContent = fileContent.replace(frontMatterMatch[0], newFrontMatterBlock);
                } else {
                    // If no front matter existed, add it to the top of the file
                    fileContent = `${newFrontMatterBlock}\n\n${fileContent}`;
                }

                fs.writeFileSync(filePath, fileContent, 'utf8');
                console.log(`Updated front matter in: ${filePath}`);
            }
        }
    }

    console.log("\nPermalink update process completed.");
}

updatePermalinks();
