package SWP.Cyberkraftwerk2.Mail;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

/**
 * Class accessing the JavaMail and JakartaMail packages to send Emails
 * @author Tristan Slodowski
 * @version 13.01.2024
 */
@Configuration
@PropertySource("classpath:/application.properties")
@Service
@RestController
@ComponentScan
public class EmailService {
    
    // default JavaMailSender to manage sending SimpleMailMessages or MimeMessages
    @Autowired
    private JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

    // String hostname of the mail server
    @Value("${spring.mail.host}") 
    private String host_name;

    // Integer port number of the mail server
    @Value("${spring.mail.port}")
    private int port;

    // String password of the account accessing the mail server
    @Value("${spring.mail.password}")
    private String password;

    // String username of the account accessing the mail server
    @Value("${spring.mail.username}")
    private String username;

    /**
     * Initializer for the EmailService class.
     * <p> Sets all the login credentials for the desired mail provider derived from the "application.properties" file
     * @author Tristan Slodowski
     */
    @PostConstruct
    private void mailServiceInit() {
        //showStatus();
        this.mailSender.setHost(this.host_name);                // setting the hostname, port number, password and username to be able to log into the mail service provider
        this.mailSender.setPort(this.port);
        this.mailSender.setPassword(this.password);
        this.mailSender.setUsername(this.username);
        this.mailSender.getJavaMailProperties().put("mail.smtp.starttls.enable", "true");   // activating TLS; some providers explicitly need this to accept connections
    }

    /**
     * Private debugging method to show all the mail provider login credentials.
     * Useful to check if the value injection worked properly.
     * @author Tristan Slodowski
     */
    private void showStatus() {
        System.out.println("[EmailService Init] Setting Hostname: " + this.host_name);
        System.out.println("[EmailService Init] Setting Port: " + this.port);
        System.out.println("[EmailService Init] Setting Password: " + this.password);
        System.out.println("[EmailService Init] Setting Username: " + this.username);
    }

    /**
     * Method to send simple txt.-like messages using Email
     * @param target String of the email address of the recipient
     * @param subject String of the subject the resulting Mail is supposed to have
     * @param body String containing the general message of the Mail to be sent
     * @author Tristan Slodowski
     */
    // simple .txt-like emails can be sent using this method
    public void sendEmail(String target, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(target);                      // "simple filling out" of all needed values from SimpleMailMessage()
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(this.username);


        mailSender.send(message);
    }

    /**
     * Method to send simple txt.-like messages using Email to multiple recipients at once
     * @param targets String array of multiple email addresses of the recipients
     * @param subject String of the subject the resulting mails are supposed to have
     * @param body String containing the general message of the Mails to be sent
     * @author Tristan Slodowski
     */
    // simple .txt-like emails can be sent to multiple recipients at once using this method
    public void sendEmail(String[] targets, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(targets);                                 // by setting a list of email addresses as the target, all of them will receive the mail at once
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(this.username);

        mailSender.send(message);
    }

    /**
     * Method to send more sophisticated mail messages using HTML to form the body
     * @param to String of the mail address of the recipient
     * @param subject String of the subject the resulting mail are supposed to have
     * @param html_body String written in HTML to form the general body of the mail message
     * @throws MessagingException in case of failure if the sending fails
     * @author Tristan Slodowski
     */
    // mails with html-formatted bodies can be sent using this method
    public void sendHtmlMessage(String to, String subject, String html_body) throws MessagingException {
        MimeMessage msg = mailSender.createMimeMessage();

        msg.setFrom(new InternetAddress(this.username));
        msg.setRecipients(MimeMessage.RecipientType.TO, to);
        msg.setSubject(subject);

        msg.setContent(html_body, "text/html; charset=utf-8");  // setting the input html string as the body of the mail and setting the right charset etc.
        mailSender.send(msg);
    }
}