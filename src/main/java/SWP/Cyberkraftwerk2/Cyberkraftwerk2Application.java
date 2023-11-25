package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 *
 */
@CrossOrigin(origins = "http://localhost:3000")
@Configuration
@SpringBootApplication
@RestController
public class Cyberkraftwerk2Application {
	

	private UserRepository userRepository;

	public Cyberkraftwerk2Application(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/test1234")
	public String welcomeText2 (){
		return "This is the Server";
	}

	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}

	@PostMapping("/SendEmail")
	public String sendEmail(@RequestBody String[] Subject) {
		//EmailService mail = new EmailService();
		//mail.sendEmail("soenke_harder@gmx.de", "Test", "Hello World");
		System.out.println(Arrays.toString(Subject));
		return "Subject is : |" + Arrays.toString(Subject) + "|";
	}

	@GetMapping("/GetUsers")
	public String[] getAllUsers (){
		User test1 = new User("Soenke", "Harder", "soenke_harder@gmx.de", new int[]{1, 2}, 0);
		User test2 = new User("Aaron", "Sava", "testest@fakemail.de", new int[]{1, 2}, 0);
		return new String[]{test1.toJson(), test2.toJson()};
	}

	//Mostly for testing
	@GetMapping("/GetUser")
	public String getSingleUsers (){
		User test1 = new User("Aaron", "Sava", "soenke_harder@gmx.de", new int[]{1, 2}, 0);
		//User test2 = new User("Soenke", "Harder", "soenke_harder@gmx.de", new int[]{1, 2}, 0);
		return test1.toJson();
	}
}
