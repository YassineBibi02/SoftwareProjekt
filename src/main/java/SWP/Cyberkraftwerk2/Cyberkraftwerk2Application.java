package SWP.Cyberkraftwerk2;

import SWP.Cyberkraftwerk2.Models.User;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//@SpringBootApplication( exclude = {SecurityAutoConfiguration.class})
@SpringBootApplication
@RestController
public class Cyberkraftwerk2Application {

	private UserRepository userRepository;

	public Cyberkraftwerk2Application(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/")
	public String welcomeText (){
		return "This should be start page dunno";
	}

	@GetMapping("/Welcome")
	public String welcomeText2 (){
		return "Initliazed again";
	}

	@GetMapping("/Admin")
	public String welcomeText3 (){
		return "Admin Space";
	}

	@GetMapping("/Users")
	public List<User> users (){
		return this.userRepository.findAll();
	}








	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}



}
