"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
require("./styles/Footer.css");
const Footer = () => {
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
    };
    return (react_1.default.createElement("footer", { className: "footer" },
        react_1.default.createElement("p", null, "\u00A9 2023 KanBoard. All rights reserved."),
        react_1.default.createElement("div", { className: "language-switcher" },
            react_1.default.createElement("button", { onClick: () => handleLanguageChange('en') }, "English"),
            react_1.default.createElement("button", { onClick: () => handleLanguageChange('pl') }, "Polish"))));
};
exports.default = Footer;
