package com.example.Fitness.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Service
public class GoogleAuthService {

    private static final String GOOGLE_USERINFO_URL =
            "https://www.googleapis.com/oauth2/v3/userinfo";

    /**
     * Xác minh access_token bằng cách gọi Google UserInfo API.
     * Trả về Map chứa các trường: email, name, picture, sub, ...
     */
    public Map<String, Object> verifyGoogleAccessToken(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GOOGLE_USERINFO_URL,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> userInfo = response.getBody();
            if (userInfo == null || userInfo.get("email") == null) {
                throw new IllegalArgumentException("Không lấy được thông tin từ Google.");
            }
            return userInfo;
        } catch (Exception e) {
            throw new IllegalArgumentException("Access token Google không hợp lệ: " + e.getMessage(), e);
        }
    }
}
