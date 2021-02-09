const localHostBase = "https://localhost:44301";
const productionBase = "https://tweets.postmeta.org"
const isProduction = false;
const environmentSettings = {
    apiBase: isProduction ? `${productionBase}/api/tweet` : `${localHostBase}/api/tweet`,
    signlarRBase: isProduction ? `${productionBase}/api/tweet` : `${localHostBase}/api/tweet`
};


export { environmentSettings as default }