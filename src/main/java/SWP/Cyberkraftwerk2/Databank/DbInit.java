package SWP.Cyberkraftwerk2.Databank;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * This Class runs to initliaze the Databank settings - Will be removed later.
 *
 * @author Yassine Bibi
 */
@Service
//public class DbInit implements CommandLineRunner {
public class DbInit {


    /**
     * Data repository
     */
    private UserRepository userRepository;
    /**
     * Password Encoder
     */
    private PasswordEncoder passwordEncoder;

    /**
     * Injection through constructor of the Data repository and the password Encoder
     *
     * @param userRepository  The Data Repository
     * @param passwordEncoder Password Encoder
     */
    public DbInit(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * This functions Maintains the users Databank - by removing old entries and adding new. WIP
     * @param args Arguments
     * @throws Exception Errors
     */
    /*@Override
    public void run(String... args) throws Exception {
        //Delete Users from before
        this.userRepository.deleteAll();

        //Create Users
        User ADMIN   = new User("ADMIN",passwordEncoder.encode("ADMIN"),"ADMIN","ADMIN_ROLE");
        User USER = new User("USER",passwordEncoder.encode("123"),"USER","");
        User SUPERUSER = new User("SUPERUSER",passwordEncoder.encode("s123"),"SUPERUSER","SUPERUSER_ROLE");

        List<User> userList = Arrays.asList(ADMIN,USER,SUPERUSER);

        //save to Db
        this.userRepository.saveAll(userList);
    }*/
}
