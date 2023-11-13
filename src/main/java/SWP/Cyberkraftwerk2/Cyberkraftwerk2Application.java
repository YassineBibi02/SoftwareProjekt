package SWP.Cyberkraftwerk2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Cyberkraftwerk2Application {



	@GetMapping("/Welcome")
	public String welcomeText (){
		return "Java Spring Boot Docker initialized";
	}

	@GetMapping("/Welcome2")
	public String welcomeText2 (){
		return "BATATAJava Spring Boot Docker initialized222";
	}




	public static void main(String[] args) {
		SpringApplication.run(Cyberkraftwerk2Application.class, args);
	}

}
