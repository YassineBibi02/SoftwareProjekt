package SWP.Cyberkraftwerk2.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;


/**
 * The Security Configurations of the app. Controls each page's visibility , Password Encryption and Login data
 *
 * @author Yassine Bibi
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Data repository
     */
    private UserPrincipalDetailService userPrincipalDetailService;

    /**
     * Injection of the Data repository through constructor function
     *
     * @param userPrincipalDetailService The Data Repository
     */
    public SecurityConfig(UserPrincipalDetailService userPrincipalDetailService) {
        this.userPrincipalDetailService = userPrincipalDetailService;
    }

    /**
     * @return The BCrypt password encryption
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * This functions controls the accessibility of the app's sub systems
     * @param http The Security for Http requests
     * @return A filter chain of who is allowed to access what
     * @throws Exception Dunno
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(antMatcher("/")).permitAll()
                        .requestMatchers(antMatcher("/Welcome")).hasAnyAuthority("ADMIN_ROLE","SUPERUSER_ROLE")
                        .requestMatchers(antMatcher("/Admin")).hasAuthority("ADMIN_ROLE")
                        .requestMatchers(antMatcher("/Users")).hasAuthority("ADMIN_ROLE")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();


    }


    /**
     * This functions Connects the user_list table with the login feature
     * @return The Authentication
     */
    @Bean
    DaoAuthenticationProvider authenticationProvider (){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(this.userPrincipalDetailService);

        return daoAuthenticationProvider;
    }


}
