package ma.khairy.RAG.controllers;

import ma.khairy.RAG.services.ChatAiService;
import ma.khairy.RAG.services.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/chat-ai")
public class ChatAiController {
    private ChatAiService chatAiService;
    private FileUploadService fileUploadService;


    public ChatAiController(ChatAiService chatAiService, FileUploadService fileUploadService) {
        this.chatAiService = chatAiService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatAiService.chat(question);
    }

    @PostMapping("/process-file")
    public ResponseEntity<String> handleFileUpload(@RequestPart("file") MultipartFile file) {
        try {
            String result = fileUploadService.processFile(file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
