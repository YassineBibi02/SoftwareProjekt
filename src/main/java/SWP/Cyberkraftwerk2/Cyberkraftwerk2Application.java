package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

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


	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}

}
