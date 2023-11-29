package SWP.Cyberkraftwerk2.Databank;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

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
//        //Delete Users from before
//        this.userRepository.deleteAll();
//
//        //Create Users
//        User USER1 = new User("soenke", "harder", "soenke.harder@stud.uni-hannover.de", new int[]{1, 2, 3}, 1);
//        User USER2 = new User("kevin", "kempa", "kevin.kempa@stud.uni-hannover.de", new int[]{1, 2, 3}, 1);
//        User USER3 = new User("tristan", "slodowski", "tristan.slodowski@stud.uni-hannover.de", new int[]{1, 2, 3}, 1);
//        User USER4 = new User("benjamin", "moser", "benjamin.moser@stud.uni-hannover.de", new int[]{1, 2, 3}, 1);
//        User USER5 = new User("aaron", "UniMail", "aaron.sava@stud.uni-hannover.de", new int[]{1, 2, 3}, 1);
//        User USER6 = new User("aaron", "Hotmail", "aaronsava@hotmail.de", new int[]{1, 2, 3}, 1);
//        User USER7 = new User("danny", "zwenger", "zwenger.danny@gmail.com", new int[]{1, 2, 3}, 1);
//        User USER8 = new User("Yassine", "Bibi", "yassinebibi2002@gmail.com", new int[]{1, 2, 3}, 1);
//
//
//        List<User> userList = Arrays.asList(USER1,USER2,USER3,USER4,USER5,USER6,USER7,USER8);
//
//        //save to Db
//        this.userRepository.saveAll(userList);
    }
}
