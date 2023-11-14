package SWP.Cyberkraftwerk2.Security;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


/**
 * This class does
 *
 * @author Yassine Bibi
 */
@Service
public class UserPrincipalDetailService implements UserDetailsService {

    /**
     * Data repository
     */
    private UserRepository userRepository;

    /**
     * Injection of Data repository through Constructor
     *
     * @param userRepository The Data repository
     */
    public UserPrincipalDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Function to Return the user details
     * @param username The User's Username
     * @return User details
     * @throws UsernameNotFoundException There was no matching username Error
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsername(username);
        UserPrincipal userPrincipal = new UserPrincipal(user);


        return userPrincipal;
    }
}
