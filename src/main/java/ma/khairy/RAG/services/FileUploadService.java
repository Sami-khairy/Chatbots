package ma.khairy.RAG.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
@Service
public class FileUploadService {
    private VectorStore vectorStore;
    private static final String UPLOAD_DIR = "src/main/resources/uploads/";


    public FileUploadService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public String processFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Erreur : Aucun fichier sélectionné.");
            }

            InputStream inputStream = file.getInputStream();
            Resource pdfResource = new InputStreamResource(inputStream);

            processPdfFile(pdfResource);

            return "Fichier traité avec succès : " + file.getOriginalFilename();
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier PDF.", e);
        } catch (IllegalArgumentException e) {
            throw e;
        }
    }

    private void processPdfFile(Resource pdfResource) throws IOException {
        PagePdfDocumentReader pdfDocumentReader = new PagePdfDocumentReader(pdfResource);
        List<Document> documents = pdfDocumentReader.get();

        if (documents.isEmpty()) {
            throw new IllegalArgumentException("Le fichier PDF ne contient aucun document valide.");
        }

        TextSplitter textSplitter = new TokenTextSplitter();
        List<Document> chunks = textSplitter.split(documents);

        if (chunks.isEmpty()) {
            throw new IllegalArgumentException("Le fichier PDF ne contient aucun texte valide après découpage.");
        }

        vectorStore.add(chunks);
    }
}
