package SWP.Cyberkraftwerk2.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(){
        UserDetails Admin = User
                .withUsername("Admin")
                .password(passwordEncoder().encode("Admin"))
                .roles("ADMIN").authorities("ADMIN_PAGE")
                .build();

        UserDetails user = User
                .withUsername("USER")
                .password(passwordEncoder().encode("123"))
                .roles("USER")
                .build();

        UserDetails superUser = User
                .withUsername("super")
                .password(passwordEncoder().encode("S123"))
                .roles("SUPERUSER")
                .build();


        return new InMemoryUserDetailsManager(Admin,user,superUser);
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(antMatcher("/")).permitAll()
                        .requestMatchers(antMatcher("/Welcome")).hasAnyRole("ADMIN","SUPERUSER")
                        .requestMatchers(antMatcher("/Admin")).hasAuthority("ADMIN_PAGE")
                        .requestMatchers(antMatcher("/Users")).hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();


    }



}
