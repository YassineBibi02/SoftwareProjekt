package cyberkraftwerk2.cyberkraftwerk2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;  // uebernimmt die Einstellungen die in JMailSender für die Bean vorgenommen wurden?

    // Senden von "simplen" txt.-ähnlichen Mails
    public void sendEmail(String target, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(target);                      // "simples Ausfuellen" von Feldern von SimpleMailMessage()
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    // Senden von "simplen" txt.-ähnlichen Mails an mehrere Adressen gleichzeitig
    public void sendEmail(String[] targets, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(targets);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    // Senden von Mails basierend auf HTML
    public void sendHtmlMessage(String to, String subject, String html_body) throws MessagingException {
        MimeMessage msg = mailSender.createMimeMessage();

        //msg.setFrom(new InternetAddress(from));               kann weggelassen werden; könnte aber vllt dann von einigen Mailservern gefiltert werden
        msg.setRecipients(MimeMessage.RecipientType.TO, to);
        msg.setSubject(subject);

        msg.setContent(html_body, "text/html; charset=utf-8");

        mailSender.send(msg);
    }

}

/*
 * Attribute des Sender-Servers und der Verbindung werden in der application.properties eingestellt
 */
