package SWP.Cyberkraftwerk2.Security;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


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


    /**
     * Method accessible by the Frontend to blame a User for falling for a Phishing-Mail
     * Accessible by POSTing to the /BlameUser-Mapping with an Integer-Array consisting of the UID of the User and the MID of the Mail
     * @param ids Integer Array containing the UID and MID of the successful phishing attempt; [UID, MID]
     * @return String of the firstname of the UIDs User
     */
    @PostMapping("/BlameUser")
    public String blameUser(@RequestBody String[] ids) {
        String name = "NOT AVAILABLE";
        int uid = Integer.parseInt(ids[0]);
        int mid = Integer.parseInt(ids[1]);
        ObjectMapper objMapper = new ObjectMapper();

        User.mail_clicked(uid, mid);    // User fuer das Anklicken der Mail anschwaerzen

        User gotcha = this.userRepository.findByID(uid);        // Abrufen des passenden Nutzers aus der Datenbank
        if(gotcha == null) {
            return "[USER NOT FOUND]";
        }
        try{
            Map<String, Object> map = objMapper.readValue(gotcha.toJson(), new TypeReference<Map<String, Object>>(){}); // Informationen des Nutzers zu einer nutzbaren Map umwandeln
            name = (String)map.get("firstname");
        } catch(Exception e) {
            return "ERROR WHILE GETTING NAME FROM DB";
        }

        return name;
    }

    @GetMapping("/test1234")
    public String welcomeText2 (){
        return "This is the Server";
    }


    @PostMapping("/testback")
    public String testback(@RequestBody String subject) {
        System.out.println(subject);
        return "Received : " + subject + "";
    }
}