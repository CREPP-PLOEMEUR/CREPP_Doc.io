import * as vscode from 'vscode';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // Register a TreeViewDataProvider for the "openGitProjects" view
    const gitProjectsProvider = new GitProjectsProvider();
    vscode.window.registerTreeDataProvider('openGitProjects', gitProjectsProvider);

    // Optional: Add a command to open the panel from this view
    vscode.commands.registerCommand('extension.openGitProjectsPanel', () => {
        vscode.window.showInformationMessage('Git Projects Panel Opened!');
        console.log("Git project");
    });

    vscode.commands.registerCommand('extension.downloadProjectPDF', async (url: string, name: string) => {
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
                fs.unlink(uri.fsPath, () => {});
                vscode.window.showErrorMessage("Erreur de téléchargement : ${err.message}");
            });
        }
    });

}

export function deactivate() {}

// Define the TreeDataProvider
class GitProjectsProvider implements vscode.TreeDataProvider<ProjectItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProjectItem | undefined | void> = new vscode.EventEmitter<ProjectItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ProjectItem | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: ProjectItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ProjectItem): Thenable<ProjectItem[]> {
        if (!element) {
            // Top-level items (your Git projects)
            return Promise.resolve([

                new LabelItem('Ressources'), 
                new ProjectItem('Support PDF', 'file', 'https://raw.githubusercontent.com/CREPP-PLOEMEUR/CREPP_Doc.io/main/Ressources_Electronique_&_Informatique.pdf', 'https://raw.githubusercontent.com/CREPP-PLOEMEUR/CREPP_Doc.io/main/Ressources_Electronique_&_Informatique.pdf'),

                new SeparatorItem(),

                new LabelItem('Codes Version 1.x - ESP12'), 
                new ProjectItem('Bases - LED', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.LEDs'),
                new ProjectItem('Bases - Potentiomètre', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.Potentiometre'),
                new ProjectItem('Bases - Boutons', 'code', 'https://github.com/CREPP-Codes/V1.x-Bases.Buttons'),

                new ProjectItem('Sensors - OLED', 'code', 'https://github.com/CREPP-Codes/V1.x-Display.OLED'),
                new ProjectItem('Sensors - BME280', 'code', 'https://github.com/CREPP-Codes/V1.x-Sensors.BME280'),
                new ProjectItem('Sensors - RTC', 'code', 'https://github.com/CREPP-Codes/V1.x-Sensors.RTC'),
                new ProjectItem('Sensors - HC-SR04', 'code', 'https://github.com/CREPP-Codes/V1.x-Sensors.HC-SR04'),
                new ProjectItem('Sensors - Interruptions', 'code', 'https://github.com/CREPP-Codes/V1.x-Sensors.Interrupts'),
                new ProjectItem('Sensors - Photoresistance', 'code', 'https://github.com/CREPP-Codes/V1.x-Sensors.Photoresistance'),

                new ProjectItem('Web - Serveur WEB minimaliste', 'code', 'https://github.com/user/project2.git'),
                new ProjectItem('Web - Serveur WEB avec BME280', 'code', 'https://github.com/user/project2.git'),


                new ProjectItem('Tools - Scanner I2C', 'wrench', 'https://github.com/CREPP-Codes/V1.x-Sensors.Scanner_I2C'),
                
                new SeparatorItem(),

                new LabelItem('Codes Version 2.x - Pico'), 
                new ProjectItem('Bases - LED', 'code', 'https://github.com/CREPP-Codes/V2.x-Bases.LEDs'),
                new ProjectItem('Bases - Potentiomètre', 'code', 'https://github.com/CREPP-Codes/V2.x-Bases.Potentiometre'),
                new ProjectItem('Bases - Boutons', 'code', 'https://github.com/CREPP-Codes/V2.x-Bases.Buttons'),
                
                new ProjectItem('Screens - OLED', 'code', 'https://github.com/CREPP-Codes/V2.x-Display.OLED'),
                new ProjectItem('Sensors - BME280', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.BME280'),
                new ProjectItem('Sensors - RTC', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.RTC'),
                new ProjectItem('Sensors - HC-SR04', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.HC-SR04'),
                new ProjectItem('Sensors - Accéléromètre', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.Accelerometre'),
                new ProjectItem('Sensors - Interruptions', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.Interrupts'),
                new ProjectItem('Sensors - Photoresistance', 'code', 'https://github.com/CREPP-Codes/V2.x-Sensors.Photoresistance'),
                new ProjectItem('Sensors - Serveur WEB minimaliste', 'code','https://github.com/user/project2.git'),
                new ProjectItem('Web - Serveur WEB avec BME280', 'code','https://github.com/user/project2.git'),
                new ProjectItem('Connectivity - NRF24', 'hubot','https://github.com/user/project2.git'),



                new ProjectItem('Tools - Scanner I2C', 'wrench', 'https://github.com/CREPP-Codes/V2.x-Sensors.Scanner_I2C'),

                new SeparatorItem(),

                new LabelItem('Archives'), 
                new ProjectItem('Codes Arduino', 'code','https://github.com/CREPP-PLOEMEUR/Codes_Arduino'),
                new ProjectItem('Codes ESP12', 'code','https://github.com/CREPP-PLOEMEUR/Codes_ESP12'),

                
            ]);
        }

        return Promise.resolve([]); // No children for now
    }
}

class ProjectItem extends vscode.TreeItem {
    constructor(public readonly label: string, icon: string, public readonly url: string, public readonly pdfUrl?: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
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
    constructor(label: string, icon:string = 'code') {
        super('📌 '+label, icon, ''); 
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