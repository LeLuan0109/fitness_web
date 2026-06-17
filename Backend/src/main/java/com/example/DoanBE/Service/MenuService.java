package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.request.MealDishRequestDTO;
import com.example.DoanBE.DTO.request.MealRequest;
import com.example.DoanBE.DTO.request.MenuRequest;
import com.example.DoanBE.DTO.response.Nutrition.MenuListResponse;
import com.example.DoanBE.DTO.response.Nutrition.MenuResponse;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Mapper.MenuMapper;
import com.example.DoanBE.Model.Nutrition.*;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.RNutrition.DishRepository;
import com.example.DoanBE.Repository.RNutrition.MenuRepository;
import com.example.DoanBE.Repository.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;
    private final MenuMapper menuMapper;

    // Helper lấy ID người dùng an toàn (trả về null nếu chưa login)
    private Long getSafeCurrentUserId() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if ("anonymousUser".equals(username)) return null;
            return userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    public Page<MenuListResponse> getPublicMenus(String search, FitnessGoal goal,
                                                 Float minCal, Float maxCal,
                                                 Float minPro, Float maxPro,
                                                 Float minCarb, Float maxCarb,
                                                 Float minFat, Float maxFat,
                                                 Pageable pageable) {
        Long currentUserId = getSafeCurrentUserId();
        Specification<Menu> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("isDeleted"), false));
            predicates.add(cb.equal(root.get("isDefault"), true));

            addCommonFilters(predicates, cb, root, search, goal,
                    minCal, maxCal, minPro, maxPro,
                    minCarb, maxCarb, minFat, maxFat);

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return menuRepository.findAll(spec, pageable)
                .map(menuMapper::toMenuListResponse);
    }

    public Page<MenuListResponse> getMyMenus(
            String search, FitnessGoal goal,
            Float minCal, Float maxCal,
            Float minPro, Float maxPro,
            Float minCarb, Float maxCarb,
            Float minFat, Float maxFat,
            Pageable pageable) throws DataNotFoundException {

        User currentUser = getCurrentUser();

        Specification<Menu> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("user"), currentUser));
            predicates.add(cb.equal(root.get("isDeleted"), false));
            predicates.add(cb.equal(root.get("isDefault"), false));

            addCommonFilters(predicates, cb, root, search, goal,
                    minCal, maxCal, minPro, maxPro,
                    minCarb, maxCarb, minFat, maxFat);

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return menuRepository.findAll(spec, pageable)
                .map(menuMapper::toMenuListResponse);
    }

    public MenuResponse getMenuDetail(Long id) throws DataNotFoundException {
        Menu menu = getMenuAndValidateAccess(id, "READ");
        return menuMapper.toMenuResponse(menu);
    }

    public MenuResponse createMenu(MenuRequest request, MultipartFile imageFile) throws IOException, DataNotFoundException {
        User user = getCurrentUser();
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = fileUploadService.uploadImage(imageFile, "menus");
        }
        return createMenuInDatabase(user, request, imageUrl);
    }

    @Transactional
    protected MenuResponse createMenuInDatabase(User user, MenuRequest request, String imageUrl) throws DataNotFoundException {
        Menu menu = new Menu();
        menuMapper.updateMenuFromRequest(menu, request);
        boolean isAdmin = user.getRole().getName().equalsIgnoreCase("ADMIN");
        menu.setIsDefault(isAdmin);
        menu.setIsDeleted(false);
        menu.setUser(user);
        menu.setFitnessGoal(request.getFitnessGoal());
        if (!isAdmin) {
            menu.setDisplayOrder(generateNextDisplayOrder(user.getId()));
        }
        if (imageUrl != null) {
            menu.setImage(imageUrl);
        }
        processMealsOptimized(menu, request.getMeals());

        Menu savedMenu = menuRepository.save(menu);
        return menuMapper.toMenuResponse(savedMenu);
    }

    public MenuResponse updateMenu(Long id, MenuRequest request, MultipartFile imageFile) throws IOException, DataNotFoundException {
        getMenuAndValidateAccess(id, "WRITE");
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = fileUploadService.uploadImage(imageFile, "menus");
        }
        return updateMenuInDatabase(id, request, imageUrl);
    }

    @Transactional
    protected MenuResponse updateMenuInDatabase(Long id, MenuRequest request, String imageUrl) throws DataNotFoundException {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy menu"));
        User user = getCurrentUser();
        menuMapper.updateMenuFromRequest(menu, request);

        boolean isAdmin = user.getRole().getName().equalsIgnoreCase("ADMIN");
        menu.setIsDefault(isAdmin);

        if (imageUrl != null) {
            menu.setImage(imageUrl);
        }

        if (request.getMeals() != null) {
            processMealsOptimized(menu, request.getMeals());
        }

        Menu savedMenu = menuRepository.save(menu);
        return menuMapper.toMenuResponse(savedMenu);
    }

    @Transactional
    public MenuResponse cloneMenu(Long originalId) throws DataNotFoundException {
        User currentUser = getCurrentUser();

        Menu originalMenu = menuRepository.findByIdAndIsDeletedFalse(originalId)
                .orElseThrow(() -> new DataNotFoundException("Menu gốc không tồn tại hoặc đã bị xóa!"));


        Menu newMenu = new Menu();
        newMenu.setName(originalMenu.getName()+ " (Copy)");
        newMenu.setDescription(originalMenu.getDescription());
        newMenu.setFitnessGoal(originalMenu.getFitnessGoal());
        newMenu.setImage(originalMenu.getImage());
        newMenu.setCaloriesTarget(originalMenu.getCaloriesTarget());
        newMenu.setIsDefault(false);
        newMenu.setIsDeleted(false);
        newMenu.setUser(currentUser);
        newMenu.setDisplayOrder(generateNextDisplayOrder(currentUser.getId()));

        copyMealsData(originalMenu, newMenu);

        Menu savedMenu = menuRepository.save(newMenu);
        return menuMapper.toMenuResponse(savedMenu);
    }

    @Transactional
    public void deleteMenu(Long id) throws DataNotFoundException {
        Menu menu = getMenuAndValidateAccess(id, "WRITE");
        menu.setIsDeleted(true);
        menuRepository.save(menu);
    }

    private User getCurrentUser() throws DataNotFoundException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thông tin người dùng!"));
    }

    private Menu getMenuAndValidateAccess(Long menuId, String actionType) throws DataNotFoundException {
        Menu menu = menuRepository.findByIdAndIsDeletedFalse(menuId)
                .orElseThrow(() -> new DataNotFoundException("Menu không tồn tại hoặc đã bị xóa!"));

        if (Boolean.TRUE.equals(menu.getIsDeleted())) {
            throw new DataNotFoundException("Menu không tồn tại hoặc đã bị xóa!");
        }

        Long currentUserId = getSafeCurrentUserId();

        boolean isOwner = currentUserId != null && menu.getUser().getId().equals(currentUserId);

        if (actionType.equals("READ")) {
            if (Boolean.TRUE.equals(menu.getIsDefault()) || isOwner) {
                return menu;
            }
            throw new RuntimeException("Bạn không có quyền xem menu này!");
        }
        else if (actionType.equals("WRITE")) {
            if (isOwner) {
                return menu;
            }
            throw new RuntimeException("Bạn không có quyền chỉnh sửa menu này!");
        }

        return menu;
    }

    private void processMealsOptimized(Menu menu, List<MealRequest> mealRequests) throws DataNotFoundException {
        if (mealRequests == null || mealRequests.isEmpty()) {
            if (menu.getMeals() != null) {
                menu.getMeals().clear();
            }
            menu.setCalories(0f); menu.setProtein(0f); menu.setCarbs(0f); menu.setFat(0f);
            return;
        }

        Set<Long> allDishIds = mealRequests.stream()
                .filter(m -> m.getDishes() != null) // Chỉ lấy meal có dish
                .flatMap(m -> m.getDishes().stream())
                .map(MealDishRequestDTO::getDishId)
                .collect(Collectors.toSet());

        Map<Long, Dish> dishMap;
        if (!allDishIds.isEmpty()) {
            List<Dish> dishes = dishRepository.findAllById(allDishIds);
            if (dishes.size() < allDishIds.size()) {
                throw new DataNotFoundException("Một số món ăn không tồn tại hoặc đã bị xóa!");
            }

            dishMap = dishes.stream().collect(Collectors.toMap(Dish::getId, d -> d));
        } else {
            dishMap = new HashMap<>();
        }

        Set<Meal> meals = menu.getMeals();
        if (meals == null) {
            meals = new HashSet<>();
            menu.setMeals(meals);
        } else {
            meals.clear();
        }

        float mCal = 0f, mPro = 0f, mCarb = 0f, mFat = 0f;

        for (MealRequest mReq : mealRequests) {
            Meal meal = new Meal();
            meal.setName(mReq.getName());
            meal.setMealType(mReq.getMealType());
            meal.setMenu(menu);

            Set<MealDish> mealDishes = new HashSet<>();
            float[] mealNutrition = {0f, 0f, 0f, 0f}; // [Cal, Pro, Carb, Fat]

            if (mReq.getDishes() != null) {
                for (MealDishRequestDTO dReq : mReq.getDishes()) {
                    Dish dish = dishMap.get(dReq.getDishId());
                    if (dish == null) continue;

                    int qty = (dReq.getQuantity() != null && dReq.getQuantity() > 0) ? dReq.getQuantity() : 1;

                    MealDish md = new MealDish();
                    md.setDish(dish);
                    md.setQuantity(qty);
                    md.setMeal(meal);

                    float cal = (dish.getCalories() != null ? dish.getCalories() : 0);
                    float pro = (dish.getProtein() != null ? dish.getProtein() : 0);
                    float carb = (dish.getCarbs() != null ? dish.getCarbs() : 0);
                    float fat = (dish.getFat() != null ? dish.getFat() : 0);

                    md.setTotalCalories(cal * qty);
                    mealDishes.add(md);

                    mealNutrition[0] += cal * qty;
                    mealNutrition[1] += pro * qty;
                    mealNutrition[2] += carb * qty;
                    mealNutrition[3] += fat * qty;
                }
            }

            // Set thông tin cho Meal
            meal.setCalories(mealNutrition[0]);
            meal.setProtein(mealNutrition[1]);
            meal.setCarbs(mealNutrition[2]);
            meal.setFat(mealNutrition[3]);
            meal.setMealDishes(mealDishes);

            meals.add(meal);

            // Cộng dồn cho Menu
            mCal += mealNutrition[0];
            mPro += mealNutrition[1];
            mCarb += mealNutrition[2];
            mFat += mealNutrition[3];
        }

        menu.setCalories(mCal);
        menu.setProtein(mPro);
        menu.setCarbs(mCarb);
        menu.setFat(mFat);
        if (menu.getCaloriesTarget() == null || menu.getCaloriesTarget() == 0) {
            // Làm tròn số thực tế để gán vào Target (VD: 1480.5 -> 1481)
            menu.setCaloriesTarget((float) mCal);
        }
    }

    private Integer generateNextDisplayOrder(Long userId) {
        Integer maxOrder = menuRepository.findMaxDisplayOrder(userId);
        return (maxOrder == null) ? 1 : maxOrder + 1;
    }

    private void copyMealsData(Menu originalMenu, Menu newMenu) {
        if (originalMenu.getMeals() == null) return;
        Set<Meal> newMeals = new HashSet<>();

        for (Meal oldMeal : originalMenu.getMeals()) {
            Meal newMeal = new Meal();
            newMeal.setName(oldMeal.getName());
            newMeal.setMealType(oldMeal.getMealType());
            newMeal.setCalories(oldMeal.getCalories());
            newMeal.setProtein(oldMeal.getProtein());
            newMeal.setCarbs(oldMeal.getCarbs());
            newMeal.setFat(oldMeal.getFat());
            newMeal.setMenu(newMenu);

            Set<MealDish> newMealDishes = new HashSet<>();
            if (oldMeal.getMealDishes() != null) {
                for (MealDish oldMd : oldMeal.getMealDishes()) {
                    MealDish newMd = new MealDish();
                    newMd.setDish(oldMd.getDish());
                    newMd.setQuantity(oldMd.getQuantity());
                    newMd.setTotalCalories(oldMd.getTotalCalories());
                    newMd.setMeal(newMeal);
                    newMealDishes.add(newMd);
                }
            }
            newMeal.setMealDishes(newMealDishes);
            newMeals.add(newMeal);
        }
        newMenu.setMeals(newMeals);
        newMenu.setCalories(originalMenu.getCalories());
        newMenu.setProtein(originalMenu.getProtein());
        newMenu.setCarbs(originalMenu.getCarbs());
        newMenu.setFat(originalMenu.getFat());
    }

    private void addCommonFilters(
            List<Predicate> predicates, CriteriaBuilder cb, Root<Menu> root,
            String search, FitnessGoal goal,
            Float minCal, Float maxCal,
            Float minPro, Float maxPro,
            Float minCarb, Float maxCarb,
            Float minFat, Float maxFat
    ) {
        // 1. Tìm theo tên
        if (search != null && !search.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
        }

        // 2. Mục tiêu (Tăng cơ, giảm cân...)
        if (goal != null) {
            predicates.add(cb.equal(root.get("fitnessGoal"), goal));
        }

        // 3. Bộ lọc dinh dưỡng (Range)
        if (minCal != null) predicates.add(cb.greaterThanOrEqualTo(root.get("calories"), minCal));
        if (maxCal != null) predicates.add(cb.lessThanOrEqualTo(root.get("calories"), maxCal));

        if (minPro != null) predicates.add(cb.greaterThanOrEqualTo(root.get("protein"), minPro));
        if (maxPro != null) predicates.add(cb.lessThanOrEqualTo(root.get("protein"), maxPro));

        if (minCarb != null) predicates.add(cb.greaterThanOrEqualTo(root.get("carbs"), minCarb));
        if (maxCarb != null) predicates.add(cb.lessThanOrEqualTo(root.get("carbs"), maxCarb));

        if (minFat != null) predicates.add(cb.greaterThanOrEqualTo(root.get("fat"), minFat));
        if (maxFat != null) predicates.add(cb.lessThanOrEqualTo(root.get("fat"), maxFat));
    }
}