package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 *
 */
@SpringBootApplication
@RestController
public class Cyberkraftwerk2Application {

	private UserRepository userRepository;

	public Cyberkraftwerk2Application(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/")
	@CrossOrigin(origins = "http://localhost:3000")
	public String welcomeText (){
		return "This should be start page dunno";
	}

	@GetMapping("/test1234")
	@CrossOrigin(origins = "http://localhost:3000")
	public String welcomeText2 (){
		return "This is the Server";
	}

	@Secured("ROLE_ADMIN")
	@GetMapping("/Admin")
	public String welcomeText3 (){
		return "Admin Space";
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/Users")
	public List<User> users (){
		return this.userRepository.findAll();
	}





	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}



}
