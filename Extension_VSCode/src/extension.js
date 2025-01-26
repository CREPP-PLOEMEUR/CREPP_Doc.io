"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
function activate(context) {
    // Register a TreeViewDataProvider for the "openGitProjects" view
    const gitProjectsProvider = new GitProjectsProvider();
    vscode.window.registerTreeDataProvider('openGitProjects', gitProjectsProvider);
    // Optional: Add a command to open the panel from this view
    vscode.commands.registerCommand('extension.openGitProjectsPanel', () => {
        vscode.window.showInformationMessage('Git Projects Panel Opened!');
        console.log("Git project");
    });
    vscode.commands.registerCommand('extension.downloadProjectPDF', async (url, name) => {
        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file("Ressources_Electronique_&_Informatique.pdf"),
            filters: { 'PDF Files': ['pdf'] }
        });
        if (uri) {
            const file = fs.createWriteStream(uri.fsPath);
            https.get(url, response => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    vscode.window.showInformationMessage("Téléchargement terminé : ${uri.fsPath}");
                });
            }).on('error', err => {
                fs.unlink(uri.fsPath, () => { });
                vscode.window.showErrorMessage("Erreur de téléchargement : ${err.message}");
            });
        }
    });
}
function deactivate() { }
// Define the TreeDataProvider
class GitProjectsProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // Top-level items (your Git projects)
            return Promise.resolve([
                new LabelItem('Ressources'),
                new ProjectItem('Support PDF', 'file', 'https://raw.githubusercontent.com/CREPP-PLOEMEUR/CREPP_Doc.io/main/Ressources_Electronique_&_Informatique.pdf', 'https://raw.githubusercontent.com/CREPP-PLOEMEUR/CREPP_Doc.io/main/Ressources_Electronique_&_Informatique.pdf'),
                new SeparatorItem(),
                new LabelItem('Codes Version 1.x - ESP12'),
                new ProjectItem('V1.x.Bases - LED', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.LEDs'),
                new ProjectItem('V1.x.Bases - Potentiomètre', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.Potentiometre'),
                new ProjectItem('V1.x.Bases - Boutons', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.Buttons'),
                new ProjectItem('V1.x.Base - BME280', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V1.x.Base - RTC', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V1.x.Base - HC-SR04', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V1.x.Sensors - Serveur WEB minimaliste', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V1.x.Base - Serveur WEB avec BME280', 'code', 'https://github.com/user/project2.git'),
                new SeparatorItem(),
                new ProjectItem('V1.x.Tools - Scanner I2C', 'wrench', 'https://github.com/user/project2.git'),
                new SeparatorItem(),
                new LabelItem('Codes Version 2.x - Pico'),
                new ProjectItem('V2.x.Base - LED', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.LEDs'),
                new ProjectItem('V2.x.Base - Potentiomètre', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.Potentiometre'),
                new ProjectItem('V2.x.Base - Boutons', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Base - BME280', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Base - RTC', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Base - HC-SR04', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Sensors - Serveur WEB minimaliste', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Base - Serveur WEB avec BME280', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('V2.x.Bot - NRF24', 'hubot', 'https://github.com/user/project2.git'),
                new SeparatorItem(),
                new LabelItem('Archives'),
                new ProjectItem('Codes Arduino', 'code', 'https://github.com/CREPP-PLOEMEUR/Codes_Arduino'),
                new ProjectItem('Codes ESP12', 'code', 'https://github.com/CREPP-PLOEMEUR/Codes_ESP12'),
            ]);
        }
        return Promise.resolve([]); // No children for now
    }
}
class ProjectItem extends vscode.TreeItem {
    label;
    url;
    pdfUrl;
    constructor(label, icon, url, pdfUrl) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.url = url;
        this.pdfUrl = pdfUrl;
        this.command = pdfUrl ? {
            command: 'extension.downloadProjectPDF',
            title: 'Télécharger le PDF',
            arguments: [pdfUrl, label],
        } : {
            command: 'git.clone',
            title: 'Clone Repository',
            arguments: [url],
        };
        this.iconPath = new vscode.ThemeIcon(icon);
        if (pdfUrl) {
            this.contextValue = 'projectWithPDF';
        }
    }
}
class LabelItem extends ProjectItem {
    constructor(label, icon = 'code') {
        super('📌 ' + label, icon, '');
        this.contextValue = 'label';
        this.iconPath = '';
    }
}
class SeparatorItem extends ProjectItem {
    constructor() {
        super('──────────', '', '');
        this.contextValue = 'separator';
        this.iconPath = undefined;
    }
}
// class SeparatorItem extends ProjectItem {
//     constructor() {
//         super('$(error) ──────────', ''); // Ajout d'une icône "error" rouge
//         this.contextValue = 'separator'; // Marque comme un élément spécial
//         this.command = undefined; // Désactive les interactions
//         this.iconPath = new vscode.ThemeIcon('error'); // Icône rouge
//     }
// }
//# sourceMappingURL=extension.js.map