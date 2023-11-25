package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

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

	/*
	@GetMapping("/")
	public String welcomeText (){
		return "This should be start page dunno";
	}
	*/
	@GetMapping("/test1234")
	public String welcomeText2 (){
		return "This is the Server";
	}

	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}

	@PostMapping("/SendEmail")
	public String sendEmail(@RequestParam String Subject) {
//		EmailService mail = new EmailService();
//		mail.sendEmail("zwenger.danny@gmail.com", "Test", "Hello World");
		return "Subject is : " + Subject;
	}

}
