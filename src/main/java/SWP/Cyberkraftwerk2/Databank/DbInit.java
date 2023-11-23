package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * This Class runs to initliaze the Databank settings - Will be removed later.
 *
 * @author Yassine Bibi
 */
@Service
public class DbInit implements CommandLineRunner {
//public class DbInit {


    /**
     * Data repository
     */
    private UserRepository userRepository;


    /**
     * Injection through constructor of the Data repository and the password Encoder
     *
     * @param userRepository  The Data Repository
     */
    public DbInit(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * This functions Maintains the users Databank - by removing old entries and adding new. WIP
     * @param args Arguments
     * @throws Exception Errors
     */
    @Override
    public void run(String... args) throws Exception {
        //Delete Users from before
        this.userRepository.deleteAll();

        //Create Users
        User ADMIN = new User("ADMIN");
        User USER = new User("USER");
        User SUPERUSER = new User("SUPERUSER");

        List<User> userList = Arrays.asList(ADMIN,USER,SUPERUSER);

        //save to Db
        this.userRepository.saveAll(userList);
    }
}
