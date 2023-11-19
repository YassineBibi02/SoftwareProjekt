package SWP.Cyberkraftwerk2.Mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Class accessing the JavaMail and JakartaMail packages to send Emails
 * @author Tristan Slodowski
 * @version 19.11.2023
 */
@Service
public class EmailService {
    
    // default JavaMailSender to manage sending SimpleMailMessages or MimeMessages
    @Autowired
    private JavaMailSender mailSender;  // uebernimmt die Einstellungen die in JMailSender für die Bean vorgenommen wurden?

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

        //msg.setFrom(new InternetAddress(from));               kann weggelassen werden; könnte aber vllt dann von einigen Mailservern gefiltert werden
        msg.setRecipients(MimeMessage.RecipientType.TO, to);
        msg.setSubject(subject);

        msg.setContent(html_body, "text/html; charset=utf-8");  // html-String als Inhalt der Message und dementsprechend den passenden Mime-Typ einstellen

        mailSender.send(msg);
    }

}

/*
 * Attribute des Sender-Servers und der Verbindung werden in der application.properties eingestellt
 */
