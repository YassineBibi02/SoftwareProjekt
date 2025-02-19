package SWP.Cyberkraftwerk2.Security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SimpleSavedRequest;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

/**
 * This class is used to configure the Security
 *
 * @Author: Yassine Bibi
 */
@Configuration
public class SecurityConfig {

    /**
     * This function is used to configure the Security
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception
     * @Author: Yassine Bibi
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http    
                .cors().and()
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(antMatcher("/"), antMatcher("/index.html"), antMatcher("/static/**"),
                                antMatcher("/*.ico"), antMatcher("/GetUsers"),  antMatcher("/api/methode/*"),antMatcher("/test1234"), antMatcher("/*.json"), antMatcher("/*.png"),  antMatcher("/api/user")).permitAll()
                        .anyRequest().authenticated()
                )
//                .csrf().disable()
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        // https://stackoverflow.com/a/74521360/65681
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                )
                .addFilterAfter(new CookieCsrfFilter(), BasicAuthenticationFilter.class)
                .addFilterAfter(new SpaWebFilter(), BasicAuthenticationFilter.class)
                .oauth2Login();

        return http.build();
    }


    /**
     * This function is used to configure the CSRF Token upon refresh
     * @return CookieCsrfTokenRepository
     * @Author: Yassine Bibi
     */
    @Bean
    public RequestCache refererRequestCache() {
        return new HttpSessionRequestCache() {
            @Override
            public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
                String referrer = request.getHeader("referer");
                if (referrer == null) {
                    referrer = request.getRequestURL().toString();
                }
                request.getSession().setAttribute("SPRING_SECURITY_SAVED_REQUEST",
                        new SimpleSavedRequest(referrer));

            }
        };
    }
}