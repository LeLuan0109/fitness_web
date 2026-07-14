package com.example.Fitness.Service;

import com.example.Fitness.Constants.AuthProvider;
import com.example.Fitness.DTO.request.ChangePasswordRequest;
import com.example.Fitness.DTO.request.OnboardingRequest;
import com.example.Fitness.DTO.request.UpdateProfileRequest;
import com.example.Fitness.DTO.response.common.ChartDataResponseByDate;
import com.example.Fitness.DTO.response.user.ProfileResponse;
import com.example.Fitness.DTO.response.user.UserResponse;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Mapper.UserMapper;
import com.example.Fitness.Model.Role;
import com.example.Fitness.Model.User;
import com.example.Fitness.Model.WorkoutLogs;
import com.example.Fitness.Repository.RoleRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public Page<UserResponse> getAllUsers(String keyword, Pageable pageable) {
        Page<User> usersPage;

        if (keyword != null && !keyword.isEmpty()) {
            usersPage = userRepository.searchUsers(keyword, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        return usersPage.map(userMapper::userToUserResponse);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public UserResponse updateOnboardingInfo(@NotNull OnboardingRequest request) throws  DataNotFoundException{
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng: " + username));

        user.setSex(request.getSex());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setWeight(request.getWeight());
        user.setHeight(request.getHeight());
        user.setFitnessGoal(request.getFitnessGoal());
        user.setActivityLevel(request.getActivityLevel());

        User updatedUser = userRepository.save(user);
        return userMapper.userToUserResponse(updatedUser);
    }

    public User findOrCreateUserByEmail(String email, String name, String avatar, AuthProvider provider) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()) {
            return userOptional.get();
        }
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role mặc định (USER)"));
        User newUser =
                User.builder().username(email).email(email).name(name).avatar(avatar).password(null)
                        .role(userRole)
                        .provider(provider).build();

        return userRepository.save(newUser);
    }

    public User getUserByUsername(String username) throws DataNotFoundException{
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng: " + username));
    }

    public ProfileResponse getMyProfile() throws DataNotFoundException {
        //Lấy user hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("Không tìm " +
                "thấy người dùng với username: "+ username));
        Long userId = user.getId();

        // 2. Tính toán Stats (All Time)
        Double totalCaloriesAllTime = workoutLogRepository.sumTotalCaloriesByUserId(userId);
        Integer totalDurationSecAllTime = workoutLogRepository.sumTotalDurationByUserId(userId);
        Integer totalWorkoutsAllTime = workoutLogRepository.countTotalWorkoutsByUserId(userId);

        System.out.println(totalCaloriesAllTime);
        System.out.println(totalDurationSecAllTime);
        System.out.println(totalWorkoutsAllTime);

        double totalHoursAllTime = totalDurationSecAllTime != null ? totalDurationSecAllTime / 3600.0 : 0.0;

        // 3. Tính toán Monthly Stats (Tháng hiện tại)
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = YearMonth.now().atEndOfMonth().atTime(23, 59, 59);

        List<WorkoutLogs> monthlyLogs = workoutLogRepository.findLogsByUserIdAndDateRange(userId, startOfMonth, endOfMonth);

        // Xử lý logic Monthly
        double monthlyCalories = monthlyLogs.stream().mapToDouble(l -> l.getCaloriesBurned() != null ? l.getCaloriesBurned() : 0).sum();
        int monthlyDurationSec = monthlyLogs.stream().mapToInt(l -> l.getActualDuration() != null ? l.getActualDuration() : 0).sum();

        // Active days: Số ngày duy nhất có log tập
        long activeDays = monthlyLogs.stream()
                .map(log -> log.getCreatedAt().toLocalDate())
                .distinct()
                .count();

        double monthlyDurationMin = monthlyDurationSec / 60.0;
        double avgDurationMin = activeDays > 0 ? monthlyDurationMin / activeDays : 0;

        // Tạo data cho biểu đồ (Group log theo ngày)
        Map<LocalDate, Double> caloriesByDate = monthlyLogs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getCreatedAt().toLocalDate(),
                        Collectors.summingDouble(log -> log.getCaloriesBurned() != null ? log.getCaloriesBurned() : 0)
                ));

        List<ChartDataResponseByDate> chartData = new ArrayList<>();
        caloriesByDate.forEach((date, cal) -> {
            chartData.add(ChartDataResponseByDate.builder()
                    .date(date)
                    .value1(cal)
                    .build());
        });

        ProfileResponse.MonthlyStats monthlyStats = ProfileResponse.MonthlyStats.builder()
                .monthName(YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM yyyy")))
                .totalWorkouts((int) activeDays)
                .activeDays((int) activeDays)
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .totalDurationMin(Math.round(monthlyDurationMin * 10.0) / 10.0)
                .avgDurationMin(Math.round(avgDurationMin * 10.0) / 10.0)
                .totalCalories(Math.round(monthlyCalories * 10.0) / 10.0)
                .chartData(chartData)
                .build();

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .dateOfBirth(user.getDateOfBirth())
                .weight(user.getWeight())
                .height(user.getHeight())
                .memberSince(user.getCreatedAt())
                .fitnessGoal(user.getFitnessGoal())
                .activityLevel(user.getActivityLevel())
                // Stats All Time
                .totalWorkouts(totalWorkoutsAllTime != null ? totalWorkoutsAllTime : 0)
                .totalHours(Math.round(totalHoursAllTime * 10.0) / 10.0) // Làm tròn 1 số thập phân
                .totalCalories(totalCaloriesAllTime != null ? totalCaloriesAllTime : 0)
                // Stats Monthly
                .monthlyStats(monthlyStats)
                .build();
    }

    public User updateUserProfile(String username, UpdateProfileRequest request) throws DataNotFoundException{
        User user = getUserByUsername(username);

        if(request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            user.setAvatar(request.getAvatar());
        }
        if(request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setActivityLevel(request.getActivityLevel());
        user.setFitnessGoal(request.getFitnessGoal());
        user.setDateOfBirth(request.getDateOfBirth());

        return userRepository.save(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp!");
        }

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void updateUserStatus(Long userId, boolean isLocked) throws DataNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Người dùng không tồn tại!"));

        if (isLocked && "ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new RuntimeException("Không thể khóa tài khoản Quản trị viên (ADMIN)!");
        }
        user.setLocked(isLocked);
        userRepository.save(user);
    }
}
