import yaml from 'js-yaml';

export default async function(eleventyConfig, pluginOptions) {
    eleventyConfig.versionCheck(">=3.0.0-alpha.1");
    
    eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

    // let globalSettings = {};
    // try {
    //     const globalSettingsYaml = await fs.readFile(`${PUBLIC_CONTENT_DIR}/_settings/global.yaml`, 'utf8');
    //     globalSettings = yaml.load(globalSettingsYaml);
    // } catch (e) {
    //     consoleInfo(`No global settings found at '${PUBLIC_CONTENT_DIR}/_settings/global.yaml'`);
    // }
}