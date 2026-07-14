package com.example.Fitness.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folderName) throws IOException {
        return uploadFile(file, folderName, "image");
    }

    public String uploadVideo(MultipartFile file, String folderName) throws IOException {
        return uploadFile(file, folderName, "video");
    }

    private String uploadFile(MultipartFile file, String folderName, String resourceType) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        String publicId = UUID.randomUUID().toString();

        Map params = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", folderName,
                "resource_type", resourceType // Quan trọng: "image" hoặc "video"
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

        return uploadResult.get("url").toString();
    }

    public void deleteFile(String publicId) throws IOException {
        if (publicId != null && !publicId.isEmpty()) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    public String getPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        Pattern pattern = Pattern.compile("upload/(?:v\\d+/)?([^.]+)\\.");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
}
