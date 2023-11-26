package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

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

}
