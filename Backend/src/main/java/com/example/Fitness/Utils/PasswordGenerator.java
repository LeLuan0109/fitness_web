package com.example.Fitness.Utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PasswordGenerator {
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String SPECIAL_CHARS = "!@#$%^&*()_+-=[]?";

    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER + SPECIAL_CHARS;
    private static final SecureRandom random = new SecureRandom();

    public String generateRandomPassword(int length) {
        if (length < 8) {
            throw new IllegalArgumentException("Độ dài mật khẩu phải ít nhất là 8 ký tự");
        }

        StringBuilder sb = new StringBuilder(length);

        // 1. Đảm bảo có ít nhất 1 ký tự cho mỗi loại
        sb.append(CHAR_LOWER.charAt(random.nextInt(CHAR_LOWER.length())));
        sb.append(CHAR_UPPER.charAt(random.nextInt(CHAR_UPPER.length())));
        sb.append(NUMBER.charAt(random.nextInt(NUMBER.length())));
        sb.append(SPECIAL_CHARS.charAt(random.nextInt(SPECIAL_CHARS.length())));

        // 2. Điền nốt các ký tự còn thiếu ngẫu nhiên từ tất cả các nhóm
        for (int i = 4; i < length; i++) {
            sb.append(PASSWORD_ALLOW_BASE.charAt(random.nextInt(PASSWORD_ALLOW_BASE.length())));
        }

        // 3. Trộn ngẫu nhiên chuỗi để các ký tự bắt buộc không nằm cố định ở đầu
        List<Character> charList = sb.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());
        Collections.shuffle(charList);

        return charList.stream()
                .map(String::valueOf)
                .collect(Collectors.joining());
    }
}
