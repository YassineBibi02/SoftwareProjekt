package SWP.Cyberkraftwerk2.Controller;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Lessons.LessonControl;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.file.Path;
import java.nio.file.Paths;
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


    @PostMapping(value="/SendEmail", consumes = "application/json")
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

    /**
     * Method accessible by the Frontend to be able to upload lesson pdfs into the resources directory of the server.
     * @param file File to be uploaded on the server
     * @param redirectAttributes
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UploadLesson")
    public boolean uploadLesson(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        if(file.isEmpty()) {
            System.out.println("[uploadLesson] No file provided. Please try again.");
            return false;
        }

        try {
            Path dest_path = Paths.get("\\frontend\\src\\ressources" + file.getOriginalFilename());
            file.transferTo(dest_path);
            System.out.println("[uploadLesson] Upload successful.");
            return true;
        } catch (Exception e) {
            System.out.println("[uploadLesson] Upload failed.");
            System.out.println(e.getMessage());
            return false;
        }
    }

    /**
     * Method for the Frontend to register a newly uploaded lesson into the lesson registry
     * Ideal Input: "{"name", difficulty_level, {IDs of the quizzes related to the lesson}, {IDs of the achievements related to the lesson}}"
     * @param input String array containing the name (as String), difficulty level (as Integer), an array of the related quiz IDs (as Integer[]) and an array of the related achievement IDs (as Integer[])
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/RegisterLesson")                                         // TODO Auslesen der Argumente aus den Inputs für alle Lesson-Methoden sicherer machen
    public boolean registerLesson(@RequestBody String[] input) {
        String name = input[0];
        int difficulty = Integer.parseInt(input[1]);

        String[] incoming_quids = (input[2].substring(1, input[2].length() - 1)).split(", ");
        int[] quids = new int[incoming_quids.length];
        for(int i = 0; i < incoming_quids.length; i++) {
            quids[i] = Integer.parseInt(incoming_quids[i]);
        }
        String[] incoming_achids = (input[3].substring(1, input[3].length() - 1)).split(", ");
        int[] achids = new int[incoming_achids.length];
        for(int i = 0; i < incoming_achids.length; i++) {
            achids[i] = Integer.parseInt(incoming_achids[i]);
        }
        
        return LessonControl.addLessonEntry(name, difficulty, quids, achids);
    }

    /**
     * Method for the Frontend to delete the registration of a lesson from the registry.
     * @param input String array with the name of the lesson to be deleted
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/RemoveFromRegistry")
    public boolean removeFromRegistry(@RequestBody String[] input) {
        String name = input[0];

        return LessonControl.removeLessonEntry(name);
    }

    /**
     * Method for the Frontend to change the main name of a lesson registration
     * @param input String array containing the old and new name of and for a lesson; {old_name, new_name}
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/RenameInRegistry")
    public boolean renameLessonInRegistry(@RequestBody String[] input) {
        String old_name = input[0];
        String new_name = input[1];

        return LessonControl.updateLessonEntry(old_name, new_name);
    }

    /**
     * Method for the Frontend to update the values of a lesson registration
     * @param input String array containing the name (as String), difficulty level (as Integer), an array of the related quiz IDs (as Integer[]) and an array of the related achievement IDs (as Integer[])
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UpdateInRegistry")
    public boolean updateLessonInRegistry(@RequestBody String[] input) {
        String name = input[0];
        int difficulty = Integer.parseInt(input[1]);

        String[] incoming_quids = (input[2].substring(1, input[2].length() - 1)).split(", ");
        int[] quids = new int[incoming_quids.length];
        for(int i = 0; i < incoming_quids.length; i++) {
            quids[i] = Integer.parseInt(incoming_quids[i]);
        }
        String[] incoming_achids = (input[3].substring(1, input[3].length() - 1)).split(", ");
        int[] achids = new int[incoming_achids.length];
        for(int i = 0; i < incoming_achids.length; i++) {
            achids[i] = Integer.parseInt(incoming_achids[i]);
        }
        
        return LessonControl.updateLessonEntry(name, difficulty, quids, achids);
    }

    /**
     * Method for the Frontend to get a json string representation of the lesson registry.
     * Can be used to access all information about the registered lessons.
     * @return Json-formatted String representation of the lesson registry
     * @author Tristan Slodowski
     */
    @GetMapping("/GetLessonRegistry")
    public String getJsonString() {
        return LessonControl.getJsonString();
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