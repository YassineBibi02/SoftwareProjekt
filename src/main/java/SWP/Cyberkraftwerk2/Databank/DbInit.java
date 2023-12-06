package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Module.UserService;
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
    private AchievementRepository achievementRepository;
    private UserService userService;


    /**
     * Injection through constructor of the Data repository and the password Encoder
     *
     * @param userRepository        The Data Repository
     * @param achievementRepository Achievement Repository
     * @param userService
     */
    public DbInit(UserRepository userRepository, AchievementRepository achievementRepository, UserService userService) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userService = userService;
    }

    /**
     * This functions Maintains the users Databank - by removing old entries and adding new. WIP
     * @param args Arguments
     * @throws Exception Errors
     */
    @Override
    public void run(String... args) throws Exception {

//        Optional<User> userOptional = Optional.ofNullable(this.userRepository.findByid(8));
//        if(userOptional.isPresent()) {
//            User user = userOptional.get();
//            Achievement achievement = achievementRepository.findByid(1);
//            achievement.addUser(user);
//            achievementRepository.save(achievement);
//
//        } else {
//            // Handle the case where the user is not found
//            System.out.println("User not found with ID: " + "Yassine");
//        }

//        Achievement FirstStarted = new Achievement("FirstStarted", "You joined the Service" );
//        this.achievementRepository.save(FirstStarted);

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
