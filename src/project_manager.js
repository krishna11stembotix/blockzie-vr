/**
 * project_manager.js
 * Handles saving and loading of Blockly projects.
 * Supports exporting to .sb3 format (zip containing project.json/xml).
 */

(function () {
    /**
     * Saves the current Blockly workspace as an .sb3 file.
     * The .sb3 file is a ZIP archive containing a 'project.json' file with the XML representation of the workspace.
     */
    window.saveProject = function () {
        if (!Blockly || !Blockly.getMainWorkspace()) {
            console.error("Blockly workspace not found.");
            return;
        }

        const workspace = Blockly.getMainWorkspace();
        let xmlDom;
        if (Blockly.Xml && Blockly.Xml.workspaceToDom) {
            xmlDom = Blockly.Xml.workspaceToDom(workspace);
        } else {
            // Fallback for newer versions or different bundles
            xmlDom = Blockly.Xml.workspaceToDom(workspace);
        }

        // Ensure we have the xml utils
        const xmlUtils = Blockly.utils ? Blockly.utils.xml : Blockly.Xml;

        const xmlText = xmlUtils.domToPrettyText(xmlDom);

        // Create a ZIP file
        const zip = new JSZip();

        // Add the XML as 'project.xml' (or json if we were doing true scratch)
        // For simplicity and to ensure we can load it back easily in this specific app, 
        // we'll stick to XML but wrap it in the zip. 
        // We can also add a meta.json if needed later.
        zip.file("project.xml", xmlText);

        // Generate the zip and trigger download
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                downloadBlob(content, "project.sb3");
            })
            .catch(function (err) {
                console.error("Failed to generate project file:", err);
            });
    };

    /**
     * Helper to trigger a download of a Blob.
     * @param {Blob} blob 
     * @param {string} filename 
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Loads a project from an .sb3 file (zip containing project.xml)
     * @param {HTMLInputElement} inputElement 
     */
    window.loadProject = function (inputElement) {
        if (!inputElement.files || inputElement.files.length === 0) {
            return;
        }

        const file = inputElement.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            JSZip.loadAsync(arrayBuffer)
                .then(function (zip) {
                    // Try to find project.xml
                    if (zip.file("project.xml")) {
                        return zip.file("project.xml").async("string");
                    } else if (zip.file("project.json")) {
                        // Fallback if we accidentally saved as json or for future compat
                        return zip.file("project.json").async("string");
                    } else {
                        throw new Error("No project.xml found in the .sb3 file.");
                    }
                })
                .then(function (xmlText) {
                    if (!Blockly || !Blockly.getMainWorkspace()) {
                        console.error("Blockly workspace not found.");
                        return;
                    }
                    const workspace = Blockly.getMainWorkspace();

                    // Clear existing workspace
                    workspace.clear();

                    // Load new XML
                    const xmlDom = Blockly.utils.xml.textToDom(xmlText);
                    Blockly.Xml.domToWorkspace(xmlDom, workspace);

                    console.log("Project loaded successfully.");
                    alert("Project loaded successfully!");
                })
                .catch(function (err) {
                    console.error("Failed to load project:", err);
                    alert("Error loading project: " + err.message);
                });
        };

        reader.readAsArrayBuffer(file);

        // Reset input value so the same file can be selected again if needed
        inputElement.value = "";
    };

    /**
     * Clears the current workspace to start a new project.
     */
    window.newProject = function () {
        if (confirm("Are you sure you want to start a new project? Unsaved changes will be lost.")) {
            if (Blockly && Blockly.getMainWorkspace()) {
                Blockly.getMainWorkspace().clear();
            }
        }
    };

})();
