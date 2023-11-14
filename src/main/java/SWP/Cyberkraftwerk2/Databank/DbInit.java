package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class DbInit implements CommandLineRunner {


    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public DbInit(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
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
    }
}
