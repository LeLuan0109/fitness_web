package com.example.Fitness.Filters;

import com.example.Fitness.Model.User;
import com.example.Fitness.Service.BlacklistedTokenService;
import com.example.Fitness.Utils.JwtTokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private String apiPrefix;
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtil;
    private final BlacklistedTokenService blacklistedTokenService;

    private final List<String> publicPaths;

    public JwtTokenFilter(
            UserDetailsService userDetailsService,
            JwtTokenUtils jwtTokenUtil,
            BlacklistedTokenService blacklistedTokenService,
            @Value("${api.prefix}") String apiPrefix
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.blacklistedTokenService = blacklistedTokenService;

        this.publicPaths = List.of(
                "/error",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                String.format("/%s/auth/login**", apiPrefix),
                String.format("/%s/auth/google**", apiPrefix),
                String.format("/%s/auth/refresh-token**", apiPrefix),
                String.format("/%s/auth/register**", apiPrefix),
                String.format("/%s/auth/forgot-password**", apiPrefix),
                String.format("/%s/auth/reset-password**", apiPrefix),
//                String.format("/%s/exercises/**", apiPrefix),
                "/oauth2/**"

        );
    }

    // 2. Ghi đè phương thức shouldNotFilter
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        AntPathMatcher pathMatcher = new AntPathMatcher();
        String requestPath = request.getServletPath();
        return publicPaths.stream()
                .anyMatch(path -> pathMatcher.match(path, requestPath));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {

            final String authHeader = request.getHeader("Authorization");
            if(authHeader==null || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            final String token = authHeader.substring(7);
            if(blacklistedTokenService.isTokenExistsInBlacklist(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is blacklisted");
                return;
            }

            final String subject = jwtTokenUtil.extractSubject(token);
            if(subject != null && SecurityContextHolder.getContext().getAuthentication()==null) {

                User userDetails = (User) userDetailsService.loadUserByUsername(subject);
                if(jwtTokenUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
                else {
                    throw new Exception("Your token is expired or your account has been blocked");
                }
            }

            filterChain.doFilter(request, response);
        }
        catch(Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

}