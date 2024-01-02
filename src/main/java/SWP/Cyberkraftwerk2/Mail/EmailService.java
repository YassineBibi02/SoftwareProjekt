package SWP.Cyberkraftwerk2.Mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

/**
 * Class accessing the JavaMail and JakartaMail packages to send Emails
 * @author Tristan Slodowski
 * @version 02.01.2024
 */
@Configuration
@PropertySource("classpath:application.properties")
@Service
@RestController
public class EmailService {
    
    // default JavaMailSender to manage sending SimpleMailMessages or MimeMessages
    @Autowired
    private JavaMailSenderImpl mailSender;

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
     * Default constructor of the EmailService class.
     * <p> Derives all needed values from the respecting entries in the application.properties file.
     * @author Tristan Slodowski
     */
    public EmailService() {
        this.mailSender = new JavaMailSenderImpl();             // Standard Implementation des JavaMailSenders; erfuellt unsere Zwecke ausreichend
        this.mailSender.setHost(this.host_name);
        this.mailSender.setPort(this.port);
        this.mailSender.setPassword(this.password);
        this.mailSender.setUsername(this.username);
        this.mailSender.getJavaMailProperties().put("mail.smtp.starttls.enable", "true");   // TLS aktivieren; fuer manche Dienste fest benoetigt

        this.mailSender.getJavaMailProperties().put("mail.debug","true");       // TODO Debugging-Option: deaktivieren wenn nicht mehr benötigt!

        /*
        try {                                                   // TODO testConnection() behalten oder entfernen? (fuer debugging vllt noch hilfreich)
            mailSender.testConnection();
        }
        catch (MessagingException m) {
            System.out.println("MessagingException: " + m.toString());
        }
        */
    }
    /**
     * Method to send simple txt.-like messages using Email
     * @param target String of the email address of the recipient
     * @param subject String of the subject the resulting Mail is supposed to have
     * @param body String containing the general message of the Mail to be sent
     * @author Tristan Slodowski
     */
    // Senden von "simplen" txt.-ähnlichen Mails
    public void sendEmail(String target, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(target);                      // "simples Ausfuellen" von Feldern von SimpleMailMessage()
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("cyber.kraftwerk2@outlook.com");        // TODO Herkunftsadresse aendern je nachdem von wo am Ende gesendet werden soll


        mailSender.send(message);
    }

    /**
     * Method to send simple txt.-like messages using Email to multiple recipients at once
     * @param targets String array of multiple email addresses of the recipients
     * @param subject String of the subject the resulting mails are supposed to have
     * @param body String containing the general message of the Mails to be sent
     * @author Tristan Slodowski
     */
    // Senden von "simplen" txt.-ähnlichen Mails an mehrere Adressen gleichzeitig
    public void sendEmail(String[] targets, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(targets);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("cyber.kraftwerk2@outlook.com");        // TODO Herkunftsadresse aendern je nachdem von wo am Ende gesendet werden soll

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
    // Senden von Mails basierend auf HTML
    public void sendHtmlMessage(String to, String subject, String html_body) throws MessagingException {
        MimeMessage msg = mailSender.createMimeMessage();

        msg.setFrom(new InternetAddress("cyber.kraftwerk2@outlook.com"));   // TODO Herkunftsadresse aendern je nachdem von wo gesendet werden soll
        msg.setRecipients(MimeMessage.RecipientType.TO, to);
        msg.setSubject(subject);

        msg.setContent(html_body, "text/html; charset=utf-8");  // html-String als Inhalt der Message und dementsprechend den passenden Mime-Typ einstellen

        mailSender.send(msg);
    }

}