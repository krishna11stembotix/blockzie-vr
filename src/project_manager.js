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
        // Debug alert
        // alert("Save Project clicked");

        if (typeof JSZip === 'undefined') {
            alert("Error: JSZip library not loaded.");
            console.error("JSZip not found");
            return;
        }

        if (!Blockly || !Blockly.getMainWorkspace()) {
            console.error("Blockly workspace not found.");
            alert("Error: Blockly workspace not found.");
            return;
        }

        try {
            const workspace = Blockly.getMainWorkspace();
            let xmlDom;

            // diverse blockly versions support different xml serialization
            if (Blockly.Xml && typeof Blockly.Xml.workspaceToDom === 'function') {
                xmlDom = Blockly.Xml.workspaceToDom(workspace);
            } else if (Blockly.utils && Blockly.utils.xml && typeof Blockly.utils.xml.workspaceToDom === 'function') {
                // Future proofing, though usually workspaceToDom is on Blockly.Xml
                xmlDom = Blockly.utils.xml.workspaceToDom(workspace);
            } else {
                // Try standard fallback
                xmlDom = Blockly.Xml.workspaceToDom(workspace);
            }

            // Ensure we have the xml utils for text conversion
            // In many versions, domToPrettyText is directly on Blockly.Xml
            let xmlUtils = Blockly.Xml;

            if (!xmlUtils || typeof xmlUtils.domToPrettyText !== 'function') {
                // Try utils.xml as failsafe
                xmlUtils = Blockly.utils && Blockly.utils.xml ? Blockly.utils.xml : null;
            }

            if (!xmlUtils || typeof xmlUtils.domToPrettyText !== 'function') {
                throw new Error("XML serialization utilities (domToPrettyText) not found.");
            }

            const xmlText = xmlUtils.domToPrettyText(xmlDom);

            // Create a ZIP file
            const zip = new JSZip();
            zip.file("project.xml", xmlText);

            // Generate the zip and trigger download
            zip.generateAsync({
                type: "blob",
                mimeType: "application/zip"
            })
                .then(function (content) {
                    downloadBlob(content, "project.sb3");
                })
                .catch(function (err) {
                    console.error("Failed to generate project file:", err);
                    alert("Failed to generate project file: " + err.message);
                });

        } catch (e) {
            console.error("Error in saveProject:", e);
            alert("Error saving project: " + e.message);
        }
    };

    /**
     * Helper to trigger a download of a Blob.
     * @param {Blob} blob 
     * @param {string} filename 
     */
    function downloadBlob(blob, filename) {
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);

            // Debug alert for VR verification
            // alert("Starting download: " + filename); 

            a.click();

            document.body.removeChild(a);
            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 100);
        } catch (e) {
            alert("Error saving file: " + e.message);
            console.error("Download error:", e);
        }
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
