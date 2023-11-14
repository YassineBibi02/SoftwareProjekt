package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DbInit implements CommandLineRunner {


    private UserRepository userRepository;

    public DbInit(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        //Create Users
        User ADMIN   = new User("ADMIN","ADMIN","ADMIN","ADMIN_PAGE");
        User USER = new User("USER","123","USER","");
        User SUPERUSER = new User("SUPERUSER","s123","SUPERUSER","");

        List<User> userList = Arrays.asList(ADMIN,USER,SUPERUSER);

        //save to Db
        this.userRepository.saveAll(userList);
    }
}
