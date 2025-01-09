import { Button, TextField, Upload } from "@vaadin/react-components";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Subscription } from "@vaadin/hilla-frontend";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const subscriptionRef = useRef<Subscription<string> | null>(null);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.cancel();
        };
    }, []);

    const handleFileUpload = (event: CustomEvent) => {
        const uploadedFile = event.detail.file;
        setFile(uploadedFile);
    };
    const handleFileReject = (event: CustomEvent) => {
        console.log("Fichier rejeté :", event.detail.file);
        setResponse("Erreur : Le fichier a été rejeté. Assurez-vous qu'il s'agit d'un PDF valide.");
    };

    const handleUploadSuccess = (event: CustomEvent) => {
        const uploadedFile = event.detail.file;
        setFile(uploadedFile);
        setResponse("Fichier téléversé avec succès : " + uploadedFile.name);
    };

    const handleUploadError = (event: CustomEvent) => {
        console.error("Erreur lors du téléversement :", event.detail.error);
        setResponse("Erreur : Impossible de téléverser le fichier.");
    };

    async function processFile() {
        if (!file) {
            setResponse("Erreur : Aucun fichier sélectionné.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await fetch("/chat-ai/process-file", {
                method: "POST",
                body: formData,
            });

            if (!result.ok) {
                throw new Error("Erreur lors du traitement du fichier.");
            }

            const responseText = await result.text();
            setResponse(responseText);
        } catch (error) {
            setResponse("Erreur : Impossible de traiter le fichier.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-m">
            <h1>Téléverser un fichier PDF</h1>

            <div className="mb-m">
                <Upload
                    accept=".pdf"
                    maxFiles={1}
                    onFileReject={handleFileReject}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                />
                {file && <p>Fichier sélectionné : {file.name}</p>}
            </div>

            <Button theme="primary" onClick={processFile} disabled={isLoading}>
                Traiter le fichier
            </Button>

            <div className="mt-m">
                <h2>Réponse :</h2>
                <div className="response-box">
                    <Markdown>{response}</Markdown>
                </div>
            </div>

            {isLoading && <p>Chargement en cours...</p>}
        </div>
    );
}