module.exports = {
    "parserOptions": {
        sourceType: "module"
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": false,
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": "off",
        "indent": [
            "off",
            4
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "off",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-var": "warn",
    }
};
