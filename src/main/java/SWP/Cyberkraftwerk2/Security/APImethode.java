package SWP.Cyberkraftwerk2.Security;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.User;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/methode")
public class APImethode {

    private UserRepository userRepository;

    public APImethode(UserRepository rep) {
        this.userRepository = rep;
    }


    @GetMapping("/GetUsers")
    public String[] getAllUsers (){
        //User test1 = new User("Soenke", "Harder", "soenke_harder@gmx.de", new int[]{1, 2}, 0);
        //User test2 = new User("Aaron", "Sava", "testest@fakemail.de", new int[]{1, 2}, 0);
        List<User> UserList = this.userRepository.findAll();
        String[] result = new String[UserList.size()];
        int i = 0;
        for (User n : UserList) {
            result[i] = (n.toJson());
            i++;
        }
        return result;
    }
    @PostMapping("/SendEmail")
    public String sendEmail(@RequestBody String[] Subject) {
        EmailService mail = new EmailService();
        mail.sendEmail(Subject[0], "Test", "Hello World");
        System.out.println(Arrays.toString(Subject));
        return "Received : " + Arrays.toString(Subject) + "";
    }



    @GetMapping("/test1234")
    public String welcomeText2 (){
        return "This is the Server";
    }

}